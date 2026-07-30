import Link from "next/link";
const menus = [
    { title: "구인", image: "/images/menu/hire.webp" },
    { title: "구직", image: "/images/menu/job-seeker.webp" },
    { title: "행사·교육", image: "/images/menu/event-education.webp" },
    { title: "체험", image: "/images/menu/experience.webp" },
];

const jobs = [
    {
        temple: "조계사",
        title: "사무행정 담당자 모집",
        location: "서울 종로구",
        date: "~07.31",
    },
    {
        temple: "해인사",
        title: "문화해설 자원봉사자",
        location: "경남 합천",
        date: "~08.15",
    },
    {
        temple: "불국사",
        title: "템플스테이 코디네이터",
        location: "경북 경주",
        date: "~08.05",
    },
];

const templeStays = [
    {
        name: "월정사 숲속 힐링",
        location: "강원 평창",
        duration: "1박 2일",
    },
    {
        name: "해인사 명상 수련",
        location: "경남 합천",
        duration: "2박 3일",
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
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <circle
                cx="11"
                cy="11"
                r="7"
                stroke="currentColor"
                strokeWidth="1.8"
            />
            <path
                d="m20 20-4-4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
        </svg>
    );
}

function ChevronIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <path
                d="m9 5 7 7-7 7"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function TempleImage() {
    return (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#EAF3FF] text-[#3182F6]">
            <div className="absolute bottom-0 left-0 h-10 w-full bg-[#DCEBFF]" />
            <div className="absolute -right-5 -top-6 h-20 w-20 rounded-full bg-[#FFF3A6]" />

            <svg
                viewBox="0 0 64 64"
                fill="none"
                className="relative h-12 w-12"
                aria-hidden="true"
            >
                <path
                    d="M10 29h44M16 29l16-13 16 13M15 48h34M19 29v19M32 29v19M45 29v19"
                    stroke="currentColor"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
}

export default function MobileHome() {
    return (
        <div className="min-h-screen bg-white pb-24 text-[#252A31] md:hidden">
            <header className="sticky top-0 z-30 bg-[#FEE500]/95 backdrop-blur">
                <div className="flex h-16 items-center justify-between px-5">
                    <div className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#191F28]">
                            <LotusIcon />
                        </span>

                        <strong className="text-xl tracking-[-0.04em]">연</strong>
                    </div>

                    <div className="flex items-center gap-1">
                        <button className="rounded-lg px-2 py-2 text-xs font-semibold text-[#191F28]">
                            KR
                        </button>

                        <button className="rounded-lg px-2 py-2 text-xs text-[#8B95A1]">
                            EN
                        </button>

                        <button
                            className="ml-1 flex h-9 w-9 items-center justify-center rounded-full text-[#333D4B] transition-colors hover:bg-[#F2F4F6]"
                            aria-label="검색"
                        >
                            <SearchIcon />
                        </button>

                        <button className="ml-1 text-xs font-semibold text-[#3182F6]">
                            로그인
                        </button>
                    </div>
                </div>
            </header>

            <main className="px-4 pb-8">
                <section className="-mx-4 mb-8 bg-[#FEE500] px-5 pb-7 pt-5">
                    <p className="text-[15px] font-medium text-[#6D6200]">
                        오늘 필요한 불교 정보를
                    </p>

                    <h1 className="mt-1 text-[26px] font-bold leading-tight tracking-[-0.045em]">
                        쉽고 빠르게 찾아보세요
                    </h1>
                </section>

                <section className="grid grid-cols-4 gap-2">
                    {menus.map((menu) => (
                        <button
                            key={menu.title}
                            className="min-w-0 overflow-hidden rounded-[18px] border border-[#E7E9EC] bg-[#FFFBE0] text-center shadow-[0_2px_8px_rgba(25,31,40,0.035)]"
                        >
                            <span className="block h-2 bg-[#FEE500]" />

                            <span className="flex h-[82px] items-center justify-center px-1.5 pt-2">
                                <img
                                    src={menu.image}
                                    alt=""
                                    className="h-full w-full object-contain"
                                />
                            </span>

                            <strong className="block truncate px-1 pb-3 pt-1 text-[12px] font-semibold text-[#252A31]">
                                {menu.title}
                            </strong>
                        </button>
                    ))}
                </section>

                <section className="mt-7">
                    <Link
                        href="/stories"
                        className="flex w-full items-center justify-between rounded-[22px] border border-[#DDE7D9] bg-[#F3F7F1] px-5 py-5"
                    >
                        <span className="min-w-0 text-left">
                            <span className="text-xs font-bold text-[#61705B]">
                                부처님 이야기
                            </span>

                            <strong className="mt-1 block text-[18px] font-bold tracking-[-0.025em] text-[#252A31]">
                                오늘의 이야기
                            </strong>

                            <span className="mt-1 block text-xs leading-5 text-[#667085]">
                                세 장의 삽화로 만나는 짧은 깨달음
                            </span>
                        </span>

                        <span className="ml-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-white text-[#61705B]">
                            <LotusIcon />
                        </span>
                    </Link>
                </section>

                <section className="mt-7">
                    <div className="mb-3 flex items-center justify-between px-1">
                        <h2 className="text-xl font-bold tracking-[-0.035em]">
                            최신 구인
                        </h2>

                        <button className="text-sm font-medium text-[#8B95A1]">
                            전체보기
                        </button>
                    </div>

                    <div className="overflow-hidden rounded-[22px] border border-[#E3E8EF] bg-[#F4F7FA] px-4">
                        {jobs.map((job, index) => (
                            <button
                                key={`${job.temple}-${job.title}`}
                                className={`flex w-full items-center py-4 text-left ${index !== jobs.length - 1
                                    ? "border-b border-[#F2F4F6]"
                                    : ""
                                    }`}
                            >
                                <span className="min-w-0 flex-1">
                                    <span className="block text-[12px] text-[#667085]">
                                        {job.temple} · {job.location}
                                    </span>

                                    <strong className="mt-1 block truncate text-[15px] font-semibold text-[#252A31]">
                                        {job.title}
                                    </strong>
                                </span>

                                <span className="ml-3 text-xs text-[#667085]">
                                    {job.date}
                                </span>

                                <span className="ml-2 text-[#B0B8C1]">
                                    <ChevronIcon />
                                </span>
                            </button>
                        ))}
                    </div>
                </section>



                <section className="mt-7">
                    <button className="flex w-full items-center justify-between rounded-[22px] bg-[#FEE500] px-5 py-5 text-left">
                        <span>
                            <span className="text-xs font-bold text-[#4D4300]">
                                행사·교육
                            </span>

                            <strong className="mt-1 block text-[17px] tracking-[-0.025em]">
                                행사 등록부터 웹전단까지
                            </strong>

                            <span className="mt-1 block text-xs text-[#6D6200]">
                                한 번 입력하면 홍보 문구도 완성해드려요
                            </span>
                        </span>

                        <span className="text-[#4D4300]">
                            <ChevronIcon />
                        </span>
                    </button>
                </section>

                <section className="mt-7">
                    <div className="mb-3 flex items-center justify-between px-1">
                        <h2 className="text-xl font-bold tracking-[-0.035em]">
                            추천 템플스테이
                        </h2>

                        <button className="text-sm font-medium text-[#8B95A1]">
                            전체보기
                        </button>
                    </div>

                    <div className="space-y-3">
                        {templeStays.map((stay) => (
                            <button
                                key={stay.name}
                                className="flex w-full overflow-hidden rounded-[22px] border border-[#E7E9EC] bg-white text-left"
                            >
                                <span className="h-[104px] w-[112px] shrink-0">
                                    <TempleImage />
                                </span>

                                <span className="flex min-w-0 flex-1 items-center justify-between px-4">
                                    <span className="min-w-0">
                                        <strong className="block truncate text-[15px] font-semibold text-[#252A31]">
                                            {stay.name}
                                        </strong>

                                        <span className="mt-1.5 block text-xs text-[#667085]">
                                            {stay.location} · {stay.duration}
                                        </span>
                                    </span>

                                    <span className="ml-2 text-[#B0B8C1]">
                                        <ChevronIcon />
                                    </span>
                                </span>
                            </button>
                        ))}
                    </div>
                </section>

                <section className="mt-7 grid grid-cols-2 gap-3">
                    <button className="rounded-[20px] border border-[#E7E9EC] bg-white px-4 py-4 text-left">
                        <span className="text-xs font-medium text-[#3182F6]">
                            사찰음식
                        </span>
                        <strong className="mt-1 block text-[15px]">
                            우리 사찰음식 보기
                        </strong>
                    </button>

                    <button className="rounded-[20px] border border-[#E7E9EC] bg-white px-4 py-4 text-left">
                        <span className="text-xs font-medium text-[#3182F6]">
                            새로운 소식
                        </span>
                        <strong className="mt-1 block text-[15px]">
                            행사 일정 둘러보기
                        </strong>
                    </button>
                </section>
            </main>
        </div>
    );
}
