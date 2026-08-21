import Link from "next/link";

import TempleStayDirectory, {
    type TempleStayOperatorListItem,
} from "./TempleStayDirectory";
import {
    getTempleStayOperatorSearchValues,
    templeStayOperators,
} from "./operators";
import { getTempleStayProgramsByOperatorOfficialId } from "./programs";

function TempleCategoryNav() {
    const menus = [
        { label: "사찰 안내", href: "/temples/guide", active: false },
        { label: "템플스테이", href: "/temples/stay", active: true },
        { label: "사찰음식", href: "/temples/food", active: false },
    ];

    return (
        <nav
            className="temple-category-nav sticky top-14 z-20 border-b border-[#E7E9EC] bg-white/95 backdrop-blur md:hidden"
            aria-label="사찰 서비스"
        >
            <div className="mx-auto grid max-w-6xl grid-cols-3 gap-1 px-4 py-2.5 md:px-8">
                {menus.map((menu) => (
                    <Link
                        key={menu.href}
                        href={menu.href}
                        aria-current={menu.active ? "page" : undefined}
                        className={`flex min-h-11 items-center justify-center rounded-xl px-2 text-[13px] font-medium transition md:text-sm ${menu.active
                            ? "bg-[#F4F54A] text-[#191F28]"
                            : "text-[#667085] hover:bg-[#F5F6F7] hover:text-[#191F28]"
                        }`}
                    >
                        {menu.label}
                    </Link>
                ))}
            </div>
        </nav>
    );
}

const PROGRAM_TYPE_ORDER = ["day", "experience", "rest"] as const;

const operatorListItems: TempleStayOperatorListItem[] =
    templeStayOperators.map((operator) => {
        const programs = getTempleStayProgramsByOperatorOfficialId(
            operator.officialId,
        ).filter(
            (program) =>
                program.listed && program.detailStatus === "available",
        );

        return {
            officialId: operator.officialId,
            officialName: operator.officialName,
            operatorType: operator.operatorType,
            address: operator.address,
            sido: operator.sido,
            sigungu: operator.sigungu,
            officialUrl: operator.officialUrl,
            programCount: programs.length,
            programTypes: PROGRAM_TYPE_ORDER.filter((programType) =>
                programs.some(
                    (program) => program.programType === programType,
                ),
            ),
            searchText: getTempleStayOperatorSearchValues(operator)
                .join(" ")
                .toLocaleLowerCase("ko-KR")
                .replace(/\s+/g, ""),
        };
    });

export default function TempleStayPage() {
    return (
        <div className="min-h-screen bg-white text-[#252A31]">
            <TempleCategoryNav />
            <TempleStayDirectory operators={operatorListItems} />
        </div>
    );
}
