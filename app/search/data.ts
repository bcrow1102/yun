import {
    events,
    getEventsByTempleSlug,
    type EventData,
} from "../events/data";
import {
    temples,
    type Temple,
} from "../temples/guide/temples";
import {
    getTempleFoodDisplayInfo,
    getTempleFoodsByTempleSlug,
    templeFoodPrograms,
} from "../temples/food/data";
import {
    getTempleStayDisplayInfo,
    getTempleStaysByTempleSlug,
    templeStayPrograms,
} from "../temples/stay/data";

export type SearchItem = {
    category: string;
    title: string;
    description: string;
    href: string;
    keywords: string;
    external?: boolean;
};

type SearchEntityType =
    | "job"
    | "temple"
    | "templeStay"
    | "event"
    | "templeFood"
    | "story"
    | "resource";

type SearchCandidate = SearchItem & {
    entityType: SearchEntityType;
    searchText: string;
};

const entityTypeAliases: Record<string, SearchEntityType> = {
    사찰: "temple",
    절: "temple",
    암자: "temple",
    템플스테이: "templeStay",
    행사: "event",
    교육: "event",
    사찰음식: "templeFood",
};

const legacySearchItems: Array<
    SearchItem & { entityType: SearchEntityType }
> = [
    {
        category: "구인",
        title: "조계사 사무행정 담당자 모집",
        description: "서울 종로구 · 정규직",
        href: "/jobs/1",
        keywords: "조계사 서울 종로 사무 행정 채용 구인 정규직",
        entityType: "job",
    },
    {
        category: "구인",
        title: "해인사 문화해설 자원봉사자",
        description: "경남 합천 · 봉사",
        href: "/jobs/2",
        keywords: "해인사 경남 합천 문화 해설 봉사 구인",
        entityType: "job",
    },
    {
        category: "구인",
        title: "불국사 템플스테이 코디네이터",
        description: "경북 경주 · 계약직",
        href: "/jobs/3",
        keywords: "불국사 경주 템플스테이 코디네이터 채용 구인",
        entityType: "job",
    },
    {
        category: "행사·교육",
        title: "행사·교육 전체보기",
        description: "문화행사, 체험과 교육 일정을 찾아보세요.",
        href: "/events",
        keywords: "행사 교육 강좌 체험 음악회 일정",
        entityType: "event",
    },
    {
        category: "부처님 이야기",
        title: "화를 내는 사람에게 돌려준 선물",
        description: "분노를 받아들이지 않고 마음을 지키는 이야기",
        href: "/stories/1",
        keywords: "부처님 이야기 분노 화 마음 선물",
        entityType: "story",
    },
    {
        category: "부처님 이야기",
        title: "겨자씨를 구하러 다닌 어머니",
        description: "상실과 삶과 죽음에 관한 이야기",
        href: "/stories/2",
        keywords: "부처님 이야기 겨자씨 어머니 죽음 상실 슬픔",
        entityType: "story",
    },
    {
        category: "부처님 이야기",
        title: "가난한 여인의 등불",
        description: "작은 나눔과 정성에 관한 이야기",
        href: "/stories/3",
        keywords: "부처님 이야기 가난 여인 등불 나눔 정성 자비",
        entityType: "story",
    },
    {
        category: "불교자료",
        title: "불교기록문화유산 아카이브",
        description: "통합대장경과 한국불교전서를 검색하는 동국대학교 공식 자료",
        href: "https://kabc.dongguk.edu/",
        keywords: "경전 대장경 한국불교전서 동국대학교 원문 학술",
        external: true,
        entityType: "resource",
    },
    {
        category: "불교자료",
        title: "한국구비문학대계",
        description: "전국에서 채록한 설화·민요·무가 자료",
        href: "https://kdp.aks.ac.kr/inde/gubi",
        keywords: "민간 전승 설화 구비문학 민요 무가 불교설화",
        external: true,
        entityType: "resource",
    },
    {
        category: "불교자료",
        title: "RISS 학술연구정보서비스",
        description: "불교학 관련 논문과 학위자료 검색",
        href: "https://www.riss.kr/",
        keywords: "논문 학술 연구 학위 불교학 RISS",
        external: true,
        entityType: "resource",
    },
];

function normalizeSearchValue(value: string) {
    return value.toLocaleLowerCase("ko-KR").trim();
}

function stripAdministrativeSuffix(value: string) {
    return value.replace(/(시|군|구)$/, "");
}

function getLocationSearchValues(temple: Temple) {
    const { sido, sigungu, address } = temple.location;

    return [
        sido,
        sigungu,
        stripAdministrativeSuffix(sigungu),
        address,
    ];
}

function getTempleSearchValues(temple: Temple) {
    return [
        temple.name,
        temple.hanja,
        ...(temple.aliases ?? []),
        temple.location.sido,
        temple.location.sigungu,
        temple.location.address,
        temple.area,
        temple.summary,
        temple.description,
        temple.publicTransit?.accessPoint?.name,
        temple.publicTransit?.note,
        ...temple.tags,
        ...temple.keywords,
    ].filter((value): value is string => Boolean(value));
}

function createCandidate(
    item: SearchItem,
    entityType: SearchEntityType,
    searchValues: readonly string[] = [],
): SearchCandidate {
    return {
        ...item,
        entityType,
        searchText: [
            item.category,
            item.title,
            item.description,
            item.keywords,
            ...searchValues,
        ]
            .map(normalizeSearchValue)
            .join(" "),
    };
}

function getRelatedTempleMaps() {
    const stayTemples = new Map<number, Temple>();
    const eventTemples = new Map<EventData, Temple[]>();
    const foodTemples = new Map<number, Temple>();

    for (const temple of temples) {
        if (!temple.published) {
            continue;
        }

        for (const stay of getTempleStaysByTempleSlug(temple.slug)) {
            stayTemples.set(stay.id, temple);
        }

        for (const event of getEventsByTempleSlug(temple.slug)) {
            const relatedTemples = eventTemples.get(event) ?? [];
            relatedTemples.push(temple);
            eventTemples.set(event, relatedTemples);
        }

        for (const food of getTempleFoodsByTempleSlug(temple.slug)) {
            foodTemples.set(food.id, temple);
        }
    }

    return { stayTemples, eventTemples, foodTemples };
}

function getEventSearchValues(event: EventData) {
    const values = [
        event.category,
        event.shortTitle,
        event.place,
        event.listDate,
        event.summary,
    ];

    if (event.ready) {
        values.push(
            event.title,
            event.organizer,
            event.location,
            event.date,
            event.time,
            event.target,
            event.price,
            event.description,
            event.detailHeading,
            ...event.titleLines,
            ...event.detailParagraphs,
            ...event.program.map((item) => item.title),
            ...event.notices,
        );
    }

    return values;
}

function buildSearchCandidates() {
    const publishedTemples = temples.filter((temple) => temple.published);
    const { stayTemples, eventTemples, foodTemples } =
        getRelatedTempleMaps();

    const legacyCandidates = legacySearchItems.map(
        ({ entityType, ...item }) =>
            createCandidate(item, entityType),
    );

    const templeCandidates = publishedTemples.map((temple) =>
        createCandidate(
            {
                category: "사찰 안내",
                title: temple.name,
                description: temple.summary,
                href: `/temples/guide/${temple.slug}`,
                keywords: getTempleSearchValues(temple).join(" "),
            },
            "temple",
            getLocationSearchValues(temple),
        ),
    );

    const stayCandidates = templeStayPrograms.map((stay) => {
        const { templeName, location } =
            getTempleStayDisplayInfo(stay);
        const relatedTemple = stayTemples.get(stay.id);

        return createCandidate(
            {
                category: "템플스테이",
                title: stay.name,
                description: `${templeName} · ${location} · ${stay.duration} ${stay.type}`,
                href: `/temples/stay/${stay.id}`,
                keywords: [
                    stay.name,
                    stay.temple,
                    stay.location,
                    stay.type,
                    stay.duration,
                    stay.price,
                    stay.description,
                ].join(" "),
            },
            "templeStay",
            relatedTemple
                ? [
                    ...getTempleSearchValues(relatedTemple),
                    ...getLocationSearchValues(relatedTemple),
                ]
                : [],
        );
    });

    const eventCandidates = events.map((event) => {
        const relatedTemples = eventTemples.get(event) ?? [];

        return createCandidate(
            {
                category: "행사·교육",
                title: event.shortTitle,
                description: `${event.place} · ${event.listDate}`,
                href: event.ready ? event.detailHref : "/events",
                keywords: getEventSearchValues(event).join(" "),
            },
            "event",
            relatedTemples.flatMap((temple) => [
                ...getTempleSearchValues(temple),
                ...getLocationSearchValues(temple),
            ]),
        );
    });

    const foodCandidates = templeFoodPrograms.map((food) => {
        const { place, location } =
            getTempleFoodDisplayInfo(food);
        const relatedTemple = foodTemples.get(food.id);

        return createCandidate(
            {
                category: "사찰음식",
                title: food.title,
                description: `${place} · ${location} · ${food.type}`,
                href: `/temples/food/${food.id}`,
                keywords: [
                    food.title,
                    food.place,
                    food.location,
                    food.type,
                    food.schedule,
                    food.price,
                    food.description,
                ].join(" "),
            },
            "templeFood",
            relatedTemple
                ? [
                    ...getTempleSearchValues(relatedTemple),
                    ...getLocationSearchValues(relatedTemple),
                ]
                : [],
        );
    });

    return [
        ...legacyCandidates.filter(
            (candidate) => candidate.entityType === "job",
        ),
        ...templeCandidates,
        ...stayCandidates,
        ...foodCandidates,
        ...eventCandidates,
        ...legacyCandidates.filter(
            (candidate) => candidate.entityType !== "job",
        ),
    ];
}

const searchCandidates = buildSearchCandidates();

const searchableAliasPrefixes = new Set(
    searchCandidates.flatMap((candidate) =>
        candidate.searchText.split(/\s+/).filter(Boolean),
    ),
);

const entityAliasEntries = Object.entries(entityTypeAliases).sort(
    ([leftAlias], [rightAlias]) => rightAlias.length - leftAlias.length,
);

function splitKnownEntityAlias(token: string) {
    for (const [alias] of entityAliasEntries) {
        if (!token.endsWith(alias) || token === alias) {
            continue;
        }

        const prefix = token.slice(0, -alias.length);

        if (searchableAliasPrefixes.has(prefix)) {
            return [prefix, alias];
        }
    }

    return [token];
}

export function searchYeon(query: string): SearchItem[] {
    const tokens = normalizeSearchValue(query)
        .split(/\s+/)
        .filter(Boolean)
        .flatMap(splitKnownEntityAlias);

    if (tokens.length === 0) {
        return [];
    }

    const requestedEntityTypes = new Set(
        tokens
            .map((token) => entityTypeAliases[token])
            .filter((entityType): entityType is SearchEntityType =>
                Boolean(entityType),
            ),
    );
    const searchTokens = tokens.filter(
        (token) => !entityTypeAliases[token],
    );

    return searchCandidates
        .filter((candidate) => {
            if (
                requestedEntityTypes.size > 0 &&
                !requestedEntityTypes.has(candidate.entityType)
            ) {
                return false;
            }

            return searchTokens.every((token) =>
                candidate.searchText.includes(token),
            );
        })
        .map((candidate) => ({
            category: candidate.category,
            title: candidate.title,
            description: candidate.description,
            href: candidate.href,
            keywords: candidate.keywords,
            external: candidate.external,
        }));
}
