import {
    getTempleBySlug,
    type TempleSlug,
} from "../temples/guide/temples";

export type EventProgramItem = {
    time: string;
    title: string;
};

type EventListFields = {
    category: string;
    shortTitle: string;
    place: string;
    hostTempleSlug?: TempleSlug;
    venueTempleSlug?: TempleSlug;
    listDate: string;
    summary: string;
    image: string;
};

export type PublishedEvent = EventListFields & {
    id: string;
    ready: true;
    detailHref: string;
    applyHref: string;
    specialDetailHref?: string;
    specialApplyHref?: string;
    title: string;
    titleLines: readonly string[];
    organizer: string;
    location: string;
    date: string;
    time: string;
    target: string;
    price: string;
    description: string;
    detailHeading: string;
    detailParagraphs: readonly string[];
    program: readonly EventProgramItem[];
    notices: readonly string[];
    applicationDateValue: string;
    applicationDateLabel: string;
};

export type PreviewEvent = EventListFields & {
    ready: false;
};

export type EventData = PublishedEvent | PreviewEvent;

export const TEMPLE_CONCERT_EVENT_ID = "1";

const templeConcertTitleLines = [
    "별빛 아래 만나는",
    "산사의 음악",
] as const;

export const events: EventData[] = [
    {
        id: TEMPLE_CONCERT_EVENT_ID,
        ready: true,
        category: "문화행사",
        shortTitle: "산사 음악회",
        title: templeConcertTitleLines.join(" "),
        titleLines: templeConcertTitleLines,
        organizer: "연화사",
        place: "연화사",
        location: "연화사 산사마당",
        listDate: "2026. 08. 22",
        date: "2026년 8월 22일",
        time: "17:30",
        target: "누구나 참여 가능",
        price: "무료",
        image: "/images/hero/temple-concert.webp",
        summary: "고요한 산사에서 음악과 이야기가 함께하는 초저녁 문화행사",
        description:
            "저녁 노을이 내려앉은 산사에서 가야금과 대금, 첼로의 선율을 만나보세요. 음악과 차담이 함께하는 편안한 문화행사입니다.",
        detailHeading: "고요한 산사에서 만나는 특별한 저녁",
        detailParagraphs: [
            "분주한 일상에서 잠시 벗어나 산사의 자연과 음악을 함께 느껴보는 시간입니다. 전통악기와 서양악기의 조화로운 선율이 해 질 무렵의 산사에 잔잔하게 울려 퍼집니다.",
            "공연이 끝난 뒤에는 따뜻한 차와 함께 연주자와 참가자가 자유롭게 이야기를 나누는 차담 시간이 이어집니다.",
        ],
        program: [
            { time: "17:30", title: "입장 및 산사 둘러보기" },
            { time: "18:00", title: "스님의 환영 이야기" },
            { time: "18:20", title: "가야금·대금·첼로가 함께하는 음악회" },
            { time: "19:20", title: "차담과 자유로운 이야기" },
        ],
        notices: [
            "산사는 저녁에 기온이 내려갈 수 있으니 얇은 겉옷을 준비해주세요.",
            "공연 중에는 휴대전화의 소리를 꺼주세요.",
            "사찰 내에서는 음주와 흡연이 불가능합니다.",
        ],
        applicationDateValue: "2026-08-22",
        applicationDateLabel: "2026년 8월 22일 토요일",
        detailHref: "/events/1",
        applyHref: "/events/1/apply",
        specialDetailHref: "/events/temple-concert",
        specialApplyHref: "/events/temple-concert/apply",
    },
    {
        ready: false,
        category: "체험",
        shortTitle: "연꽃등 만들기",
        place: "마음사",
        listDate: "준비 중",
        summary: "온 가족이 함께 만드는 전통 연꽃등 체험",
        image: "",
    },
    {
        ready: false,
        category: "교육",
        shortTitle: "초심자를 위한 불교문화 강좌",
        place: "보현사",
        listDate: "준비 중",
        summary: "생활 속에서 쉽게 만나는 불교문화 이야기",
        image: "",
    },
];

export function getEventById(id: string) {
    return events.find(
        (event): event is PublishedEvent => event.ready && event.id === id,
    );
}

export function getHostTempleForEvent(event: EventData) {
    if (!event.hostTempleSlug) {
        return undefined;
    }

    return getTempleBySlug(event.hostTempleSlug);
}

export function getVenueTempleForEvent(event: EventData) {
    if (!event.venueTempleSlug) {
        return undefined;
    }

    return getTempleBySlug(event.venueTempleSlug);
}

export function getEventsByTempleSlug(slug: TempleSlug) {
    return events.filter(
        (event): event is PublishedEvent =>
            event.ready &&
            (event.hostTempleSlug === slug || event.venueTempleSlug === slug),
    );
}
