import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const seed = JSON.parse(
    await readFile(
        path.join(
            root,
            "data/temples/generated/nationwide-temples.json",
        ),
        "utf8",
    ),
);

const failures = [];
const expectedExisting = new Map([
    [1, "bongeunsa"],
    [49, "jogyesa"],
    [310, "woljeongsa"],
    [714, "bulguksa"],
    [932, "tongdosa"],
    [976, "haeinsa"],
]);
const verifiedSourceOnlyMatches = new Map([
    [283, { name: "계조암", sourceId: "localdata:6530000:4231000-002" }],
    [299, { name: "보문사", sourceId: "localdata:6530000:4191000-001" }],
    [458, { name: "은석사", sourceId: "localdata:4490000:CDFD1003" }],
    [465, { name: "태을암", sourceId: "localdata:6440000:4620000-001" }],
    [715, { name: "석굴암", sourceId: "localdata:6470000:5050000-002" }],
    [635, { name: "달성사", sourceId: "localdata:5780000:CDFD1002" }],
    [638, { name: "도덕사", sourceId: "localdata:6130000:5880000-004", alias: "도덕사(제86호)" }],
    [675, { name: "성도사", sourceId: "localdata:6130000:5870000-009", alias: "성도사(제84호)" }],
]);

function check(condition, message) {
    if (!condition) {
        failures.push(message);
    }
}

check(seed.records.length === 991, "canonical count must be 991");
check(
    seed.report.matchedWithCoordinatesCount +
        seed.report.matchedWithoutCoordinatesCount +
        seed.report.officialUnmatchedCount ===
        991,
    "A + B + C must equal 991",
);

const slugs = new Set();
const sourceIds = new Set();
for (const record of seed.records) {
    check(!slugs.has(record.slug), `duplicate slug: ${record.slug}`);
    slugs.add(record.slug);

    const expectedSlug = expectedExisting.get(record.mcst.recordNo);
    if (expectedSlug) {
        check(
            record.slug === expectedSlug &&
                record.existingSlug === expectedSlug,
            `existing canonical changed: MCST #${record.mcst.recordNo}`,
        );
    }

    const hasLatitude = record.latitude !== null;
    const hasLongitude = record.longitude !== null;
    check(
        hasLatitude === hasLongitude,
        `partial coordinate: ${record.slug}`,
    );
    if (hasLatitude && hasLongitude) {
        check(
            record.latitude >= 32 &&
                record.latitude <= 39.5 &&
                record.longitude >= 123 &&
                record.longitude <= 132,
            `coordinate outside Korea sanity bounds: ${record.slug}`,
        );
    }

    if (record.localData) {
        const expectedSourceId = `localdata:${record.localData.localGovCode}:${record.localData.managementNo}`;
        check(
            record.localData.sourceId === expectedSourceId,
            `invalid LOCALDATA identity: ${record.slug}`,
        );
        check(
            !sourceIds.has(expectedSourceId),
            `duplicate source link: ${expectedSourceId}`,
        );
        sourceIds.add(expectedSourceId);
    }
}

const baegyulsa = seed.records.find(
    (record) => record.mcst.recordNo === 710,
);
check(
    baegyulsa?.name === "백율사" &&
        baegyulsa.aliases?.includes("백률사"),
    "백율사/백률사 alias is missing",
);

for (const [recordNo, expected] of verifiedSourceOnlyMatches) {
    const record = seed.records.find(
        (candidate) => candidate.mcst.recordNo === recordNo,
    );
    check(record?.name === expected.name, `MCST name changed: #${recordNo}`);
    check(
        record?.localData?.sourceId === expected.sourceId,
        `verified source mismatch: #${recordNo}`,
    );
    check(
        record?.address === record?.mcst.address,
        `MCST address was overwritten: #${recordNo}`,
    );
    check(
        record?.latitude === null && record?.longitude === null,
        `coordinates changed for source-only match: #${recordNo}`,
    );
    check(
        record?.matchStatus === "matched_without_coordinates",
        `source-only match status must be B: #${recordNo}`,
    );
    if (expected.alias) {
        check(
            record?.aliases?.includes(expected.alias),
            `verified alias missing: #${recordNo}`,
        );
    }
}

const seokguram715 = seed.records.find(
    (record) => record.mcst.recordNo === 715,
);
const seokguram738 = seed.records.find(
    (record) => record.mcst.recordNo === 738,
);
check(
    Boolean(
        seokguram715 &&
            seokguram738 &&
            seokguram715.slug !== seokguram738.slug &&
            seokguram715.localData?.sourceId !==
                seokguram738.localData?.sourceId,
    ),
    "MCST #715 and #738 must remain independent canonicals",
);

const relationFiles = await Promise.all(
    [
        "app/temples/stay/data.ts",
        "app/events/data.ts",
        "app/temples/food/data.ts",
    ].map((file) => readFile(path.join(root, file), "utf8")),
);
for (const slug of ["woljeongsa", "haeinsa", "tongdosa"]) {
    check(
        relationFiles.some((source) => source.includes(`"${slug}"`)),
        `relation baseline slug missing: ${slug}`,
    );
}

if (failures.length > 0) {
    console.error(JSON.stringify({ failures }, null, 2));
    process.exitCode = 1;
} else {
    console.log(
        JSON.stringify(
            {
                ok: true,
                report: seed.report,
                existingSlugs: [...expectedExisting.values()],
            },
            null,
            2,
        ),
    );
}
