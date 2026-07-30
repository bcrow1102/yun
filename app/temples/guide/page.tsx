import Link from "next/link";

const temples = [
    {
        id: 1,
        name: "조계사",
        location: "서울 종로구",
        description: "서울 도심에서 만나는 한국 불교의 대표적인 사찰",
        tags: ["도심 사찰", "대중교통"],
        icon: "🏯",
    },
    {
        id: 2,
        name: "해인사",
        location: "경남 합천",
        description: "가야산의 자연과 팔만대장경을 품고 있는 사찰",
        tags: ["문화유산", "산사"],
        icon: "🌳",
    },
    {
        id: 3,
        name: "불국사",
        location: "경북 경주",
        description: "신라의 역사와 불교문화를 함께 만날 수 있는 사찰",
        tags: ["문화유산", "관광"],
        icon: "🏛️",
    },
    {
        id: 4,
        name: "통도사",
        location: "경남 양산",
        description: "고요한 숲길과 깊은 수행의 전통이 이어지는 사찰",
        tags: ["산사", "산책"],
        icon: "🌲",
    },
    {
        id: 5,
        name: "월정사",
        location: "강원 평창",
        description: "전나무 숲길과 함께 걷기 좋은 오대산 사찰",
        tags: ["숲길", "휴식"],
        icon: "🍃",
    },
    {
        id: 6,
        name: "봉은사",
        location: "서울 강남구",
        description: "도심 속에서 잠시 쉬어갈 수 있는 편안한 사찰",
        tags: ["도심 사찰", "외국인 방문"],
        icon: "🪷",
    },
];

function LotusIcon() {
    return (
        <svg viewBox="0 0 32 32" fill="none" className="h-6 w-6">
            <path
                d="M16 24c-4-4.1-5.2-8.2 0-15 5.2 6.8 4 10.9 0 15Z"
                stroke="currentColor"
                strokeWidth="1.6"
            />
            <path
                d="M15 24C9.5 23.3 6.6 20.5 7 14c5.4.7 8.1 4 8 10Z"
                stroke="currentColor"
                strokeWidth="1.6"
            />
            <path
                d="M17 24c5.5-.7 8.4-3.5 8-10-5.4.7-8.1 4-8 10Z"
                stroke="currentColor"
                strokeWidth="1.6"
            />
            <path
                d="M7 25h18"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
            />
        </svg>
    );
}

function SearchIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
        >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" strokeLinecap="round" />
        </svg>
    );
}

function ChevronIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
        >
            <path
                d="m9 5 7 7-7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default function TempleGuidePage() {
    return (
        <div className="min-h-screen bg-white text-[#252A31]">
            <header className="sticky top-0 z-30 border-b border-[#E7E9EC] bg-white/95 backdrop-blur">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:h-[72px] md:px-8">
                    <Link href="/" className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FEE500] md:h-10 md:w-10">
                            <LotusIcon />
                        </span>

                        <strong className="text-xl font-bold">연</strong>
                    </Link>

                    <Link
                        href="/temples"
                        className="rounded-xl border border-[#E3E8EF] bg-white px-4 py-2.5 text-sm font-semibold"
                    >
                        사찰 메뉴
                    </Link>
                </div>
            </header>

            <main>
                <section className="bg-[#F3F7F1]">
                    <div className="mx-auto max-w-6xl px-5 py-11 md:px-8 md:py-16">
                        <span className="text-sm font-bold text-[#61705B]">
                            사찰 안내
                        </span>

                        <h1 className="mt-3 text-[34px] font-bold tracking-[-0.045em] md:text-[48px]">
                            가까운 사찰을 찾아보세요
                        </h1>

                        <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#667085] md:text-base">
                            지역과 사찰 이름으로 검색하고 방문에 필요한 정보를
                            편하게 확인해 보세요.
                        </p>

                        <div className="mt-7 flex max-w-2xl items-center gap-2 rounded-[18px] border border-[#DDE7D9] bg-white p-2 shadow-[0_4px_16px_rgba(25,31,40,0.05)]">
                            <span className="ml-2 text-[#8B95A1]">
                                <SearchIcon />
                            </span>

                            <input
                                type="text"
                                placeholder="사찰 이름 또는 지역 검색"
                                className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm outline-none placeholder:text-[#A8B0BA]"
                            />

                            <button className="rounded-xl bg-[#252A31] px-4 py-3 text-sm font-bold text-white">
                                검색
                            </button>
                        </div>
                    </div>
                </section>

                <section className="border-b border-[#EEF0F2] bg-white">
                    <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-4 md:px-8">
                        {["전체", "서울", "경기", "강원", "충청", "전라", "경상", "제주"].map(
                            (region, index) => (
                                <button
                                    key={region}
                                    className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold ${index === 0
                                            ? "bg-[#252A31] text-white"
                                            : "border border-[#E3E8EF] bg-white text-[#667085]"
                                        }`}
                                >
                                    {region}
                                </button>
                            )
                        )}
                    </div>
                </section>

                <section className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
                    <div className="mb-5 flex items-end justify-between">
                        <div>
                            <span className="text-xs font-bold text-[#7A8B74]">
                                등록된 사찰
                            </span>

                            <h2 className="mt-1 text-[24px] font-bold tracking-[-0.035em] md:text-[28px]">
                                사찰 둘러보기
                            </h2>
                        </div>

                        <span className="text-sm text-[#8B95A1]">
                            예시 {temples.length}곳
                        </span>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {temples.map((temple) => (
                            <button
                                key={temple.id}
                                className="group overflow-hidden rounded-[22px] border border-[#E3E8EF] bg-white text-left transition hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(25,31,40,0.08)]"
                            >
                                <span className="flex h-40 items-center justify-center bg-[#F3F7F1] text-5xl">
                                    {temple.icon}
                                </span>

                                <span className="block p-5">
                                    <span className="flex items-start justify-between gap-3">
                                        <span>
                                            <strong className="block text-[20px] font-bold">
                                                {temple.name}
                                            </strong>

                                            <span className="mt-1 block text-sm text-[#8B95A1]">
                                                {temple.location}
                                            </span>
                                        </span>

                                        <span className="mt-1 text-[#7A8B74]">
                                            <ChevronIcon />
                                        </span>
                                    </span>

                                    <span className="mt-4 block text-sm leading-6 text-[#667085]">
                                        {temple.description}
                                    </span>

                                    <span className="mt-4 flex flex-wrap gap-2">
                                        {temple.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="rounded-full bg-[#F3F7F1] px-3 py-1.5 text-xs font-semibold text-[#61705B]"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </span>
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="mt-8 rounded-[22px] bg-[#FFF9C4] px-5 py-6 md:flex md:items-center md:justify-between md:px-7">
                        <div>
                            <strong className="text-lg">
                                사찰 정보를 등록하고 싶으신가요?
                            </strong>

                            <p className="mt-2 text-sm leading-6 text-[#6D6200]">
                                기본 등록은 무료로 제공할 예정입니다.
                            </p>
                        </div>

                        <button className="mt-5 w-full rounded-xl bg-[#252A31] px-5 py-3.5 text-sm font-bold text-white md:mt-0 md:w-auto">
                            사찰 등록 준비 중
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}