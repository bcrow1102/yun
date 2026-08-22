import offeringRuntime from "./generated/official-templefood-offerings.runtime.json";
import venueRuntime from "./generated/official-templefood-venues.runtime.json";
import {
    getTempleBySlug,
    type Temple,
    type TempleSlug,
} from "../../app/temples/guide/temples";

const SOURCE = "korean-temple-food" as const;

export type TempleFoodVenueRole =
    | "specialtyTemple"
    | "educationInstitution";
export type TempleFoodVenueKey =
    | `korean-temple-food:venue:${string}`
    | `korean-temple-food:venue:temple:${TempleSlug}`;

export type TempleFoodValidationIssue = {
    code: string;
    detail: string;
    severity?: "warning" | "high";
};

type TempleFoodVenueBase = {
    source: string;
    officialId?: string;
    officialName: string;
    sourceDisplayName?: string;
    officialUrl: string;
    checkedAt: string;
    lastSeenAt: string;
    relationStatus: "matched" | "notApplicable";
    address: string;
    sido: string;
    sigungu: string;
    specialtyTemple: boolean;
    educationInstitution: boolean;
    sourceReferences?: Record<string, string>;
    validationIssues?: TempleFoodValidationIssue[];
};

export type TempleFoodTempleVenueSource = TempleFoodVenueBase & {
    operatorType: "temple";
    templeSlug: TempleSlug;
    relationStatus: "matched";
};

export type TempleFoodInstitutionVenueSource = TempleFoodVenueBase & {
    operatorType: "institution";
    officialId: string;
    templeSlug?: never;
    relationStatus: "notApplicable";
};

type TempleFoodVenueSource =
    | TempleFoodTempleVenueSource
    | TempleFoodInstitutionVenueSource;

export type TempleFoodVenue = TempleFoodVenueSource & {
    canonicalKey: TempleFoodVenueKey;
    roles: readonly TempleFoodVenueRole[];
};

export type TempleFoodOfferingSubtype =
    | "shortExperience"
    | "regularCourseRun"
    | "groupExperience";
export type TempleFoodDetailStatus =
    | "available"
    | "redirected"
    | "unavailable";
export type TempleFoodRedirectTarget = "list" | "home" | "other";

export type TempleFoodVenueRelation = {
    status: "matched";
    venueOfficialId: string;
    sourceVenueName: string;
};

export type TempleFoodSourceProvenance = {
    rawSnapshotFile: string;
    listUrl: string;
    pageOccurrences: number[];
    collectionPasses: string[];
    sourceFields: string[];
};

export type TempleFoodPrice = {
    currency: "KRW";
    chargeBasis: "person" | "course";
    amount: number;
};

type TempleFoodOfferingBase = {
    source: typeof SOURCE;
    subtype: TempleFoodOfferingSubtype;
    canonicalKey: `korean-temple-food:${string}`;
    officialName: string;
    sourceDisplayName: string;
    venueRelation: TempleFoodVenueRelation;
    checkedAt: string;
    lastSeenAt: string;
    sourceProvenance: TempleFoodSourceProvenance;
    detailStatus: TempleFoodDetailStatus;
    officialDetailUrl?: string;
    lastKnownOfficialDetailUrl?: string;
    redirectTarget?: TempleFoodRedirectTarget;
    currentActionUrl?: string;
    validationIssues?: TempleFoodValidationIssue[];
};

export type TempleFoodShortExperienceSession = {
    canonicalKey: `korean-temple-food:short-experience-session:${string}`;
    shortExperienceScheduleSeq: string;
    date: string;
    startTime: string;
    endTime: string;
    menu?: string;
    capacity: number;
};

export type TempleFoodShortExperience = TempleFoodOfferingBase & {
    subtype: "shortExperience";
    canonicalKey: `korean-temple-food:short-experience:${string}`;
    shortExperienceSeq: string;
    price?: TempleFoodPrice & { chargeBasis: "person" };
    applicationPeriodSource: {
        startDate: string;
        startTime: string;
        endDate: string;
        endTime: string;
    };
    sessions: TempleFoodShortExperienceSession[];
    snapshot: {
        checkedAt: string;
        sourceApplicationStatusText: string;
        sessions?: Array<{
            sessionKey: TempleFoodShortExperienceSession["canonicalKey"];
            appliedCount: number;
            pendingCount?: number;
            waitingCount?: number;
        }>;
    };
};

export type TempleFoodRegularCourseRun = TempleFoodOfferingBase & {
    subtype: "regularCourseRun";
    canonicalKey: `korean-temple-food:regular-course-run:${string}`;
    regularCourseScheduleSeq: string;
    regularCourseSeq: string;
    schedule: {
        startDateSource: string;
        endDateSource: string;
        startTime: string;
        endTime: string;
        weekCount: number;
    };
    capacity: number;
    price: TempleFoodPrice & { chargeBasis: "course" };
    applicationPeriodSource: {
        start: string;
        end: string;
    };
    snapshot: {
        checkedAt: string;
        sourceApplicationStatusText: string;
        appliedCount: number;
    };
};

export type TempleFoodGroupExperience = TempleFoodOfferingBase & {
    subtype: "groupExperience";
    canonicalKey: `korean-temple-food:group-experience:${string}`;
    groupExperienceSeq: string;
    detailStatus: "unavailable";
    detailUnavailableReason: "notProvidedBySource";
    officialListUrl: string;
    applicationUrl: string;
    currentActionUrl: string;
    timeSource: {
        officialDurationText: string;
        startTime: string;
        endTime: string;
    };
    derived: {
        durationMinutes: number;
    };
    price: TempleFoodPrice & { chargeBasis: "person" };
    descriptionSource: string;
};

export type TempleFoodOffering =
    | TempleFoodShortExperience
    | TempleFoodRegularCourseRun
    | TempleFoodGroupExperience;

export type TempleFoodCanonicalReport = {
    venueCount: number;
    templeVenueCount: number;
    institutionVenueCount: number;
    matchedTempleRelationCount: number;
    offeringCount: number;
    subtypeCounts: Record<TempleFoodOfferingSubtype, number>;
    matchedOfferingRelationCount: number;
    canonicalKeyDuplicateCount: number;
    sourceIdentityDuplicateCount: number;
    sessionChildDuplicateCount: number;
    provenanceMissingCount: number;
    invalidCurrentActionUrlCount: number;
    fakeDetailUrlCount: number;
    identityRelationHighSeverityCount: number;
};

const venueSources = venueRuntime.records as unknown as TempleFoodVenueSource[];
const offeringRecords =
    offeringRuntime.records as unknown as TempleFoodOffering[];

function venueKeyFor(source: TempleFoodVenueSource): TempleFoodVenueKey {
    return source.officialId
        ? `korean-temple-food:venue:${source.officialId}`
        : `korean-temple-food:venue:temple:${source.templeSlug}`;
}

function rolesFor(source: TempleFoodVenueSource): TempleFoodVenueRole[] {
    const roles: TempleFoodVenueRole[] = [];
    if (source.specialtyTemple) roles.push("specialtyTemple");
    if (source.educationInstitution) roles.push("educationInstitution");
    return roles;
}

export const templeFoodVenues: readonly TempleFoodVenue[] = venueSources.map(
    (source) => ({
        ...source,
        canonicalKey: venueKeyFor(source),
        roles: rolesFor(source),
    }),
);

export const templeFoodOfferings: readonly TempleFoodOffering[] =
    offeringRecords;

function isOfficialOfferingUrl(value: string) {
    try {
        const url = new URL(value);
        return (
            url.protocol === "https:" &&
            url.hostname === "www.koreatemplefood.com"
        );
    } catch {
        return false;
    }
}

function mutableFieldsOutsideSnapshot(
    value: unknown,
    insideSnapshot = false,
): string[] {
    if (!value || typeof value !== "object") return [];
    const mutableFields = new Set([
        "sourceApplicationStatusText",
        "applicationStatusText",
        "applicationStatus",
        "appliedCount",
        "pendingCount",
        "waitingCount",
        "remainingCount",
        "isAvailable",
        "applicationAvailable",
    ]);
    const findings: string[] = [];
    for (const [key, fieldValue] of Object.entries(value)) {
        const nextInsideSnapshot = insideSnapshot || key === "snapshot";
        if (!nextInsideSnapshot && mutableFields.has(key)) findings.push(key);
        findings.push(
            ...mutableFieldsOutsideSnapshot(fieldValue, nextInsideSnapshot),
        );
    }
    return findings;
}

function sourceIdentityFor(offering: TempleFoodOffering) {
    switch (offering.subtype) {
        case "shortExperience":
            return `${offering.subtype}:${offering.shortExperienceSeq}`;
        case "regularCourseRun":
            return `${offering.subtype}:${offering.regularCourseScheduleSeq}`;
        case "groupExperience":
            return `${offering.subtype}:${offering.groupExperienceSeq}`;
    }
}

function assertTempleFoodCanonicalData(): TempleFoodCanonicalReport {
    const venueKeys = new Set<string>();
    const venueOfficialIds = new Set<string>();
    let templeVenueCount = 0;
    let institutionVenueCount = 0;
    let matchedTempleRelationCount = 0;

    if (templeFoodVenues.length !== 18) {
        throw new Error(`Expected 18 TempleFood Venues, got ${templeFoodVenues.length}.`);
    }
    for (const venue of templeFoodVenues) {
        if (
            !venue.source ||
            !venue.officialName ||
            !venue.officialUrl ||
            !venue.checkedAt ||
            !venue.lastSeenAt
        ) {
            throw new Error(`TempleFood Venue ${venue.canonicalKey} is missing provenance.`);
        }
        if (venueKeys.has(venue.canonicalKey)) {
            throw new Error(`Duplicate TempleFood Venue key ${venue.canonicalKey}.`);
        }
        venueKeys.add(venue.canonicalKey);
        if (venue.officialId) {
            if (venueOfficialIds.has(venue.officialId)) {
                throw new Error(`Duplicate TempleFood Venue official ID ${venue.officialId}.`);
            }
            venueOfficialIds.add(venue.officialId);
        }
        if (venue.operatorType === "temple") {
            templeVenueCount += 1;
            if (
                venue.relationStatus !== "matched" ||
                !getTempleBySlug(venue.templeSlug)
            ) {
                throw new Error(`Invalid Temple relation for Venue ${venue.canonicalKey}.`);
            }
            matchedTempleRelationCount += 1;
        } else {
            institutionVenueCount += 1;
            if (
                venue.relationStatus !== "notApplicable" ||
                "templeSlug" in venue
            ) {
                throw new Error(`Institution Venue ${venue.canonicalKey} has a Temple relation.`);
            }
        }
    }
    if (
        templeVenueCount !== 15 ||
        institutionVenueCount !== 3 ||
        matchedTempleRelationCount !== 15
    ) {
        throw new Error("Unexpected TempleFood Venue production counts.");
    }

    const venuesByOfficialId = new Map(
        templeFoodVenues
            .filter((venue): venue is TempleFoodVenue & { officialId: string } =>
                Boolean(venue.officialId),
            )
            .map((venue) => [venue.officialId, venue]),
    );
    const canonicalKeys = new Set<string>();
    const sourceIdentities = new Set<string>();
    const sessionKeys = new Set<string>();
    const subtypeCounts: Record<TempleFoodOfferingSubtype, number> = {
        shortExperience: 0,
        regularCourseRun: 0,
        groupExperience: 0,
    };
    let matchedOfferingRelationCount = 0;
    let provenanceMissingCount = 0;
    let invalidCurrentActionUrlCount = 0;
    let fakeDetailUrlCount = 0;
    let identityRelationHighSeverityCount = 0;

    if (templeFoodOfferings.length !== 1237) {
        throw new Error(`Expected 1237 TempleFood Offerings, got ${templeFoodOfferings.length}.`);
    }
    for (const offering of templeFoodOfferings) {
        subtypeCounts[offering.subtype] += 1;
        if (canonicalKeys.has(offering.canonicalKey)) {
            throw new Error(`Duplicate TempleFood Offering key ${offering.canonicalKey}.`);
        }
        canonicalKeys.add(offering.canonicalKey);
        const sourceIdentity = sourceIdentityFor(offering);
        if (sourceIdentities.has(sourceIdentity)) {
            throw new Error(`Duplicate TempleFood source identity ${sourceIdentity}.`);
        }
        sourceIdentities.add(sourceIdentity);
        if (
            !offering.sourceProvenance?.rawSnapshotFile ||
            !offering.sourceProvenance.listUrl ||
            !offering.sourceProvenance.pageOccurrences?.length ||
            !offering.sourceProvenance.collectionPasses?.length ||
            !offering.sourceProvenance.sourceFields?.length
        ) {
            provenanceMissingCount += 1;
        }
        if (!venuesByOfficialId.has(offering.venueRelation.venueOfficialId)) {
            throw new Error(`Unmatched Venue for Offering ${offering.canonicalKey}.`);
        }
        matchedOfferingRelationCount += 1;
        if (
            offering.currentActionUrl &&
            !isOfficialOfferingUrl(offering.currentActionUrl)
        ) {
            invalidCurrentActionUrlCount += 1;
        }
        if (
            offering.detailStatus === "redirected" &&
            offering.currentActionUrl
        ) {
            throw new Error(`Redirected Offering exposes an action URL: ${offering.canonicalKey}.`);
        }
        if (mutableFieldsOutsideSnapshot(offering).length > 0) {
            throw new Error(`Mutable fields leaked on Offering ${offering.canonicalKey}.`);
        }
        identityRelationHighSeverityCount += (offering.validationIssues ?? []).filter(
            (issue) =>
                issue.severity === "high" &&
                /identity|relation|venue/i.test(`${issue.code} ${issue.detail}`),
        ).length;

        if (offering.subtype === "shortExperience") {
            if (
                offering.canonicalKey !==
                `${SOURCE}:short-experience:${offering.shortExperienceSeq}`
            ) {
                throw new Error(`Invalid ShortExperience key ${offering.canonicalKey}.`);
            }
            for (const session of offering.sessions) {
                if (
                    session.canonicalKey !==
                    `${SOURCE}:short-experience-session:${session.shortExperienceScheduleSeq}`
                ) {
                    throw new Error(`Invalid session key ${session.canonicalKey}.`);
                }
                if (sessionKeys.has(session.canonicalKey)) {
                    throw new Error(`Duplicate session key ${session.canonicalKey}.`);
                }
                sessionKeys.add(session.canonicalKey);
            }
        } else if (offering.subtype === "regularCourseRun") {
            if (
                offering.canonicalKey !==
                `${SOURCE}:regular-course-run:${offering.regularCourseScheduleSeq}` ||
                !offering.regularCourseSeq
            ) {
                throw new Error(`Invalid RegularCourseRun ${offering.canonicalKey}.`);
            }
        } else {
            if (
                offering.canonicalKey !==
                    `${SOURCE}:group-experience:${offering.groupExperienceSeq}` ||
                offering.officialDetailUrl ||
                offering.lastKnownOfficialDetailUrl ||
                /\/detail\//.test(offering.currentActionUrl)
            ) {
                fakeDetailUrlCount += 1;
            }
        }
    }

    if (
        subtypeCounts.shortExperience !== 1113 ||
        subtypeCounts.regularCourseRun !== 120 ||
        subtypeCounts.groupExperience !== 4 ||
        matchedOfferingRelationCount !== 1237 ||
        provenanceMissingCount !== 0 ||
        invalidCurrentActionUrlCount !== 0 ||
        fakeDetailUrlCount !== 0 ||
        identityRelationHighSeverityCount !== 0
    ) {
        throw new Error("TempleFood Offering production assertion failed.");
    }

    return {
        venueCount: templeFoodVenues.length,
        templeVenueCount,
        institutionVenueCount,
        matchedTempleRelationCount,
        offeringCount: templeFoodOfferings.length,
        subtypeCounts,
        matchedOfferingRelationCount,
        canonicalKeyDuplicateCount:
            templeFoodOfferings.length - canonicalKeys.size,
        sourceIdentityDuplicateCount:
            templeFoodOfferings.length - sourceIdentities.size,
        sessionChildDuplicateCount: 0,
        provenanceMissingCount,
        invalidCurrentActionUrlCount,
        fakeDetailUrlCount,
        identityRelationHighSeverityCount,
    };
}

export const templeFoodCanonicalReport = assertTempleFoodCanonicalData();

const venuesByKey = new Map(
    templeFoodVenues.map((venue) => [venue.canonicalKey, venue]),
);
const venuesByOfficialId = new Map(
    templeFoodVenues
        .filter((venue): venue is TempleFoodVenue & { officialId: string } =>
            Boolean(venue.officialId),
        )
        .map((venue) => [venue.officialId, venue]),
);
const offeringsByKey = new Map(
    templeFoodOfferings.map((offering) => [offering.canonicalKey, offering]),
);
const offeringsByVenueKey = new Map<TempleFoodVenueKey, TempleFoodOffering[]>();

for (const offering of templeFoodOfferings) {
    const venue = venuesByOfficialId.get(offering.venueRelation.venueOfficialId);
    if (!venue) continue;
    const records = offeringsByVenueKey.get(venue.canonicalKey) ?? [];
    records.push(offering);
    offeringsByVenueKey.set(venue.canonicalKey, records);
}

export function getTempleFoodVenueByKey(key: TempleFoodVenueKey) {
    return venuesByKey.get(key);
}

export function getTempleFoodVenueByOfficialId(officialId: string) {
    return venuesByOfficialId.get(officialId);
}

export function getTempleForFoodVenue(
    venue: TempleFoodVenue,
): Temple | undefined {
    return venue.operatorType === "temple"
        ? getTempleBySlug(venue.templeSlug)
        : undefined;
}

export function getTempleFoodOfferingByKey(key: TempleFoodOffering["canonicalKey"]) {
    return offeringsByKey.get(key);
}

export function getTempleFoodVenueForOffering(offering: TempleFoodOffering) {
    return venuesByOfficialId.get(offering.venueRelation.venueOfficialId);
}

export function getTempleFoodOfferingsByVenue(
    venue: TempleFoodVenue | TempleFoodVenueKey,
): readonly TempleFoodOffering[] {
    const key = typeof venue === "string" ? venue : venue.canonicalKey;
    return offeringsByVenueKey.get(key) ?? [];
}

export function getTempleFoodOfferingsBySubtype<
    Subtype extends TempleFoodOfferingSubtype,
>(
    subtype: Subtype,
): readonly Extract<TempleFoodOffering, { subtype: Subtype }>[] {
    return templeFoodOfferings.filter(
        (offering): offering is Extract<
            TempleFoodOffering,
            { subtype: Subtype }
        > => offering.subtype === subtype,
    );
}
