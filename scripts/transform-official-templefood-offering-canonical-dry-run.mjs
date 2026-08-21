import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const scriptDirectory = path.dirname(scriptPath);
const repositoryRoot = path.resolve(scriptDirectory, "..");

export const inputPath = path.join(
    repositoryRoot,
    "data/temples/staging/official-templefood-offering-identity-pilot-2026-08-21.json",
);
export const outputPath = path.join(
    repositoryRoot,
    "data/temples/staging/official-templefood-offering-canonical-dry-run-2026-08-21.json",
);

const EXPECTED_SOURCE = "korean-temple-food";
const GROUP_LIST_URL =
    "https://www.koreatemplefood.com/program/experience/group-experience/list";

const AUDITED_REDIRECT_TARGETS = new Map([
    ["korean-temple-food:short-experience:2298", "list"],
    ["korean-temple-food:short-experience:2092", "list"],
    ["korean-temple-food:regular-course-run:266", "home"],
    ["korean-temple-food:regular-course-run:267", "home"],
]);

export const canonicalContract = {
    entity: "TempleFoodOffering",
    discriminator: "subtype",
    subtypes: ["shortExperience", "regularCourseRun", "groupExperience"],
    shortExperienceSessions: {
        representation: "childArray",
        identityField: "shortExperienceScheduleSeq",
        minimumItems: 0,
        userFacingEntity: false,
    },
    regularCourse: {
        representation: "provenanceField",
        identityField: "regularCourseSeq",
        canonicalEntity: false,
    },
    regularCourseRun: {
        identityField: "regularCourseScheduleSeq",
        dedupeBy: "regularCourseScheduleSeq",
    },
};

function compactObject(value) {
    return Object.fromEntries(
        Object.entries(value).filter(([, fieldValue]) => fieldValue !== undefined),
    );
}

function calculateDurationMinutes(startTime, endTime) {
    const parseTime = (value) => {
        const match = /^(\d{2}):(\d{2})$/.exec(value ?? "");
        return match ? Number(match[1]) * 60 + Number(match[2]) : undefined;
    };
    const start = parseTime(startTime);
    const end = parseTime(endTime);

    return start === undefined || end === undefined || end < start
        ? undefined
        : end - start;
}

function buildVenueRelation(record) {
    return compactObject({
        status: record.venueRelation.status,
        venueOfficialId: record.venueRelation.venueOfficialId,
        sourceVenueName:
            record.venueRelation.sourceDisplayName ??
            record.venueRelation.venueOfficialName,
    });
}

function buildSourceProvenance(record) {
    return compactObject({
        sourceFile: path.basename(inputPath),
        pilotSelection: record.pilotSelection,
        listUrl: record.sourceProvenance.listUrl,
        observedSourceFields: record.sourceProvenance.observedSourceFields,
        inputDetailPageStatus: record.sourceProvenance.detailPageStatus,
    });
}

function buildDetail(record) {
    const inputStatus = record.sourceProvenance.detailPageStatus;

    if (inputStatus === "available") {
        return {
            detailStatus: "available",
            officialDetailUrl: record.officialUrl,
            currentActionUrl: record.applicationUrl ?? record.officialUrl,
        };
    }

    if (inputStatus === "notProvided") {
        return {
            detailStatus: "unavailable",
            detailUnavailableReason: "notProvidedBySource",
            currentActionUrl: record.applicationUrl,
        };
    }

    return {
        detailStatus: "redirected",
        redirectTarget:
            AUDITED_REDIRECT_TARGETS.get(record.canonicalKey) ?? "other",
        lastKnownOfficialDetailUrl: record.officialUrl,
    };
}

function buildCommon(record) {
    return {
        source: record.source,
        subtype: record.sourceEntityType,
        canonicalKey: record.canonicalKey,
        officialName: record.officialName,
        sourceDisplayName: record.sourceDisplayName,
        venueRelation: buildVenueRelation(record),
        checkedAt: record.checkedAt,
        lastSeenAt: record.lastSeenAt,
        sourceProvenance: buildSourceProvenance(record),
        ...buildDetail(record),
    };
}

function buildApplicationSnapshot(record, sessionKeys = []) {
    if (!record.sourceSnapshot) {
        return undefined;
    }

    const snapshot = compactObject({
        checkedAt: record.sourceSnapshot.checkedAt,
        sourceApplicationStatusText:
            record.sourceSnapshot.applicationStatusText,
        appliedCount: record.sourceSnapshot.appliedCount,
        pendingCount: record.sourceSnapshot.pendingCount,
        waitingCount: record.sourceSnapshot.waitingCount,
    });

    if (
        record.sourceEntityType === "shortExperience" &&
        sessionKeys.length === 1 &&
        (snapshot.appliedCount !== undefined ||
            snapshot.pendingCount !== undefined ||
            snapshot.waitingCount !== undefined)
    ) {
        const { appliedCount, pendingCount, waitingCount, ...offeringSnapshot } =
            snapshot;
        return {
            ...offeringSnapshot,
            sessions: [
                compactObject({
                    sessionKey: sessionKeys[0],
                    appliedCount,
                    pendingCount,
                    waitingCount,
                }),
            ],
        };
    }

    return snapshot;
}

export function transformShortExperience(record) {
    const sourceSchedules = Array.isArray(record.schedule) ? record.schedule : [];
    const sourceCapacity = record.sourceSnapshot?.capacityCount;
    const sessions = sourceSchedules.map((session) =>
        compactObject({
            canonicalKey: `${EXPECTED_SOURCE}:short-experience-session:${session.shortExperienceScheduleSeq}`,
            shortExperienceScheduleSeq: session.shortExperienceScheduleSeq,
            date: session.date,
            startTime: session.startTime,
            endTime: session.endTime,
            menu: session.menu,
            capacity: sourceSchedules.length === 1 ? sourceCapacity : undefined,
        }),
    );
    const snapshot = buildApplicationSnapshot(
        record,
        sessions.map((session) => session.canonicalKey),
    );

    return compactObject({
        ...buildCommon(record),
        shortExperienceSeq: record.shortExperienceSeq,
        price: record.price,
        applicationPeriodSource: record.applicationPeriodSource,
        sessions,
        snapshot,
        validationIssues: record.validationIssues,
    });
}

export function transformRegularCourseRun(record) {
    return compactObject({
        ...buildCommon(record),
        regularCourseScheduleSeq: record.regularCourseScheduleSeq,
        regularCourseSeq: record.regularCourseSeq,
        schedule: record.coursePeriodSource,
        capacity: record.sourceSnapshot?.capacityCount,
        price: record.price,
        applicationPeriodSource: record.applicationPeriodSource,
        snapshot: buildApplicationSnapshot(record),
        validationIssues: record.validationIssues,
    });
}

export function transformGroupExperience(record) {
    const durationMinutes = calculateDurationMinutes(
        record.timeSource?.startTime,
        record.timeSource?.endTime,
    );

    return compactObject({
        ...buildCommon(record),
        groupExperienceSeq: record.groupExperienceSeq,
        officialListUrl: GROUP_LIST_URL,
        applicationUrl: record.applicationUrl,
        timeSource: compactObject({
            officialDurationText: record.timeSource?.display,
            startTime: record.timeSource?.startTime,
            endTime: record.timeSource?.endTime,
        }),
        derived:
            durationMinutes === undefined ? undefined : { durationMinutes },
        minimumParticipants: record.minimumParticipants,
        maximumParticipants: record.maximumParticipants,
        price: record.price,
        validationIssues: record.validationIssues,
    });
}

export function transformRecord(record) {
    switch (record.sourceEntityType) {
        case "shortExperience":
            return transformShortExperience(record);
        case "regularCourseRun":
            return transformRegularCourseRun(record);
        case "groupExperience":
            return transformGroupExperience(record);
        default:
            throw new Error(`Unsupported source entity type: ${record.sourceEntityType}`);
    }
}

export function transformPilot(pilot) {
    if (pilot.schemaVersion !== 1 || !Array.isArray(pilot.records)) {
        throw new Error("Unexpected TempleFood offering identity pilot schema");
    }

    return {
        schemaVersion: 1,
        description:
            "TempleFoodOffering canonical contract dry-run. This staging output is not imported by production.",
        generatedFrom: path.relative(repositoryRoot, inputPath).replaceAll("\\", "/"),
        checkedAt: pilot.checkedAt,
        contract: canonicalContract,
        records: pilot.records.map(transformRecord),
    };
}

async function main() {
    const pilot = JSON.parse(await readFile(inputPath, "utf8"));
    const output = `${JSON.stringify(transformPilot(pilot), null, 2)}\n`;

    if (process.argv.includes("--check")) {
        const existingOutput = await readFile(outputPath, "utf8");
        if (existingOutput !== output) {
            throw new Error(
                "TempleFood offering canonical dry-run output is out of date",
            );
        }
        console.log("TempleFood offering canonical dry-run output is current");
        return;
    }

    await writeFile(outputPath, output, "utf8");
    console.log(path.relative(repositoryRoot, outputPath).replaceAll("\\", "/"));
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
    await main();
}
