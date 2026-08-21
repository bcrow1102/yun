import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

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
const GROUP_LIST_URL =
    "https://www.koreatemplefood.com/program/experience/group-experience/list";
const EXPECTED_GROUP_IDS = new Set(["1", "9", "11", "12"]);
const EXPECTED_TYPES = new Set([
    "shortExperience",
    "regularCourseRun",
    "groupExperience",
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

const [pilotSource, venueSource] = await Promise.all([
    readFile(pilotPath, "utf8"),
    readFile(venuePath, "utf8"),
]);
const pilot = JSON.parse(pilotSource);
const venueStaging = JSON.parse(venueSource);
const records = pilot.records;
const venues = venueStaging.records;

assert(pilot.schemaVersion === 1, "Unexpected pilot schema version");
assert(Array.isArray(records), "Pilot records must be an array");
assert(records.length === 12, `Expected 12 pilot records, got ${records.length}`);

const venuesByOfficialId = new Map(
    venues
        .filter((venue) => venue.officialId)
        .map((venue) => [venue.officialId, venue]),
);

const sourceIdentities = [];
const relationCounts = {
    matched: 0,
    unmatched: 0,
    ambiguous: 0,
};
const unmatchedVenueCandidates = new Set();
let provenanceMissing = 0;
let regularCourseIdentityPairs = 0;
let shortScheduleIdsPreserved = 0;
let nonexistentGroupDetailUrls = 0;
let snapshotRecords = 0;

for (const record of records) {
    assert(record.source === EXPECTED_SOURCE, `${record.canonicalKey}: invalid source`);
    assert(EXPECTED_TYPES.has(record.sourceEntityType), `${record.canonicalKey}: invalid sourceEntityType`);
    assert(record.officialName, `${record.canonicalKey}: missing officialName`);
    assert(record.sourceDisplayName, `${record.canonicalKey}: missing sourceDisplayName`);
    assert(isOfficialUrl(record.officialUrl), `${record.canonicalKey}: invalid officialUrl`);
    assert(isIsoDate(record.checkedAt), `${record.canonicalKey}: invalid checkedAt`);
    assert(isIsoDate(record.lastSeenAt), `${record.canonicalKey}: invalid lastSeenAt`);

    if (
        !record.sourceProvenance?.listUrl ||
        !record.sourceProvenance?.detailPageStatus ||
        !Array.isArray(record.sourceProvenance?.observedSourceFields)
    ) {
        provenanceMissing += 1;
    }
    assert(isOfficialUrl(record.sourceProvenance?.listUrl), `${record.canonicalKey}: invalid provenance listUrl`);

    const relationStatus = record.venueRelation?.status;
    assert(
        relationStatus === "matched" ||
            relationStatus === "unmatched" ||
            relationStatus === "ambiguous",
        `${record.canonicalKey}: invalid Venue relation status`,
    );
    relationCounts[relationStatus] += 1;

    if (relationStatus === "matched") {
        const venue = venuesByOfficialId.get(record.venueRelation.venueOfficialId);
        assert(venue, `${record.canonicalKey}: unknown Venue officialId`);
        assert(
            venue.officialName === record.venueRelation.venueOfficialName,
            `${record.canonicalKey}: Venue name mismatch`,
        );
    } else if (relationStatus === "unmatched") {
        unmatchedVenueCandidates.add(record.venueRelation.venueOfficialName);
    }

    if (record.sourceSnapshot) {
        snapshotRecords += 1;
        assert(
            isIsoDate(record.sourceSnapshot.checkedAt),
            `${record.canonicalKey}: status snapshot needs checkedAt`,
        );
        assert(
            record.sourceSnapshot.applicationStatusText,
            `${record.canonicalKey}: snapshot missing source status text`,
        );
    }

    switch (record.sourceEntityType) {
        case "shortExperience": {
            assert(/^\d+$/.test(record.shortExperienceSeq), `${record.canonicalKey}: missing SHORT_EXPERIENCE_SEQ`);
            assert(
                Array.isArray(record.shortExperienceScheduleSeqs) &&
                    record.shortExperienceScheduleSeqs.length > 0,
                `${record.canonicalKey}: source schedule IDs were lost`,
            );
            assert(
                Array.isArray(record.schedule) &&
                    record.schedule.every((item) =>
                        record.shortExperienceScheduleSeqs.includes(
                            item.shortExperienceScheduleSeq,
                        ),
                    ),
                `${record.canonicalKey}: schedule relation is inconsistent`,
            );
            assert(
                record.canonicalKey ===
                    `${EXPECTED_SOURCE}:short-experience:${record.shortExperienceSeq}`,
                `${record.canonicalKey}: invalid short-experience canonical key`,
            );
            assert(
                record.officialUrl.endsWith(`/detail/${record.shortExperienceSeq}`),
                `${record.canonicalKey}: official detail URL does not preserve source ID`,
            );
            assert(
                record.sourceProvenance.observedSourceFields.includes(
                    "SHORT_EXPERIENCE_SEQ",
                ) &&
                    record.sourceProvenance.observedSourceFields.includes(
                        "SHORT_EXPERIENCE_SCHEDULE_SEQ",
                    ),
                `${record.canonicalKey}: short-experience provenance fields missing`,
            );
            sourceIdentities.push(
                `${EXPECTED_SOURCE}:short-experience:${record.shortExperienceSeq}`,
            );
            shortScheduleIdsPreserved += record.shortExperienceScheduleSeqs.length;
            break;
        }
        case "regularCourseRun": {
            assert(/^\d+$/.test(record.regularCourseSeq), `${record.canonicalKey}: missing REGULAR_COURSE_SEQ`);
            assert(/^\d+$/.test(record.regularCourseScheduleSeq), `${record.canonicalKey}: missing REGULAR_COURSE_SCHEDULE_SEQ`);
            assert(
                record.canonicalKey ===
                    `${EXPECTED_SOURCE}:regular-course-run:${record.regularCourseScheduleSeq}`,
                `${record.canonicalKey}: run identity must use schedule ID`,
            );
            assert(
                record.officialUrl.endsWith(
                    `/detail/${record.regularCourseScheduleSeq}`,
                ),
                `${record.canonicalKey}: detail URL must use schedule ID`,
            );
            assert(
                record.sourceProvenance.observedSourceFields.includes(
                    "REGULAR_COURSE_SEQ",
                ) &&
                    record.sourceProvenance.observedSourceFields.includes(
                        "REGULAR_COURSE_SCHEDULE_SEQ",
                    ),
                `${record.canonicalKey}: regular-course provenance fields missing`,
            );
            sourceIdentities.push(
                `${EXPECTED_SOURCE}:regular-course-run:${record.regularCourseScheduleSeq}`,
            );
            regularCourseIdentityPairs += 1;
            break;
        }
        case "groupExperience": {
            assert(/^\d+$/.test(record.groupExperienceSeq), `${record.canonicalKey}: missing GROUP_EXPERIENCE_SEQ`);
            assert(
                record.canonicalKey ===
                    `${EXPECTED_SOURCE}:group-experience:${record.groupExperienceSeq}`,
                `${record.canonicalKey}: invalid group-experience canonical key`,
            );
            assert(
                record.officialUrl === GROUP_LIST_URL,
                `${record.canonicalKey}: group experience must retain list URL`,
            );
            assert(
                record.sourceProvenance.detailPageStatus === "notProvided",
                `${record.canonicalKey}: group detail page must not be invented`,
            );
            assert(
                record.applicationUrl ===
                    `${GROUP_LIST_URL.replace(/\/list$/, "/form")}/${record.groupExperienceSeq}`,
                `${record.canonicalKey}: invalid official group application URL`,
            );
            if (/\/detail\//.test(record.officialUrl)) {
                nonexistentGroupDetailUrls += 1;
            }
            sourceIdentities.push(
                `${EXPECTED_SOURCE}:group-experience:${record.groupExperienceSeq}`,
            );
            break;
        }
    }
}

const canonicalKeys = records.map((record) => record.canonicalKey);
const sourceIdentityDuplicateCount =
    sourceIdentities.length - new Set(sourceIdentities).size;
const canonicalKeyDuplicateCount =
    canonicalKeys.length - new Set(canonicalKeys).size;
const shortRecords = records.filter(
    (record) => record.sourceEntityType === "shortExperience",
);
const regularRecords = records.filter(
    (record) => record.sourceEntityType === "regularCourseRun",
);
const groupRecords = records.filter(
    (record) => record.sourceEntityType === "groupExperience",
);
const groupIds = new Set(groupRecords.map((record) => record.groupExperienceSeq));

assert(shortRecords.length === 4, `Expected 4 short experiences, got ${shortRecords.length}`);
assert(regularRecords.length === 4, `Expected 4 regular course runs, got ${regularRecords.length}`);
assert(groupRecords.length === 4, `Expected 4 group experiences, got ${groupRecords.length}`);
assert(
    countBy(shortRecords, (record) => record.pilotSelection === "currentOrRecent") === 2 &&
        countBy(shortRecords, (record) => record.pilotSelection === "archive") === 2,
    "Short-experience current/archive pilot split is incorrect",
);
assert(
    countBy(regularRecords, (record) => record.pilotSelection === "currentOrRecent") === 2 &&
        countBy(regularRecords, (record) => record.pilotSelection === "archive") === 2,
    "Regular-course current/archive pilot split is incorrect",
);
assert(
    groupIds.size === EXPECTED_GROUP_IDS.size &&
        [...EXPECTED_GROUP_IDS].every((id) => groupIds.has(id)),
    "Current group-experience inventory must contain IDs 1, 9, 11, and 12",
);
assert(sourceIdentityDuplicateCount === 0, "Duplicate namespaced source identity found");
assert(canonicalKeyDuplicateCount === 0, "Duplicate canonical key found");
assert(provenanceMissing === 0, "Pilot provenance is incomplete");
assert(regularCourseIdentityPairs === 4, "Course/run identity separation was not validated");
assert(shortScheduleIdsPreserved === 7, "Short-experience schedule IDs were not preserved");
assert(nonexistentGroupDetailUrls === 0, "Invented group-experience detail URL found");

console.log(
    JSON.stringify(
        {
            total: records.length,
            shortExperience: shortRecords.length,
            regularCourseRun: regularRecords.length,
            groupExperience: groupRecords.length,
            shortCurrentOrRecent: countBy(
                shortRecords,
                (record) => record.pilotSelection === "currentOrRecent",
            ),
            shortArchive: countBy(
                shortRecords,
                (record) => record.pilotSelection === "archive",
            ),
            regularCurrentOrRecent: countBy(
                regularRecords,
                (record) => record.pilotSelection === "currentOrRecent",
            ),
            regularArchive: countBy(
                regularRecords,
                (record) => record.pilotSelection === "archive",
            ),
            sourceIdentityDuplicate: sourceIdentityDuplicateCount,
            canonicalKeyDuplicate: canonicalKeyDuplicateCount,
            provenanceMissing,
            regularCourseIdentityPairs,
            shortScheduleIdsPreserved,
            nonexistentGroupDetailUrls,
            venueRelation: relationCounts,
            unmatchedVenueCandidates: [...unmatchedVenueCandidates],
            snapshotRecords,
        },
        null,
        2,
    ),
);
