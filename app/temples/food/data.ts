import {
    getTempleBySlug,
    type Temple,
    type TempleSlug,
} from "../guide/temples";

export type TempleFoodProgram = {
    id: number;
    title: string;
    place: string;
    operatorTempleSlug?: TempleSlug;
    location: string;
    type: string;
    schedule: string;
    price: string;
    icon: string;
    background: string;
    description: string;
};

export const templeFoodPrograms: TempleFoodProgram[] = [
    {
        id: 1,
        title: "사찰음식 기본 체험",
        place: "서울 사찰음식문화체험관",
        location: "서울 종로구",
        type: "체험",
        schedule: "매주 토요일",
        price: "30,000원",
        icon: "🥣",
        background: "bg-[#F6F1EA]",
        description:
            "자연의 재료를 소중히 다루며 사찰음식의 기본 정신과 조리 방법을 배우는 체험 프로그램입니다.",
    },
    {
        id: 2,
        title: "계절 나물과 사찰 밥상",
        place: "봉녕사",
        location: "경기 수원",
        type: "교육",
        schedule: "월 2회",
        price: "50,000원",
        icon: "🌿",
        background: "bg-[#EEF5E9]",
        description:
            "제철 나물과 자연 재료를 활용해 건강하고 정갈한 사찰 밥상을 만드는 방법을 배웁니다.",
    },
    {
        id: 3,
        title: "발우공양 체험",
        place: "통도사",
        operatorTempleSlug: "tongdosa",
        location: "경남 양산",
        type: "체험",
        schedule: "주말 운영",
        price: "20,000원",
        icon: "🍚",
        background: "bg-[#FFF8D9]",
        description:
            "음식을 소중히 여기고 필요한 만큼만 덜어 먹는 발우공양의 의미와 예절을 체험합니다.",
    },
    {
        id: 4,
        title: "사찰 장 담그기",
        place: "전통사찰문화원",
        location: "전북 완주",
        type: "교육",
        schedule: "계절 프로그램",
        price: "60,000원",
        icon: "🏺",
        background: "bg-[#F3EDE6]",
        description:
            "전통 방식으로 장을 담그며 발효 음식에 담긴 사찰의 지혜와 기다림의 의미를 배웁니다.",
    },
    {
        id: 5,
        title: "연잎밥 만들기",
        place: "연화사",
        location: "충남 공주",
        type: "가족 체험",
        schedule: "매월 둘째 주",
        price: "35,000원",
        icon: "🪷",
        background: "bg-[#F9EFF2]",
        description:
            "가족이 함께 건강한 재료를 준비하고 향긋한 연잎에 밥을 싸서 만드는 체험 프로그램입니다.",
    },
    {
        id: 6,
        title: "외국인을 위한 사찰음식",
        place: "한국사찰음식문화관",
        location: "서울",
        type: "영문 체험",
        schedule: "예약 운영",
        price: "문의",
        icon: "🥢",
        background: "bg-[#EAF3FF]",
        description:
            "외국인 참가자가 영어 안내와 함께 한국 사찰음식의 문화와 조리법을 경험하는 프로그램입니다.",
    },
];

export function getTempleFoodById(id: string) {
    return templeFoodPrograms.find((program) => String(program.id) === id);
}

export function getTempleForFood(program: TempleFoodProgram) {
    if (!program.operatorTempleSlug) {
        return undefined;
    }

    return getTempleBySlug(program.operatorTempleSlug);
}

function getTempleDisplayLocation(temple: Temple) {
    const shortSigungu = temple.location.sigungu.replace(/(시|군|구)$/, "");

    return `${temple.location.sido} ${shortSigungu}`;
}

export function getTempleFoodDisplayInfo(program: TempleFoodProgram) {
    const canonicalTemple = getTempleForFood(program);

    return {
        canonicalTemple,
        place: canonicalTemple?.name ?? program.place,
        location: canonicalTemple
            ? getTempleDisplayLocation(canonicalTemple)
            : program.location,
    };
}

export function getTempleFoodsByTempleSlug(slug: TempleSlug) {
    return templeFoodPrograms.filter(
        (program) => program.operatorTempleSlug === slug,
    );
}
