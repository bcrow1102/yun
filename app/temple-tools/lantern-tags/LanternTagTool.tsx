"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./lantern-tag.module.css";

type TagSize = "small" | "medium" | "large";
type TagColor = "white" | "yellow" | "pink" | "green";
type FontPreset = "classic" | "soft" | "sans";
type TextSizeStep = -2 | -1 | 0 | 1 | 2;
type RenderMode = "preview" | "print";

type Person = {
    name: string;
    birth: string;
    dharmaName: string;
};

type LanternTagData = {
    size: TagSize;
    people: Person[];
    prayer: string;
    color: TagColor;
    fontPreset: FontPreset;
    textSizeStep: TextSizeStep;
    textEmphasis: boolean;
};

type SavedLanternTag = LanternTagData & {
    id: string;
};

const SIZE_OPTIONS: {
    key: TagSize;
    label: string;
    perPage: number;
}[] = [
        { key: "small", label: "소형", perPage: 6 },
        { key: "medium", label: "중형", perPage: 3 },
        { key: "large", label: "대형", perPage: 2 },
    ];

const COLOR_OPTIONS: {
    key: TagColor;
    label: string;
}[] = [
        { key: "white", label: "흰색" },
        { key: "yellow", label: "연노랑" },
        { key: "pink", label: "연분홍" },
        { key: "green", label: "연두" },
    ];

const DRAFT_PREVIEW_ID = "__yeon-lantern-draft-preview__";

function createEmptyPeople(): Person[] {
    return Array.from({ length: 8 }, () => ({
        name: "",
        birth: "",
        dharmaName: "",
    }));
}

function createEmptyTag(): LanternTagData {
    return {
        size: "medium",
        people: createEmptyPeople(),
        prayer: "",
        color: "yellow",
        fontPreset: "classic",
        textSizeStep: 0,
        textEmphasis: false,
    };
}

function cloneTag(tag: LanternTagData): LanternTagData {
    return {
        size: tag.size,
        prayer: tag.prayer,
        color: tag.color,
        fontPreset: tag.fontPreset,
        textSizeStep: tag.textSizeStep,
        textEmphasis: tag.textEmphasis,
        people: tag.people.map((person) => ({ ...person })),
    };
}

function LanternTag({
    tag,
    mode,
    manualBlank = false,
}: {
    tag: LanternTagData;
    mode: RenderMode;
    manualBlank?: boolean;
}) {
    const leaders = tag.people
        .slice(0, 2)
        .filter((person) => person.name.trim());

    const children = tag.people
        .slice(2)
        .filter((person) => person.name.trim());

    const peopleCount = leaders.length + children.length;
    const hasPeople = peopleCount > 0;
    const hasPrayer = tag.prayer.trim().length > 0;

    // 가족 수는 압축 단계를 즉시 결정하지 않는다.
    // 모든 꼬리표는 기본 조판(sparse)에서 시작하고 실제 렌더링 높이가
    // 부족할 때만 normal -> full 순서로 압축한다.
    // 0~4명은 최대 1단계, 5~6명은 최대 2단계까지만 허용한다.
    const maxCompressionLevel: 1 | 2 = children.length >= 5 ? 2 : 1;
    const [compressionLevel, setCompressionLevel] = useState<0 | 1 | 2>(0);

    const layoutDensity =
        compressionLevel === 0
            ? "sparse"
            : compressionLevel === 1
                ? "normal"
                : "full";

    const flowRef = useRef<HTMLDivElement>(null);
    const leaderRef = useRef<HTMLDivElement>(null);
    const childrenRef = useRef<HTMLDivElement>(null);
    const prayerRef = useRef<HTMLDivElement>(null);
    const lastLayoutKeyRef = useRef("");
    const [contentOverflow, setContentOverflow] = useState(false);

    const layoutMeasurementKey = JSON.stringify({
        mode,
        size: tag.size,
        people: tag.people,
        prayer: tag.prayer,
        fontPreset: tag.fontPreset,
        textSizeStep: tag.textSizeStep,
        textEmphasis: tag.textEmphasis,
        manualBlank,
    });

    useEffect(() => {
        if (manualBlank || !hasPeople) {
            if (compressionLevel !== 0) {
                setCompressionLevel(0);
            }
            setContentOverflow(false);
            lastLayoutKeyRef.current = layoutMeasurementKey;
            return;
        }

        // 내용·규격·글자 설정이 바뀌면 기존 압축 결과를 재사용하지 않고
        // 반드시 기본 조판부터 다시 실제 높이를 측정한다.
        if (lastLayoutKeyRef.current !== layoutMeasurementKey) {
            lastLayoutKeyRef.current = layoutMeasurementKey;

            if (compressionLevel !== 0) {
                setCompressionLevel(0);
                setContentOverflow(false);
                return;
            }
        }

        const flow = flowRef.current;
        const leader = leaderRef.current;

        if (!flow || !leader) return;

        const measureLayout = () => {
            const flowRect = flow.getBoundingClientRect();
            const leaderRect = leader.getBoundingClientRect();
            const childrenRect = childrenRef.current?.getBoundingClientRect();
            const prayerRect = prayerRef.current?.getBoundingClientRect();
            const lastContentRect = prayerRect ?? childrenRect ?? leaderRect;

            const overflowing =
                flow.scrollHeight > flow.clientHeight + 1 ||
                leaderRect.top < flowRect.top - 1 ||
                lastContentRect.bottom > flowRect.bottom + 1;

            if (overflowing && compressionLevel < maxCompressionLevel) {
                setContentOverflow(false);
                setCompressionLevel(
                    (compressionLevel + 1) as 0 | 1 | 2
                );
                return;
            }

            setContentOverflow((previous) =>
                previous === overflowing ? previous : overflowing
            );
        };

        const frame = window.requestAnimationFrame(measureLayout);
        const observer =
            typeof ResizeObserver !== "undefined"
                ? new ResizeObserver(measureLayout)
                : null;

        observer?.observe(flow);
        observer?.observe(leader);
        if (childrenRef.current) observer?.observe(childrenRef.current);
        if (prayerRef.current) observer?.observe(prayerRef.current);

        const handleWindowResize = () => {
            if (compressionLevel !== 0) {
                setCompressionLevel(0);
                setContentOverflow(false);
                return;
            }

            window.requestAnimationFrame(measureLayout);
        };

        window.addEventListener("resize", handleWindowResize);

        return () => {
            window.cancelAnimationFrame(frame);
            observer?.disconnect();
            window.removeEventListener("resize", handleWindowResize);
        };
    }, [
        compressionLevel,
        hasPeople,
        layoutMeasurementKey,
        manualBlank,
        maxCompressionLevel,
    ]);

    return (
        <div
            className={`${styles.tagRenderer} ${mode === "preview"
                ? styles.previewTagRenderer
                : styles.printTagRenderer
                } ${styles[`tagSize_${tag.size}`]} ${styles[`tagColor_${tag.color}`]
                } ${styles[`font_${tag.fontPreset}`]} ${styles[`textSize_${tag.textSizeStep + 2}`]
                } ${styles[`layout_${layoutDensity}`]} ${tag.textEmphasis ? styles.textEmphasis : ""
                } ${manualBlank ? styles.manualBlankTag : ""}`}
        >
            <div className={styles.tagContent}>
                {manualBlank || (!hasPeople && mode === "print") ? (
                    <div
                        className={styles.manualBlankStructure}
                        aria-hidden="true"
                    >
                        <span className={styles.manualBlankLine} />
                        <span className={styles.manualBlankLine} />
                    </div>
                ) : (
                    <>
                        <div
                            className={styles.topGraphicSlot}
                            aria-hidden="true"
                        >
                            <img
                                src="/images/temple-tools/lantern-tag/lantern-tag-top.webp"
                                alt=""
                                draggable={false}
                            />
                        </div>

                        {!hasPeople ? (
                            <div className={styles.emptyTagGuide}>
                                <strong>입력 전 미리보기</strong>
                                <span>이 안내는 인쇄되지 않습니다.</span>
                            </div>
                        ) : (
                            <div
                                ref={flowRef}
                                className={`${styles.tagFlow} ${hasPrayer
                                    ? styles.tagFlowWithPrayer
                                    : styles.tagFlowWithoutPrayer
                                    }`}
                            >
                                <div
                                    ref={leaderRef}
                                    className={`${styles.leaderArea} ${leaders.length >= 2
                                        ? styles.twoLeaders
                                        : styles.oneLeader
                                        }`}
                                >
                                    {leaders.map((person, index) => (
                                        <div
                                            key={`leader-${index}`}
                                            className={styles.leaderPerson}
                                        >
                                            {person.dharmaName && (
                                                <span className={styles.leaderDharma}>
                                                    {person.dharmaName}
                                                </span>
                                            )}

                                            <strong>{person.name}</strong>

                                            {person.birth && (
                                                <small>{person.birth}</small>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {children.length > 0 && (
                                    <div
                                        ref={childrenRef}
                                        className={styles.childrenArea}
                                    >
                                        {children.map((person, index) => (
                                            <div
                                                key={`child-${index}`}
                                                className={styles.childPerson}
                                            >
                                                <strong>{person.name}</strong>

                                                {(person.birth || person.dharmaName) && (
                                                    <span>
                                                        {[
                                                            person.birth,
                                                            person.dharmaName,
                                                        ]
                                                            .filter(Boolean)
                                                            .join(" · ")}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {hasPrayer && (
                                    <>
                                        <div
                                            className={styles.prayerSpacer}
                                            aria-hidden="true"
                                        />
                                        <div
                                            ref={prayerRef}
                                            className={styles.tagPrayer}
                                        >
                                            {tag.prayer}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        <div
                            className={styles.bottomGraphicSlot}
                            aria-hidden="true"
                        >
                            <img
                                src="/images/temple-tools/lantern-tag/lantern-tag-bottom.webp"
                                alt=""
                                draggable={false}
                            />
                        </div>

                        {mode === "print" && contentOverflow && (
                            <div
                                className={styles.contentOverflowWarning}
                                role="status"
                            >
                                내용이 인쇄 영역을 넘습니다.
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}


type SheetGroup = {
    key: TagSize;
    label: string;
    perPage: number;
    pages: SavedLanternTag[][];
};

function paginateTags(
    tags: SavedLanternTag[],
    perPage: number,
    ensureOnePage = false
): SavedLanternTag[][] {
    const pages: SavedLanternTag[][] = [];

    for (let index = 0; index < tags.length; index += perPage) {
        pages.push(tags.slice(index, index + perPage));
    }

    if (ensureOnePage && pages.length === 0) {
        pages.push([]);
    }

    return pages;
}

function createEmptyTagFromStyle(tag: LanternTagData): LanternTagData {
    return {
        ...createEmptyTag(),
        size: tag.size,
        color: tag.color,
        fontPreset: tag.fontPreset,
        textSizeStep: tag.textSizeStep,
        textEmphasis: tag.textEmphasis,
    };
}

function LanternSheetPage({
    group,
    page,
    pageIndex,
    selectable = false,
    selectedId,
    onSelect,
    onEdit,
}: {
    group: SheetGroup;
    page: SavedLanternTag[];
    pageIndex: number;
    selectable?: boolean;
    selectedId?: string | null;
    onSelect?: (id: string) => void;
    onEdit?: (tag: SavedLanternTag) => void;
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
                        ? ` · 수기용 빈 꼬리표 ${group.perPage - page.length}매`
                        : " · 모두 입력"}
                </span>
            </div>

            <div
                className={`${styles.printSheet} ${styles[`sheet_${group.key}`]
                    }`}
            >
                {Array.from({ length: group.perPage }, (_, slotIndex) => {
                    const tag = page[slotIndex];

                    if (!tag) {
                        const manualBlankTag: LanternTagData = {
                            ...createEmptyTag(),
                            size: group.key,
                        };

                        return (
                            <div
                                key={`empty-${group.key}-${pageIndex}-${slotIndex}`}
                                className={styles.emptyPrintSlot}
                                aria-label="수기 작성용 빈 꼬리표"
                            >
                                <LanternTag
                                    tag={manualBlankTag}
                                    mode="print"
                                    manualBlank
                                />

                                {selectable && (
                                    <div className={styles.emptySlotScreenGuide}>
                                        <strong>수기용 빈 꼬리표</strong>
                                        <span>안내 문구는 인쇄되지 않음</span>
                                    </div>
                                )}
                            </div>
                        );
                    }

                    const isDraft = tag.id === DRAFT_PREVIEW_ID;
                    const canSelect = selectable && !isDraft;
                    const isSelected = canSelect && selectedId === tag.id;

                    return (
                        <div
                            key={tag.id}
                            className={`${styles.sheetSlot} ${isSelected ? styles.sheetSlotSelected : ""
                                } ${isDraft ? styles.sheetSlotDraft : ""}`}
                            role={canSelect ? "button" : undefined}
                            tabIndex={canSelect ? 0 : undefined}
                            aria-label={
                                canSelect
                                    ? `${tag.people[0].name || "꼬리표"} 선택`
                                    : isDraft
                                        ? "현재 작성 중인 꼬리표"
                                        : undefined
                            }
                            onClick={
                                canSelect ? () => onSelect?.(tag.id) : undefined
                            }
                            onKeyDown={
                                canSelect
                                    ? (event) => {
                                        if (
                                            event.key === "Enter" ||
                                            event.key === " "
                                        ) {
                                            event.preventDefault();
                                            onSelect?.(tag.id);
                                        }
                                    }
                                    : undefined
                            }
                        >
                            <LanternTag tag={tag} mode="print" />

                            {isSelected && (
                                <div className={styles.slotSelectionUi}>
                                    <span>선택됨</span>
                                    <button
                                        type="button"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            onEdit?.(tag);
                                        }}
                                    >
                                        수정
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function LanternTagTool() {
    const [currentTag, setCurrentTag] =
        useState<LanternTagData>(createEmptyTag);

    const [savedTags, setSavedTags] = useState<SavedLanternTag[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [previewMode, setPreviewMode] = useState<"layout" | "input">(
        "input"
    );
    const [selectedSavedId, setSelectedSavedId] = useState<string | null>(null);
    const [showTextSettings, setShowTextSettings] = useState(false);
    const representativeNameInputRef = useRef<HTMLInputElement>(null);

    const selectedSize =
        SIZE_OPTIONS.find((option) => option.key === currentTag.size) ??
        SIZE_OPTIONS[1];

    const hasCurrentInput = useMemo(() => {
        return (
            currentTag.people.some(
                (person) =>
                    person.name.trim() ||
                    person.birth.trim() ||
                    person.dharmaName.trim()
            ) || currentTag.prayer.trim() !== ""
        );
    }, [currentTag]);

    const selectedSavedTag = useMemo(
        () => savedTags.find((tag) => tag.id === selectedSavedId) ?? null,
        [savedTags, selectedSavedId]
    );

    const screenLayout = useMemo(() => {
        const sizeOption =
            SIZE_OPTIONS.find((option) => option.key === currentTag.size) ??
            SIZE_OPTIONS[1];

        let tags = savedTags.filter(
            (tag) => tag.size === currentTag.size
        );

        let focusId: string | null = selectedSavedId;

        if (editingId) {
            const editingPreview: SavedLanternTag = {
                id: editingId,
                ...cloneTag(currentTag),
            };

            const existingIndex = tags.findIndex(
                (tag) => tag.id === editingId
            );

            if (existingIndex >= 0) {
                tags = tags.map((tag) =>
                    tag.id === editingId ? editingPreview : tag
                );
            } else {
                tags = [
                    ...tags.filter((tag) => tag.id !== editingId),
                    editingPreview,
                ];
            }

            focusId = editingId;
        } else if (hasCurrentInput) {
            tags = [
                ...tags,
                {
                    id: DRAFT_PREVIEW_ID,
                    ...cloneTag(currentTag),
                },
            ];
            focusId = DRAFT_PREVIEW_ID;
        }

        const pages = paginateTags(tags, sizeOption.perPage, true);

        let pageIndex = 0;
        if (focusId) {
            const focusedIndex = tags.findIndex((tag) => tag.id === focusId);
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
    }, [
        savedTags,
        currentTag,
        editingId,
        hasCurrentInput,
        selectedSavedId,
    ]);

    const printGroups = useMemo<SheetGroup[]>(() => {
        const sizeOption =
            SIZE_OPTIONS.find((option) => option.key === currentTag.size) ??
            SIZE_OPTIONS[1];

        const tags = savedTags.filter(
            (tag) => tag.size === currentTag.size
        );

        if (tags.length === 0) {
            return [];
        }

        return [
            {
                ...sizeOption,
                pages: paginateTags(tags, sizeOption.perPage),
            },
        ];
    }, [savedTags, currentTag.size]);

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
    }

    function updatePerson(
        index: number,
        field: keyof Person,
        value: string
    ) {
        setCurrentTag((previous) => ({
            ...previous,
            people: previous.people.map((person, personIndex) =>
                personIndex === index
                    ? { ...person, [field]: value }
                    : person
            ),
        }));
        enterInputPreview();
    }

    function updatePrayer(value: string) {
        setCurrentTag((previous) => ({
            ...previous,
            prayer: value,
        }));
        enterInputPreview();
    }

    function focusRepresentativeName() {
        window.requestAnimationFrame(() => {
            representativeNameInputRef.current?.focus();
        });
    }

    function handleSizeChange(size: TagSize) {
        if (size === currentTag.size) {
            setPreviewMode("input");
            focusRepresentativeName();
            return;
        }

        if (editingId) {
            window.alert(
                "수정이 완료되지 않았습니다. 먼저 수정 완료를 눌러 주세요."
            );
            return;
        }

        if (hasCurrentInput) {
            window.alert(
                "현재 작성 중인 꼬리표가 저장되지 않았습니다. 먼저 출력 목록에 추가해 주세요."
            );
            return;
        }

        setCurrentTag((previous) => ({ ...previous, size }));
        setSelectedSavedId(null);
        setPreviewMode("input");
        focusRepresentativeName();
    }

    function handleColorChange(color: TagColor) {
        setCurrentTag((previous) => ({ ...previous, color }));
        enterInputPreview();
    }

    function updateTextSize(delta: -1 | 1) {
        setCurrentTag((previous) => ({
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
                    ? "현재 수정 내용을 닫고 새 꼬리표를 작성할까요?"
                    : "현재 작성 중인 내용을 닫고 새 꼬리표를 작성할까요?"
            );

            if (!confirmed) return;
        }

        setCurrentTag((previous) => createEmptyTagFromStyle(previous));
        setEditingId(null);
        setSelectedSavedId(null);
        setShowTextSettings(false);
        setPreviewMode("input");
    }

    function handleSave() {
        const representativeName = currentTag.people[0].name.trim();

        if (!representativeName) {
            window.alert("대표자 성명을 입력해 주세요.");
            return;
        }

        if (editingId) {
            const updatedId = editingId;

            setSavedTags((previous) =>
                previous.map((tag) =>
                    tag.id === editingId
                        ? {
                            id: tag.id,
                            ...cloneTag(currentTag),
                        }
                        : tag
                )
            );

            setCurrentTag((previous) => createEmptyTagFromStyle(previous));
            setEditingId(null);
            setSelectedSavedId(updatedId);
            setShowTextSettings(false);
            setPreviewMode("layout");
            return;
        }

        const newTag: SavedLanternTag = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            ...cloneTag(currentTag),
        };

        setSavedTags((previous) => [...previous, newTag]);
        setCurrentTag((previous) => createEmptyTagFromStyle(previous));
        setEditingId(null);
        setSelectedSavedId(newTag.id);
        setShowTextSettings(false);
        setPreviewMode("layout");
    }

    function handleEdit(tag: SavedLanternTag) {
        setCurrentTag(cloneTag(tag));
        setEditingId(tag.id);
        setSelectedSavedId(tag.id);
        setPreviewMode("input");
        setShowTextSettings(false);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    function handleDelete(tag: SavedLanternTag) {
        const representative = tag.people[0].name.trim() || "이 꼬리표";

        const confirmed = window.confirm(
            `${representative} 꼬리표를 출력 목록에서 삭제할까요?`
        );

        if (!confirmed) return;

        setSavedTags((previous) =>
            previous.filter((item) => item.id !== tag.id)
        );

        if (selectedSavedId === tag.id) {
            setSelectedSavedId(null);
        }

        if (editingId === tag.id) {
            setCurrentTag((previous) => createEmptyTagFromStyle(previous));
            setEditingId(null);
            setShowTextSettings(false);
            setPreviewMode("layout");
        }
    }

    function handleLayoutPreview() {
        setPreviewMode("layout");
        setShowTextSettings(false);
    }

    function handleSelectSavedTag(id: string) {
        setSelectedSavedId(id);
    }

    return (
        <main className={styles.toolPage}>
            <section className={styles.toolHeader}>
                <div
                    className={styles.titleGroup}
                    style={{ display: "flex", alignItems: "baseline", gap: "16px", flexWrap: "wrap" }}
                >
                    <h1 className={styles.title}>연등 꼬리표 만들기</h1>
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
                                    ? "저장된 꼬리표 수정"
                                    : "현재 꼬리표 작성"}
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
                                <h3>꼬리표 규격</h3>

                                <div
                                    className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1"
                                    role="group"
                                    aria-label="꼬리표 배경색"
                                >
                                    <span className="text-[10px] font-medium text-[#7F8790]">
                                        배경색
                                    </span>

                                    {COLOR_OPTIONS.map((option) => (
                                        <button
                                            key={option.key}
                                            type="button"
                                            className="inline-flex items-center gap-1.5 border-0 bg-transparent p-0 text-[10px] text-[#68717B] transition-colors hover:text-[#30353C] focus-visible:outline-none"
                                            onClick={() => handleColorChange(option.key)}
                                            aria-pressed={currentTag.color === option.key}
                                            aria-label={`배경색 ${option.label}`}
                                        >
                                            <span
                                                className={`${styles.swatch} ${option.key === "white"
                                                    ? styles.whiteSwatch
                                                    : option.key === "yellow"
                                                        ? styles.yellowSwatch
                                                        : option.key === "pink"
                                                            ? styles.pinkSwatch
                                                            : styles.greenSwatch
                                                    } ${currentTag.color === option.key
                                                        ? "ring-2 ring-[#6C91BD] ring-offset-1"
                                                        : ""
                                                    }`}
                                                aria-hidden="true"
                                            />
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.sizeOptions}>
                                {SIZE_OPTIONS.map((option) => (
                                    <button
                                        key={option.key}
                                        type="button"
                                        className={`${styles.sizeButton} ${currentTag.size === option.key
                                            ? styles.sizeButtonActive
                                            : ""
                                            }`}
                                        onClick={() => handleSizeChange(option.key)}
                                    >
                                        <strong>{option.label}</strong>
                                        <span>A4 {option.perPage}매</span>
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section className={styles.formSection}>
                            <div className={styles.sectionTitleRow}>
                                <h3>가족 정보</h3>
                                <span>
                                    빈 가족칸은 꼬리표에 표시되지 않습니다.
                                </span>
                            </div>

                            <div className={styles.peopleBox}>
                                <div className={styles.columnLabels}>
                                    <span />
                                    <span>성명</span>
                                    <span>생년 / 간지</span>
                                    <span>법명</span>
                                </div>

                                {currentTag.people.map((person, index) => {
                                    const label =
                                        index === 0
                                            ? "대표자 1"
                                            : index === 1
                                                ? "대표자 2"
                                                : `자녀 ${index - 1}`;

                                    return (
                                        <div
                                            key={index}
                                            className={`${styles.personRow} ${index === 0
                                                ? styles.representativeRow
                                                : ""
                                                }`}
                                        >
                                            <div className={styles.personLabel}>
                                                {label}
                                                {index === 0 && <em>필수</em>}
                                            </div>

                                            <input
                                                ref={
                                                    index === 0
                                                        ? representativeNameInputRef
                                                        : undefined
                                                }
                                                type="text"
                                                value={person.name}
                                                autoFocus={index === 0}
                                                aria-label={`${label} 성명`}
                                                placeholder={
                                                    index === 0 ? "성명 입력" : ""
                                                }
                                                onChange={(event) =>
                                                    updatePerson(
                                                        index,
                                                        "name",
                                                        event.target.value
                                                    )
                                                }
                                            />

                                            <input
                                                type="text"
                                                value={person.birth}
                                                aria-label={`${label} 생년 또는 간지`}
                                                placeholder={
                                                    index === 0
                                                        ? "예: 1965년 / 을사생"
                                                        : ""
                                                }
                                                onChange={(event) =>
                                                    updatePerson(
                                                        index,
                                                        "birth",
                                                        event.target.value
                                                    )
                                                }
                                            />

                                            <input
                                                type="text"
                                                value={person.dharmaName}
                                                aria-label={`${label} 법명`}
                                                placeholder={
                                                    index === 0 ? "선택" : ""
                                                }
                                                onChange={(event) =>
                                                    updatePerson(
                                                        index,
                                                        "dharmaName",
                                                        event.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        <section className={styles.formSection}>
                            <div className={styles.sectionTitleRow}>
                                <h3>발원문</h3>
                                <span>
                                    꼬리표 아래쪽에 가로쓰기로 표시됩니다.
                                </span>
                            </div>

                            <textarea
                                className={styles.prayerInput}
                                rows={3}
                                value={currentTag.prayer}
                                placeholder="예: 가족의 건강과 평안을 기원합니다."
                                onChange={(event) => updatePrayer(event.target.value)}
                            />
                        </section>

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

                        {savedTags.length > 0 && (
                            <section className={styles.savedSection}>
                                <div className={styles.savedSectionHeader}>
                                    <h3>출력 목록</h3>
                                    <span>{savedTags.length}장</span>
                                </div>

                                <div className={styles.savedList}>
                                    {savedTags.map((tag, index) => {
                                        const representative =
                                            tag.people[0].name.trim() ||
                                            "이름 없음";

                                        const familyCount = tag.people.filter(
                                            (person) => person.name.trim()
                                        ).length;

                                        const sizeLabel =
                                            SIZE_OPTIONS.find(
                                                (option) =>
                                                    option.key === tag.size
                                            )?.label ?? "";

                                        return (
                                            <div
                                                key={tag.id}
                                                className={styles.savedItem}
                                            >
                                                <div
                                                    className={styles.savedIndex}
                                                >
                                                    {index + 1}
                                                </div>

                                                <div
                                                    className={styles.savedInfo}
                                                >
                                                    <strong>
                                                        {representative}
                                                    </strong>
                                                    <span>
                                                        {sizeLabel} · {familyCount}
                                                        명
                                                    </span>
                                                </div>

                                                <div
                                                    className={
                                                        styles.savedActions
                                                    }
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleEdit(tag)
                                                        }
                                                    >
                                                        수정
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(tag)
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
                                        ? "꼬리표 수정"
                                        : "꼬리표 입력"}
                            </h2>

                            {previewMode === "layout" && (
                                <p>
                                    {selectedSize.label} · A4 한 장 {selectedSize.perPage}매
                                </p>
                            )}
                        </div>

                        <div className={styles.previewHeaderActions}>
                            {previewMode === "layout" && (
                                <div className={styles.savedCount}>
                                    출력 목록 {savedTags.length}장
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
                                onClick={() => {
                                    if (previewMode === "layout") {
                                        window.print();
                                        return;
                                    }

                                    handleSave();
                                }}
                            >
                                {previewMode === "layout"
                                    ? "인쇄하기"
                                    : editingId
                                        ? "수정 완료"
                                        : "출력 목록에 추가"}
                            </button>
                        </div>
                    </div>

                    {previewMode === "input" ? (
                        <div className={styles.previewStage}>
                            <div className={styles.previewStageLabel}>
                                {selectedSize.label} · {editingId ? "수정" : "입력"}
                            </div>

                            {showTextSettings && (
                                <div className={styles.textSettingsPanel}>
                                    <div className={styles.textSettingGroup}>
                                        <span className={styles.textSettingLabel}>
                                            글꼴
                                        </span>

                                        <div className={styles.fontPresetButtons}>
                                            <button
                                                type="button"
                                                className={
                                                    currentTag.fontPreset ===
                                                        "classic"
                                                        ? styles.settingActive
                                                        : ""
                                                }
                                                onClick={() =>
                                                    setCurrentTag(
                                                        (previous) => ({
                                                            ...previous,
                                                            fontPreset:
                                                                "classic",
                                                        })
                                                    )
                                                }
                                            >
                                                단정한 명조
                                            </button>

                                            <button
                                                type="button"
                                                className={
                                                    currentTag.fontPreset ===
                                                        "soft"
                                                        ? styles.settingActive
                                                        : ""
                                                }
                                                onClick={() =>
                                                    setCurrentTag(
                                                        (previous) => ({
                                                            ...previous,
                                                            fontPreset: "soft",
                                                        })
                                                    )
                                                }
                                            >
                                                부드러운 명조
                                            </button>

                                            <button
                                                type="button"
                                                className={
                                                    currentTag.fontPreset ===
                                                        "sans"
                                                        ? styles.settingActive
                                                        : ""
                                                }
                                                onClick={() =>
                                                    setCurrentTag(
                                                        (previous) => ({
                                                            ...previous,
                                                            fontPreset: "sans",
                                                        })
                                                    )
                                                }
                                            >
                                                현대적인 고딕
                                            </button>
                                        </div>
                                    </div>

                                    <div className={styles.textSettingGroup}>
                                        <span className={styles.textSettingLabel}>
                                            글자 크기
                                        </span>

                                        <div className={styles.sizeControl}>
                                            <button
                                                type="button"
                                                disabled={
                                                    currentTag.textSizeStep === -2
                                                }
                                                onClick={() => updateTextSize(-1)}
                                            >
                                                −
                                            </button>

                                            <span>
                                                {currentTag.textSizeStep === 0
                                                    ? "기본"
                                                    : currentTag.textSizeStep > 0
                                                        ? `+${currentTag.textSizeStep}`
                                                        : currentTag.textSizeStep}
                                            </span>

                                            <button
                                                type="button"
                                                disabled={
                                                    currentTag.textSizeStep === 2
                                                }
                                                onClick={() => updateTextSize(1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <div className={styles.textSettingGroup}>
                                        <span className={styles.textSettingLabel}>
                                            글자 강조
                                        </span>

                                        <button
                                            type="button"
                                            className={`${styles.emphasisButton} ${currentTag.textEmphasis
                                                ? styles.settingActive
                                                : ""
                                                }`}
                                            onClick={() =>
                                                setCurrentTag((previous) => ({
                                                    ...previous,
                                                    textEmphasis:
                                                        !previous.textEmphasis,
                                                }))
                                            }
                                        >
                                            {currentTag.textEmphasis
                                                ? "강조 사용"
                                                : "보통"}
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        className={styles.resetTextButton}
                                        onClick={() =>
                                            setCurrentTag((previous) => ({
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

                            <LanternTag tag={currentTag} mode="preview" />
                        </div>
                    ) : (
                        <div className={styles.printPreviewStage}>
                            {selectedSavedTag &&
                                selectedSavedTag.size === currentTag.size &&
                                !editingId &&
                                !hasCurrentInput && (
                                    <div className={styles.selectedTagNotice}>
                                        <span>
                                            <strong>
                                                {selectedSavedTag.people[0].name ||
                                                    "선택한 꼬리표"}
                                            </strong>
                                            꼬리표가 선택되었습니다.
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleEdit(selectedSavedTag)
                                            }
                                        >
                                            수정
                                        </button>
                                    </div>
                                )}

                            <div
                                className={`${styles.printPages} ${styles.screenPrintPages}`}
                            >
                                <LanternSheetPage
                                    key={`screen-${screenLayout.group.key}-${screenLayout.pageIndex}`}
                                    group={screenLayout.group}
                                    page={screenLayout.page}
                                    pageIndex={screenLayout.pageIndex}
                                    selectable
                                    selectedId={selectedSavedId}
                                    onSelect={handleSelectSavedTag}
                                    onEdit={handleEdit}
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
                                <LanternSheetPage
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
