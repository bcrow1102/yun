"use client";

import { useState } from "react";

const filters = [
    "전체",
    "휴식형",
    "체험형",
    "당일형",
    "1박 2일",
    "2박 이상",
] as const;

type TempleStayFilter = (typeof filters)[number];

export default function TempleStayFilterTabs() {
    const [selectedFilter, setSelectedFilter] =
        useState<TempleStayFilter>("전체");

    return (
        <div className="mx-auto flex max-w-6xl flex-wrap gap-x-5 gap-y-1 px-4 py-3 md:gap-x-7 md:px-8">
            {filters.map((filter) => {
                const isSelected = selectedFilter === filter;

                return (
                    <button
                        key={filter}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => setSelectedFilter(filter)}
                        className={`relative min-h-11 px-1 py-2 text-sm transition-colors duration-200 after:absolute after:inset-x-1 after:bottom-2 after:h-0.5 after:origin-left after:bg-[#D4D93A] after:transition-transform after:duration-200 ${isSelected
                            ? "font-semibold text-[#252A31] after:scale-x-100"
                            : "font-medium text-[#667085] after:scale-x-0 hover:text-[#252A31] focus-visible:text-[#252A31]"
                            }`}
                    >
                        {filter}
                    </button>
                );
            })}
        </div>
    );
}
