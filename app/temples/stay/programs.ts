import programRuntime from "../../../data/temples/generated/official-templestay-programs.runtime.json";
import {
    getTempleStayOperatorByOfficialId,
    type TempleStayOperator,
} from "./operators";

export type TempleStayProgramType = "day" | "experience" | "rest";
export type TempleStayProgramDetailStatus = "available" | "unavailable";
export type TempleStayProgramPriceStatus =
    | "parsed"
    | "partial"
    | "complex"
    | "unavailable";
export type TempleStayProgramAgeAmounts = Partial<
    Record<"adult" | "teen" | "child" | "preschool", number>
>;

export type TempleStayProgramPriceComponent = {
    chargeBasis: "person" | "room";
    periodBasis: "program" | "perNight";
    amount?: number;
    amounts?: TempleStayProgramAgeAmounts;
};

export type TempleStayProgramRoomEligibility = {
    preschoolAllowed?: boolean;
};

export type TempleStayProgramRoomOption = TempleStayProgramPriceComponent & {
    name: string;
    minOccupancy?: number;
    maxOccupancy?: number;
    eligibility?: TempleStayProgramRoomEligibility;
};

export type TempleStayProgramPriceException =
    | "additional-charge-or-option"
    | "room-dependent-price"
    | "missing-general-price-section"
    | "room-selection-price-tables"
    | "under-36-months-free";

export type TempleStayProgramPriceAdjustment = {
    name: string;
    amount?: number;
    needsReview: true;
};

export type TempleStayProgramPrice = {
    status: TempleStayProgramPriceStatus;
    currency: "KRW";
    base?: TempleStayProgramPriceComponent;
    roomOptions?: TempleStayProgramRoomOption[];
    adjustments?: TempleStayProgramPriceAdjustment[];
    exceptions?: TempleStayProgramPriceException[];
};

export type NormalizedProgramConstraints = {
    vehicleRequired?: true;
    adultOnly?: true;
    minorRequiresGuardian?: true;
    minimumParticipants?: number;
    familyOrSameGenderGroup?: true;
    institutionEmployeesOnly?: true;
    individualApplicationNotAllowed?: true;
    foreignerConsultationRequired?: true;
    groupConsultationRequired?: true;
    unavailableMonths?: number[];
};

export type ProgramValidationIssue = {
    type: string;
    sourceValue: string;
    sourceLocation: string;
};

export type TempleStayProgram = {
    source: string;
    officialProgramId: string;
    operatorOfficialId: TempleStayOperator["officialId"];
    programName: string;
    sourceDisplayName: string;
    programType?: TempleStayProgramType;
    officialProgramTypeCode?: string;
    operationStartDate?: string;
    operationEndDate?: string;
    operationPeriodSource?: {
        start: string;
        end: string;
    };
    validationIssues?: ProgramValidationIssue[];
    price: TempleStayProgramPrice;
    constraints?: NormalizedProgramConstraints;
    listed: boolean;
    detailStatus: TempleStayProgramDetailStatus;
    checkedAt: string;
    lastSeenAt: string;
    officialUrl: string;
    scheduleSummary?: {
        hasSchedule: boolean;
        dayCount?: number;
        itemCount?: number;
    };
};

export type TempleStayProgramRuntimeReport = {
    programCount: number;
    uniqueOfficialProgramIdCount: number;
    operatorCount: number;
    validOperatorRelationCount: number;
    orphanOperatorRelationCount: number;
    typeCounts: Record<TempleStayProgramType | "unknown", number>;
    detailStatusCounts: Record<TempleStayProgramDetailStatus, number>;
    priceStatusCounts: Record<TempleStayProgramPriceStatus, number>;
    canonicalOperationPeriodCount: number;
    invalidOperationDateIssueCount: number;
    roomOptionProgramCount: number;
    roomOptionCount: number;
    stableNameOverrideCount: number;
    sourceDisplayNameCount: number;
    officialUrlCount: number;
    checkedAtCount: number;
    lastSeenAtCount: number;
};

const programs = programRuntime.records as unknown as TempleStayProgram[];

function isCanonicalDate(value: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }

    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day
    );
}

function countBy<T>(values: readonly T[], getKey: (value: T) => string) {
    return values.reduce<Record<string, number>>((counts, value) => {
        const key = getKey(value);
        counts[key] = (counts[key] ?? 0) + 1;
        return counts;
    }, {});
}

function assertProgramRuntime(records: TempleStayProgram[]) {
    if (records.length !== 843) {
        throw new Error(`Expected 843 TempleStay Programs, got ${records.length}.`);
    }

    const officialIds = new Set<string>();
    const sourceIdentities = new Set<string>();

    for (const program of records) {
        if (
            !program.source ||
            !program.officialProgramId ||
            !program.operatorOfficialId ||
            !program.programName ||
            !program.sourceDisplayName ||
            !program.officialUrl ||
            !program.checkedAt ||
            !program.lastSeenAt
        ) {
            throw new Error(
                `TempleStay Program ${program.officialProgramId || "<unknown>"} is missing required source data.`,
            );
        }

        if (officialIds.has(program.officialProgramId)) {
            throw new Error(
                `Duplicate TempleStay officialProgramId: ${program.officialProgramId}.`,
            );
        }
        officialIds.add(program.officialProgramId);

        const sourceIdentity = `${program.source}\u0000${program.officialProgramId}`;
        if (sourceIdentities.has(sourceIdentity)) {
            throw new Error(`Duplicate TempleStay source identity: ${sourceIdentity}.`);
        }
        sourceIdentities.add(sourceIdentity);

        if (!getTempleStayOperatorByOfficialId(program.operatorOfficialId)) {
            throw new Error(
                `TempleStay Program ${program.officialProgramId} has unknown operatorOfficialId ${program.operatorOfficialId}.`,
            );
        }

        if (!program.listed) {
            throw new Error(
                `Initial production snapshot unexpectedly contains unlisted Program ${program.officialProgramId}.`,
            );
        }

        const officialUrl = new URL(program.officialUrl);
        if (
            officialUrl.protocol !== "https:" ||
            officialUrl.hostname !== "www.templestay.com" ||
            officialUrl.searchParams.get("templestaySeq") !==
                program.officialProgramId
        ) {
            throw new Error(
                `Invalid official URL for TempleStay Program ${program.officialProgramId}.`,
            );
        }

        for (const date of [
            program.operationStartDate,
            program.operationEndDate,
            program.checkedAt,
            program.lastSeenAt,
        ]) {
            if (date && !isCanonicalDate(date)) {
                throw new Error(
                    `Invalid canonical date ${date} on TempleStay Program ${program.officialProgramId}.`,
                );
            }
        }

        if (program.price.currency !== "KRW") {
            throw new Error(
                `Unsupported currency on TempleStay Program ${program.officialProgramId}.`,
            );
        }

        if (
            "reservationSnapshot" in program ||
            "selectableDateCountAtCheck" in program ||
            "reservationButtonPresent" in program
        ) {
            throw new Error(
                `Reservation snapshot leaked into production Program ${program.officialProgramId}.`,
            );
        }
    }

    const typeCounts = countBy(
        records,
        (program) => program.programType ?? "unknown",
    );
    const detailCounts = countBy(records, (program) => program.detailStatus);
    const priceCounts = countBy(records, (program) => program.price.status);
    const canonicalPeriodCount = records.filter(
        (program) => program.operationStartDate && program.operationEndDate,
    ).length;
    const invalidDateIssueCount = records.filter((program) =>
        program.validationIssues?.some(
            (issue) => issue.type === "invalid-operation-date",
        ),
    ).length;
    const roomOptionPrograms = records.filter(
        (program) => program.price.roomOptions?.length,
    );
    const roomOptionCount = roomOptionPrograms.reduce(
        (total, program) => total + (program.price.roomOptions?.length ?? 0),
        0,
    );
    const stableNameOverrideCount = records.filter(
        (program) => program.programName !== program.sourceDisplayName,
    ).length;

    if (
        typeCounts.day !== 213 ||
        typeCounts.experience !== 392 ||
        typeCounts.rest !== 237 ||
        typeCounts.unknown !== 1
    ) {
        throw new Error(`Unexpected TempleStay Program type counts: ${JSON.stringify(typeCounts)}.`);
    }
    if (detailCounts.available !== 842 || detailCounts.unavailable !== 1) {
        throw new Error(`Unexpected detail status counts: ${JSON.stringify(detailCounts)}.`);
    }
    if (
        priceCounts.parsed !== 675 ||
        priceCounts.partial !== 167 ||
        (priceCounts.complex ?? 0) !== 0 ||
        priceCounts.unavailable !== 1
    ) {
        throw new Error(`Unexpected price status counts: ${JSON.stringify(priceCounts)}.`);
    }
    if (canonicalPeriodCount !== 842 || invalidDateIssueCount !== 1) {
        throw new Error(
            `Unexpected operation-period result: ${canonicalPeriodCount} canonical, ${invalidDateIssueCount} invalid.`,
        );
    }
    if (roomOptionPrograms.length !== 20 || roomOptionCount !== 57) {
        throw new Error(
            `Unexpected room option result: ${roomOptionPrograms.length} Programs, ${roomOptionCount} options.`,
        );
    }
    if (stableNameOverrideCount !== 5) {
        throw new Error(
            `Expected five stable-name overrides, got ${stableNameOverrideCount}.`,
        );
    }

    const unavailable = records.find(
        (program) => program.officialProgramId === "28166",
    );
    if (
        !unavailable ||
        unavailable.detailStatus !== "unavailable" ||
        unavailable.price.status !== "unavailable" ||
        unavailable.operationPeriodSource?.end !== "2026-09-31" ||
        unavailable.operationEndDate !== undefined ||
        unavailable.programType !== undefined ||
        unavailable.constraints !== undefined ||
        unavailable.scheduleSummary !== undefined
    ) {
        throw new Error("Detail-unavailable TempleStay Program 28166 is not safely represented.");
    }
}

assertProgramRuntime(programs);

export const templeStayPrograms: readonly TempleStayProgram[] = programs;
export const templeStayProgramReport =
    programRuntime.report as unknown as TempleStayProgramRuntimeReport;

const programsByOfficialId = new Map(
    templeStayPrograms.map((program) => [program.officialProgramId, program]),
);
const programsByOperatorOfficialId = new Map<
    TempleStayOperator["officialId"],
    TempleStayProgram[]
>();

for (const program of templeStayPrograms) {
    const operatorPrograms =
        programsByOperatorOfficialId.get(program.operatorOfficialId) ?? [];
    operatorPrograms.push(program);
    programsByOperatorOfficialId.set(program.operatorOfficialId, operatorPrograms);
}

export function getTempleStayProgramByOfficialId(officialProgramId: string) {
    return programsByOfficialId.get(officialProgramId);
}

export function getTempleStayProgramsByOperatorOfficialId(
    operatorOfficialId: TempleStayOperator["officialId"],
): readonly TempleStayProgram[] {
    return programsByOperatorOfficialId.get(operatorOfficialId) ?? [];
}

export function getListedTempleStayPrograms() {
    return templeStayPrograms.filter((program) => program.listed);
}
