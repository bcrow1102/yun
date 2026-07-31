"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import JobCard from "@/app/components/JobCard";
import TempleStayCard from "@/app/components/TempleStayCard";
import BottomNav from "@/app/components/BottomNav";
import MobileHome from "@/app/components/MobileHome";

const mainMenus = [
  "구인",
  "구직",
  "행사·교육",
  "사찰",
  "부처님 이야기",
];

const heroSlides = [
  {
    eyebrow: "연이 소개하는 템플스테이",
    title: "마음이 쉬어가는 시간\n템플스테이를 만나보세요",
    description: "고요한 사찰에서 잠시 머물며 일상에 지친 마음을 편안하게 쉬어보세요.",
    href: "/temples/stay",
    action: "템플스테이 둘러보기",
    image: "/images/hero/temple-stay-novice.webp",
    background: "bg-[#F4EFE3]",
    textColor: "text-[#28241E]",
    descriptionColor: "text-[#665E52]",
  },
  {
    eyebrow: "산사 문화행사",
    title: "별빛 아래 만나는\n산사의 음악",
    description: "고요한 산사에서 음악과 이야기가 함께하는\n특별한 문화행사를 만나보세요.",
    href: "/events",
    action: "행사 둘러보기",
    image: "/images/hero/temple-concert.webp",
    overlay: "bg-gradient-to-r from-[#FFF8EA]/60 via-[#FFF8EA]/18 to-transparent",
    background: "bg-[#F4E9D5]",
    textColor: "text-[#29251F]",
    descriptionColor: "text-[#5E574C]",
    descriptionShadow: "light",
  },
  {
    eyebrow: "연이 소개하는 사찰음식",
    title: "자연을 담은 한 상\n사찰음식을 만나보세요",
    description: "제철 재료로 정성껏 차린 사찰음식과\n다양한 체험 프로그램을 만나보세요.",
    href: "/temples/food",
    action: "사찰음식 둘러보기",
    image: "/images/hero/temple-food-real.webp",
    overlay: "bg-gradient-to-r from-[#FFFDF8]/60 via-[#FFFDF8]/18 to-transparent",
    background: "bg-[#F3EBDD]",
    textColor: "text-[#29251F]",
    descriptionColor: "text-[#5E574C]",
    descriptionShadow: "light",
  },
];

const latestJobs = [
  {
    id: 1,
    temple: "조계사",
    title: "사무행정 담당자 모집",
    location: "서울 종로구",
    date: "~07.31",
    tag: "정규직",
  },
  {
    id: 2,
    temple: "해인사",
    title: "문화해설 자원봉사자",
    location: "경남 합천",
    date: "~08.15",
    tag: "봉사",
  },
  {
    id: 3,
    temple: "불국사",
    title: "템플스테이 코디네이터",
    location: "경북 경주",
    date: "~08.05",
    tag: "계약직",
  },
];

const recommendedTempleStays = [
  {
    id: 1,
    name: "월정사 숲속 힐링",
    location: "강원 평창",
    duration: "1박 2일",
    price: "50,000원",
    rating: 4.8,
    image: "/images/temple-stay/woljeongsa-forest.webp",
  },
  {
    id: 2,
    name: "해인사 명상 수련",
    location: "경남 합천",
    duration: "2박 3일",
    price: "80,000원",
    rating: 4.9,
    image: "/images/temple-stay/haeinsa-meditation.webp",
  },
  {
    id: 3,
    name: "통도사 체험형",
    location: "경남 양산",
    duration: "당일",
    price: "30,000원",
    rating: 4.7,
    image: "/images/temple-stay/tongdosa-experience.webp",
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

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <path
        d="M5 12h14m-5-5 5 5-5 5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Home() {
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
    if ((event.target as HTMLElement).closest("a")) {
      pointerStartX.current = null;
      didDrag.current = false;
      return;
    }

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
    <>
      <MobileHome />

      <div className="hidden min-h-screen bg-white pb-20 text-[#252A31] md:block">
        <header className="sticky top-0 z-30 border-b border-[#F2F4F6] bg-white/95 backdrop-blur">
          <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-8">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#FEE500] text-[#191F28]">
                <LotusIcon />
              </span>

              <strong className="text-[22px] font-bold tracking-[-0.04em]">
                연
              </strong>
            </div>

            <nav className="flex items-center gap-1" aria-label="주요 메뉴">
              {mainMenus.map((menu) => {
                if (menu === "구인") {
                  return (
                    <Link
                      key={menu}
                      href="/jobs"
                      className="rounded-xl px-3 py-2.5 text-sm font-semibold text-[#4E5968] transition hover:bg-[#FFF9C4] hover:text-[#191F28]"
                    >
                      {menu}
                    </Link>
                  );
                }

                if (menu === "사찰") {
                  return (
                    <div
                      key={menu}
                      className="group relative"
                    >
                      <button className="rounded-xl px-3 py-2.5 text-sm font-semibold text-[#4E5968] transition hover:bg-[#FFF9C4] hover:text-[#191F28]">
                        사찰
                      </button>

                      <div className="invisible absolute left-1/2 top-full z-50 w-44 -translate-x-1/2 pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                        <div className="overflow-hidden rounded-2xl border border-[#E7E9EC] bg-white p-2 shadow-[0_12px_30px_rgba(25,31,40,0.12)]">
                          <button className="block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-[#4E5968] hover:bg-[#FFF9C4]">
                            사찰 안내
                          </button>

                          <button className="block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-[#4E5968] hover:bg-[#FFF9C4]">
                            템플스테이
                          </button>

                          <button className="block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-[#4E5968] hover:bg-[#FFF9C4]">
                            사찰음식
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }

                if (menu === "부처님 이야기") {
                  return (
                    <Link
                      key={menu}
                      href="/stories"
                      className="rounded-xl px-3 py-2.5 text-sm font-semibold text-[#4E5968] transition hover:bg-[#FFF9C4] hover:text-[#191F28]"
                    >
                      {menu}
                    </Link>
                  );
                }

                return (
                  <button
                    key={menu}
                    className="rounded-xl px-3 py-2.5 text-sm font-semibold text-[#4E5968] transition hover:bg-[#FFF9C4] hover:text-[#191F28]"
                  >
                    {menu}
                  </button>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <button className="px-2 py-2 text-xs font-bold">KR</button>

              <button className="px-2 py-2 text-xs text-[#8B95A1]">
                EN
              </button>

              <button
                className="flex h-10 w-10 items-center justify-center rounded-full text-[#333D4B] transition hover:bg-[#F2F4F6]"
                aria-label="검색"
              >
                <SearchIcon />
              </button>

              <button className="ml-1 rounded-xl bg-[#FEE500] px-4 py-2.5 text-sm font-bold text-[#191F28]">
                로그인
              </button>
            </div>
          </div>
        </header>

        <main>
          <section
            className="relative cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing"
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
                <article
                  key={slide.title}
                  className={`${slide.background} ${slide.textColor} relative block w-full shrink-0 overflow-hidden`}
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
                          : "bg-gradient-to-r from-[#FFFDF8]/60 via-[#FFFDF8]/18 to-transparent"
                          }`}
                        aria-hidden="true"
                      />
                    </>
                  )}

                  <div className="relative mx-auto grid min-h-[390px] max-w-6xl grid-cols-[1fr_0.7fr] items-center gap-16 px-8 py-14">
                    <div className="max-w-[610px]">
                      <p className="text-base font-semibold opacity-75">
                        {slide.eyebrow}
                      </p>

                      <h1 className="mt-3 whitespace-pre-line text-[50px] font-semibold leading-[1.14] tracking-[-0.05em]">
                        {slide.title}
                      </h1>

                      <p
                        className={`mt-5 max-w-[500px] whitespace-pre-line text-[16px] leading-7 ${slide.descriptionColor} ${"descriptionShadow" in slide
                          ? slide.descriptionShadow === "light"
                            ? "[text-shadow:0_1px_3px_rgba(255,255,255,0.95)]"
                            : "[text-shadow:0_1px_3px_rgba(0,0,0,0.8)]"
                          : ""
                          }`}
                      >
                        {slide.description}
                      </p>

                      <Link
                        href={slide.href}
                        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#191F28] px-5 py-3.5 text-sm font-semibold text-white"
                        onClick={(event) => {
                          if (didDrag.current) event.preventDefault();
                        }}
                      >
                        {slide.action}
                        <ArrowIcon />
                      </Link>
                    </div>

                    {"icon" in slide && (
                      <div className="flex items-center justify-center text-[132px]" aria-hidden="true">
                        {slide.icon}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>

            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.title}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  className={`h-2.5 rounded-full transition-all ${activeSlide === index
                    ? "w-8 bg-[#191F28]"
                    : "w-2.5 bg-[#191F28]/25"
                    }`}
                  aria-label={`${index + 1}번째 소식 보기`}
                />
              ))}
            </div>
          </section>

          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 px-8 py-14">
            <section aria-label="최신 구인 정보">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-[24px] font-bold tracking-[-0.04em]">
                  최신 구인
                </h2>

                <button className="text-sm font-semibold text-[#8B95A1] transition hover:text-[#191F28]">
                  전체보기
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {latestJobs.map((job, index) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    delay={index * 0.08}
                  />
                ))}
              </div>
            </section>

            <section aria-label="추천 템플스테이">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-[24px] font-bold tracking-[-0.04em]">
                  추천 템플스테이
                </h2>

                <button className="text-sm font-semibold text-[#8B95A1] transition hover:text-[#191F28]">
                  전체보기
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 pb-3">
                {recommendedTempleStays.map((stay, index) => (
                  <TempleStayCard
                    key={stay.id}
                    stay={stay}
                    delay={index * 0.08}
                  />
                ))}
              </div>
            </section>
          </div>
        </main>
      </div >

      <div className="md:hidden">
        <BottomNav />
      </div>
    </>
  );
}
