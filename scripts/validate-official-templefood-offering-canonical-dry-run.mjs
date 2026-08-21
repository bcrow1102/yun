import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
    canonicalContract,
    outputPath,
    transformRegularCourseRun,
    transformShortExperience,
} from "./transform-official-templefood-offering-canonical-dry-run.mjs";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const pilotPath = path.join(
    repositoryRoot,
    "data/temples/staging/official-templefood-offering-identity-pilot-2026-08-21.json",
);
const venuePath = path.join(
    repositoryRoot,
    "data/temples/staging/official-templefood-venues-2026-08-21.json",
);

const EXPECTED_SOURCE = "korean-temple-food";
const EXPECTED_TYPES = new Set([
    "shortExperience",
    "regularCourseRun",
    "groupExperience",
]);
const MUTABLE_FIELD_NAMES = new Set([
    "applicationStatus",
    "applicationStatusText",
    "sourceApplicationStatusText",
    "appliedCount",
    "pendingCount",
    "waitingCount",
    "remainingCount",
    "isAvailable",
    "applicationAvailable",
]);

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function isIsoDate(value) {
    return /^\d{4}-\d{2}-\d{2}$/.test(value);
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

function findMutableFieldsOutsideSnapshot(value, pathParts = []) {
    if (!value || typeof value !== "object") {
        return [];
    }

    const findings = [];
    for (const [key, fieldValue] of Object.entries(value)) {
        const nextPath = [...pathParts, key];
        if (key === "snapshot") {
            continue;
        }
        if (MUTABLE_FIELD_NAMES.has(key)) {
            findings.push(nextPath.join("."));
        }
        findings.push(...findMutableFieldsOutsideSnapshot(fieldValue, nextPath));
    }
    return findings;
}

const [dryRunSource, pilotSource, venueSource] = await Promise.all([
    readFile(outputPath, "utf8"),
    readFile(pilotPath, "utf8"),
    readFile(venuePath, "utf8"),
]);
const dryRun = JSON.parse(dryRunSource);
const pilot = JSON.parse(pilotSource);
const venueStaging = JSON.parse(venueSource);
const records = dryRun.records;
const venuesByOfficialId = new Map(
    venueStaging.records
        .filter((venue) => venue.officialId)
        .map((venue) => [venue.officialId, venue]),
);

assert(dryRun.schemaVersion === 1, "Unexpected dry-run schema version");
assert(Array.isArray(records), "Dry-run records must be an array");
assert(records.length === 12, `Expected 12 Offerings, got ${records.length}`);
assert(
    dryRun.contract?.discriminator === "subtype" &&
        EXPECTED_TYPES.size === dryRun.contract?.subtypes?.length &&
        dryRun.contract.subtypes.every((type) => EXPECTED_TYPES.has(type)),
    "Canonical discriminated union contract is incomplete",
);
assert(
    dryRun.contract.shortExperienceSessions?.minimumItems === 0,
    "ShortExperience sessions must allow an empty array",
);
assert(
    dryRun.contract.regularCourse?.canonicalEntity === false,
    "TempleFoodCourse must not become an independent canonical entity",
);
assert(
    dryRun.contract.regularCourseRun?.dedupeBy ===
        "regularCourseScheduleSeq",
    "RegularCourseRun must dedupe by schedule ID",
);

const canonicalKeys = [];
const sourceIdentities = [];
const sessionKeys = [];
const relationCounts = { matched: 0, unmatched: 0, ambiguous: 0 };
const detailCounts = { available: 0, redirected: 0, unavailable: 0 };
let provenanceMissing = 0;
let snapshotRecords = 0;
let mutableCanonicalFields = 0;
let fakeGroupDetailUrls = 0;

for (const record of records) {
    assert(record.source === EXPECTED_SOURCE, `${record.canonicalKey}: invalid source`);
    assert(EXPECTED_TYPES.has(record.subtype), `${record.canonicalKey}: invalid subtype`);
    assert(record.officialName, `${record.canonicalKey}: missing officialName`);
    assert(record.sourceDisplayName, `${record.canonicalKey}: missing sourceDisplayName`);
    assert(isIsoDate(record.checkedAt), `${record.canonicalKey}: invalid checkedAt`);
    assert(isIsoDate(record.lastSeenAt), `${record.canonicalKey}: invalid lastSeenAt`);
    assert(
        record.sourceProvenance?.sourceFile &&
            isOfficialUrl(record.sourceProvenance?.listUrl) &&
            Array.isArray(record.sourceProvenance?.observedSourceFields),
        `${record.canonicalKey}: missing provenance`,
    );

    canonicalKeys.push(record.canonicalKey);
    detailCounts[record.detailStatus] += 1;
    provenanceMissing += record.sourceProvenance ? 0 : 1;
    snapshotRecords += record.snapshot ? 1 : 0;
    mutableCanonicalFields += findMutableFieldsOutsideSnapshot(record).length;

    const relationStatus = record.venueRelation?.status;
    assert(
        relationStatus === "matched" ||
            relationStatus === "unmatched" ||
            relationStatus === "ambiguous",
        `${record.canonicalKey}: invalid Venue relation status`,
    );
    relationCounts[relationStatus] += 1;
    if (relationStatus === "matched") {
        assert(
            venuesByOfficialId.has(record.venueRelation.venueOfficialId),
            `${record.canonicalKey}: unknown Venue officialId`,
        );
    }

    if (record.snapshot) {
        assert(
            isIsoDate(record.snapshot.checkedAt),
            `${record.canonicalKey}: snapshot needs checkedAt`,
        );
        assert(
            record.snapshot.sourceApplicationStatusText,
            `${record.canonicalKey}: snapshot needs source status text`,
        );
    }

    if (record.detailStatus === "available") {
        assert(
            isOfficialUrl(record.officialDetailUrl),
            `${record.canonicalKey}: available detail needs official URL`,
        );
        assert(
            isOfficialUrl(record.currentActionUrl),
            `${record.canonicalKey}: available detail needs current action`,
        );
    } else if (record.detailStatus === "redirected") {
        assert(
            ["list", "home", "other"].includes(record.redirectTarget),
            `${record.canonicalKey}: redirected detail needs target`,
        );
        assert(
            isOfficialUrl(record.lastKnownOfficialDetailUrl),
            `${record.canonicalKey}: redirected detail needs provenance URL`,
        );
        assert(
            !record.currentActionUrl,
            `${record.canonicalKey}: redirected detail cannot be a current action`,
        );
    } else {
        assert(
            record.detailStatus === "unavailable",
            `${record.canonicalKey}: invalid detailStatus`,
        );
    }

    switch (record.subtype) {
        case "shortExperience": {
            assert(/^\d+$/.test(record.shortExperienceSeq), `${record.canonicalKey}: missing SHORT_EXPERIENCE_SEQ`);
            assert(
                record.canonicalKey ===
                    `${EXPECTED_SOURCE}:short-experience:${record.shortExperienceSeq}`,
                `${record.canonicalKey}: invalid short canonical key`,
            );
            assert(Array.isArray(record.sessions), `${record.canonicalKey}: sessions must be an array`);
            for (const session of record.sessions) {
                assert(/^\d+$/.test(session.shortExperienceScheduleSeq), `${record.canonicalKey}: session source ID missing`);
                assert(
                    session.canonicalKey ===
                        `${EXPECTED_SOURCE}:short-experience-session:${session.shortExperienceScheduleSeq}`,
                    `${record.canonicalKey}: invalid session child key`,
                );
                sessionKeys.push(session.canonicalKey);
            }
            sourceIdentities.push(
                `${EXPECTED_SOURCE}:short-experience:${record.shortExperienceSeq}`,
            );
            break;
        }
        case "regularCourseRun": {
            assert(/^\d+$/.test(record.regularCourseScheduleSeq), `${record.canonicalKey}: missing REGULAR_COURSE_SCHEDULE_SEQ`);
            assert(/^\d+$/.test(record.regularCourseSeq), `${record.canonicalKey}: missing REGULAR_COURSE_SEQ`);
            assert(
                record.canonicalKey ===
                    `${EXPECTED_SOURCE}:regular-course-run:${record.regularCourseScheduleSeq}`,
                `${record.canonicalKey}: run key must use schedule ID`,
            );
            sourceIdentities.push(
                `${EXPECTED_SOURCE}:regular-course-run:${record.regularCourseScheduleSeq}`,
            );
            break;
        }
        case "groupExperience": {
            assert(/^\d+$/.test(record.groupExperienceSeq), `${record.canonicalKey}: missing GROUP_EXPERIENCE_SEQ`);
            assert(
                record.canonicalKey ===
                    `${EXPECTED_SOURCE}:group-experience:${record.groupExperienceSeq}`,
                `${record.canonicalKey}: invalid group canonical key`,
            );
            assert(
                record.detailStatus === "unavailable" &&
                    record.detailUnavailableReason === "notProvidedBySource",
                `${record.canonicalKey}: group detail source structure is incorrect`,
            );
            assert(
                isOfficialUrl(record.officialListUrl) &&
                    isOfficialUrl(record.applicationUrl),
                `${record.canonicalKey}: group list/application URLs missing`,
            );
            if (
                record.officialDetailUrl ||
                record.lastKnownOfficialDetailUrl ||
                /\/detail\//.test(record.currentActionUrl ?? "")
            ) {
                fakeGroupDetailUrls += 1;
            }
            sourceIdentities.push(
                `${EXPECTED_SOURCE}:group-experience:${record.groupExperienceSeq}`,
            );
            break;
        }
    }
}

const shortRecords = records.filter((record) => record.subtype === "shortExperience");
const regularRecords = records.filter((record) => record.subtype === "regularCourseRun");
const groupRecords = records.filter((record) => record.subtype === "groupExperience");
const canonicalKeyDuplicate = canonicalKeys.length - new Set(canonicalKeys).size;
const sourceIdentityDuplicate =
    sourceIdentities.length - new Set(sourceIdentities).size;
const sessionChildKeyDuplicate = sessionKeys.length - new Set(sessionKeys).size;
const durationConflict = groupRecords.find(
    (record) => record.groupExperienceSeq === "1",
);

assert(shortRecords.length === 4, `Expected 4 short experiences, got ${shortRecords.length}`);
assert(regularRecords.length === 4, `Expected 4 regular course runs, got ${regularRecords.length}`);
assert(groupRecords.length === 4, `Expected 4 group experiences, got ${groupRecords.length}`);
assert(
    shortRecords.some((record) => record.sessions.length > 1),
    "ShortExperience 1:N session example was lost",
);
assert(sessionKeys.length === 7, `Expected 7 session child keys, got ${sessionKeys.length}`);
assert(canonicalKeyDuplicate === 0, "Duplicate Offering canonical key found");
assert(sourceIdentityDuplicate === 0, "Duplicate source identity found");
assert(sessionChildKeyDuplicate === 0, "Duplicate session child key found");
assert(relationCounts.matched === 12, "Expected 12 matched Venue relations");
assert(relationCounts.unmatched === 0, "Unexpected unmatched Venue relation");
assert(relationCounts.ambiguous === 0, "Unexpected ambiguous Venue relation");
assert(provenanceMissing === 0, "Dry-run provenance is incomplete");
assert(snapshotRecords === 8, `Expected 8 snapshot records, got ${snapshotRecords}`);
assert(mutableCanonicalFields === 0, "Mutable application state leaked into canonical fields");
assert(fakeGroupDetailUrls === 0, "Invented group detail URL found");
assert(
    detailCounts.available === 4 &&
        detailCounts.redirected === 4 &&
        detailCounts.unavailable === 4,
    "Unexpected detailStatus distribution",
);
assert(
    countBy(records, (record) => record.detailStatus === "redirected" && record.currentActionUrl) === 0,
    "Redirected detail URL is exposed as current action",
);
assert(
    durationConflict?.validationIssues?.some(
        (issue) => issue.code === "durationDisplayConflict",
    ) && durationConflict.derived?.durationMinutes === 90,
    "Known group duration conflict was not preserved",
);

const emptySessionSource = {
    ...pilot.records.find((record) => record.sourceEntityType === "shortExperience"),
    canonicalKey: `${EXPECTED_SOURCE}:short-experience:999999`,
    shortExperienceSeq: "999999",
    shortExperienceScheduleSeqs: [],
    schedule: [],
    sourceSnapshot: undefined,
};
assert(
    transformShortExperience(emptySessionSource).sessions.length === 0,
    "Schema must accept a ShortExperience offering with zero sessions",
);

const regularSource = pilot.records.find(
    (record) => record.sourceEntityType === "regularCourseRun",
);
const repeatedCourseRuns = ["999998", "999999"].map((scheduleSeq) =>
    transformRegularCourseRun({
        ...regularSource,
        canonicalKey: `${EXPECTED_SOURCE}:regular-course-run:${scheduleSeq}`,
        regularCourseScheduleSeq: scheduleSeq,
        regularCourseSeq: "777777",
        officialUrl: `https://www.koreatemplefood.com/program/course/regular-course/detail/${scheduleSeq}`,
        applicationUrl: `https://www.koreatemplefood.com/program/course/regular-course/form/${scheduleSeq}`,
    }),
);
assert(
    repeatedCourseRuns.length === 2 &&
        new Set(repeatedCourseRuns.map((record) => record.canonicalKey)).size === 2 &&
        new Set(repeatedCourseRuns.map((record) => record.regularCourseSeq)).size === 1,
    "Multiple runs under one REGULAR_COURSE_SEQ must remain distinct",
);

console.log(
    JSON.stringify(
        {
            totalOffering: records.length,
            family: {
                shortExperience: shortRecords.length,
                regularCourseRun: regularRecords.length,
                groupExperience: groupRecords.length,
            },
            identity: {
                offeringCanonicalKeyDuplicate: canonicalKeyDuplicate,
                sessionChildKeyDuplicate,
                sourceIdentityDuplicate,
                sessionChildKeys: sessionKeys.length,
            },
            shortExperience: {
                oneToManyPreserved: countBy(
                    shortRecords,
                    (record) => record.sessions.length > 1,
                ),
                zeroSessionSchemaAllowed: true,
            },
            regularCourseRun: {
                courseIdPreserved: regularRecords.length,
                scheduleIdCanonicalIdentity: regularRecords.length,
                repeatedCourseRunsAllowed: true,
            },
            groupExperience: {
                fakeDetailUrls: fakeGroupDetailUrls,
            },
            detailStatus: detailCounts,
            snapshot: {
                records: snapshotRecords,
                mutableCanonicalFields,
            },
            venueRelation: relationCounts,
            provenanceMissing,
            validationIssues: {
                durationConflictPreserved: true,
                durationMinutesDerived: durationConflict.derived.durationMinutes,
            },
        },
        null,
        2,
    ),
);
