import {
    templeNationwideReport,
    templeNationwideSeeds,
    type LocalDataTempleSource,
    type McstTempleSource,
    type TempleNationwideSeed,
    type TempleSeedMatchStatus,
} from "./nationwide-seed";

export const SIDO_LIST = [
    "전체",
    "서울",
    "부산",
    "대구",
    "인천",
    "광주",
    "대전",
    "울산",
    "세종",
    "경기",
    "강원",
    "충북",
    "충남",
    "전북",
    "전남",
    "경북",
    "경남",
    "제주",
] as const;

export type Sido = Exclude<(typeof SIDO_LIST)[number], "전체">;

export type TempleArea =
    | "수도권"
    | "강원"
    | "충청"
    | "호남"
    | "영남"
    | "제주";

export type TempleLocationV1 = {
    /**
     * 읍·면·동을 별도 필드로 나누지 않고 상세 주소에 포함한다.
     */
    address: string;
    sido: Sido;
    sigungu: string;
    latitude?: number | null;
    longitude?: number | null;
};

export type TemplePublicTransitV1 = {
    /**
     * 물리적으로 가장 가까운 곳이 아니라 일반 방문자가 대표적으로
     * 이용하는 주요 대중교통 접근 지점이다.
     */
    accessPoint?: {
        type: "subway" | "train" | "bus" | "terminal";
        name?: string;
    };

    /**
     * 대표 접근 지점에서 사찰까지의 마지막 이동 구간이다.
     * 복수 경로와 다단계 이동은 현재 note로 설명한다.
     */
    lastMile?: {
        mode: "walk" | "localBus" | "shuttle" | "taxi" | "none";
        minutes?: number;
    };

    /**
     * 대안 접근 경로와 환승 등 구조화하지 않은 참고사항
     */
    note?: string;

    /**
     * 교통 사실 최종 확인일
     * 형식: YYYY-MM-DD
     */
    updatedAt?: string;
};

export type TempleWalkingAccessV1 = {
    stairs?: "none" | "some" | "many" | "unknown";
    slope?: "flat" | "gentle" | "steep" | "unknown";

    /**
     * 일반 방문자가 주로 사용하는 대표 진입 지점에서
     * 주요 관람·참배 영역까지의 편도 도보시간이다.
     * 여러 입구가 있으면 대표적인 일반 방문 동선을 기준으로 하고,
     * 여러 전각이 넓게 흩어진 예외는 note로 설명한다.
     */
    walkingMinutes?: number;

    note?: string;
};

export type TempleParking = {
    /**
     * true: 주차 가능
     * false: 주차 불가
     * undefined: 확인 중
     */
    available?: boolean;

    /**
     * 사찰 전용·공영·노상·임시 주차장 등
     */
    type?: string;

    /**
     * 무료·유료 및 요금 안내
     */
    fee?: string;

    /**
     * 대형차·행사일·혼잡 시간 등 참고사항
     */
    notes?: string;

    /**
     * 주차정보 최종 확인일
     * 예: 2026.08
     */
    updatedAt?: string;
};

export type Temple = {
    /**
     * 상세 페이지 주소에 사용하는 고유 값
     * 예: /temples/guide/jogyesa
     */
    slug: string;

    /**
     * 사찰 기본 정보
     */
    name: string;
    hanja?: string;
    aliases?: string[];

    /**
     * 객관적인 위치 정보. area는 넓은 권역 탐색용이며 거리 판단에는
     * location.latitude/longitude를 사용한다.
     */
    location: TempleLocationV1;
    area: TempleArea;

    /**
     * 카드와 상세 페이지 소개
     */
    summary: string;
    description?: string;

    /**
     * 역사·종단 정보
     */
    order?: string;
    founded?: string;
    founder?: string;

    /**
     * 분류와 검색 정보
     */
    tags: string[];
    keywords: string[];

    /**
     * 기본 방문 정보
     */
    phone?: string;
    website?: string;
    openingHours?: string;
    admissionFee?: string;

    /**
     * 사찰까지의 접근, 사찰 안에서의 이동, 주차
     */
    publicTransit?: TemplePublicTransitV1;
    walkingAccess?: TempleWalkingAccessV1;
    parking?: TempleParking;

    /**
     * 이미지 정보
     */
    image?: string;
    imageAlt?: string;
    imageSource?: string;

    /**
     * 운영 상태
     */
    representative: boolean;
    published: boolean;
    updatedAt?: string;

    /**
     * 전국 전통사찰 seed의 공식 source 연결 정보. 원본 좌표는 사용자
     * 기능에서 사용하지 않고 location의 WGS84 좌표만 사용한다.
     */
    externalSources?: {
        mcstTraditionalTemple: McstTempleSource;
        localData?: LocalDataTempleSource;
    };
    seedMatchStatus?: TempleSeedMatchStatus;
};

export type TempleSlug = Temple["slug"];

const curatedTemples: Temple[] = [
    {
        slug: "jogyesa",
        name: "조계사",
        hanja: "曹溪寺",
        location: {
            sido: "서울",
            sigungu: "종로구",
            address: "서울특별시 종로구 우정국로 55",
            latitude: 37.5738701204,
            longitude: 126.9818371759,
        },
        area: "수도권",
        publicTransit: {
            accessPoint: {
                type: "subway",
                name: "종각역 2번 출구",
            },
            lastMile: {
                mode: "walk",
            },
            note: "종각역 2번 출구에서 약 400m. 안국역 6번 출구에서도 접근 가능.",
            updatedAt: "2026-08-14",
        },
        summary: "서울 도심에서 만나는 한국 불교의 대표적인 사찰",
        description:
            "서울 도심에서 한국불교 문화와 다양한 법회 및 행사를 접할 수 있는 사찰입니다.",
        order: "대한불교조계종",
        tags: ["도심 사찰", "대중교통"],
        keywords: [
            "조계사",
            "서울",
            "서울특별시",
            "종로",
            "종로구",
            "도심 사찰",
            "대중교통",
            "수도권",
            "대한불교조계종",
            "조계종",
        ],
        representative: true,
        published: true,
    },
    {
        slug: "haeinsa",
        name: "해인사",
        hanja: "海印寺",
        location: {
            sido: "경남",
            sigungu: "합천군",
            address: "경상남도 합천군 가야면 해인사길 122",
            latitude: 35.8005687584,
            longitude: 128.0971196597,
        },
        area: "영남",
        publicTransit: {
            accessPoint: {
                type: "bus",
                name: "해인사 성보박물관 정류장",
            },
            lastMile: {
                mode: "walk",
                minutes: 20,
            },
            note: "해인사버스터미널에서 택시로 이동하는 대안 경로도 있음.",
            updatedAt: "2026-08-14",
        },
        summary: "가야산의 자연과 팔만대장경을 품고 있는 사찰",
        description:
            "가야산의 자연 속에서 한국불교의 오랜 역사와 문화유산을 함께 만날 수 있는 사찰입니다.",
        order: "대한불교조계종",
        tags: ["문화유산", "산사"],
        keywords: [
            "해인사",
            "경남",
            "경상남도",
            "합천",
            "합천군",
            "가야산",
            "팔만대장경",
            "대장경",
            "문화유산",
            "산사",
            "영남",
            "경상",
            "경상도",
            "대한불교조계종",
            "조계종",
        ],
        representative: true,
        published: true,
    },
    {
        slug: "bulguksa",
        name: "불국사",
        hanja: "佛國寺",
        location: {
            sido: "경북",
            sigungu: "경주시",
            address: "경상북도 경주시 불국로 385",
            latitude: 35.7892734269,
            longitude: 129.3318475148,
        },
        area: "영남",
        publicTransit: {
            accessPoint: {
                type: "bus",
                name: "불국사 정류장",
            },
            lastMile: {
                mode: "walk",
                minutes: 5,
            },
            note: "경주시 공식 관광안내 기준 불국사 정류장에서 도보 약 3~5분.",
            updatedAt: "2026-08-14",
        },
        summary: "신라의 역사와 불교문화를 함께 만날 수 있는 사찰",
        description:
            "신라 불교문화의 역사와 전통을 살펴볼 수 있는 경주의 대표적인 사찰입니다.",
        order: "대한불교조계종",
        tags: ["문화유산", "역사"],
        keywords: [
            "불국사",
            "경북",
            "경상북도",
            "경주",
            "경주시",
            "신라",
            "불교문화",
            "문화유산",
            "역사",
            "영남",
            "경상",
            "경상도",
            "대한불교조계종",
            "조계종",
        ],
        representative: true,
        published: true,
    },
    {
        slug: "tongdosa",
        name: "통도사",
        hanja: "通度寺",
        location: {
            sido: "경남",
            sigungu: "양산시",
            address: "경상남도 양산시 하북면 통도사로 108",
            latitude: 35.4886883698,
            longitude: 129.0646293478,
        },
        area: "영남",
        publicTransit: {
            accessPoint: {
                type: "terminal",
                name: "신평터미널",
            },
            lastMile: {
                mode: "walk",
                minutes: 30,
            },
            note: "신평터미널에서 택시 이용 가능. KTX 울산(통도사)역에서는 13번 버스로 신평터미널 접근 가능.",
            updatedAt: "2026-08-14",
        },
        summary: "고요한 숲길과 깊은 수행의 전통이 이어지는 사찰",
        description:
            "고요한 숲길과 한국불교의 수행 전통을 함께 느낄 수 있는 양산의 대표적인 사찰입니다.",
        order: "대한불교조계종",
        tags: ["산사", "숲길"],
        keywords: [
            "통도사",
            "경남",
            "경상남도",
            "양산",
            "양산시",
            "산사",
            "숲길",
            "수행",
            "영남",
            "경상",
            "경상도",
            "대한불교조계종",
            "조계종",
        ],
        representative: true,
        published: true,
    },
    {
        slug: "woljeongsa",
        name: "월정사",
        hanja: "月精寺",
        location: {
            sido: "강원",
            sigungu: "평창군",
            address: "강원특별자치도 평창군 진부면 오대산로 374-8",
            latitude: 37.731891,
            longitude: 128.592569,
        },
        area: "강원",
        publicTransit: {
            accessPoint: {
                type: "bus",
                name: "월정사 정류장",
            },
            lastMile: {
                mode: "walk",
                minutes: 5,
            },
            note: "월정사 정류장에서 사찰까지 약 150m.",
            updatedAt: "2026-08-14",
        },
        summary: "전나무 숲길과 함께 걷기 좋은 오대산 사찰",
        description:
            "오대산의 자연과 전나무 숲길을 걸으며 잠시 쉬어가기 좋은 사찰입니다.",
        order: "대한불교조계종",
        tags: ["숲길", "휴식"],
        keywords: [
            "월정사",
            "강원",
            "강원도",
            "강원특별자치도",
            "평창",
            "평창군",
            "오대산",
            "전나무 숲길",
            "전나무길",
            "숲길",
            "휴식",
            "대한불교조계종",
            "조계종",
        ],
        representative: true,
        published: true,
    },
    {
        slug: "bongeunsa",
        name: "봉은사",
        hanja: "奉恩寺",
        location: {
            sido: "서울",
            sigungu: "강남구",
            address: "서울특별시 강남구 봉은사로 531",
            latitude: 37.5141034337,
            longitude: 127.0581013679,
        },
        area: "수도권",
        publicTransit: {
            accessPoint: {
                type: "subway",
                name: "봉은사역 1번 출구",
            },
            lastMile: {
                mode: "walk",
            },
            note: "봉은사역 1번 출구에서 약 100m.",
            updatedAt: "2026-08-14",
        },
        summary: "도심 속에서 잠시 쉬어갈 수 있는 편안한 사찰",
        description:
            "서울 강남 도심에서 불교문화와 휴식을 함께 접할 수 있는 사찰입니다.",
        order: "대한불교조계종",
        tags: ["도심 사찰", "외국인 방문"],
        keywords: [
            "봉은사",
            "서울",
            "서울특별시",
            "강남",
            "강남구",
            "도심 사찰",
            "외국인 방문",
            "외국인",
            "수도권",
            "대한불교조계종",
            "조계종",
        ],
        representative: true,
        published: true,
    },
];

function getTempleArea(sido: Sido): TempleArea {
    if (["서울", "인천", "경기"].includes(sido)) {
        return "수도권";
    }

    if (sido === "강원") {
        return "강원";
    }

    if (["대전", "세종", "충북", "충남"].includes(sido)) {
        return "충청";
    }

    if (["광주", "전북", "전남"].includes(sido)) {
        return "호남";
    }

    if (sido === "제주") {
        return "제주";
    }

    return "영남";
}

function getSeedSido(seed: TempleNationwideSeed): Sido {
    if (
        !SIDO_LIST.some(
            (sido): sido is Sido =>
                sido !== "전체" && sido === seed.sido,
        )
    ) {
        throw new Error(`지원하지 않는 시도 값입니다: ${seed.sido}`);
    }

    return seed.sido as Sido;
}

function getSeedSource(seed: TempleNationwideSeed) {
    return {
        mcstTraditionalTemple: seed.mcst,
        localData: seed.localData,
    };
}

function createTempleFromSeed(seed: TempleNationwideSeed): Temple {
    const sido = getSeedSido(seed);

    return {
        slug: seed.slug,
        name: seed.name,
        aliases: seed.aliases,
        location: {
            sido,
            sigungu: seed.sigungu,
            address: seed.address,
            latitude: seed.latitude,
            longitude: seed.longitude,
        },
        area: getTempleArea(sido),
        summary: seed.address,
        order: seed.denomination,
        tags: ["전통사찰"],
        keywords: [
            seed.name,
            ...(seed.aliases ?? []),
            seed.sido,
            seed.sigungu,
            seed.sigungu.replace(/(시|군|구)$/, ""),
            seed.address,
            seed.denomination,
            "전통사찰",
        ],
        representative: false,
        published: true,
        externalSources: getSeedSource(seed),
        seedMatchStatus: seed.matchStatus,
    };
}

function mergeTempleNationwideSeeds() {
    if (templeNationwideReport.validationFailureCount > 0) {
        throw new Error(
            "Temple nationwide seed 검증 실패",
        );
    }

    const curatedBySlug = new Map(
        curatedTemples.map((temple) => [temple.slug, temple]),
    );
    const seenSeedSlugs = new Set<string>();

    for (const seed of templeNationwideSeeds) {
        if (seenSeedSlugs.has(seed.slug)) {
            throw new Error(`중복 nationwide Temple slug: ${seed.slug}`);
        }

        seenSeedSlugs.add(seed.slug);

        if (seed.existingSlug && !curatedBySlug.has(seed.existingSlug)) {
            throw new Error(
                `기존 Temple을 찾을 수 없습니다: ${seed.existingSlug}`,
            );
        }

        if (
            !seed.existingSlug &&
            curatedTemples.some(
                (temple) =>
                    temple.name === seed.name &&
                    temple.location.sido === seed.sido &&
                    temple.location.sigungu === seed.sigungu,
            )
        ) {
            throw new Error(
                `기존 Temple과 중복되는 신규 seed: ${seed.slug}`,
            );
        }
    }

    const seedByExistingSlug = new Map(
        templeNationwideSeeds
            .filter((seed) => seed.existingSlug)
            .map((seed) => [seed.existingSlug as string, seed]),
    );

    const preservedTemples = curatedTemples.map((temple) => {
        const seed = seedByExistingSlug.get(temple.slug);

        if (!seed) {
            return temple;
        }

        return {
            ...temple,
            aliases: [
                ...new Set([
                    ...(temple.aliases ?? []),
                    ...(seed.aliases ?? []),
                ]),
            ],
            location: {
                ...temple.location,
                sido: getSeedSido(seed),
                sigungu: seed.sigungu,
                address: seed.address,
                latitude:
                    seed.latitude ?? temple.location.latitude ?? null,
                longitude:
                    seed.longitude ?? temple.location.longitude ?? null,
            },
            keywords: [
                ...new Set([
                    ...temple.keywords,
                    ...(seed.aliases ?? []),
                    seed.address,
                    seed.denomination,
                ]),
            ],
            externalSources: getSeedSource(seed),
            seedMatchStatus: seed.matchStatus,
        } satisfies Temple;
    });

    const newTemples = templeNationwideSeeds
        .filter((seed) => !seed.existingSlug)
        .map(createTempleFromSeed);

    return [...preservedTemples, ...newTemples];
}

/**
 * 지역 탐색, 전역 검색과 모든 relation이 함께 참조하는 단일 canonical.
 */
export const temples: Temple[] = mergeTempleNationwideSeeds();

/**
 * 검색어 비교를 위해 영문 대소문자와 공백 차이를 제거한다.
 */
export function normalizeTempleSearchText(value: string) {
    return value.toLocaleLowerCase("ko-KR").replace(/\s+/g, "");
}

/**
 * 하나의 사찰에서 검색할 수 있는 값을 하나의 문자열로 합친다.
 */
export function getTempleSearchText(temple: Temple) {
    return normalizeTempleSearchText(
        [
            temple.name,
            temple.hanja,
            ...(temple.aliases ?? []),
            temple.location.sido,
            temple.area,
            temple.location.sigungu,
            temple.location.address,
            temple.summary,
            temple.description,
            temple.order,
            temple.founded,
            temple.founder,
            temple.openingHours,
            temple.admissionFee,
            temple.publicTransit?.accessPoint?.name,
            temple.publicTransit?.note,
            temple.parking?.available === true
                ? "주차 가능"
                : temple.parking?.available === false
                    ? "주차 불가"
                    : undefined,
            temple.parking?.type,
            temple.parking?.fee,
            temple.parking?.notes,
            ...temple.tags,
            ...temple.keywords,
        ]
            .filter((value): value is string => Boolean(value))
            .join(" "),
    );
}

/**
 * slug를 이용해 공개 상태의 사찰을 찾는다.
 */
export function getTempleBySlug(slug: TempleSlug) {
    return temples.find(
        (temple) => temple.slug === slug && temple.published,
    );
}
