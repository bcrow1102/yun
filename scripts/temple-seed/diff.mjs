import { readFile } from "node:fs/promises";

const [previousPath, nextPath] = process.argv.slice(2);
if (!previousPath || !nextPath) {
    throw new Error(
        "사용법: node scripts/temple-seed/diff.mjs <previous.json> <next.json>",
    );
}

const [previous, next] = await Promise.all([
    readFile(previousPath, "utf8").then(JSON.parse),
    readFile(nextPath, "utf8").then(JSON.parse),
]);
const previousBySlug = new Map(
    previous.records.map((record) => [record.slug, record]),
);
const nextBySlug = new Map(next.records.map((record) => [record.slug, record]));
const fields = [
    "name",
    "sido",
    "sigungu",
    "address",
    "latitude",
    "longitude",
    "matchStatus",
];

const added = next.records
    .filter((record) => !previousBySlug.has(record.slug))
    .map((record) => ({ slug: record.slug, name: record.name }));
const removedCandidates = previous.records
    .filter((record) => !nextBySlug.has(record.slug))
    .map((record) => ({ slug: record.slug, name: record.name }));
const changed = next.records.flatMap((record) => {
    const oldRecord = previousBySlug.get(record.slug);
    if (!oldRecord) {
        return [];
    }

    const changes = Object.fromEntries(
        fields
            .filter((field) => oldRecord[field] !== record[field])
            .map((field) => [
                field,
                { before: oldRecord[field], after: record[field] },
            ]),
    );
    const oldSourceId = oldRecord.localData?.sourceId ?? null;
    const nextSourceId = record.localData?.sourceId ?? null;
    if (oldSourceId !== nextSourceId) {
        changes.localDataSourceId = {
            before: oldSourceId,
            after: nextSourceId,
        };
    }

    return Object.keys(changes).length > 0
        ? [{ slug: record.slug, name: record.name, changes }]
        : [];
});

console.log(
    JSON.stringify(
        {
            added,
            removedCandidates,
            changed,
            note: "removedCandidates는 자동 삭제하지 않고 review 대상으로만 사용합니다.",
        },
        null,
        2,
    ),
);
