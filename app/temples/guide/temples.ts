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
    latitude?: number;
    longitude?: number;
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
};

export type TempleSlug = Temple["slug"];

export const temples: Temple[] = [
    {
        slug: "jogyesa",
        name: "조계사",
        hanja: "曹溪寺",
        location: {
            sido: "서울",
            sigungu: "종로구",
            address: "서울 종로구",
        },
        area: "수도권",
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
            address: "경남 합천군",
        },
        area: "영남",
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
            address: "경북 경주시",
        },
        area: "영남",
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
            address: "경남 양산시",
        },
        area: "영남",
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
            address: "강원 평창군",
        },
        area: "강원",
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
            address: "서울 강남구",
        },
        area: "수도권",
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
