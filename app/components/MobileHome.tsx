"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type PointerEvent } from "react";

const menus = [
    { title: "구인", image: "/images/menu/hire.webp", href: "/jobs" },
    {
        title: "홍보물 DIY",
        image: "/images/menu/promote-diy.webp",
        href: "/events/promote",
    },
    {
        title: "행사·교육",
        image: "/images/menu/event-education.webp",
        href: "/events",
    },
    {
        title: "사찰",
        image: "/images/menu/experience.webp",
        href: "/temples/guide",
    },
];

const heroSlides = [
    {
        eyebrow: "연에서 만나는 불교 정보",
        title: "오늘 필요한 정보를\n쉽고 빠르게 찾아보세요",
        href: "/jobs",
        background: "bg-[#F4F54A]",
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
        overlay:
            "bg-gradient-to-r from-[#FFFDF8]/58 via-[#FFFDF8]/16 to-transparent",
        background: "bg-[#F3EBDD]",
        textColor: "text-[#29251F]",
    },
    {
        eyebrow: "산사 문화행사",
        title: "별빛 아래 만나는\n산사의 음악",
        href: "/events",
        image: "/images/hero/temple-concert.webp",
        overlay:
            "bg-gradient-to-r from-[#FFF8EA]/58 via-[#FFF8EA]/16 to-transparent",
        background: "bg-[#F4E9D5]",
        textColor: "text-[#29251F]",
    },
];

const jobs = [
    {
        id: 1,
        temple: "조계사",
        title: "사무행정 담당자 모집",
        location: "서울 종로구",
        date: "~07.31",
    },
    {
        id: 2,
        temple: "해인사",
        title: "문화해설 자원봉사자",
        location: "경남 합천",
        date: "~08.15",
    },
    {
        id: 3,
        temple: "불국사",
        title: "템플스테이 코디네이터",
        location: "경북 경주",
        date: "~08.05",
    },
];

const templeStays = [
    {
        id: 1,
        name: "월정사 숲속 힐링",
        location: "강원 평창",
        duration: "1박 2일",
    },
    {
        id: 2,
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
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
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

function FooterArrowIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 -rotate-45" aria-hidden="true">
            <path
                d="M5 12h14m-5-5 5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function KakaoIcon() {
    return (
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
            <path
                d="M16 5C9.4 5 4 9.2 4 14.4c0 3.4 2.3 6.4 5.8 8.1l-1.5 5.2c-.1.4.4.7.7.5l6.1-4.1h.9c6.6 0 12-4.2 12-9.5S22.6 5 16 5Z"
                fill="currentColor"
            />
        </svg>
    );
}

function MessageIcon() {
    return (
        <svg
            viewBox="0 0 32 32"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            className="h-7 w-7"
            aria-hidden="true"
        >
            <path d="M6 7.5h20v15H14l-6 4v-4H6v-15Z" strokeLinejoin="round" />
            <path d="M11 14.8h.1m4.9 0h.1m4.9 0h.1" strokeLinecap="round" strokeWidth="2.6" />
        </svg>
    );
}

function OpenBookIcon() {
    return (
        <svg viewBox="0 0 64 64" fill="none" className="h-14 w-14" aria-hidden="true">
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
            <path d="M32 20.5v31" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path
                d="M32 39c-4.2-3.4-5.2-7.4 0-12.5 5.2 5.1 4.2 9.1 0 12.5Z"
                fill="#F4F54A"
                stroke="currentColor"
                strokeWidth="1.6"
            />
            <path
                d="M30.5 40c-4.7-.4-7.2-2.8-7.5-7 4.6.3 7.1 2.7 7.5 7Z"
                fill="#F4F54A"
                stroke="currentColor"
                strokeWidth="1.6"
            />
            <path
                d="M33.5 40c4.7-.4 7.2-2.8 7.5-7-4.6.3-7.1 2.7-7.5 7Z"
                fill="#F4F54A"
                stroke="currentColor"
                strokeWidth="1.6"
            />
        </svg>
    );
}

function ArchiveDocumentIcon() {
    return (
        <svg viewBox="0 0 64 64" fill="none" className="h-14 w-14" aria-hidden="true">
            <path
                d="M17 11h25l8 8v34H17V11Z"
                fill="#FFFDF3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
            />
            <path d="M42 11v9h8" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M24 29h19M24 36h19M24 43h13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path
                d="M12 18v38h31"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M24 23h8" stroke="#A3A86B" strokeWidth="3" strokeLinecap="round" />
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

let hasShownMobileIntro = false;

export default function MobileHome() {
    const [activeSlide, setActiveSlide] = useState(0);
    const [showIntro, setShowIntro] = useState(() => !hasShownMobileIntro);
    const [introLeaving, setIntroLeaving] = useState(false);
    const introStartedHere = useRef(false);
    const pointerStartX = useRef<number | null>(null);
    const didDrag = useRef(false);

    useEffect(() => {
        if (!showIntro) return;

        if (!introStartedHere.current) {
            introStartedHere.current = true;
            hasShownMobileIntro = true;
        }

        const fadeTimer = window.setTimeout(() => setIntroLeaving(true), 3000);
        const hideTimer = window.setTimeout(() => setShowIntro(false), 3500);

        return () => {
            window.clearTimeout(fadeTimer);
            window.clearTimeout(hideTimer);
        };
    }, [showIntro]);

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
                    : (current - 1 + heroSlides.length) % heroSlides.length,
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
            {showIntro && (
                <div
                    className={`fixed inset-0 z-[100] flex bg-[#F4F54A] px-7 transition-opacity duration-500 ${introLeaving ? "pointer-events-none opacity-0" : "opacity-100"}`}
                    role="status"
                    aria-live="polite"
                    aria-label="연 주요 서비스 안내"
                >
                    <div className="my-auto w-full text-[#191F28]">
                        <div className="flex items-center gap-2.5">
                            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/85">
                                <LotusIcon />
                            </span>
                            <span className="text-xl font-semibold tracking-[-0.04em]">
                                연
                            </span>
                        </div>

                        <p className="mt-10 text-[15px] font-medium tracking-[-0.02em] text-[#555700]">
                            템플스테이 · 사찰음식
                        </p>
                        <p className="mt-2 text-[48px] font-semibold leading-[0.98] tracking-[-0.07em]">
                            홍보물 DIY
                        </p>
                        <p className="mt-3 text-sm font-medium text-[#555700]">
                            머물고, 체험하고, 직접 만드는 한국불교 생활
                        </p>

                        <div className="mt-9 grid grid-cols-3 gap-2.5">
                            {[
                                {
                                    label: "템플스테이",
                                    image: "/images/hero/temple-stay-novice.webp",
                                    position: "82% center",
                                    offset: "mt-7",
                                    aspect: "aspect-[3/4]",
                                },
                                {
                                    label: "홍보물 DIY",
                                    image: "/images/promote/promote-other-lotus-novice.webp",
                                    position: "center",
                                    offset: "mt-0",
                                    aspect: "aspect-[2/3]",
                                },
                                {
                                    label: "사찰음식",
                                    image: "/images/hero/temple-food-real.webp",
                                    position: "82% center",
                                    offset: "mt-4",
                                    aspect: "aspect-[5/7]",
                                },
                            ].map((item) => (
                                <div key={item.label} className={item.offset}>
                                    <div
                                        className={`${item.aspect} overflow-hidden rounded-[22px] bg-white/60`}
                                    >
                                        <img
                                            src={item.image}
                                            alt=""
                                            className="h-full w-full object-cover"
                                            style={{ objectPosition: item.position }}
                                        />
                                    </div>
                                    <p className="mt-2 text-center text-[11px] font-semibold tracking-[-0.03em]">
                                        {item.label}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <p className="mt-8 text-center text-xs font-medium text-[#666800]">
                            한국불교 생활 플랫폼 연
                        </p>
                    </div>
                </div>
            )}

            <header className="sticky top-0 z-30 bg-[#F4F54A]/95 backdrop-blur">
                <div className="flex h-16 items-center justify-between px-5">
                    <Link
                        href="/"
                        onClick={(event) => {
                            event.preventDefault();
                            window.location.assign("/");
                        }}
                        className="flex items-center gap-2.5"
                        aria-label="연 홈"
                    >
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#191F28]">
                            <LotusIcon />
                        </span>

                        <strong className="text-xl tracking-[-0.04em]">연</strong>
                    </Link>

                    <div className="flex items-center gap-1">
                        <button className="rounded-lg px-2 py-2 text-xs font-semibold text-[#191F28]">
                            KR
                        </button>

                        <button className="rounded-lg px-2 py-2 text-xs text-[#8B95A1]">
                            EN
                        </button>

                        <Link
                            href="/search"
                            className="ml-1 flex h-9 w-9 items-center justify-center rounded-full text-[#333D4B] transition-colors hover:bg-[#F2F4F6]"
                            aria-label="검색"
                        >
                            <SearchIcon />
                        </Link>

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

                <section className="-mx-4 bg-white px-5 pb-10" aria-labelledby="mobile-living-title">
                    <h2 id="mobile-living-title" className="text-[17px] font-medium tracking-[-0.03em] text-[#252A31]">
                        한국불교 생활 찾기
                    </h2>
                    <div className="mt-4 grid grid-cols-4 gap-2">
                        {[
                            { title: "템플스테이", href: "/temples/stay", image: "/images/menu/temple-stay-icon.webp", size: "88%", position: "center" },
                            { title: "사찰음식", href: "/temples/food", image: "/images/menu/temple-food-icon.webp", size: "88%", position: "center" },
                            { title: "행사교육", href: "/events", image: "/images/menu/event-education.webp", size: "82%", position: "center" },
                            { title: "사찰 안내", href: "/temples/guide", image: "/images/menu/temple-guide-icon.webp", size: "88%", position: "center" },
                        ].map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="min-w-0 overflow-hidden rounded-[18px] border border-[#E7E9EC] bg-[#FFFBE0] text-center shadow-[0_2px_8px_rgba(25,31,40,0.035)] transition-[transform,box-shadow,border-color] duration-150 active:scale-[0.98] active:border-[#DCDD36] active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9BA28] focus-visible:ring-offset-2"
                            >
                                <span className="block h-2 bg-[#F4F54A]" />
                                <span className="flex h-[82px] items-center justify-center px-1.5 pt-2">
                                    <span
                                        aria-hidden="true"
                                        className="h-full w-full bg-transparent bg-no-repeat"
                                        style={{
                                            backgroundImage: `url(${item.image})`,
                                            backgroundPosition: item.position,
                                            backgroundSize: item.size,
                                        }}
                                    />
                                </span>
                                <strong className="block truncate whitespace-nowrap px-1 pb-3 pt-1 text-[12px] font-semibold text-[#252A31]">
                                    {item.title}
                                </strong>
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="-mx-4 mt-2 bg-[#FAF8F2] px-5 pb-10 pt-8" aria-labelledby="mobile-quick-actions-title">
                    <h2 id="mobile-quick-actions-title" className="text-[17px] font-medium tracking-[-0.03em] text-[#252A31]">
                        지금 바로 활용하기
                    </h2>

                    <Link
                        href="/events/promote"
                        className="relative mt-4 flex min-h-24 items-center justify-between overflow-hidden rounded-[18px] bg-[#FFFEFA] py-4 pl-5 pr-4 shadow-[0_1px_2px_rgba(37,42,49,0.035)]"
                    >
                        <span aria-hidden="true" className="absolute inset-y-4 left-0 w-1 rounded-r-full bg-[#F4F54A]" />
                        <span className="min-w-0 pr-4">
                            <span className="block text-[11px] font-medium tracking-[0.02em] text-[#777900]">내 손으로 쉽고 빠르게</span>
                            <span className="mt-1 block text-[17px] font-medium tracking-[-0.04em] text-[#252A31]">홍보물 DIY</span>
                            <span className="mt-1 block break-keep text-[11px] font-normal leading-5 text-[#667067]">행사 홍보물을 직접 만들어보세요.</span>
                        </span>
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F4F54A] text-[#4D4E00]">
                            <ChevronIcon />
                        </span>
                    </Link>

                    <Link href="/resources" className="relative mt-3 flex min-h-24 items-center justify-between overflow-hidden rounded-[18px] bg-[#FFFEFA] py-4 pl-5 pr-4 shadow-[0_1px_2px_rgba(37,42,49,0.035)]">
                        <span aria-hidden="true" className="absolute inset-y-4 left-0 w-1 rounded-r-full bg-[#F4F54A]" />
                        <span className="min-w-0 pr-4">
                            <span className="block text-[11px] font-medium tracking-[0.02em] text-[#777900]">실무에 바로 쓰는 자료</span>
                            <span className="mt-1 block whitespace-nowrap text-[17px] font-medium tracking-[-0.04em] text-[#252A31]">사찰 실무서식 / 자료실</span>
                            <span className="mt-1 block break-keep text-[11px] font-normal leading-5 text-[#667067]">사찰 운영에 필요한 자료를 찾아보세요.</span>
                        </span>
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F4F54A] text-[#4D4E00]">
                            <ChevronIcon />
                        </span>
                    </Link>
                </section>

                <section className="-mx-4 bg-sage-50 px-5 pb-14 pt-12" aria-labelledby="mobile-learn-title">
                    <h2 id="mobile-learn-title" className="text-[22px] font-medium tracking-[-0.04em] text-[#252A31]">
                        읽고 알아가기
                    </h2>

                    <div className="mt-5 space-y-2.5">
                        <Link
                            href="/resources/masters"
                            className="grid h-[116px] grid-cols-[64px_minmax(0,1fr)_36px] items-center gap-3 rounded-[18px] border border-[#E3E1D9] bg-[#FFFDF8] px-4 py-3 shadow-[0_3px_10px_rgba(45,48,40,0.055)]"
                        >
                            <span
                                aria-hidden="true"
                                className="h-16 w-16 bg-contain bg-center bg-no-repeat"
                                style={{ backgroundImage: "url('/images/showcase/yeon-deep-reading-books.webp')" }}
                            />
                            <span className="min-w-0">
                                <span className="block text-[11px] font-medium tracking-[0.02em] text-[#7E8977]">한국불교의 사람들</span>
                                <span className="mt-1 block text-[19px] font-medium tracking-[-0.04em] text-[#252A31]">한국의 고승</span>
                                <span className="mt-1 block break-keep text-xs font-normal leading-5 text-[#667067]">한국불교의 큰스님과 가르침을 알아보세요.</span>
                            </span>
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-[#7E8977]">
                                <ChevronIcon />
                            </span>
                        </Link>

                        <Link
                            href="/stories"
                            className="grid h-[116px] grid-cols-[64px_minmax(0,1fr)_36px] items-center gap-3 rounded-[18px] border border-[#E3E1D9] bg-[#FFFDF8] px-4 py-3 shadow-[0_3px_10px_rgba(45,48,40,0.055)]"
                        >
                            <span className="flex h-16 w-16 items-center justify-center text-[#786B5A]">
                                <OpenBookIcon />
                            </span>
                            <span className="min-w-0">
                                <span className="block text-[11px] font-medium tracking-[0.02em] text-[#7E8977]">마음을 쉬어가는 이야기</span>
                                <span className="mt-1 block text-[19px] font-medium tracking-[-0.04em] text-[#252A31]">부처님 이야기</span>
                                <span className="mt-1 block break-keep text-xs font-normal leading-5 text-[#667067]">잠시 쉬어가며 마음을 돌아보는 이야기입니다.</span>
                            </span>
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-[#7E8977]">
                                <ChevronIcon />
                            </span>
                        </Link>

                        <Link
                            href="/resources"
                            className="grid h-[116px] grid-cols-[64px_minmax(0,1fr)_36px] items-center gap-3 rounded-[18px] border border-[#E3E1D9] bg-[#FFFDF8] px-4 py-3 shadow-[0_3px_10px_rgba(45,48,40,0.055)]"
                        >
                            <span className="flex h-16 w-16 items-center justify-center text-[#786B5A]">
                                <ArchiveDocumentIcon />
                            </span>
                            <span className="min-w-0">
                                <span className="block text-[11px] font-medium tracking-[0.02em] text-[#7E8977]">깊이 알아보는 한국불교</span>
                                <span className="mt-1 block text-[19px] font-medium tracking-[-0.04em] text-[#252A31]">불교자료</span>
                                <span className="mt-1 block break-keep text-xs font-normal leading-5 text-[#667067]">불교와 사찰 생활에 필요한 자료를 모았습니다.</span>
                            </span>
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-[#7E8977]">
                                <ChevronIcon />
                            </span>
                        </Link>
                    </div>
                </section>

                <section className="-mx-4 bg-white px-5 py-12" aria-labelledby="mobile-latest-title">
                    <h2 id="mobile-latest-title" className="text-[18px] font-medium tracking-[-0.03em] text-[#252A31]">
                        새로 올라온 것
                    </h2>
                    <div className="mt-4 space-y-1">
                        {jobs.map((job) => (
                            <Link key={`${job.temple}-${job.title}`} href={`/jobs/${job.id}`} className="flex min-h-16 items-center justify-between gap-4 py-2.5 text-left">
                                <span className="min-w-0 flex-1">
                                    <span className="block truncate text-xs font-normal text-[#8B95A1]">구인 · {job.temple} · {job.location} · {job.date}</span>
                                    <span className="mt-1 block truncate text-[15px] font-medium text-[#252A31]">{job.title}</span>
                                </span>
                                <span className="shrink-0 text-[#A1A99B]">
                                    <ChevronIcon />
                                </span>
                            </Link>
                        ))}
                        {templeStays.map((stay) => (
                            <Link key={stay.name} href={`/temples/stay/${stay.id}`} className="flex min-h-16 items-center justify-between gap-4 py-2.5 text-left">
                                <span className="min-w-0 flex-1">
                                    <span className="block truncate text-xs font-normal text-[#8B95A1]">템플스테이 · {stay.location}</span>
                                    <span className="mt-1 block truncate text-[15px] font-medium text-[#252A31]">{stay.name}</span>
                                </span>
                                <span className="shrink-0 text-[#A1A99B]">
                                    <ChevronIcon />
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="hidden">
                    {menus.map((menu) => (
                        <Link
                            key={menu.title}
                            href={menu.href}
                            className="min-w-0 overflow-hidden rounded-[18px] border border-[#E7E9EC] bg-[#FFFBE0] text-center shadow-[0_2px_8px_rgba(25,31,40,0.035)]"
                        >
                            <span className="block h-2 bg-[#F4F54A]" />

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
                    href="/events/promote"
                    className="hidden"
                >
                    <span
                        aria-hidden="true"
                        className="absolute inset-y-4 left-0 w-[4px] rounded-r-full bg-[#F4F54A]"
                    />

                    <span className="min-w-0 pr-4">
                        <span className="block text-xs font-medium text-[#777900]">
                            내 손으로 쉽고 빠르게
                        </span>
                        <strong className="mt-1 block text-[18px] font-semibold tracking-[-0.03em] text-[#252A31]">
                            홍보물 DIY
                        </strong>
                        <span className="mt-1 block text-xs font-normal text-[#7A818D]">
                            이미지와 채널별 홍보 문구를 한 번에 만들어요
                        </span>
                    </span>

                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F4F54A] text-[#4D4E00] transition group-active:translate-x-0.5">
                        <ChevronIcon />
                    </span>
                </Link>

                <Link
                    href="/stories"
                    className="hidden"
                >
                    <span
                        aria-hidden="true"
                        className="absolute inset-y-4 left-0 w-[4px] rounded-r-full bg-[#F4F54A]"
                    />
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
                                    fill="#F4F54A"
                                    stroke="currentColor"
                                    strokeWidth="1.6"
                                />
                                <path
                                    d="M30.5 40c-4.7-.4-7.2-2.8-7.5-7 4.6.3 7.1 2.7 7.5 7Z"
                                    fill="#F4F54A"
                                    stroke="currentColor"
                                    strokeWidth="1.6"
                                />
                                <path
                                    d="M33.5 40c4.7-.4 7.2-2.8 7.5-7-4.6.3-7.1 2.7-7.5 7Z"
                                    fill="#F4F54A"
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

                <Link
                    href="/resources/masters"
                    className="hidden"
                >
                    <span
                        aria-hidden="true"
                        className="absolute inset-y-3 left-0 w-[4px] rounded-r-full bg-[#F4F54A]"
                    />
                    <span>
                        <span className="block text-xs font-medium text-[#777900]">
                            생애·사상·일화 깊이 읽기
                        </span>
                        <strong className="mt-1 block text-[16px] font-medium text-[#252A31]">
                            한국의 고승
                        </strong>
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#A1A996]">
                        <ChevronIcon />
                    </span>
                </Link>

                <Link
                    href="/resources"
                    className="hidden"
                >
                    <span
                        aria-hidden="true"
                        className="absolute inset-y-3 left-0 w-[4px] rounded-r-full bg-[#F4F54A]"
                    />
                    <span>
                        <span className="block text-xs font-medium text-[#777900]">
                            경전·역사·학술자료
                        </span>
                        <strong className="mt-1 block text-[16px] font-medium">
                            불교자료 찾아보기
                        </strong>
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#A1A996]">
                        <ChevronIcon />
                    </span>
                </Link>

                <section className="hidden">
                    <div className="mb-3 flex items-center justify-between px-1">
                        <h2 className="text-xl font-bold tracking-[-0.035em]">최신 구인</h2>

                        <Link
                            href="/jobs"
                            className="rounded-lg px-2 py-2 text-sm font-medium text-[#8B95A1]"
                        >
                            전체보기
                        </Link>
                    </div>

                    <div className="overflow-hidden rounded-[22px] border border-[#E3E8EF] bg-[#F4F7FA] px-4">
                        {jobs.map((job, index) => (
                            <Link
                                key={`${job.temple}-${job.title}`}
                                href={`/jobs/${job.id}`}
                                className={`flex w-full items-center py-4 text-left ${index !== jobs.length - 1 ? "border-b border-[#F2F4F6]" : ""
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

                                <span className="ml-3 text-xs text-[#667085]">{job.date}</span>

                                <span className="ml-2 text-[#B0B8C1]">
                                    <ChevronIcon />
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="hidden">
                    <div className="mb-3 flex items-center justify-between px-1">
                        <h2 className="text-xl font-bold tracking-[-0.035em]">
                            추천 템플스테이
                        </h2>

                        <Link
                            href="/temples/stay"
                            className="rounded-lg px-2 py-2 text-sm font-medium text-[#8B95A1]"
                        >
                            전체보기
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {templeStays.map((stay) => (
                            <Link
                                key={stay.name}
                                href={`/temples/stay/${stay.id}`}
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
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="hidden">
                    <Link
                        href="/temples/food"
                        className="rounded-[20px] border border-[#E7E9EC] bg-white px-4 py-4 text-left"
                    >
                        <span className="text-xs font-medium text-[#3182F6]">사찰음식</span>
                        <strong className="mt-1 block text-[15px]">
                            우리 사찰음식 보기
                        </strong>
                    </Link>

                    <Link
                        href="/events"
                        className="rounded-[20px] border border-[#E7E9EC] bg-white px-4 py-4 text-left"
                    >
                        <span className="text-xs font-medium text-[#3182F6]">
                            새로운 소식
                        </span>
                        <strong className="mt-1 block text-[15px]">
                            행사 일정 둘러보기
                        </strong>
                    </Link>
                </section>
            </main>

            <footer className="border-t border-[#D9DAD4] bg-white px-5 pb-6 pt-7">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2"
                    aria-label="연 홈"
                >
                    <LotusIcon />
                    <span className="text-lg font-semibold tracking-[-0.04em]">연</span>
                </Link>

                <p className="mt-2 text-[13px] font-normal leading-5 text-[#667085]">
                    <span className="block">연은 개인이 만들고 운영하며,</span>
                    <span className="block">불교 생활에 필요한 정보를 쉽고 가깝게 연결합니다.</span>
                </p>

                <Link
                    href="/support"
                    className="mt-1 inline-block text-[13px] font-medium text-[#2563EB] transition-colors hover:text-[#1D4ED8] hover:underline hover:underline-offset-2"
                >
                    {"후원하기 "}
                </Link>

                <div className="mt-7">
                    <h2 className="text-[13px] font-medium text-[#252A31]">
                        등록 안내
                    </h2>

                    <div className="mt-2 grid grid-cols-2 gap-x-5 text-[13px] font-normal text-[#667085]">
                        <Link href="/jobs/new" className="flex min-h-9 items-center">구인 등록</Link>
                        <Link href="/events/new" className="flex min-h-9 items-center">행사·교육 등록</Link>
                        <Link href="/temples/stay/new" className="flex min-h-9 items-center">템플스테이 등록</Link>
                        <Link href="/temples/food/new" className="flex min-h-9 items-center">사찰음식 등록</Link>
                    </div>
                </div>

                <div className="mt-7">
                    <h2 className="text-[13px] font-medium text-[#252A31]">문의하기</h2>
                    <a
                        href="mailto:bcrow1102@gmail.com"
                        className="mt-2 flex min-h-11 flex-col justify-center text-xs font-normal"
                    >
                        <span className="text-[#252A31]">이메일 문의</span>
                        <span className="mt-0.5 text-[#2563EB]">bcrow1102@gmail.com</span>
                    </a>

                    <div className="mt-2.5 grid gap-2.5">
                        <a
                            href="https://open.kakao.com/o/sulQHJGi"
                            target="_blank"
                            rel="noreferrer"
                            className="relative flex min-h-16 items-center gap-2.5 rounded-[8px] border border-[#E7E9EC] bg-[#FFFEFA] py-2.5 pl-3.5 pr-11 text-left text-[#252A31]"
                        >
                            <KakaoIcon />
                            <span className="min-w-0 flex-1">
                                <span className="block text-[13px] font-medium">카카오톡 문의</span>
                                <span className="mt-0.5 block text-[11px] font-normal text-[#667085]">오픈채팅으로 상담하세요</span>
                            </span>
                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8B95A1]">
                                <FooterArrowIcon />
                            </span>
                        </a>

                        <a
                            href="sms:01057861556"
                            className="relative flex min-h-16 items-center gap-2.5 rounded-[8px] border border-[#E7E9EC] bg-[#FFFEFA] py-2.5 pl-3.5 pr-11 text-left text-[#252A31]"
                        >
                            <MessageIcon />
                            <span className="min-w-0 flex-1">
                                <span className="block text-[13px] font-medium">문자 문의</span>
                                <span className="mt-0.5 block text-[11px] font-normal text-[#667085]">궁금한 내용을 보내주세요</span>
                            </span>
                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8B95A1]">
                                <FooterArrowIcon />
                            </span>
                        </a>
                    </div>
                </div>

                <div className="mt-6 border-t border-[#E7E9EC] pt-4 text-[11px] font-normal text-[#8B95A1]">
                    <p>© 2026 연. All rights reserved.</p>
                    <p className="mt-1">불교 정보와 사람을 잇는 공간</p>
                </div>
            </footer>
        </div>
    );
}
