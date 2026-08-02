"use client";

import { useEffect, useState } from "react";

const SHOW_AFTER = 500;

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const updateVisibility = () => {
            setIsVisible(window.scrollY >= SHOW_AFTER);
        };

        updateVisibility();
        window.addEventListener("scroll", updateVisibility, { passive: true });

        return () => window.removeEventListener("scroll", updateVisibility);
    }, []);

    const moveToTop = () => {
        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;

        window.scrollTo({
            top: 0,
            behavior: reduceMotion ? "auto" : "smooth",
        });
    };

    return (
        <button
            type="button"
            onClick={moveToTop}
            aria-label="페이지 맨 위로 이동"
            aria-hidden={!isVisible}
            tabIndex={isVisible ? 0 : -1}
            className={`fixed right-4 z-50 flex h-14 w-12 flex-col items-center justify-center rounded-2xl border border-[#DDE1E5] bg-white/90 text-[#4E5968] shadow-[0_8px_24px_rgba(25,31,40,0.14)] backdrop-blur transition duration-300 hover:border-[#E4E536] hover:bg-[#F4F54A] hover:text-[#252A31] active:scale-95 md:bottom-6 md:right-6 ${isVisible
                    ? "pointer-events-auto bottom-[calc(env(safe-area-inset-bottom)+5.75rem)] translate-y-0 opacity-100"
                    : "pointer-events-none bottom-[calc(env(safe-area-inset-bottom)+5.75rem)] translate-y-3 opacity-0"
                }`}
        >
            <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4"
                aria-hidden="true"
            >
                <path
                    d="m6.5 13.5 5.5-5.5 5.5 5.5M12 8v9"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
            <span className="mt-0.5 text-[11px] font-medium leading-none">
                Top
            </span>
        </button>
    );
}
