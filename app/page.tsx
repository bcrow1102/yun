"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/app/components/BottomNav";
import MobileHome from "@/app/components/MobileHome";

const quickMenus = [
  {
    title: "구인",
    description: "불교계 채용 정보를 한눈에",
    href: "/jobs",
    image: "/images/menu/hire.webp",
  },
  {
    title: "행사·교육",
    description: "다양한 행사와 교육 일정",
    href: "/events",
    image: "/images/menu/event-education.webp",
  },
  {
    title: "사찰",
    description: "사찰 안내와 템플스테이",
    href: "/temples/guide",
    image: "/images/menu/experience.webp",
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
];

const recommendedTempleStays = [
  {
    id: 1,
    name: "월정사 숲속 힐링",
    location: "강원 평창",
    image: "/images/temple-stay/woljeongsa-forest.webp",
  },
  {
    id: 2,
    name: "해인사 명상 수련",
    location: "경남 합천",
    image: "/images/temple-stay/haeinsa-meditation.webp",
  },
];

const featureSlides = [
  {
    eyebrow: "마음이 쉬어가는 시간",
    title: "고요한 산사에서\n나를 만나는 하루",
    description:
      "잠시 일상에서 벗어나 사찰의 고요함 속에서\n몸과 마음을 편안하게 쉬어보세요.",
    href: "/temples/stay",
    action: "템플스테이 둘러보기",
    image: "/images/hero/temple-stay-novice.webp",
    imageAlt: "템플스테이를 안내하는 동자승",
  },
  {
    eyebrow: "산사에서 만나는 문화",
    title: "연등 아래 이어지는\n음악과 배움의 시간",
    description:
      "음악회와 강좌, 다양한 문화 프로그램으로\n사찰을 더욱 가깝게 만나보세요.",
    href: "/events",
    action: "행사·교육 둘러보기",
    image: "/images/hero/temple-concert.webp",
    imageAlt: "연등 아래 열리는 산사 문화행사",
  },
  {
    eyebrow: "자연을 담은 한 상",
    title: "계절의 맛을 살린\n정갈한 사찰음식",
    description:
      "제철 재료로 차린 사찰음식과 체험 프로그램을\n연에서 편안하게 찾아보세요.",
    href: "/temples/food",
    action: "사찰음식 둘러보기",
    image: "/images/hero/temple-food-real.webp",
    imageAlt: "정갈하게 차린 사찰음식",
  },
];

const HERO_SLIDE_COUNT = featureSlides.length + 1;

function LotusIcon({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className}>
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

function SearchIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className={className}
    >
      <path
        d="M5 12h14m-5-5 5 5-5 5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BookLotusIcon({ className = "h-24 w-28" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 88" fill="none" className={className}>
      <path
        d="M14 21c15-4 29-1 42 8v42c-13-9-27-12-42-8V21Z"
        fill="#FFFDF2"
        stroke="#756F64"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M106 21c-15-4-29-1-42 8v42c13-9 27-12 42-8V21Z"
        fill="#FFFDF2"
        stroke="#756F64"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M60 30v41" stroke="#756F64" strokeWidth="2" />
      <path
        d="M60 67c-8-5-10-11 0-20 10 9 8 15 0 20Z"
        fill="#F4F54A"
        stroke="#9A8D16"
        strokeWidth="1.5"
      />
      <path
        d="M58 68c-10 0-15-4-16-12 9 0 14 4 16 12Zm4 0c10 0 15-4 16-12-9 0-14 4-16 12Z"
        fill="#FFF5A6"
        stroke="#9A8D16"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function KakaoIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
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
      className="h-8 w-8"
      aria-hidden="true"
    >
      <path d="M6 7.5h20v15H14l-6 4v-4H6v-15Z" strokeLinejoin="round" />
      <path
        d="M11 14.8h.1m4.9 0h.1m4.9 0h.1"
        strokeLinecap="round"
        strokeWidth="2.6"
      />
    </svg>
  );
}

function InkWash() {
  return (
    <svg
      viewBox="0 0 900 360"
      className="pointer-events-none absolute bottom-[-18px] left-[12%] h-[340px] w-[900px]"
      aria-hidden="true"
    >
      <defs>
        <filter id="ink-soft">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
        <filter id="ink-spread">
          <feGaussianBlur stdDeviation="10" />
        </filter>
        <linearGradient id="far-mountain" x1="0" x2="1">
          <stop offset="0" stopColor="#D8DED6" stopOpacity="0" />
          <stop offset="0.18" stopColor="#CBD4CB" stopOpacity="0.72" />
          <stop offset="0.72" stopColor="#B7C3B8" stopOpacity="0.68" />
          <stop offset="1" stopColor="#AEBBAF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="middle-mountain" x1="0" x2="1">
          <stop offset="0" stopColor="#879389" stopOpacity="0" />
          <stop offset="0.22" stopColor="#78857C" stopOpacity="0.42" />
          <stop offset="0.72" stopColor="#5E6C64" stopOpacity="0.38" />
          <stop offset="1" stopColor="#526059" stopOpacity="0" />
        </linearGradient>
      </defs>

      <path
        d="M6 296c72-18 112-51 151-92 30-31 61-35 94-14 29 19 46 61 78 55 34-7 48-75 92-111 37-31 71-18 91 22 24 48 42 93 88 91 40-2 62-54 105-61 38-7 67 18 91 52 23 33 47 46 84 31 36-14 66-6 114 25v43H6v-41Z"
        fill="url(#far-mountain)"
        filter="url(#ink-soft)"
      />

      <path
        d="M0 326c61-6 100-19 141-49 38-28 69-24 106 10 29 27 61 30 94 8 30-20 48-54 79-64 35-11 62 17 89 47 32 36 66 47 105 17 46-36 76-38 116-2 29 26 56 31 91 12 28-15 50-17 79-9v49H0v-19Z"
        fill="url(#middle-mountain)"
        filter="url(#ink-soft)"
      />

      <path
        d="M18 350c84-31 148-21 214-10 73 12 118 7 167-12 55-21 98-14 143 3 54 21 92 15 141-8 58-28 117-15 199 10v27H18v-10Z"
        fill="#34423B"
        opacity="0.14"
        filter="url(#ink-spread)"
      />

      <circle cx="515" cy="78" r="18" fill="#FFF3A6" opacity="0.9" />
    </svg>
  );
}

export default function Home() {
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const heroPointerStartX = useRef<number | null>(null);
  const heroDidDrag = useRef(false);
  const [keyword, setKeyword] = useState("");
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [storyPopupOpen, setStoryPopupOpen] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setActiveHeroSlide((current) => (current + 1) % HERO_SLIDE_COUNT);
    }, 6000);

    return () => window.clearTimeout(timer);
  }, [activeHeroSlide]);

  const handleHeroPointerDown = (event: PointerEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest("button, input, form")) {
      heroPointerStartX.current = null;
      heroDidDrag.current = false;
      return;
    }

    heroPointerStartX.current = event.clientX;
    heroDidDrag.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleHeroPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (heroPointerStartX.current === null) return;

    if (Math.abs(event.clientX - heroPointerStartX.current) > 10) {
      heroDidDrag.current = true;
    }
  };

  const handleHeroPointerUp = (event: PointerEvent<HTMLElement>) => {
    if (heroPointerStartX.current === null) return;

    const distance = event.clientX - heroPointerStartX.current;
    heroPointerStartX.current = null;

    if (Math.abs(distance) >= 45) {
      setActiveHeroSlide((current) =>
        distance < 0
          ? (current + 1) % HERO_SLIDE_COUNT
          : (current - 1 + HERO_SLIDE_COUNT) % HERO_SLIDE_COUNT,
      );
    }

    window.setTimeout(() => {
      heroDidDrag.current = false;
    }, 80);
  };

  const handleHeroPointerCancel = () => {
    heroPointerStartX.current = null;
    heroDidDrag.current = false;
  };

  const handleHeroClickCapture = (event: MouseEvent<HTMLElement>) => {
    if (!heroDidDrag.current) return;

    event.preventDefault();
    event.stopPropagation();
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const query = keyword.trim();
    if (!query) {
      searchInputRef.current?.focus();
      return;
    }

    const encoded = encodeURIComponent(query);

    if (/부처|이야기|법문/.test(query)) {
      router.push("/stories");
      return;
    }

    if (/음식|공양|사찰음식/.test(query)) {
      router.push("/temples/food");
      return;
    }

    if (/템플|사찰|절|명상/.test(query)) {
      router.push("/temples/stay");
      return;
    }

    if (/행사|교육|음악회|강좌/.test(query)) {
      router.push(`/events?keyword=${encoded}`);
      return;
    }

    router.push(`/jobs?keyword=${encoded}`);
  };

  return (
    <>
      <MobileHome />

      <div className="hidden min-h-screen bg-white text-[#191F28] md:block">
        <header className="sticky top-0 z-50 border-b border-[#F0F1F2] bg-white/95 backdrop-blur">
          <div className="mx-auto flex h-[76px] max-w-[1400px] items-center justify-between px-10 xl:px-14">
            <Link
              href="/"
              className="flex items-center gap-2.5"
              aria-label="연 홈"
            >
              <span className="text-[#191F28]">
                <LotusIcon className="h-9 w-9" />
              </span>
              <span className="text-[25px] font-semibold tracking-[-0.05em]">
                연
              </span>
            </Link>

            <nav className="flex items-center gap-7" aria-label="주요 메뉴">
              <Link
                href="/jobs"
                className="text-[15px] font-medium hover:text-[#777900]"
              >
                구인
              </Link>
              <Link
                href="/events"
                className="text-[15px] font-medium hover:text-[#777900]"
              >
                행사·교육
              </Link>

              <div className="group relative">
                <button
                  type="button"
                  className="py-5 text-[15px] font-medium hover:text-[#777900]"
                >
                  사찰
                </button>
                <div className="invisible absolute left-1/2 top-full z-50 w-44 -translate-x-1/2 pt-1 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="rounded-2xl border border-[#E7E9EC] bg-white p-2 shadow-[0_16px_40px_rgba(25,31,40,0.12)]">
                    <Link
                      href="/temples/guide"
                      className="block rounded-xl px-4 py-3 text-sm hover:bg-[#FFFED7]"
                    >
                      사찰 안내
                    </Link>
                    <Link
                      href="/temples/stay"
                      className="block rounded-xl px-4 py-3 text-sm hover:bg-[#FFFED7]"
                    >
                      템플스테이
                    </Link>
                    <Link
                      href="/temples/food"
                      className="block rounded-xl px-4 py-3 text-sm hover:bg-[#FFFED7]"
                    >
                      사찰음식
                    </Link>
                  </div>
                </div>
              </div>

              <Link
                href="/stories"
                className="text-[15px] font-medium hover:text-[#777900]"
              >
                부처님 이야기
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setActiveHeroSlide(0);
                  window.setTimeout(() => searchInputRef.current?.focus(), 750);
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#F5F6F7]"
                aria-label="검색창으로 이동"
              >
                <SearchIcon />
              </button>
              <button type="button" className="px-2 py-2 text-xs font-medium">
                KR
              </button>
              <button
                type="button"
                className="px-1 py-2 text-xs text-[#98A1AC]"
              >
                EN
              </button>
              <button
                type="button"
                className="ml-1 rounded-xl border border-[#DDE1E5] px-4 py-2.5 text-sm font-medium hover:border-[#AEB5BC]"
              >
                로그인
              </button>
            </div>
          </div>
        </header>

        <main>
          <section
            className="relative cursor-grab touch-pan-y select-none overflow-hidden border-b border-[#F3F4F5] active:cursor-grabbing"
            aria-label="주요 소식"
            onPointerDown={handleHeroPointerDown}
            onPointerMove={handleHeroPointerMove}
            onPointerUp={handleHeroPointerUp}
            onPointerCancel={handleHeroPointerCancel}
            onClickCapture={handleHeroClickCapture}
          >
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${activeHeroSlide * 100}%)` }}
            >
              <article className="relative w-full shrink-0">
                <InkWash />

                <div className="relative mx-auto grid min-h-[560px] max-w-[1400px] grid-cols-[0.94fr_1.06fr] items-center gap-12 px-10 py-12 xl:gap-16 xl:px-14">
                  <div className="relative z-10 max-w-[610px]">
                    <p className="text-[15px] font-normal tracking-[-0.02em] text-[#4E5968]">
                      불교 생활을 더 가까이
                    </p>
                    <span className="mt-3 block h-[3px] w-16 rounded-full bg-[#F4F54A]" />

                    <h1 className="mt-7 text-[54px] font-semibold leading-[1.14] tracking-[-0.055em] xl:text-[62px]">
                      필요한 불교 정보를
                      <br />
                      가볍게 만나보세요
                    </h1>

                    <p className="mt-6 text-[17px] font-normal leading-8 text-[#667085]">
                      구인부터 행사와 교육, 사찰 안내와 부처님 이야기까지
                      <br />
                      지금 필요한 정보를 한곳에서 만나보세요.
                    </p>

                    <form
                      onSubmit={handleSearch}
                      className="relative mt-8 max-w-[570px]"
                    >
                      <SearchIcon className="pointer-events-none absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2 text-[#4E5968]" />
                      <input
                        ref={searchInputRef}
                        value={keyword}
                        onChange={(event) => setKeyword(event.target.value)}
                        type="search"
                        placeholder="구인, 행사·교육, 사찰 정보를 검색해보세요"
                        className="h-[62px] w-full rounded-2xl border border-[#DDE1E5] bg-white pl-14 pr-16 text-[16px] font-normal text-[#191F28] shadow-[0_8px_30px_rgba(25,31,40,0.06)] outline-none placeholder:text-[#98A1AC] focus:border-[#B9BA28] focus:ring-4 focus:ring-[#F4F54A]/20"
                        aria-label="통합검색"
                      />
                      <button
                        type="submit"
                        className="absolute right-2.5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl bg-[#F4F54A] text-[#191F28] transition hover:bg-[#E8EA35]"
                        aria-label="검색하기"
                      >
                        <ArrowIcon />
                      </button>
                    </form>

                    <div className="mt-4 flex items-center gap-3 text-[13px] font-normal text-[#8B95A1]">
                      <span>추천</span>
                      <button
                        type="button"
                        onClick={() => setKeyword("템플스테이")}
                        className="hover:text-[#191F28]"
                      >
                        템플스테이
                      </button>
                      <button
                        type="button"
                        onClick={() => setKeyword("산사 음악회")}
                        className="hover:text-[#191F28]"
                      >
                        산사 음악회
                      </button>
                      <button
                        type="button"
                        onClick={() => setKeyword("사찰 구인")}
                        className="hover:text-[#191F28]"
                      >
                        사찰 구인
                      </button>
                    </div>
                  </div>

                  <div className="relative z-10 grid h-[455px] grid-cols-[1.04fr_1fr_0.92fr] items-center gap-4">
                    <Link
                      href="/temples/stay"
                      className="group relative block h-[420px] cursor-pointer overflow-hidden rounded-[32px] transition-all duration-300 ease-out hover:z-20 hover:-translate-y-3 hover:scale-[1.035] hover:shadow-[0_26px_55px_rgba(25,31,40,0.28)] hover:ring-4 hover:ring-[#F4F54A]/80"
                      aria-label="템플스테이 둘러보기"
                    >
                      <img
                        src="/images/hero/hero-temple.webp"
                        alt="산과 전각이 어우러진 사찰"
                        draggable={false}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute inset-0 bg-gradient-to-t from-[#191F28]/55 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                      <span className="absolute bottom-5 left-5 flex translate-y-2 items-center gap-2 text-sm font-medium text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        템플스테이
                        <ArrowIcon className="h-4 w-4" />
                      </span>
                    </Link>

                    <Link
                      href="/events"
                      className="group relative block h-[455px] cursor-pointer overflow-hidden rounded-[32px] transition-all duration-300 ease-out hover:z-20 hover:-translate-y-3 hover:scale-[1.035] hover:shadow-[0_26px_55px_rgba(25,31,40,0.28)] hover:ring-4 hover:ring-[#F4F54A]/80"
                      aria-label="행사와 교육 둘러보기"
                    >
                      <img
                        src="/images/hero/hero-event.webp"
                        alt="연등 아래 열리는 산사 문화행사"
                        draggable={false}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute inset-0 bg-gradient-to-t from-[#191F28]/55 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                      <span className="absolute bottom-5 left-5 flex translate-y-2 items-center gap-2 text-sm font-medium text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        행사·교육
                        <ArrowIcon className="h-4 w-4" />
                      </span>
                    </Link>

                    <Link
                      href="/temples/food"
                      className="group relative block h-[390px] cursor-pointer overflow-hidden rounded-[32px] transition-all duration-300 ease-out hover:z-20 hover:-translate-y-3 hover:scale-[1.035] hover:shadow-[0_26px_55px_rgba(25,31,40,0.28)] hover:ring-4 hover:ring-[#F4F54A]/80"
                      aria-label="사찰음식 둘러보기"
                    >
                      <img
                        src="/images/hero/hero-food.webp"
                        alt="정갈하게 차린 사찰음식"
                        draggable={false}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute inset-0 bg-gradient-to-t from-[#191F28]/55 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                      <span className="absolute bottom-5 left-5 flex translate-y-2 items-center gap-2 text-sm font-medium text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        사찰음식
                        <ArrowIcon className="h-4 w-4" />
                      </span>
                    </Link>

                    {storyPopupOpen && (
                      <div className="group absolute -bottom-7 right-0 z-20 w-[410px] rounded-[28px] border border-[#E1E6DC] bg-[#F4F7F0] shadow-[0_18px_50px_rgba(25,31,40,0.13)] transition-all duration-300 hover:-translate-y-1 hover:border-[#CFD6C8] hover:shadow-[0_24px_55px_rgba(25,31,40,0.18)]">
                        <button
                          type="button"
                          onClick={() => setStoryPopupOpen(false)}
                          className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/85 text-[17px] font-light text-[#8B95A1] transition hover:bg-white hover:text-[#191F28]"
                          aria-label="부처님 이야기 알림 닫기"
                        >
                          ×
                        </button>

                        <Link
                          href="/stories"
                          className="flex min-h-[118px] items-center gap-4 px-6 py-5 pr-7"
                          aria-label="부처님 이야기 보러 가기"
                        >
                          <span className="flex h-[72px] w-[78px] shrink-0 items-center justify-center">
                            <BookLotusIcon className="h-[66px] w-[74px]" />
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className="block text-[13px] font-medium text-[#958438]">
                              마음을 쉬어가는 이야기
                            </span>
                            <strong className="mt-1 block text-[21px] font-semibold tracking-[-0.035em] text-[#191F28]">
                              부처님 이야기
                            </strong>
                          </span>

                          <span className="mr-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-[#8B95A1] shadow-[0_6px_16px_rgba(25,31,40,0.06)] transition duration-300 group-hover:translate-x-1 group-hover:text-[#191F28]">
                            <ArrowIcon className="h-5 w-5" />
                          </span>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </article>

              {featureSlides.map((slide) => (
                <article
                  key={slide.title}
                  className="relative w-full shrink-0 overflow-hidden bg-[#F6F4EC]"
                >
                  <img
                    src={slide.image}
                    alt={slide.imageAlt}
                    draggable={false}
                    className="absolute inset-0 h-full w-full object-cover object-center"
                  />
                  <span
                    className="absolute inset-y-0 left-0 w-[52%] bg-[linear-gradient(90deg,rgba(255,255,255,0.90)_0%,rgba(255,255,255,0.74)_50%,rgba(255,255,255,0.20)_82%,rgba(255,255,255,0)_100%)]"
                    aria-hidden="true"
                  />

                  <div className="relative mx-auto flex min-h-[560px] max-w-[1400px] items-center px-10 py-12 xl:px-14">
                    <div className="max-w-[590px]">
                      <p className="text-[15px] font-medium tracking-[-0.02em] text-[#4E5968]">
                        {slide.eyebrow}
                      </p>
                      <span className="mt-3 block h-[3px] w-16 rounded-full bg-[#F4F54A]" />

                      <h2 className="mt-7 whitespace-pre-line text-[54px] font-semibold leading-[1.14] tracking-[-0.055em] text-[#191F28] xl:text-[60px]">
                        {slide.title}
                      </h2>

                      <p className="mt-6 whitespace-pre-line text-[17px] font-normal leading-8 text-[#4E5968]">
                        {slide.description}
                      </p>

                      <Link
                        href={slide.href}
                        className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-[#191F28] px-6 py-4 text-[15px] font-medium text-white transition hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(25,31,40,0.20)]"
                      >
                        {slide.action}
                        <ArrowIcon className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/80 px-3 py-2 shadow-[0_8px_20px_rgba(25,31,40,0.08)] backdrop-blur">
              {Array.from({ length: HERO_SLIDE_COUNT }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveHeroSlide(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${activeHeroSlide === index
                      ? "w-8 bg-[#191F28]"
                      : "w-2.5 bg-[#191F28]/25 hover:bg-[#191F28]/45"
                    }`}
                  aria-label={`${index + 1}번째 소식 보기`}
                />
              ))}
            </div>
          </section>

          <section
            className="mx-auto max-w-[1400px] px-10 py-9 xl:px-14"
            aria-label="주요 서비스"
          >
            <div className="grid grid-cols-4 gap-5">
              {quickMenus.map((menu) => (
                <Link
                  key={menu.title}
                  href={menu.href}
                  className="group relative overflow-hidden rounded-[24px] border border-[#E8E99C] bg-[#FFFED7] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(25,31,40,0.10)]"
                >
                  <span className="absolute inset-x-0 top-0 h-1 bg-[#F4F54A]" />
                  <span className="flex h-[102px] items-center justify-center">
                    <img
                      src={menu.image}
                      alt=""
                      className="h-full w-[132px] object-contain"
                    />
                  </span>
                  <span className="mt-3 flex items-end justify-between gap-3">
                    <span>
                      <strong className="block text-[20px] font-semibold tracking-[-0.03em]">
                        {menu.title}
                      </strong>
                      <span className="mt-1 block text-[13px] font-normal text-[#667085]">
                        {menu.description}
                      </span>
                    </span>
                    <ArrowIcon className="h-5 w-5 shrink-0 text-[#9A9B16] transition group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}

              <Link
                href="/stories"
                className="group relative overflow-hidden rounded-[24px] border border-[#E8E99C] bg-[#FFFED7] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(25,31,40,0.10)]"
              >
                <span className="absolute inset-x-0 top-0 h-1 bg-[#F4F54A]" />
                <span className="flex h-[102px] items-center justify-center">
                  <BookLotusIcon className="h-[92px] w-[132px]" />
                </span>
                <span className="mt-3 flex items-end justify-between gap-3">
                  <span>
                    <strong className="block text-[20px] font-semibold tracking-[-0.03em]">
                      부처님 이야기
                    </strong>
                    <span className="mt-1 block text-[13px] font-normal text-[#667085]">
                      삶을 비추는 지혜와 이야기
                    </span>
                  </span>
                  <ArrowIcon className="h-5 w-5 shrink-0 text-[#9A9B16] transition group-hover:translate-x-1" />
                </span>
              </Link>
            </div>
          </section>

          <section
            className="mx-auto max-w-[1400px] px-10 pb-16 xl:px-14"
            aria-label="새로운 소식"
          >
            <div className="grid grid-cols-[1.05fr_0.82fr_1.15fr] overflow-hidden rounded-[24px] border border-[#E7E9EC] bg-white">
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">추천 구인</h2>
                  <Link
                    href="/jobs"
                    className="text-sm font-normal text-[#8B95A1] hover:text-[#191F28]"
                  >
                    전체보기
                  </Link>
                </div>
                <div className="space-y-2.5">
                  {latestJobs.map((job) => (
                    <Link
                      key={job.id}
                      href={`/jobs/${job.id}`}
                      className="flex items-center justify-between rounded-2xl border border-[#ECEEF0] p-4 transition hover:border-[#D8DA72] hover:bg-[#FFFFF0]"
                    >
                      <span className="min-w-0">
                        <span className="text-xs font-normal text-[#667085]">
                          {job.temple} · {job.location}
                        </span>
                        <strong className="mt-1 block truncate text-[15px] font-medium">
                          {job.title}
                        </strong>
                      </span>
                      <span className="ml-4 shrink-0 rounded-lg bg-[#F4F54A] px-2 py-1 text-xs font-medium">
                        {job.date}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="border-x border-[#E7E9EC] p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">다가오는 행사</h2>
                  <Link
                    href="/events"
                    className="text-sm font-normal text-[#8B95A1] hover:text-[#191F28]"
                  >
                    전체보기
                  </Link>
                </div>
                <Link
                  href="/events/temple-concert"
                  className="group block overflow-hidden rounded-2xl border border-[#ECEEF0]"
                >
                  <img
                    src="/images/hero/hero-event.webp"
                    alt="산사 문화행사"
                    className="h-[105px] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                  <span className="block p-4">
                    <strong className="block text-[15px] font-medium">
                      연등 아래 산사 음악회
                    </strong>
                    <span className="mt-1 block text-xs font-normal text-[#667085]">
                      문화행사 · 연화사
                    </span>
                  </span>
                </Link>
              </div>

              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">추천 템플스테이</h2>
                  <Link
                    href="/temples/stay"
                    className="text-sm font-normal text-[#8B95A1] hover:text-[#191F28]"
                  >
                    전체보기
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {recommendedTempleStays.map((stay) => (
                    <Link
                      key={stay.id}
                      href={`/temples/stay/${stay.id}`}
                      className="group overflow-hidden rounded-2xl border border-[#ECEEF0]"
                    >
                      <img
                        src={stay.image}
                        alt={stay.name}
                        className="h-[105px] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                      <span className="block p-3.5">
                        <strong className="block text-[14px] font-medium">
                          {stay.name}
                        </strong>
                        <span className="mt-1 block text-xs font-normal text-[#667085]">
                          {stay.location}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-[#E7E9EC] bg-[#FAFAF8]">
          <div className="mx-auto max-w-[1400px] px-10 py-10 xl:px-14">
            <div className="grid grid-cols-[1.05fr_1fr_1.25fr] items-start gap-12">
              <div>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2.5"
                  aria-label="연 홈"
                >
                  <LotusIcon className="h-8 w-8" />
                  <span className="text-[23px] font-semibold tracking-[-0.05em]">
                    연
                  </span>
                </Link>
                <p className="mt-4 text-sm font-normal leading-6 text-[#667085]">
                  <span className="block whitespace-nowrap">
                    불교 생활에 필요한 정보를 쉽고 가깝게 연결하는
                  </span>
                  <span className="block">공간입니다.</span>
                </p>
              </div>

              <div>
                <h2 className="text-sm font-semibold">등록 안내</h2>
                <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3 text-sm font-normal text-[#667085]">
                  <Link href="/jobs/new" className="hover:text-[#191F28]">
                    구인 등록
                  </Link>
                  <Link href="/events/new" className="hover:text-[#191F28]">
                    행사·교육 등록
                  </Link>
                  <Link
                    href="/temples/stay/new"
                    className="hover:text-[#191F28]"
                  >
                    템플스테이 등록
                  </Link>
                  <Link
                    href="/temples/food/new"
                    className="hover:text-[#191F28]"
                  >
                    사찰음식 등록
                  </Link>
                </div>
              </div>

              <div>
                <h2 className="text-sm font-semibold">문의하기</h2>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <a
                    href="https://open.kakao.com/o/sulQHJGi"
                    target="_blank"
                    rel="noreferrer"
                    className="flex min-h-[82px] items-center gap-3 rounded-2xl bg-[#F4F54A] px-5 text-left text-[#191F28] transition hover:bg-[#E8EA35] hover:shadow-[0_10px_25px_rgba(25,31,40,0.08)]"
                  >
                    <KakaoIcon />
                    <span>
                      <strong className="block text-sm font-semibold">
                        카카오톡 문의
                      </strong>
                      <span className="mt-1 block text-xs font-normal text-[#5F610E]">
                        오픈채팅으로 상담하세요
                      </span>
                    </span>
                  </a>

                  <a
                    href="sms:01057861556"
                    className="flex min-h-[82px] items-center gap-3 rounded-2xl border border-[#DDE1E5] bg-white px-5 text-left transition hover:border-[#AEB5BC] hover:shadow-[0_10px_25px_rgba(25,31,40,0.07)]"
                  >
                    <MessageIcon />
                    <span>
                      <strong className="block text-sm font-semibold">
                        문자 문의
                      </strong>
                      <span className="mt-1 block text-xs font-normal text-[#667085]">
                        궁금한 내용을 보내주세요
                      </span>
                    </span>
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-9 flex items-center justify-between border-t border-[#E7E9EC] pt-5 text-xs font-normal text-[#8B95A1]">
              <p>© 2026 연. All rights reserved.</p>
              <p>불교 정보와 사람을 잇는 공간</p>
            </div>
          </div>
        </footer>
      </div>

      <div className="md:hidden">
        <BottomNav />
      </div>
    </>
  );
}
