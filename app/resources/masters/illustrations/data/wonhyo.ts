export type MasterIllustration = {
    slug: string;
    masterSlug: string;
    title: string;
    summary: string;
    classification: string;
    source: string;
    image?: {
        src: string;
        alt: string;
        caption: string;
    };
};

export const wonhyoIllustrations: MasterIllustration[] = [
    {
        slug: "skull-water",
        masterSlug: "wonhyo",
        title: "무덤에서 얻은 깨달음",
        summary:
            "당나라로 향하던 원효가 같은 장소도 마음에 따라 전혀 다르게 경험된다는 사실을 깨달았다고 전하는 이야기입니다.",
        classification: "후대 문헌의 전승",
        source: "『송고승전』 계통 기록",
    },
];
