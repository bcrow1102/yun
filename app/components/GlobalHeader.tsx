"use client";

import { usePathname } from "next/navigation";
import SiteHeader from "./SiteHeader";

export default function GlobalHeader() {
    const pathname = usePathname();

    // 홈은 메인 page.tsx의 헤더를 그대로 사용합니다.
    // 사찰 실무서식과 실무도구는 작업 집중 화면이므로 공통 내비게이션을 숨깁니다.
    const isTempleWorkArea =
        pathname === "/downloads" ||
        pathname.startsWith("/downloads/") ||
        pathname.startsWith("/temple-tools/lantern-tags") ||
        pathname.startsWith("/temple-tools/memorial-tablets");

    if (pathname === "/" || isTempleWorkArea) return null;

    return (
        <div className="hidden md:block">
            <SiteHeader variant="internal" />
        </div>
    );
}
