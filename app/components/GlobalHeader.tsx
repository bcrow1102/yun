"use client";

import { usePathname } from "next/navigation";
import MobileHeader from "./MobileHeader";
import SiteHeader from "./SiteHeader";

const minimalDesktopHeaderRoutes = new Set([
    "/events",
    "/jobs",
    "/temples",
    "/temples/guide",
    "/temples/stay",
    "/temples/food",
    "/downloads",
    "/resources",
    "/resources/masters",
    "/resources/masters/academic",
    "/resources/masters/illustrations",
    "/stories",
]);

export default function GlobalHeader() {
    const pathname = usePathname();

    // 홈은 메인 page.tsx의 헤더를 그대로 사용합니다.
    // 사찰 실무도구 상세는 작업 집중 화면이므로 공통 내비게이션을 숨깁니다.
    const isTempleWorkDetail =
        pathname.startsWith("/downloads/") ||
        pathname.startsWith("/temple-tools/lantern-tags") ||
        pathname.startsWith("/temple-tools/memorial-tablets");
    const usesMinimalDesktopHeader = minimalDesktopHeaderRoutes.has(pathname);

    if (pathname === "/") return null;

    return (
        <>
            {!isTempleWorkDetail && pathname !== "/downloads" && (
                <MobileHeader />
            )}

            {!isTempleWorkDetail && (
                <div className="desktop-site-header hidden md:block">
                    <SiteHeader
                        variant={usesMinimalDesktopHeader ? "minimal" : "internal"}
                    />
                </div>
            )}
        </>
    );
}
