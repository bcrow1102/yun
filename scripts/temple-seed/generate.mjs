import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

import proj4 from "proj4";

const root = process.cwd();
const checkOnly = process.argv.includes("--check");
const rawDirectory = path.join(root, "data/temples/raw");
const generatedDirectory = path.join(root, "data/temples/generated");
const mcst = JSON.parse(
    await readFile(
        path.join(rawDirectory, "mcst-2026-06-01.json"),
        "utf8",
    ),
);
const localData = JSON.parse(
    await readFile(
        path.join(rawDirectory, "localdata-2026-08-15.json"),
        "utf8",
    ),
);
const overrides = JSON.parse(
    await readFile(
        path.join(root, "data/temples/match-overrides.json"),
        "utf8",
    ),
);

const EXISTING_SLUGS = new Map([
    [1, "bongeunsa"],
    [49, "jogyesa"],
    [310, "woljeongsa"],
    [714, "bulguksa"],
    [932, "tongdosa"],
    [976, "haeinsa"],
]);

const STAGING_SLUGS = new Map([
    [4, "samsungam-seoul"],
    [22, "doansa-seoul"],
    [32, "okcheonam-seoul"],
    [50, "geumseonsa"],
    [53, "inwangsa"],
    [300, "baekdamsa"],
    [301, "oseam"],
    [302, "bongjeongam"],
    [351, "beopjusa-boeun"],
    [352, "sujeongam-boeun"],
    [353, "sanghwanam-boeun"],
    [354, "bokcheonam-boeun"],
    [355, "dongam-boeun"],
    [630, "bogwangsa-damyang"],
    [631, "yonghwasa-damyang"],
    [632, "yongchusa-damyang"],
    [633, "boriam-damyang"],
    [634, "yongheungsa-damyang"],
    [710, "baegyulsa"],
]);

const MCST_LOCATION_CORRECTIONS = new Map([
    [93, { sigungu: "영도구", reason: "MCST 시군구 오기(염도구)" }],
    [94, { sigungu: "부산진구", reason: "MCST 축약 표기(진구)" }],
    [184, { sigungu: "군포시", reason: "MCST 시군구 오기(김포시)" }],
]);

const SIDO_ALIASES = new Map([
    ["서울특별시", "서울"],
    ["부산광역시", "부산"],
    ["대구광역시", "대구"],
    ["인천광역시", "인천"],
    ["광주광역시", "광주"],
    ["대전광역시", "대전"],
    ["울산광역시", "울산"],
    ["세종특별자치시", "세종"],
    ["세종특별시", "세종"],
    ["경기도", "경기"],
    ["강원특별자치도", "강원"],
    ["강원도", "강원"],
    ["충청북도", "충북"],
    ["충청남도", "충남"],
    ["전북특별자치도", "전북"],
    ["전라북도", "전북"],
    ["전라남도", "전남"],
    ["경상북도", "경북"],
    ["경상남도", "경남"],
    ["제주특별자치도", "제주"],
    ["제주도", "제주"],
]);

const EPSG_5174 =
    "+proj=tmerc +lat_0=38 +lon_0=127.002890277778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +towgs84=-145.907,505.034,685.756,-1.162,2.347,1.592,6.342 +units=m +no_defs +type=crs";
proj4.defs("EPSG:5174", EPSG_5174);

function sourceId(record) {
    return `localdata:${record.localGovCode}:${record.managementNo}`;
}

function normalizeName(value) {
    return value.normalize("NFKC").replace(/[\s·ㆍ.()（）,-]/g, "");
}

function normalizeAddress(value) {
    let normalized = value.normalize("NFKC");

    for (const [full, short] of SIDO_ALIASES) {
        normalized = normalized.replaceAll(full, short);
    }

    return normalized
        .replace(/산\s+(?=\d)/g, "산")
        .replace(/([0-9])\s+-\s+([0-9])/g, "$1-$2")
        .replace(/[()（）,·ㆍ.]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function compact(value) {
    return normalizeAddress(value).replace(/[\s-]/g, "");
}

function hasRegion(address, official) {
    const normalized = normalizeAddress(address);
    return (
        normalized.includes(official.sido) &&
        normalized.includes(official.sigungu)
    );
}

function addressFeatures(address, official) {
    const normalized = normalizeAddress(address)
        .replace(official.sido, " ")
        .replace(official.sigungu, " ");
    const tokens = normalized
        .split(/\s+/)
        .map((token) => token.trim())
        .filter((token) => token.length >= 2);
    const locality = normalized.match(/[가-힣0-9]+(?:읍|면|동|리|로|길)/g) ?? [];
    const numbers = normalized.match(/산?\d+(?:-\d+)?/g) ?? [];

    return {
        compact: compact(normalized),
        tokens: new Set(tokens),
        locality: new Set(locality),
        numbers: new Set(numbers),
    };
}

function intersectionCount(left, right) {
    return [...left].filter((value) => right.has(value)).length;
}

function scoreSingleAddress(officialAddress, localAddress, official) {
    if (!localAddress || !hasRegion(localAddress, official)) {
        return 0;
    }

    const left = addressFeatures(officialAddress, official);
    const right = addressFeatures(localAddress, official);

    if (left.compact === right.compact) {
        return 200;
    }

    let score = 0;
    if (
        left.compact.length >= 6 &&
        right.compact.length >= 6 &&
        (left.compact.includes(right.compact) ||
            right.compact.includes(left.compact))
    ) {
        score += 80;
    }

    score += intersectionCount(left.locality, right.locality) * 25;
    score += intersectionCount(left.numbers, right.numbers) * 20;
    score += intersectionCount(left.tokens, right.tokens) * 8;
    return score;
}

function addressScore(official, local) {
    return Math.max(
        scoreSingleAddress(official.address, local.roadAddress, official),
        scoreSingleAddress(official.address, local.lotAddress, official),
    );
}

function isUsableLocalData(record) {
    return (
        record.cancellation !== "Y" &&
        !record.cancellationDate &&
        record.businessStatus !== "폐업"
    );
}

function compareUpdated(left, right) {
    const leftUpdated = left.updatedAt || left.dataUpdatedAt || "";
    const rightUpdated = right.updatedAt || right.dataUpdatedAt || "";
    return rightUpdated.localeCompare(leftUpdated);
}

function sourcePreference(record) {
    let score = 0;
    if (/^CDFD/i.test(record.managementNo)) {
        score += 20;
    }
    if (toCoordinate(record.x) !== null && toCoordinate(record.y) !== null) {
        score += 5;
    }
    if (record.detailedStatus === "승인") {
        score += 2;
    }
    return score;
}

function localAddresses(record) {
    return [record.roadAddress, record.lotAddress]
        .filter(Boolean)
        .map(compact);
}

function recordsDescribeSamePlace(left, right, official) {
    const leftAddresses = new Set(localAddresses(left));
    const rightAddresses = new Set(localAddresses(right));
    if ([...leftAddresses].some((address) => rightAddresses.has(address))) {
        return true;
    }

    const leftX = toCoordinate(left.x);
    const leftY = toCoordinate(left.y);
    const rightX = toCoordinate(right.x);
    const rightY = toCoordinate(right.y);
    if (
        leftX !== null &&
        leftY !== null &&
        rightX !== null &&
        rightY !== null &&
        Math.hypot(leftX - rightX, leftY - rightY) <= 30
    ) {
        return true;
    }

    return (
        scoreSingleAddress(official.address, left.roadAddress, official) >=
            180 &&
        scoreSingleAddress(official.address, right.roadAddress, official) >=
            180
    );
}

function deduplicateLocalData(records) {
    const grouped = new Map();

    for (const record of records) {
        const id = sourceId(record);
        const existing = grouped.get(id);
        if (!existing || compareUpdated(record, existing) < 0) {
            grouped.set(id, record);
        }
    }

    return [...grouped.values()];
}

const usableLocalData = deduplicateLocalData(
    localData.records.filter(isUsableLocalData),
);
const localDataBySourceId = new Map(
    usableLocalData.map((record) => [sourceId(record), record]),
);

function chooseLocalData(official) {
    const override = overrides[String(official.recordNo)];

    if (override && "localDataSourceId" in override) {
        if (override.localDataSourceId === null) {
            return { record: undefined, method: "manual-unmatched" };
        }

        const record = localDataBySourceId.get(override.localDataSourceId);
        if (!record) {
            throw new Error(
                `Override source not found for MCST #${official.recordNo}: ${override.localDataSourceId}`,
            );
        }

        return { record, method: "manual-override" };
    }

    const candidates = usableLocalData
        .filter(
            (record) =>
                normalizeName(record.name) === normalizeName(official.name) &&
                hasRegion(record.roadAddress || record.lotAddress, official),
        )
        .map((record) => ({
            record,
            score: addressScore(official, record),
        }))
        .filter((candidate) => candidate.score >= 20)
        .sort(
            (left, right) =>
                right.score - left.score ||
                sourcePreference(right.record) -
                    sourcePreference(left.record) ||
                compareUpdated(left.record, right.record),
        );

    if (candidates.length === 0) {
        return { record: undefined, method: "no-safe-match" };
    }

    const leadingCandidates = candidates.filter(
        (candidate) => candidates[0].score - candidate.score < 10,
    );
    const samePlace = leadingCandidates.every((candidate) =>
        recordsDescribeSamePlace(
            candidates[0].record,
            candidate.record,
            official,
        ),
    );

    if (leadingCandidates.length > 1 && !samePlace) {
        return {
            record: undefined,
            method: "ambiguous",
            candidates: candidates.slice(0, 5),
        };
    }

    return {
        record: candidates[0].record,
        method: "automatic",
        score: candidates[0].score,
    };
}

function toCoordinate(value) {
    if (value === null || value === "") {
        return null;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
}

function convertCoordinates(localRecord) {
    if (!localRecord) {
        return { latitude: null, longitude: null, failure: undefined };
    }

    const x = toCoordinate(localRecord.x);
    const y = toCoordinate(localRecord.y);
    if (x === null || y === null) {
        return { latitude: null, longitude: null, failure: undefined };
    }

    const [longitude, latitude] = proj4("EPSG:5174", "EPSG:4326", [
        x,
        y,
    ]);
    const roundedLatitude = Number(latitude.toFixed(10));
    const roundedLongitude = Number(longitude.toFixed(10));

    if (
        roundedLatitude < 32 ||
        roundedLatitude > 39.5 ||
        roundedLongitude < 123 ||
        roundedLongitude > 132
    ) {
        return {
            latitude: null,
            longitude: null,
            failure: `대한민국 범위를 벗어난 변환 좌표: ${roundedLatitude}, ${roundedLongitude}`,
        };
    }

    return {
        latitude: roundedLatitude,
        longitude: roundedLongitude,
        failure: undefined,
    };
}

function chooseAddress(official, localRecord) {
    if (!localRecord) {
        return official.address;
    }

    const roadAddress = localRecord.roadAddress.trim();
    if (
        roadAddress &&
        hasRegion(roadAddress, official) &&
        addressScore(official, localRecord) >= 20
    ) {
        return roadAddress;
    }

    return official.address;
}

function slugFor(official) {
    return (
        EXISTING_SLUGS.get(official.recordNo) ??
        STAGING_SLUGS.get(official.recordNo) ??
        `traditional-temple-${String(official.recordNo).padStart(4, "0")}`
    );
}

const failures = [];
const review = [];
const unmatchedSuggestions = [];
const records = mcst.records.map((official) => {
    const locationCorrection = MCST_LOCATION_CORRECTIONS.get(
        official.recordNo,
    );
    const normalizedOfficial = locationCorrection
        ? { ...official, sigungu: locationCorrection.sigungu }
        : official;
    const match = chooseLocalData(normalizedOfficial);
    const override = overrides[String(official.recordNo)];
    const sourceCoordinates = convertCoordinates(match.record);
    const coordinates =
        override?.adoptCoordinates === false
            ? {
                  latitude: null,
                  longitude: null,
                  failure: undefined,
              }
            : sourceCoordinates;

    if (coordinates.failure) {
        failures.push({
            recordNo: official.recordNo,
            name: official.name,
            sido: official.sido,
            sigungu: official.sigungu,
            reason: coordinates.failure,
        });
    }

    if (match.method === "ambiguous") {
        review.push({
            recordNo: official.recordNo,
            name: official.name,
            sido: official.sido,
            sigungu: official.sigungu,
            reason: "동점에 가까운 LOCALDATA 후보가 여러 개임",
            candidates: match.candidates.map((candidate) => ({
                sourceId: sourceId(candidate.record),
                name: candidate.record.name,
                address:
                    candidate.record.roadAddress ||
                    candidate.record.lotAddress,
                score: candidate.score,
            })),
        });
    }

    if (match.method === "no-safe-match") {
        const suggestions = usableLocalData
            .filter((record) =>
                hasRegion(
                    record.roadAddress || record.lotAddress,
                    normalizedOfficial,
                ),
            )
            .map((record) => ({
                record,
                score: addressScore(normalizedOfficial, record),
            }))
            .filter(
                (candidate) =>
                    candidate.score >= 40 ||
                    normalizeName(candidate.record.name) ===
                        normalizeName(official.name),
            )
            .sort((left, right) => right.score - left.score)
            .slice(0, 5);

        unmatchedSuggestions.push({
            recordNo: official.recordNo,
            name: official.name,
            sido: official.sido,
            sigungu: official.sigungu,
            address: official.address,
            candidates: suggestions.map((candidate) => ({
                sourceId: sourceId(candidate.record),
                name: candidate.record.name,
                address:
                    candidate.record.roadAddress ||
                    candidate.record.lotAddress,
                score: candidate.score,
            })),
        });
    }

    const localSource = match.record
        ? {
              sourceId: sourceId(match.record),
              localGovCode: match.record.localGovCode,
              managementNo: match.record.managementNo,
              lotAddress: match.record.lotAddress,
              roadAddress: match.record.roadAddress || undefined,
              x: toCoordinate(match.record.x),
              y: toCoordinate(match.record.y),
              coordinateSystem: "EPSG:5174",
              updatedAt:
                  match.record.updatedAt || match.record.dataUpdatedAt,
              matchMethod: match.method,
          }
        : undefined;
    const matchStatus = match.record
        ? coordinates.latitude === null
            ? "matched_without_coordinates"
            : "matched_with_coordinates"
        : "official_unmatched";

    return {
        slug: slugFor(official),
        existingSlug: EXISTING_SLUGS.get(official.recordNo),
        name: official.name,
        aliases: override?.aliases,
        sido: official.sido,
        sigungu: normalizedOfficial.sigungu,
        address:
            override?.adoptAddress === false
                ? official.address
                : chooseAddress(normalizedOfficial, match.record),
        denomination: official.denomination,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        matchStatus,
        mcst: {
            recordNo: official.recordNo,
            asOf: mcst.source.asOf,
            address: official.address,
            denomination: official.denomination,
            locationCorrection: locationCorrection?.reason,
        },
        localData: localSource,
    };
});

const duplicateSlugs = records
    .filter(
        (record, index) =>
            records.findIndex((candidate) => candidate.slug === record.slug) !==
            index,
    )
    .map((record) => record.slug);
const duplicateCanonicalKeys = records
    .filter((record, index) => {
        const key = [
            normalizeName(record.name),
            record.sido,
            record.sigungu,
            compact(record.mcst.address),
        ].join("|");
        return (
            records.findIndex(
                (candidate) =>
                    [
                        normalizeName(candidate.name),
                        candidate.sido,
                        candidate.sigungu,
                        compact(candidate.mcst.address),
                    ].join("|") === key,
            ) !== index
        );
    })
    .map((record) => ({
        recordNo: record.mcst.recordNo,
        name: record.name,
        sido: record.sido,
        sigungu: record.sigungu,
        address: record.mcst.address,
    }));
const localDataUsage = new Map();
for (const record of records.filter((candidate) => candidate.localData)) {
    const linked = localDataUsage.get(record.localData.sourceId) ?? [];
    linked.push({ recordNo: record.mcst.recordNo, name: record.name });
    localDataUsage.set(record.localData.sourceId, linked);
}
const duplicateSourceLinks = [...localDataUsage]
    .filter(([, linked]) => linked.length > 1)
    .map(([sourceIdValue, linked]) => ({ sourceId: sourceIdValue, linked }));

if (records.length !== 991) {
    failures.push({ reason: `MCST canonical count is ${records.length}` });
}
if (duplicateSlugs.length > 0) {
    failures.push({ reason: `Duplicate slugs: ${duplicateSlugs.join(", ")}` });
}
if (duplicateSourceLinks.length > 0) {
    failures.push({
        reason: "A LOCALDATA source record is linked to multiple canonicals",
        duplicateSourceLinks,
    });
}

const countByStatus = (status) =>
    records.filter((record) => record.matchStatus === status).length;
const report = {
    officialTargetCount: mcst.records.length,
    canonicalCount: records.length,
    existingCanonicalMergeCount: records.filter(
        (record) => record.existingSlug,
    ).length,
    newCanonicalCount: records.filter((record) => !record.existingSlug)
        .length,
    matchedWithCoordinatesCount: countByStatus(
        "matched_with_coordinates",
    ),
    matchedWithoutCoordinatesCount: countByStatus(
        "matched_without_coordinates",
    ),
    officialUnmatchedCount: countByStatus("official_unmatched"),
    coordinatesPresentCount: records.filter(
        (record) =>
            record.latitude !== null && record.longitude !== null,
    ).length,
    coordinatesMissingCount: records.filter(
        (record) =>
            record.latitude === null && record.longitude === null,
    ).length,
    localDataLinkedCount: records.filter((record) => record.localData)
        .length,
    aliasCount: records.reduce(
        (count, record) => count + (record.aliases?.length ?? 0),
        0,
    ),
    duplicateCount:
        duplicateSlugs.length +
        duplicateCanonicalKeys.length +
        duplicateSourceLinks.length,
    validationFailureCount: failures.length,
    statusTotal:
        countByStatus("matched_with_coordinates") +
        countByStatus("matched_without_coordinates") +
        countByStatus("official_unmatched"),
};

const seedOutput = `${JSON.stringify(
    {
        sources: { mcst: mcst.source, localData: localData.source },
        report,
        records,
    },
    null,
    2,
)}\n`;
const runtimeOutput = `${JSON.stringify(
    {
        sources: { mcst: mcst.source, localData: localData.source },
        report,
        records: records.map((record) => ({
            ...record,
            localData: record.localData
                ? {
                      sourceId: record.localData.sourceId,
                      localGovCode: record.localData.localGovCode,
                      managementNo: record.localData.managementNo,
                      coordinateSystem: record.localData.coordinateSystem,
                      updatedAt: record.localData.updatedAt,
                      matchMethod: record.localData.matchMethod,
                  }
                : undefined,
        })),
    },
    null,
    2,
)}\n`;
const reviewOutput = `${JSON.stringify(
    {
        report,
        ambiguousMatches: review,
                unmatchedSuggestions,
                duplicateCanonicalKeys,
                duplicateSourceLinks,
                failures,
    },
    null,
    2,
)}\n`;
const seedOutputPath = path.join(
    generatedDirectory,
    "nationwide-temples.json",
);
const reviewOutputPath = path.join(
    generatedDirectory,
    "nationwide-temples-review.json",
);
const runtimeOutputPath = path.join(
    generatedDirectory,
    "nationwide-temples.runtime.json",
);

if (checkOnly) {
    const [existingSeed, existingRuntime, existingReview] = await Promise.all([
        readFile(seedOutputPath, "utf8"),
        readFile(runtimeOutputPath, "utf8"),
        readFile(reviewOutputPath, "utf8"),
    ]);
    if (
        existingSeed !== seedOutput ||
        existingRuntime !== runtimeOutput ||
        existingReview !== reviewOutput
    ) {
        throw new Error(
            "전국 Temple seed가 raw source/override와 일치하지 않습니다. npm run temples:seed 후 diff를 검토하세요.",
        );
    }
} else {
    await mkdir(generatedDirectory, { recursive: true });
    await Promise.all([
        writeFile(seedOutputPath, seedOutput),
        writeFile(runtimeOutputPath, runtimeOutput),
        writeFile(reviewOutputPath, reviewOutput),
    ]);
}

console.log(JSON.stringify({ report, manualReviewCount: review.length }, null, 2));

if (failures.length > 0) {
    process.exitCode = 1;
}
