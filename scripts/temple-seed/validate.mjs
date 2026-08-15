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
