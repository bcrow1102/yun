import fs from "node:fs";
import path from "node:path";

const CHECKED_AT = "2026-08-21";
const SOURCE_PATH = path.resolve(
  "data/temples/staging/official-templestay-programs-2026-08-21.json",
);
const OUTPUT_PATH = path.resolve(
  "data/temples/staging/official-templestay-program-price-investigation-2026-08-21.json",
);
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140.0 Safari/537.36";

const AGE_LABELS = new Map([
  ["성인", "adult"],
  ["중고생", "teen"],
  ["청소년", "teen"],
  ["초등생", "child"],
  ["어린이", "child"],
  ["미취학", "preschool"],
  ["유아", "preschool"],
]);

const stableNameReviews = new Map([
  [
    "28582",
    {
      programName:
        "2026 대흥사 사찰음식_ 내가 만든 절밥(1차 08.08(토), 2차 08.09(일), 3차 09.12(토), 4차 09.13(일)-당일 체험, 사회공익 나눔 템플스테이",
      removedStatusText: ",선착순 마감 입니다~~",
      statusKind: "program-closed",
    },
  ],
  [
    "28959",
    {
      programName: "마곡사의 청춘시그널 1기 모집",
      removedStatusText: "[ ~ 8월 22일까지 - 남자 모집마감, 여 3명 선착순 모집중]",
      statusKind: "gender-specific-recruitment-availability",
    },
  ],
  [
    "28887",
    {
      programName: "[체험형] 2026년 마곡사 한가위 스테이",
      removedStatusText: " [남은 방사 0개]",
      statusKind: "remaining-room-count",
    },
  ],
  [
    "27600",
    {
      programName: "'해인삼매 선명상' 내 마음을 찾아서( 목,금,토 2박3일)",
      removedStatusText: "-9/17,10/15은 1인실 마감입니다.",
      statusKind: "date-specific-room-closed",
    },
  ],
  [
    "15480",
    {
      programName: "주 중 (월-금) 휴식형",
      removedStatusText: "-11/13일은 1인실 마감입니다.",
      statusKind: "date-specific-room-closed",
    },
  ],
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

function inline(value) {
  return stripTags(value).replace(/\s+/g, " ").trim();
}

function amount(value) {
  const normalized = value.replace(/[원,\s]/g, "");
  if (normalized === "무료") return 0;
  return /^\d+$/.test(normalized) ? Number(normalized) : null;
}

async function fetchOfficialHtml(url) {
  let lastError;
  for (let attempt = 1; attempt <= 8; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45_000);
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          "user-agent": USER_AGENT,
          referer: "https://www.templestay.com/",
          "accept-language": "ko-KR,ko;q=0.9",
        },
      });
      const body = await response.text();
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      if (/템플스테이\s*-\s*접속\s*대기\s*중/u.test(body)) {
        throw new Error("official-site-queue-response");
      }
      if (!/프로그램\s*소개\s*및\s*일정/u.test(body)) {
        throw new Error(`unexpected-detail-body:${Buffer.byteLength(body, "utf8")}`);
      }
      return {
        body,
        access: {
          httpStatus: response.status,
          bodyBytes: Buffer.byteLength(body, "utf8"),
          attempts: attempt,
        },
      };
    } catch (error) {
      lastError = error;
      if (attempt < 8) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 1_200));
      }
    } finally {
      clearTimeout(timeout);
    }
  }
  throw new Error(`${String(lastError)} (${url})`);
}

async function mapConcurrent(items, concurrency, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  async function run() {
    while (true) {
      const index = cursor;
      cursor += 1;
      if (index >= items.length) return;
      results[index] = await worker(items[index], index);
      console.log(`${index + 1}/${items.length} ${items[index].officialProgramId}`);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => run()));
  return results;
}

function parseFeeTable(chunk) {
  const table = [...chunk.matchAll(/<table[^>]*>([\s\S]*?)<\/table>/gi)].at(-1)?.[1] ?? "";
  const rows = [...table.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map((match) => match[1]);
  const headers = [...(rows[0] ?? "").matchAll(/<th[^>]*>([\s\S]*?)<\/th>/gi)].map((match) =>
    inline(match[1]),
  );
  const values = [...(rows[1] ?? "").matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((match) =>
    inline(match[1]),
  );
  const amounts = {};
  const unmapped = [];
  for (let index = 0; index < Math.min(headers.length, values.length); index += 1) {
    const key = AGE_LABELS.get(headers[index]);
    const parsed = amount(values[index]);
    if (key && parsed !== null) amounts[key] = parsed;
    else unmapped.push({ label: headers[index], sourceValue: values[index] });
  }
  return { amounts, unmapped, columnCount: headers.length };
}

function parseExplicitOccupancy(name) {
  const range = name.match(/(\d+)\s*(?:인\s*)?[~～]\s*(\d+)\s*인/u);
  if (range) {
    return {
      minOccupancy: Number(range[1]),
      maxOccupancy: Number(range[2]),
      occupancyEvidence: "room-option-name",
    };
  }
  const single = name.match(/(?:^|[^\d])(1|2|3|4)\s*인\s*(?:실|침대|온돌)/u);
  if (single) {
    return {
      minOccupancy: Number(single[1]),
      maxOccupancy: Number(single[1]),
      occupancyEvidence: "room-option-name",
    };
  }
  const maximum = name.match(/최대\s*(\d+)\s*인/u);
  const minimum = name.match(/(?:기본|min)\s*(\d+)\s*인/u);
  if (minimum || maximum) {
    return {
      ...(minimum ? { minOccupancy: Number(minimum[1]) } : {}),
      ...(maximum ? { maxOccupancy: Number(maximum[1]) } : {}),
      occupancyEvidence: "room-option-name",
    };
  }
  return {};
}

function parseRoomOptions(html) {
  const matches = [...html.matchAll(/href=["']javascript:fncRoomSelect\(['"]?(\d+)["']?\)["']/gi)];
  return matches.map((match, index) => {
    const previousEnd = index === 0 ? 0 : matches[index - 1].index + matches[index - 1][0].length;
    const chunk = html.slice(previousEnd, match.index);
    const titles = [...chunk.matchAll(/<strong[^>]*class=["'][^"']*tit[^"']*["'][^>]*>([\s\S]*?)<\/strong>/gi)];
    const infos = [...chunk.matchAll(/<span[^>]*class=["'][^"']*info[^"']*["'][^>]*>([\s\S]*?)<\/span>/gi)];
    const name = inline(titles.at(-1)?.[1] ?? "");
    const occupancyText = inline(infos.at(-1)?.[1] ?? "");
    const minimum = occupancyText.match(/최소\s*(\d+)\s*명/u)?.[1];
    const maximum = occupancyText.match(/최대\s*(\d+)\s*명/u)?.[1];
    const standard = occupancyText.match(/기준\s*(\d+)\s*명/u)?.[1];
    const fee = parseFeeTable(chunk);
    const explicitOccupancy = parseExplicitOccupancy(name);
    return {
      sourceRoomOptionId: match[1],
      name,
      chargeBasis: Object.keys(fee.amounts).length > 0 ? "person" : "unknown",
      amounts: fee.amounts,
      ...explicitOccupancy,
      ...(standard ? { displayedStandardParticipantCount: Number(standard) } : {}),
      ...(minimum ? { displayedMinimumParticipantLimit: Number(minimum) } : {}),
      ...(maximum ? { displayedMaximumParticipantLimit: Number(maximum) } : {}),
      ...(occupancyText ? { occupancySourceSummary: occupancyText } : {}),
      ...(occupancyText.includes("미취학 불가")
        ? { eligibility: { preschoolAllowed: false } }
        : {}),
      ...(fee.unmapped.length > 0 ? { unmappedFeeCells: fee.unmapped } : {}),
    };
  });
}

function parseDisplayedAddOns(html) {
  const optionBlocks = [...html.matchAll(/<dl[^>]*class=["'][^"']*option[^"']*["'][^>]*>([\s\S]*?)<\/dl>/gi)];
  const options = optionBlocks.flatMap((block) =>
    [...block[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map((item) => {
      const name = inline(item[1].match(/<span[^>]*>([\s\S]*?)<\/span>/i)?.[1] ?? "");
      const sourceAmount = inline(item[1].match(/<em[^>]*>([\s\S]*?)<\/em>/i)?.[1] ?? "");
      return {
        name,
        amount: amount(sourceAmount),
        applicationBasis: "not-inferred",
      };
    }),
  );
  const deduped = new Map();
  for (const option of options) {
    if (!option.name || option.amount === null) continue;
    deduped.set(`${option.name}|${option.amount}`, option);
  }
  return [...deduped.values()];
}

function reviewSignals(html) {
  const text = inline(html);
  const signals = [];
  if (/1인실.{0,25}(추가|옵션|별도)/u.test(text)) signals.push("single-use-supplement");
  if (/(추가\s*인원|인원\s*추가).{0,25}(원|요금|비용)/u.test(text)) signals.push("additional-person-fee");
  if (/(회원|군인|소방|할인).{0,30}(할인|전용|특별)/u.test(text)) signals.push("eligibility-or-discount-rule");
  if (/객실.{0,30}(금액|가격|요금).{0,30}(다르|상이)/u.test(text)) signals.push("room-dependent-fee");
  return [...new Set(signals)];
}

function inspectPrice(record, html, access) {
  const periodType = html.match(/const\s+periodType\s*=\s*['"](FIXED|FLEXIBLE)['"]/i)?.[1] ?? null;
  const periodBasis = periodType === "FIXED" ? "program" : periodType === "FLEXIBLE" ? "perNight" : "unknown";
  const roomOptions = parseRoomOptions(html).map((option) => ({ ...option, periodBasis }));
  const addOns = parseDisplayedAddOns(html);
  const signals = reviewSignals(html);
  const incompleteOptions = roomOptions.filter(
    (option) =>
      !option.name ||
      option.chargeBasis === "unknown" ||
      Object.keys(option.amounts).length === 0 ||
      periodBasis === "unknown" ||
      option.unmappedFeeCells,
  );
  let structureStatus = "parsed";
  const reasons = [];
  if (roomOptions.length === 0 || incompleteOptions.length > 0) {
    structureStatus = "complex";
    reasons.push("room-option-core-fields-incomplete");
  }
  if (signals.includes("additional-person-fee")) {
    structureStatus = "complex";
    reasons.push("additional-person-fee-not-exposed-as-structured-field");
  }
  const recommendedPriceStatus =
    structureStatus === "complex"
      ? "complex"
      : record.priceExceptions.includes("additional-charge-or-option")
        ? "partial"
        : "parsed";
  return {
    officialProgramId: record.officialProgramId,
    operatorOfficialId: record.operatorOfficialId,
    operatorName: record.operatorName,
    sourceDisplayName: record.programName,
    officialUrl: record.officialUrl,
    checkedAt: CHECKED_AT,
    detailAccess: access,
    periodBasis,
    roomOptionCount: roomOptions.length,
    multipleRoomOptions: roomOptions.length > 1,
    roomOptions,
    displayedAddOns: addOns,
    knownExceptionTypes: record.priceExceptions,
    reviewSignals: signals,
    structureStatus,
    structureReasons: reasons,
    recommendedPriceStatus,
  };
}

function exceptionApplicability(staging, roomInvestigations) {
  const exceptions = staging.records.filter((record) => (record.priceExceptions ?? []).length > 0);
  const roomById = new Map(roomInvestigations.map((record) => [record.officialProgramId, record]));
  const classifications = exceptions.map((record) => {
    const room = roomById.get(record.officialProgramId);
    if (room) {
      return {
        officialProgramId: record.officialProgramId,
        result:
          room.recommendedPriceStatus === "parsed"
            ? "representable"
            : room.recommendedPriceStatus === "partial"
              ? "partiallyRepresentable"
              : "complex",
        reason:
          room.recommendedPriceStatus === "parsed"
            ? "targeted-room-options-parsed"
            : room.recommendedPriceStatus === "partial"
              ? "room-options-parsed-but-additional-charge-remains-limited-exception"
              : room.structureReasons.join(","),
      };
    }
    if (record.price) {
      return {
        officialProgramId: record.officialProgramId,
        result: "partiallyRepresentable",
        reason: "base-price-parsed-but-exception-detail-not-structured-in-existing-staging",
      };
    }
    return {
      officialProgramId: record.officialProgramId,
      result: "complex",
      reason: "no-safe-structured-price",
    };
  });
  return {
    exceptionProgramCount: exceptions.length,
    counts: {
      representable: classifications.filter((item) => item.result === "representable").length,
      partiallyRepresentable: classifications.filter(
        (item) => item.result === "partiallyRepresentable",
      ).length,
      complex: classifications.filter((item) => item.result === "complex").length,
    },
    classifications,
  };
}

async function main() {
  const staging = JSON.parse(fs.readFileSync(SOURCE_PATH, "utf8"));
  const roomOnly = staging.records.filter((record) =>
    record.priceExceptions?.includes("room-selection-price-tables"),
  );
  if (roomOnly.length !== 20) {
    throw new Error(`room-only 대상이 20개가 아닙니다: ${roomOnly.length}`);
  }
  const stateNames = staging.records.filter((record) => stableNameReviews.has(record.officialProgramId));
  if (stateNames.length !== 5) {
    throw new Error(`상태 이름 대상이 5개가 아닙니다: ${stateNames.length}`);
  }
  const roomInvestigations = await mapConcurrent(roomOnly, 2, async (record) => {
    const { body, access } = await fetchOfficialHtml(record.officialUrl);
    return inspectPrice(record, body, access);
  });
  const nameInvestigations = stateNames.map((record) => {
    const review = stableNameReviews.get(record.officialProgramId);
    if (`${review.programName}${review.removedStatusText}` !== record.programName) {
      throw new Error(`이름 분리 검증 실패: ${record.officialProgramId}`);
    }
    return {
      officialProgramId: record.officialProgramId,
      operatorOfficialId: record.operatorOfficialId,
      operatorName: record.operatorName,
      programName: review.programName,
      sourceDisplayName: record.programName,
      removedStatusText: review.removedStatusText,
      statusKind: review.statusKind,
      decision: "manual-explicit-status-suffix-removal",
      officialUrl: record.officialUrl,
      checkedAt: CHECKED_AT,
    };
  });
  const applicability = exceptionApplicability(staging, roomInvestigations);
  const simpleParsedCount = staging.records.filter(
    (record) => record.price && (record.priceExceptions ?? []).length === 0,
  ).length;
  const projectedParsedCount = simpleParsedCount + applicability.counts.representable;
  const projectedPartialCount = applicability.counts.partiallyRepresentable;
  const projectedComplexCount = applicability.counts.complex;
  const nationwidePriceStatusProjection = {
    parsed: projectedParsedCount,
    partial: projectedPartialCount,
    complex: projectedComplexCount,
    unavailable:
      staging.records.length -
      projectedParsedCount -
      projectedPartialCount -
      projectedComplexCount,
  };
  if (
    Object.values(nationwidePriceStatusProjection).reduce((sum, count) => sum + count, 0) !==
    staging.records.length
  ) {
    throw new Error("전국 priceStatus projection 합계 불일치");
  }
  const structureCounts = {
    parsed: roomInvestigations.filter((record) => record.structureStatus === "parsed").length,
    complex: roomInvestigations.filter((record) => record.structureStatus === "complex").length,
  };
  const roomStructureTypes = {
    personByAgePerNight: roomInvestigations.filter(
      (record) =>
        record.periodBasis === "perNight" &&
        record.roomOptions.every((option) => option.chargeBasis === "person"),
    ).length,
    personByAgePerProgram: roomInvestigations.filter(
      (record) =>
        record.periodBasis === "program" &&
        record.roomOptions.every((option) => option.chargeBasis === "person"),
    ).length,
    withMultipleRoomOptions: roomInvestigations.filter((record) => record.multipleRoomOptions).length,
    withDisplayedAddOns: roomInvestigations.filter((record) => record.displayedAddOns.length > 0).length,
    withAgeDifferentiatedAmounts: roomInvestigations.filter((record) =>
      record.roomOptions.some(
        (option) => new Set(Object.values(option.amounts)).size > 1,
      ),
    ).length,
    totalRoomOptionCount: roomInvestigations.reduce(
      (sum, record) => sum + record.roomOptionCount,
      0,
    ),
    roomOptionsWithExplicitOccupancy: roomInvestigations.reduce(
      (sum, record) =>
        sum +
        record.roomOptions.filter(
          (option) => option.minOccupancy || option.maxOccupancy,
        ).length,
      0,
    ),
  };
  const output = {
    schemaVersion: 1,
    purpose: "production Program 가격 roomOption 및 상태성 source programName 최소 모델 검토",
    source: {
      authority: "한국불교문화사업단 공식 템플스테이",
      nationwideStagingPath:
        "data/temples/staging/official-templestay-programs-2026-08-21.json",
      checkedAt: CHECKED_AT,
      scopeNote: "전국 재수집 없이 기존 staging의 room-only 20개 상세만 재확인",
    },
    report: {
      roomOnlyProgramCount: roomInvestigations.length,
      roomStructureCounts: structureCounts,
      roomStructureTypes,
      priceExceptionApplicability: applicability.counts,
      nationwidePriceStatusProjection,
      stateNameProgramCount: nameInvestigations.length,
    },
    proposedPriceModel: {
      principle:
        "기본 비교 정보만 제공하고 객실·인원·연령·옵션·예약 시점에 따른 최종 결제 금액은 공식 페이지에서 확인",
      requiredAxes: ["chargeBasis: person | room", "periodBasis: program | perNight"],
      priceStatusValues: ["parsed", "partial", "complex", "unavailable"],
      roomOptionFields: [
        "name",
        "chargeBasis",
        "periodBasis",
        "amounts",
        "minOccupancy?",
        "maxOccupancy?",
        "eligibility?",
      ],
      optionalAdjustmentFields: [
        "name",
        "amount",
        "applicationBasis?: perSelection | perNight | perPerson",
        "appliesWhen?",
      ],
      stagingOnlyRoomFields: [
        "sourceRoomOptionId",
        "displayedMinimumParticipantLimit",
        "displayedMaximumParticipantLimit",
        "occupancySourceSummary",
      ],
      occupancyWarning:
        "공식 카드의 '최대 N명'은 객실 물리 정원이 아니라 해당 선택지의 참가 제한/수용량일 수 있어 maxOccupancy로 승격하지 않음",
      avoid: ["final-total-calculation", "live-room-availability", "live-remaining-capacity"],
    },
    roomInvestigations,
    priceExceptionApplicability: applicability,
    namePolicy: {
      separateProgramNameAndSourceDisplayName: true,
      normalizationScope:
        "명백한 현재 마감·잔여 객실 suffix를 provenance가 있는 개별 검토로만 제거하며 일반 단어 기반 자동 삭제는 하지 않음",
      preserve: ["sourceDisplayName", "checkedAt"],
    },
    nameInvestigations,
    proposedProductionProgramModel: {
      identityAndRelation: ["source", "officialProgramId", "operatorOfficialId"],
      name: ["programName", "sourceDisplayName"],
      classification: ["programType?", "officialProgramTypeCode?"],
      operation: [
        "operationStartDate?",
        "operationEndDate?",
        "operationPeriodSource?",
        "validationIssues?",
      ],
      price: [
        "status: parsed | partial | complex | unavailable",
        "currency?: KRW",
        "base?",
        "roomOptions?",
        "exceptions?",
      ],
      optionalComparisonFacts: ["constraints?", "scheduleSummary?"],
      lifecycle: ["listed", "detailStatus", "checkedAt", "lastSeenAt"],
      officialSource: ["officialUrl", "source"],
      excluded: [
        "selectableDateCountAtCheck",
        "remainingCapacity",
        "currentRoomAvailability",
        "computedFinalPaymentAmount",
      ],
    },
    detailUnavailableCompatibility: {
      officialProgramId: "28166",
      safeFields: [
        "officialProgramId",
        "operatorOfficialId",
        "programName",
        "sourceDisplayName",
        "listed",
        "detailStatus",
        "officialUrl",
        "source",
        "checkedAt",
        "lastSeenAt",
        "validationIssues",
      ],
      omittedUnverifiedFields: [
        "programType",
        "officialProgramTypeCode",
        "operationStartDate",
        "operationEndDate",
        "price",
        "constraints",
        "scheduleSummary",
      ],
    },
  };
  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(`작성: ${path.relative(process.cwd(), OUTPUT_PATH)}`);
  console.log(JSON.stringify(output.report, null, 2));
}

await main();
