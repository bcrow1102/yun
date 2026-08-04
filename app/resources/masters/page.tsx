"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { masters, type EraKey } from "./data";

type EraFilter = "all" | EraKey;

const eras: { key: EraFilter; label: string }[] = [
    { key: "all", label: "전체" },
    { key: "silla", label: "삼국·통일신라" },
    { key: "goryeo", label: "고려" },
    { key: "joseon", label: "조선" },
    { key: "modern", label: "근현대" },
];

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

export default function KoreanMastersPage() {
    const [era, setEra] = useState<EraFilter>("all");

    const visibleMasters = useMemo(
        () => masters.filter((master) => era === "all" || master.era === era),
        [era],
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

            <section className="mx-auto max-w-[1180px] px-5 py-8 md:px-8 md:py-12">
                <div
                    className="flex gap-2 overflow-x-auto pb-2"
                    aria-label="시대 선택"
                >
                    {eras.map((item) => (
                        <button
                            key={item.key}
                            type="button"
                            onClick={() => setEra(item.key)}
                            className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-medium transition ${era === item.key
                                ? "bg-[#F4F54A] text-[#252A31]"
                                : "border border-[#E1E4E8] bg-white text-[#737B87] hover:border-[#C9CC73]"
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                <div className="mt-6 flex items-end justify-between gap-4">
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

                    <span className="text-xs text-[#9AA1AB]">
                        28인 연재 목록
                    </span>
                </div>

                {visibleMasters.length > 0 ? (
                    <>
                    <div className="mt-5 grid gap-4 md:grid-cols-3">
                        {visibleMasters.slice(0, 3).map((master) =>
                            master.status === "planned" ? (
                                <article
                                    key={master.slug}
                                    className="relative overflow-hidden rounded-[22px] border border-[#E3E6E0] bg-white p-5"
                                >
                                    <span className="absolute inset-y-5 left-0 w-1 rounded-r-full bg-[#ECEF88]" />

                                    <div className="flex items-start justify-between gap-3">
                                        <span className="flex h-20 w-20 items-center justify-center rounded-[20px] bg-[#F4F6EF] text-[#786B5A]">
                                            <RoofMark />
                                        </span>

                                        <div className="text-right">
                                            <span className="block text-sm font-medium text-[#B0B546]">
                                                {master.number}
                                            </span>

                                            <span className="mt-2 inline-flex rounded-full bg-[#F4F5F2] px-2.5 py-1 text-[11px] text-[#929A8C]">
                                                연재 예정
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-5 flex items-center gap-2 text-xs text-[#777900]">
                                        <span>{master.eraLabel}</span>
                                        <span className="text-[#CDD0D5]">·</span>
                                        <span>{master.years}</span>
                                    </div>

                                    <h3 className="mt-2 text-[21px] font-semibold tracking-[-0.035em]">
                                        {master.name}
                                    </h3>

                                    <p className="mt-2 text-sm text-[#81765F]">
                                        {master.theme}
                                    </p>

                                    <p className="mt-4 text-sm font-normal leading-6 text-[#77808C]">
                                        {master.introduction}
                                    </p>
                                </article>
                            ) : (
                                <Link
                                    key={master.slug}
                                    href={`/resources/masters/${master.slug}`}
                                    className="group relative block overflow-hidden rounded-[24px] border border-[#D9DDC9] bg-white p-5 shadow-[0_8px_24px_rgba(25,31,40,0.05)] transition duration-200 hover:-translate-y-1 hover:border-[#CFD277] hover:shadow-[0_14px_30px_rgba(25,31,40,0.08)] md:p-6"
                                >
                                    <span className="absolute inset-y-5 left-0 w-1 rounded-r-full bg-[#F4F54A]" />

                                    <div className="flex items-start justify-between gap-4">
                                        {master.slug === "wonhyo" ||
                                            master.slug === "wonkwang" ? (
                                            <span className="h-20 w-20 overflow-hidden rounded-[20px] bg-[#F4F6EF]">
                                                <img
                                                    src={`/images/masters/${master.slug}-card.webp`}
                                                    alt={
                                                        master.slug === "wonhyo"
                                                            ? "전해지는 원효대사 초상"
                                                            : "원광법사가 귀산과 추항에게 세속오계를 전하는 장면"
                                                    }
                                                    className="h-full w-full object-cover"
                                                />
                                            </span>
                                        ) : (
                                            <span className="flex h-20 w-20 items-center justify-center rounded-[20px] bg-[#F4F6EF] text-[#786B5A]">
                                                <RoofMark />
                                            </span>
                                        )}

                                        <div className="text-right">
                                            <span className="block text-sm font-medium text-[#A0A60B]">
                                                {master.number}
                                            </span>

                                            <span className="mt-2 inline-flex rounded-full bg-[#F1F3DD] px-2.5 py-1 text-[11px] text-[#717727]">
                                                {master.status === "deep"
                                                    ? "심화 공개"
                                                    : "요약 공개"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-5 flex items-center gap-2 text-xs text-[#777900]">
                                        <span>{master.eraLabel}</span>
                                        <span className="text-[#CDD0D5]">·</span>
                                        <span>{master.years}</span>
                                    </div>

                                    <h3 className="mt-2 text-[23px] font-semibold tracking-[-0.035em]">
                                        {master.name}
                                    </h3>

                                    <p className="mt-2 text-sm text-[#81765F]">
                                        {master.theme}
                                    </p>

                                    <p className="mt-4 text-sm font-normal leading-6 text-[#667085]">
                                        {master.introduction}
                                    </p>

                                    <div className="mt-5 border-t border-[#ECEEE9] pt-4">
                                        <p className="text-xs text-[#8B95A1]">
                                            관련 지역·도량
                                        </p>

                                        <p className="mt-1 text-sm text-[#4E5968]">
                                            {master.place}
                                        </p>
                                    </div>

                                    <span className="mt-5 inline-flex items-center gap-1 rounded-full bg-[#F7F8FA] px-3 py-2 text-xs text-[#68713A] transition group-hover:bg-[#F4F54A] group-hover:text-[#252A31]">
                                        이야기 읽기
                                        <span aria-hidden="true">→</span>
                                    </span>
                                </Link>
                            ),
                        )}
                    </div>

                    {visibleMasters.length > 3 ? (
                        <section className="mt-10" aria-labelledby="all-masters-title">
                            <h2
                                id="all-masters-title"
                                className="text-sm font-semibold text-[#4E5968]"
                            >
                                전체 고승
                            </h2>

                            <div className="mt-3 grid grid-cols-2 gap-x-5 md:grid-cols-3 md:gap-x-7 lg:grid-cols-5 lg:gap-x-8">
                                {visibleMasters.slice(3).map((master) => (
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
                                ))}
                            </div>
                        </section>
                    ) : null}
                    </>
                ) : (
                    <div className="mt-5 rounded-[24px] border border-dashed border-[#D8DCCF] bg-white px-6 py-14 text-center">
                        <p className="text-base font-medium">
                            이 시대의 고승 이야기를 준비하고 있어요.
                        </p>

                        <p className="mt-2 text-sm text-[#8B95A1]">
                            연재가 추가되면 시대별로 차곡차곡 모아둘게요.
                        </p>
                    </div>
                )}

                <aside className="mt-8 rounded-[22px] bg-[#20242C] px-5 py-6 text-white md:flex md:items-center md:justify-between md:px-7">
                    <div>
                        <p className="text-xs text-[#D7D96A]">
                            연의 기록 원칙
                        </p>

                        <p className="mt-2 text-sm font-normal leading-6 text-white/75">
                            역사적 사실, 후대 전승, 민간 설화를 구분하고 원문과
                            참고자료를 함께 밝힙니다.
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
