"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const featuredJobs = [
    {
        id: 1,
        temple: "조계사",
        title: "사무행정 담당자 모집",
        location: "서울 종로구",
        date: "~07.31",
        type: "정규직",
    },
    {
        id: 2,
        temple: "해인사",
        title: "문화해설 자원봉사자",
        location: "경남 합천",
        date: "~08.15",
        type: "봉사",
    },
    {
        id: 3,
        temple: "불국사",
        title: "템플스테이 코디네이터",
        location: "경북 경주",
        date: "~08.05",
        type: "계약직",
    },
    {
        id: 4,
        temple: "봉은사",
        title: "종무행정 실무자 채용",
        location: "서울 강남구",
        date: "~08.10",
        type: "정규직",
    },
    {
        id: 5,
        temple: "통도사",
        title: "사찰 안내 및 방문객 응대",
        location: "경남 양산",
        date: "~08.20",
        type: "계약직",
    },
    {
        id: 6,
        temple: "월정사",
        title: "템플스테이 운영 보조",
        location: "강원 평창",
        date: "~08.18",
        type: "계약직",
    },
];

const generalJobs = [
    {
        id: 101,
        temple: "진관사",
        title: "공양간 조리 및 운영 담당자 모집",
        location: "서울",
        date: "~08.22",
        type: "정규직",
    },
    {
        id: 102,
        temple: "수덕사",
        title: "종무소 행정직원 채용",
        location: "충남",
        date: "~08.25",
        type: "정규직",
    },
    {
        id: 103,
        temple: "백양사",
        title: "템플스테이 프로그램 진행자",
        location: "전남",
        date: "~08.29",
        type: "계약직",
    },
    {
        id: 104,
        temple: "전등사",
        title: "사찰 시설관리 담당자 모집",
        location: "인천",
        date: "~08.30",
        type: "계약직",
    },
    {
        id: 105,
        temple: "법주사",
        title: "문화재 안내 자원봉사자 모집",
        location: "충북",
        date: "상시",
        type: "봉사",
    },
    {
        id: 106,
        temple: "송광사",
        title: "사찰 회계 및 사무보조 채용",
        location: "전남",
        date: "~09.02",
        type: "정규직",
    },
    {
        id: 107,
        temple: "범어사",
        title: "불교문화 교육행사 운영 보조",
        location: "부산",
        date: "~09.05",
        type: "계약직",
    },
    {
        id: 108,
        temple: "마곡사",
        title: "방문객 안내 및 매표 담당자",
        location: "충남",
        date: "~09.06",
        type: "계약직",
    },
    {
        id: 109,
        temple: "대흥사",
        title: "템플스테이 객실관리 담당자",
        location: "전남",
        date: "~09.08",
        type: "계약직",
    },
    {
        id: 110,
        temple: "동화사",
        title: "사찰 홍보 콘텐츠 제작자 모집",
        location: "대구",
        date: "~09.10",
        type: "정규직",
    },
    {
        id: 111,
        temple: "화엄사",
        title: "주말 행사 진행 자원봉사자",
        location: "전남",
        date: "상시",
        type: "봉사",
    },
    {
        id: 112,
        temple: "용주사",
        title: "종무행정 경력직 채용",
        location: "경기",
        date: "~09.12",
        type: "정규직",
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

function ChevronIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-4 w-4"
        >
            <path
                d="m9 5 7 7-7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default function JobsPage() {
    const [keyword, setKeyword] = useState("");
    const [location, setLocation] = useState("전체 지역");
    const [jobType, setJobType] = useState("전체 형태");
    const [page, setPage] = useState(1);

    const pageSize = 10;

    const filteredJobs = useMemo(() => {
        return generalJobs.filter((job) => {
            const matchesKeyword = `${job.temple} ${job.title}`.includes(
                keyword.trim()
            );

            const matchesLocation =
                location === "전체 지역" || job.location === location;

            const matchesType =
                jobType === "전체 형태" || job.type === jobType;

            return matchesKeyword && matchesLocation && matchesType;
        });
    }, [keyword, location, jobType]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredJobs.length / pageSize)
    );

    const visibleJobs = filteredJobs.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    function updateFilter(action: () => void) {
        action();
        setPage(1);
    }

    return (
        <div className="min-h-screen bg-white text-[#191F28]">
            <header className="sticky top-0 z-30 border-b border-[#F2F4F6] bg-white/95 backdrop-blur">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:h-[72px] md:px-8">
                    <Link href="/" className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FEE500] md:h-10 md:w-10">
                            <LotusIcon />
                        </span>

                        <strong className="text-xl font-bold tracking-[-0.04em]">
                            연
                        </strong>
                    </Link>

                    <nav className="hidden items-center gap-1 md:flex">
                        <Link
                            href="/jobs"
                            className="rounded-xl bg-[#FFF9C4] px-4 py-2.5 text-sm font-bold"
                        >
                            구인
                        </Link>

                        <Link
                            href="/job-seekers"
                            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#4E5968] hover:bg-[#F2F4F6]"
                        >
                            구직
                        </Link>

                        <Link
                            href="/events"
                            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#4E5968] hover:bg-[#F2F4F6]"
                        >
                            행사·교육
                        </Link>

                        <Link
                            href="/temple-stays"
                            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#4E5968] hover:bg-[#F2F4F6]"
                        >
                            템플스테이
                        </Link>

                        <Link
                            href="/temple-food"
                            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#4E5968] hover:bg-[#F2F4F6]"
                        >
                            사찰음식
                        </Link>
                    </nav>

                    <div className="flex items-center gap-1">
                        <Link
                            href="/search"
                            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#F2F4F6]"
                            aria-label="검색"
                        >
                            <SearchIcon />
                        </Link>

                        <Link
                            href="/login"
                            className="ml-1 rounded-xl bg-[#FEE500] px-4 py-2.5 text-sm font-bold"
                        >
                            로그인
                        </Link>
                    </div>
                </div>
            </header>

            <main>
                <section className="bg-[#FEE500]">
                    <div className="mx-auto max-w-6xl px-5 py-7 md:px-8 md:py-11">
                        <p className="text-sm font-semibold text-[#6D6200]">
                            사찰과 불교기관의 채용정보
                        </p>

                        <div className="mt-2">
                            <div className="flex items-center justify-between gap-4">
                                <h1 className="text-[34px] font-bold tracking-[-0.05em] md:text-[42px]">
                                    구인
                                </h1>

                                <Link
                                    href="/jobs/new"
                                    className="shrink-0 rounded-xl bg-[#191F28] px-4 py-2.5 text-sm font-medium text-white md:px-5 md:py-3"
                                >
                                    구인 등록
                                </Link>
                            </div>

                            <p className="mt-2 text-sm text-[#514A00] md:text-base">
                                나에게 맞는 사찰과 불교기관의 일자리를 찾아보세요.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-6xl px-4 py-7 md:px-8 md:py-8">
                    <div className="mb-4 flex items-end justify-between">
                        <div>
                            <span className="mb-1 block text-xs font-bold text-[#B39F00]">
                                상단 추천
                            </span>

                            <h2 className="text-xl font-bold md:text-[22px]">
                                추천 구인
                            </h2>
                        </div>

                        <span className="text-sm text-[#8B95A1]">
                            총 {featuredJobs.length}건
                        </span>
                    </div>

                    <div className="grid gap-2.5 sm:grid-cols-2 md:grid-cols-3">
                        {featuredJobs.map((job) => (
                            <Link
                                key={job.id}
                                href={`/jobs/${job.id}`}
                                className="group cursor-pointer rounded-[16px] border border-[#F2F4F6] bg-white p-3.5 shadow-[0_4px_14px_rgba(25,31,40,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_9px_22px_rgba(25,31,40,0.08)]"
                            >
                                <div className="flex items-center justify-between gap-2.5">
                                    <div className="min-w-0 flex-1">
                                        <div className="mb-1.5 flex items-center gap-1.5">
                                            <span className="truncate text-[11px] font-medium text-[#8B95A1]">
                                                {job.temple}
                                            </span>

                                            <span className="shrink-0 rounded-full bg-[#FFF9C4] px-2 py-0.5 text-[10px] font-semibold text-[#6D6200]">
                                                {job.type}
                                            </span>
                                        </div>

                                        <h3 className="truncate text-sm font-bold tracking-[-0.025em]">
                                            {job.title}
                                        </h3>

                                        <p className="mt-1.5 truncate text-xs text-[#8B95A1]">
                                            {job.location} · {job.date}
                                        </p>
                                    </div>

                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[#FFFBE0] text-[#6D6200]">
                                        <ChevronIcon />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="border-t border-[#F2F4F6] bg-[#FAFAFA]">
                    <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-10">
                        <div className="mb-5 flex items-end justify-between">
                            <div>
                                <span className="mb-1 block text-xs font-bold text-[#8B95A1]">
                                    전체 게시판
                                </span>

                                <h2 className="text-xl font-bold md:text-2xl">
                                    전체 구인
                                </h2>
                            </div>

                            <span className="text-sm text-[#8B95A1]">
                                총 {filteredJobs.length}건
                            </span>
                        </div>

                        <div className="mb-4 grid gap-2 rounded-[18px] bg-white p-3 shadow-[0_5px_18px_rgba(25,31,40,0.04)] md:grid-cols-[1fr_160px_160px]">
                            <label className="flex h-11 items-center gap-2 rounded-xl bg-[#F7F8FA] px-4">
                                <SearchIcon />

                                <input
                                    value={keyword}
                                    onChange={(event) =>
                                        updateFilter(() => setKeyword(event.target.value))
                                    }
                                    placeholder="기관명 또는 제목 검색"
                                    className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#ADB5BD]"
                                />
                            </label>

                            <select
                                value={location}
                                onChange={(event) =>
                                    updateFilter(() => setLocation(event.target.value))
                                }
                                className="h-11 rounded-xl bg-[#F7F8FA] px-4 text-sm outline-none"
                            >
                                <option>전체 지역</option>
                                <option>서울</option>
                                <option>경기</option>
                                <option>인천</option>
                                <option>부산</option>
                                <option>대구</option>
                                <option>충남</option>
                                <option>충북</option>
                                <option>전남</option>
                            </select>

                            <select
                                value={jobType}
                                onChange={(event) =>
                                    updateFilter(() => setJobType(event.target.value))
                                }
                                className="h-11 rounded-xl bg-[#F7F8FA] px-4 text-sm outline-none"
                            >
                                <option>전체 형태</option>
                                <option>정규직</option>
                                <option>계약직</option>
                                <option>봉사</option>
                            </select>
                        </div>

                        <div className="overflow-hidden rounded-[18px] border border-[#F2F4F6] bg-white">
                            <div className="hidden grid-cols-[90px_1fr_90px_90px_80px] gap-3 border-b border-[#F2F4F6] bg-[#FCFCFC] px-5 py-3 text-xs font-semibold text-[#8B95A1] md:grid">
                                <span>기관</span>
                                <span>제목</span>
                                <span>지역</span>
                                <span>형태</span>
                                <span className="text-right">마감</span>
                            </div>

                            {visibleJobs.length > 0 ? (
                                visibleJobs.map((job) => (
                                    <Link
                                        key={job.id}
                                        href={`/jobs/${job.id}`}
                                        className="flex w-full flex-col items-start gap-1 border-b border-[#F2F4F6] px-4 py-3 text-left last:border-b-0 hover:bg-[#FFFDF0] md:grid md:grid-cols-[90px_1fr_90px_90px_80px] md:items-center md:gap-3 md:px-5"
                                    >
                                        <span className="text-xs font-medium text-[#8B95A1] md:text-sm">
                                            {job.temple}
                                        </span>

                                        <span className="min-w-0">
                                            <span className="block truncate text-sm font-normal text-[#333D4B] md:text-[15px]">
                                                {job.title}
                                            </span>

                                            <span className="mt-1 block text-xs text-[#8B95A1] md:hidden">
                                                {job.location} · {job.type} · {job.date}
                                            </span>
                                        </span>

                                        <span className="hidden text-sm text-[#6B7684] md:block">
                                            {job.location}
                                        </span>

                                        <span className="hidden text-sm text-[#6B7684] md:block">
                                            {job.type}
                                        </span>

                                        <span className="hidden text-right text-sm text-[#6B7684] md:block">
                                            {job.date}
                                        </span>
                                    </Link>
                                ))
                            ) : (
                                <div className="px-5 py-14 text-center text-sm text-[#8B95A1]">
                                    검색 결과가 없습니다.
                                </div>
                            )}
                        </div>

                        {totalPages > 1 && (
                            <div className="mt-6 flex items-center justify-center gap-2">
                                <button
                                    onClick={() =>
                                        setPage((current) => Math.max(1, current - 1))
                                    }
                                    disabled={page === 1}
                                    className="h-10 rounded-xl border border-[#E5E8EB] px-3 text-sm disabled:cursor-not-allowed disabled:opacity-35"
                                >
                                    이전
                                </button>

                                {Array.from(
                                    { length: totalPages },
                                    (_, index) => index + 1
                                ).map((number) => (
                                    <button
                                        key={number}
                                        onClick={() => setPage(number)}
                                        className={`h-10 w-10 rounded-xl text-sm font-bold ${page === number
                                            ? "bg-[#FEE500]"
                                            : "border border-[#E5E8EB] bg-white"
                                            }`}
                                    >
                                        {number}
                                    </button>
                                ))}

                                <button
                                    onClick={() =>
                                        setPage((current) =>
                                            Math.min(totalPages, current + 1)
                                        )
                                    }
                                    disabled={page === totalPages}
                                    className="h-10 rounded-xl border border-[#E5E8EB] px-3 text-sm disabled:cursor-not-allowed disabled:opacity-35"
                                >
                                    다음
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}