import fs from "node:fs";
import path from "node:path";

const CHECKED_AT = "2026-08-20";
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140.0 Safari/537.36";
const inputPath = path.resolve(
  "data/temples/staging/official-templestay-operators-2026-08-20.json",
);
const canonicalPath = path.resolve(
  "data/temples/generated/nationwide-temples.runtime.json",
);
const localDataPath = path.resolve(
  "data/temples/raw/localdata-2026-08-15.json",
);
const mcstPath = path.resolve("data/temples/raw/mcst-2026-06-01.json");
const outputPath = path.resolve(
  "data/temples/staging/official-templestay-unmatched-investigation-2026-08-20.json",
);

const researchedMetadata = new Map([
  [
    "Gwanmunsa",
    {
      order: "대한불교천태종",
      evidence: {
        source: "서울특별시 서초구 소식",
        sourceUrl: "https://seocho.newstool.co.kr/pdf/seocho_202303.pdf",
        supports: "대한불교천태종 관문사 명칭과 서초구 소재",
      },
    },
  ],
  [
    "gwangjesa",
    {
      order: "대한불교조계종",
      evidence: {
        source: "대한불교조계종",
        sourceUrl:
          "https://www.buddhism.or.kr/board/file_down.php?baidx=293574",
        supports: "광제사와 세종 전통문화체험관의 종단 운영 관계 및 주소",
      },
    },
  ],
  [
    "InternationalSeonCenter",
    {
      order: "대한불교조계종",
      website: "http://www.seoncenter.or.kr",
      evidence: {
        source: "대한불교조계종",
        sourceUrl:
          "https://www.buddhism.or.kr/m/pogyo/sub4/sub4-2-t1.php",
        supports: "국제선센터의 종단 소속, 불교교육·도량 기능, 동일 주소",
      },
    },
  ],
  [
    "Kumkangjeongsa",
    {
      website: "https://www.sejon.org",
      evidence: {
        source: "금강정사 공식 웹사이트",
        sourceUrl: "https://www.sejon.org",
        supports: "금강정사의 현재 사찰 운영과 공식 웹사이트",
      },
    },
  ],
  [
    "Kilsangsa",
    {
      order: "대한불교조계종",
      website: "https://www.gilsangsa.or.kr/",
      evidence: {
        source: "대한불교조계종 불교대학 주소록",
        sourceUrl:
          "https://www.buddhism.or.kr/m/pogyo/sub4/sub4-2-t1.php",
        supports: "길상사의 종단 교육도량 기능과 동일 주소",
      },
    },
  ],
  [
    "Daegwangsa_sn",
    {
      order: "대한불교천태종",
      evidence: {
        source: "성남시의회 교육문화체육국 주요업무보고",
        sourceUrl:
          "https://www.sncouncil.go.kr/attach/record/SEONGNAM/appendix/a08/A0029666.pdf",
        supports: "대한불교천태종 분당대광사 명칭과 동일 주소",
      },
    },
  ],
  [
    "Jabisunsa",
    {
      website: "https://www.jabisun.org/",
      evidence: {
        source: "자비선사 공식 웹사이트",
        sourceUrl: "https://www.jabisun.org/",
        supports: "자비선 명상도량의 현재 운영과 공식 웹사이트",
      },
    },
  ],
]);

const normalize = (value = "") =>
  value
    .normalize("NFC")
    .toLowerCase()
    .replace(/주소\s*/gu, "")
    .replace(/[\s·ㆍ.,()[\]{}'"`~!@#$%^&*_+=:;/?\\|-]/g, "");

const baseName = (value) => value.replace(/\s*\([^)]*\)\s*$/u, "").trim();

const sigunguMatches = (left, right) => {
  if (!left || !right) return false;
  const a = normalize(left);
  const b = normalize(right);
  return a === b || a.endsWith(b) || b.endsWith(a);
};

const plainText = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/giu, " ")
    .replace(/<style[\s\S]*?<\/style>/giu, " ")
    .replace(/<[^>]+>/gu, " ")
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .replace(/\s+/gu, " ")
    .trim();

async function fetchOfficialDetail(record) {
  const response = await fetch(record.officialUrl, {
    headers: {
      "user-agent": USER_AGENT,
      referer: "https://www.templestay.com/",
      "accept-language": "ko-KR,ko;q=0.9",
    },
  });
  if (!response.ok) {
    throw new Error(`${response.status}: ${record.officialUrl}`);
  }
  const html = await response.text();
  const coordinateMatch = html.match(
    /new kakao\.maps\.LatLng\('([^']*)','([^']*)'\)/u,
  );
  const latitude = coordinateMatch?.[1] ? Number(coordinateMatch[1]) : null;
  const longitude = coordinateMatch?.[2] ? Number(coordinateMatch[2]) : null;
  const text = plainText(html);
  const orderMatches = [
    ...new Set(
      [
        ...text.matchAll(
          /대한불교(?:조계종|천태종|태고종|대각회|진각종|관음종|법화종|총화종|원효종|미륵종|일승종)/gu,
        ),
      ].map((match) => match[0]),
    ),
  ];
  return {
    latitude: latitude === 0 ? null : latitude,
    longitude: longitude === 0 ? null : longitude,
    orderMatches,
    officialDetailStatus: response.status,
  };
}

function canonicalCandidates(record, canonicalRecords) {
  const full = normalize(record.officialName);
  const base = normalize(baseName(record.officialName));
  return canonicalRecords
    .filter((temple) =>
      [temple.name, ...(temple.aliases ?? [])].some((name) => {
        const normalized = normalize(name);
        return normalized === full || normalized === base;
      }),
    )
    .map((temple) => ({
      slug: temple.slug,
      name: temple.name,
      sido: temple.sido,
      sigungu: temple.sigungu,
      address: temple.address,
      sameRegion:
        temple.sido === record.sido &&
        sigunguMatches(temple.sigungu, record.sigungu),
    }));
}

function canonicalAddressCandidates(record, canonicalRecords) {
  const address = normalize(record.address);
  if (!address) return [];
  return canonicalRecords
    .filter(
      (temple) =>
        normalize(temple.address) === address ||
        normalize(temple.mcst?.address) === address,
    )
    .map((temple) => ({
      slug: temple.slug,
      name: temple.name,
      address: temple.address,
    }));
}

function localDataCandidates(record, localRecords) {
  const officialBase = normalize(baseName(record.officialName));
  return localRecords
    .filter((item) => normalize(item.name) === officialBase)
    .map((item) => ({
      sourceId: `localdata:${item.localGovCode}:${item.managementNo}`,
      name: item.name,
      roadAddress: item.roadAddress || null,
      lotAddress: item.lotAddress || null,
      businessStatus: item.businessStatus,
      detailedStatus: item.detailedStatus || null,
      sameAddress:
        normalize(item.roadAddress) === normalize(record.address) ||
        normalize(item.lotAddress) === normalize(record.address),
    }));
}

function localDataAddressCandidates(record, localRecords) {
  const address = normalize(record.address);
  if (!address) return [];
  return localRecords
    .filter(
      (item) =>
        normalize(item.roadAddress) === address ||
        normalize(item.lotAddress) === address,
    )
    .map((item) => ({
      sourceId: `localdata:${item.localGovCode}:${item.managementNo}`,
      name: item.name,
      roadAddress: item.roadAddress || null,
      lotAddress: item.lotAddress || null,
      businessStatus: item.businessStatus,
    }));
}

function canonicalIdentity(record) {
  const base = baseName(record.officialName);
  if (base === record.officialName) {
    return { canonicalName: base, aliases: [] };
  }
  return { canonicalName: base, aliases: [record.officialName] };
}

async function main() {
  const sourceStaging = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  const canonical = JSON.parse(fs.readFileSync(canonicalPath, "utf8"));
  const localData = JSON.parse(fs.readFileSync(localDataPath, "utf8"));
  const mcst = JSON.parse(fs.readFileSync(mcstPath, "utf8"));
  const targets = sourceStaging.records.filter(
    (record) => record.matchStatus === "UNMATCHED",
  );
  if (targets.length !== 34) {
    throw new Error(`Expected 34 UNMATCHED records, got ${targets.length}`);
  }

  const details = new Map();
  for (let index = 0; index < targets.length; index += 8) {
    const batch = targets.slice(index, index + 8);
    const values = await Promise.all(
      batch.map(async (record) => [
        record.officialId,
        await fetchOfficialDetail(record),
      ]),
    );
    for (const [officialId, detail] of values) details.set(officialId, detail);
  }

  const records = targets.map((record) => {
    const detail = details.get(record.officialId);
    const researched = researchedMetadata.get(record.officialId);
    const canonicalMatches = canonicalCandidates(record, canonical.records);
    const canonicalAddressMatches = canonicalAddressCandidates(
      record,
      canonical.records,
    );
    const localMatches = localDataCandidates(record, localData.records);
    const localAddressMatches = localDataAddressCandidates(
      record,
      localData.records,
    );
    const sameRegionCanonical = canonicalMatches.filter(
      (candidate) => candidate.sameRegion,
    );
    if (
      sameRegionCanonical.length > 0 ||
      canonicalAddressMatches.length > 0 ||
      localAddressMatches.length > 0
    ) {
      throw new Error(
        `Candidate requires manual EXISTING_CANONICAL review: ${record.officialName}`,
      );
    }
    const identity = canonicalIdentity(record);
    return {
      officialName: record.officialName,
      address: record.address,
      officialId: record.officialId,
      officialUrl: record.officialUrl,
      classification: "ADD_CANDIDATE",
      canonicalName: identity.canonicalName,
      aliases: identity.aliases,
      verifiedAddress: record.address,
      sido: record.sido,
      sigungu: record.sigungu,
      latitude: detail.latitude,
      longitude: detail.longitude,
      order:
        researched?.order ??
        (detail.orderMatches.length === 1 ? detail.orderMatches[0] : null),
      website: researched?.website ?? null,
      phone: record.phone,
      evidence: [
        {
          source: "한국불교문화사업단 템플스테이 공식",
          sourceUrl: record.officialUrl,
          externalSourceId: record.officialId,
          supports:
            "공식 운영사찰명·주소·전화와 현재 운영 상세, 공식 상세 지도 좌표",
        },
        {
          source: mcst.source.title,
          sourceUrl: mcst.source.url,
          supports:
            "2026-06-01 기준 전통사찰 991개 원천에 동일 지역 canonical이 없음",
        },
        {
          source: localData.source.title,
          sourceUrl: localData.source.url,
          supports:
            "LOCALDATA 전통사찰 원천에서 동일 주소 레코드가 없음을 재검사",
        },
        ...(researched?.evidence ? [researched.evidence] : []),
      ],
      canonicalRecheck: {
        exactOrAliasCandidates: canonicalMatches,
        sameRegionCandidateCount: sameRegionCanonical.length,
        canonicalExactAddressCandidates: canonicalAddressMatches,
        localDataExactNameCandidates: localMatches,
        localDataExactAddressCandidates: localAddressMatches,
      },
      note:
        "공식 템플스테이 운영사찰로 현재 운영과 장소가 확인되며, 연의 생활 불교 Temple 범위에 해당한다. Temple 991 및 그 전통사찰 원천에 동일 지역·주소 canonical이 없어 신규 canonical 검토 대상으로 분류했다.",
      checkedAt: CHECKED_AT,
    };
  });

  const classifications = [
    "ADD_CANDIDATE",
    "EXISTING_CANONICAL",
    "NEEDS_REVIEW",
    "NOT_TEMPLE",
  ];
  const counts = Object.fromEntries(
    classifications.map((classification) => [
      classification,
      records.filter((record) => record.classification === classification).length,
    ]),
  );
  const duplicateOfficialIds =
    records.length - new Set(records.map((record) => record.officialId)).size;
  const statusTotal = Object.values(counts).reduce((sum, count) => sum + count, 0);

  const output = {
    schemaVersion: 1,
    purpose:
      "공식 템플스테이 UNMATCHED 34개 운영사찰의 Temple canonical 보완 적합성 조사",
    sourceDataset:
      "data/temples/staging/official-templestay-operators-2026-08-20.json",
    checkedAt: CHECKED_AT,
    report: {
      targetCount: targets.length,
      recordCount: records.length,
      counts,
      statusTotal,
      duplicateOfficialIdCount: duplicateOfficialIds,
      officialDetailHttp200Count: records.filter(
        (record) => details.get(record.officialId).officialDetailStatus === 200,
      ).length,
      canonicalTempleCount: canonical.records.length,
      mcstTraditionalTempleCount: mcst.records.length,
      localDataRecordCount: localData.records.length,
    },
    records,
  };

  fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(JSON.stringify(output.report, null, 2));
  console.log(
    JSON.stringify(
      records.map((record) => ({
        officialName: record.officialName,
        coordinates: [record.latitude, record.longitude],
        order: record.order,
        canonicalCandidateCount:
          record.canonicalRecheck.exactOrAliasCandidates.length,
      })),
      null,
      2,
    ),
  );
}

await main();
