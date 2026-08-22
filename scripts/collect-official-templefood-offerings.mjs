import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { canonicalContract } from "./transform-official-templefood-offering-canonical-dry-run.mjs";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const venuePath = path.join(
    repositoryRoot,
    "data/temples/staging/official-templefood-venues-2026-08-21.json",
);
const rawOutputPath = path.join(
    repositoryRoot,
    "data/temples/staging/official-templefood-offerings-raw-snapshot-2026-08-21.json",
);
const normalizedOutputPath = path.join(
    repositoryRoot,
    "data/temples/staging/official-templefood-offerings-normalized-snapshot-2026-08-21.json",
);
const reconciliationOutputPath = path.join(
    repositoryRoot,
    "data/temples/staging/official-templefood-offerings-reconciliation-2026-08-21.json",
);

const SOURCE = "korean-temple-food";
const BASE_URL = "https://www.koreatemplefood.com";
const SHORT_LIST_URL = `${BASE_URL}/program/experience/short-experience/list`;
const REGULAR_LIST_URL = `${BASE_URL}/program/course/regular-course/list`;
const GROUP_LIST_URL = `${BASE_URL}/program/experience/group-experience/list`;
const REQUEST_HEADERS = {
    "user-agent": "Yeon-TempleFood-Collector/1.0 (+canonical-staging)",
    accept: "text/html,application/xhtml+xml",
};

const FAMILY_CONFIG = {
    shortExperience: {
        listUrl: SHORT_LIST_URL,
        dataKey: "SHORT_EXPERIENCE_LIST",
        totalKey: "TOTAL_COUNT",
        identityField: "SHORT_EXPERIENCE_SEQ",
        pageSize: 6,
    },
    regularCourseRun: {
        listUrl: REGULAR_LIST_URL,
        dataKey: "REGULAR_COURSE_LIST",
        totalKey: "TOTAL_COUNT",
        identityField: "REGULAR_COURSE_SCHEDULE_SEQ",
        pageSize: 4,
    },
};

function now() {
    return new Date().toISOString();
}

function compactObject(value) {
    return Object.fromEntries(
        Object.entries(value).filter(([, fieldValue]) => fieldValue !== undefined),
    );
}

function asString(value) {
    return value === undefined || value === null ? undefined : String(value);
}

function pick(source, names) {
    for (const name of names) {
        if (source?.[name] !== undefined && source[name] !== null) {
            return source[name];
        }
    }
    return undefined;
}

function wait(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function fetchResponse(url, options = {}, attempts = 3) {
    let lastError;
    for (let attempt = 1; attempt <= attempts; attempt += 1) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 20_000);
        try {
            const response = await fetch(url, {
                ...options,
                headers: { ...REQUEST_HEADERS, ...options.headers },
                signal: controller.signal,
            });
            if ((response.status === 429 || response.status >= 500) && attempt < attempts) {
                await response.body?.cancel();
                await wait(300 * 2 ** (attempt - 1));
                continue;
            }
            return response;
        } catch (error) {
            lastError = error;
            if (attempt < attempts) {
                await wait(300 * 2 ** (attempt - 1));
            }
        } finally {
            clearTimeout(timeout);
        }
    }
    throw lastError ?? new Error(`Failed to fetch ${url}`);
}

async function fetchHtml(url, options = {}) {
    const response = await fetchResponse(url, options);
    if (!response.ok) {
        await response.body?.cancel();
        throw new Error(`${url}: HTTP ${response.status}`);
    }
    return response.text();
}

function extractNuxtPayload(html, url) {
    const match = html.match(/window\.__NUXT__=(.*?);<\/script>/s);
    if (!match) {
        throw new Error(`${url}: Nuxt SSR payload not found`);
    }
    const context = Object.create(null);
    vm.runInNewContext(`result=${match[1]}`, context, { timeout: 1_000 });
    return context.result;
}

async function fetchNuxtPayload(url) {
    return extractNuxtPayload(await fetchHtml(url), url);
}

async function mapConcurrent(items, concurrency, mapper) {
    const results = new Array(items.length);
    let nextIndex = 0;
    async function worker() {
        while (nextIndex < items.length) {
            const index = nextIndex;
            nextIndex += 1;
            results[index] = await mapper(items[index], index);
        }
    }
    await Promise.all(
        Array.from({ length: Math.min(concurrency, items.length) }, worker),
    );
    return results;
}

function buildPageUrl(family, page) {
    const config = FAMILY_CONFIG[family];
    const url = new URL(config.listUrl);
    if (family === "shortExperience") {
        url.searchParams.set("listType", "list");
    }
    url.searchParams.set("page", String(page));
    return url.toString();
}

async function fetchFamilyPage(family, page) {
    const config = FAMILY_CONFIG[family];
    const url = buildPageUrl(family, page);
    const fetchedAt = now();
    const payload = await fetchNuxtPayload(url);
    const data = payload.data?.[0] ?? {};
    const rows = data[config.dataKey];
    if (!Array.isArray(rows)) {
        throw new Error(`${family} page ${page}: ${config.dataKey} missing`);
    }
    return {
        page,
        url,
        fetchedAt,
        reportedTotal: Number(data[config.totalKey]),
        rows,
    };
}

function summarizePagination(family, pages) {
    const config = FAMILY_CONFIG[family];
    const rawRows = pages.flatMap((page) =>
        page.rows.map((sourceRow) => ({
            page: page.page,
            fetchedAt: page.fetchedAt,
            reportedTotal: page.reportedTotal,
            sourceId: asString(sourceRow[config.identityField]),
            sourceRow,
        })),
    );
    const occurrences = new Map();
    for (const row of rawRows) {
        if (!occurrences.has(row.sourceId)) {
            occurrences.set(row.sourceId, []);
        }
        occurrences.get(row.sourceId).push(row);
    }
    const duplicates = [...occurrences.entries()]
        .filter(([, rows]) => rows.length > 1)
        .map(([sourceId, rows]) => ({
            sourceId,
            pages: rows.map((row) => row.page),
            occurrences: rows.length,
            sourceRowsDiffer:
                new Set(rows.map((row) => JSON.stringify(row.sourceRow))).size > 1,
        }));
    const totals = [...new Set(pages.map((page) => page.reportedTotal))];
    const issues = [];
    if (totals.length > 1) {
        issues.push({
            code: "sourceTotalChangedDuringCollection",
            severity: "warning",
            family,
            observedTotals: totals,
        });
    }
    for (const duplicate of duplicates.filter((item) => item.sourceRowsDiffer)) {
        issues.push({
            code: "duplicateIdentityPayloadChanged",
            severity: "high",
            family,
            sourceId: duplicate.sourceId,
            pages: duplicate.pages,
        });
    }
    return {
        rawRows,
        occurrences,
        duplicates,
        totals,
        issues,
    };
}

async function collectPaginatedFamily(family) {
    const config = FAMILY_CONFIG[family];
    const firstPage = await fetchFamilyPage(family, 1);
    let targetPageCount = Math.max(
        1,
        Math.ceil(firstPage.reportedTotal / config.pageSize),
    );
    const pages = [firstPage];
    let nextPage = 2;

    for (let expansion = 0; expansion < 4; expansion += 1) {
        const pageNumbers = [];
        while (nextPage <= targetPageCount) {
            pageNumbers.push(nextPage);
            nextPage += 1;
        }
        pages.push(
            ...(await mapConcurrent(pageNumbers, 8, (page) =>
                fetchFamilyPage(family, page),
            )),
        );
        pages.sort((left, right) => left.page - right.page);
        const maximumTotal = Math.max(...pages.map((page) => page.reportedTotal));
        const expandedPageCount = Math.ceil(maximumTotal / config.pageSize);
        if (expandedPageCount <= targetPageCount) {
            break;
        }
        targetPageCount = expandedPageCount;
    }

    const summary = summarizePagination(family, pages);
    return {
        family,
        startedAt: firstPage.fetchedAt,
        finishedAt: now(),
        sourceTotals: summary.totals,
        pages: pages.map((page) => ({
            page: page.page,
            url: page.url,
            fetchedAt: page.fetchedAt,
            reportedTotal: page.reportedTotal,
            rowCount: page.rows.length,
            sourceIds: page.rows.map((row) =>
                asString(row[config.identityField]),
            ),
        })),
        rawRows: summary.rawRows,
        duplicateEncounters: summary.duplicates,
        collectionIssues: summary.issues,
    };
}

function findGroupRows(data) {
    const preferredKeys = [
        "GROUP_EXPERIENCE_LIST",
        "GROUP_EXPERIENCE_LIST_OBJ",
        "GROUP_EXPERIENCE_LIST_DATA",
    ];
    for (const key of preferredKeys) {
        if (Array.isArray(data[key])) {
            return data[key];
        }
    }
    return Object.entries(data).find(
        ([key, value]) =>
            key.includes("GROUP_EXPERIENCE") && Array.isArray(value),
    )?.[1];
}

async function collectGroupFamily() {
    const startedAt = now();
    const payload = await fetchNuxtPayload(GROUP_LIST_URL);
    const fetchedAt = now();
    const rows = findGroupRows(payload.data?.[0] ?? {});
    if (!Array.isArray(rows)) {
        throw new Error("groupExperience: official list rows missing");
    }
    return {
        family: "groupExperience",
        startedAt,
        finishedAt: now(),
        sourceTotals: [rows.length],
        pages: [
            {
                page: 1,
                url: GROUP_LIST_URL,
                fetchedAt,
                reportedTotal: rows.length,
                rowCount: rows.length,
                sourceIds: rows.map((row) =>
                    asString(row.GROUP_EXPERIENCE_SEQ),
                ),
            },
        ],
        rawRows: rows.map((sourceRow) => ({
            page: 1,
            fetchedAt,
            reportedTotal: rows.length,
            sourceId: asString(sourceRow.GROUP_EXPERIENCE_SEQ),
            sourceRow,
        })),
        duplicateEncounters: [],
        collectionIssues: [],
    };
}

async function collectIdentityPass(label) {
    const collectionStartedAt = now();
    const [shortExperience, regularCourseRun, groupExperience] =
        await Promise.all([
            collectPaginatedFamily("shortExperience"),
            collectPaginatedFamily("regularCourseRun"),
            collectGroupFamily(),
        ]);
    const families = { shortExperience, regularCourseRun, groupExperience };
    return {
        label,
        collectionStartedAt,
        collectionFinishedAt: now(),
        families,
        identitySets: Object.fromEntries(
            Object.entries(families).map(([family, snapshot]) => [
                family,
                [...new Set(snapshot.rawRows.map((row) => row.sourceId))].sort(),
            ]),
        ),
    };
}

function comparePasses(firstPass, secondPass) {
    return Object.fromEntries(
        Object.keys(secondPass.identitySets).map((family) => {
            const first = new Set(firstPass.identitySets[family]);
            const second = new Set(secondPass.identitySets[family]);
            return [
                family,
                {
                    firstUnique: first.size,
                    secondUnique: second.size,
                    common: [...first].filter((id) => second.has(id)).length,
                    firstOnly: [...first].filter((id) => !second.has(id)),
                    secondOnly: [...second].filter((id) => !first.has(id)),
                },
            ];
        }),
    );
}

function reconcilePasses(firstPass, secondPass) {
    const reconciliationByFamily = {};
    const families = {};
    for (const family of Object.keys(secondPass.families)) {
        const secondIds = new Set(secondPass.identitySets[family]);
        const recoveredRows = firstPass.families[family].rawRows.filter(
            (row) => !secondIds.has(row.sourceId),
        );
        const combinedRows = [
            ...secondPass.families[family].rawRows.map((row) => ({
                ...row,
                collectionPass: "B",
            })),
            ...recoveredRows.map((row) => ({
                ...row,
                collectionPass: "A",
            })),
        ];
        const occurrences = new Map();
        for (const row of combinedRows) {
            if (!occurrences.has(row.sourceId)) occurrences.set(row.sourceId, []);
            occurrences.get(row.sourceId).push(row);
        }
        const duplicateEncounters = [...occurrences.entries()]
            .filter(([, rows]) => rows.length > 1)
            .map(([sourceId, rows]) => ({
                sourceId,
                pages: rows.map((row) => row.page),
                occurrences: rows.length,
                sourceRowsDiffer:
                    new Set(rows.map((row) => JSON.stringify(row.sourceRow))).size > 1,
            }));
        reconciliationByFamily[family] = {
            strategy: "prefer-second-pass-and-recover-first-only-identities",
            recoveredFromFirstPass: [
                ...new Set(recoveredRows.map((row) => row.sourceId)),
            ],
            reconciledUnique: occurrences.size,
        };
        families[family] = {
            ...secondPass.families[family],
            sourceTotals: [
                ...new Set([
                    ...firstPass.families[family].sourceTotals,
                    ...secondPass.families[family].sourceTotals,
                ]),
            ],
            rawRows: combinedRows,
            duplicateEncounters,
            collectionIssues: [
                ...firstPass.families[family].collectionIssues,
                ...secondPass.families[family].collectionIssues,
            ],
        };
    }
    return {
        label: "reconciled-two-pass",
        collectionStartedAt: firstPass.collectionStartedAt,
        collectionFinishedAt: secondPass.collectionFinishedAt,
        reconciliationByFamily,
        families,
    };
}

function createRegularOnlyPass(label, regularCourseRun) {
    return {
        label,
        collectionStartedAt: regularCourseRun.startedAt,
        collectionFinishedAt: regularCourseRun.finishedAt,
        families: { regularCourseRun },
        identitySets: {
            regularCourseRun: [
                ...new Set(regularCourseRun.rawRows.map((row) => row.sourceId)),
            ].sort(),
        },
    };
}

function summarizeRegularReconciliationPass(pass, previousIds, cumulativeIds) {
    const snapshot = pass.families.regularCourseRun;
    const ids = snapshot.rawRows.map((row) => row.sourceId);
    const uniqueIds = new Set(ids);
    const newToUnion = [...uniqueIds].filter((id) => !cumulativeIds.has(id));
    const missingFromPrevious = [...previousIds].filter((id) => !uniqueIds.has(id));
    for (const id of newToUnion) cumulativeIds.add(id);
    return {
        label: pass.label,
        sourceTotals: snapshot.sourceTotals,
        rawRowCount: ids.length,
        uniqueScheduleCount: uniqueIds.size,
        duplicateOccurrenceCount: ids.length - uniqueIds.size,
        duplicateIdentities: snapshot.duplicateEncounters,
        newToUnionIdentityCount: newToUnion.length,
        newToUnionIdentities: newToUnion.sort(),
        missingFromPreviousIdentities: missingFromPrevious.sort(),
        cumulativeUniqueScheduleCount: cumulativeIds.size,
    };
}

function reconcileRegularCoursePasses(passes, passSummaries) {
    const snapshots = passes.map((pass) => ({
        label: pass.label,
        snapshot: pass.families.regularCourseRun,
    }));
    const latest = snapshots.at(-1);
    const combinedRows = latest.snapshot.rawRows.map((row) => ({
        ...row,
        collectionPass: latest.label,
    }));
    const seenIds = new Set(combinedRows.map((row) => row.sourceId));
    const recoveredByPass = {};

    for (const { label, snapshot } of snapshots.slice(0, -1).reverse()) {
        const missingIds = new Set(
            snapshot.rawRows
                .map((row) => row.sourceId)
                .filter((sourceId) => !seenIds.has(sourceId)),
        );
        if (missingIds.size === 0) continue;
        recoveredByPass[label] = [...missingIds].sort();
        combinedRows.push(
            ...snapshot.rawRows
                .filter((row) => missingIds.has(row.sourceId))
                .map((row) => ({ ...row, collectionPass: label })),
        );
        for (const sourceId of missingIds) seenIds.add(sourceId);
    }

    const occurrences = new Map();
    for (const row of combinedRows) {
        if (!occurrences.has(row.sourceId)) occurrences.set(row.sourceId, []);
        occurrences.get(row.sourceId).push(row);
    }
    const duplicateEncounters = [...occurrences.entries()]
        .filter(([, rows]) => rows.length > 1)
        .map(([sourceId, rows]) => ({
            sourceId,
            pages: rows.map((row) => row.page),
            occurrences: rows.length,
            sourceRowsDiffer:
                new Set(rows.map((row) => JSON.stringify(row.sourceRow))).size > 1,
        }));

    return {
        reconciliation: {
            strategy:
                "prefer-latest-pass-and-recover-missing-identities-from-earlier-passes",
            passCount: passes.length,
            passSummaries,
            recoveredByPass,
            reconciledUnique: occurrences.size,
        },
        family: {
            ...latest.snapshot,
            sourceTotals: [
                ...new Set(snapshots.flatMap(({ snapshot }) => snapshot.sourceTotals)),
            ],
            rawRows: combinedRows,
            duplicateEncounters,
            collectionIssues: snapshots.flatMap(
                ({ snapshot }) => snapshot.collectionIssues,
            ),
        },
    };
}

async function collectRegularCourseReconciliation(firstPass, secondPass) {
    const passes = [firstPass, secondPass];
    const passSummaries = [];
    const cumulativeIds = new Set();
    let previousIds = new Set();
    let consecutivePassesWithoutNewIdentity = 0;

    for (const pass of passes) {
        const summary = summarizeRegularReconciliationPass(
            pass,
            previousIds,
            cumulativeIds,
        );
        passSummaries.push(summary);
        consecutivePassesWithoutNewIdentity =
            summary.newToUnionIdentityCount === 0
                ? consecutivePassesWithoutNewIdentity + 1
                : 0;
        previousIds = new Set(pass.identitySets.regularCourseRun);
    }

    while (passes.length < 10 && consecutivePassesWithoutNewIdentity < 3) {
        const label = `R${passes.length + 1}`;
        const pass = createRegularOnlyPass(
            label,
            await collectPaginatedFamily("regularCourseRun"),
        );
        passes.push(pass);
        const summary = summarizeRegularReconciliationPass(
            pass,
            previousIds,
            cumulativeIds,
        );
        passSummaries.push(summary);
        consecutivePassesWithoutNewIdentity =
            summary.newToUnionIdentityCount === 0
                ? consecutivePassesWithoutNewIdentity + 1
                : 0;
        previousIds = new Set(pass.identitySets.regularCourseRun);
    }

    const reconciled = reconcileRegularCoursePasses(passes, passSummaries);
    return {
        passes,
        passSummaries,
        cumulativeUniqueScheduleCount: cumulativeIds.size,
        consecutivePassesWithoutNewIdentity,
        stableUnionCandidate: consecutivePassesWithoutNewIdentity >= 3,
        stopReason:
            consecutivePassesWithoutNewIdentity >= 3
                ? "three-consecutive-passes-without-new-identity"
                : "maximum-ten-passes-reached",
        ...reconciled,
    };
}

function selectedOccurrences(familySnapshot) {
    const occurrences = new Map();
    for (const row of familySnapshot.rawRows) {
        if (!occurrences.has(row.sourceId)) {
            occurrences.set(row.sourceId, []);
        }
        occurrences.get(row.sourceId).push(row);
    }
    return [...occurrences.entries()].map(([sourceId, rows]) => ({
        sourceId,
        occurrences: rows,
        selected: rows.at(-1),
    }));
}

function detailUrlFor(family, sourceId) {
    switch (family) {
        case "shortExperience":
            return `${BASE_URL}/program/experience/short-experience/detail/${sourceId}`;
        case "regularCourseRun":
            return `${BASE_URL}/program/course/regular-course/detail/${sourceId}`;
        default:
            return undefined;
    }
}

function applicationUrlFor(family, sourceId) {
    switch (family) {
        case "shortExperience":
            return `${BASE_URL}/program/experience/short-experience/form/${sourceId}`;
        case "regularCourseRun":
            return `${BASE_URL}/program/course/regular-course/form/${sourceId}`;
        case "groupExperience":
            return `${BASE_URL}/program/experience/group-experience/form/${sourceId}`;
        default:
            return undefined;
    }
}

function classifyRedirect(location) {
    if (!location) {
        return "other";
    }
    const target = new URL(location, BASE_URL);
    if (target.pathname === "/") {
        return "home";
    }
    if (target.pathname.endsWith("/list")) {
        return "list";
    }
    return "other";
}

async function inspectDetail(family, sourceId) {
    const url = detailUrlFor(family, sourceId);
    const checkedAt = now();
    try {
        let response = await fetchResponse(
            url,
            { method: "HEAD", redirect: "manual" },
            2,
        );
        if (response.status === 405) {
            await response.body?.cancel();
            response = await fetchResponse(url, { redirect: "manual" }, 2);
        }
        const location = response.headers.get("location");
        const statusCode = response.status;
        await response.body?.cancel();
        if (statusCode >= 300 && statusCode < 400) {
            return {
                family,
                sourceId,
                checkedAt,
                status: "redirected",
                redirectTarget: classifyRedirect(location),
                statusCode,
                location: location ? new URL(location, BASE_URL).toString() : undefined,
                lastKnownOfficialDetailUrl: url,
            };
        }
        if (statusCode >= 200 && statusCode < 300) {
            return {
                family,
                sourceId,
                checkedAt,
                status: "available",
                statusCode,
                officialDetailUrl: url,
            };
        }
        return {
            family,
            sourceId,
            checkedAt,
            status: "unavailable",
            statusCode,
            lastKnownOfficialDetailUrl: url,
        };
    } catch (error) {
        return {
            family,
            sourceId,
            checkedAt,
            status: "unavailable",
            error: error instanceof Error ? error.message : String(error),
            lastKnownOfficialDetailUrl: url,
        };
    }
}

async function fetchAvailableDetail(inspection) {
    if (inspection.status !== "available") {
        return inspection;
    }
    try {
        const payload = await fetchNuxtPayload(inspection.officialDetailUrl);
        const data = payload.data?.[0] ?? {};
        if (inspection.family === "shortExperience") {
            return {
                ...inspection,
                sourceDetail: {
                    detail: data.SHORT_EXPERIENCE_DETAIL_OBJ,
                    sessions: data.SCHEDULE_LIST,
                },
            };
        }
        return {
            ...inspection,
            sourceDetail: {
                detail: data.REGULAR_COURSE_DETAIL_OBJ,
                dates: data.DATE_LIST,
            },
        };
    } catch (error) {
        return {
            ...inspection,
            detailPayloadError:
                error instanceof Error ? error.message : String(error),
        };
    }
}

async function inspectFinalDetails(finalPass) {
    const targets = ["shortExperience", "regularCourseRun"].flatMap((family) =>
        selectedOccurrences(finalPass.families[family]).map(({ sourceId }) => ({
            family,
            sourceId,
        })),
    );
    const inspections = await mapConcurrent(targets, 12, ({ family, sourceId }) =>
        inspectDetail(family, sourceId),
    );
    return mapConcurrent(inspections, 6, fetchAvailableDetail);
}

function normalizeName(value) {
    return String(value ?? "")
        .replace(/[\[\]()]/g, "")
        .replace(/\s+/g, "")
        .toLowerCase();
}

function createVenueResolver(venueStaging) {
    const byOfficialId = new Map();
    const byName = new Map();
    for (const venue of venueStaging.records) {
        if (venue.officialId) {
            if (!byOfficialId.has(String(venue.officialId))) {
                byOfficialId.set(String(venue.officialId), []);
            }
            byOfficialId.get(String(venue.officialId)).push(venue);
        }
        for (const name of [venue.officialName, venue.sourceDisplayName]) {
            if (!name) continue;
            const normalized = normalizeName(name);
            if (!byName.has(normalized)) byName.set(normalized, []);
            if (!byName.get(normalized).includes(venue)) {
                byName.get(normalized).push(venue);
            }
        }
    }
    return (sourceOfficialId, sourceName) => {
        const idMatches = sourceOfficialId
            ? byOfficialId.get(String(sourceOfficialId)) ?? []
            : [];
        const nameMatches = byName.get(normalizeName(sourceName)) ?? [];
        const matches = idMatches.length > 0 ? idMatches : nameMatches;
        if (matches.length === 1) {
            return {
                status: "matched",
                venueOfficialId: matches[0].officialId,
                sourceVenueName: sourceName,
            };
        }
        return {
            status: matches.length > 1 ? "ambiguous" : "unmatched",
            sourceVenueOfficialId: asString(sourceOfficialId),
            sourceVenueName: sourceName,
            candidateVenueOfficialIds: matches
                .map((venue) => venue.officialId)
                .filter(Boolean),
        };
    };
}

function buildDetailFields(inspection) {
    if (!inspection) {
        return { detailStatus: "unavailable" };
    }
    if (inspection.status === "available") {
        return {
            detailStatus: "available",
            officialDetailUrl: inspection.officialDetailUrl,
        };
    }
    if (inspection.status === "redirected") {
        return {
            detailStatus: "redirected",
            redirectTarget: inspection.redirectTarget,
            lastKnownOfficialDetailUrl: inspection.lastKnownOfficialDetailUrl,
        };
    }
    return compactObject({
        detailStatus: "unavailable",
        lastKnownOfficialDetailUrl: inspection.lastKnownOfficialDetailUrl,
    });
}

function buildCommon({ family, selected, occurrences, row, inspection, venueRelation }) {
    const detailFields = buildDetailFields(inspection);
    return {
        source: SOURCE,
        subtype: family,
        officialName: pick(row, ["TITLE", "COURSE_NAME", "GROUP_EXPERIENCE_NAME"]),
        sourceDisplayName: pick(row, ["TITLE", "COURSE_NAME", "GROUP_EXPERIENCE_NAME"]),
        venueRelation,
        checkedAt: inspection?.checkedAt ?? selected.fetchedAt,
        lastSeenAt: selected.fetchedAt,
        sourceProvenance: {
            rawSnapshotFile: path.basename(rawOutputPath),
            listUrl: selected.page === 1 && family === "groupExperience"
                ? GROUP_LIST_URL
                : selectedOccurrencesUrl(family, selected.page),
            pageOccurrences: occurrences.map((occurrence) => occurrence.page),
            collectionPasses: [
                ...new Set(
                    occurrences
                        .map((occurrence) => occurrence.collectionPass)
                        .filter(Boolean),
                ),
            ],
            sourceFields: Object.keys(row).sort(),
        },
        ...detailFields,
    };
}

function selectedOccurrencesUrl(family, page) {
    return family === "groupExperience" ? GROUP_LIST_URL : buildPageUrl(family, page);
}

function identityConflictIssues(family, sourceId, occurrences) {
    if (new Set(occurrences.map((item) => JSON.stringify(item.sourceRow))).size <= 1) {
        return [];
    }
    return [
        {
            code: "identityConflict",
            severity: "high",
            detail: `${family} ${sourceId} returned different row payloads across pages ${occurrences.map((item) => item.page).join(", ")}`,
        },
    ];
}

function titleScheduleIssues(title, startTime) {
    const hour = Number(/^\d{2}/.exec(startTime ?? "")?.[0]);
    if (!Number.isFinite(hour)) return [];
    if ((title?.includes("오전") && hour >= 12) || (title?.includes("오후") && hour < 12)) {
        return [
            {
                code: "titleScheduleConflict",
                severity: "warning",
                detail: `Source title and startTime ${startTime} disagree`,
            },
        ];
    }
    return [];
}

function statusScopeIssues(statusText, capacity, applied) {
    if (
        typeof statusText === "string" &&
        statusText.includes("모집") &&
        statusText.includes("중") &&
        Number.isFinite(Number(capacity)) &&
        Number(capacity) > 0 &&
        Number(applied) >= Number(capacity)
    ) {
        return [
            {
                code: "statusScopeConflict",
                severity: "warning",
                detail: "Source says recruiting while applied count has reached capacity; availability is not inferred",
            },
        ];
    }
    return [];
}

function mergeShortSessions(occurrences, inspection) {
    const sessions = new Map();
    for (const occurrence of occurrences) {
        for (const session of occurrence.sourceRow.SCHEDULE_LIST ?? []) {
            sessions.set(asString(session.SHORT_EXPERIENCE_SCHEDULE_SEQ), session);
        }
    }
    for (const session of inspection?.sourceDetail?.sessions ?? []) {
        sessions.set(asString(session.SHORT_EXPERIENCE_SCHEDULE_SEQ), session);
    }
    return [...sessions.values()];
}

function buildShortSnapshot(row, sessions, checkedAt) {
    const sessionSnapshots = sessions
        .map((session) =>
            compactObject({
                sessionKey: `${SOURCE}:short-experience-session:${session.SHORT_EXPERIENCE_SCHEDULE_SEQ}`,
                appliedCount: session.APPLY_COUNT,
                pendingCount: session.PENDING_COUNT,
                waitingCount: session.WAITING_COUNT,
            }),
        )
        .filter((session) => Object.keys(session).length > 1);
    const status = row.APPLICATION_STATUS_TXT;
    if (!status && sessionSnapshots.length === 0) return undefined;
    return compactObject({
        checkedAt,
        sourceApplicationStatusText: status,
        sessions: sessionSnapshots.length > 0 ? sessionSnapshots : undefined,
    });
}

function normalizeShort(entry, inspection, resolveVenue) {
    const { sourceId, selected, occurrences } = entry;
    const row = selected.sourceRow;
    const detail = inspection?.sourceDetail?.detail;
    const sourceSessions = mergeShortSessions(occurrences, inspection);
    const venueId = pick(detail ?? row, ["INSTITUTION_SEQ"]);
    const venueName = pick(detail ?? row, ["INSTITUTION_NAME"]);
    const venueRelation = resolveVenue(venueId, venueName);
    const issues = [
        ...identityConflictIssues("shortExperience", sourceId, occurrences),
        ...titleScheduleIssues(row.TITLE, sourceSessions[0]?.START_TIME),
        ...sourceSessions.flatMap((session) =>
            statusScopeIssues(
                row.APPLICATION_STATUS_TXT,
                session.CAPACITY_COUNT,
                session.APPLY_COUNT,
            ),
        ),
    ];
    if (venueRelation.status !== "matched") {
        issues.push({
            code: "venueConflict",
            severity: "high",
            detail: `Venue relation is ${venueRelation.status}`,
        });
    }
    const common = buildCommon({
        family: "shortExperience",
        selected,
        occurrences,
        row,
        inspection,
        venueRelation,
    });
    return compactObject({
        ...common,
        canonicalKey: `${SOURCE}:short-experience:${sourceId}`,
        shortExperienceSeq: sourceId,
        price:
            detail?.EXPERIENCE_FEE === undefined
                ? undefined
                : {
                      currency: "KRW",
                      chargeBasis: "person",
                      amount: detail.EXPERIENCE_FEE,
                  },
        applicationPeriodSource: compactObject({
            startDate: row.APPLICATION_START_DATE,
            startTime: row.APPLICATION_START_TIME,
            endDate: row.APPLICATION_END_DATE,
            endTime: row.APPLICATION_END_TIME,
        }),
        currentActionUrl:
            common.detailStatus === "available"
                ? applicationUrlFor("shortExperience", sourceId)
                : undefined,
        sessions: sourceSessions.map((session) =>
            compactObject({
                canonicalKey: `${SOURCE}:short-experience-session:${session.SHORT_EXPERIENCE_SCHEDULE_SEQ}`,
                shortExperienceScheduleSeq: asString(
                    session.SHORT_EXPERIENCE_SCHEDULE_SEQ,
                ),
                date: session.EXPERIENCE_DATE,
                startTime: session.START_TIME,
                endTime: session.END_TIME,
                menu: session.MENU,
                capacity: session.CAPACITY_COUNT,
            }),
        ),
        snapshot: buildShortSnapshot(
            row,
            sourceSessions,
            inspection?.checkedAt ?? selected.fetchedAt,
        ),
        validationIssues: issues.length > 0 ? issues : undefined,
    });
}

function normalizeRegular(entry, inspection, resolveVenue) {
    const { sourceId, selected, occurrences } = entry;
    const row = selected.sourceRow;
    const detail = inspection?.sourceDetail?.detail;
    const venueId = pick(detail ?? row, ["INSTITUTION_SEQ"]);
    const venueName = pick(detail ?? row, ["INSTITUTION_NAME"]);
    const venueRelation = resolveVenue(venueId, venueName);
    const issues = [
        ...identityConflictIssues("regularCourseRun", sourceId, occurrences),
        ...titleScheduleIssues(row.COURSE_NAME, row.START_TIME),
        ...statusScopeIssues(
            row.APPLICATION_STATUS_TXT,
            row.CAPACITY_COUNT,
            row.APPLY_COUNT,
        ),
    ];
    if (
        detail?.COURSE_FEE !== undefined &&
        row.COURSE_FEE !== undefined &&
        detail.COURSE_FEE !== row.COURSE_FEE
    ) {
        issues.push({
            code: "priceConflict",
            severity: "warning",
            detail: `List fee ${row.COURSE_FEE} differs from detail fee ${detail.COURSE_FEE}`,
        });
    }
    if (venueRelation.status !== "matched") {
        issues.push({
            code: "venueConflict",
            severity: "high",
            detail: `Venue relation is ${venueRelation.status}`,
        });
    }
    const common = buildCommon({
        family: "regularCourseRun",
        selected,
        occurrences,
        row,
        inspection,
        venueRelation,
    });
    return compactObject({
        ...common,
        canonicalKey: `${SOURCE}:regular-course-run:${sourceId}`,
        regularCourseScheduleSeq: sourceId,
        regularCourseSeq: asString(row.REGULAR_COURSE_SEQ),
        schedule: compactObject({
            startDateSource: row.COURSE_START_DATE,
            endDateSource: row.COURSE_END_DATE,
            startTime: row.START_TIME,
            endTime: row.END_TIME,
            weekCount: row.WEEK_COUNT,
        }),
        capacity: row.CAPACITY_COUNT,
        price:
            row.COURSE_FEE === undefined
                ? undefined
                : {
                      currency: "KRW",
                      chargeBasis: "course",
                      amount: row.COURSE_FEE,
                  },
        applicationPeriodSource: compactObject({
            start: row.APPLICATION_START_DT,
            end: row.APPLICATION_END_DT,
        }),
        currentActionUrl:
            common.detailStatus === "available"
                ? applicationUrlFor("regularCourseRun", sourceId)
                : undefined,
        snapshot: compactObject({
            checkedAt: inspection?.checkedAt ?? selected.fetchedAt,
            sourceApplicationStatusText: row.APPLICATION_STATUS_TXT,
            appliedCount: row.APPLY_COUNT,
        }),
        validationIssues: issues.length > 0 ? issues : undefined,
    });
}

function parseDurationMinutes(value) {
    const hourMatch = /(\d+)\s*시간/.exec(String(value ?? ""));
    const minuteMatch = /(\d+)\s*분/.exec(String(value ?? ""));
    if (!hourMatch && !minuteMatch) return undefined;
    return Number(hourMatch?.[1] ?? 0) * 60 + Number(minuteMatch?.[1] ?? 0);
}

function extractTimeRangeFromTitle(title) {
    const match = /(\d{1,2}:\d{2})\s*[~～-]\s*(\d{1,2}:\d{2})/.exec(
        String(title ?? ""),
    );
    if (!match) return {};
    const normalize = (value) => {
        const [hour, minute] = value.split(":");
        return `${hour.padStart(2, "0")}:${minute}`;
    };
    return { startTime: normalize(match[1]), endTime: normalize(match[2]) };
}

function deriveDurationMinutes(startTime, endTime) {
    const parse = (value) => {
        const match = /^(\d{2}):(\d{2})$/.exec(String(value ?? ""));
        return match ? Number(match[1]) * 60 + Number(match[2]) : undefined;
    };
    const start = parse(startTime);
    const end = parse(endTime);
    return start === undefined || end === undefined || end < start
        ? undefined
        : end - start;
}

function normalizeGroup(entry, resolveVenue) {
    const { sourceId, selected, occurrences } = entry;
    const row = selected.sourceRow;
    const officialName = pick(row, [
        "TITLE",
        "GROUP_EXPERIENCE_NAME",
        "EXPERIENCE_NAME",
    ]);
    const venueId = pick(row, ["INSTITUTION_SEQ"]);
    const venueName = pick(row, ["INSTITUTION_NAME"]);
    const venueRelation = resolveVenue(venueId, venueName);
    const titleTimeRange = extractTimeRangeFromTitle(officialName);
    const startTime = pick(row, ["START_TIME"]) ?? titleTimeRange.startTime;
    const endTime = pick(row, ["END_TIME"]) ?? titleTimeRange.endTime;
    const officialDurationValue = pick(row, [
        "EXPERIENCE_TIME_TXT",
        "EXPERIENCE_TIME",
        "DURATION_TXT",
    ]);
    const officialDurationText =
        officialDurationValue === undefined
            ? undefined
            : /시간|분/.test(String(officialDurationValue))
              ? String(officialDurationValue)
              : `${officialDurationValue}시간`;
    const derivedDuration = deriveDurationMinutes(startTime, endTime);
    const officialDuration = parseDurationMinutes(officialDurationText);
    const issues = identityConflictIssues(
        "groupExperience",
        sourceId,
        occurrences,
    );
    if (
        officialDuration !== undefined &&
        derivedDuration !== undefined &&
        officialDuration !== derivedDuration
    ) {
        issues.push({
            code: "durationSourceConflict",
            severity: "warning",
            detail: `Official duration ${officialDurationText} differs from ${startTime}-${endTime}`,
        });
    }
    if (venueRelation.status !== "matched") {
        issues.push({
            code: "venueConflict",
            severity: "high",
            detail: `Venue relation is ${venueRelation.status}`,
        });
    }
    return compactObject({
        source: SOURCE,
        subtype: "groupExperience",
        canonicalKey: `${SOURCE}:group-experience:${sourceId}`,
        groupExperienceSeq: sourceId,
        officialName,
        sourceDisplayName: officialName,
        venueRelation,
        checkedAt: selected.fetchedAt,
        lastSeenAt: selected.fetchedAt,
        detailStatus: "unavailable",
        detailUnavailableReason: "notProvidedBySource",
        officialListUrl: GROUP_LIST_URL,
        applicationUrl: applicationUrlFor("groupExperience", sourceId),
        currentActionUrl: applicationUrlFor("groupExperience", sourceId),
        timeSource: compactObject({
            officialDurationText,
            startTime,
            endTime,
        }),
        derived:
            derivedDuration === undefined
                ? undefined
                : { durationMinutes: derivedDuration },
        minimumParticipants: pick(row, [
            "MINIMUM_PARTICIPANTS",
            "MIN_PARTICIPANTS",
            "MIN_PERSONNEL",
        ]),
        maximumParticipants: pick(row, [
            "MAXIMUM_PARTICIPANTS",
            "MAX_PARTICIPANTS",
            "MAX_PERSONNEL",
        ]),
        price:
            pick(row, ["EXPERIENCE_FEE", "FEE"]) === undefined
                ? undefined
                : {
                      currency: "KRW",
                      chargeBasis: "person",
                      amount: pick(row, ["EXPERIENCE_FEE", "FEE"]),
                  },
        descriptionSource: pick(row, [
            "EXPERIENCE_DESCRIPTION",
            "DESCRIPTION",
            "CONTENT",
        ]),
        sourceProvenance: {
            rawSnapshotFile: path.basename(rawOutputPath),
            listUrl: GROUP_LIST_URL,
            pageOccurrences: occurrences.map((occurrence) => occurrence.page),
            collectionPasses: [
                ...new Set(
                    occurrences
                        .map((occurrence) => occurrence.collectionPass)
                        .filter(Boolean),
                ),
            ],
            sourceFields: Object.keys(row).sort(),
        },
        validationIssues: issues.length > 0 ? issues : undefined,
    });
}

function normalizeFinalPass(finalPass, detailInspections, venueStaging) {
    const resolveVenue = createVenueResolver(venueStaging);
    const inspections = new Map(
        detailInspections.map((inspection) => [
            `${inspection.family}:${inspection.sourceId}`,
            inspection,
        ]),
    );
    const shortRecords = selectedOccurrences(finalPass.families.shortExperience).map(
        (entry) =>
            normalizeShort(
                entry,
                inspections.get(`shortExperience:${entry.sourceId}`),
                resolveVenue,
            ),
    );
    const regularRecords = selectedOccurrences(
        finalPass.families.regularCourseRun,
    ).map((entry) =>
        normalizeRegular(
            entry,
            inspections.get(`regularCourseRun:${entry.sourceId}`),
            resolveVenue,
        ),
    );
    const groupRecords = selectedOccurrences(finalPass.families.groupExperience).map(
        (entry) => normalizeGroup(entry, resolveVenue),
    );
    return [...shortRecords, ...regularRecords, ...groupRecords];
}

function buildNewVenueCandidates(records) {
    const candidates = new Map();
    for (const record of records.filter(
        (item) => item.venueRelation.status !== "matched",
    )) {
        const relation = record.venueRelation;
        const key = `${relation.sourceVenueOfficialId ?? ""}:${relation.sourceVenueName ?? ""}`;
        if (!candidates.has(key)) {
            candidates.set(key, {
                status: relation.status,
                sourceVenueOfficialId: relation.sourceVenueOfficialId,
                sourceVenueName: relation.sourceVenueName,
                offeringKeys: [],
            });
        }
        candidates.get(key).offeringKeys.push(record.canonicalKey);
    }
    return [...candidates.values()];
}

function summarizeOutput(
    firstPass,
    secondPass,
    finalPass,
    comparison,
    regularCourseReconciliation,
    records,
) {
    const familySummary = (family, identityField) => {
        const snapshot = finalPass.families[family];
        const familyRecords = records.filter((record) => record.subtype === family);
        return {
            sourceTotals: {
                first: firstPass.families[family].sourceTotals,
                second: secondPass.families[family].sourceTotals,
            },
            rawRows: {
                first: firstPass.families[family].rawRows.length,
                second: secondPass.families[family].rawRows.length,
            },
            unique: familyRecords.length,
            duplicateSourceIds: {
                first:
                    firstPass.families[family].rawRows.length -
                    firstPass.identitySets[family].length,
                second:
                    secondPass.families[family].rawRows.length -
                    secondPass.identitySets[family].length,
            },
            recoveredFromFirstPass:
                finalPass.reconciliationByFamily[family].recoveredFromFirstPass,
            identityField,
        };
    };
    return {
        shortExperience: {
            ...familySummary("shortExperience", "SHORT_EXPERIENCE_SEQ"),
            sessionTotal: records
                .filter((record) => record.subtype === "shortExperience")
                .reduce((sum, record) => sum + record.sessions.length, 0),
        },
        regularCourseRun: {
            ...familySummary(
                "regularCourseRun",
                "REGULAR_COURSE_SCHEDULE_SEQ",
            ),
            uniqueCourseIds: new Set(
                records
                    .filter((record) => record.subtype === "regularCourseRun")
                    .map((record) => record.regularCourseSeq),
            ).size,
            reconciliation: {
                passSummaries: regularCourseReconciliation.passSummaries,
                cumulativeUniqueScheduleCount:
                    regularCourseReconciliation.cumulativeUniqueScheduleCount,
                stableUnionCandidate:
                    regularCourseReconciliation.stableUnionCandidate,
                stopReason: regularCourseReconciliation.stopReason,
            },
        },
        groupExperience: familySummary(
            "groupExperience",
            "GROUP_EXPERIENCE_SEQ",
        ),
        comparison,
        reconciliationByFamily: finalPass.reconciliationByFamily,
        firstPass: {
            startedAt: firstPass.collectionStartedAt,
            finishedAt: firstPass.collectionFinishedAt,
        },
        secondPass: {
            startedAt: secondPass.collectionStartedAt,
            finishedAt: secondPass.collectionFinishedAt,
        },
    };
}

async function main() {
    const collectionStartedAt = now();
    const venueStaging = JSON.parse(await readFile(venuePath, "utf8"));
    const firstPass = await collectIdentityPass("A");
    const secondPass = await collectIdentityPass("B");
    const comparison = comparePasses(firstPass, secondPass);
    const finalPass = reconcilePasses(firstPass, secondPass);
    const regularCourseReconciliation =
        await collectRegularCourseReconciliation(firstPass, secondPass);
    finalPass.families.regularCourseRun = regularCourseReconciliation.family;
    finalPass.reconciliationByFamily.regularCourseRun =
        regularCourseReconciliation.reconciliation;
    const detailInspections = await inspectFinalDetails(finalPass);
    const records = normalizeFinalPass(
        finalPass,
        detailInspections,
        venueStaging,
    );
    const collectionFinishedAt = now();
    const collectionIssues = [
        ...Object.values(firstPass.families).flatMap(
            (family) => family.collectionIssues,
        ),
        ...Object.values(secondPass.families).flatMap(
            (family) => family.collectionIssues,
        ),
        ...regularCourseReconciliation.passes
            .slice(2)
            .flatMap((pass) => pass.families.regularCourseRun.collectionIssues),
        ...detailInspections
            .filter((inspection) => inspection.error || inspection.detailPayloadError)
            .map((inspection) => ({
                code: "detailInspectionFailed",
                severity: "warning",
                family: inspection.family,
                sourceId: inspection.sourceId,
                detail: inspection.error ?? inspection.detailPayloadError,
            })),
    ];
    for (const [family, result] of Object.entries(comparison)) {
        if (result.firstOnly.length > 0 || result.secondOnly.length > 0) {
            collectionIssues.push({
                code: "identitySetChangedBetweenPasses",
                severity: "warning",
                family,
                firstOnly: result.firstOnly,
                secondOnly: result.secondOnly,
            });
        }
    }

    const rawSnapshot = {
        schemaVersion: 1,
        description:
            "Official Korean Temple Food list/source raw facts. HTML is intentionally not stored.",
        source: SOURCE,
        collectionStartedAt,
        collectionFinishedAt,
        comparison,
        reconciliationByFamily: finalPass.reconciliationByFamily,
        regularCourseReconciliation: {
            passSummaries: regularCourseReconciliation.passSummaries,
            cumulativeUniqueScheduleCount:
                regularCourseReconciliation.cumulativeUniqueScheduleCount,
            consecutivePassesWithoutNewIdentity:
                regularCourseReconciliation.consecutivePassesWithoutNewIdentity,
            stableUnionCandidate: regularCourseReconciliation.stableUnionCandidate,
            stopReason: regularCourseReconciliation.stopReason,
        },
        passes: Object.fromEntries(
            regularCourseReconciliation.passes.map((pass) => [
                pass.label,
                {
                    collectionStartedAt: pass.collectionStartedAt,
                    collectionFinishedAt: pass.collectionFinishedAt,
                    families: Object.fromEntries(
                        Object.entries(pass.families).map(([family, snapshot]) => [
                            family,
                            {
                                startedAt: snapshot.startedAt,
                                finishedAt: snapshot.finishedAt,
                                sourceTotals: snapshot.sourceTotals,
                                pages: snapshot.pages,
                                rawRows: snapshot.rawRows,
                                duplicateEncounters: snapshot.duplicateEncounters,
                                collectionIssues: snapshot.collectionIssues,
                            },
                        ]),
                    ),
                },
            ]),
        ),
        detailInspections,
        collectionIssues,
    };
    const rawSnapshotSource = `${JSON.stringify(rawSnapshot, null, 2)}\n`;
    const rawArtifact = {
        filename: path.basename(rawOutputPath),
        sha256: createHash("sha256").update(rawSnapshotSource).digest("hex"),
        collectionStartedAt,
        collectionFinishedAt,
    };
    const collectionSummary = summarizeOutput(
        firstPass,
        secondPass,
        finalPass,
        comparison,
        regularCourseReconciliation,
        records,
    );
    collectionSummary.regularCourseRun.reconciliation.rawArtifact = rawArtifact;
    const normalizedSnapshot = {
        schemaVersion: 1,
        description:
            "TempleFoodOffering normalized canonical staging snapshot. This file is not imported by production.",
        source: SOURCE,
        rawSnapshotFile: path.basename(rawOutputPath),
        rawArtifact,
        collectionStartedAt,
        collectionFinishedAt,
        contract: canonicalContract,
        collectionSummary,
        collectionIssues,
        newVenueCandidates: buildNewVenueCandidates(records),
        records,
    };
    const reconciliationMetadata = {
        schemaVersion: 1,
        description:
            "Compact multi-pass reconciliation metadata for the TempleFood staging snapshot.",
        source: SOURCE,
        rawArtifact,
        normalizedSnapshotFile: path.basename(normalizedOutputPath),
        regularCourseReconciliation: {
            passSummaries: regularCourseReconciliation.passSummaries,
            cumulativeUniqueScheduleCount:
                regularCourseReconciliation.cumulativeUniqueScheduleCount,
            consecutivePassesWithoutNewIdentity:
                regularCourseReconciliation.consecutivePassesWithoutNewIdentity,
            stableUnionCandidate: regularCourseReconciliation.stableUnionCandidate,
            stopReason: regularCourseReconciliation.stopReason,
        },
    };

    await Promise.all([
        writeFile(rawOutputPath, rawSnapshotSource, "utf8"),
        writeFile(
            normalizedOutputPath,
            `${JSON.stringify(normalizedSnapshot, null, 2)}\n`,
            "utf8",
        ),
        writeFile(
            reconciliationOutputPath,
            `${JSON.stringify(reconciliationMetadata, null, 2)}\n`,
            "utf8",
        ),
    ]);
    console.log(
        JSON.stringify(
            {
                rawOutput: path.relative(repositoryRoot, rawOutputPath).replaceAll("\\", "/"),
                normalizedOutput: path
                    .relative(repositoryRoot, normalizedOutputPath)
                    .replaceAll("\\", "/"),
                reconciliationOutput: path
                    .relative(repositoryRoot, reconciliationOutputPath)
                    .replaceAll("\\", "/"),
                rawSha256: rawArtifact.sha256,
                collectionStartedAt,
                collectionFinishedAt,
                records: records.length,
                comparison,
                collectionIssues: collectionIssues.length,
            },
            null,
            2,
        ),
    );
}

await main();
