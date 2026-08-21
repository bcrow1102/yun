"use client";

import {
    useMemo,
    useState,
    useSyncExternalStore,
} from "react";

type TempleStayProgramType = "day" | "experience" | "rest";

export type TempleStayOperatorListItem = {
    officialId: string;
    officialName: string;
    operatorType: "temple" | "institution";
    address: string;
    sido: string;
    sigungu: string;
    officialUrl: string;
    programCount: number;
    programTypes: TempleStayProgramType[];
    searchText: string;
};

type OperatorTypeFilter = "all" | TempleStayOperatorListItem["operatorType"];

const MOBILE_OPERATOR_BATCH_SIZE = 3;
const DESKTOP_OPERATOR_BATCH_SIZE = 6;
const DESKTOP_MEDIA_QUERY = "(min-width: 768px)";

const PROGRAM_TYPE_LABELS: Record<TempleStayProgramType, string> = {
    day: "당일형",
    experience: "체험형",
    rest: "휴식형",
};

const SIDO_ORDER = [
    "서울",
    "부산",
    "대구",
    "인천",
    "광주",
    "대전",
    "울산",
    "세종",
    "경기",
    "강원",
    "충북",
    "충남",
    "전북",
    "전남",
    "경북",
    "경남",
    "제주",
];

function SearchIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" strokeLinecap="round" />
        </svg>
    );
}

function subscribeToDesktopViewport(onChange: () => void) {
    const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
    mediaQuery.addEventListener("change", onChange);

    return () => mediaQuery.removeEventListener("change", onChange);
}

function getDesktopViewportSnapshot() {
    return window.matchMedia(DESKTOP_MEDIA_QUERY).matches;
}

function getServerDesktopViewportSnapshot() {
    return false;
}

export default function TempleStayDirectory({
    operators,
}: {
    operators: TempleStayOperatorListItem[];
}) {
    const [query, setQuery] = useState("");
    const [selectedSido, setSelectedSido] = useState("전체");
    const [operatorType, setOperatorType] =
        useState<OperatorTypeFilter>("all");
    const [visibleBatchCount, setVisibleBatchCount] = useState(1);
    const isDesktop = useSyncExternalStore(
        subscribeToDesktopViewport,
        getDesktopViewportSnapshot,
        getServerDesktopViewportSnapshot,
    );
    const operatorBatchSize = isDesktop
        ? DESKTOP_OPERATOR_BATCH_SIZE
        : MOBILE_OPERATOR_BATCH_SIZE;

    const availableSidos = useMemo(
        () =>
            SIDO_ORDER.filter((sido) =>
                operators.some((operator) => operator.sido === sido),
            ),
        [operators],
    );

    const filteredOperators = useMemo(() => {
        const normalizedQuery = query
            .toLocaleLowerCase("ko-KR")
            .replace(/\s+/g, "");

        return operators.filter((operator) => {
            const matchesQuery =
                normalizedQuery.length === 0 ||
                operator.searchText.includes(normalizedQuery);
            const matchesSido =
                selectedSido === "전체" ||
                operator.sido === selectedSido;
            const matchesType =
                operatorType === "all" ||
                operator.operatorType === operatorType;

            return matchesQuery && matchesSido && matchesType;
        });
    }, [operatorType, operators, query, selectedSido]);

    const visibleOperators = filteredOperators.slice(
        0,
        visibleBatchCount * operatorBatchSize,
    );

    function resetVisibleCount() {
        setVisibleBatchCount(1);
    }

    return (
        <main>
            <section className="bg-[#FFF9DC]">
                <div className="mx-auto max-w-6xl px-5 py-11 md:px-8 md:py-16">
                    <p className="text-sm font-medium text-[#766900]">
                        전국 템플스테이 운영처
                    </p>

                    <h1 className="mt-2 text-[34px] font-bold tracking-[-0.045em] md:text-[48px]">
                        템플스테이 운영처 찾기
                    </h1>

                    <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#667085] md:text-base">
                        이름이나 지역으로 운영처를 찾고 공식 템플스테이 안내를 확인하세요.
                    </p>

                    <label className="mt-7 flex max-w-2xl items-center gap-2 rounded-[14px] border border-[#EEE3A7] bg-white p-2 shadow-[0_4px_16px_rgba(25,31,40,0.05)]">
                        <span className="ml-2 text-[#8B95A1]">
                            <SearchIcon />
                        </span>

                        <span className="sr-only">운영처 검색</span>
                        <input
                            type="search"
                            value={query}
                            onChange={(event) => {
                                setQuery(event.target.value);
                                resetVisibleCount();
                            }}
                            placeholder="운영처명 또는 지역 검색"
                            className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm outline-none placeholder:text-[#A8B0BA]"
                        />
                    </label>
                </div>
            </section>

            <section className="border-b border-[#EEF0F2] bg-white">
                <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-8">
                    <div className="flex flex-wrap gap-2" aria-label="운영처 유형">
                        {[
                            { value: "all", label: "전체 운영처" },
                            { value: "temple", label: "사찰 운영처" },
                            { value: "institution", label: "기관 운영처" },
                        ].map((filter) => (
                            <button
                                key={filter.value}
                                type="button"
                                aria-pressed={operatorType === filter.value}
                                onClick={() => {
                                    setOperatorType(
                                        filter.value as OperatorTypeFilter,
                                    );
                                    resetVisibleCount();
                                }}
                                className={`min-h-11 rounded-xl px-4 py-2 text-sm font-medium transition ${operatorType === filter.value
                                    ? "bg-[#F4F54A] text-[#191F28]"
                                    : "border border-[#E3E8EF] bg-white text-[#667085] hover:text-[#252A31]"
                                }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>

                    <label className="flex min-h-11 items-center gap-2 text-sm text-[#667085]">
                        <span>지역</span>
                        <select
                            value={selectedSido}
                            onChange={(event) => {
                                setSelectedSido(event.target.value);
                                resetVisibleCount();
                            }}
                            className="min-h-11 rounded-xl border border-[#E3E8EF] bg-white px-3 text-sm font-medium text-[#252A31] outline-none"
                        >
                            <option value="전체">전체</option>
                            {availableSidos.map((sido) => (
                                <option key={sido} value={sido}>
                                    {sido}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
                <div className="mb-5 flex items-end justify-between gap-4">
                    <h2 className="text-[24px] font-bold tracking-[-0.035em] md:text-[28px]">
                        운영처 목록
                    </h2>

                    <span className="text-sm text-[#8B95A1]" aria-live="polite">
                        총 {filteredOperators.length}곳
                    </span>
                </div>

                {visibleOperators.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {visibleOperators.map((operator) => (
                            <article
                                key={operator.officialId}
                                className="flex min-w-0 flex-col rounded-[22px] border border-[#E3E8EF] bg-white p-5"
                            >
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm text-[#8B95A1]">
                                        {operator.sido} {operator.sigungu}
                                    </p>

                                    <h3 className="mt-2 break-keep text-[20px] font-bold tracking-[-0.025em] text-[#252A31]">
                                        {operator.officialName}
                                    </h3>

                                    <p className="mt-3 break-words text-sm leading-6 text-[#667085]">
                                        {operator.address}
                                    </p>

                                    <section className="mt-5 border-t border-[#EEF0F2] pt-4">
                                        <p className="text-sm font-semibold text-[#4E5968]">
                                            운영 프로그램 {operator.programCount}개
                                        </p>

                                        {operator.programTypes.length > 0 && (
                                            <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs font-medium text-[#8B95A1]">
                                                {operator.programTypes.map(
                                                    (programType) => (
                                                        <span key={programType}>
                                                            {
                                                                PROGRAM_TYPE_LABELS[
                                                                    programType
                                                                ]
                                                            }
                                                        </span>
                                                    ),
                                                )}
                                            </p>
                                        )}
                                    </section>
                                </div>

                                <a
                                    href={operator.officialUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl border border-[#D8DED4] bg-white bg-none px-4 py-3 text-sm font-medium text-[#667060] shadow-none [text-shadow:none] transition-colors hover:border-[#C8D0C3] hover:bg-[#F4F6F1]"
                                >
                                    공식 템플스테이에서 보기 ↗
                                </a>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-[22px] border border-[#E3E8EF] bg-[#F8F9FA] px-5 py-12 text-center text-sm text-[#667085]">
                        검색 조건에 맞는 운영처가 없습니다.
                    </div>
                )}

                {visibleOperators.length < filteredOperators.length && (
                    <div className="mt-8 flex justify-center">
                        <button
                            type="button"
                            onClick={() =>
                                setVisibleBatchCount((count) => count + 1)
                            }
                            className="min-h-11 rounded-xl border border-[#D9DDE3] bg-white px-6 py-3 text-sm font-medium text-[#4E5968] transition hover:border-[#B8BEC6] hover:text-[#252A31]"
                        >
                            운영처 더 보기
                        </button>
                    </div>
                )}
            </section>
        </main>
    );
}
