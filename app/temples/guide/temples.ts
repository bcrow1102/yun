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

export type TempleTransport = {
    /**
     * 가장 가까운 지하철역·기차역·버스터미널
     */
    nearestStation?: string;

    /**
     * 이용 가능한 버스와 하차 정류장
     */
    bus?: string[];

    /**
     * 역 또는 정류장에서 사찰까지의 도보 안내
     */
    walking?: string;

    /**
     * 사찰 셔틀버스 운행 정보
     */
    shuttle?: string;

    /**
     * 환승·막차·행사일 교통 등 참고사항
     */
    notes?: string;

    /**
     * 교통정보 최종 확인일
     * 예: 2026.08
     */
    updatedAt?: string;
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
     * 지역 정보
     */
    sido: Sido;
    area: TempleArea;
    sigungu: string;
    address: string;

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
     * 교통과 주차
     */
    transport?: TempleTransport;
    parking?: TempleParking;

    /**
     * 지도 연결용 좌표
     */
    latitude?: number;
    longitude?: number;

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
        sido: "서울",
        area: "수도권",
        sigungu: "종로구",
        address: "서울 종로구",
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
        sido: "경남",
        area: "영남",
        sigungu: "합천군",
        address: "경남 합천군",
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
        sido: "경북",
        area: "영남",
        sigungu: "경주시",
        address: "경북 경주시",
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
        sido: "경남",
        area: "영남",
        sigungu: "양산시",
        address: "경남 양산시",
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
        sido: "강원",
        area: "강원",
        sigungu: "평창군",
        address: "강원 평창군",
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
        sido: "서울",
        area: "수도권",
        sigungu: "강남구",
        address: "서울 강남구",
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
            temple.sido,
            temple.area,
            temple.sigungu,
            temple.address,
            temple.summary,
            temple.description,
            temple.order,
            temple.founded,
            temple.founder,
            temple.openingHours,
            temple.admissionFee,
            temple.transport?.nearestStation,
            temple.transport?.walking,
            temple.transport?.shuttle,
            temple.transport?.notes,
            ...(temple.transport?.bus ?? []),
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
