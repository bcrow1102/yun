import fs from "node:fs";
import path from "node:path";

const LIST_URL =
  "https://www.templestay.com/fe/MI000000000000000019/temple/list.do";
const DETAIL_URL =
  "https://www.templestay.com/fe/MI000000000000000019/temple/introView.do";
const CHECKED_AT = "2026-08-20";
const PAGE_COUNT = 29;
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140.0 Safari/537.36";

const canonicalPath = path.resolve(
  "data/temples/generated/nationwide-temples.runtime.json",
);
const outputPath = path.resolve(
  "data/temples/staging/official-templestay-operators-2026-08-20.json",
);

const htmlDecode = (value) =>
  value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));

const stripTags = (value) =>
  htmlDecode(value.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

const normalizeText = (value) =>
  value
    .normalize("NFC")
    .toLowerCase()
    .replace(/[\s·ㆍ.,()[\]{}'"`~!@#$%^&*_+=:;/?\\|-]/g, "");

const baseOfficialName = (value) => value.replace(/\s*\([^)]*\)\s*$/u, "").trim();

const sidoMap = new Map([
  ["서울특별시", "서울"],
  ["서울시", "서울"],
  ["부산광역시", "부산"],
  ["부산", "부산"],
  ["대구광역시", "대구"],
  ["대구", "대구"],
  ["인천광역시", "인천"],
  ["인천", "인천"],
  ["광주광역시", "광주"],
  ["광주", "광주"],
  ["대전광역시", "대전"],
  ["대전", "대전"],
  ["울산광역시", "울산"],
  ["울산", "울산"],
  ["세종특별자치시", "세종"],
  ["경기도", "경기"],
  ["강원특별자치도", "강원"],
  ["강원도", "강원"],
  ["충청북도", "충북"],
  ["충북", "충북"],
  ["충청남도", "충남"],
  ["충남", "충남"],
  ["전북특별자치도", "전북"],
  ["전라북도", "전북"],
  ["전북", "전북"],
  ["전라남도", "전남"],
  ["전남", "전남"],
  ["경상북도", "경북"],
  ["경북", "경북"],
  ["경상남도", "경남"],
  ["경남", "경남"],
  ["제주특별자치도", "제주"],
  ["제주도", "제주"],
]);

function extractRegion(address) {
  const tokens = address.replace(/^주소\s+/u, "").trim().split(/\s+/u);
  const sido = sidoMap.get(tokens[0]) ?? null;
  if (!sido) return { sido: null, sigungu: null };
  if (sido === "세종") return { sido, sigungu: "세종시" };
  const sigungu = tokens.slice(1, 4).find((token) => /(?:시|군|구)$/u.test(token));
  return { sido, sigungu: sigungu ?? null };
}

function sameSigungu(left, right) {
  if (!left || !right) return false;
  const a = normalizeText(left);
  const b = normalizeText(right);
  return a === b || a.endsWith(b) || b.endsWith(a);
}

async function fetchHtml(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": USER_AGENT,
      referer: "https://www.templestay.com/",
      "accept-language": "ko-KR,ko;q=0.9",
    },
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${url}`);
  }
  return response.text();
}

function parsePage(html) {
  const detailMatches = [...html.matchAll(/fncDetailView\('([^']+)'\)/g)];
  return detailMatches.map((detailMatch) => {
    const prefix = html.slice(0, detailMatch.index);
    const strongMatches = [...prefix.matchAll(/<strong>\s*(.*?)\s*<\/strong>/gs)];
    const strongMatch = strongMatches.at(-1);
    if (!strongMatch) throw new Error(`Missing name for ${detailMatch[1]}`);
    const chunk = html.slice(strongMatch.index, detailMatch.index);
    const addressMatch = chunk.match(
      /<img[^>]*alt="주소"[^>]*>\s*<\/span>\s*(.*?)<\/li>/s,
    );
    const phoneMatch = chunk.match(
      /<img[^>]*alt="연락처"[^>]*>\s*<\/span>\s*(.*?)<\/li>/s,
    );
    if (!addressMatch || !phoneMatch) {
      throw new Error(`Missing contact fields for ${detailMatch[1]}`);
    }
    const officialName = stripTags(strongMatch[1]);
    let address = stripTags(addressMatch[1]);
    if (address.startsWith(`${officialName},`)) {
      address = address.slice(officialName.length + 1).trim();
    }
    return {
      officialName,
      officialId: detailMatch[1],
      address,
      phone: stripTags(phoneMatch[1]),
    };
  });
}

function canonicalNames(temple) {
  return [temple.name, ...(temple.aliases ?? [])].map((name) => ({
    raw: name,
    normalized: normalizeText(name),
    alias: name !== temple.name,
  }));
}

function candidateMatches(record, temples) {
  const fullName = normalizeText(record.officialName);
  const baseName = normalizeText(baseOfficialName(record.officialName));
  return temples
    .map((temple) => {
      const names = canonicalNames(temple);
      const nameMatch = names.find(
        ({ normalized }) => normalized === fullName || normalized === baseName,
      );
      if (!nameMatch) return null;
      return {
        temple,
        nameMatch,
        sameSido: temple.sido === record.sido,
        sameSigungu: sameSigungu(temple.sigungu, record.sigungu),
      };
    })
    .filter(Boolean);
}

const manualMatches = new Map([
  [
    "SeoraksanSinheungsa",
    {
      slug: "traditional-temple-0282",
      method: "official-qualified-name-and-address",
      note: "공식명 '설악산신흥사'를 canonical '신흥사'와 속초시 주소로 확정",
    },
  ],
  [
    "seokguram2",
    {
      slug: "traditional-temple-0738",
      method: "alias-and-address",
      note: "canonical alias '제2석굴암'과 군위군 주소로 확정",
    },
  ],
  [
    "Youngpyungsa",
    {
      slug: "traditional-temple-0159",
      method: "exact-name-and-address-administrative-change",
      note: "이름이 유일하고 공식 현 주소(장군면 영평사길)와 canonical 구 주소(장기면 산학리)가 같은 영평사를 가리킴",
    },
  ],
]);

const nonTempleOperators = new Map([
  [
    "TemplestayinformationCenter",
    {
      operatorType: "institution",
      reason:
        "템플스테이·사찰음식 안내와 체험을 제공하는 통합정보센터(홍보관)로 사찰이 아님",
    },
  ],
  [
    "KoreaCultureTrainingInstitute",
    {
      operatorType: "institution",
      reason: "교육·연수 시설인 한국문화연수원으로 사찰이 아님",
    },
  ],
  [
    "chengcunsa",
    {
      operatorType: "test",
      reason:
        "공식 상세가 '테스트 페이지' 및 '예약할 수 없음'이라고 명시한 비운영 테스트 레코드",
    },
  ],
]);

function classify(record, templesBySlug, temples) {
  const nonTemple = nonTempleOperators.get(record.officialId);
  if (nonTemple) {
    return {
      operatorType: nonTemple.operatorType,
      matchStatus: "NON_TEMPLE",
      matchNote: nonTemple.reason,
    };
  }

  const manual = manualMatches.get(record.officialId);
  if (manual) {
    const temple = templesBySlug.get(manual.slug);
    if (!temple) throw new Error(`Invalid manual slug: ${manual.slug}`);
    return {
      operatorType: "temple",
      templeSlug: temple.slug,
      matchStatus: "MATCHED",
      matchMethod: manual.method,
      matchNote: manual.note,
    };
  }

  const candidates = candidateMatches(record, temples);
  const regional = candidates.filter(
    ({ sameSido, sameSigungu: cityMatch }) => sameSido && cityMatch,
  );
  if (regional.length === 1) {
    const candidate = regional[0];
    const method = candidate.nameMatch.alias
      ? "alias-and-region"
      : candidates.length > 1
        ? "homonym-name-and-region"
        : "exact-name-and-region";
    return {
      operatorType: "temple",
      templeSlug: candidate.temple.slug,
      matchStatus: "MATCHED",
      matchMethod: method,
      matchNote: `${candidate.temple.name} (${candidate.temple.sido} ${candidate.temple.sigungu})와 이름·지역 일치`,
    };
  }
  if (regional.length > 1) {
    return {
      operatorType: "temple",
      matchStatus: "AMBIGUOUS",
      matchNote: `같은 이름·지역의 canonical 후보 ${regional.length}개를 주소만으로 확정할 수 없음: ${regional.map(({ temple }) => `${temple.name}(${temple.slug}, ${temple.address})`).join("; ")}`,
      candidateTempleSlugs: regional.map(({ temple }) => temple.slug),
    };
  }
  if (candidates.length > 0) {
    return {
      operatorType: "temple",
      matchStatus: "UNMATCHED",
      matchNote: `동명 canonical은 있으나 공식 주소·지역이 달라 대응 후보에서 제외: ${candidates.map(({ temple }) => `${temple.name}(${temple.slug}, ${temple.sido} ${temple.sigungu})`).join("; ")}`,
      candidateTempleSlugs: candidates.map(({ temple }) => temple.slug),
    };
  }
  return {
    operatorType: "temple",
    matchStatus: "UNMATCHED",
    matchNote: "공식 운영사찰로 확인되지만 Temple 991에서 이름·alias와 지역이 일치하는 canonical을 찾지 못함",
  };
}

function duplicates(records, field) {
  const seen = new Map();
  for (const record of records) {
    const value = record[field];
    const values = seen.get(value) ?? [];
    values.push(record.officialName);
    seen.set(value, values);
  }
  return [...seen.entries()]
    .filter(([, names]) => names.length > 1)
    .map(([value, names]) => ({ value, names }));
}

async function validateOfficialUrls(records) {
  const failures = [];
  for (let index = 0; index < records.length; index += 12) {
    const batch = records.slice(index, index + 12);
    const results = await Promise.all(
      batch.map(async (record) => {
        try {
          const response = await fetch(record.officialUrl, {
            headers: {
              "user-agent": USER_AGENT,
              referer: "https://www.templestay.com/",
              "accept-language": "ko-KR,ko;q=0.9",
            },
          });
          return { officialId: record.officialId, status: response.status };
        } catch (error) {
          return { officialId: record.officialId, error: String(error) };
        }
      }),
    );
    failures.push(...results.filter((result) => result.status !== 200));
  }
  return failures;
}

async function main() {
  const rawRecords = [];
  for (let pageIndex = 1; pageIndex <= PAGE_COUNT; pageIndex += 1) {
    const html = await fetchHtml(`${LIST_URL}?pageIndex=${pageIndex}`);
    const pageRecords = parsePage(html);
    if (pageIndex < PAGE_COUNT && pageRecords.length !== 6) {
      throw new Error(`Expected 6 records on page ${pageIndex}, got ${pageRecords.length}`);
    }
    rawRecords.push(...pageRecords);
  }

  const canonical = JSON.parse(fs.readFileSync(canonicalPath, "utf8"));
  const temples = canonical.records;
  const templesBySlug = new Map(temples.map((temple) => [temple.slug, temple]));
  const records = rawRecords.map((raw) => {
    const { sido, sigungu } = extractRegion(raw.address);
    const officialUrl = `${DETAIL_URL}?templeId=${encodeURIComponent(raw.officialId)}`;
    const base = {
      ...raw,
      sido,
      sigungu,
      officialUrl,
      dayProgramCount: null,
      experienceProgramCount: null,
      restProgramCount: null,
    };
    return {
      ...base,
      ...classify(base, templesBySlug, temples),
      source: "한국불교문화사업단 템플스테이 공식 사이트 운영사찰 목록",
      checkedAt: CHECKED_AT,
    };
  });

  const counts = Object.fromEntries(
    ["MATCHED", "AMBIGUOUS", "UNMATCHED", "NON_TEMPLE"].map((status) => [
      status,
      records.filter((record) => record.matchStatus === status).length,
    ]),
  );
  const duplicateOfficialIds = duplicates(records, "officialId");
  const duplicateOfficialUrls = duplicates(records, "officialUrl");
  const exactRecordKeys = records.map((record) => JSON.stringify(record));
  const duplicateExactRecords = exactRecordKeys.length - new Set(exactRecordKeys).size;
  const matchedWithoutSlug = records.filter(
    (record) => record.matchStatus === "MATCHED" && !record.templeSlug,
  );
  const matchedInvalidSlug = records.filter(
    (record) =>
      record.matchStatus === "MATCHED" &&
      !templesBySlug.has(record.templeSlug),
  );
  const nonTempleWithSlug = records.filter(
    (record) => record.matchStatus === "NON_TEMPLE" && record.templeSlug,
  );
  const officialUrlFailures = await validateOfficialUrls(records);

  const output = {
    schemaVersion: 1,
    source: {
      title: "템플스테이 운영사찰 소개",
      authority: "한국불교문화사업단",
      url: LIST_URL,
      checkedAt: CHECKED_AT,
      pageCount: PAGE_COUNT,
      note: "공식 목록에 프로그램 유형별 수가 없어 세 count 필드는 null로 보존",
    },
    report: {
      officialOperatorCount: rawRecords.length,
      stagingRecordCount: records.length,
      counts,
      statusTotal: Object.values(counts).reduce((sum, count) => sum + count, 0),
      aliasMatchedCount: records.filter((record) =>
        record.matchMethod?.startsWith("alias"),
      ).length,
      homonymResolvedCount: records.filter(
        (record) => record.matchMethod === "homonym-name-and-region",
      ).length,
      duplicateOfficialIds,
      duplicateOfficialUrls,
      duplicateExactRecordCount: duplicateExactRecords,
      matchedWithoutSlugCount: matchedWithoutSlug.length,
      matchedInvalidSlugCount: matchedInvalidSlug.length,
      nonTempleWithSlugCount: nonTempleWithSlug.length,
      officialUrlHttp200Count: records.length - officialUrlFailures.length,
      officialUrlFailures,
      canonicalTempleCount: temples.length,
    },
    records,
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(JSON.stringify(output.report, null, 2));
  for (const status of ["AMBIGUOUS", "UNMATCHED", "NON_TEMPLE"]) {
    console.log(`\n${status}`);
    console.log(
      JSON.stringify(
        records
          .filter((record) => record.matchStatus === status)
          .map(({ officialName, officialId, address, matchNote, candidateTempleSlugs }) => ({
            officialName,
            officialId,
            address,
            matchNote,
            candidateTempleSlugs,
          })),
        null,
        2,
      ),
    );
  }
}

await main();
