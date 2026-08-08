import Link from "next/link";

const stories = [
    {
        id: 1,
        episode: "첫 번째 이야기",
        category: "분노와 마음",
        title: "화를 내는 사람에게 돌려준 선물",
        summary:
            "거친 말로 부처님을 모욕하던 사람에게 부처님은 뜻밖의 질문을 건넸습니다.",
        readingTime: "3분",
        image: "/images/stories/story-01-scene-1.webp",
    },
    {
        id: 2,
        episode: "두 번째 이야기",
        category: "삶과 죽음",
        title: "겨자씨를 구하러 다닌 어머니",
        summary:
            "슬픔에 빠진 한 어머니가 집집마다 겨자씨를 구하며 깨닫게 된 이야기입니다.",
        readingTime: "4분",
        image: "/images/stories/story-02-scene-1.webp",

    },
    {
        id: 3,
        episode: "세 번째 이야기",
        category: "정성과 자비",
        title: "가난한 여인의 등불",
        summary:
            "작고 초라한 등불 하나가 밤이 지나도록 꺼지지 않았던 까닭을 만나보세요.",
        readingTime: "3분",
        image: "/images/stories/story-03-scene-1.webp",

    },
];

function ArrowIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
        >
            <path
                d="M5 12h14m-5-5 5 5-5 5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function StoryPlaceholder({
    large = false,
}: {
    large?: boolean;
}) {
    return (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#F3F7F1]">
            <div className="absolute -left-10 -top-12 h-40 w-40 rounded-full bg-[#FFF3A6]/70" />
            <div className="absolute -bottom-14 -right-10 h-44 w-44 rounded-full bg-[#DDEAD8]" />

            <div
                className={`relative flex items-center justify-center rounded-full border border-white/80 bg-white/75 text-[#61705B] ${large ? "h-24 w-24" : "h-20 w-20"
                    }`}
            >
                <svg
                    viewBox="0 0 64 64"
                    fill="none"
                    className={large ? "h-14 w-14" : "h-11 w-11"}
                    aria-hidden="true"
                >
                    <path
                        d="M32 48c-8-8.2-10.4-16.4 0-30 10.4 13.6 8 21.8 0 30Z"
                        stroke="currentColor"
                        strokeWidth="2"
                    />
                    <path
                        d="M30 48c-11-1.4-16.8-7-16-20 10.8 1.4 16.2 8 16 20Z"
                        stroke="currentColor"
                        strokeWidth="2"
                    />
                    <path
                        d="M34 48c11-1.4 16.8-7 16-20-10.8 1.4-16.2 8-16 20Z"
                        stroke="currentColor"
                        strokeWidth="2"
                    />
                    <path
                        d="M14 51h36"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>
            </div>
        </div>
    );
}

export default function StoriesPage() {
    const featuredStory = stories[0];
    const recentStories = stories.slice(1);

    return (
        <div className="min-h-screen bg-white text-[#252A31]">

            <main>
                <section className="border-b border-[#E6EDE3] bg-[#F3F7F1]">
                    <div className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-16">
                        <span className="text-sm font-bold text-[#61705B]">
                            부처님 이야기
                        </span>

                        <h1 className="mt-3 text-[32px] font-bold leading-tight tracking-[-0.045em] md:text-[48px]">
                            마음에 머무는
                            <br className="md:hidden" /> 짧은 이야기
                        </h1>

                        <p className="mt-4 max-w-xl text-[15px] leading-7 text-[#667085] md:text-base">
                            오래전부터 전해지는 부처님의 이야기를 세 장의 삽화와
                            함께 천천히 만나보세요.
                        </p>
                    </div>
                </section>

                <section className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
                    <div className="mb-5 flex items-end justify-between">
                        <div>
                            <span className="text-xs font-bold text-[#7A8B74]">
                                오늘의 이야기
                            </span>

                            <h2 className="mt-1 text-[24px] font-bold tracking-[-0.035em] md:text-[28px]">
                                가장 최근 이야기
                            </h2>
                        </div>

                        <span className="text-sm text-[#8B95A1]">
                            {featuredStory.readingTime} 이야기
                        </span>
                    </div>

                    <Link
                        href={`/stories/${featuredStory.id}`}
                        className="group grid overflow-hidden rounded-[26px] border border-[#DDE7D9] bg-white md:grid-cols-[1.05fr_0.95fr]"
                    >
                        <div className="h-[250px] md:h-[390px]">
                            {featuredStory.image ? (
                                <img
                                    src={featuredStory.image}
                                    alt={featuredStory.title}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <StoryPlaceholder large />
                            )}
                        </div>

                        <div className="flex flex-col justify-center px-5 py-7 md:px-10 md:py-10">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-[#F4F54A] px-3 py-1 text-xs font-bold text-[#4D4300]">
                                    {featuredStory.episode}
                                </span>

                                <span className="text-xs font-semibold text-[#7A8B74]">
                                    {featuredStory.category}
                                </span>
                            </div>

                            <h3 className="mt-5 text-[25px] font-bold leading-snug tracking-[-0.035em] md:text-[34px]">
                                {featuredStory.title}
                            </h3>

                            <p className="mt-4 text-[15px] leading-7 text-[#667085]">
                                {featuredStory.summary}
                            </p>

                            <span className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#52634D]">
                                이야기 읽기
                                <ArrowIcon />
                            </span>
                        </div>
                    </Link>
                </section>

                <section className="border-t border-[#F0F2F4] bg-[#FAFBFA]">
                    <div className="mx-auto max-w-6xl px-4 py-9 md:px-8 md:py-12">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-[22px] font-bold tracking-[-0.035em] md:text-[26px]">
                                지난 이야기
                            </h2>

                            <span className="text-sm text-[#8B95A1]">
                                천천히 한 편씩 이어집니다
                            </span>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            {recentStories.map((story) => (
                                <Link
                                    key={story.id}
                                    href={`/stories/${story.id}`}
                                    className="group overflow-hidden rounded-[22px] border border-[#E3E8E1] bg-white"
                                >
                                    <div className="h-[190px]">
                                        {story.image ? (
                                            <img
                                                src={story.image}
                                                alt={story.title}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <StoryPlaceholder />
                                        )}
                                    </div>

                                    <div className="p-5">
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="text-xs font-bold text-[#7A8B74]">
                                                {story.episode}
                                            </span>

                                            <span className="text-xs text-[#8B95A1]">
                                                {story.readingTime}
                                            </span>
                                        </div>

                                        <h3 className="mt-3 text-[19px] font-bold tracking-[-0.025em]">
                                            {story.title}
                                        </h3>

                                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#667085]">
                                            {story.summary}
                                        </p>

                                        <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#52634D]">
                                            읽어보기
                                            <span aria-hidden="true">→</span>
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
