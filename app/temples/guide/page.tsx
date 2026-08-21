"use client";

import Link from "next/link";
import {
    FormEvent,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    getTempleSearchText,
    normalizeTempleSearchText,
    SIDO_LIST,
    temples,
    type Temple,
} from "./temples";
import { getTempleStayOperatorsByTempleSlug } from "../stay/operators";
import { getTempleFoodsByTempleSlug } from "../food/data";
import { getEventsByTempleSlug } from "../../events/data";

const FEATURED_TEMPLE_COUNT = 6;
const MOBILE_FEATURED_TEMPLE_COUNT = 3;
const TEXT_LIST_BATCH_SIZE = 12;

const TEMPLE_TRAIT_PRIORITY = [
    "외국인 방문",
    "대중교통",
    "아이와 함께",
    "접근 편의",
    "도심 사찰",
    "문화유산",
    "산사",
    "숲길",
    "휴식",
    "역사",
    "전통사찰",
] as const;

const TEMPLE_TRAIT_GROUPS: Record<string, string> = {
    "외국인 방문": "visit",
    대중교통: "visit",
    "아이와 함께": "visit",
    "접근 편의": "visit",
    "도심 사찰": "setting",
    산사: "setting",
    숲길: "setting",
    문화유산: "experience",
    휴식: "experience",
    역사: "experience",
    전통사찰: "experience",
};

const TEMPLE_TRAIT_QUERY_TERMS: Record<string, readonly string[]> = {
    "외국인 방문": ["외국인", "영어"],
    대중교통: ["대중교통", "차 없이", "차없이", "버스", "지하철", "전철"],
    "아이와 함께": ["아이", "어린이", "가족"],
    "접근 편의": ["접근 편의", "접근", "무장애"],
    "도심 사찰": ["도심 사찰", "도심", "도시"],
    문화유산: ["문화유산", "유산"],
    산사: ["산사", "산속"],
    숲길: ["숲길", "숲", "산책"],
    휴식: ["휴식", "쉬기", "힐링"],
    역사: ["역사"],
    전통사찰: ["전통사찰"],
};

type TempleConnection = {
    label: string;
    href: string;
};

function getTraitPriority(trait: string) {
    const priority = TEMPLE_TRAIT_PRIORITY.indexOf(
        trait as (typeof TEMPLE_TRAIT_PRIORITY)[number],
    );

    return priority === -1 ? TEMPLE_TRAIT_PRIORITY.length : priority;
}

function isTraitRelevantToQuery(trait: string, query: string) {
    if (!query) {
        return false;
    }

    const normalizedQuery = normalizeTempleSearchText(query);
    const terms = TEMPLE_TRAIT_QUERY_TERMS[trait] ?? [trait];

    return terms.some((term) =>
        normalizedQuery.includes(normalizeTempleSearchText(term)),
    );
}

function selectVisibleTempleTraits(
    traits: readonly string[],
    query: string,
) {
    const rankedTraits = [...traits].sort(
        (left, right) =>
            getTraitPriority(left) - getTraitPriority(right) ||
            left.localeCompare(right, "ko-KR"),
    );
    const selected: string[] = [];

    for (const trait of rankedTraits) {
        if (isTraitRelevantToQuery(trait, query)) {
            selected.push(trait);
        }

        if (selected.length === 2) {
            return selected;
        }
    }

    const selectedGroups = new Set(
        selected.map((trait) => TEMPLE_TRAIT_GROUPS[trait] ?? "other"),
    );

    for (const trait of rankedTraits) {
        if (selected.includes(trait)) {
            continue;
        }

        const group = TEMPLE_TRAIT_GROUPS[trait] ?? "other";

        if (!selectedGroups.has(group)) {
            selected.push(trait);
            selectedGroups.add(group);
        }

        if (selected.length === 2) {
            return selected;
        }
    }

    for (const trait of rankedTraits) {
        if (!selected.includes(trait)) {
            selected.push(trait);
        }

        if (selected.length === 2) {
            break;
        }
    }

    return selected;
}

function getTempleConnections(temple: Temple): TempleConnection[] {
    const templeStayOperator =
        getTempleStayOperatorsByTempleSlug(temple.slug)[0];
    const templeFood = getTempleFoodsByTempleSlug(temple.slug)[0];
    const event = getEventsByTempleSlug(temple.slug)[0];
    const connections: TempleConnection[] = [];

    if (templeStayOperator) {
        connections.push({
            label: "템플스테이",
            href: templeStayOperator.officialUrl,
        });
    }

    if (templeFood) {
        connections.push({
            label: "사찰음식",
            href: `/temples/food/${templeFood.id}`,
        });
    }

    if (event) {
        connections.push({
            label: "행사",
            href: event.detailHref,
        });
    }

    return connections;
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

function ChevronIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
        >
            <path
                d="m9 5 7 7-7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function DownIcon({ open }: { open: boolean }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""
                }`}
        >
            <path
                d="m6 9 6 6 6-6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function TempleIllustration() {
    return (
        <svg
            viewBox="0 0 120 90"
            fill="none"
            className="h-24 w-32 text-[#65755F]"
            aria-hidden="true"
        >
            <path
                d="M20 69h80"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M29 68V49h62v19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
            />
            <path
                d="M36 49V35h48v14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
            />
            <path
                d="M20 49h80L87 38H33L20 49Z"
                fill="#E2ECDD"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
            />
            <path
                d="M29 35h62L80 25H40L29 35Z"
                fill="#EDF3EA"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
            />
            <path
                d="M49 68V54h22v14"
                stroke="currentColor"
                strokeWidth="2"
            />
            <path
                d="M60 54v14"
                stroke="currentColor"
                strokeWidth="2"
            />
            <path
                d="M44 25h32"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}

function TempleCategoryNav() {
    const menus = [
        {
            label: "사찰 안내",
            href: "/temples/guide",
            active: true,
        },
        {
            label: "템플스테이",
            href: "/temples/stay",
            active: false,
        },
        {
            label: "사찰음식",
            href: "/temples/food",
            active: false,
        },
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

export default function TempleGuidePage() {
    const [selectedRegion, setSelectedRegion] = useState("전체");
    const [regionPanelOpen, setRegionPanelOpen] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [textListVisibleCount, setTextListVisibleCount] =
        useState(0);

    const resultsSectionRef = useRef<HTMLElement>(null);
    const browseControlsRef = useRef<HTMLDivElement>(null);

    const filteredTemples = useMemo(() => {
        const normalizedQuery =
            normalizeTempleSearchText(searchTerm);

        return temples.filter((temple) => {
            if (!temple.published) {
                return false;
            }

            const matchesRegion =
                selectedRegion === "전체" ||
                temple.location.sido === selectedRegion;

            const matchesSearch =
                normalizedQuery.length === 0 ||
                getTempleSearchText(temple).includes(
                    normalizedQuery,
                );

            return matchesRegion && matchesSearch;
        });
    }, [searchTerm, selectedRegion]);

    function moveToResults() {
        window.setTimeout(() => {
            resultsSectionRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }, 80);
    }

    function handleSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSearchTerm(searchInput.trim());
        setTextListVisibleCount(0);
        moveToResults();
    }

    function handleRegionChange(region: string) {
        setSelectedRegion(region);
        setRegionPanelOpen(false);
        setTextListVisibleCount(0);
        moveToResults();
    }

    function resetSearch() {
        setSelectedRegion("전체");
        setSearchInput("");
        setSearchTerm("");
        setRegionPanelOpen(false);
        setTextListVisibleCount(0);
    }

    function scrollToBrowseControls() {
        window.setTimeout(() => {
            browseControlsRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }, 0);
    }

    function collapseTextListBatch() {
        setTextListVisibleCount((count) =>
            Math.max(
                TEXT_LIST_BATCH_SIZE,
                Math.floor((count - 1) / TEXT_LIST_BATCH_SIZE) *
                    TEXT_LIST_BATCH_SIZE,
            ),
        );
        scrollToBrowseControls();
    }

    function collapseEntireTextList() {
        setTextListVisibleCount(0);
        scrollToBrowseControls();
    }

    const hasActiveFilter =
        selectedRegion !== "전체" || searchTerm.length > 0;

    const resultTitle = useMemo(() => {
        if (searchTerm && selectedRegion !== "전체") {
            return `${selectedRegion} · ‘${searchTerm}’ 검색 결과`;
        }

        if (searchTerm) {
            return `‘${searchTerm}’ 검색 결과`;
        }

        if (selectedRegion !== "전체") {
            return `${selectedRegion} 사찰`;
        }

        return "사찰 둘러보기";
    }, [searchTerm, selectedRegion]);

    const featuredTemples = filteredTemples.slice(
        0,
        FEATURED_TEMPLE_COUNT,
    );
    const remainingTemples = filteredTemples.slice(
        FEATURED_TEMPLE_COUNT,
    );
    const visibleTextTemples = remainingTemples.slice(
        0,
        textListVisibleCount,
    );
    const hasMoreTextTemples =
        visibleTextTemples.length < remainingTemples.length;

    return (
        <div className="min-h-screen bg-white text-[#252A31]">

            <TempleCategoryNav />

            <main>
                <section className="bg-[#F3F7F1]">
                    <div className="mx-auto max-w-6xl px-5 py-11 md:px-8 md:py-16">
                        <h1 className="text-[34px] font-bold tracking-[-0.045em] md:text-[48px]">
                            가까운 사찰을 찾아보세요
                        </h1>

                        <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#667085] md:text-base">
                            지역과 사찰 이름으로 검색하고 방문에
                            필요한 정보를 편하게 확인해 보세요.
                        </p>

                        <form
                            onSubmit={handleSearch}
                            className="mt-7 flex max-w-2xl items-center gap-2 rounded-[18px] border border-[#DDE7D9] bg-white p-2 shadow-[0_4px_16px_rgba(25,31,40,0.05)] transition focus-within:border-[#252A31] focus-within:ring-2 focus-within:ring-[#F4F54A]"
                        >
                            <span className="ml-2 text-[#8B95A1]">
                                <SearchIcon />
                            </span>

                            <input
                                type="search"
                                value={searchInput}
                                onChange={(event) =>
                                    setSearchInput(
                                        event.target.value,
                                    )
                                }
                                placeholder="사찰 이름, 지역, 문화유산 검색"
                                aria-label="사찰 검색어"
                                className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm outline-none placeholder:text-[#A8B0BA]"
                            />

                            <button
                                type="submit"
                                className="shrink-0 rounded-xl bg-[#252A31] px-4 py-3 text-sm font-bold text-white transition active:scale-95 active:bg-black"
                            >
                                검색
                            </button>
                        </form>
                    </div>
                </section>

                <section className="border-b border-[#EEF0F2] bg-white">
                    <div className="mx-auto max-w-6xl px-4 py-4 md:px-8">
                        <div className="max-w-2xl">
                            <div className="flex items-center gap-3">
                                <span className="shrink-0 text-sm font-semibold text-[#252A31]">
                                    지역
                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setRegionPanelOpen(
                                            (current) => !current,
                                        )
                                    }
                                    aria-expanded={regionPanelOpen}
                                    aria-controls="region-selection-panel"
                                    className={`flex min-h-11 w-full max-w-[230px] items-center justify-between rounded-xl border px-4 text-left text-sm font-medium transition ${regionPanelOpen
                                        ? "border-[#252A31] bg-white ring-2 ring-[#F4F54A]"
                                        : "border-[#DDE1E6] bg-white"
                                        }`}
                                >
                                    <span>
                                        {selectedRegion === "전체"
                                            ? "전체 지역"
                                            : selectedRegion}
                                    </span>

                                    <DownIcon
                                        open={regionPanelOpen}
                                    />
                                </button>

                                {selectedRegion !== "전체" && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRegionChange(
                                                "전체",
                                            )
                                        }
                                        className="shrink-0 text-xs font-medium text-[#667085] underline underline-offset-4"
                                    >
                                        전국 보기
                                    </button>
                                )}
                            </div>

                            {regionPanelOpen && (
                                <div
                                    id="region-selection-panel"
                                    className="mt-3 rounded-[18px] border border-[#DDE1E6] bg-white p-3 shadow-[0_12px_30px_rgba(25,31,40,0.1)] md:p-4"
                                >
                                    <div className="mb-3 flex items-center justify-between">
                                        <strong className="text-sm font-semibold">
                                            지역 선택
                                        </strong>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setRegionPanelOpen(
                                                    false,
                                                )
                                            }
                                            className="text-xs text-[#667085]"
                                        >
                                            닫기
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRegionChange(
                                                "전체",
                                            )
                                        }
                                        className={`mb-2 min-h-11 w-full rounded-xl text-sm font-semibold transition ${selectedRegion ===
                                            "전체"
                                            ? "bg-[#252A31] text-white"
                                            : "bg-[#F5F6F7] text-[#252A31]"
                                            }`}
                                    >
                                        전국
                                    </button>

                                    <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
                                        {SIDO_LIST.filter(
                                            (region) =>
                                                region !== "전체",
                                        ).map((region) => (
                                            <button
                                                key={region}
                                                type="button"
                                                onClick={() =>
                                                    handleRegionChange(
                                                        region,
                                                    )
                                                }
                                                className={`min-h-11 rounded-xl border px-2 text-sm font-medium transition ${selectedRegion ===
                                                    region
                                                    ? "border-[#252A31] bg-[#F4F54A] text-[#191F28]"
                                                    : "border-[#E3E8EF] bg-white text-[#667085] hover:border-[#B8BEC6] hover:text-[#252A31]"
                                                    }`}
                                            >
                                                {region}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <section
                    ref={resultsSectionRef}
                    className="scroll-mt-32 mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12"
                >
                    <div className="mb-5 flex items-end justify-between gap-4">
                        <div>
                            <h2 className="text-[24px] font-bold tracking-[-0.035em] md:text-[28px]">
                                {resultTitle}
                            </h2>
                        </div>

                        <span
                            className="shrink-0 text-sm text-[#8B95A1]"
                            aria-live="polite"
                        >
                            {filteredTemples.length}곳
                        </span>
                    </div>

                    {hasActiveFilter && (
                        <div className="mb-5 flex flex-wrap items-center gap-2">
                            {selectedRegion !== "전체" && (
                                <span className="rounded-full bg-[#F3F7F1] px-3 py-2 text-xs font-semibold text-[#61705B]">
                                    지역: {selectedRegion}
                                </span>
                            )}

                            {searchTerm && (
                                <span className="rounded-full bg-[#F3F7F1] px-3 py-2 text-xs font-semibold text-[#61705B]">
                                    검색어: {searchTerm}
                                </span>
                            )}

                            <button
                                type="button"
                                onClick={resetSearch}
                                className="px-2 py-2 text-xs font-medium text-[#667085] underline underline-offset-4"
                            >
                                검색 조건 초기화
                            </button>
                        </div>
                    )}

                    {filteredTemples.length > 0 ? (
                        <>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {featuredTemples.map((temple, index) => {
                                    const visibleTraits =
                                        selectVisibleTempleTraits(
                                            temple.tags,
                                            searchTerm,
                                        );
                                    const connections =
                                        getTempleConnections(temple);
                                    const representativeImage =
                                        temple.representativeImage;

                                    return (
                                        <article
                                            key={temple.slug}
                                            className={`group min-w-0 flex-col overflow-hidden rounded-[22px] border border-[#E3E8EF] bg-white text-left transition hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(25,31,40,0.08)] ${
                                                index <
                                                MOBILE_FEATURED_TEMPLE_COUNT
                                                    ? "flex"
                                                    : "hidden md:flex"
                                            }`}
                                        >
                                            <Link
                                                href={`/temples/guide/${temple.slug}`}
                                                className="flex min-w-0 flex-1 flex-col"
                                            >
                                                <span className="flex h-40 items-center justify-center bg-[#F3F7F1]">
                                                    {representativeImage ? (
                                                        <img
                                                            src={representativeImage.src}
                                                            alt={representativeImage.alt}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <TempleIllustration />
                                                    )}
                                                </span>

                                                <span className="flex min-w-0 flex-1 flex-col p-5">
                                                    <span className="flex items-start justify-between gap-3">
                                                        <span className="min-w-0">
                                                            <strong className="block text-[20px] font-bold">
                                                                {temple.name}
                                                            </strong>

                                                            <span className="mt-1 block text-sm text-[#8B95A1]">
                                                                {
                                                                    temple
                                                                        .location
                                                                        .sido
                                                                }{" "}
                                                                {
                                                                    temple
                                                                        .location
                                                                        .sigungu
                                                                }
                                                            </span>
                                                        </span>

                                                        <span className="mt-1 shrink-0 text-[#7A8B74] transition group-hover:translate-x-1">
                                                            <ChevronIcon />
                                                        </span>
                                                    </span>

                                                    <span className="mt-4 block text-sm leading-6 text-[#667085]">
                                                        {temple.summary}
                                                    </span>

                                                    {visibleTraits.length > 0 && (
                                                        <span className="mt-4 flex flex-wrap gap-2">
                                                            {visibleTraits.map(
                                                                (trait) => (
                                                                    <span
                                                                        key={
                                                                            trait
                                                                        }
                                                                        className="rounded-full bg-[#F3F7F1] px-3 py-1.5 text-xs font-semibold text-[#61705B]"
                                                                    >
                                                                        {trait}
                                                                    </span>
                                                                ),
                                                            )}
                                                        </span>
                                                    )}
                                                </span>
                                            </Link>

                                            {connections.length > 0 && (
                                                <nav
                                                    aria-label={`${temple.name} 연결 정보`}
                                                    className="mx-5 flex min-h-12 flex-wrap items-center gap-x-4 gap-y-1 border-t border-[#EEF0F2] py-1"
                                                >
                                                    {connections.map(
                                                        (connection) => (
                                                            <Link
                                                                key={
                                                                    connection.label
                                                                }
                                                                href={
                                                                    connection.href
                                                                }
                                                                className="relative inline-flex min-h-11 items-center text-xs font-medium text-[#667085] transition-colors after:absolute after:bottom-1.5 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-[#F4F54A] after:transition-transform hover:text-[#252A31] hover:after:scale-x-100 focus-visible:text-[#252A31] focus-visible:outline-none focus-visible:after:scale-x-100 active:after:scale-x-100"
                                                            >
                                                                {
                                                                    connection.label
                                                                }
                                                            </Link>
                                                        ),
                                                    )}
                                                </nav>
                                            )}
                                        </article>
                                    );
                                })}
                            </div>

                            {textListVisibleCount === 0 &&
                                remainingTemples.length > 0 && (
                                    <div
                                        ref={browseControlsRef}
                                        className="mt-6 flex justify-center"
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setTextListVisibleCount(
                                                    Math.min(
                                                        TEXT_LIST_BATCH_SIZE,
                                                        remainingTemples.length,
                                                    ),
                                                )
                                            }
                                            className="min-h-11 px-3 py-2 text-sm font-medium text-[#667085] underline decoration-[#C5CBD2] underline-offset-4 transition hover:text-[#252A31]"
                                        >
                                            사찰 더보기
                                        </button>
                                    </div>
                                )}

                            {visibleTextTemples.length > 0 && (
                                <div className="mt-7">
                                    <div className="grid grid-cols-1 gap-x-6 border-t border-[#E1E4E8] md:grid-cols-2 lg:grid-cols-3">
                                        {visibleTextTemples.map((temple) => (
                                            <Link
                                                key={temple.slug}
                                                href={`/temples/guide/${temple.slug}`}
                                                className="group flex min-h-14 min-w-0 items-center justify-between gap-3 border-b border-[#E1E4E8] py-3 transition-colors hover:border-[#B8BEC7]"
                                            >
                                                <span className="min-w-0">
                                                    <strong className="block truncate text-sm font-medium text-[#343B45] transition-colors group-hover:text-[#171B22]">
                                                        {temple.name}
                                                    </strong>
                                                    <span className="mt-0.5 block truncate text-xs text-[#8B95A1]">
                                                        {temple.location.sido}{" "}
                                                        {temple.location.sigungu}
                                                    </span>
                                                </span>

                                                <span className="shrink-0 text-[#A0A7B0] transition-transform group-hover:translate-x-0.5 group-hover:text-[#667085]">
                                                    <ChevronIcon />
                                                </span>
                                            </Link>
                                        ))}
                                    </div>

                                    <div
                                        ref={browseControlsRef}
                                        className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1"
                                    >
                                        {hasMoreTextTemples && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setTextListVisibleCount(
                                                        (count) =>
                                                            Math.min(
                                                                count +
                                                                    TEXT_LIST_BATCH_SIZE,
                                                                remainingTemples.length,
                                                            ),
                                                    )
                                                }
                                                className="min-h-11 px-3 py-2 text-sm font-medium text-[#667085] underline decoration-[#C5CBD2] underline-offset-4 transition hover:text-[#252A31]"
                                            >
                                                더 보기
                                            </button>
                                        )}

                                        {visibleTextTemples.length >
                                            TEXT_LIST_BATCH_SIZE && (
                                            <button
                                                type="button"
                                                onClick={collapseTextListBatch}
                                                className="min-h-11 px-3 py-2 text-sm font-medium text-[#667085] underline decoration-[#C5CBD2] underline-offset-4 transition hover:text-[#252A31]"
                                            >
                                                12개 접기
                                            </button>
                                        )}

                                        <button
                                            type="button"
                                            onClick={collapseEntireTextList}
                                            className="min-h-11 px-3 py-2 text-sm font-medium text-[#667085] underline decoration-[#C5CBD2] underline-offset-4 transition hover:text-[#252A31]"
                                        >
                                            전체 접기
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="rounded-[22px] border border-[#E3E8EF] bg-[#F8F9FA] px-5 py-12 text-center">
                            <strong className="block text-lg">
                                검색 결과가 없습니다
                            </strong>

                            <p className="mt-2 text-sm leading-6 text-[#667085]">
                                사찰 이름이나 지역을 다시 확인하거나,
                                목록에 없는 사찰을 제안해 주세요.
                            </p>

                            <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={resetSearch}
                                    className="rounded-xl border border-[#DDE1E6] bg-white px-5 py-3 text-sm font-medium"
                                >
                                    검색 조건 초기화
                                </button>

                                <Link
                                    href="/temples/guide/suggest"
                                    className="rounded-xl bg-[#F4F54A] px-5 py-3 text-sm font-medium text-[#191F28]"
                                >
                                    사찰 추가 제안
                                </Link>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 rounded-[22px] bg-[#FDFDC7] px-5 py-6 md:px-7">
                        <div className="md:flex md:items-end md:justify-between md:gap-8">
                            <div>
                                <strong className="text-lg">
                                    사찰 정보를 함께 채워 주세요
                                </strong>

                                <p className="mt-2 text-sm leading-6 text-[#6D6200]">
                                    사찰 관계자의 직접 등록과 이용자의
                                    추가·수정 제안을 모두 받고 있습니다.
                                </p>
                            </div>

                            <div className="mt-5 grid gap-2 sm:grid-cols-3 md:mt-0">
                                <Link
                                    href="/temples/guide/new"
                                    className="rounded-xl bg-[#252A31] px-4 py-3.5 text-center text-sm font-medium text-white"
                                >
                                    사찰 등록
                                </Link>

                                <Link
                                    href="/temples/guide/suggest"
                                    className="rounded-xl border border-[#D7D979] bg-white px-4 py-3.5 text-center text-sm font-medium text-[#252A31]"
                                >
                                    사찰 추가 제안
                                </Link>

                                <Link
                                    href="/temples/guide/correction"
                                    className="rounded-xl border border-[#D7D979] bg-white px-4 py-3.5 text-center text-sm font-medium text-[#252A31]"
                                >
                                    정보 수정 제안
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
