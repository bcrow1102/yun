import {
    getTempleBySlug,
    type Temple,
    type TempleSlug,
} from "../guide/temples";

export type TempleStayProgram = {
    id: number;
    name: string;
    temple: string;
    operatorTempleSlug?: TempleSlug;
    location: string;
    type: string;
    duration: string;
    price: string;
    rating: string;
    icon: string;
    background: string;
    description: string;
};

export const templeStayPrograms: TempleStayProgram[] = [
    {
        id: 1,
        name: "월정사 숲속 힐링",
        temple: "월정사",
        operatorTempleSlug: "woljeongsa",
        location: "강원 평창",
        type: "휴식형",
        duration: "1박 2일",
        price: "50,000원",
        rating: "4.8",
        icon: "🌲",
        background: "bg-[#EEF5E9]",
        description:
            "고요한 숲과 맑은 공기 속에서 바쁜 일상을 잠시 내려놓고 편안하게 쉬어가는 템플스테이입니다.",
    },
    {
        id: 2,
        name: "해인사 명상 수련",
        temple: "해인사",
        operatorTempleSlug: "haeinsa",
        location: "경남 합천",
        type: "체험형",
        duration: "2박 3일",
        price: "80,000원",
        rating: "4.9",
        icon: "🧘",
        background: "bg-[#FFF8D9]",
        description:
            "명상과 사찰 생활을 체험하며 몸과 마음을 차분하게 돌아보는 프로그램입니다.",
    },
    {
        id: 3,
        name: "통도사 하루 체험",
        temple: "통도사",
        operatorTempleSlug: "tongdosa",
        location: "경남 양산",
        type: "당일형",
        duration: "당일",
        price: "30,000원",
        rating: "4.7",
        icon: "🕯️",
        background: "bg-[#F7F0E8]",
        description:
            "짧은 하루 동안 사찰의 고요한 일상과 불교문화를 편안하게 경험할 수 있습니다.",
    },
    {
        id: 4,
        name: "전등사 마음 쉬기",
        temple: "전등사",
        location: "인천 강화",
        type: "휴식형",
        duration: "1박 2일",
        price: "60,000원",
        rating: "4.8",
        icon: "🍃",
        background: "bg-[#EAF3F5]",
        description:
            "자연 속 산사에서 천천히 걷고 쉬며 마음의 여유를 되찾는 시간입니다.",
    },
    {
        id: 5,
        name: "봉선사 연꽃 명상",
        temple: "봉선사",
        location: "경기 남양주",
        type: "체험형",
        duration: "1박 2일",
        price: "55,000원",
        rating: "4.6",
        icon: "🪷",
        background: "bg-[#F9EFF2]",
        description:
            "연꽃처럼 맑고 편안한 마음을 만나기 위한 명상과 사찰문화 체험 프로그램입니다.",
    },
    {
        id: 6,
        name: "낙산사 바다 명상",
        temple: "낙산사",
        location: "강원 양양",
        type: "휴식형",
        duration: "1박 2일",
        price: "70,000원",
        rating: "4.9",
        icon: "🌊",
        background: "bg-[#EAF3FF]",
        description:
            "바다를 바라보며 명상하고 산사의 고요함 속에서 편안하게 쉬어가는 프로그램입니다.",
    },
];

export function getTempleStayById(id: string) {
    return templeStayPrograms.find((program) => String(program.id) === id);
}

export function getTempleForStay(stay: TempleStayProgram) {
    if (!stay.operatorTempleSlug) {
        return undefined;
    }

    return getTempleBySlug(stay.operatorTempleSlug);
}

function getTempleDisplayLocation(temple: Temple) {
    const shortSigungu = temple.sigungu.replace(/(시|군|구)$/, "");

    return `${temple.sido} ${shortSigungu}`;
}

export function getTempleStayDisplayInfo(stay: TempleStayProgram) {
    const canonicalTemple = getTempleForStay(stay);

    return {
        canonicalTemple,
        templeName: canonicalTemple?.name ?? stay.temple,
        location: canonicalTemple
            ? getTempleDisplayLocation(canonicalTemple)
            : stay.location,
    };
}

export function getTempleStaysByTempleSlug(slug: TempleSlug) {
    return templeStayPrograms.filter(
        (program) => program.operatorTempleSlug === slug,
    );
}
