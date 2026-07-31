"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type PointerEvent } from "react";

const menus = [
    { title: "구인", image: "/images/menu/hire.webp", href: "/jobs" },
    {
        title: "구직",
        image: "/images/menu/job-seeker.webp",
        href: "/job-seekers",
    },
    {
        title: "행사·교육",
        image: "/images/menu/event-education.webp",
        href: "/events",
    },
    { title: "체험", image: "/images/menu/experience.webp", href: "/temples" },
];

const heroSlides = [
    {
        eyebrow: "연에서 만나는 불교 정보",
        title: "오늘 필요한 정보를\n쉽고 빠르게 찾아보세요",
        href: "/jobs",
        background: "bg-[#FEE500]",
        textColor: "text-[#191F28]",
    },
    {
        eyebrow: "연이 소개하는 템플스테이",
        title: "마음이 쉬어가는 시간\n템플스테이를 만나보세요",
        href: "/temples/stay",
        image: "/images/hero/temple-stay-novice.webp",
        background: "bg-[#F4EFE3]",
        textColor: "text-[#28241E]",
    },
    {
        eyebrow: "연이 소개하는 사찰음식",
        title: "자연을 담은 한 상\n사찰음식을 만나보세요",
        href: "/temples/food",
        image: "/images/hero/temple-food-real.webp",
        overlay: "bg-gradient-to-r from-[#FFFDF8]/58 via-[#FFFDF8]/16 to-transparent",
        background: "bg-[#F3EBDD]",
        textColor: "text-[#29251F]",
    },
    {
        eyebrow: "산사 문화행사",
        title: "별빛 아래 만나는\n산사의 음악",
        href: "/events",
        image: "/images/hero/temple-concert.webp",
        overlay: "bg-gradient-to-r from-[#FFF8EA]/58 via-[#FFF8EA]/16 to-transparent",
        background: "bg-[#F4E9D5]",
        textColor: "text-[#29251F]",
    },
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
    const [activeSlide, setActiveSlide] = useState(0);
    const pointerStartX = useRef<number | null>(null);
    const didDrag = useRef(false);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setActiveSlide((current) => (current + 1) % heroSlides.length);
        }, 6000);

        return () => window.clearTimeout(timer);
    }, [activeSlide]);

    const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
        pointerStartX.current = event.clientX;
        didDrag.current = false;
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
        if (pointerStartX.current === null) return;
        if (Math.abs(event.clientX - pointerStartX.current) > 10) {
            didDrag.current = true;
        }
    };

    const handlePointerUp = (event: PointerEvent<HTMLElement>) => {
        if (pointerStartX.current === null) return;

        const distance = event.clientX - pointerStartX.current;
        pointerStartX.current = null;

        if (Math.abs(distance) >= 45) {
            setActiveSlide((current) =>
                distance < 0
                    ? (current + 1) % heroSlides.length
                    : (current - 1 + heroSlides.length) % heroSlides.length
            );
        }

        window.setTimeout(() => {
            didDrag.current = false;
        }, 0);
    };

    const handlePointerCancel = () => {
        pointerStartX.current = null;
        didDrag.current = false;
    };

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
                <section
                    className="-mx-4 mb-8 cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing"
                    aria-label="주요 소식"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerCancel}
                >
                    <div
                        className="flex transition-transform duration-700 ease-in-out"
                        style={{ transform: `translateX(-${activeSlide * 100}%)` }}
                    >
                        {heroSlides.map((slide) => (
                            <Link
                                key={slide.title}
                                href={slide.href}
                                className={`${slide.background} ${slide.textColor} relative block min-h-[154px] w-full shrink-0 px-5 pb-9 pt-5`}
                                onClick={(event) => {
                                    if (didDrag.current) event.preventDefault();
                                }}
                            >
                                {"image" in slide && slide.image && (
                                    <>
                                        <img
                                            src={slide.image}
                                            alt=""
                                            draggable={false}
                                            className="absolute inset-0 h-full w-full object-cover object-center"
                                        />
                                        <span
                                            className={`absolute inset-0 ${"overlay" in slide
                                                ? slide.overlay
                                                : "bg-gradient-to-r from-[#FFFDF8]/58 via-[#FFFDF8]/16 to-transparent"
                                                }`}
                                            aria-hidden="true"
                                        />
                                    </>
                                )}

                                <span className="relative block max-w-[68%]">
                                    <span className="block text-[13px] font-medium opacity-70">
                                        {slide.eyebrow}
                                    </span>

                                    <strong className="mt-1 block whitespace-pre-line text-[23px] font-semibold leading-[1.25] tracking-[-0.04em]">
                                        {slide.title}
                                    </strong>
                                </span>


                            </Link>
                        ))}
                    </div>

                    <div className="relative -mt-6 flex justify-center gap-1.5 pb-3">
                        {heroSlides.map((slide, index) => (
                            <button
                                key={slide.title}
                                type="button"
                                onClick={() => setActiveSlide(index)}
                                className={`h-2 rounded-full transition-all ${activeSlide === index
                                    ? "w-6 bg-[#191F28]"
                                    : "w-2 bg-[#191F28]/25"
                                    }`}
                                aria-label={`${index + 1}번째 소식 보기`}
                            />
                        ))}
                    </div>
                </section>

                <section className="grid grid-cols-4 gap-2">
                    {menus.map((menu) => (
                        <Link
                            key={menu.title}
                            href={menu.href}
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
                        </Link>
                    ))}
                </section>

                <Link
                    href="/stories"
                    className="mt-7 flex w-full items-center justify-between rounded-[22px] border border-[#E2E7DA] bg-[#F3F5EE] px-5 py-5 shadow-[0_4px_14px_rgba(25,31,40,0.04)] transition active:scale-[0.99]"
                >
                    <span className="flex items-center gap-3.5">
                        <span className="flex h-14 w-14 shrink-0 items-center justify-center">
                            <svg
                                viewBox="0 0 64 64"
                                fill="none"
                                className="h-14 w-14 text-[#786B5A]"
                                aria-hidden="true"
                            >
                                <path
                                    d="M8 15.5c8.5-2.5 16.5-.8 24 5v31c-7.5-5.8-15.5-7.5-24-5V15.5Z"
                                    fill="#FFFDF3"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M56 15.5c-8.5-2.5-16.5-.8-24 5v31c7.5-5.8 15.5-7.5 24-5V15.5Z"
                                    fill="#FFFDF3"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M32 20.5v31"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                                <path
                                    d="M32 39c-4.2-3.4-5.2-7.4 0-12.5 5.2 5.1 4.2 9.1 0 12.5Z"
                                    fill="#FEE500"
                                    stroke="currentColor"
                                    strokeWidth="1.6"
                                />
                                <path
                                    d="M30.5 40c-4.7-.4-7.2-2.8-7.5-7 4.6.3 7.1 2.7 7.5 7Z"
                                    fill="#FEE500"
                                    stroke="currentColor"
                                    strokeWidth="1.6"
                                />
                                <path
                                    d="M33.5 40c4.7-.4 7.2-2.8 7.5-7-4.6.3-7.1 2.7-7.5 7Z"
                                    fill="#FEE500"
                                    stroke="currentColor"
                                    strokeWidth="1.6"
                                />
                            </svg>
                        </span>

                        <span>
                            <span className="block text-xs font-medium text-[#8D8040]">
                                마음을 쉬어가는 이야기
                            </span>
                            <span className="mt-1 block text-[17px] font-medium text-[#252A31]">
                                부처님 이야기
                            </span>
                        </span>
                    </span>

                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#8B95A1]">
                        <ChevronIcon />
                    </span>
                </Link>

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
