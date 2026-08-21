import fs from "node:fs";
import path from "node:path";

const CHECKED_AT = "2026-08-21";
const SOURCE_NAME = "한국불교문화사업단 공식 템플스테이";
const SOURCE_BASE_URL = "https://www.templestay.com/";
const OPERATOR_DETAIL_URL =
  "https://www.templestay.com/fe/MI000000000000000062/temple/introView.do";
const PROGRAM_DETAIL_URL =
  "https://www.templestay.com/fe/MI000000000000000062/reserve/view.do";
const OUTPUT_PATH = path.resolve(
  `data/temples/staging/official-templestay-programs-${CHECKED_AT}.json`,
);
const OPERATORS_PATH = path.resolve("app/temples/stay/operators.ts");
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140.0 Safari/537.36";
const CONCURRENCY = Number(process.env.TEMPLESTAY_CONCURRENCY ?? 3);
const RESUME = process.argv.includes("--resume");

const TYPE_LABELS = {
  CD00000306: "day",
  CD00000307: "experience",
  CD00000308: "rest",
};

const PRICE_LABELS = new Map([
  ["성인", "adult"],
  ["중고생", "teen"],
  ["청소년", "teen"],
  ["초등생", "child"],
  ["어린이", "child"],
  ["미취학", "preschool"],
  ["유아", "preschool"],
]);

function htmlDecode(value) {
  return value
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));
}

function stripTags(value) {
  return htmlDecode(
    value
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/[ \t\f\v]+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .trim();
}

function normalizeInline(value) {
  return stripTags(value).replace(/\s+/g, " ").trim();
}

function readProductionOperators() {
  const source = fs.readFileSync(OPERATORS_PATH, "utf8");
  const match = source.match(
    /const templeStayOperatorRecords = (\[[\s\S]*?\]) satisfies TempleStayOperatorRecord\[\];/,
  );
  if (!match) throw new Error("operators.ts에서 production Operator 배열을 찾지 못했습니다.");
  const operators = JSON.parse(match[1]);
  if (operators.length !== 171) {
    throw new Error(`production Operator 수가 171이 아닙니다: ${operators.length}`);
  }
  return operators;
}

async function fetchHtml(url) {
  let lastError;
  for (let attempt = 1; attempt <= 6; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45_000);
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          "user-agent": USER_AGENT,
          referer: SOURCE_BASE_URL,
          "accept-language": "ko-KR,ko;q=0.9",
        },
      });
      const body = await response.text();
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      const queued = /<title>\s*템플스테이\s*-\s*접속\s*대기\s*중\s*<\/title>/u.test(body);
      if (queued) throw new Error("official-site-queue-response");
      if (body.length === 0 && attempt < 6) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 1_500));
        continue;
      }
      return { status: response.status, body, attempts: attempt };
    } catch (error) {
      lastError = error;
      if (attempt < 6) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 1_500));
      }
    } finally {
      clearTimeout(timeout);
    }
  }
  throw new Error(`${String(lastError)} (${url})`);
}

async function mapConcurrent(items, concurrency, worker, onProgress) {
  const output = new Array(items.length);
  let cursor = 0;
  let completed = 0;
  async function run() {
    while (true) {
      const index = cursor;
      cursor += 1;
      if (index >= items.length) return;
      output[index] = await worker(items[index], index);
      completed += 1;
      onProgress?.(completed, items.length);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => run()));
  return output;
}

function findNearestStrong(html, index) {
  const prefix = html.slice(0, index);
  return [...prefix.matchAll(/<strong[^>]*>([\s\S]*?)<\/strong>/gi)].at(-1);
}

function parseListedPrograms(html, operator) {
  const records = [];
  const matches = [
    ...html.matchAll(/href=["']javascript:fncReserve\(['"]?(\d+)["']?\);?["'][^>]*>/gi),
  ];
  for (const match of matches) {
    const strong = findNearestStrong(html, match.index);
    if (!strong) throw new Error(`${operator.officialId}: 프로그램명 누락 (${match[1]})`);
    const chunk = html.slice(strong.index, match.index);
    const dateMatch = chunk.match(/<span[^>]*class=["'][^"']*date[^"']*["'][^>]*>([\s\S]*?)<\/span>/i);
    const dateText = dateMatch ? normalizeInline(dateMatch[1]) : "";
    const rawDates = [...dateText.matchAll(/\b(\d{4}-\d{2}-\d{2})\b/g)].map(
      (date) => date[1],
    );
    records.push({
      officialProgramId: match[1],
      operatorOfficialId: operator.officialId,
      operatorName: operator.officialName,
      operatorType: operator.operatorType,
      ...(operator.operatorTempleSlug
        ? { operatorTempleSlug: operator.operatorTempleSlug }
        : {}),
      programName: normalizeInline(strong[1]),
      listOperationPeriodSource:
        rawDates.length >= 2 ? { start: rawDates[0], end: rawDates[1] } : null,
      officialUrl: `${PROGRAM_DETAIL_URL}?templestaySeq=${match[1]}`,
      listed: true,
      checkedAt: CHECKED_AT,
      lastSeenAt: CHECKED_AT,
    });
  }
  const byId = new Map();
  for (const record of records) {
    const prior = byId.get(record.officialProgramId);
    if (!prior) byId.set(record.officialProgramId, record);
    else if (JSON.stringify(prior) !== JSON.stringify(record)) {
      throw new Error(`${operator.officialId}: 같은 목록에서 ID ${record.officialProgramId} 내용 불일치`);
    }
  }
  return [...byId.values()];
}

function validIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function extractSection(html, headingPattern) {
  const heading = html.match(headingPattern);
  if (!heading) return "";
  const rest = html.slice(heading.index);
  const next = rest.slice(heading[0].length).search(/<div\s+class=["']section(?:\s|["'])/i);
  return next < 0 ? rest : rest.slice(0, heading[0].length + next);
}

function parseOperationPeriod(html, fallback) {
  const section = extractSection(html, /<h4[^>]*>\s*프로그램\s*일정\s*<\/h4>/i);
  const text = normalizeInline(section);
  const match = text.match(/운영기간\s*:\s*(\d{4}-\d{2}-\d{2})\s*~\s*(\d{4}-\d{2}-\d{2})/u);
  const source = match ? { start: match[1], end: match[2] } : fallback;
  if (!source) return { source: null, invalid: [] };
  const invalid = [source.start, source.end].filter((date) => !validIsoDate(date));
  return { source, invalid };
}

function parseAmount(text) {
  const normalized = text.replaceAll(",", "").replaceAll("원", "").trim();
  if (/^(무료|없음)$/u.test(normalized)) return 0;
  return /^\d+$/.test(normalized) ? Number(normalized) : null;
}

function parsePrice(html, programType) {
  const section = extractSection(html, /<h4[^>]*>\s*참가비용[\s\S]*?<\/h4>/i);
  if (!section) {
    const bodyText = normalizeInline(html);
    const exceptions = ["missing-general-price-section"];
    if (/fncRoomSelect\(['"]?\d+/i.test(html) && /<th[^>]*>\s*(성인|중고생|초등생|미취학)\s*<\/th>/u.test(html)) {
      exceptions.push("room-selection-price-tables");
    }
    if (/(추가금|추가\s*요금|별도\s*추가|1인실.{0,15}(옵션|추가))/u.test(bodyText)) {
      exceptions.push("additional-charge-or-option");
    }
    return { price: null, exceptions };
  }
  const table = section.match(/<table[^>]*>([\s\S]*?)<\/table>/i)?.[1] ?? "";
  const rows = [...table.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map((row) => row[1]);
  const headers = [...(rows[0] ?? "").matchAll(/<th[^>]*>([\s\S]*?)<\/th>/gi)].map((cell) =>
    normalizeInline(cell[1]),
  );
  const cells = [...(rows[1] ?? "").matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((cell) =>
    normalizeInline(cell[1]),
  );
  const exceptions = [];
  if (rows.length > 2) exceptions.push("multiple-price-rows");
  if (headers.length === 0 || cells.length === 0) exceptions.push("unparseable-price-table");
  if (headers.length !== cells.length) exceptions.push("price-column-mismatch");
  const amounts = {};
  for (let index = 0; index < Math.min(headers.length, cells.length); index += 1) {
    const key = PRICE_LABELS.get(headers[index]);
    if (!key) {
      exceptions.push(`unmapped-price-label:${headers[index]}`);
      continue;
    }
    const amount = parseAmount(cells[index]);
    if (amount === null) {
      exceptions.push(`nonnumeric-price:${headers[index]}=${cells[index]}`);
      continue;
    }
    amounts[key] = amount;
  }
  const periodType = html.match(/const\s+periodType\s*=\s*['"](FIXED|FLEXIBLE)['"]/i)?.[1];
  let basis = periodType === "FLEXIBLE" ? "perNight" : periodType === "FIXED" ? "program" : null;
  if (!basis && programType === "day") basis = "program";
  if (!basis) exceptions.push("unknown-price-basis");
  const sectionText = normalizeInline(section);
  const bodyText = normalizeInline(html);
  if (/(객실|방사|방\s*타입|인실).{0,30}(가격|요금|추가|선택)/u.test(bodyText)) {
    exceptions.push("room-dependent-price");
  }
  if (/36개월\s*미만.{0,12}무료/u.test(bodyText)) exceptions.push("under-36-months-free");
  if (/(추가금|추가\s*요금|별도\s*추가|1인실.{0,15}(옵션|추가))/u.test(bodyText)) {
    exceptions.push("additional-charge-or-option");
  }
  if (/단체.{0,20}(가격|요금|할인|문의|상담)/u.test(sectionText)) {
    exceptions.push("group-price-rule");
  }
  const uniqueExceptions = [...new Set(exceptions)];
  const price =
    basis && Object.keys(amounts).length > 0
      ? { basis, currency: "KRW", amounts }
      : null;
  return { price, exceptions: uniqueExceptions };
}

function parseConstraints(html, programName) {
  const intro = extractSection(html, /<h4[^>]*>\s*프로그램\s*소개\s*<\/h4>/i);
  const text = `${programName}\n${normalizeInline(intro)}`;
  const constraints = {};
  if (/(차량\s*소지자만|차량\s*필수|자가용.{0,15}필수|차량을.{0,15}(가지고|소지))/u.test(text)) {
    constraints.vehicleRequired = true;
  }
  if (/(성인만|성인에\s*한해|성인\s*전용)/u.test(text)) constraints.adultOnly = true;
  if (/(미성년|20세\s*미만|고등학생|청소년).{0,30}(부모|보호자).{0,12}(동반|동의)/u.test(text)) {
    constraints.minorRequiresGuardian = true;
  }
  const minimum = text.match(/(?:최소|예약\s*인원)\s*(\d+)명\s*(?:이상|미만)/u);
  if (minimum) constraints.minimumParticipants = Number(minimum[1]);
  if (/(가족\s*또는\s*동성|동성\s*지인|가족이나\s*동성)/u.test(text)) {
    constraints.familyOrSameGenderGroup = true;
  }
  if (/(소속|지정|연계).{0,30}(직원|대상자).{0,20}(만|대상)/u.test(text)) {
    constraints.institutionEmployeesOnly = true;
  }
  if (/(개인\s*(신청|예약).{0,8}(불가|받지|안됨)|단체만\s*(신청|예약))/u.test(text)) {
    constraints.individualApplicationNotAllowed = true;
  }
  if (/외국인.{0,25}(상담|문의|전화)/u.test(text)) {
    constraints.foreignerConsultationRequired = true;
  }
  if (/단체.{0,25}(상담|문의|전화)/u.test(text)) {
    constraints.groupConsultationRequired = true;
  }
  const unavailable = text.match(/((?:\d{1,2}월\s*[·,~및과와]\s*)+\d{1,2}월).{0,12}(미운영|운영하지|예약\s*불가)/u);
  if (unavailable) {
    constraints.unavailableMonths = [...unavailable[1].matchAll(/(\d{1,2})월/g)].map(
      (month) => Number(month[1]),
    );
  }
  return Object.keys(constraints).length > 0 ? constraints : null;
}

function parseSchedule(html) {
  const section = extractSection(html, /<h4[^>]*>\s*프로그램\s*일정\s*<\/h4>/i);
  if (!section) return { hasSchedule: false };
  const table = section.match(/<table[^>]*>([\s\S]*?)<\/table>/i)?.[1] ?? "";
  const rows = [...table.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)]
    .map((row) => row[1])
    .filter((row) => /<td\b/i.test(row));
  if (rows.length === 0) return { hasSchedule: false };
  const dayValues = rows.flatMap((row) =>
    [...normalizeInline(row).matchAll(/(\d+)\s*일차/g)].map((match) => Number(match[1])),
  );
  return {
    hasSchedule: true,
    ...(dayValues.length > 0 ? { dayCount: Math.max(...dayValues) } : {}),
    scheduleItemCount: rows.length,
  };
}

function parseSelectableDateCount(html) {
  const dates = new Set(
    [...html.matchAll(/javascript:fnc(?:Start)?DateSelect\((\d{8})\)/g)].map(
      (match) => match[1],
    ),
  );
  return dates.size;
}

function parseDetail(html, listedRecord, httpStatus, bodyBytes) {
  const contentAvailable =
    bodyBytes > 0 &&
    /프로그램\s*소개\s*및\s*일정|프로그램\s*소개|참가비용/u.test(stripTags(html));
  if (!contentAvailable) {
    const invalidListDates = listedRecord.listOperationPeriodSource
      ? [
          listedRecord.listOperationPeriodSource.start,
          listedRecord.listOperationPeriodSource.end,
        ].filter((date) => !validIsoDate(date))
      : [];
    return {
      detailStatus: "unavailable",
      detailAccess: { httpStatus, bodyBytes },
      reservationSnapshot: {
        checkedAt: CHECKED_AT,
        reservationButtonPresent: false,
      },
      validationIssues: invalidListDates.map((value) => ({
        type: "invalid-operation-date",
        sourceValue: value,
        sourceLocation: "operator-program-list",
      })),
    };
  }
  const code = html.match(/const\s+templePrgType\s*=\s*['"]([^'"]+)['"]/i)?.[1] ?? null;
  const programType = code ? { code, normalized: TYPE_LABELS[code] ?? "unknown" } : null;
  const period = parseOperationPeriod(html, listedRecord.listOperationPeriodSource);
  const { price, exceptions } = parsePrice(html, programType?.normalized);
  const schedule = parseSchedule(html);
  const constraints = parseConstraints(html, listedRecord.programName);
  const validationIssues = period.invalid.map((value) => ({
    type: "invalid-operation-date",
    sourceValue: value,
  }));
  return {
    detailStatus: "available",
    detailAccess: { httpStatus, bodyBytes },
    ...(programType ? { programType } : {}),
    ...(period.source ? { operationPeriodSource: period.source } : {}),
    ...(period.source && period.invalid.length === 0
      ? {
          operationStartDate: period.source.start,
          operationEndDate: period.source.end,
        }
      : {}),
    ...(price ? { price } : {}),
    priceExceptions: exceptions,
    ...(constraints ? { constraints } : {}),
    schedule,
    reservationSnapshot: {
      checkedAt: CHECKED_AT,
      reservationButtonPresent: /fncPaymentView\(['"]?\d+/i.test(html),
      selectableDateCountAtCheck: parseSelectableDateCount(html),
      canonicalFieldCandidate: false,
    },
    validationIssues,
  };
}

function duplicates(records, key) {
  const grouped = new Map();
  for (const record of records) {
    const value = record[key];
    grouped.set(value, [...(grouped.get(value) ?? []), record]);
  }
  return [...grouped.entries()]
    .filter(([, values]) => values.length > 1)
    .map(([value, values]) => ({
      [key]: value,
      occurrences: values.map((record) => ({
        operatorOfficialId: record.operatorOfficialId,
        programName: record.programName,
        officialUrl: record.officialUrl,
      })),
    }));
}

function makeReport(operators, records, operatorFetchIssues) {
  const operatorIds = new Set(operators.map((operator) => operator.officialId));
  const withPrograms = new Set(records.map((record) => record.operatorOfficialId));
  const zeroProgramOperators = operators
    .filter((operator) => !withPrograms.has(operator.officialId))
    .map(({ officialId, officialName, operatorType, sido, sigungu }) => ({
      officialId,
      officialName,
      operatorType,
      sido,
      sigungu,
    }));
  const duplicateOfficialProgramIds = duplicates(records, "officialProgramId");
  const orphanPrograms = records
    .filter((record) => !operatorIds.has(record.operatorOfficialId))
    .map((record) => record.officialProgramId);
  const typeCounts = { day: 0, experience: 0, rest: 0, unknown: 0, missing: 0 };
  for (const record of records) {
    const type = record.programType?.normalized ?? "missing";
    typeCounts[type] = (typeCounts[type] ?? 0) + 1;
  }
  const operatorProgramCounts = operators
    .map((operator) => ({
      officialId: operator.officialId,
      officialName: operator.officialName,
      operatorType: operator.operatorType,
      programCount: records.filter(
        (record) => record.operatorOfficialId === operator.officialId,
      ).length,
    }))
    .sort((left, right) => right.programCount - left.programCount || left.officialName.localeCompare(right.officialName, "ko"));
  const exceptionCounts = {};
  for (const exception of records.flatMap((record) => record.priceExceptions ?? [])) {
    exceptionCounts[exception] = (exceptionCounts[exception] ?? 0) + 1;
  }
  const constraintCounts = {};
  for (const record of records.filter((item) => item.constraints)) {
    for (const key of Object.keys(record.constraints)) {
      constraintCounts[key] = (constraintCounts[key] ?? 0) + 1;
    }
  }
  return {
    operatorCount: operators.length,
    templeOperatorCount: operators.filter((operator) => operator.operatorType === "temple").length,
    institutionOperatorCount: operators.filter((operator) => operator.operatorType === "institution").length,
    operatorsWithProgramsCount: withPrograms.size,
    zeroProgramOperatorCount: zeroProgramOperators.length,
    zeroProgramOperators,
    listedProgramCount: records.length,
    averageProgramsPerOperator: Number((records.length / operators.length).toFixed(2)),
    uniqueOfficialProgramIdCount: new Set(records.map((record) => record.officialProgramId)).size,
    duplicateOfficialProgramIdCount: duplicateOfficialProgramIds.length,
    duplicateOfficialProgramIds,
    crossOperatorDuplicateOfficialProgramIds: duplicateOfficialProgramIds.filter(
      (duplicate) => new Set(duplicate.occurrences.map((item) => item.operatorOfficialId)).size > 1,
    ),
    orphanProgramCount: orphanPrograms.length,
    orphanOfficialProgramIds: orphanPrograms,
    nonexistentOperatorOfficialIdCount: new Set(
      records.filter((record) => !operatorIds.has(record.operatorOfficialId)).map((record) => record.operatorOfficialId),
    ).size,
    detailAvailableCount: records.filter((record) => record.detailStatus === "available").length,
    detailUnavailableCount: records.filter((record) => record.detailStatus === "unavailable").length,
    officialUrlHttp200Count: records.filter((record) => record.detailAccess?.httpStatus === 200).length,
    officialUrlFailureCount: records.filter((record) => record.detailAccess?.httpStatus !== 200).length,
    typeCounts,
    unknownTypeCodes: [...new Set(records.filter((record) => record.programType?.normalized === "unknown").map((record) => record.programType.code))],
    missingTypeCount: records.filter((record) => !record.programType).length,
    operationPeriodAvailableCount: records.filter((record) => record.operationStartDate && record.operationEndDate).length,
    invalidDateCount: records.reduce(
      (sum, record) => sum + (record.validationIssues ?? []).filter((issue) => issue.type === "invalid-operation-date").length,
      0,
    ),
    invalidDatePrograms: records
      .filter((record) => (record.validationIssues ?? []).some((issue) => issue.type === "invalid-operation-date"))
      .map((record) => ({
        officialProgramId: record.officialProgramId,
        operatorOfficialId: record.operatorOfficialId,
        programName: record.programName,
        source: record.operationPeriodSource ?? record.listOperationPeriodSource,
        officialUrl: record.officialUrl,
      })),
    priceParsedCount: records.filter((record) => record.price).length,
    priceExceptionProgramCount: records.filter((record) => (record.priceExceptions ?? []).length > 0).length,
    priceExceptionCounts: exceptionCounts,
    constraintProgramCount: records.filter((record) => record.constraints).length,
    constraintCounts,
    schedulePresentCount: records.filter((record) => record.schedule?.hasSchedule).length,
    scheduleMissingCount: records.filter((record) => !record.schedule?.hasSchedule).length,
    scheduleItemCountTotal: records.reduce((sum, record) => sum + (record.schedule?.scheduleItemCount ?? 0), 0),
    reservationButtonPresentCount: records.filter((record) => record.reservationSnapshot.reservationButtonPresent).length,
    reservationSelectableDateProgramCountAtCheck: records.filter(
      (record) => (record.reservationSnapshot.selectableDateCountAtCheck ?? 0) > 0,
    ).length,
    templeProgramCount: records.filter((record) => record.operatorType === "temple").length,
    institutionProgramCount: records.filter((record) => record.operatorType === "institution").length,
    maxProgramOperators: operatorProgramCounts.filter(
      (operator) => operator.programCount === operatorProgramCounts[0]?.programCount,
    ),
    operatorProgramCounts,
    operatorFetchIssueCount: operatorFetchIssues.length,
    operatorFetchIssues,
  };
}

async function main() {
  const operators = readProductionOperators();
  const operatorFetchIssues = [];
  console.log(`Operator 목록 수집 시작: ${operators.length}개, concurrency=${CONCURRENCY}`);
  const listedGroups = await mapConcurrent(
    operators,
    CONCURRENCY,
    async (operator) => {
      const url = `${OPERATOR_DETAIL_URL}?templeFlag=I&templeId=${encodeURIComponent(operator.officialId)}`;
      try {
        const response = await fetchHtml(url);
        return parseListedPrograms(response.body, operator);
      } catch (error) {
        operatorFetchIssues.push({
          officialId: operator.officialId,
          officialName: operator.officialName,
          url,
          error: String(error),
        });
        return [];
      }
    },
    (done, total) => {
      if (done % 20 === 0 || done === total) console.log(`Operator ${done}/${total}`);
    },
  );
  if (operatorFetchIssues.length > 0) {
    throw new Error(`Operator 페이지 조회 실패 ${operatorFetchIssues.length}건: 재실행 필요`);
  }
  const listedRecords = listedGroups.flat();
  const previousById =
    RESUME && fs.existsSync(OUTPUT_PATH)
      ? new Map(
          JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf8")).records.map((record) => [
            record.officialProgramId,
            record,
          ]),
        )
      : new Map();
  console.log(`상세 수집 시작: listed Program ${listedRecords.length}개`);
  const records = await mapConcurrent(
    listedRecords,
    CONCURRENCY,
    async (record) => {
      const previous = previousById.get(record.officialProgramId);
      if (previous?.detailStatus === "available") return previous;
      try {
        const response = await fetchHtml(record.officialUrl);
        return {
          ...record,
          ...parseDetail(
            response.body,
            record,
            response.status,
            Buffer.byteLength(response.body, "utf8"),
          ),
          source: SOURCE_NAME,
        };
      } catch (error) {
        return {
          ...record,
          detailStatus: "unavailable",
          detailAccess: { error: String(error) },
          reservationSnapshot: {
            checkedAt: CHECKED_AT,
            reservationButtonPresent: false,
          },
          source: SOURCE_NAME,
        };
      }
    },
    (done, total) => {
      if (done % 50 === 0 || done === total) console.log(`Program ${done}/${total}`);
    },
  );
  const detailFetchErrors = records.filter((record) => record.detailAccess?.error);
  if (detailFetchErrors.length > 0) {
    throw new Error(
      `상세 조회 실패 ${detailFetchErrors.length}건: staging을 쓰지 않고 --resume 재실행 필요`,
    );
  }
  const report = makeReport(operators, records, operatorFetchIssues);
  const unexpectedDetailResponses = records.filter(
    (record) =>
      record.detailStatus === "unavailable" &&
      (record.detailAccess?.bodyBytes ?? 0) > 0,
  );
  if (unexpectedDetailResponses.length > 0) {
    throw new Error(
      `상세 본문 판별 불가 응답 ${unexpectedDetailResponses.length}건: staging을 쓰지 않고 재실행 필요`,
    );
  }
  const output = {
    schemaVersion: 1,
    purpose: "전국 production Program 반영 전 공식 목록 및 상세 데이터 품질 staging",
    source: {
      name: SOURCE_NAME,
      baseUrl: SOURCE_BASE_URL,
      checkedAt: CHECKED_AT,
      canonicalScope: "작업 시점 각 production TempleStayOperator 공식 페이지에 노출된 프로그램",
      reservationWarning:
        "reservationSnapshot은 checkedAt 시점 품질 분석용이며 canonical Program field나 예약 가능 확정값이 아님",
    },
    scope: {
      operatorCount: operators.length,
      productionOperatorsPath: "app/temples/stay/operators.ts",
      excludes: ["청춘사 test record"],
    },
    officialProgramTypeCodes: TYPE_LABELS,
    report,
    records,
  };
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(`작성: ${path.relative(process.cwd(), OUTPUT_PATH)}`);
  console.log(JSON.stringify(report, null, 2));
}

await main();
