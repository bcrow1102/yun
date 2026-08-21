import Link from "next/link";
import {
    getTempleFoodDisplayInfo,
    templeFoodPrograms,
} from "./data";

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
        { label: "템플스테이", href: "/temples/stay", active: false },
        { label: "사찰음식", href: "/temples/food", active: true },
    ];

    return (
        <nav
            className="temple-category-nav sticky top-14 z-20 border-b border-[#E7E9EC] bg-white/95 backdrop-blur md:hidden"
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

export default function TempleFoodPage() {
    return (
        <div className="min-h-screen bg-white text-[#252A31]">

            <TempleCategoryNav />

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
                            예시 {templeFoodPrograms.length}개
                        </span>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {templeFoodPrograms.map((program) => {
                            const { place, location } =
                                getTempleFoodDisplayInfo(program);

                            return (
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
                                            {place}
                                        </span>

                                        <span className="mt-1 block text-sm text-[#8B95A1]">
                                            {location}
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
                            );
                        })}
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
