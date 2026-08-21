import Link from "next/link";

const templeMenus = [
    {
        href: "/temples/guide",
        label: "사찰 안내",
        title: "가까운 사찰 찾기",
        description:
            "지역별 사찰과 주소, 연락처, 교통 및 방문 정보를 찾아보세요.",
        icon: "🏯",
        background: "bg-[#F3F7F1]",
        iconBackground: "bg-[#E1EEDF]",
    },
    {
        href: "/temples/stay",
        label: "템플스테이",
        title: "쉼이 필요한 순간",
        description:
            "휴식형·체험형·당일형 등 나에게 맞는 프로그램을 찾아보세요.",
        icon: "🧘",
        background: "bg-[#FFF9DC]",
        iconBackground: "bg-[#FFF0A8]",
    },
    {
        href: "/temples/food",
        label: "사찰음식",
        title: "음식으로 만나는 수행",
        description:
            "사찰음식 체험과 교육, 행사 및 관련 공간을 살펴보세요.",
        icon: "🥣",
        background: "bg-[#F6F1EA]",
        iconBackground: "bg-[#EDE2D4]",
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

export default function TemplesPage() {
    return (
        <div className="min-h-screen bg-white text-[#252A31]">
            <header className="sticky top-0 z-30 border-b border-[#E7E9EC] bg-white/95 backdrop-blur md:hidden">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:h-[72px] md:px-8">
                    <Link href="/" className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FEE500] text-[#191F28] md:h-10 md:w-10">
                            <LotusIcon />
                        </span>

                        <strong className="text-xl font-bold tracking-[-0.04em]">
                            연
                        </strong>
                    </Link>

                    <Link
                        href="/"
                        className="rounded-xl border border-[#E3E8EF] bg-white px-4 py-2.5 text-sm font-semibold"
                    >
                        홈으로
                    </Link>
                </div>
            </header>

            <main>
                <section className="bg-[#FEE500]">
                    <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-20">
                        <span className="text-sm font-bold text-[#6D6200]">
                            사찰과 만나는 가장 쉬운 방법
                        </span>

                        <h1 className="mt-3 text-[34px] font-bold leading-tight tracking-[-0.045em] md:text-[52px]">
                            무엇을 찾고 계신가요?
                        </h1>

                        <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[#5F5700] md:text-[17px]">
                            사찰 안내와 템플스테이, 사찰음식 중
                            <br className="hidden md:block" />
                            원하는 정보를 선택해 주세요.
                        </p>
                    </div>
                </section>

                <section className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-14">
                    <div className="grid gap-4 md:grid-cols-3">
                        {templeMenus.map((menu) => (
                            <Link
                                key={menu.href}
                                href={menu.href}
                                className={`${menu.background} group rounded-[26px] border border-[#E3E8EF] p-5 transition hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(25,31,40,0.09)] md:p-7`}
                            >
                                <span
                                    className={`${menu.iconBackground} flex h-16 w-16 items-center justify-center rounded-[20px] text-3xl`}
                                >
                                    {menu.icon}
                                </span>

                                <span className="mt-6 block text-sm font-bold text-[#7A6D00]">
                                    {menu.label}
                                </span>

                                <h2 className="mt-2 text-[23px] font-bold tracking-[-0.035em]">
                                    {menu.title}
                                </h2>

                                <p className="mt-3 text-sm leading-6 text-[#667085]">
                                    {menu.description}
                                </p>

                                <span className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#252A31]">
                                    들어가기
                                    <ArrowIcon />
                                </span>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-8 rounded-[22px] border border-[#E7E9EC] bg-[#F7F8FA] px-5 py-6 md:px-7">
                        <span className="text-sm font-bold">
                            사찰 관계자이신가요?
                        </span>

                        <p className="mt-2 text-sm leading-6 text-[#667085]">
                            사찰 정보 등록과 홈페이지 제작 및 관리 서비스도
                            차례대로 준비할 예정입니다.
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
}
