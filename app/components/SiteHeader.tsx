"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

type SiteHeaderProps = {
    onSearchClick?: () => void;
    variant?: "home" | "internal";
};

const templeMenus = [
    {
        title: "사찰 안내",
        description: "전국 사찰 정보와 기본 안내",
        href: "/temples/guide",
    },
    {
        title: "템플스테이",
        description: "머물며 체험하는 사찰 프로그램",
        href: "/temples/stay",
    },
    {
        title: "사찰음식",
        description: "사찰음식 체험과 교육",
        href: "/temples/food",
    },
];

const resourceMenus = [
    {
        title: "한국의 고승",
        description: "시대별 고승의 삶과 자료를 살펴봅니다",
        href: "/resources/masters",
    },
    {
        title: "부처님 이야기",
        description: "오래 기억하고 싶은 부처님 이야기를 만납니다",
        href: "/stories",
    },
    {
        title: "불교자료",
        description: "원전·역사·학술 자료를 찾아봅니다",
        href: "/resources",
    },
];

function LotusIcon({ className = "h-9 w-9" }: { className?: string }) {
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

function ChevronDownIcon() {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            className="h-3.5 w-3.5"
            aria-hidden="true"
        >
            <path
                d="m6 8 4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function ArrowIcon() {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            className="h-4 w-4"
            aria-hidden="true"
        >
            <path
                d="M4.5 10h10m-3.5-3.5L14.5 10 11 13.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function NavLink({
    href,
    active,
    compact,
    children,
    suppressActiveUnderline = false,
    onMouseEnter,
    onMouseLeave,
}: {
    href: string;
    active: boolean;
    compact: boolean;
    children: ReactNode;
    suppressActiveUnderline?: boolean;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}) {
    return (
        <Link
            href={href}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={`group relative flex items-center text-[15px] font-medium tracking-[-0.02em] transition-colors ${compact ? "h-16" : "h-[76px]"
                } ${active ? "text-[#191F28]" : "text-[#3F4752] hover:text-[#191F28]"}`}
        >
            {children}
            <span
                aria-hidden="true"
                className={`absolute left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-[#F4F54A] transition-all duration-200 ${compact ? "bottom-[10px]" : "bottom-[15px]"
                    } ${active && !suppressActiveUnderline
                        ? "w-6 opacity-100"
                        : "w-0 opacity-0 group-hover:w-5 group-hover:opacity-100"
                    }`}
            />
        </Link>
    );
}

function DropdownMenu({
    label,
    active,
    items,
    widthClass,
    compact,
    suppressActiveUnderline = false,
    onMenuMouseEnter,
    onMenuMouseLeave,
}: {
    label: string;
    active: boolean;
    items: { title: string; description: string; href: string }[];
    widthClass: string;
    compact: boolean;
    suppressActiveUnderline?: boolean;
    onMenuMouseEnter?: () => void;
    onMenuMouseLeave?: () => void;
}) {
    const [open, setOpen] = useState(false);

    return (
        <div
            className={`group relative flex items-center ${compact ? "h-16" : "h-[76px]"}`}
            onMouseEnter={() => {
                setOpen(true);
                onMenuMouseEnter?.();
            }}
            onMouseLeave={() => {
                setOpen(false);
                onMenuMouseLeave?.();
            }}
            onFocusCapture={() => setOpen(true)}
            onBlurCapture={(event) => {
                if (
                    !event.currentTarget.contains(
                        event.relatedTarget as Node | null,
                    )
                ) {
                    setOpen(false);
                }
            }}
            onKeyDown={(event) => {
                if (event.key === "Escape") {
                    setOpen(false);
                    const trigger =
                        event.currentTarget.querySelector<HTMLButtonElement>(
                            "button",
                        );
                    trigger?.focus();
                }
            }}
        >
            <button
                type="button"
                onClick={() => setOpen(true)}
                className={`relative flex items-center gap-1.5 text-[15px] font-medium tracking-[-0.02em] transition-colors ${compact ? "h-16" : "h-[76px]"
                    } ${active ? "text-[#191F28]" : "text-[#3F4752] hover:text-[#191F28]"}`}
                aria-haspopup="menu"
                aria-expanded={open}
            >
                <span>{label}</span>
                <span
                    className={`mt-[1px] text-[#8B95A1] transition-transform duration-200 ${open ? "rotate-180" : ""
                        }`}
                >
                    <ChevronDownIcon />
                </span>
                <span
                    aria-hidden="true"
                    className={`absolute left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-[#F4F54A] transition-all duration-200 ${compact ? "bottom-[10px]" : "bottom-[15px]"
                        } ${active && !suppressActiveUnderline
                            ? "w-6 opacity-100"
                            : "w-0 opacity-0 group-hover:w-5 group-hover:opacity-100"
                        }`}
                />
            </button>

            <div
                className={`absolute left-1/2 z-50 -translate-x-1/2 pt-3 transition-all duration-150 ease-out ${compact ? "top-[52px]" : "top-[64px]"
                    } ${open
                        ? "pointer-events-auto visible translate-y-0 opacity-100"
                        : "pointer-events-none invisible translate-y-1 opacity-0"
                    } ${widthClass}`}
            >
                <div
                    className="overflow-hidden rounded-[22px] border border-[#E7EAE8] bg-white p-2.5 shadow-[0_20px_52px_rgba(25,31,40,0.11)]"
                    role="menu"
                >
                    {items.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            role="menuitem"
                            onClick={(event) => {
                                setOpen(false);
                                event.currentTarget.blur();
                            }}
                            className="group/item relative flex items-center justify-between gap-5 overflow-hidden rounded-[15px] px-[18px] py-4 transition-colors hover:bg-[#F7F8F5] focus:bg-[#F7F8F5] focus:outline-none"
                        >
                            <span
                                aria-hidden="true"
                                className="absolute inset-y-3 left-0 w-[2px] rounded-r-full bg-[#F4F54A] opacity-0 transition-opacity group-hover/item:opacity-100 group-focus/item:opacity-100"
                            />
                            <span className="min-w-0">
                                <strong className="block text-[14px] font-medium tracking-[-0.025em] text-[#252A31]">
                                    {item.title}
                                </strong>
                                <span className="mt-1.5 block whitespace-nowrap text-[12px] font-normal leading-5 text-[#818A95]">
                                    {item.description}
                                </span>
                            </span>
                            <span className="shrink-0 text-[#A7AFB7] transition-all duration-200 group-hover/item:translate-x-0.5 group-hover/item:text-[#4E5968]">
                                <ArrowIcon />
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function SiteHeader({
    onSearchClick,
    variant = "home",
}: SiteHeaderProps) {
    const pathname = usePathname();
    const router = useRouter();
    const compact = variant === "internal";
    const [hoveredNav, setHoveredNav] = useState<string | null>(null);

    const jobsActive = pathname.startsWith("/jobs");
    const promoteActive = pathname.startsWith("/events/promote");
    const eventsActive = pathname.startsWith("/events") && !promoteActive;
    const templesActive = pathname.startsWith("/temples");
    const resourcesActive =
        pathname === "/resources" ||
        pathname.startsWith("/resources/") ||
        pathname.startsWith("/stories");
    const downloadsActive = pathname.startsWith("/downloads");

    return (
        <header className="sticky top-0 z-50 border-b border-[#EFF1F0] bg-white/95 backdrop-blur-md">
            <div
                className={`mx-auto flex max-w-[1400px] items-center justify-between px-10 xl:px-14 ${compact ? "h-16" : "h-[76px]"
                    }`}
            >
                <Link
                    href="/"
                    onClick={(event) => {
                        event.preventDefault();
                        window.location.assign("/");
                    }}
                    className="flex shrink-0 items-center gap-2.5"
                    aria-label="연 홈"
                >
                    <span className="text-[#191F28]">
                        <LotusIcon className={compact ? "h-8 w-8" : "h-9 w-9"} />
                    </span>
                    <span
                        className={`font-semibold tracking-[-0.05em] text-[#191F28] ${compact ? "text-[22px]" : "text-[25px]"
                            }`}
                    >
                        연
                    </span>
                </Link>

                <nav
                    className={`flex h-full items-center gap-7 ${compact ? "xl:gap-7" : "xl:gap-8"}`}
                    aria-label="주요 메뉴"
                >
                    <NavLink
                        href="/jobs"
                        active={jobsActive}
                        compact={compact}
                        suppressActiveUnderline={hoveredNav !== null && hoveredNav !== "jobs"}
                        onMouseEnter={() => setHoveredNav("jobs")}
                        onMouseLeave={() => setHoveredNav(null)}
                    >
                        구인
                    </NavLink>

                    <NavLink
                        href="/events"
                        active={eventsActive}
                        compact={compact}
                        suppressActiveUnderline={hoveredNav !== null && hoveredNav !== "events"}
                        onMouseEnter={() => setHoveredNav("events")}
                        onMouseLeave={() => setHoveredNav(null)}
                    >
                        행사·교육
                    </NavLink>

                    <DropdownMenu
                        label="사찰"
                        active={templesActive}
                        items={templeMenus}
                        widthClass="w-[320px]"
                        compact={compact}
                        suppressActiveUnderline={hoveredNav !== null && hoveredNav !== "temples"}
                        onMenuMouseEnter={() => setHoveredNav("temples")}
                        onMenuMouseLeave={() => setHoveredNav(null)}
                    />

                    <DropdownMenu
                        label="불교자료"
                        active={resourcesActive}
                        items={resourceMenus}
                        widthClass="w-[356px]"
                        compact={compact}
                        suppressActiveUnderline={hoveredNav !== null && hoveredNav !== "resources"}
                        onMenuMouseEnter={() => setHoveredNav("resources")}
                        onMenuMouseLeave={() => setHoveredNav(null)}
                    />

                    <NavLink
                        href="/downloads"
                        active={downloadsActive}
                        compact={compact}
                        suppressActiveUnderline={hoveredNav !== null && hoveredNav !== "downloads"}
                        onMouseEnter={() => setHoveredNav("downloads")}
                        onMouseLeave={() => setHoveredNav(null)}
                    >
                        자료실
                    </NavLink>

                    <Link
                        href="/events/promote"
                        onMouseEnter={() => setHoveredNav("promote")}
                        onMouseLeave={() => setHoveredNav(null)}
                        className={`group relative flex items-center text-[15px] font-medium tracking-[-0.02em] transition-colors ${compact ? "h-16" : "h-[76px]"
                            } ${promoteActive
                                ? "text-[#5F6100]"
                                : "text-[#6F7200] hover:text-[#4F5100]"
                            }`}
                    >
                        <span
                            className={`rounded-full px-3 py-2 transition-colors duration-200 ${promoteActive
                                ? "bg-[#F6F69F] text-[#50520A]"
                                : "bg-[#FCFCDD] text-[#6F7200] group-hover:bg-[#F9F9B9] group-hover:text-[#50520A]"
                                }`}
                        >
                            홍보물 DIY
                        </span>
                        <span
                            aria-hidden="true"
                            className={`absolute left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-[#F4F54A] transition-all duration-200 ${compact ? "bottom-[7px]" : "bottom-[12px]"
                                } ${promoteActive && !(hoveredNav !== null && hoveredNav !== "promote")
                                    ? "w-7 opacity-100"
                                    : "w-0 opacity-0 group-hover:w-5 group-hover:opacity-100"
                                }`}
                        />
                    </Link>
                </nav>

                <div className="ml-5 flex shrink-0 items-center gap-2.5 pl-5">
                    <span
                        aria-hidden="true"
                        className="mr-2 h-6 w-px bg-[#EEF0F2]"
                    />

                    <button
                        type="button"
                        onClick={() => {
                            if (onSearchClick) {
                                onSearchClick();
                                return;
                            }
                            router.push("/search");
                        }}
                        className={`flex items-center justify-center rounded-full text-[#3F4752] transition hover:bg-[#F5F6F7] hover:text-[#191F28] ${compact ? "h-9 w-9" : "h-10 w-10"
                            }`}
                        aria-label="검색"
                    >
                        <SearchIcon />
                    </button>


                    <button
                        type="button"
                        className="px-1.5 py-2 text-[12px] font-medium text-[#252A31]"
                        aria-current="true"
                    >
                        KR
                    </button>
                    <button
                        type="button"
                        className="px-1 py-2 text-[12px] font-normal text-[#A1A8B0] transition hover:text-[#667085]"
                    >
                        EN
                    </button>

                    <button
                        type="button"
                        className={`ml-2 rounded-xl border border-[#DDE1E5] bg-white px-4 text-sm font-medium text-[#343B45] transition hover:border-[#AEB5BC] hover:bg-[#FAFBFB] ${compact ? "py-2" : "py-2.5"
                            }`}
                    >
                        로그인
                    </button>
                </div>
            </div>
        </header>
    );
}
