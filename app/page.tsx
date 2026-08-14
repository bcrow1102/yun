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
import SiteHeader from "@/app/components/SiteHeader";

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

const scrollHeroItems = [
  [
    {
      label: "템플스테이",
      href: "/temples/stay",
      image: "/images/hero/hero-temple.webp",
      alt: "템플스테이 안내 이미지",
      position: "top-[3%]",
      line: "-top-10 h-10",
      objectPosition: "center 45%",
    },
    {
      label: "행사교육",
      href: "/events",
      image: "/images/hero/hero-event.webp",
      alt: "산사 문화행사 이미지",
      position: "top-[9%] xl:top-[10%]",
      line: "-top-6 h-6",
      objectPosition: "center 42%",
    },
    {
      label: "사찰음식",
      href: "/temples/food",
      image: "/images/hero/hero-food.webp",
      alt: "사찰음식 이미지",
      position: "top-[1%]",
      line: "-top-14 h-14",
      objectPosition: "center 50%",
    },
  ],
  [
    {
      label: "한국의 고승",
      href: "/resources/masters",
      image: "/images/masters/wonhyo-card.webp",
      alt: "한국의 고승 원효대사 대표 이미지",
      position: "top-[3%]",
      line: "-top-10 h-10",
      objectPosition: "center center",
    },
    {
      label: "부처님 이야기",
      href: "/stories",
      image: "/images/stories/story-01-scene-1.webp",
      alt: "부처님 이야기 대표 삽화",
      position: "top-[9%] xl:top-[10%]",
      line: "-top-6 h-6",
      objectPosition: "center center",
    },
    {
      label: "홍보물 DIY",
      href: "/events/promote",
      image: "/images/showcase/yeon-diy-poster-lantern.webp",
      alt: "연등 행사 홍보물 DIY 완성 예시",
      position: "top-[1%]",
      line: "-top-14 h-14",
      objectPosition: "center center",
    },
  ],
] as const;

const SCROLL_HOLD_MS = 4000;
const SCROLL_REWIND_MS = 1950;
const SCROLL_REWIND_STAGGER_MS = 420;

type ScrollHeroItemData = {
  label: string;
  href: string;
  image: string;
  alt: string;
  position: string;
  line: string;
  objectPosition: string;
};

function ScrollHeroItem({
  item,
  isUnfolding,
  isSettled,
  isRewinding,
  onHoverChange,
}: {
  item: ScrollHeroItemData;
  isUnfolding: boolean;
  isSettled: boolean;
  isRewinding: boolean;
  onHoverChange: (isHovered: boolean) => void;
}) {
  return (
    <Link
      href={item.href}
      className={`scroll-hero-item group absolute left-1/2 z-10 box-border h-[560px] aspect-[2/3] -translate-x-1/2 overflow-visible ${item.position}${isRewinding ? " scroll-hero-rewinding" : isUnfolding ? " scroll-hero-unfolding" : ""}${isSettled && !isRewinding ? " scroll-hero-settled" : ""}`}
      aria-label={item.label}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
    >
      <span className="scroll-hero-shell relative block h-full w-full">
        <span className="scroll-hero-top-rod absolute overflow-hidden" aria-hidden="true">
          <img src="/images/hero-scroll/scroll-master-open.webp" alt="" className="scroll-hero-master-image" />
        </span>
        <span className="scroll-hero-canvas absolute overflow-hidden">
          <img src="/images/hero-scroll/scroll-master-open.webp" alt="" aria-hidden="true" className="scroll-hero-canvas-paper" />
          <span className="scroll-hero-fabric-finish absolute" aria-hidden="true" />
          <span className="scroll-hero-content absolute overflow-hidden">
            <img
              src={item.image}
              alt={item.alt}
              draggable={false}
              className="h-full w-full object-cover"
              style={{ objectPosition: item.objectPosition }}
            />
            <span className="absolute inset-0 bg-gradient-to-t from-[#191F28]/35 via-transparent to-transparent" />
            <span className="scroll-hero-label absolute bottom-3 left-3 flex items-center gap-1.5 text-[12px] font-medium text-white">
              {item.label}
              <ArrowIcon className="h-3.5 w-3.5" />
            </span>
          </span>
        </span>
        <span className="scroll-hero-bottom-rod absolute overflow-hidden" aria-hidden="true">
          <img src="/images/hero-scroll/scroll-master-open.webp" alt="" className="scroll-hero-bottom-rod-image" />
        </span>
      </span>
    </Link>
  );
}

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
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [unfoldingScrolls, setUnfoldingScrolls] = useState<number[]>([]);
  const [settledScrolls, setSettledScrolls] = useState<number[]>([]);
  const [activeScrollSet, setActiveScrollSet] = useState(0);
  const [scrollCycleIndex, setScrollCycleIndex] = useState(0);
  const [isScrollHovered, setIsScrollHovered] = useState(false);
  const [isScrollRewinding, setIsScrollRewinding] = useState(false);
  const [rewindingScrolls, setRewindingScrolls] = useState<number[]>([]);
  const [isPhoneCopyToastVisible, setIsPhoneCopyToastVisible] = useState(false);
  const scrollHoldRemainingRef = useRef(SCROLL_HOLD_MS);
  const phoneCopyToastTimerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (phoneCopyToastTimerRef.current !== null) {
      window.clearTimeout(phoneCopyToastTimerRef.current);
    }
  }, []);

  useEffect(() => {
    const startTimes = [400, 2380, 4360];
    const startTimers = startTimes.map((delay, index) =>
      window.setTimeout(() => {
        setUnfoldingScrolls((current) => current.includes(index) ? current : [...current, index]);
      }, delay),
    );
    const settleTimers = startTimes.map((delay, index) =>
      window.setTimeout(() => {
        setSettledScrolls((current) => current.includes(index) ? current : [...current, index]);
      }, delay + 1680),
    );

    return () => {
      startTimers.forEach(window.clearTimeout);
      settleTimers.forEach(window.clearTimeout);
    };
  }, [activeScrollSet, scrollCycleIndex]);

  useEffect(() => {
    if (settledScrolls.length !== 3 || isScrollHovered || isScrollRewinding) return;

    const duration = scrollHoldRemainingRef.current;
    const startedAt = performance.now();
    let completed = false;
    const timer = window.setTimeout(() => {
      completed = true;
      scrollHoldRemainingRef.current = 0;
      setIsScrollHovered(false);
      setIsScrollRewinding(true);
    }, duration);

    return () => {
      window.clearTimeout(timer);
      if (!completed) {
        scrollHoldRemainingRef.current = Math.max(0, duration - (performance.now() - startedAt));
      }
    };
  }, [isScrollHovered, isScrollRewinding, settledScrolls.length]);

  useEffect(() => {
    if (!isScrollRewinding) return;

    const rewindOrder = [2, 1, 0];
    const rewindTimers = rewindOrder.map((index, order) =>
      window.setTimeout(() => {
        setRewindingScrolls((current) => current.includes(index) ? current : [...current, index]);
      }, order * SCROLL_REWIND_STAGGER_MS),
    );
    const resetTimer = window.setTimeout(() => {
      setUnfoldingScrolls([]);
      setSettledScrolls([]);
      setRewindingScrolls([]);
      setIsScrollHovered(false);
      scrollHoldRemainingRef.current = SCROLL_HOLD_MS;
      if (activeScrollSet === 0) {
        setActiveScrollSet(1);
      } else {
        setScrollCycleIndex((current) => current + 1);
        setActiveScrollSet(0);
      }
      setIsScrollRewinding(false);
    }, (rewindOrder.length - 1) * SCROLL_REWIND_STAGGER_MS + SCROLL_REWIND_MS);

    return () => {
      rewindTimers.forEach(window.clearTimeout);
      window.clearTimeout(resetTimer);
    };
  }, [activeScrollSet, isScrollRewinding]);

  useEffect(() => {
    if (isSearchFocused) return;

    const timer = window.setTimeout(() => {
      setActiveHeroSlide((current) => (current + 1) % HERO_SLIDE_COUNT);
    }, 6000);

    return () => window.clearTimeout(timer);
  }, [activeHeroSlide, isSearchFocused]);

  const handleHeroPointerDown = (event: PointerEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest("a, button, input, form")) {
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
    router.push(`/search?q=${encoded}`);
  };

  const handleFooterPhoneCopy = async () => {
    const phoneNumber = "010-5786-1556";

    try {
      await navigator.clipboard.writeText(phoneNumber);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = phoneNumber;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const copied = document.execCommand("copy");
      textarea.remove();
      if (!copied) return;
    }

    setIsPhoneCopyToastVisible(true);
    if (phoneCopyToastTimerRef.current !== null) {
      window.clearTimeout(phoneCopyToastTimerRef.current);
    }
    phoneCopyToastTimerRef.current = window.setTimeout(() => {
      setIsPhoneCopyToastVisible(false);
      phoneCopyToastTimerRef.current = null;
    }, 1800);
  };

  return (
    <>
      <MobileHome />

      <div className="desktop-home-shell hidden min-h-screen bg-white text-[#191F28] md:block">
        <SiteHeader
          onSearchClick={() => {
            setActiveHeroSlide(0);
            window.setTimeout(() => searchInputRef.current?.focus(), 750);
          }}
        />

        <main>
          <section
            className="relative cursor-grab touch-pan-y select-none overflow-hidden border-b border-[#ECEBE7] bg-[#F7F5F0] active:cursor-grabbing"
            aria-label="주요 소식"
            onPointerDown={handleHeroPointerDown}
            onPointerMove={handleHeroPointerMove}
            onPointerUp={handleHeroPointerUp}
            onPointerCancel={handleHeroPointerCancel}
            onClickCapture={handleHeroClickCapture}
          >
            <div
              className="pointer-events-none absolute inset-0 z-0 h-full w-full bg-[url('/images/hero/hero-korean-ink-bg-v2.webp')] bg-cover bg-right bg-no-repeat opacity-[0.68] [filter:grayscale(72%)_saturate(45%)_contrast(94%)]"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-0 z-[1]"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, transparent 43%, rgba(72, 78, 82, 0.012) 68%, rgba(72, 78, 82, 0.038) 100%), linear-gradient(180deg, transparent 46%, rgba(67, 73, 77, 0.032) 100%)",
              }}
              aria-hidden="true"
            />
            <div
              className="hidden"
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
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
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
                  <Link
                    href={slide.href}
                    className="absolute inset-0 z-[1] block"
                    aria-label={slide.action}
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
                  </Link>

                  <div className="pointer-events-none relative z-10 mx-auto flex min-h-[560px] max-w-[1400px] items-center px-10 py-12 xl:px-14">
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
                        className="pointer-events-auto mt-8 inline-flex items-center gap-3 rounded-2xl bg-[#191F28] px-6 py-4 text-[15px] font-medium text-white transition hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(25,31,40,0.20)]"
                      >
                        {slide.action}
                        <ArrowIcon className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="relative z-10 mx-auto grid min-h-[600px] max-w-[1400px] grid-cols-[0.86fr_1.14fr] items-center gap-8 px-10 py-9 xl:grid-cols-[0.7fr_1.3fr] xl:gap-8 xl:px-14">
              <div className="relative z-10 -mt-3 max-w-[560px]">
                <p className="text-[15px] font-normal tracking-[-0.02em] text-[#667085]">
                  불교 생활을 더 가까이
                </p>
                <span className="mt-3 block h-[2px] w-9 rounded-full bg-[#F4F54A]" />

                <h1 className="mt-7 text-[40px] font-medium leading-[1.28] tracking-[-0.045em] text-[#191F28] xl:text-[44px]">
                  사찰과 사람,
                  <br />
                  문화로 만나는 한국불교
                </h1>

                <p className="mt-6 text-[15px] font-normal leading-7 text-[#667085]">
                  템플스테이와 산사 문화행사, 사찰음식과 사찰 정보를
                  <br />
                  연에서 편안하게 만나보세요.
                </p>

                <form onSubmit={handleSearch} className="relative mt-8 max-w-[550px]">
                  <SearchIcon className="pointer-events-none absolute left-5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#8B95A1]" />
                  <input
                    ref={searchInputRef}
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    type="search"
                    placeholder="템플스테이, 행사, 사찰을 검색해보세요"
                    className="h-[56px] w-full rounded-2xl border border-[#E1E0DB] bg-white pl-14 pr-16 text-[15px] font-normal text-[#191F28] outline-none placeholder:text-[#98A1AC] focus:border-[#B9BA28] focus:ring-4 focus:ring-[#F4F54A]/20"
                    aria-label="통합 검색"
                  />
                  <button
                    type="submit"
                    className="absolute right-2.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl bg-[#F4F54A] text-[#191F28] transition hover:bg-[#E8EA35]"
                    aria-label="검색하기"
                  >
                    <ArrowIcon className="h-4 w-4" />
                  </button>
                </form>

                {storyPopupOpen && (
                  <div className="hidden">
                    <BookLotusIcon className="h-12 w-16 shrink-0" />
                    <Link href="/stories" className="min-w-0 flex-1" aria-label="부처님 이야기 보러 가기">
                      <span className="block text-[12px] font-normal text-[#958438]">마음이 쉬어가는 이야기</span>
                      <span className="mt-0.5 block text-[16px] font-semibold text-[#191F28]">부처님 이야기</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => setStoryPopupOpen(false)}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-[17px] font-normal text-[#8B95A1] hover:bg-[#F3F4F5] hover:text-[#191F28]"
                      aria-label="부처님 이야기 알림 닫기"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              <div className="relative -mr-10 h-[560px] min-w-0 self-stretch overflow-visible py-2 xl:-mr-24">
                <div
                  className="hidden"
                  style={{ transform: `translateX(-${activeHeroSlide * 100}%)` }}
                >
                  <Link href="/temples/stay" className="group relative block h-full w-full shrink-0 overflow-hidden rounded-[21px] border border-[#E7E9EC]" aria-label="템플스테이 둘러보기">
                    <img src="/images/hero/hero-temple.webp" alt="템플스테이 안내 이미지" draggable={false} className="h-full w-full object-cover" />
                    <span className="absolute bottom-4 left-4 bg-white/90 px-3 py-1.5 text-[13px] font-normal text-[#191F28]">템플스테이</span>
                  </Link>

                  {featureSlides.map((slide) => (
                    <Link key={slide.title} href={slide.href} className="group relative block h-full w-full shrink-0 overflow-hidden rounded-[21px] border border-[#E7E9EC]" aria-label={slide.action}>
                      <img src={slide.image} alt={slide.imageAlt} draggable={false} className="h-full w-full object-cover object-center" />
                      <span className="absolute bottom-4 left-4 bg-white/90 px-3 py-1.5 text-[13px] font-normal text-[#191F28]">{slide.eyebrow}</span>
                    </Link>
                  ))}
                </div>
                <style>{`
                  @property --scroll-progress {
                    syntax: "<number>";
                    inherits: true;
                    initial-value: 0;
                  }
                  @keyframes scroll-hero-unfold-progress {
                    0% { --scroll-progress: 0; animation-timing-function: cubic-bezier(.55,.02,.82,.42); }
                    19.23% { --scroll-progress: .18; animation-timing-function: cubic-bezier(.18,.55,.28,1); }
                    67.95% { --scroll-progress: .74; animation-timing-function: cubic-bezier(.16,.72,.2,1); }
                    100% { --scroll-progress: 1; }
                  }
                  @keyframes scroll-hero-rewind-progress {
                    0% { --scroll-progress: 1; animation-timing-function: cubic-bezier(.5,.04,.72,.35); }
                    25% { --scroll-progress: .86; animation-timing-function: cubic-bezier(.35,.18,.55,.88); }
                    72% { --scroll-progress: .28; animation-timing-function: cubic-bezier(.18,.62,.25,1); }
                    100% { --scroll-progress: 0; }
                  }
                  .scroll-hero-item { --scroll-progress: 0; cursor: pointer; }
                  .scroll-hero-master-image, .scroll-hero-canvas-paper, .scroll-hero-bottom-rod-image { position: absolute; left: 50%; height: 560px; width: 563.37px; max-width: none; object-fit: fill; transform: translateX(-50%); }
                  .scroll-hero-top-rod, .scroll-hero-canvas, .scroll-hero-bottom-rod { pointer-events: none; }
                  .scroll-hero-top-rod { z-index: 4; top: 2.13px; left: 50%; height: 69.4px; width: 563.37px; transform: translateX(-50%); }
                  .scroll-hero-top-rod .scroll-hero-master-image { top: 0; }
                  .scroll-hero-canvas { z-index: 2; top: 71.53px; left: 50%; height: calc(var(--scroll-progress) * 423.4px); width: 563.37px; transform: translateX(-50%); clip-path: inset(0); contain: paint; }
                  .scroll-hero-canvas-paper { z-index: 1; top: -69.4px; }
                  .scroll-hero-fabric-finish { z-index: 1; left: 156.2px; top: 0; height: 100%; width: 251.9px; background-color: rgba(232, 226, 211, .94); background-image: radial-gradient(ellipse 34% 20% at 24% 8%, rgba(255, 255, 255, .06), transparent 72%), radial-gradient(ellipse 30% 18% at 76% 15%, rgba(126, 103, 69, .024), transparent 74%), radial-gradient(ellipse 38% 20% at 28% 92%, rgba(122, 99, 66, .022), transparent 72%), radial-gradient(ellipse 32% 18% at 76% 96%, rgba(255, 255, 255, .045), transparent 74%), linear-gradient(90deg, rgba(105, 86, 57, .075), transparent 10%, transparent 90%, rgba(105, 86, 57, .075)), linear-gradient(180deg, rgba(104, 85, 57, .055), transparent 10%, transparent 90%, rgba(104, 85, 57, .05)); box-shadow: inset 1px 0 rgba(104, 85, 57, .15), inset -1px 0 rgba(104, 85, 57, .15), inset 0 1px rgba(255, 255, 255, .045), inset 0 -1px rgba(104, 85, 57, .085); }
                  .scroll-hero-content { z-index: 2; left: 181.57px; top: 50.16px; height: 329px; width: 199.16px; overflow: hidden !important; clip-path: inset(0); contain: paint; }
                  .scroll-hero-content > img { position: absolute; inset: 0; height: 100%; width: 100%; max-width: none; object-fit: cover; transform: none; }
                  .scroll-hero-bottom-rod { z-index: 3; top: calc(71.53px + var(--scroll-progress) * 423.4px); left: 50%; height: 44.8px; width: 563.37px; transform: translate(-50%, -1px); }
                  .scroll-hero-slot-third .scroll-hero-bottom-rod { transform: translate(-50%, -2px); }
                  .scroll-hero-bottom-rod-image { top: -493px; }
                  .scroll-hero-label { opacity: 0; }
                  .scroll-hero-slot { z-index: 10; transform-origin: 50% 8%; }
                  .scroll-hero-slot-side { transform: translateY(-6px) scale(.96); }
                  .scroll-hero-slot-center { z-index: 20; transform: translateY(10px); }
                  @media (min-width: 1280px) {
                    .scroll-hero-slot-first { transform: translate(42px, -6px) scale(.96); }
                    .scroll-hero-slot-third { transform: translate(-42px, -8px) scale(.96); }
                  }
                  @media (min-width: 1440px) {
                    .scroll-hero-slot-first { transform: translate(70px, -6px) scale(.96); }
                    .scroll-hero-slot-third { transform: translate(-70px, -8px) scale(.96); }
                  }
                  .scroll-hero-unfolding { animation: scroll-hero-unfold-progress 1560ms linear 120ms both; }
                  .scroll-hero-rewinding { animation: scroll-hero-rewind-progress 1950ms linear both; }
                  .scroll-hero-settled .scroll-hero-label { opacity: 1; }
                  .scroll-hero-settled .scroll-hero-shell { transition: transform 220ms ease-out; }
                  .scroll-hero-settled:hover .scroll-hero-shell { transform: translateY(-4px); }
                  @media (prefers-reduced-motion: reduce) {
                    .scroll-hero-item, .scroll-hero-item * { animation: none !important; }
                    .scroll-hero-item { --scroll-progress: 1; }
                    .scroll-hero-rewinding { --scroll-progress: 0 !important; }
                    .scroll-hero-label { opacity: 1; }
                    .scroll-hero-settled .scroll-hero-shell { transition: none; }
                    .scroll-hero-settled:hover .scroll-hero-shell { transform: none; }
                  }
                `}</style>
                <div className={`hero-scroll-stage absolute inset-y-0 left-0 grid h-[560px] w-[min(860px,100%)] grid-cols-3 gap-[clamp(38px,3.82vw,55px)]${isScrollRewinding ? " pointer-events-none" : ""}`}>
                  {scrollHeroItems[activeScrollSet].map((slot, index, items) => {
                    const rotation = scrollCycleIndex % items.length;
                    const item = items[(index - rotation + items.length) % items.length];
                    return (
                      <div
                        key={`${scrollCycleIndex}-${activeScrollSet}-${index}-${item.href}`}
                        className={`scroll-hero-slot relative h-full ${index === 1
                          ? "scroll-hero-slot-center"
                          : `scroll-hero-slot-side ${index === 0 ? "scroll-hero-slot-first" : "scroll-hero-slot-third"}`
                          }`}
                      >
                        <ScrollHeroItem
                          item={{ ...item, position: slot.position, line: slot.line }}
                          isUnfolding={unfoldingScrolls.includes(index)}
                          isSettled={settledScrolls.includes(index)}
                          isRewinding={rewindingScrolls.includes(index)}
                          onHoverChange={setIsScrollHovered}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="hidden absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/80 px-3 py-2 shadow-[0_8px_20px_rgba(25,31,40,0.08)] backdrop-blur">
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

          <section className="mx-auto max-w-[1400px] px-10 pb-[56px] pt-[108px] xl:px-14" aria-labelledby="editorial-quick-title">
            <div className="mb-12 flex items-end justify-between border-b border-[#D9DAD4] pb-5">
              <div>
                <h2 id="editorial-quick-title" className="mt-10 text-[38px] font-medium tracking-[-0.05em] text-[#191F28]">지금 바로 활용하기</h2>
              </div>
              <p className="hidden max-w-[340px] text-left text-[16px] font-normal leading-[1.65] text-[#4E5968] md:block">행사 홍보물은 직접 만들고,<br />필요한 실무서식은 바로 꺼내 쓰세요</p>
            </div>
            <div className="grid h-[240px] grid-cols-[1.27fr_1fr] gap-[52px]">
              <Link
                href="/events/promote"
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[4px] bg-[#FFFCE2] p-8 pr-[42%] transition duration-200 hover:bg-[#FFFBD8] xl:p-10 xl:pr-[42%]"
              >
                <div className="relative z-10 -translate-y-2">
                  <h3 className="mt-5 text-[28px] font-semibold tracking-[-0.045em] text-[#191F28]">홍보물 DIY</h3>
                  <p className="mt-3 text-sm font-normal leading-6 text-[#667085]">행사 포스터와 홍보 문구를 직접 만들어보세요.</p>
                </div>
                <span className="relative z-10 inline-flex -translate-y-2 items-center gap-2 text-sm font-medium text-[#191F28]">
                  바로 만들기
                  <ArrowIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
                <span className="pointer-events-none absolute inset-0" aria-hidden="true">
                  <img src="/images/showcase/yeon-diy-poster-novice.webp" alt="" className="absolute right-12 top-[6px] h-[182px] w-auto rotate-[0.7deg] object-contain shadow-[0_3px_8px_rgba(25,31,40,0.06)]" />
                  <img src="/images/showcase/yeon-diy-poster-lantern.webp" alt="" className="absolute right-[calc(9%+66px)] top-[16px] z-10 h-[207px] w-auto rotate-[-1.2deg] object-contain shadow-[0_3px_8px_rgba(25,31,40,0.06)]" />
                </span>
              </Link>
              <Link
                href="/downloads"
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[4px] bg-[#F2F5ED] p-8 pr-[40%] transition duration-200 hover:bg-[#EDF2E6] xl:p-10 xl:pr-[40%]"
              >
                <div className="relative z-10 -translate-y-2">
                  <h3 className="mt-5 text-[25px] font-semibold tracking-[-0.04em] text-[#191F28]">사찰 실무서식 / 자료실</h3>
                  <p className="mt-3 text-sm font-normal leading-6 text-[#667085]">
                    신도명부 · 접수대장 · 행사관리 등
                    <br />
                    사찰에서 바로 쓰는 실무자료
                  </p>
                </div>
                <span className="relative z-10 inline-flex -translate-y-2 items-center gap-2 text-sm font-medium text-[#191F28]">
                  서식 보기
                  <ArrowIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
                <span className="pointer-events-none absolute inset-0 translate-y-2" aria-hidden="true">
                  <span className="absolute right-[calc(9%+16px)] top-[7px] h-[121px] w-[142px] rotate-[0.7deg] overflow-hidden shadow-[0_3px_8px_rgba(25,31,40,0.06)]">
                    <img src="/images/showcase/yeon-form-indung.webp" alt="" className="h-full w-full object-cover object-[center_20%]" />
                  </span>
                  <span className="absolute bottom-[23px] right-[calc(13.5%+16px)] z-10 h-[193px] w-[160px] rotate-[-0.8deg] overflow-hidden shadow-[0_3px_8px_rgba(25,31,40,0.06)]">
                    <img src="/images/showcase/yeon-yeondeung-tag-sheet.webp" alt="" className="h-full w-full object-cover object-[center_42%]" />
                  </span>
                </span>
              </Link>
            </div>
          </section>

          <section className="mx-auto max-w-[1400px] px-10 pb-[96px] pt-[112px] xl:px-14" aria-labelledby="editorial-living-title">
            <div className="mb-9 flex items-end justify-between border-b border-[#D9DAD4] pb-5">
              <div>
                <h2 id="editorial-living-title" className="mt-7 text-[38px] font-medium tracking-[-0.05em] text-[#191F28]">한국불교 생활 찾기</h2>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-7">
              {[
                ["템플스테이", "머무르며 마음을 쉬어가는 시간", "/temples/stay", "/images/showcase/yeon-life-templestay.webp", "산사에서 쉬어가는 템플스테이"],
                ["사찰음식", "계절과 정성이 담긴 한 끼", "/temples/food", "/images/showcase/yeon-life-temple-food.webp", "사찰음식 한 상"],
                ["행사·교육", "산사에서 만나는 문화와 배움", "/events", "/images/showcase/yeon-life-events-education.webp", "스님과 참여자가 함께하는 행사교육"],
                ["사찰 안내", "우리 곁의 사찰을 찾아보기", "/temples/guide", "/images/showcase/yeon-life-temple-guide.webp", "사찰 전각과 진입 공간"],
              ].map(([title, description, href, image, imageAlt]) => (
                <Link key={href} href={href} className="group block">
                  <span className="block aspect-[4/3] overflow-hidden rounded-[6px]">
                    <img src={image} alt={imageAlt} className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.015]" />
                  </span>
                  <span className="mt-5 flex items-center justify-between gap-3">
                    <span className="text-[21px] font-semibold tracking-[-0.04em] text-[#191F28]">{title}</span>
                    <ArrowIcon className="h-5 w-5 shrink-0 text-[#8B95A1] transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                  <span className="mt-3 block text-[13px] font-normal leading-5 text-[#667085]">{description}</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="mx-auto max-w-[1400px] px-10 py-[112px] xl:px-14" aria-labelledby="editorial-learn-title">
            <div className="grid grid-cols-[0.5fr_1fr] gap-20">
              <div>
                <h2 id="editorial-learn-title" className="text-[38px] font-medium tracking-[-0.05em] text-[#191F28]">한국불교를 깊이 읽다</h2>
                <p className="mt-6 whitespace-pre-line text-[16px] font-normal leading-[1.65] text-[#4E5968]">인물과 이야기, 자료를 따라{"\n"}한국불교의 삶과 가르침을 만나보세요</p>
                <span className="mt-8 block h-px w-9 bg-[#F4F54A]" aria-hidden="true" />
                <img src="/images/showcase/yeon-deep-reading-books.webp" alt="" className="ml-7 mt-10 h-auto w-[62%] max-w-[250px]" />
              </div>
              <div className="border-y border-[#D9DAD4]">
                {[
                  ["한국의 고승", "큰스님들의 삶과 사상을 시대를 따라 읽습니다", "/resources/masters"],
                  ["부처님 이야기", "이야기로 만나는 부처님의 삶과 가르침", "/stories"],
                  ["불교자료", "원문번역연구자료를 차근차근 모아갑니다", "/resources"],
                ].map(([title, description, href], index) => (
                  <Link
                    key={href}
                    href={href}
                    className={`group flex min-h-[120px] items-center justify-between gap-8 px-5 py-6 ${index < 2 ? "border-b border-[#D9DAD4]" : ""}`}
                  >
                    <span>
                      <span className="block text-[23px] font-semibold tracking-[-0.04em] text-[#191F28]">{title}</span>
                      <span className="mt-2 block text-[16px] font-normal leading-6 text-[#667085]">{description}</span>
                    </span>
                    <ArrowIcon className="h-5 w-5 shrink-0 text-[#8B95A1] transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-[1400px] px-10 py-[112px] xl:px-14" aria-labelledby="editorial-latest-title">
            <div className="grid grid-cols-[0.35fr_1fr] gap-16">
              <div>
                <h2 id="editorial-latest-title" className="text-[38px] font-medium leading-[1.15] tracking-[-0.05em] text-[#191F28]">새로<br />올라온 것</h2>
                <p className="mt-5 max-w-[180px] text-sm font-normal leading-6 text-[#667085]">연에 새로 더해진 소식과 콘텐츠를 차례로 만나보세요.</p>
              </div>
              <div className="border-t border-[#E1E3DE]">
                {latestJobs.map((job) => (
                  <Link key={job.id} href={`/jobs/${job.id}`} className="group grid min-h-[72px] grid-cols-[minmax(132px,0.36fr)_minmax(0,1fr)_84px_20px] items-center gap-6 border-b border-[#E1E3DE] py-4">
                    <span className="text-[13px] font-normal tracking-[0.04em] text-[#667085]">구인 · {job.location}</span>
                    <span className="min-w-0 truncate text-[17px] font-medium tracking-[-0.02em] text-[#191F28]">{job.title}</span>
                    <span className="text-right text-xs font-normal text-[#667085]">{job.date}</span>
                    <ArrowIcon className="h-[18px] w-[18px] shrink-0 text-[#667085] transition-transform duration-200 ease-out group-hover:translate-x-1" />
                  </Link>
                ))}
                <Link href="/events/temple-concert" className="group grid min-h-[72px] grid-cols-[minmax(132px,0.36fr)_minmax(0,1fr)_84px_20px] items-center gap-6 border-b border-[#E1E3DE] py-4">
                  <span className="text-[13px] font-normal tracking-[0.04em] text-[#667085]">행사교육 · 문화행사</span>
                  <span className="min-w-0 truncate text-[17px] font-medium tracking-[-0.02em] text-[#191F28]">산사에서 만나는 문화행사</span>
                  <span aria-hidden="true" />
                  <ArrowIcon className="h-[18px] w-[18px] shrink-0 text-[#667085] transition-transform duration-200 ease-out group-hover:translate-x-1" />
                </Link>
                {recommendedTempleStays.map((stay) => (
                  <Link key={stay.id} href={`/temples/stay/${stay.id}`} className="group grid min-h-[72px] grid-cols-[minmax(132px,0.36fr)_minmax(0,1fr)_84px_20px] items-center gap-6 border-b border-[#E1E3DE] py-4">
                    <span className="text-[13px] font-normal tracking-[0.04em] text-[#667085]">템플스테이 · {stay.location}</span>
                    <span className="min-w-0 truncate text-[17px] font-medium tracking-[-0.02em] text-[#191F28]">{stay.name}</span>
                    <span aria-hidden="true" />
                    <ArrowIcon className="h-[18px] w-[18px] shrink-0 text-[#667085] transition-transform duration-200 ease-out group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section
            className="hidden mx-auto max-w-[1400px] px-10 py-10 xl:px-14"
            aria-labelledby="quick-actions-title"
          >
            <h2 id="quick-actions-title" className="text-xl font-medium tracking-[-0.03em]">
              지금 바로 활용하기
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Link
                href="/events/promote"
                className="flex items-center justify-between border border-[#E7E9EC] bg-white px-6 py-5 transition hover:border-[#D8DA72]"
              >
                <span>
                  <span className="block text-[15px] font-medium text-[#191F28]">홍보물 DIY</span>
                  <span className="mt-1 block text-sm font-normal text-[#667085]">행사 홍보물을 직접 만들어보세요.</span>
                </span>
                <ArrowIcon className="h-5 w-5 text-[#8B95A1]" />
              </Link>
              <Link
                href="/downloads"
                className="flex items-center justify-between border border-[#E7E9EC] bg-white px-6 py-5 transition hover:border-[#D8DA72]"
              >
                <span>
                  <span className="block text-[15px] font-medium text-[#191F28]">사찰 실무서식</span>
                  <span className="mt-1 block text-sm font-normal text-[#667085]">사찰 운영에 필요한 자료를 찾아보세요.</span>
                </span>
                <ArrowIcon className="h-5 w-5 text-[#8B95A1]" />
              </Link>
            </div>
          </section>

          <section
            className="hidden mx-auto max-w-[1400px] px-10 py-8 xl:px-14"
            aria-labelledby="living-title"
          >
            <h2 id="living-title" className="text-xl font-medium tracking-[-0.03em]">
              한국불교 생활 찾기
            </h2>
            <div className="mt-4 grid grid-cols-2 border-y border-[#E7E9EC] md:grid-cols-4">
              {[
                ["템플스테이", "/temples/stay"],
                ["사찰음식", "/temples/food"],
                ["행사교육", "/events"],
                ["사찰 안내", "/temples/guide"],
              ].map(([title, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center justify-between border-b border-[#E7E9EC] px-4 py-5 text-[15px] font-normal text-[#191F28] transition hover:bg-[#FAF9F6] md:border-b-0 md:border-r md:px-5 last:border-r-0"
                >
                  {title}
                  <ArrowIcon className="h-4 w-4 text-[#8B95A1]" />
                </Link>
              ))}
            </div>
          </section>

          <section
            className="hidden mx-auto max-w-[1400px] px-10 py-8 xl:px-14"
            aria-labelledby="learn-title"
          >
            <h2 id="learn-title" className="text-xl font-medium tracking-[-0.03em]">
              읽고 알아가기
            </h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <Link href="/resources/masters" className="border border-[#E7E9EC] bg-white px-5 py-5 md:py-6">
                <span className="block text-[15px] font-medium text-[#191F28]">한국의 고승</span>
                <span className="mt-1 block text-sm font-normal text-[#667085]">한국불교의 큰스님과 가르침을 알아보세요.</span>
              </Link>
              <Link href="/stories" className="border border-[#E7E9EC] bg-white px-5 py-5 md:py-6">
                <span className="block text-[15px] font-medium text-[#191F28]">부처님 이야기</span>
                <span className="mt-1 block text-sm font-normal text-[#667085]">잠시 쉬어가며 마음을 돌아보는 이야기입니다.</span>
              </Link>
              <Link href="/resources" className="border border-[#E7E9EC] bg-white px-5 py-5 md:py-6">
                <span className="block text-[15px] font-medium text-[#191F28]">불교자료</span>
                <span className="mt-1 block text-sm font-normal text-[#667085]">불교와 사찰 생활에 필요한 자료를 모았습니다.</span>
              </Link>
            </div>
          </section>

          <section
            className="hidden mx-auto max-w-[1400px] px-10 py-8 pb-16 xl:px-14"
            aria-labelledby="latest-title"
          >
            <h2 id="latest-title" className="text-xl font-medium tracking-[-0.03em]">
              새로 올라온 것
            </h2>
            <div className="mt-4 divide-y divide-[#E7E9EC] border-y border-[#E7E9EC] bg-white">
              {latestJobs.map((job) => (
                <Link key={job.id} href={`/jobs/${job.id}`} className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-[#FAF9F6]">
                  <span className="min-w-0">
                    <span className="block text-xs font-normal text-[#8B95A1]">구인 · {job.temple} · {job.location}</span>
                    <span className="mt-1 block truncate text-[15px] font-normal text-[#191F28]">{job.title}</span>
                  </span>
                  <span className="shrink-0 text-xs font-normal text-[#8B95A1]">{job.date}</span>
                </Link>
              ))}
              <Link href="/events/temple-concert" className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-[#FAF9F6]">
                <span>
                  <span className="block text-xs font-normal text-[#8B95A1]">행사교육 · 문화행사</span>
                  <span className="mt-1 block text-[15px] font-normal text-[#191F28]">산사에서 만나는 문화행사</span>
                </span>
                <ArrowIcon className="h-4 w-4 shrink-0 text-[#8B95A1]" />
              </Link>
              {recommendedTempleStays.map((stay) => (
                <Link key={stay.id} href={`/temples/stay/${stay.id}`} className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-[#FAF9F6]">
                  <span>
                    <span className="block text-xs font-normal text-[#8B95A1]">템플스테이 · {stay.location}</span>
                    <span className="mt-1 block text-[15px] font-normal text-[#191F28]">{stay.name}</span>
                  </span>
                  <ArrowIcon className="h-4 w-4 shrink-0 text-[#8B95A1]" />
                </Link>
              ))}
            </div>
          </section>

          <section
            className="hidden mx-auto max-w-[1400px] px-10 py-9 xl:px-14"
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
                href="/events/promote"
                className="group relative overflow-hidden rounded-[24px] border border-[#E8E99C] bg-[#FFFED7] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(25,31,40,0.10)]"
              >
                <span className="absolute inset-x-0 top-0 h-1 bg-[#F4F54A]" />
                <span className="flex h-[102px] items-center justify-center">
                  <img
                    src="/images/menu/promote-diy.webp"
                    alt=""
                    className="h-full w-[132px] object-contain"
                  />
                </span>
                <span className="mt-3 flex items-end justify-between gap-3">
                  <span>
                    <strong className="block text-[20px] font-semibold tracking-[-0.03em]">
                      홍보물 DIY
                    </strong>
                    <span className="mt-1 block text-[13px] font-normal text-[#667085]">
                      행사 홍보물을 직접 만들어요
                    </span>
                  </span>
                  <ArrowIcon className="h-5 w-5 shrink-0 text-[#9A9B16] transition group-hover:translate-x-1" />
                </span>
              </Link>
            </div>
          </section>

          <section
            className="hidden mx-auto max-w-[1400px] px-10 pb-16 xl:px-14"
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

        <footer className="border-t border-[#D9DAD4] bg-[#FAF9F6]">
          <div className="mx-auto max-w-[1400px] px-10 py-10 xl:px-14">
            <div className="grid grid-cols-[0.9fr_0.9fr_1.2fr] items-start gap-x-12">
              <Link
                href="/"
                className="col-start-1 row-start-1 inline-flex items-center gap-2.5"
                aria-label="연 홈"
              >
                <LotusIcon className="h-8 w-8" />
                <span className="text-[23px] font-semibold tracking-[-0.05em]">
                  연
                </span>
              </Link>

              <div className="col-start-1 row-start-2 mt-2.5">
                <p className="text-sm font-normal leading-6 text-[#667085]">
                  <span className="block">연은 개인이 만들고 운영하며,</span>
                  <span className="block">불교 생활에 필요한 정보를 쉽고 가깝게 연결합니다.</span>
                </p>
                <Link
                  href="/support"
                  className="mt-1 inline-block text-xs font-medium leading-5 text-[#2563EB] transition-colors hover:text-[#1D4ED8] hover:underline hover:underline-offset-2"
                >
                  후원하기
                </Link>
              </div>

              <div className="col-start-2 row-start-2 mt-2.5">
                <h2 className="text-sm font-semibold">등록 안내</h2>
                <div className="mt-3 grid grid-cols-2 gap-x-5 gap-y-2 text-sm font-normal text-[#667085]">
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

              <div className="col-start-3 row-start-2 mt-2.5">
                <div className="flex items-center gap-3">
                  <h2 className="shrink-0 text-sm font-semibold">문의하기</h2>
                  <a
                    href="mailto:bcrow1102@gmail.com"
                    className="inline-flex gap-2 whitespace-nowrap text-xs font-normal text-[#2563EB]"
                  >
                    <span>이메일 문의</span>
                    <span>bcrow1102@gmail.com</span>
                  </a>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2.5">
                  <a
                    href="https://open.kakao.com/o/sulQHJGi"
                    target="_blank"
                    rel="noreferrer"
                        className="group flex min-h-[56px] cursor-pointer items-center gap-2.5 border-t border-[#D9DAD4] px-0 text-left text-[#191F28]"
                  >
                    <KakaoIcon />
                    <span>
                      <span className="flex items-center gap-1.5">
                        <strong className="block text-sm font-semibold">
                          카카오톡 문의
                        </strong>
                        <ArrowIcon className="h-3.5 w-3.5 -rotate-45 text-[#667085] transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                      <span className="mt-1 block text-xs font-normal text-[#5F610E]">
                        오픈채팅으로 상담하세요
                      </span>
                    </span>
                  </a>

                  <button
                    type="button"
                    onClick={handleFooterPhoneCopy}
                    className="group flex min-h-[56px] w-full cursor-pointer items-center gap-2.5 border-t border-[#D9DAD4] px-0 text-left"
                  >
                    <MessageIcon />
                    <span>
                      <span className="flex items-center gap-1.5">
                        <strong className="block text-sm font-semibold">
                          문자 문의
                        </strong>
                        <ArrowIcon className="h-3.5 w-3.5 -rotate-45 text-[#667085] transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                      <span className="mt-1 block text-xs font-normal text-[#667085]">
                        궁금한 내용을 보내주세요
                      </span>
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-[#E7E9EC] pt-4 text-xs font-normal text-[#8B95A1]">
              <p>© 2026 연. All rights reserved.</p>
              <p>불교 정보와 사람을 잇는 공간</p>
            </div>
          </div>
        </footer>
        {isPhoneCopyToastVisible && (
          <div
            role="status"
            aria-live="polite"
            className="fixed bottom-6 right-6 z-[100] bg-[#191F28] px-4 py-2 text-[13px] font-normal text-white"
          >
            전화번호가 복사되었습니다.
          </div>
        )}
      </div>

      <div className="mobile-home-shell md:hidden">
        <BottomNav />
      </div>
    </>
  );
}
