import Link from "next/link";

const foodPrograms = [
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
    },
    {
        id: 3,
        title: "발우공양 체험",
        place: "통도사",
        location: "경남 양산",
        type: "체험",
        schedule: "주말 운영",
        price: "20,000원",
        icon: "🍚",
        background: "bg-[#FFF8D9]",
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

export default function TempleFoodPage() {
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

                    <div className="flex items-center gap-2">
                        <Link
                            href="/temples"
                            className="rounded-xl px-3 py-2.5 text-sm font-normal text-[#667085]"
                        >
                            사찰 메뉴
                        </Link>

                        <Link
                            href="/temples/food/new"
                            className="rounded-xl bg-[#FEE500] px-4 py-2.5 text-sm font-medium text-[#191F28]"
                        >
                            등록하기
                        </Link>
                    </div>
                </div>
            </header>

            <main>
                <section className="bg-[#F6F1EA]">
                    <div className="mx-auto max-w-6xl px-5 py-11 md:px-8 md:py-16">
                        <span className="text-sm font-bold text-[#786B5A]">
                            사찰음식
                        </span>

                        <h1 className="mt-3 text-[32px] font-bold leading-[1.3] tracking-[-0.045em] md:text-[48px]">
                            음식으로 만나는
                            <br className="md:hidden" />
                            수행의 지혜
                        </h1>

                        <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#667085] md:text-base">
                            자연의 재료를 소중히 사용하고 몸과 마음을 돌보는
                            사찰음식 체험과 교육을 만나보세요.
                        </p>

                        <div className="mt-7 flex max-w-2xl items-center gap-2 rounded-[18px] border border-[#E4D9CD] bg-white p-2 shadow-[0_4px_16px_rgba(25,31,40,0.05)]">
                            <span className="ml-2 text-[#8B95A1]">
                                <SearchIcon />
                            </span>

                            <input
                                type="text"
                                placeholder="체험, 교육 또는 지역 검색"
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
                            "체험",
                            "교육",
                            "가족 체험",
                            "영문 체험",
                            "예약 가능",
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
                            <span className="text-xs font-bold text-[#786B5A]">
                                사찰음식 프로그램
                            </span>

                            <h2 className="mt-1 text-[24px] font-bold tracking-[-0.035em] md:text-[28px]">
                                체험과 교육 둘러보기
                            </h2>
                        </div>

                        <span className="text-sm text-[#8B95A1]">
                            예시 {foodPrograms.length}개
                        </span>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {foodPrograms.map((program) => (
                            <Link
                                key={program.id}
                                href={`/temples/food/${program.id}`}
                                className="group overflow-hidden rounded-[22px] border border-[#E3E8EF] bg-white text-left transition hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(25,31,40,0.08)]"
                            >
                                <span
                                    className={`${program.background} flex h-44 items-center justify-center text-6xl`}
                                >
                                    {program.icon}
                                </span>

                                <span className="block p-5">
                                    <span className="inline-flex rounded-full bg-[#F1EBE3] px-3 py-1.5 text-xs font-bold text-[#786B5A]">
                                        {program.type}
                                    </span>

                                    <strong className="mt-4 block text-[20px] font-bold">
                                        {program.title}
                                    </strong>

                                    <span className="mt-2 block text-sm font-semibold text-[#667085]">
                                        {program.place}
                                    </span>

                                    <span className="mt-1 block text-sm text-[#8B95A1]">
                                        {program.location}
                                    </span>

                                    <span className="mt-5 flex items-end justify-between border-t border-[#EEF0F2] pt-4">
                                        <span>
                                            <span className="block text-xs text-[#8B95A1]">
                                                {program.schedule}
                                            </span>

                                            <strong className="mt-1 block">
                                                {program.price}
                                            </strong>
                                        </span>

                                        <span className="text-sm font-bold text-[#786B5A]">
                                            보기 →
                                        </span>
                                    </span>
                                </span>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-8 rounded-[22px] bg-[#F6F1EA] px-5 py-6 md:flex md:items-center md:justify-between md:px-7">
                        <div>
                            <h3 className="text-lg font-medium">
                                새로운 소식을 알려주세요
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-[#786B5A]">
                                사찰음식 체험·교육·행사 정보를
                                <br className="md:hidden" />
                                직접 등록할 수 있습니다.
                            </p>
                        </div>

                        <Link
                            href="/temples/food/new"
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