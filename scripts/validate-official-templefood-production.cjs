const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");

require.extensions[".ts"] = (module, filename) => {
    const source = fs.readFileSync(filename, "utf8");
    const { outputText } = ts.transpileModule(source, {
        compilerOptions: {
            esModuleInterop: true,
            module: ts.ModuleKind.CommonJS,
            resolveJsonModule: true,
            target: ts.ScriptTarget.ES2022,
        },
        fileName: filename,
    });
    module._compile(outputText, filename);
};

const {
    getTempleFoodOfferingByKey,
    getTempleFoodOfferingsBySubtype,
    getTempleFoodOfferingsByVenue,
    getTempleFoodVenueByOfficialId,
    getTempleFoodVenueForOffering,
    getTempleForFoodVenue,
    templeFoodCanonicalReport,
    templeFoodOfferings,
    templeFoodVenues,
} = require("../data/temples/temple-food.ts");

assert.equal(templeFoodCanonicalReport.venueCount, 18);
assert.equal(templeFoodCanonicalReport.templeVenueCount, 15);
assert.equal(templeFoodCanonicalReport.institutionVenueCount, 3);
assert.equal(templeFoodCanonicalReport.matchedTempleRelationCount, 15);
assert.equal(templeFoodCanonicalReport.offeringCount, 1237);
assert.deepEqual(templeFoodCanonicalReport.subtypeCounts, {
    shortExperience: 1113,
    regularCourseRun: 120,
    groupExperience: 4,
});
assert.equal(templeFoodCanonicalReport.matchedOfferingRelationCount, 1237);
assert.equal(templeFoodCanonicalReport.canonicalKeyDuplicateCount, 0);
assert.equal(templeFoodCanonicalReport.sourceIdentityDuplicateCount, 0);
assert.equal(templeFoodCanonicalReport.sessionChildDuplicateCount, 0);
assert.equal(templeFoodCanonicalReport.provenanceMissingCount, 0);
assert.equal(templeFoodCanonicalReport.invalidCurrentActionUrlCount, 0);
assert.equal(templeFoodCanonicalReport.fakeDetailUrlCount, 0);
assert.equal(templeFoodCanonicalReport.identityRelationHighSeverityCount, 0);

assert.equal(templeFoodVenues.length, 18);
assert.equal(templeFoodOfferings.length, 1237);
assert.equal(getTempleFoodOfferingsBySubtype("shortExperience").length, 1113);
assert.equal(getTempleFoodOfferingsBySubtype("regularCourseRun").length, 120);
assert.equal(getTempleFoodOfferingsBySubtype("groupExperience").length, 4);

for (const venue of templeFoodVenues) {
    assert.equal(
        getTempleForFoodVenue(venue) !== undefined,
        venue.operatorType === "temple",
    );
}

for (const offering of templeFoodOfferings) {
    const venue = getTempleFoodVenueForOffering(offering);
    assert.ok(venue, `Offering ${offering.canonicalKey} must resolve a Venue`);
    assert.ok(
        getTempleFoodOfferingsByVenue(venue).includes(offering),
        `Venue lookup must contain ${offering.canonicalKey}`,
    );
}

const schedule250 = getTempleFoodOfferingByKey(
    "korean-temple-food:regular-course-run:250",
);
assert.equal(schedule250?.subtype, "regularCourseRun");
assert.equal(schedule250?.regularCourseScheduleSeq, "250");
assert.equal(schedule250?.regularCourseSeq, "150");
assert.equal(
    getTempleFoodVenueForOffering(schedule250)?.canonicalKey,
    "korean-temple-food:venue:1",
);
assert.equal(getTempleFoodVenueByOfficialId("1")?.operatorType, "institution");

console.log(JSON.stringify(templeFoodCanonicalReport, null, 2));
