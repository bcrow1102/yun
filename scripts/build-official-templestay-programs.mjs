import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const nationwideStagingPath = path.join(
    repositoryRoot,
    "data/temples/staging/official-templestay-programs-2026-08-21.json",
);
const investigationPath = path.join(
    repositoryRoot,
    "data/temples/staging/official-templestay-program-price-investigation-2026-08-21.json",
);
const outputPath = path.join(
    repositoryRoot,
    "data/temples/generated/official-templestay-programs.runtime.json",
);
const operatorSourcePath = path.join(
    repositoryRoot,
    "app/temples/stay/operators.ts",
);
const checkOnly = process.argv.includes("--check");

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function sha256(value) {
    return createHash("sha256").update(value).digest("hex");
}

function compactObject(entries) {
    return Object.fromEntries(entries.filter(([, value]) => value !== undefined));
}

function toPriceComponent(price) {
    if (!price) {
        return undefined;
    }

    return {
        chargeBasis: "person",
        periodBasis: price.basis,
        amounts: price.amounts,
    };
}

function toRoomOption(roomOption) {
    return compactObject([
        ["name", roomOption.name],
        ["chargeBasis", roomOption.chargeBasis],
        ["periodBasis", roomOption.periodBasis],
        ["amount", roomOption.amount],
        ["amounts", roomOption.amounts],
        ["minOccupancy", roomOption.minOccupancy],
        ["maxOccupancy", roomOption.maxOccupancy],
        ["eligibility", roomOption.eligibility],
    ]);
}

function toPrice(record, classification, roomInvestigation) {
    if (record.detailStatus === "unavailable") {
        return { status: "unavailable", currency: "KRW" };
    }

    const result = classification?.result;
    const status =
        result === "partiallyRepresentable"
            ? "partial"
            : result === "complex"
              ? "complex"
              : "parsed";
    const adjustments = roomInvestigation?.displayedAddOns?.map((adjustment) => ({
        name: adjustment.name,
        amount: adjustment.amount,
        needsReview: true,
    }));

    return compactObject([
        ["status", status],
        ["currency", "KRW"],
        ["base", toPriceComponent(record.price)],
        [
            "roomOptions",
            roomInvestigation?.roomOptions.map(toRoomOption),
        ],
        ["adjustments", adjustments?.length ? adjustments : undefined],
        [
            "exceptions",
            record.priceExceptions?.length ? record.priceExceptions : undefined,
        ],
    ]);
}

function buildRuntime(nationwide, investigation, inputHashes, operatorOfficialIds) {
    const nameOverrides = new Map(
        investigation.nameInvestigations.map((item) => [
            item.officialProgramId,
            item,
        ]),
    );
    const priceClassifications = new Map(
        investigation.priceExceptionApplicability.classifications.map((item) => [
            item.officialProgramId,
            item,
        ]),
    );
    const roomInvestigations = new Map(
        investigation.roomInvestigations.map((item) => [
            item.officialProgramId,
            item,
        ]),
    );

    const records = nationwide.records.map((record) => {
        const nameOverride = nameOverrides.get(record.officialProgramId);
        const roomInvestigation = roomInvestigations.get(record.officialProgramId);
        const operationPeriodSource =
            record.operationPeriodSource ?? record.listOperationPeriodSource;
        const scheduleSummary = record.schedule
            ? compactObject([
                  ["hasSchedule", record.schedule.hasSchedule],
                  ["dayCount", record.schedule.dayCount],
                  ["itemCount", record.schedule.scheduleItemCount],
              ])
            : undefined;

        return compactObject([
            ["source", record.source],
            ["officialProgramId", record.officialProgramId],
            ["operatorOfficialId", record.operatorOfficialId],
            ["programName", nameOverride?.programName ?? record.programName],
            [
                "sourceDisplayName",
                nameOverride?.sourceDisplayName ?? record.programName,
            ],
            ["programType", record.programType?.normalized],
            ["officialProgramTypeCode", record.programType?.code],
            ["operationStartDate", record.operationStartDate],
            ["operationEndDate", record.operationEndDate],
            ["operationPeriodSource", operationPeriodSource],
            [
                "validationIssues",
                record.validationIssues?.length
                    ? record.validationIssues
                    : undefined,
            ],
            [
                "price",
                toPrice(
                    record,
                    priceClassifications.get(record.officialProgramId),
                    roomInvestigation,
                ),
            ],
            ["constraints", record.constraints],
            ["listed", record.listed],
            ["detailStatus", record.detailStatus],
            ["checkedAt", record.checkedAt],
            ["lastSeenAt", record.lastSeenAt],
            ["officialUrl", record.officialUrl],
            ["scheduleSummary", scheduleSummary],
        ]);
    });

    const countBy = (values, getKey) =>
        values.reduce((counts, value) => {
            const key = getKey(value);
            counts[key] = (counts[key] ?? 0) + 1;
            return counts;
        }, {});
    const roomOptionPrograms = records.filter(
        (record) => record.price.roomOptions?.length,
    );
    const rawTypeCounts = countBy(
        records,
        (record) => record.programType ?? "unknown",
    );
    const rawDetailStatusCounts = countBy(records, (record) => record.detailStatus);
    const rawPriceStatusCounts = countBy(records, (record) => record.price.status);
    const report = {
        programCount: records.length,
        uniqueOfficialProgramIdCount: new Set(
            records.map((record) => record.officialProgramId),
        ).size,
        operatorCount: operatorOfficialIds.size,
        validOperatorRelationCount: records.filter((record) =>
            operatorOfficialIds.has(record.operatorOfficialId),
        ).length,
        orphanOperatorRelationCount: records.filter(
            (record) => !operatorOfficialIds.has(record.operatorOfficialId),
        ).length,
        typeCounts: {
            day: rawTypeCounts.day ?? 0,
            experience: rawTypeCounts.experience ?? 0,
            rest: rawTypeCounts.rest ?? 0,
            unknown: rawTypeCounts.unknown ?? 0,
        },
        detailStatusCounts: {
            available: rawDetailStatusCounts.available ?? 0,
            unavailable: rawDetailStatusCounts.unavailable ?? 0,
        },
        priceStatusCounts: {
            parsed: rawPriceStatusCounts.parsed ?? 0,
            partial: rawPriceStatusCounts.partial ?? 0,
            complex: rawPriceStatusCounts.complex ?? 0,
            unavailable: rawPriceStatusCounts.unavailable ?? 0,
        },
        canonicalOperationPeriodCount: records.filter(
            (record) => record.operationStartDate && record.operationEndDate,
        ).length,
        invalidOperationDateIssueCount: records.filter((record) =>
            record.validationIssues?.some(
                (issue) => issue.type === "invalid-operation-date",
            ),
        ).length,
        roomOptionProgramCount: roomOptionPrograms.length,
        roomOptionCount: roomOptionPrograms.reduce(
            (total, record) => total + record.price.roomOptions.length,
            0,
        ),
        stableNameOverrideCount: records.filter(
            (record) => record.programName !== record.sourceDisplayName,
        ).length,
        sourceDisplayNameCount: records.filter(
            (record) => record.sourceDisplayName,
        ).length,
        officialUrlCount: records.filter((record) => record.officialUrl).length,
        checkedAtCount: records.filter((record) => record.checkedAt).length,
        lastSeenAtCount: records.filter((record) => record.lastSeenAt).length,
    };

    assert(report.programCount === 843, "Expected 843 production programs.");
    assert(
        report.uniqueOfficialProgramIdCount === 843,
        "officialProgramId must be unique across all 843 programs.",
    );
    assert(
        report.operatorCount === 171 &&
            report.validOperatorRelationCount === 843 &&
            report.orphanOperatorRelationCount === 0,
        `Unexpected Operator relation result: ${JSON.stringify({
            operatorCount: report.operatorCount,
            valid: report.validOperatorRelationCount,
            orphan: report.orphanOperatorRelationCount,
        })}`,
    );
    assert(
        JSON.stringify(report.typeCounts) ===
            JSON.stringify({ day: 213, experience: 392, rest: 237, unknown: 1 }),
        `Unexpected program type counts: ${JSON.stringify(report.typeCounts)}`,
    );
    assert(
        report.detailStatusCounts.available === 842 &&
            report.detailStatusCounts.unavailable === 1,
        `Unexpected detail counts: ${JSON.stringify(report.detailStatusCounts)}`,
    );
    assert(
        report.priceStatusCounts.parsed === 675 &&
            report.priceStatusCounts.partial === 167 &&
            (report.priceStatusCounts.complex ?? 0) === 0 &&
            report.priceStatusCounts.unavailable === 1,
        `Unexpected price counts: ${JSON.stringify(report.priceStatusCounts)}`,
    );
    assert(
        report.canonicalOperationPeriodCount === 842 &&
            report.invalidOperationDateIssueCount === 1,
        "Unexpected operation-period validation result.",
    );
    assert(
        report.roomOptionProgramCount === 20 && report.roomOptionCount === 57,
        "Expected 20 room-option programs and 57 room options.",
    );
    assert(
        report.stableNameOverrideCount === 5 &&
            report.sourceDisplayNameCount === 843,
        "Expected five stable-name overrides and 843 source display names.",
    );

    const unavailable = records.find(
        (record) => record.officialProgramId === "28166",
    );
    assert(unavailable, "Missing detail-unavailable program 28166.");
    for (const field of [
        "programType",
        "officialProgramTypeCode",
        "operationStartDate",
        "operationEndDate",
        "constraints",
        "scheduleSummary",
    ]) {
        assert(
            unavailable[field] === undefined,
            `Program 28166 must not infer ${field}.`,
        );
    }
    assert(
        unavailable.operationPeriodSource?.end === "2026-09-31" &&
            unavailable.price.status === "unavailable",
        "Program 28166 must preserve its invalid source period and unavailable price.",
    );

    return {
        schemaVersion: 1,
        generatedFrom: {
            nationwideStaging:
                "data/temples/staging/official-templestay-programs-2026-08-21.json",
            nationwideStagingSha256: inputHashes.nationwide,
            priceInvestigation:
                "data/temples/staging/official-templestay-program-price-investigation-2026-08-21.json",
            priceInvestigationSha256: inputHashes.investigation,
        },
        report,
        records,
    };
}

const [nationwideSource, investigationSource, operatorSource] = await Promise.all([
    readFile(nationwideStagingPath, "utf8"),
    readFile(investigationPath, "utf8"),
    readFile(operatorSourcePath, "utf8"),
]);
const operatorOfficialIds = new Set(
    [...operatorSource.matchAll(/"officialId"\s*:\s*"([^"]+)"/g)].map(
        (match) => match[1],
    ),
);
const runtime = buildRuntime(
    JSON.parse(nationwideSource),
    JSON.parse(investigationSource),
    {
        nationwide: sha256(nationwideSource),
        investigation: sha256(investigationSource),
    },
    operatorOfficialIds,
);
const serialized = `${JSON.stringify(runtime, null, 2)}\n`;

if (checkOnly) {
    const existing = await readFile(outputPath, "utf8");
    assert(
        existing === serialized,
        "Production TempleStay Program runtime JSON is out of date. Run npm run templestay:programs:build.",
    );
    console.log(`Validated ${runtime.report.programCount} production programs.`);
} else {
    await writeFile(outputPath, serialized, "utf8");
    console.log(
        `Generated ${path.relative(repositoryRoot, outputPath)} with ${runtime.report.programCount} programs.`,
    );
}
