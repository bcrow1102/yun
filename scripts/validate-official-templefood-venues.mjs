import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const productionPath = path.join(
    repositoryRoot,
    "data/temples/generated/official-templefood-venues.runtime.json",
);
const nationwideRuntimePath = path.join(
    repositoryRoot,
    "data/temples/generated/nationwide-temples.runtime.json",
);
const nonMcstTemplePath = path.join(
    repositoryRoot,
    "app/temples/guide/non-mcst-temples.ts",
);

const EXPECTED_SOURCE =
    "대한불교조계종 한국불교문화사업단 한국사찰음식 공식 사이트";
const EXPECTED_EDUCATION_TEMPLES = new Set(["동화사", "봉녕사", "영선사"]);
const EXPECTED_INSTITUTIONS = new Set([
    "한국사찰음식문화체험관",
    "사찰음식교육관 향적세계",
    "세종전통문화체험관",
]);

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function countBy(records, predicate) {
    return records.filter(predicate).length;
}

function isIsoDate(value) {
    return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

const [stagingSource, nationwideSource, nonMcstSource] = await Promise.all([
    readFile(productionPath, "utf8"),
    readFile(nationwideRuntimePath, "utf8"),
    readFile(nonMcstTemplePath, "utf8"),
]);
const staging = JSON.parse(stagingSource);
const nationwide = JSON.parse(nationwideSource);
const records = staging.records;

assert(staging.schemaVersion === 1, "Unexpected TempleFood Venue schema version");
assert(Array.isArray(records), "TempleFood Venue records must be an array");

const nationwideSlugs = nationwide.records.map((temple) => temple.slug);
const nonMcstSlugs = Array.from(
    nonMcstSource.matchAll(/(?:"slug"|slug):\s*"([^"]+)"/g),
    (match) => match[1],
);
const canonicalSlugs = [...nationwideSlugs, ...nonMcstSlugs];
const canonicalSlugSet = new Set(canonicalSlugs);

assert(nationwideSlugs.length === 991, `Expected 991 nationwide Temples, got ${nationwideSlugs.length}`);
assert(nonMcstSlugs.length === 36, `Expected 36 non-MCST Temples, got ${nonMcstSlugs.length}`);
assert(canonicalSlugs.length === 1027, `Expected 1027 canonical Temples, got ${canonicalSlugs.length}`);
assert(canonicalSlugSet.size === 1027, "Canonical Temple slugs must be unique");

for (const record of records) {
    assert(record.source === EXPECTED_SOURCE, `${record.officialName}: invalid source`);
    assert(record.officialName, "Every Venue needs officialName");
    assert(record.officialUrl, `${record.officialName}: missing officialUrl`);
    assert(/^https?:\/\//.test(record.officialUrl), `${record.officialName}: invalid officialUrl`);
    assert(isIsoDate(record.checkedAt), `${record.officialName}: invalid checkedAt`);
    assert(isIsoDate(record.lastSeenAt), `${record.officialName}: invalid lastSeenAt`);
    assert(record.address && record.sido && record.sigungu, `${record.officialName}: incomplete region`);

    if (record.operatorType === "temple") {
        assert(
            record.relationStatus === "matched" || record.relationStatus === "unmatched",
            `${record.officialName}: invalid Temple relation status`,
        );
        if (record.relationStatus === "matched") {
            assert(record.templeSlug, `${record.officialName}: matched Temple needs templeSlug`);
            assert(
                canonicalSlugSet.has(record.templeSlug),
                `${record.officialName}: unknown canonical Temple slug ${record.templeSlug}`,
            );
        } else {
            assert(!record.templeSlug, `${record.officialName}: unmatched Temple cannot have templeSlug`);
        }
    } else {
        assert(record.operatorType === "institution", `${record.officialName}: invalid operatorType`);
        assert(record.relationStatus === "notApplicable", `${record.officialName}: Institution relation must be notApplicable`);
        assert(!record.templeSlug, `${record.officialName}: Institution cannot have templeSlug`);
    }

    if (record.educationInstitution) {
        assert(record.officialId, `${record.officialName}: education Institution needs officialId`);
    }
}

const venueIdentities = records.map((record) =>
    record.officialId
        ? `${record.source}:institution:${record.officialId}`
        : `${record.source}:venue:${record.officialName}:${record.address}`,
);
const duplicateVenueIdentityCount = venueIdentities.length - new Set(venueIdentities).size;
const officialNames = records.map((record) => record.officialName);
const duplicateOfficialNameCount = officialNames.length - new Set(officialNames).size;
const officialIds = records
    .filter((record) => record.officialId)
    .map((record) => `${record.source}:institution:${record.officialId}`);
const duplicateOfficialIdCount = officialIds.length - new Set(officialIds).size;

const templeRecords = records.filter((record) => record.operatorType === "temple");
const institutionRecords = records.filter((record) => record.operatorType === "institution");
const matchedRecords = templeRecords.filter((record) => record.relationStatus === "matched");
const unmatchedRecords = templeRecords.filter((record) => record.relationStatus === "unmatched");
const educationTempleNames = new Set(
    templeRecords
        .filter((record) => record.educationInstitution)
        .map((record) => record.officialName),
);
const institutionNames = new Set(institutionRecords.map((record) => record.officialName));

assert(records.length === 18, `Expected 18 Venues, got ${records.length}`);
assert(templeRecords.length === 15, `Expected 15 Temple Venues, got ${templeRecords.length}`);
assert(institutionRecords.length === 3, `Expected 3 Institution Venues, got ${institutionRecords.length}`);
assert(matchedRecords.length === 15, `Expected 15 Temple relations, got ${matchedRecords.length}`);
assert(unmatchedRecords.length === 0, `Expected no unmatched Temples, got ${unmatchedRecords.length}`);
assert(
    countBy(records, (record) => record.specialtyTemple) === 15,
    "Expected 15 specialty Temples",
);
assert(
    countBy(records, (record) => record.educationInstitution) === 6,
    "Expected 6 education Institutions",
);
assert(
    educationTempleNames.size === EXPECTED_EDUCATION_TEMPLES.size &&
        [...EXPECTED_EDUCATION_TEMPLES].every((name) => educationTempleNames.has(name)),
    "Education Temple overlap is incorrect",
);
assert(
    institutionNames.size === EXPECTED_INSTITUTIONS.size &&
        [...EXPECTED_INSTITUTIONS].every((name) => institutionNames.has(name)),
    "Institution Venue inventory is incorrect",
);
assert(duplicateVenueIdentityCount === 0, "Duplicate Venue identity found");
assert(duplicateOfficialNameCount === 0, "Duplicate Venue officialName found");
assert(duplicateOfficialIdCount === 0, "Duplicate education Institution officialId found");
assert(countBy(records, (record) => record.relationStatus === "ambiguous") === 0, "Ambiguous relation found");

console.log(
    JSON.stringify(
        {
            venues: records.length,
            temple: templeRecords.length,
            institution: institutionRecords.length,
            matchedTempleRelations: matchedRecords.length,
            unmatchedTempleRelations: unmatchedRecords.length,
            unmatchedNames: [],
            specialtyTemple: countBy(records, (record) => record.specialtyTemple),
            educationInstitution: countBy(records, (record) => record.educationInstitution),
            duplicateVenueIdentity: duplicateVenueIdentityCount,
            duplicateOfficialName: duplicateOfficialNameCount,
            duplicateOfficialId: duplicateOfficialIdCount,
            ambiguousRelation: 0,
            canonicalTempleSlugsValidated: canonicalSlugSet.size,
        },
        null,
        2,
    ),
);
