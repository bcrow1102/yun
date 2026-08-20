"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "./memorial-tablet.module.css";

type TabletSize = "small" | "medium" | "large";
type TabletComposition = "single" | "couple";
type TabletForm = "basic" | "parentDetailed";
type DevotionType = "cheongsinsa" | "cheongsinnyeo";
type ParentRelation = "father" | "mother";
type FontPreset = "classic" | "soft" | "sans";
type TextSizeStep = -2 | -1 | 0 | 1 | 2;
type RenderMode = "preview" | "print";

type MemorialTabletData = {
    size: TabletSize;
    composition: TabletComposition;
    form: TabletForm;
    devotionType: DevotionType;
    parentRelation: ParentRelation;
    clan: string;
    dharmaName: string;
    name: string;
    spouseClan: string;
    spouseDharmaName: string;
    spouseName: string;
    fontPreset: FontPreset;
    textSizeStep: TextSizeStep;
    textEmphasis: boolean;
};

type SavedMemorialTablet = MemorialTabletData & {
    id: string;
};

type SheetGroup = {
    key: TabletSize;
    label: string;
    widthMm: number;
    heightMm: number;
    perPage: number;
    pages: SavedMemorialTablet[][];
};

const SIZE_OPTIONS: {
    key: TabletSize;
    label: string;
    widthMm: number;
    heightMm: number;
    perPage: number;
}[] = [
        { key: "small", label: "소형", widthMm: 55, heightMm: 190, perPage: 3 },
        { key: "medium", label: "중형", widthMm: 62, heightMm: 220, perPage: 2 },
        { key: "large", label: "대형", widthMm: 65, heightMm: 250, perPage: 2 },
    ];

const DRAFT_PREVIEW_ID = "__yeon-memorial-tablet-draft-preview__";

function createEmptyTablet(): MemorialTabletData {
    return {
        size: "medium",
        composition: "single",
        form: "basic",
        devotionType: "cheongsinsa",
        parentRelation: "father",
        clan: "",
        dharmaName: "",
        name: "",
        spouseClan: "",
        spouseDharmaName: "",
        spouseName: "",
        fontPreset: "classic",
        textSizeStep: 0,
        textEmphasis: false,
    };
}

function createEmptyTabletFromStyle(
    tablet: MemorialTabletData
): MemorialTabletData {
    return {
        ...createEmptyTablet(),
        size: tablet.size,
        composition: tablet.composition,
        form: tablet.form,
        devotionType: tablet.devotionType,
        parentRelation: tablet.parentRelation,
        fontPreset: tablet.fontPreset,
        textSizeStep: tablet.textSizeStep,
        textEmphasis: tablet.textEmphasis,
    };
}

function cloneTablet(tablet: MemorialTabletData): MemorialTabletData {
    return { ...tablet };
}

function getExampleTablet(
    composition: TabletComposition,
    form: TabletForm
): MemorialTabletData {
    if (composition === "couple") {
        return {
            ...createEmptyTablet(),
            composition,
            form,
            parentRelation: "father",
            clan: "김해",
            dharmaName: "원광",
            name: "홍길동",
            spouseClan: "밀양",
            spouseDharmaName: "자운",
            spouseName: "김영희",
        };
    }

    if (form === "parentDetailed") {
        return {
            ...createEmptyTablet(),
            composition,
            form,
            parentRelation: "father",
            clan: "김해",
            dharmaName: "원광",
            name: "홍길동",
        };
    }

    return {
        ...createEmptyTablet(),
        composition,
        form,
        devotionType: "cheongsinsa",
        dharmaName: "원광",
        name: "홍길동",
    };
}

function getSingleTextParts(tablet: MemorialTabletData): string[] {
    if (tablet.form === "parentDetailed") {
        const relationText =
            tablet.parentRelation === "father" ? "선 엄부" : "선 자모";
        const lineageText = tablet.parentRelation === "father" ? "후인" : "유인";

        return [
            relationText,
            tablet.clan.trim()
                ? `${tablet.clan.trim()} ${lineageText}`
                : lineageText,
            tablet.dharmaName.trim(),
            tablet.name.trim(),
            "영가",
        ].filter(Boolean);
    }

    return [
        tablet.devotionType === "cheongsinsa" ? "청신사" : "청신녀",
        tablet.dharmaName.trim(),
        tablet.name.trim(),
        "영가",
    ].filter(Boolean);
}

function getCoupleTextParts(tablet: MemorialTabletData): {
    husband: string[];
    wife: string[];
} {
    if (tablet.form === "parentDetailed") {
        return {
            husband: [
                "선 엄부",
                tablet.clan.trim()
                    ? `${tablet.clan.trim()} 후인`
                    : "후인",
                tablet.dharmaName.trim(),
                tablet.name.trim(),
                "영가",
            ].filter(Boolean),
            wife: [
                "선 자모",
                tablet.spouseClan.trim()
                    ? `${tablet.spouseClan.trim()} 유인`
                    : "유인",
                tablet.spouseDharmaName.trim(),
                tablet.spouseName.trim(),
                "영가",
            ].filter(Boolean),
        };
    }

    return {
        husband: [
            "청신사",
            tablet.dharmaName.trim(),
            tablet.name.trim(),
            "영가",
        ].filter(Boolean),
        wife: [
            "청신녀",
            tablet.spouseDharmaName.trim(),
            tablet.spouseName.trim(),
            "영가",
        ].filter(Boolean),
    };
}

function MemorialTablet({
    tablet,
    mode,
    manualBlank = false,
    showExample = false,
}: {
    tablet: MemorialTabletData;
    mode: RenderMode;
    manualBlank?: boolean;
    showExample?: boolean;
}) {
    const renderTablet = showExample
        ? getExampleTablet(tablet.composition, tablet.form)
        : tablet;
    const isCouple = renderTablet.composition === "couple";
    const singleParts = isCouple ? [] : getSingleTextParts(renderTablet);
    const coupleParts = isCouple ? getCoupleTextParts(renderTablet) : null;
    const detailedClass =
        renderTablet.form === "parentDetailed" ? styles.detailedVertical : "";

    function renderVerticalLine(parts: string[], extraClass = "") {
        return (
            <div
                className={`${styles.verticalMain} ${detailedClass} ${extraClass}`}
            >
                {parts.map((part, index) => (
                    <span key={`${part}-${index}`}>{part}</span>
                ))}
            </div>
        );
    }

    return (
        <div
            className={`${styles.tabletRenderer} ${mode === "preview"
                ? styles.previewTabletRenderer
                : styles.printTabletRenderer
                } ${styles[`tabletSize_${tablet.size}`]} ${styles[`font_${tablet.fontPreset}`]
                } ${styles[`textSize_${tablet.textSizeStep + 2}`]} ${tablet.textEmphasis ? styles.textEmphasis : ""
                } ${manualBlank ? styles.manualBlankTablet : ""} ${showExample ? styles.exampleTablet : ""
                } ${isCouple ? styles.coupleTablet : ""}`}
        >
            <div className={styles.tabletInnerFrame} aria-hidden="true" />

            {manualBlank ? null : (
                <div className={styles.tabletContent}>
                    {showExample && mode === "preview" && (
                        <div className={styles.exampleLabel}>
                            입력 예시 · 인쇄되지 않음
                        </div>
                    )}

                    {isCouple && coupleParts ? (
                        <div className={styles.coupleColumns}>
                            <div className={styles.coupleColumn}>
                                {renderVerticalLine(
                                    coupleParts.husband,
                                    styles.husbandColumn
                                )}
                            </div>
                            <div className={styles.coupleColumn}>
                                {renderVerticalLine(
                                    coupleParts.wife,
                                    styles.wifeColumn
                                )}
                            </div>
                        </div>
                    ) : (
                        renderVerticalLine(singleParts)
                    )}
                </div>
            )}
        </div>
    );
}

function paginateTablets(
    tablets: SavedMemorialTablet[],
    perPage: number,
    ensureOnePage = false
): SavedMemorialTablet[][] {
    const pages: SavedMemorialTablet[][] = [];

    for (let index = 0; index < tablets.length; index += perPage) {
        pages.push(tablets.slice(index, index + perPage));
    }

    if (ensureOnePage && pages.length === 0) {
        pages.push([]);
    }

    return pages;
}

function MemorialSheetPage({
    group,
    page,
    pageIndex,
    interactive = false,
    onEdit,
    onEmptySelect,
}: {
    group: SheetGroup;
    page: SavedMemorialTablet[];
    pageIndex: number;
    interactive?: boolean;
    onEdit?: (tablet: SavedMemorialTablet) => void;
    onEmptySelect?: () => void;
}) {
    return (
        <div className={styles.printPageWrap}>
            <div className={styles.printPageLabel}>
                <strong>
                    {group.label} · A4 {pageIndex + 1} / {group.pages.length}
                </strong>
                <span>
                    {group.perPage}매 중 {page.length}매 입력
                    {page.length < group.perPage
                        ? ` · 수기용 빈 위패 ${group.perPage - page.length}매`
                        : " · 모두 입력"}
                </span>
            </div>

            <div
                className={`${styles.printSheet} ${styles[`sheet_${group.key}`]
                    }`}
            >
                {Array.from({ length: group.perPage }, (_, slotIndex) => {
                    const tablet = page[slotIndex];

                    if (!tablet) {
                        return (
                            <button
                                key={`empty-${group.key}-${pageIndex}-${slotIndex}`}
                                type="button"
                                className={`${styles.sheetSlot} ${styles.emptySheetSlot}`}
                                aria-label="수기용 빈 위패"
                                onClick={interactive ? onEmptySelect : undefined}
                                tabIndex={interactive ? 0 : -1}
                            >
                                <MemorialTablet
                                    tablet={{
                                        ...createEmptyTablet(),
                                        size: group.key,
                                    }}
                                    mode="print"
                                    manualBlank
                                />

                                {interactive && (
                                    <span className={styles.manualBlankNotice}>
                                        <strong>수기용 빈 위패</strong>
                                        <small>안내 문구는 인쇄되지 않음</small>
                                    </span>
                                )}
                            </button>
                        );
                    }

                    const isDraft = tablet.id === DRAFT_PREVIEW_ID;

                    return (
                        <button
                            key={tablet.id}
                            type="button"
                            className={`${styles.sheetSlot} ${isDraft ? styles.sheetSlotDraft : ""
                                }`}
                            onClick={
                                interactive && !isDraft
                                    ? () => onEdit?.(tablet)
                                    : undefined
                            }
                            tabIndex={interactive && !isDraft ? 0 : -1}
                            aria-label={
                                isDraft
                                    ? "현재 작성 중인 위패"
                                    : `${tablet.name || "위패"} 수정`
                            }
                        >
                            <MemorialTablet tablet={tablet} mode="print" />

                            {interactive && !isDraft && (
                                <span className={styles.editHint}>클릭하여 수정</span>
                            )}

                            {interactive && isDraft && (
                                <span className={styles.draftHint}>작성 중</span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default function MemorialTabletTool() {
    const [currentTablet, setCurrentTablet] =
        useState<MemorialTabletData>(createEmptyTablet);
    const [savedTablets, setSavedTablets] = useState<SavedMemorialTablet[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [previewMode, setPreviewMode] = useState<"layout" | "input">(
        "layout"
    );
    const [showTextSettings, setShowTextSettings] = useState(false);
    const [emptyNotice, setEmptyNotice] = useState(false);

    const selectedSize =
        SIZE_OPTIONS.find((option) => option.key === currentTablet.size) ??
        SIZE_OPTIONS[1];

    const hasCurrentInput = useMemo(() => {
        return Boolean(
            currentTablet.name.trim() ||
            currentTablet.dharmaName.trim() ||
            currentTablet.clan.trim() ||
            currentTablet.spouseName.trim() ||
            currentTablet.spouseDharmaName.trim() ||
            currentTablet.spouseClan.trim()
        );
    }, [currentTablet]);

    const effectiveTablets = useMemo(() => {
        let tablets = savedTablets.map((tablet) => ({ ...tablet }));

        if (editingId) {
            tablets = tablets.filter((tablet) => tablet.id !== editingId);
            tablets.push({ id: editingId, ...cloneTablet(currentTablet) });
        } else if (hasCurrentInput) {
            tablets.push({
                id: DRAFT_PREVIEW_ID,
                ...cloneTablet(currentTablet),
            });
        }

        return tablets;
    }, [savedTablets, editingId, currentTablet, hasCurrentInput]);

    const screenLayout = useMemo(() => {
        const sizeOption =
            SIZE_OPTIONS.find((option) => option.key === currentTablet.size) ??
            SIZE_OPTIONS[1];

        const tablets = effectiveTablets.filter(
            (tablet) => tablet.size === currentTablet.size
        );

        const pages = paginateTablets(tablets, sizeOption.perPage, true);
        let pageIndex = 0;

        const focusId = editingId || (hasCurrentInput ? DRAFT_PREVIEW_ID : null);

        if (focusId) {
            const focusedIndex = tablets.findIndex(
                (tablet) => tablet.id === focusId
            );
            if (focusedIndex >= 0) {
                pageIndex = Math.floor(focusedIndex / sizeOption.perPage);
            }
        }

        const group: SheetGroup = {
            ...sizeOption,
            pages,
        };

        return {
            group,
            page: pages[pageIndex] ?? [],
            pageIndex,
        };
    }, [effectiveTablets, currentTablet.size, editingId, hasCurrentInput]);

    const printGroups = useMemo<SheetGroup[]>(() => {
        return SIZE_OPTIONS.map((sizeOption) => {
            const tablets = effectiveTablets.filter(
                (tablet) => tablet.size === sizeOption.key
            );

            return {
                ...sizeOption,
                pages: paginateTablets(tablets, sizeOption.perPage),
            };
        }).filter((group) => group.pages.length > 0);
    }, [effectiveTablets]);

    const totalPrintPages = useMemo(
        () =>
            printGroups.reduce(
                (total, group) => total + group.pages.length,
                0
            ),
        [printGroups]
    );

    function enterInputPreview() {
        setPreviewMode("input");
        setEmptyNotice(false);
    }

    function handleSizeChange(size: TabletSize) {
        setCurrentTablet((previous) => ({ ...previous, size }));
        setEmptyNotice(false);

        if (editingId || hasCurrentInput || previewMode === "input") {
            setPreviewMode("input");
        } else {
            setPreviewMode("layout");
        }
    }

    function handleCompositionChange(composition: TabletComposition) {
        setCurrentTablet((previous) => ({
            ...previous,
            composition,
            devotionType:
                composition === "couple" ? "cheongsinsa" : previous.devotionType,
            parentRelation:
                composition === "couple" ? "father" : previous.parentRelation,
            spouseClan: composition === "single" ? "" : previous.spouseClan,
            spouseDharmaName:
                composition === "single" ? "" : previous.spouseDharmaName,
            spouseName: composition === "single" ? "" : previous.spouseName,
        }));
        enterInputPreview();
    }

    function handleFormChange(form: TabletForm) {
        setCurrentTablet((previous) => ({ ...previous, form }));
        enterInputPreview();
    }

    function updateTextSize(delta: -1 | 1) {
        setCurrentTablet((previous) => ({
            ...previous,
            textSizeStep: Math.max(
                -2,
                Math.min(2, previous.textSizeStep + delta)
            ) as TextSizeStep,
        }));
        enterInputPreview();
    }

    function handleNew() {
        if (editingId || hasCurrentInput) {
            const confirmed = window.confirm(
                editingId
                    ? "현재 수정 내용을 닫고 새 위패를 작성할까요?"
                    : "현재 작성 중인 내용을 닫고 새 위패를 작성할까요?"
            );

            if (!confirmed) return;
        }

        setCurrentTablet((previous) => createEmptyTabletFromStyle(previous));
        setEditingId(null);
        setShowTextSettings(false);
        setEmptyNotice(false);
        setPreviewMode("input");
    }

    function handleSave() {
        const name = currentTablet.name.trim();
        const spouseName = currentTablet.spouseName.trim();

        if (!name) {
            window.alert(
                currentTablet.composition === "couple"
                    ? "남편 영가 성명을 입력해 주세요."
                    : "영가 성명을 입력해 주세요."
            );
            return;
        }

        if (currentTablet.composition === "couple" && !spouseName) {
            window.alert("아내 영가 성명을 입력해 주세요.");
            return;
        }

        if (editingId) {
            setSavedTablets((previous) =>
                previous.map((tablet) =>
                    tablet.id === editingId
                        ? { id: tablet.id, ...cloneTablet(currentTablet) }
                        : tablet
                )
            );

            setCurrentTablet((previous) =>
                createEmptyTabletFromStyle(previous)
            );
            setEditingId(null);
            setShowTextSettings(false);
            setEmptyNotice(false);
            setPreviewMode("layout");
            return;
        }

        const newTablet: SavedMemorialTablet = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            ...cloneTablet(currentTablet),
        };

        setSavedTablets((previous) => [...previous, newTablet]);
        setCurrentTablet((previous) => createEmptyTabletFromStyle(previous));
        setEditingId(null);
        setShowTextSettings(false);
        setEmptyNotice(false);
        setPreviewMode("layout");
    }

    function handleEdit(tablet: SavedMemorialTablet) {
        setCurrentTablet(cloneTablet(tablet));
        setEditingId(tablet.id);
        setShowTextSettings(false);
        setEmptyNotice(false);
        setPreviewMode("input");

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function handleDelete(tablet: SavedMemorialTablet) {
        const confirmed = window.confirm(
            `${tablet.name || "이 위패"}를 출력 목록에서 삭제할까요?`
        );

        if (!confirmed) return;

        setSavedTablets((previous) =>
            previous.filter((item) => item.id !== tablet.id)
        );

        if (editingId === tablet.id) {
            setCurrentTablet((previous) =>
                createEmptyTabletFromStyle(previous)
            );
            setEditingId(null);
            setPreviewMode("layout");
        }
    }

    function handleLayoutPreview() {
        setPreviewMode("layout");
        setShowTextSettings(false);
        setEmptyNotice(false);
    }

    function handleEmptySelect() {
        setEmptyNotice(true);
        window.setTimeout(() => setEmptyNotice(false), 1800);
    }

    const primaryLabel = editingId
        ? "수정 완료"
        : previewMode === "layout"
            ? "인쇄하기"
            : "출력 목록에 추가";

    function handlePrimaryAction() {
        if (editingId) {
            handleSave();
            return;
        }

        if (previewMode === "layout") {
            window.print();
            return;
        }

        handleSave();
    }

    return (
        <main className={styles.toolPage}>
            <section className={styles.toolHeader}>
                <div
                    className={styles.titleGroup}
                    style={{ display: "flex", alignItems: "baseline", gap: "16px", flexWrap: "wrap" }}
                >
                    <h1 className={styles.title}>위패 만들기</h1>
                    <p className={styles.description}>
                        49재·백중·천도재용 종이 영가위패
                    </p>
                    <Link
                        href="/downloads"
                        className="print:hidden shrink-0 text-[12px] font-medium leading-4 text-[#7A818D] transition-colors hover:text-[#252A31] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9BA28] focus-visible:ring-offset-2"
                        aria-label="사찰 실무서식으로 돌아가기"
                    >
                        ← 돌아가기
                    </Link>
                </div>

                <div className={styles.privacy}>
                    입력한 정보는 이 브라우저 안에서만 작업합니다.
                </div>
            </section>

            <section className={styles.workspace}>
                <div className={styles.editorPanel}>
                    <div className={styles.panelHeader}>
                        <div>
                            <h2>
                                {editingId
                                    ? "저장된 위패 수정"
                                    : "현재 위패 작성"}
                            </h2>
                        </div>

                        <button
                            type="button"
                            className={styles.clearButton}
                            onClick={handleNew}
                        >
                            새로 작성
                        </button>
                    </div>

                    <div className={styles.editorBody}>
                        <section className={styles.formSection}>
                            <div className={styles.sectionTitleRow}>
                                <h3>위패 규격</h3>
                                <span>실제 출력 크기 기준</span>
                            </div>

                            <div className={styles.sizeOptions}>
                                {SIZE_OPTIONS.map((option) => (
                                    <button
                                        key={option.key}
                                        type="button"
                                        className={`${styles.sizeButton} ${currentTablet.size === option.key
                                            ? styles.sizeButtonActive
                                            : ""
                                            }`}
                                        onClick={() =>
                                            handleSizeChange(option.key)
                                        }
                                    >
                                        <strong>{option.label}</strong>
                                        <span>
                                            {option.widthMm}×{option.heightMm}mm
                                            <em>A4 {option.perPage}매</em>
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section className={styles.formSection}>
                            <div className={styles.sectionTitleRow}>
                                <h3>위패 구성</h3>
                                <span>1인 또는 부부 위패를 선택하세요.</span>
                            </div>

                            <div className={styles.formOptions}>
                                <button
                                    type="button"
                                    className={`${styles.formButton} ${currentTablet.composition === "single"
                                        ? styles.formButtonActive
                                        : ""
                                        }`}
                                    onClick={() =>
                                        handleCompositionChange("single")
                                    }
                                >
                                    <strong>1인 위패</strong>
                                    <span>중앙 세로 1열</span>
                                </button>

                                <button
                                    type="button"
                                    className={`${styles.formButton} ${currentTablet.composition === "couple"
                                        ? styles.formButtonActive
                                        : ""
                                        }`}
                                    onClick={() =>
                                        handleCompositionChange("couple")
                                    }
                                >
                                    <strong>부부 위패</strong>
                                    <span>남편 왼쪽 · 아내 오른쪽</span>
                                </button>
                            </div>
                        </section>

                        <section className={styles.formSection}>
                            <div className={styles.sectionTitleRow}>
                                <h3>표기 형식</h3>
                                <span>많이 쓰는 두 형식만 제공합니다.</span>
                            </div>

                            <div className={styles.formOptions}>
                                <button
                                    type="button"
                                    className={`${styles.formButton} ${currentTablet.form === "basic"
                                        ? styles.formButtonActive
                                        : ""
                                        }`}
                                    onClick={() => handleFormChange("basic")}
                                >
                                    <strong>기본형</strong>
                                    <span>청신사·청신녀 중심</span>
                                </button>

                                <button
                                    type="button"
                                    className={`${styles.formButton} ${currentTablet.form === "parentDetailed"
                                        ? styles.formButtonActive
                                        : ""
                                        }`}
                                    onClick={() =>
                                        handleFormChange("parentDetailed")
                                    }
                                >
                                    <strong>부모 상세형</strong>
                                    <span>선 엄부·선 자모 중심</span>
                                </button>
                            </div>
                        </section>

                        {currentTablet.composition === "single" ? (
                            currentTablet.form === "basic" ? (
                                <section className={styles.formSection}>
                                    <div className={styles.sectionTitleRow}>
                                        <h3>영가 정보</h3>
                                        <span>법명은 없으면 비워두세요.</span>
                                    </div>

                                    <div className={styles.infoBox}>
                                        <div className={styles.fieldRow}>
                                            <label>구분</label>
                                            <div className={styles.inlineChoice}>
                                                <button
                                                    type="button"
                                                    className={
                                                        currentTablet.devotionType ===
                                                            "cheongsinsa"
                                                            ? styles.choiceActive
                                                            : ""
                                                    }
                                                    onClick={() => {
                                                        setCurrentTablet(
                                                            (previous) => ({
                                                                ...previous,
                                                                devotionType:
                                                                    "cheongsinsa",
                                                            })
                                                        );
                                                        enterInputPreview();
                                                    }}
                                                >
                                                    청신사 (남자)
                                                </button>
                                                <button
                                                    type="button"
                                                    className={
                                                        currentTablet.devotionType ===
                                                            "cheongsinnyeo"
                                                            ? styles.choiceActive
                                                            : ""
                                                    }
                                                    onClick={() => {
                                                        setCurrentTablet(
                                                            (previous) => ({
                                                                ...previous,
                                                                devotionType:
                                                                    "cheongsinnyeo",
                                                            })
                                                        );
                                                        enterInputPreview();
                                                    }}
                                                >
                                                    청신녀 (여자)
                                                </button>
                                            </div>
                                        </div>

                                        <div className={styles.fieldRow}>
                                            <label htmlFor="dharma-name">
                                                법명
                                            </label>
                                            <input
                                                id="dharma-name"
                                                type="text"
                                                value={currentTablet.dharmaName}
                                                placeholder="예: 원광"
                                                onChange={(event) => {
                                                    setCurrentTablet(
                                                        (previous) => ({
                                                            ...previous,
                                                            dharmaName:
                                                                event.target.value,
                                                        })
                                                    );
                                                    enterInputPreview();
                                                }}
                                            />
                                        </div>

                                        <div className={styles.fieldRow}>
                                            <label htmlFor="memorial-name">
                                                성명 <em>필수</em>
                                            </label>
                                            <input
                                                id="memorial-name"
                                                type="text"
                                                value={currentTablet.name}
                                                placeholder="예: 홍길동"
                                                onChange={(event) => {
                                                    setCurrentTablet(
                                                        (previous) => ({
                                                            ...previous,
                                                            name: event.target.value,
                                                        })
                                                    );
                                                    enterInputPreview();
                                                }}
                                            />
                                        </div>
                                    </div>
                                </section>
                            ) : (
                                <section className={styles.formSection}>
                                    <div className={styles.sectionTitleRow}>
                                        <h3>부모 영가 정보</h3>
                                        <span>
                                            한 분의 상세 문구를 중앙 세로 1열로 조판합니다.
                                        </span>
                                    </div>

                                    <div className={styles.infoBox}>
                                        <div className={styles.fieldRow}>
                                            <label>관계</label>
                                            <div className={styles.inlineChoice}>
                                                <button
                                                    type="button"
                                                    className={
                                                        currentTablet.parentRelation ===
                                                            "father"
                                                            ? styles.choiceActive
                                                            : ""
                                                    }
                                                    onClick={() => {
                                                        setCurrentTablet(
                                                            (previous) => ({
                                                                ...previous,
                                                                parentRelation:
                                                                    "father",
                                                            })
                                                        );
                                                        enterInputPreview();
                                                    }}
                                                >
                                                    아버지 · 후인
                                                </button>
                                                <button
                                                    type="button"
                                                    className={
                                                        currentTablet.parentRelation ===
                                                            "mother"
                                                            ? styles.choiceActive
                                                            : ""
                                                    }
                                                    onClick={() => {
                                                        setCurrentTablet(
                                                            (previous) => ({
                                                                ...previous,
                                                                parentRelation:
                                                                    "mother",
                                                            })
                                                        );
                                                        enterInputPreview();
                                                    }}
                                                >
                                                    어머니 · 유인
                                                </button>
                                            </div>
                                        </div>

                                        <div className={styles.fieldRow}>
                                            <label htmlFor="clan-name">본관</label>
                                            <input
                                                id="clan-name"
                                                type="text"
                                                value={currentTablet.clan}
                                                placeholder="예: 김해"
                                                onChange={(event) => {
                                                    setCurrentTablet(
                                                        (previous) => ({
                                                            ...previous,
                                                            clan: event.target.value,
                                                        })
                                                    );
                                                    enterInputPreview();
                                                }}
                                            />
                                        </div>

                                        <div className={styles.fieldRow}>
                                            <label htmlFor="detail-dharma-name">
                                                법명
                                            </label>
                                            <input
                                                id="detail-dharma-name"
                                                type="text"
                                                value={currentTablet.dharmaName}
                                                placeholder="예: 원광"
                                                onChange={(event) => {
                                                    setCurrentTablet(
                                                        (previous) => ({
                                                            ...previous,
                                                            dharmaName:
                                                                event.target.value,
                                                        })
                                                    );
                                                    enterInputPreview();
                                                }}
                                            />
                                        </div>

                                        <div className={styles.fieldRow}>
                                            <label htmlFor="detail-memorial-name">
                                                성명 <em>필수</em>
                                            </label>
                                            <input
                                                id="detail-memorial-name"
                                                type="text"
                                                value={currentTablet.name}
                                                placeholder="예: 홍길동"
                                                onChange={(event) => {
                                                    setCurrentTablet(
                                                        (previous) => ({
                                                            ...previous,
                                                            name: event.target.value,
                                                        })
                                                    );
                                                    enterInputPreview();
                                                }}
                                            />
                                        </div>
                                    </div>
                                </section>
                            )
                        ) : currentTablet.form === "basic" ? (
                            <section className={styles.formSection}>
                                <div className={styles.sectionTitleRow}>
                                    <h3>부부 영가 정보</h3>
                                    <span>
                                        남편은 왼쪽, 아내는 오른쪽에 조판됩니다.
                                    </span>
                                </div>

                                <div className={styles.infoBox}>
                                    <div className={styles.couplePersonHeader}>
                                        <strong>남편</strong>
                                        <span>위패 왼쪽 · 청신사</span>
                                    </div>

                                    <div className={styles.fieldRow}>
                                        <label htmlFor="husband-dharma-name">
                                            법명
                                        </label>
                                        <input
                                            id="husband-dharma-name"
                                            type="text"
                                            value={currentTablet.dharmaName}
                                            placeholder="예: 원광"
                                            onChange={(event) => {
                                                setCurrentTablet(
                                                    (previous) => ({
                                                        ...previous,
                                                        dharmaName:
                                                            event.target.value,
                                                    })
                                                );
                                                enterInputPreview();
                                            }}
                                        />
                                    </div>

                                    <div className={styles.fieldRow}>
                                        <label htmlFor="husband-name">
                                            성명 <em>필수</em>
                                        </label>
                                        <input
                                            id="husband-name"
                                            type="text"
                                            value={currentTablet.name}
                                            placeholder="예: 홍길동"
                                            onChange={(event) => {
                                                setCurrentTablet(
                                                    (previous) => ({
                                                        ...previous,
                                                        name: event.target.value,
                                                    })
                                                );
                                                enterInputPreview();
                                            }}
                                        />
                                    </div>

                                    <div className={styles.couplePersonHeader}>
                                        <strong>아내</strong>
                                        <span>위패 오른쪽 · 청신녀</span>
                                    </div>

                                    <div className={styles.fieldRow}>
                                        <label htmlFor="wife-dharma-name">
                                            법명
                                        </label>
                                        <input
                                            id="wife-dharma-name"
                                            type="text"
                                            value={currentTablet.spouseDharmaName}
                                            placeholder="예: 자운"
                                            onChange={(event) => {
                                                setCurrentTablet(
                                                    (previous) => ({
                                                        ...previous,
                                                        spouseDharmaName:
                                                            event.target.value,
                                                    })
                                                );
                                                enterInputPreview();
                                            }}
                                        />
                                    </div>

                                    <div className={styles.fieldRow}>
                                        <label htmlFor="wife-name">
                                            성명 <em>필수</em>
                                        </label>
                                        <input
                                            id="wife-name"
                                            type="text"
                                            value={currentTablet.spouseName}
                                            placeholder="예: 김영희"
                                            onChange={(event) => {
                                                setCurrentTablet(
                                                    (previous) => ({
                                                        ...previous,
                                                        spouseName:
                                                            event.target.value,
                                                    })
                                                );
                                                enterInputPreview();
                                            }}
                                        />
                                    </div>
                                </div>
                            </section>
                        ) : (
                            <section className={styles.formSection}>
                                <div className={styles.sectionTitleRow}>
                                    <h3>부부 부모 상세 정보</h3>
                                    <span>
                                        남편은 선 엄부·후인, 아내는 선 자모·유인으로 조판됩니다.
                                    </span>
                                </div>

                                <div className={styles.infoBox}>
                                    <div className={styles.couplePersonHeader}>
                                        <strong>남편</strong>
                                        <span>위패 왼쪽 · 선 엄부 · 후인</span>
                                    </div>

                                    <div className={styles.fieldRow}>
                                        <label htmlFor="husband-clan">본관</label>
                                        <input
                                            id="husband-clan"
                                            type="text"
                                            value={currentTablet.clan}
                                            placeholder="예: 김해"
                                            onChange={(event) => {
                                                setCurrentTablet(
                                                    (previous) => ({
                                                        ...previous,
                                                        clan: event.target.value,
                                                    })
                                                );
                                                enterInputPreview();
                                            }}
                                        />
                                    </div>

                                    <div className={styles.fieldRow}>
                                        <label htmlFor="husband-detail-dharma">
                                            법명
                                        </label>
                                        <input
                                            id="husband-detail-dharma"
                                            type="text"
                                            value={currentTablet.dharmaName}
                                            placeholder="예: 원광"
                                            onChange={(event) => {
                                                setCurrentTablet(
                                                    (previous) => ({
                                                        ...previous,
                                                        dharmaName:
                                                            event.target.value,
                                                    })
                                                );
                                                enterInputPreview();
                                            }}
                                        />
                                    </div>

                                    <div className={styles.fieldRow}>
                                        <label htmlFor="husband-detail-name">
                                            성명 <em>필수</em>
                                        </label>
                                        <input
                                            id="husband-detail-name"
                                            type="text"
                                            value={currentTablet.name}
                                            placeholder="예: 홍길동"
                                            onChange={(event) => {
                                                setCurrentTablet(
                                                    (previous) => ({
                                                        ...previous,
                                                        name: event.target.value,
                                                    })
                                                );
                                                enterInputPreview();
                                            }}
                                        />
                                    </div>

                                    <div className={styles.couplePersonHeader}>
                                        <strong>아내</strong>
                                        <span>위패 오른쪽 · 선 자모 · 유인</span>
                                    </div>

                                    <div className={styles.fieldRow}>
                                        <label htmlFor="wife-clan">본관</label>
                                        <input
                                            id="wife-clan"
                                            type="text"
                                            value={currentTablet.spouseClan}
                                            placeholder="예: 밀양"
                                            onChange={(event) => {
                                                setCurrentTablet(
                                                    (previous) => ({
                                                        ...previous,
                                                        spouseClan:
                                                            event.target.value,
                                                    })
                                                );
                                                enterInputPreview();
                                            }}
                                        />
                                    </div>

                                    <div className={styles.fieldRow}>
                                        <label htmlFor="wife-detail-dharma">
                                            법명
                                        </label>
                                        <input
                                            id="wife-detail-dharma"
                                            type="text"
                                            value={currentTablet.spouseDharmaName}
                                            placeholder="예: 자운"
                                            onChange={(event) => {
                                                setCurrentTablet(
                                                    (previous) => ({
                                                        ...previous,
                                                        spouseDharmaName:
                                                            event.target.value,
                                                    })
                                                );
                                                enterInputPreview();
                                            }}
                                        />
                                    </div>

                                    <div className={styles.fieldRow}>
                                        <label htmlFor="wife-detail-name">
                                            성명 <em>필수</em>
                                        </label>
                                        <input
                                            id="wife-detail-name"
                                            type="text"
                                            value={currentTablet.spouseName}
                                            placeholder="예: 김영희"
                                            onChange={(event) => {
                                                setCurrentTablet(
                                                    (previous) => ({
                                                        ...previous,
                                                        spouseName:
                                                            event.target.value,
                                                    })
                                                );
                                                enterInputPreview();
                                            }}
                                        />
                                    </div>
                                </div>
                            </section>
                        )}

                        <div className={styles.actionBar}>
                            <button
                                type="button"
                                className={styles.previewButton}
                                onClick={handleLayoutPreview}
                            >
                                배치 미리보기
                            </button>

                            <button
                                type="button"
                                className={styles.addButton}
                                onClick={handleSave}
                            >
                                {editingId ? "수정 완료" : "출력 목록에 추가"}
                            </button>
                        </div>

                        {savedTablets.length > 0 && (
                            <section className={styles.savedSection}>
                                <div className={styles.savedSectionHeader}>
                                    <h3>출력 목록</h3>
                                    <span>{savedTablets.length}장</span>
                                </div>

                                <div className={styles.savedList}>
                                    {savedTablets.map((tablet, index) => {
                                        const sizeLabel =
                                            SIZE_OPTIONS.find(
                                                (option) =>
                                                    option.key === tablet.size
                                            )?.label ?? "";

                                        const formLabel =
                                            tablet.form === "basic"
                                                ? "기본형"
                                                : "부모 상세형";

                                        const compositionLabel =
                                            tablet.composition === "couple"
                                                ? "부부"
                                                : "1인";

                                        const displayName =
                                            tablet.composition === "couple"
                                                ? [tablet.name, tablet.spouseName]
                                                    .filter(Boolean)
                                                    .join(" · ")
                                                : tablet.name;

                                        return (
                                            <div
                                                key={tablet.id}
                                                className={styles.savedItem}
                                            >
                                                <div className={styles.savedIndex}>
                                                    {index + 1}
                                                </div>
                                                <div className={styles.savedInfo}>
                                                    <strong>
                                                        {displayName || "이름 없음"}
                                                    </strong>
                                                    <span>
                                                        {sizeLabel} · {compositionLabel} · {formLabel}
                                                    </span>
                                                </div>
                                                <div className={styles.savedActions}>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleEdit(tablet)
                                                        }
                                                    >
                                                        수정
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(tablet)
                                                        }
                                                    >
                                                        삭제
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}
                    </div>
                </div>

                <div className={styles.previewPanel}>
                    <div className={styles.panelHeader}>
                        <div>
                            <h2>
                                {previewMode === "layout"
                                    ? "배치 미리보기"
                                    : editingId
                                        ? "위패 수정"
                                        : "위패 입력"}
                            </h2>
                            <p>
                                {previewMode === "layout"
                                    ? `${selectedSize.label} · ${selectedSize.widthMm}×${selectedSize.heightMm}mm · A4 ${selectedSize.perPage}매`
                                    : editingId
                                        ? "선택한 위패 한 장을 수정하고 있습니다."
                                        : "현재 입력 내용을 한 장 크게 확인합니다."}
                            </p>
                        </div>

                        <div className={styles.previewHeaderActions}>
                            {previewMode === "layout" && (
                                <div className={styles.savedCount}>
                                    출력 목록 {savedTablets.length}장
                                    {totalPrintPages > 0
                                        ? ` · A4 ${totalPrintPages}페이지`
                                        : ""}
                                </div>
                            )}

                            {previewMode === "input" && (
                                <>
                                    <button
                                        type="button"
                                        className={styles.textSettingsButton}
                                        onClick={() =>
                                            setShowTextSettings(
                                                (previous) => !previous
                                            )
                                        }
                                    >
                                        글자 설정
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.backButton}
                                        onClick={handleLayoutPreview}
                                    >
                                        배치 보기
                                    </button>
                                </>
                            )}

                            <button
                                type="button"
                                className={styles.previewPrimaryButton}
                                onClick={handlePrimaryAction}
                            >
                                {primaryLabel}
                            </button>
                        </div>
                    </div>

                    {previewMode === "input" ? (
                        <div className={styles.previewStage}>
                            <div className={styles.previewStageLabel}>
                                {selectedSize.label} · {selectedSize.widthMm}×
                                {selectedSize.heightMm}mm
                            </div>

                            {showTextSettings && (
                                <div className={styles.textSettingsPanel}>
                                    <div className={styles.textSettingGroup}>
                                        <span className={styles.textSettingLabel}>
                                            글꼴
                                        </span>
                                        <div className={styles.fontPresetButtons}>
                                            {(
                                                [
                                                    ["classic", "단정한 명조"],
                                                    ["soft", "부드러운 명조"],
                                                    ["sans", "고딕"],
                                                ] as const
                                            ).map(([key, label]) => (
                                                <button
                                                    key={key}
                                                    type="button"
                                                    className={
                                                        currentTablet.fontPreset ===
                                                            key
                                                            ? styles.settingActive
                                                            : ""
                                                    }
                                                    onClick={() =>
                                                        setCurrentTablet(
                                                            (previous) => ({
                                                                ...previous,
                                                                fontPreset: key,
                                                            })
                                                        )
                                                    }
                                                >
                                                    {label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className={styles.textSettingGroup}>
                                        <span className={styles.textSettingLabel}>
                                            글자 크기
                                        </span>
                                        <div className={styles.sizeStepper}>
                                            <button
                                                type="button"
                                                onClick={() => updateTextSize(-1)}
                                                disabled={
                                                    currentTablet.textSizeStep <= -2
                                                }
                                            >
                                                −
                                            </button>
                                            <strong>
                                                {currentTablet.textSizeStep > 0
                                                    ? `+${currentTablet.textSizeStep}`
                                                    : currentTablet.textSizeStep}
                                            </strong>
                                            <button
                                                type="button"
                                                onClick={() => updateTextSize(1)}
                                                disabled={
                                                    currentTablet.textSizeStep >= 2
                                                }
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <div className={styles.textSettingGroup}>
                                        <span className={styles.textSettingLabel}>
                                            강조
                                        </span>
                                        <button
                                            type="button"
                                            className={`${styles.emphasisButton} ${currentTablet.textEmphasis
                                                ? styles.settingActive
                                                : ""
                                                }`}
                                            onClick={() =>
                                                setCurrentTablet((previous) => ({
                                                    ...previous,
                                                    textEmphasis:
                                                        !previous.textEmphasis,
                                                }))
                                            }
                                        >
                                            {currentTablet.textEmphasis
                                                ? "강조 사용"
                                                : "보통"}
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        className={styles.resetTextButton}
                                        onClick={() =>
                                            setCurrentTablet((previous) => ({
                                                ...previous,
                                                fontPreset: "classic",
                                                textSizeStep: 0,
                                                textEmphasis: false,
                                            }))
                                        }
                                    >
                                        기본값으로
                                    </button>
                                </div>
                            )}

                            <MemorialTablet
                                tablet={currentTablet}
                                mode="preview"
                                showExample={!hasCurrentInput}
                            />
                        </div>
                    ) : (
                        <div className={styles.printPreviewStage}>
                            {emptyNotice && (
                                <div className={styles.emptySelectionNotice}>
                                    수정할 내용이 없습니다.
                                </div>
                            )}

                            <div
                                className={`${styles.printPages} ${styles.screenPrintPages}`}
                            >
                                <MemorialSheetPage
                                    key={`screen-${screenLayout.group.key}-${screenLayout.pageIndex}`}
                                    group={screenLayout.group}
                                    page={screenLayout.page}
                                    pageIndex={screenLayout.pageIndex}
                                    interactive
                                    onEdit={handleEdit}
                                    onEmptySelect={handleEmptySelect}
                                />
                            </div>
                        </div>
                    )}

                    <div
                        className={`${styles.printPages} ${styles.actualPrintPages}`}
                        aria-hidden="true"
                    >
                        {(printGroups.length > 0
                            ? printGroups
                            : [screenLayout.group]
                        ).map((group) =>
                            group.pages.map((page, pageIndex) => (
                                <MemorialSheetPage
                                    key={`print-${group.key}-${pageIndex}`}
                                    group={group}
                                    page={page}
                                    pageIndex={pageIndex}
                                />
                            ))
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}
