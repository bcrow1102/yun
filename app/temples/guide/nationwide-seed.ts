import nationwideSeed from "../../../data/temples/generated/nationwide-temples.runtime.json";

export const TEMPLE_SEED_SOURCES = nationwideSeed.sources;

export type TempleSeedMatchStatus =
    | "matched_with_coordinates"
    | "matched_without_coordinates"
    | "official_unmatched";

export type McstTempleSource = {
    recordNo: number;
    asOf: string;
    address: string;
    denomination: string;
    locationCorrection?: string;
};

export type LocalDataTempleSource = {
    sourceId: `localdata:${string}:${string}`;
    localGovCode: string;
    managementNo: string;
    lotAddress?: string;
    roadAddress?: string;
    x?: number | null;
    y?: number | null;
    coordinateSystem: "EPSG:5174";
    updatedAt: string;
    matchMethod:
        | "automatic"
        | "manual-override"
        | "manual-unmatched";
};

export type OfficialTempleSource = {
    officialUrl: string;
    checkedAt: string;
    officialName?: string;
    officialId?: string;
    verificationUrls?: string[];
};

export type TempleStayOfficialSource = OfficialTempleSource & {
    officialId: string;
};

export type TempleFoodOfficialSource = OfficialTempleSource;

type TempleExternalSourceMetadata = {
    localData?: LocalDataTempleSource;
};

export type TempleExternalSources = TempleExternalSourceMetadata & (
    | {
        mcstTraditionalTemple: McstTempleSource;
        templeStayOfficial?: TempleStayOfficialSource;
        templeFoodOfficial?: TempleFoodOfficialSource;
    }
    | {
        mcstTraditionalTemple?: McstTempleSource;
        templeStayOfficial: TempleStayOfficialSource;
        templeFoodOfficial?: TempleFoodOfficialSource;
    }
    | {
        mcstTraditionalTemple?: McstTempleSource;
        templeStayOfficial?: TempleStayOfficialSource;
        templeFoodOfficial: TempleFoodOfficialSource;
    }
);

export function assertTempleExternalSources(
    sources: TempleExternalSources | undefined,
    templeLabel: string,
): asserts sources is TempleExternalSources {
    if (
        !sources?.mcstTraditionalTemple &&
        !sources?.templeStayOfficial &&
        !sources?.templeFoodOfficial
    ) {
        throw new Error(
            `Temple ${templeLabel} must have at least one canonical provenance source.`,
        );
    }
}

export type TempleNationwideSeed = {
    slug: string;
    existingSlug?: string;
    name: string;
    aliases?: string[];
    sido: string;
    sigungu: string;
    address: string;
    denomination: string;
    latitude: number | null;
    longitude: number | null;
    matchStatus: TempleSeedMatchStatus;
    mcst: McstTempleSource;
    localData?: LocalDataTempleSource;
};

export type TempleNationwideReport = {
    officialTargetCount: number;
    canonicalCount: number;
    existingCanonicalMergeCount: number;
    newCanonicalCount: number;
    matchedWithCoordinatesCount: number;
    matchedWithoutCoordinatesCount: number;
    officialUnmatchedCount: number;
    coordinatesPresentCount: number;
    coordinatesMissingCount: number;
    localDataLinkedCount: number;
    aliasCount: number;
    duplicateCount: number;
    validationFailureCount: number;
    statusTotal: number;
};

export const templeNationwideSeeds =
    nationwideSeed.records as TempleNationwideSeed[];
export const templeNationwideReport =
    nationwideSeed.report as TempleNationwideReport;

if (
    templeNationwideReport.officialTargetCount !== 991 ||
    templeNationwideReport.canonicalCount !== 991 ||
    templeNationwideReport.statusTotal !== 991 ||
    templeNationwideReport.validationFailureCount !== 0 ||
    templeNationwideReport.duplicateCount !== 0
) {
    throw new Error(
        `전국 Temple seed 검증 실패: ${JSON.stringify(templeNationwideReport)}`,
    );
}
