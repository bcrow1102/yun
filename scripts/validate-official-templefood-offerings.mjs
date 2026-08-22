import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const rawPath = path.join(
    repositoryRoot,
    "data/temples/staging/official-templefood-offerings-raw-snapshot-2026-08-21.json",
);
const normalizedPath = path.join(
    repositoryRoot,
    "data/temples/generated/official-templefood-offerings.runtime.json",
);
const reconciliationPath = path.join(
    repositoryRoot,
    "data/temples/staging/official-templefood-offerings-reconciliation-2026-08-21.json",
);
const venuePath = path.join(
    repositoryRoot,
    "data/temples/generated/official-templefood-venues.runtime.json",
);

const SOURCE = "korean-temple-food";
const FAMILIES = {
    shortExperience: {
        identityField: "SHORT_EXPERIENCE_SEQ",
        recordIdentityField: "shortExperienceSeq",
        keyPrefix: `${SOURCE}:short-experience:`,
    },
    regularCourseRun: {
        identityField: "REGULAR_COURSE_SCHEDULE_SEQ",
        recordIdentityField: "regularCourseScheduleSeq",
        keyPrefix: `${SOURCE}:regular-course-run:`,
    },
    groupExperience: {
        identityField: "GROUP_EXPERIENCE_SEQ",
        recordIdentityField: "groupExperienceSeq",
        keyPrefix: `${SOURCE}:group-experience:`,
    },
};
const MUTABLE_FIELDS = new Set([
    "sourceApplicationStatusText",
    "applicationStatusText",
    "applicationStatus",
    "appliedCount",
    "pendingCount",
    "waitingCount",
    "remainingCount",
    "isAvailable",
    "applicationAvailable",
]);

function assert(condition, message) {
    if (!condition) throw new Error(message);
}

function isTimestamp(value) {
    return typeof value === "string" && Number.isFinite(Date.parse(value));
}

function isOfficialUrl(value) {
    return (
        typeof value === "string" &&
        value.startsWith("https://www.koreatemplefood.com/")
    );
}

function countBy(records, predicate) {
    return records.filter(predicate).length;
}

function countValues(records, selector) {
    const counts = {};
    for (const record of records) {
        const value = selector(record);
        counts[value] = (counts[value] ?? 0) + 1;
    }
    return counts;
}

function duplicateCount(values) {
    return values.length - new Set(values).size;
}

function mutableFieldsOutsideSnapshot(value, pathParts = []) {
    if (!value || typeof value !== "object") return [];
    const findings = [];
    for (const [key, fieldValue] of Object.entries(value)) {
        if (key === "snapshot") continue;
        const nextPath = [...pathParts, key];
        if (MUTABLE_FIELDS.has(key)) findings.push(nextPath.join("."));
        findings.push(...mutableFieldsOutsideSnapshot(fieldValue, nextPath));
    }
    return findings;
}

function passFamilyStats(snapshot, family) {
    const familySnapshot = snapshot.passes[family === "A" ? "A" : "B"].families;
    return Object.fromEntries(
        Object.entries(FAMILIES).map(([familyName]) => {
            const data = familySnapshot[familyName];
            const identities = data.rawRows.map((row) => row.sourceId);
            return [
                familyName,
                {
                    sourceTotals: data.sourceTotals,
                    rawRows: data.rawRows.length,
                    unique: new Set(identities).size,
                    duplicateSourceIds: duplicateCount(identities),
                },
            ];
        }),
    );
}

const [rawSource, normalizedSource, reconciliationSource, venueSource] = await Promise.all([
    readFile(rawPath, "utf8"),
    readFile(normalizedPath, "utf8"),
    readFile(reconciliationPath, "utf8").catch(() => undefined),
    readFile(venuePath, "utf8"),
]);
const raw = JSON.parse(rawSource);
const normalized = JSON.parse(normalizedSource);
const reconciliation = reconciliationSource
    ? JSON.parse(reconciliationSource)
    : undefined;
const venueStaging = JSON.parse(venueSource);
const records = normalized.records;

assert(raw.schemaVersion === 1, "Unexpected raw snapshot schema version");
assert(normalized.schemaVersion === 1, "Unexpected normalized snapshot schema version");
assert(raw.source === SOURCE && normalized.source === SOURCE, "Unexpected source namespace");
assert(Array.isArray(records), "Normalized records must be an array");
assert(isTimestamp(raw.collectionStartedAt), "Raw collectionStartedAt missing");
assert(isTimestamp(raw.collectionFinishedAt), "Raw collectionFinishedAt missing");
assert(isTimestamp(normalized.collectionStartedAt), "Normalized collectionStartedAt missing");
assert(isTimestamp(normalized.collectionFinishedAt), "Normalized collectionFinishedAt missing");
assert(
    normalized.rawSnapshotFile === path.basename(rawPath),
    "Normalized snapshot does not reference the raw snapshot",
);
if (normalized.rawArtifact) {
    const rawSha256 = createHash("sha256").update(rawSource).digest("hex");
    assert(normalized.rawArtifact.filename === path.basename(rawPath), "Raw artifact filename mismatch");
    assert(normalized.rawArtifact.sha256 === rawSha256, "Raw artifact SHA-256 mismatch");
    assert(
        normalized.rawArtifact.collectionStartedAt === raw.collectionStartedAt &&
            normalized.rawArtifact.collectionFinishedAt === raw.collectionFinishedAt,
        "Raw artifact collection timestamps mismatch",
    );
    assert(reconciliation, "Compact reconciliation metadata is missing");
    assert(
        JSON.stringify(reconciliation.rawArtifact) ===
            JSON.stringify(normalized.rawArtifact),
        "Compact reconciliation raw artifact metadata mismatch",
    );
}
assert(raw.passes?.A && raw.passes?.B, "Two raw collection passes are required");

const passA = passFamilyStats(raw, "A");
const passB = passFamilyStats(raw, "B");
const comparisonResult = {};

if (raw.regularCourseReconciliation) {
    const regularPasses = Object.entries(raw.passes)
        .filter(([, pass]) => pass.families?.regularCourseRun)
        .map(([label, pass]) => ({ label, ...pass }));
    const summaries = raw.regularCourseReconciliation.passSummaries;
    assert(
        summaries.length === regularPasses.length,
        "RegularCourse reconciliation pass summary count mismatch",
    );
    const cumulativeIds = new Set();
    let previousIds = new Set();
    for (const [index, pass] of regularPasses.entries()) {
        const rows = pass.families.regularCourseRun.rawRows;
        const ids = rows.map((row) => row.sourceId);
        const uniqueIds = new Set(ids);
        const newToUnion = [...uniqueIds]
            .filter((id) => !cumulativeIds.has(id))
            .sort();
        const missingFromPrevious = [...previousIds]
            .filter((id) => !uniqueIds.has(id))
            .sort();
        for (const id of newToUnion) cumulativeIds.add(id);
        const summary = summaries[index];
        assert(summary.label === pass.label, `RegularCourse pass ${index + 1}: label mismatch`);
        assert(summary.rawRowCount === rows.length, `${pass.label}: raw row count mismatch`);
        assert(summary.uniqueScheduleCount === uniqueIds.size, `${pass.label}: unique count mismatch`);
        assert(
            summary.duplicateOccurrenceCount === rows.length - uniqueIds.size,
            `${pass.label}: duplicate occurrence count mismatch`,
        );
        assert(
            JSON.stringify(summary.newToUnionIdentities) === JSON.stringify(newToUnion),
            `${pass.label}: new-to-union identities mismatch`,
        );
        assert(
            JSON.stringify(summary.missingFromPreviousIdentities) ===
                JSON.stringify(missingFromPrevious),
            `${pass.label}: missing-from-previous identities mismatch`,
        );
        assert(
            summary.cumulativeUniqueScheduleCount === cumulativeIds.size,
            `${pass.label}: cumulative unique count mismatch`,
        );
        previousIds = uniqueIds;
    }
    assert(
        raw.regularCourseReconciliation.cumulativeUniqueScheduleCount ===
            cumulativeIds.size,
        "RegularCourse reconciliation cumulative unique mismatch",
    );
    if (raw.regularCourseReconciliation.stableUnionCandidate) {
        assert(
            summaries.slice(-3).every((summary) => summary.newToUnionIdentityCount === 0),
            "RegularCourse stable union requires three consecutive no-new passes",
        );
    }
}

for (const [family, config] of Object.entries(FAMILIES)) {
    const rowsA = raw.passes.A.families[family].rawRows;
    const rowsB = raw.passes.B.families[family].rawRows;
    for (const [label, rows] of [["A", rowsA], ["B", rowsB]]) {
        for (const row of rows) {
            assert(isTimestamp(row.fetchedAt), `${family} pass ${label}: fetchedAt missing`);
            assert(/^\d+$/.test(row.sourceId), `${family} pass ${label}: invalid source ID`);
            assert(
                String(row.sourceRow?.[config.identityField]) === row.sourceId,
                `${family} pass ${label}: source identity field mismatch`,
            );
        }
    }
    const setA = new Set(rowsA.map((row) => row.sourceId));
    const setB = new Set(rowsB.map((row) => row.sourceId));
    const observedRows = Object.values(raw.passes).flatMap(
        (pass) => pass.families?.[family]?.rawRows ?? [],
    );
    const union = new Set(observedRows.map((row) => row.sourceId));
    const familyRecords = records.filter((record) => record.subtype === family);
    const normalizedIds = new Set(
        familyRecords.map((record) => record[config.recordIdentityField]),
    );
    assert(
        normalizedIds.size === familyRecords.length,
        `${family}: duplicate source identity after normalization`,
    );
    assert(
        union.size === normalizedIds.size && [...union].every((id) => normalizedIds.has(id)),
        `${family}: normalized identity set must equal the two-pass observed union`,
    );
    const firstOnly = [...setA].filter((id) => !setB.has(id)).sort();
    const secondOnly = [...setB].filter((id) => !setA.has(id)).sort();
    const storedComparison = raw.comparison[family];
    assert(
        JSON.stringify(firstOnly) === JSON.stringify([...storedComparison.firstOnly].sort()) &&
            JSON.stringify(secondOnly) === JSON.stringify([...storedComparison.secondOnly].sort()),
        `${family}: stored two-pass comparison is incorrect`,
    );
    comparisonResult[family] = {
        runAUnique: setA.size,
        runBUnique: setB.size,
        common: [...setA].filter((id) => setB.has(id)).length,
        firstOnly,
        secondOnly,
        reconciledUnique: union.size,
    };
}

const venueByOfficialId = new Map(
    venueStaging.records
        .filter((venue) => venue.officialId)
        .map((venue) => [String(venue.officialId), venue]),
);
const relationCounts = { matched: 0, unmatched: 0, ambiguous: 0 };
const detailCounts = { available: 0, redirected: 0, unavailable: 0 };
const redirectTargets = { list: 0, home: 0, other: 0 };
const issueCounts = {};
const issueSeverityCounts = {};
const canonicalKeys = [];
const sourceIdentities = [];
const sessionKeys = [];
let provenanceMissing = 0;
let snapshotCheckedAtMissing = 0;
let mutableCanonicalFields = 0;
let invalidCurrentActionUrls = 0;
let fakeGroupDetailUrls = 0;

for (const record of records) {
    const config = FAMILIES[record.subtype];
    assert(config, `${record.canonicalKey}: unsupported subtype`);
    assert(record.source === SOURCE, `${record.canonicalKey}: invalid source`);
    assert(record.officialName, `${record.canonicalKey}: missing officialName`);
    assert(record.sourceDisplayName, `${record.canonicalKey}: missing sourceDisplayName`);
    assert(isTimestamp(record.checkedAt), `${record.canonicalKey}: checkedAt missing`);
    assert(isTimestamp(record.lastSeenAt), `${record.canonicalKey}: lastSeenAt missing`);
    assert(
        record.canonicalKey === `${config.keyPrefix}${record[config.recordIdentityField]}`,
        `${record.canonicalKey}: invalid canonical key`,
    );
    canonicalKeys.push(record.canonicalKey);
    sourceIdentities.push(`${record.subtype}:${record[config.recordIdentityField]}`);

    if (
        record.sourceProvenance?.rawSnapshotFile !== path.basename(rawPath) ||
        !isOfficialUrl(record.sourceProvenance?.listUrl) ||
        !Array.isArray(record.sourceProvenance?.pageOccurrences) ||
        !Array.isArray(record.sourceProvenance?.collectionPasses) ||
        !Array.isArray(record.sourceProvenance?.sourceFields)
    ) {
        provenanceMissing += 1;
    }

    const relationStatus = record.venueRelation?.status;
    assert(relationCounts[relationStatus] !== undefined, `${record.canonicalKey}: invalid Venue relation status`);
    relationCounts[relationStatus] += 1;
    if (relationStatus === "matched") {
        assert(
            venueByOfficialId.has(String(record.venueRelation.venueOfficialId)),
            `${record.canonicalKey}: matched relation references unknown Venue`,
        );
    }

    assert(detailCounts[record.detailStatus] !== undefined, `${record.canonicalKey}: invalid detailStatus`);
    detailCounts[record.detailStatus] += 1;
    if (record.detailStatus === "available") {
        assert(isOfficialUrl(record.officialDetailUrl), `${record.canonicalKey}: available detail URL missing`);
    } else if (record.detailStatus === "redirected") {
        assert(redirectTargets[record.redirectTarget] !== undefined, `${record.canonicalKey}: redirect target missing`);
        redirectTargets[record.redirectTarget] += 1;
        assert(isOfficialUrl(record.lastKnownOfficialDetailUrl), `${record.canonicalKey}: last known detail URL missing`);
        assert(!record.currentActionUrl, `${record.canonicalKey}: redirected detail exposed as current action`);
    }

    if (record.currentActionUrl && !isOfficialUrl(record.currentActionUrl)) {
        invalidCurrentActionUrls += 1;
    }
    mutableCanonicalFields += mutableFieldsOutsideSnapshot(record).length;
    if (record.snapshot && !isTimestamp(record.snapshot.checkedAt)) {
        snapshotCheckedAtMissing += 1;
    }
    for (const issue of record.validationIssues ?? []) {
        issueCounts[issue.code] = (issueCounts[issue.code] ?? 0) + 1;
        issueSeverityCounts[issue.severity] =
            (issueSeverityCounts[issue.severity] ?? 0) + 1;
    }

    if (record.subtype === "shortExperience") {
        assert(Array.isArray(record.sessions), `${record.canonicalKey}: sessions must be an array`);
        for (const session of record.sessions) {
            assert(/^\d+$/.test(session.shortExperienceScheduleSeq), `${record.canonicalKey}: session source ID missing`);
            assert(
                session.canonicalKey === `${SOURCE}:short-experience-session:${session.shortExperienceScheduleSeq}`,
                `${record.canonicalKey}: invalid session child key`,
            );
            sessionKeys.push(session.canonicalKey);
        }
    } else if (record.subtype === "regularCourseRun") {
        assert(/^\d+$/.test(record.regularCourseSeq), `${record.canonicalKey}: REGULAR_COURSE_SEQ missing`);
    } else {
        assert(record.detailStatus === "unavailable", `${record.canonicalKey}: group detail must be unavailable`);
        assert(record.detailUnavailableReason === "notProvidedBySource", `${record.canonicalKey}: group detail reason missing`);
        assert(isOfficialUrl(record.officialListUrl), `${record.canonicalKey}: official list URL missing`);
        assert(isOfficialUrl(record.applicationUrl), `${record.canonicalKey}: application URL missing`);
        if (
            record.officialDetailUrl ||
            record.lastKnownOfficialDetailUrl ||
            /\/detail\//.test(record.currentActionUrl ?? "")
        ) {
            fakeGroupDetailUrls += 1;
        }
    }
}

assert(duplicateCount(canonicalKeys) === 0, "Duplicate canonical key found");
assert(duplicateCount(sourceIdentities) === 0, "Duplicate normalized source identity found");
assert(duplicateCount(sessionKeys) === 0, "Duplicate session child key found");
assert(provenanceMissing === 0, "Normalized provenance is incomplete");
assert(snapshotCheckedAtMissing === 0, "Mutable snapshot missing checkedAt");
assert(mutableCanonicalFields === 0, "Mutable application state leaked into canonical fields");
assert(invalidCurrentActionUrls === 0, "Invalid current action URL found");
assert(fakeGroupDetailUrls === 0, "Invented group detail URL found");

const shortRecords = records.filter((record) => record.subtype === "shortExperience");
const regularRecords = records.filter((record) => record.subtype === "regularCourseRun");
const groupRecords = records.filter((record) => record.subtype === "groupExperience");
const sessionDistribution = {
    total: shortRecords.reduce((sum, record) => sum + record.sessions.length, 0),
    zero: countBy(shortRecords, (record) => record.sessions.length === 0),
    one: countBy(shortRecords, (record) => record.sessions.length === 1),
    multiple: countBy(shortRecords, (record) => record.sessions.length > 1),
};
const courseGroups = Object.groupBy(
    regularRecords,
    (record) => record.regularCourseSeq,
);
const uniqueCourseIds = Object.keys(courseGroups).length;
const multiRunCourseCount = Object.values(courseGroups).filter(
    (runs) => runs.length > 1,
).length;
const durationConflict = groupRecords.find(
    (record) => record.groupExperienceSeq === "1",
);
assert(
    durationConflict?.validationIssues?.some(
        (issue) => issue.code === "durationSourceConflict",
    ) && durationConflict.derived?.durationMinutes === 90,
    "Known group duration conflict was not preserved",
);
assert(relationCounts.matched === records.length, "All current Offering relations must match Venue staging");
assert(relationCounts.unmatched === 0, "Unexpected unmatched Venue relation");
assert(relationCounts.ambiguous === 0, "Unexpected ambiguous Venue relation");
assert(normalized.newVenueCandidates.length === 0, "Unexpected new Venue candidate");

console.log(
    JSON.stringify(
        {
            shortExperience: {
                sourceTotal: {
                    runA: passA.shortExperience.sourceTotals,
                    runB: passB.shortExperience.sourceTotals,
                },
                rawRows: {
                    runA: passA.shortExperience.rawRows,
                    runB: passB.shortExperience.rawRows,
                },
                uniqueOffering: shortRecords.length,
                duplicateSourceIds: {
                    runA: passA.shortExperience.duplicateSourceIds,
                    runB: passB.shortExperience.duplicateSourceIds,
                },
                sessions: sessionDistribution,
            },
            regularCourseRun: {
                sourceTotal: {
                    runA: passA.regularCourseRun.sourceTotals,
                    runB: passB.regularCourseRun.sourceTotals,
                },
                rawRows: {
                    runA: passA.regularCourseRun.rawRows,
                    runB: passB.regularCourseRun.rawRows,
                },
                uniqueRun: regularRecords.length,
                duplicateScheduleIds: {
                    runA: passA.regularCourseRun.duplicateSourceIds,
                    runB: passB.regularCourseRun.duplicateSourceIds,
                },
                uniqueCourseIds,
                multiRunCourseCount,
            },
            groupExperience: {
                rawRows: {
                    runA: passA.groupExperience.rawRows,
                    runB: passB.groupExperience.rawRows,
                },
                unique: groupRecords.length,
                fakeDetailUrls: fakeGroupDetailUrls,
            },
            totalNormalizedOffering: records.length,
            identity: {
                canonicalKeyDuplicate: duplicateCount(canonicalKeys),
                sourceIdentityDuplicateAfterDedupe: duplicateCount(sourceIdentities),
                sessionChildKeyDuplicate: duplicateCount(sessionKeys),
            },
            venueRelation: relationCounts,
            newVenueCandidates: normalized.newVenueCandidates,
            detailStatus: detailCounts,
            redirectTargets,
            validationIssues: issueCounts,
            validationIssueSeverity: issueSeverityCounts,
            provenanceMissing,
            mutableSnapshotMissingCheckedAt: snapshotCheckedAtMissing,
            mutableCanonicalFields,
            invalidCurrentActionUrls,
            reproducibility: comparisonResult,
            collectionIssues: normalized.collectionIssues,
        },
        null,
        2,
    ),
);
