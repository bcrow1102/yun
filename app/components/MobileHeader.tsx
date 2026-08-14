"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type ParentRoute = {
    href: string;
    label: string;
};

function BackIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <path
                d="m15 18-6-6 6-6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function SearchIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5"
            aria-hidden="true"
        >
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

function LotusIcon() {
    return (
        <svg
            viewBox="0 0 32 32"
            fill="none"
            className="h-5 w-5"
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

function getParentRoute(pathname: string): ParentRoute {
    const parts = pathname.split("/").filter(Boolean);

    if (pathname.startsWith("/resources/masters/")) {
        const slug = parts[2];

        if (parts[3] === "illustrations" && parts.length >= 5) {
            return {
                href: `/resources/masters/${slug}/illustrations`,
                label: "삽화 일화",
            };
        }

        if (parts.length >= 4) {
            return {
                href: `/resources/masters/${slug}`,
                label: "인물 개요",
            };
        }

        return {
            href: "/resources/masters",
            label: "한국의 고승",
        };
    }

    if (pathname === "/resources/masters") {
        return {
            href: "/",
            label: "홈",
        };
    }

    if (pathname.startsWith("/temples/guide/")) {
        return {
            href: "/temples/guide",
            label: "사찰 안내",
        };
    }

    if (pathname === "/temples/guide") {
        return {
            href: "/",
            label: "홈",
        };
    }

    if (pathname.startsWith("/temples/stay/")) {
        return {
            href: "/temples/stay",
            label: "템플스테이",
        };
    }

    if (pathname === "/temples/stay") {
        return {
            href: "/temples/guide",
            label: "사찰",
        };
    }

    if (pathname.startsWith("/temples/food/")) {
        return {
            href: "/temples/food",
            label: "사찰음식",
        };
    }

    if (pathname === "/temples/food") {
        return {
            href: "/temples/guide",
            label: "사찰",
        };
    }

    if (pathname.startsWith("/events/") && pathname !== "/events/promote") {
        return {
            href: "/events",
            label: "행사·교육",
        };
    }

    if (pathname === "/events") {
        return {
            href: "/",
            label: "홈",
        };
    }

    if (pathname.startsWith("/jobs/")) {
        return {
            href: "/jobs",
            label: "구인",
        };
    }

    if (pathname === "/jobs") {
        return {
            href: "/",
            label: "홈",
        };
    }

    if (pathname.startsWith("/stories/")) {
        return {
            href: "/stories",
            label: "부처님 이야기",
        };
    }

    if (pathname === "/stories") {
        return {
            href: "/",
            label: "홈",
        };
    }

    if (pathname.startsWith("/resources/")) {
        return {
            href: "/resources",
            label: "불교자료",
        };
    }

    if (pathname === "/resources") {
        return {
            href: "/",
            label: "홈",
        };
    }

    if (pathname.startsWith("/downloads/")) {
        return {
            href: "/downloads",
            label: "자료실",
        };
    }

    if (pathname === "/downloads") {
        return {
            href: "/",
            label: "홈",
        };
    }

    if (pathname === "/events/promote") {
        return {
            href: "/",
            label: "홈",
        };
    }

    return {
        href: "/",
        label: "홈",
    };
}

export default function MobileHeader() {
    const pathname = usePathname();
    const parent = getParentRoute(pathname);

    return (
        <header className="mobile-site-header sticky top-0 z-50 border-b border-[#ECEEEB] bg-white/95 backdrop-blur md:hidden">
            <div className="flex h-14 items-center justify-between gap-3 px-4">
                <Link
                    href={parent.href}
                    className="flex min-w-0 items-center gap-1.5 text-[14px] font-medium tracking-[-0.02em] text-[#4D555D]"
                    aria-label={`${parent.label}로 이동`}
                >
                    <BackIcon />
                    <span className="truncate">{parent.label}</span>
                </Link>

                <div className="flex shrink-0 items-center gap-1">
                    <Link
                        href="/"
                        className="flex h-9 items-center gap-1.5 rounded-xl px-2 text-[#252A31]"
                        aria-label="연 홈"
                    >
                        <LotusIcon />
                        <span className="text-[15px] font-semibold tracking-[-0.04em]">
                            연
                        </span>
                    </Link>

                    <Link
                        href="/search"
                        className="flex h-9 w-9 items-center justify-center rounded-full text-[#4D555D] transition-colors active:bg-[#F2F4F1]"
                        aria-label="검색"
                    >
                        <SearchIcon />
                    </Link>
                </div>
            </div>
        </header>
    );
}
