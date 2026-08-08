import Link from "next/link";

const programs = [
    {
        id: 1,
        name: "월정사 숲속 힐링",
        temple: "월정사",
        location: "강원 평창",
        type: "휴식형",
        duration: "1박 2일",
        price: "50,000원",
        rating: "4.8",
        icon: "🌲",
        background: "bg-[#EEF5E9]",
    },
    {
        id: 2,
        name: "해인사 명상 수련",
        temple: "해인사",
        location: "경남 합천",
        type: "체험형",
        duration: "2박 3일",
        price: "80,000원",
        rating: "4.9",
        icon: "🧘",
        background: "bg-[#FFF8D9]",
    },
    {
        id: 3,
        name: "통도사 하루 체험",
        temple: "통도사",
        location: "경남 양산",
        type: "당일형",
        duration: "당일",
        price: "30,000원",
        rating: "4.7",
        icon: "🕯️",
        background: "bg-[#F7F0E8]",
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
    },
];

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

function TempleCategoryNav() {
    const menus = [
        { label: "사찰 안내", href: "/temples/guide", active: false },
        { label: "템플스테이", href: "/temples/stay", active: true },
        { label: "사찰음식", href: "/temples/food", active: false },
    ];

    return (
        <nav
            className="sticky top-16 z-20 border-b border-[#E7E9EC] bg-white/95 backdrop-blur md:hidden"
            aria-label="사찰 서비스"
        >
            <div className="mx-auto grid max-w-6xl grid-cols-3 gap-1 px-4 py-2.5 md:px-8">
                {menus.map((menu) => (
                    <Link
                        key={menu.href}
                        href={menu.href}
                        aria-current={menu.active ? "page" : undefined}
                        className={`flex min-h-11 items-center justify-center rounded-xl px-2 text-[13px] font-medium transition md:text-sm ${menu.active
                            ? "bg-[#F4F54A] text-[#191F28]"
                            : "text-[#667085] hover:bg-[#F5F6F7] hover:text-[#191F28]"
                            }`}
                    >
                        {menu.label}
                    </Link>
                ))}
            </div>
        </nav>
    );
}

export default function TempleStayPage() {
    return (
        <div className="min-h-screen bg-white text-[#252A31]">

            <TempleCategoryNav />

            <main>
                <section className="bg-[#FFF9DC]">
                    <div className="mx-auto max-w-6xl px-5 py-11 md:px-8 md:py-16">
                        <span className="text-sm font-bold text-[#7A6D00]">
                            템플스테이
                        </span>

                        <h1 className="mt-3 text-[34px] font-bold tracking-[-0.045em] md:text-[48px]">
                            잠시 쉬어가도 괜찮아요
                        </h1>

                        <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#667085] md:text-base">
                            지역과 기간, 프로그램 유형을 비교하고 나에게 맞는
                            템플스테이를 찾아보세요.
                        </p>

                        <div className="mt-7 flex max-w-2xl items-center gap-2 rounded-[18px] border border-[#EEE3A7] bg-white p-2 shadow-[0_4px_16px_rgba(25,31,40,0.05)]">
                            <span className="ml-2 text-[#8B95A1]">
                                <SearchIcon />
                            </span>

                            <input
                                type="text"
                                placeholder="사찰 또는 프로그램 검색"
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
                        {[
                            "전체",
                            "휴식형",
                            "체험형",
                            "당일형",
                            "1박 2일",
                            "2박 이상",
                        ].map((type, index) => (
                            <button
                                key={type}
                                className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold ${index === 0
                                    ? "bg-[#252A31] text-white"
                                    : "border border-[#E3E8EF] bg-white text-[#667085]"
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </section>

                <section className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
                    <div className="mb-5 flex items-end justify-between">
                        <div>
                            <span className="text-xs font-bold text-[#7A6D00]">
                                추천 프로그램
                            </span>

                            <h2 className="mt-1 text-[24px] font-bold tracking-[-0.035em] md:text-[28px]">
                                템플스테이 둘러보기
                            </h2>
                        </div>

                        <span className="text-sm text-[#8B95A1]">
                            예시 {programs.length}개
                        </span>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {programs.map((program) => (
                            <Link
                                key={program.id}
                                href={`/temples/stay/${program.id}`}
                                className="group overflow-hidden rounded-[22px] border border-[#E3E8EF] bg-white text-left transition hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(25,31,40,0.08)]"
                            >
                                <span
                                    className={`${program.background} flex h-44 items-center justify-center text-6xl`}
                                >
                                    {program.icon}
                                </span>

                                <span className="block p-5">
                                    <span className="flex items-center justify-between gap-3">
                                        <span className="rounded-full bg-[#FFF4B8] px-3 py-1.5 text-xs font-bold text-[#6D6200]">
                                            {program.type}
                                        </span>

                                        <span className="text-sm font-semibold text-[#667085]">
                                            ★ {program.rating}
                                        </span>
                                    </span>

                                    <strong className="mt-4 block text-[20px] font-bold">
                                        {program.name}
                                    </strong>

                                    <span className="mt-1 block text-sm text-[#8B95A1]">
                                        {program.temple} · {program.location}
                                    </span>

                                    <span className="mt-5 flex items-end justify-between border-t border-[#EEF0F2] pt-4">
                                        <span>
                                            <span className="block text-xs text-[#8B95A1]">
                                                {program.duration}
                                            </span>

                                            <strong className="mt-1 block">
                                                {program.price}
                                            </strong>
                                        </span>

                                        <span className="text-sm font-bold text-[#7A6D00]">
                                            보기 →
                                        </span>
                                    </span>
                                </span>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-8 rounded-[22px] bg-[#FDFDC7] px-5 py-6 md:flex md:items-center md:justify-between md:px-7">
                        <div>
                            <h3 className="text-lg font-medium">
                                새로운 프로그램을 알려주세요
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-[#6D6200]">
                                템플스테이 프로그램 정보를{" "}
                                <br className="md:hidden" />
                                직접 등록할 수 있습니다.
                            </p>
                        </div>

                        <Link
                            href="/temples/stay/new"
                            className="mt-6 flex w-full items-center justify-center rounded-xl bg-[#252A31] px-5 py-3.5 text-sm font-medium text-white md:mt-0 md:w-auto"
                        >
                            등록하기
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
}
