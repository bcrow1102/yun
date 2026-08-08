"use client";

import { usePathname } from "next/navigation";
import MobileHeader from "./MobileHeader";
import SiteHeader from "./SiteHeader";

export default function GlobalHeader() {
    const pathname = usePathname();

    // 홈은 기존 MobileHome / 메인 page.tsx의 헤더를 그대로 사용합니다.
    if (pathname === "/") return null;

    return (
        <>
            <MobileHeader />

            <div className="hidden md:block">
                <SiteHeader variant="internal" />
            </div>
        </>
    );
}
