"use client";

import { useEffect, useRef, useState } from "react";

const ACCOUNT_NUMBER = "1000-3576-9785";

export default function CopyAccountButton() {
    const [copied, setCopied] = useState(false);
    const resetTimerRef = useRef<number | null>(null);

    useEffect(
        () => () => {
            if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
        },
        [],
    );

    const copyAccountNumber = async () => {
        let didCopy = false;

        try {
            await navigator.clipboard.writeText(ACCOUNT_NUMBER);
            didCopy = true;
        } catch {
            const textarea = document.createElement("textarea");
            textarea.value = ACCOUNT_NUMBER;
            textarea.setAttribute("readonly", "");
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            document.body.appendChild(textarea);
            textarea.select();
            didCopy = document.execCommand("copy");
            textarea.remove();
        }

        if (!didCopy) return;

        setCopied(true);
        if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
        resetTimerRef.current = window.setTimeout(() => {
            setCopied(false);
            resetTimerRef.current = null;
        }, 1800);
    };

    return (
        <button
            type="button"
            onClick={copyAccountNumber}
            className="shrink-0 border-b border-[#B8BBA8] px-0.5 py-1 text-[12px] font-normal text-[#667085] transition-colors hover:border-[#6F735C] hover:text-[#30352D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9DB85] focus-visible:ring-offset-2"
            aria-label="후원 계좌번호 복사"
            aria-live="polite"
        >
            {copied ? "복사됨" : "계좌번호 복사"}
        </button>
    );
}
