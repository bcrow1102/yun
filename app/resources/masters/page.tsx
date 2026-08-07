"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { masters, type EraKey, type Master } from "./data";

type EraFilter = "all" | EraKey;

const eras: { key: EraFilter; label: string }[] = [
    { key: "all", label: "전체" },
    { key: "silla", label: "삼국·통일신라" },
    { key: "goryeo", label: "고려" },
    { key: "joseon", label: "조선" },
    { key: "modern", label: "근현대" },
];

const representativeSlugs: Record<EraKey, string> = {
    silla: "wonhyo",
    goryeo: "gyunyeo",
    joseon: "gihwa",
    modern: "mangong",
};

/*
 * 삽화 편수는 현재 Master 데이터 타입에 포함되어 있지 않으므로
 * 목록 화면 전용 메타정보로 분리한다.
 * 새 일화가 공개되면 해당 slug의 숫자만 수정하면 된다.
 */
const illustratedStoryCounts: Partial<Record<string, number>> = {
    wonhyo: 3,
};

type MasterWithOptionalVideos = Master & {
    videos?: unknown[];
};

function getVideoCount(master: Master) {
    const videos = (master as MasterWithOptionalVideos).videos;
    return Array.isArray(videos) ? videos.length : 0;
}

function getResourceMeta(master: Master) {
    const videoCount = getVideoCount(master);
    const illustratedCount = illustratedStoryCounts[master.slug] ?? 0;
    const items: string[] = [];

    if (videoCount > 0) {
        items.push(`영상자료 ${videoCount}편`);
    }

    if (illustratedCount > 0) {
        items.push(`삽화 일화 ${illustratedCount}편`);
    }

    return items.join(" · ");
}

function getStatusText(master: Master) {
    if (master.status === "planned") {
        return "자료 준비 중";
    }

    if (master.status === "deep") {
        return "심화 자료 공개";
    }

    return "";
}

function LotusMark() {
    return (
        <svg
            viewBox="0 0 32 32"
            fill="none"
            className="h-6 w-6"
            aria-hidden="true"
        >
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

function RoofMark() {
    return (
        <svg
            viewBox="0 0 64 64"
            fill="none"
            className="h-16 w-16"
            aria-hidden="true"
        >
            <path
                d="M8 30c8-1 16-5 24-13 8 8 16 12 24 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M13 31h38M18 32v16M46 32v16M14 49h36"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M25 35v13M39 35v13"
                stroke="currentColor"
                strokeWidth="1.6"
                opacity=".55"
            />
            <circle
                cx="32"
                cy="27"
                r="3"
                fill="#F4F54A"
                stroke="currentColor"
                strokeWidth="1.2"
            />
        </svg>
    );
}

function ArrowMark() {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            className="h-4 w-4"
            aria-hidden="true"
        >
            <path
                d="M4 10h11M11 6l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function MasterPortrait({ master }: { master: Master }) {
    const [hasError, setHasError] = useState(false);

    return (
        <span className="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-[20px] bg-[#F4F6EF] text-[#786B5A] md:h-40 md:w-40">
            {!hasError ? (
                <img
                    src={`/images/masters/${master.slug}-card.webp`}
                    alt={`${master.name} 화상`}
                    className="h-full w-full object-cover"
                    onError={() => setHasError(true)}
                />
            ) : (
                <RoofMark />
            )}
        </span>
    );
}

function RepresentativeCard({ master }: { master: Master }) {
    const resourceMeta = getResourceMeta(master);
    const statusText = getStatusText(master);

    return (
        <Link
            href={`/resources/masters/${master.slug}`}
            className="group mt-5 block overflow-hidden rounded-[20px] border border-[#DEE1DB] bg-white transition-colors duration-200 hover:border-[#BFC4B8]"
        >
            <article className="p-4 md:flex md:items-stretch md:gap-5 md:p-5">
                <div className="flex items-start gap-4 md:contents">
                    <MasterPortrait master={master} />

                    <div className="min-w-0 flex-1 pt-0.5 md:flex md:flex-col md:pt-0">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#7B8490]">
                            <span>{master.eraLabel}</span>
                            <span className="text-[#C9CDD2]">·</span>
                            <span>{master.years}</span>

                            {statusText ? (
                                <>
                                    <span className="hidden text-[#C9CDD2] md:inline">·</span>
                                    <span className="w-full text-[#9AA1AB] md:w-auto">
                                        {statusText}
                                    </span>
                                </>
                            ) : null}
                        </div>

                        <div className="mt-1.5 flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
                            <h3 className="text-[22px] font-semibold tracking-[-0.035em] text-[#20242B] md:text-[27px]">
                                {master.name}
                            </h3>

                            {master.hanja ? (
                                <span className="text-xs text-[#A0A7B0] md:text-sm">
                                    {master.hanja}
                                </span>
                            ) : null}
                        </div>

                        <p className="mt-1 line-clamp-2 text-sm leading-5 text-[#766C59] md:line-clamp-none">
                            {master.theme}
                        </p>

                        <p className="mt-2 hidden line-clamp-2 max-w-[720px] break-keep text-[15px] font-normal leading-7 text-[#667085] md:block">
                            {master.introduction}
                        </p>

                        <div className="mt-auto hidden items-center justify-between gap-4 border-t border-[#ECEEEA] pt-3 md:flex">
                            <p className="min-w-0 truncate text-sm text-[#8B95A1]">
                                {resourceMeta || "관련 자료 준비 중"}
                            </p>

                            <span className="shrink-0 text-[#7B8490] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[#20242B]">
                                <ArrowMark />
                            </span>
                        </div>
                    </div>
                </div>

                <p className="mt-3 line-clamp-2 break-keep text-sm font-normal leading-6 text-[#667085] md:hidden">
                    {master.introduction}
                </p>

                <div className="mt-3 flex items-center justify-between gap-4 border-t border-[#ECEEEA] pt-3 md:hidden">
                    <p className="min-w-0 truncate text-xs text-[#8B95A1]">
                        {resourceMeta || "관련 자료 준비 중"}
                    </p>

                    <span className="shrink-0 text-[#7B8490] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[#20242B]">
                        <ArrowMark />
                    </span>
                </div>
            </article>
        </Link>
    );
}

function CompactMasterCard({
    master,
    hiddenOnMobile = false,
}: {
    master: Master;
    hiddenOnMobile?: boolean;
}) {
    const resourceMeta = getResourceMeta(master);
    const statusText = getStatusText(master);
    const isPlanned = master.status === "planned";

    const cardClassName = [
        "group block overflow-hidden rounded-[18px] border border-[#E2E5DF] bg-white",
        "transition-colors duration-200",
        isPlanned ? "" : "hover:border-[#BFC4B8]",
        hiddenOnMobile ? "hidden md:block" : "",
    ]
        .filter(Boolean)
        .join(" ");

    const content = (
        <article className="flex h-full flex-col p-4 md:p-5">
            <div className="flex items-start gap-3">
                <span className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[18px] bg-[#F4F6EF] text-[#786B5A]">
                    {!isPlanned ? (
                        <img
                            src={`/images/masters/${master.slug}-card.webp`}
                            alt={`${master.name} 화상`}
                            className="h-full w-full object-cover"
                            onError={(event) => {
                                event.currentTarget.style.display = "none";
                            }}
                        />
                    ) : (
                        <RoofMark />
                    )}
                </span>

                <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px] text-[#7B8490]">
                        <span>{master.eraLabel}</span>
                        <span className="text-[#CDD0D5]">·</span>
                        <span>{master.years}</span>
                    </div>

                    <h3 className="mt-1 text-[20px] font-semibold tracking-[-0.035em] text-[#20242B]">
                        {master.name}
                    </h3>

                    <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-[#766C59]">
                        {master.theme}
                    </p>
                </div>
            </div>

            <p className="mt-3 line-clamp-2 break-keep text-sm font-normal leading-6 text-[#667085]">
                {master.introduction}
            </p>

            <div className="mt-auto flex min-h-5 items-center justify-between gap-3 border-t border-[#ECEEEA] pt-3">
                <p className="min-w-0 truncate text-xs text-[#939AA4]">
                    {resourceMeta || statusText || "관련 자료 준비 중"}
                </p>

                {!isPlanned ? (
                    <span className="shrink-0 text-[#8B95A1] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[#20242B]">
                        <ArrowMark />
                    </span>
                ) : null}
            </div>
        </article>
    );

    if (isPlanned) {
        return <div className={cardClassName}>{content}</div>;
    }

    return (
        <Link
            href={`/resources/masters/${master.slug}`}
            className={cardClassName}
        >
            {content}
        </Link>
    );
}

function MasterIndexList({
    items,
    startIndex = 0,
}: {
    items: Master[];
    startIndex?: number;
}) {
    return (
        <div className="mt-3 grid grid-cols-2 gap-x-5 md:grid-cols-3 md:gap-x-7 lg:grid-cols-5 lg:gap-x-8">
            {items.slice(startIndex).map((master) =>
                master.status === "planned" ? (
                    <div
                        key={master.slug}
                        className="flex min-h-12 items-center gap-2.5 border-b border-[#E1E4E8]"
                    >
                        <span className="shrink-0 text-xs tabular-nums text-[#B0B8C1]">
                            {master.number.padStart(2, "0")}
                        </span>
                        <span className="truncate text-sm text-[#8A929D]">
                            {master.name}
                        </span>
                    </div>
                ) : (
                    <Link
                        key={master.slug}
                        href={`/resources/masters/${master.slug}`}
                        className="group flex min-h-12 items-center gap-2.5 border-b border-[#E1E4E8] transition-colors hover:border-[#B8BEC7]"
                    >
                        <span className="shrink-0 text-xs tabular-nums text-[#B0B8C1]">
                            {master.number.padStart(2, "0")}
                        </span>
                        <span className="truncate text-sm font-medium text-[#343B45] transition-colors group-hover:text-[#171B22]">
                            {master.name}
                        </span>
                    </Link>
                ),
            )}
        </div>
    );
}

export default function KoreanMastersPage() {
    const [era, setEra] = useState<EraFilter>("all");
    const [isMobileListExpanded, setIsMobileListExpanded] = useState(false);

    const visibleMasters = useMemo(
        () => masters.filter((master) => era === "all" || master.era === era),
        [era],
    );

    const representativeMaster = useMemo(
        () =>
            era === "all"
                ? undefined
                : masters.find((master) => master.slug === representativeSlugs[era]),
        [era],
    );

    const remainingMasters = useMemo(
        () =>
            representativeMaster
                ? visibleMasters.filter(
                    (master) => master.slug !== representativeMaster.slug,
                )
                : visibleMasters,
        [representativeMaster, visibleMasters],
    );

    return (
        <main className="min-h-screen bg-[#F7F8FA] text-[#171B22]">
            <header className="border-b border-[#E9EBEE] bg-white">
                <div className="mx-auto flex h-[68px] max-w-[1180px] items-center justify-between px-5 md:px-8">
                    <Link
                        href="/"
                        className="flex items-center gap-2.5"
                        aria-label="연 홈"
                    >
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F4F54A]">
                            <LotusMark />
                        </span>
                        <span className="text-2xl font-semibold">연</span>
                    </Link>

                    <Link
                        href="/resources"
                        className="rounded-full border border-[#DFE2E7] px-4 py-2 text-sm text-[#56606D]"
                    >
                        불교자료
                    </Link>
                </div>
            </header>

            <section className="border-b border-[#E8EAE5] bg-[#F4F6EF]">
                <div className="mx-auto max-w-[1180px] px-5 py-12 md:px-8 md:py-16">
                    <p className="text-sm font-medium text-[#777900]">
                        연의 한국불교 아카이브
                    </p>

                    <h1 className="mt-2 text-[34px] font-semibold tracking-[-0.045em] md:text-[48px]">
                        시대별로 만나는 한국의 고승
                    </h1>

                    <p className="mt-4 max-w-[720px] text-[15px] font-normal leading-7 text-[#667085] md:text-base">
                        한 인물의 생애와 사상, 민간에 전해진 이야기와 원문을 함께
                        살펴봅니다. 역사적 기록과 후대 전승을 구분하고 출전을 확인해
                        차근차근 쌓아갑니다.
                    </p>
                </div>
            </section>

            <section className="mx-auto max-w-[1180px] px-5 py-8 md:px-8 md:py-11">
                <div
                    className="-mx-5 overflow-x-auto border-b border-[#E1E4E8] px-5 md:mx-0 md:px-0"
                    aria-label="시대 선택"
                >
                    <div className="flex min-w-max gap-7 md:min-w-0 md:gap-9">
                        {eras.map((item) => {
                            const isActive = era === item.key;

                            return (
                                <button
                                    key={item.key}
                                    type="button"
                                    onClick={() => {
                                        setEra(item.key);
                                        setIsMobileListExpanded(false);
                                    }}
                                    aria-pressed={isActive}
                                    className={`relative shrink-0 pb-3 text-sm transition-colors ${isActive
                                        ? "font-semibold text-[#20242B]"
                                        : "font-normal text-[#7B8490] hover:text-[#343B45]"
                                        }`}
                                >
                                    {item.label}

                                    {isActive ? (
                                        <span className="absolute inset-x-0 bottom-[-1px] h-0.5 bg-[#F4F54A]" />
                                    ) : null}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-7 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-sm text-[#8B95A1]">
                            {eras.find((item) => item.key === era)?.label}
                        </p>

                        <h2 className="mt-1 text-2xl font-semibold tracking-[-0.035em]">
                            {visibleMasters.length > 0
                                ? `${visibleMasters.length}명의 고승`
                                : "연재 준비 중"}
                        </h2>
                    </div>

                    <span className="text-xs text-[#9AA1AB]">28인 연재 목록</span>
                </div>

                {visibleMasters.length > 0 ? (
                    <>
                        {representativeMaster ? (
                            <RepresentativeCard master={representativeMaster} />
                        ) : (
                            <div className="mt-5 grid gap-4 md:grid-cols-3">
                                {visibleMasters.slice(0, 3).map((master, index) => (
                                    <CompactMasterCard
                                        key={master.slug}
                                        master={master}
                                        hiddenOnMobile={index > 0}
                                    />
                                ))}
                            </div>
                        )}

                        {era === "all" && visibleMasters.length > 1 ? (
                            <section
                                className="mt-9 md:hidden"
                                aria-labelledby="mobile-all-masters-title"
                            >
                                <h2
                                    id="mobile-all-masters-title"
                                    className="text-sm font-semibold text-[#4E5968]"
                                >
                                    전체 고승
                                </h2>

                                <MasterIndexList
                                    items={
                                        isMobileListExpanded
                                            ? visibleMasters
                                            : visibleMasters.slice(0, 7)
                                    }
                                    startIndex={1}
                                />

                                {visibleMasters.length > 7 ? (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsMobileListExpanded((expanded) => !expanded)
                                        }
                                        className="mt-4 w-full py-2 text-center text-sm font-medium text-[#667085] transition-colors hover:text-[#20242B]"
                                    >
                                        {isMobileListExpanded
                                            ? "목록 접기 ↑"
                                            : `나머지 ${visibleMasters.length - 7}명 보기 ↓`}
                                    </button>
                                ) : null}
                            </section>
                        ) : null}

                        {era === "all" && visibleMasters.length > 3 ? (
                            <section
                                className="mt-9 hidden md:block"
                                aria-labelledby="all-masters-title"
                            >
                                <h2
                                    id="all-masters-title"
                                    className="text-sm font-semibold text-[#4E5968]"
                                >
                                    전체 고승
                                </h2>

                                <MasterIndexList items={visibleMasters} startIndex={3} />
                            </section>
                        ) : null}

                        {era !== "all" && remainingMasters.length > 0 ? (
                            <section className="mt-9" aria-labelledby="era-masters-title">
                                <h2
                                    id="era-masters-title"
                                    className="text-sm font-semibold text-[#4E5968]"
                                >
                                    이 시대의 다른 고승
                                </h2>

                                <MasterIndexList items={remainingMasters} />
                            </section>
                        ) : null}
                    </>
                ) : (
                    <div className="mt-5 border-y border-[#D8DCCF] bg-white px-6 py-12 text-center">
                        <p className="text-base font-medium">
                            이 시대의 고승 이야기를 준비하고 있어요.
                        </p>

                        <p className="mt-2 text-sm text-[#8B95A1]">
                            연재가 추가되면 시대별로 차곡차곡 모아둘게요.
                        </p>
                    </div>
                )}

                <aside className="mt-8 rounded-[18px] bg-[#20242C] px-5 py-6 text-white md:flex md:items-center md:justify-between md:px-7">
                    <div>
                        <p className="text-xs text-[#D7D96A]">연의 기록 원칙</p>

                        <p className="mt-2 text-sm font-normal leading-6 text-white/75">
                            역사적 사실, 후대 전승, 민간 설화를 구분하고 원문과 참고자료를
                            함께 밝힙니다.
                        </p>
                    </div>

                    <Link
                        href="/resources"
                        className="mt-4 inline-flex rounded-full bg-white px-4 py-2.5 text-sm font-medium text-[#252A31] md:mt-0"
                    >
                        불교자료 둘러보기
                    </Link>
                </aside>
            </section>
        </main>
    );
}
