"use client";

import {
    createContext,
    useContext,
    useState,
    type HTMLAttributes,
    type ReactNode,
} from "react";

const sectionOrder = [
    "basic",
    "timeline",
    "life",
    "thought",
    "works",
    "stories",
] as const;

type MobileArchiveContextValue = {
    activeSectionId: string | null;
    openSection: (sectionId: string) => void;
    openNextSection: (currentSectionId: string) => void;
    returnToList: () => void;
};

const MobileArchiveContext = createContext<MobileArchiveContextValue | null>(null);

type MobileArchiveRootProps = HTMLAttributes<HTMLDivElement> & {
    children: ReactNode;
};

export function MobileArchiveRoot({
    children,
    ...props
}: MobileArchiveRootProps) {
    const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

    const scrollToSection = (sectionId: string) => {
        window.requestAnimationFrame(() => {
            document
                .getElementById(`mobile-archive-button-${sectionId}`)
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    };

    const openNextSection = (currentSectionId: string) => {
        const currentIndex = sectionOrder.indexOf(
            currentSectionId as (typeof sectionOrder)[number],
        );
        const nextIndex = currentIndex >= 0 ? currentIndex + 1 : 0;
        const nextSectionId = sectionOrder[nextIndex];

        if (!nextSectionId) return;

        setActiveSectionId(nextSectionId);
        scrollToSection(nextSectionId);
    };

    const returnToList = () => {
        setActiveSectionId(null);

        window.requestAnimationFrame(() => {
            document
                .getElementById("profile")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    };

    return (
        <MobileArchiveContext.Provider
            value={{
                activeSectionId,
                openSection: setActiveSectionId,
                openNextSection,
                returnToList,
            }}
        >
            <div {...props}>{children}</div>
        </MobileArchiveContext.Provider>
    );
}

type MobileArchiveSectionProps = {
    id: string;
    title: string;
    children: ReactNode;
};

export default function MobileArchiveSection({
    id,
    title,
    children,
}: MobileArchiveSectionProps) {
    const context = useContext(MobileArchiveContext);

    if (!context) {
        throw new Error(
            "MobileArchiveSection must be used inside MobileArchiveRoot.",
        );
    }

    const isOpen = context.activeSectionId === id;
    const shouldHideOnMobile =
        context.activeSectionId !== null && !isOpen;
    const isLastSection = id === sectionOrder[sectionOrder.length - 1];
    const panelId = `mobile-archive-panel-${id}`;
    const buttonId = `mobile-archive-button-${id}`;

    return (
        <section
            className={`${shouldHideOnMobile ? "hidden md:block" : "block"
                } border-t border-[#E5E7EA] md:border-0`}
        >
            {isOpen ? (
                <div
                    id={buttonId}
                    className="flex items-center justify-between gap-4 border-b border-[#E5E7EA] py-5 md:hidden"
                >
                    <h2 className="text-[17px] font-medium text-[#303641]">
                        {title}
                    </h2>
                    <button
                        type="button"
                        onClick={() =>
                            isLastSection
                                ? context.returnToList()
                                : context.openNextSection(id)
                        }
                        className="shrink-0 text-sm text-[#777900]"
                        aria-label={
                            isLastSection
                                ? "전체 항목 목록으로 돌아가기"
                                : `${title} 다음 항목 보기`
                        }
                    >
                        {isLastSection ? (
                            "전체 목록"
                        ) : (
                            <>
                                다음 보기 <span aria-hidden="true">›</span>
                            </>
                        )}
                    </button>
                </div>
            ) : (
                <button
                    id={buttonId}
                    type="button"
                    onClick={() => context.openSection(id)}
                    aria-expanded="false"
                    aria-controls={panelId}
                    className="flex w-full items-center justify-between py-5 text-left text-[17px] font-medium text-[#303641] md:hidden"
                >
                    <span>{title}</span>
                    <span aria-hidden="true" className="text-[#777900]">
                        ＋
                    </span>
                </button>
            )}

            <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={`${isOpen ? "block" : "hidden"} md:block`}
            >
                {children}
            </div>
        </section>
    );
}

type MobileArchiveDefaultProps = {
    children: ReactNode;
};

export function MobileArchiveDefault({
    children,
}: MobileArchiveDefaultProps) {
    const context = useContext(MobileArchiveContext);

    if (!context) {
        throw new Error(
            "MobileArchiveDefault must be used inside MobileArchiveRoot.",
        );
    }

    return (
        <div
            className={
                context.activeSectionId === null
                    ? "block"
                    : "hidden md:block"
            }
        >
            {children}
        </div>
    );
}
