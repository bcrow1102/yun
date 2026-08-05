"use client";

import Link from "next/link";
import {
    useMemo,
    useRef,
    useState,
    type CSSProperties,
    type ChangeEvent,
    type PointerEvent as ReactPointerEvent,
} from "react";

type ChannelKey =
    | "kakao"
    | "instagram"
    | "story"
    | "blog"
    | "youtube"
    | "share"
    | "a4";

type SceneKey =
    | "otherLotus"
    | "otherMoon"
    | "otherLanterns"
    | "moreMountain"
    | "moreBamboo"
    | "moreLotus"
    | "moreTwilight"
    | "moreTea"
    | "moreMoonLanterns"
    | "custom";
type ImageCategory = "featured" | "other";
type ImageFit = "cover" | "contain";
type TextKey =
    | "title"
    | "organizer"
    | "date"
    | "place"
    | "description"
    | "application";
type SelectedElement = TextKey | "divider" | "line";

type LineVariant = "solid" | "dashed";
type LineOrientation = "horizontal" | "vertical";
type LineInteractionMode = "move" | "start" | "end";

type CustomLine = {
    id: string;
    variant: LineVariant;
    orientation: LineOrientation;
    start: { x: number; y: number };
    end: { x: number; y: number };
    color: string;
    width: number;
};

type EditorTab = "content" | "image" | "style" | "copy";
type CopyKey = "kakao" | "instagram" | "blog" | "youtube" | "sms";
type FontKey =
    | "system"
    | "pretendard"
    | "notoSans"
    | "gmarket"
    | "notoSerif"
    | "gowun";
type ShadowKey = "none" | "soft" | "normal" | "strong";
type RichTextKey = TextKey;
type PictogramKey =
    | "none"
    | "calendar"
    | "pin"
    | "phone"
    | "clock"
    | "music"
    | "lotus"
    | "info"
    | "pointer";

type RichTextRun = {
    start: number;
    end: number;
    color: string;
    fontWeight: number;
    scale: number;
};

const LOTUS_SYMBOL = "❀";
const PIN_SYMBOL = "⌖";

const pictogramOptions: {
    key: PictogramKey;
    label: string;
    path: string;
    symbol: string;
    filled?: boolean;
}[] = [
        { key: "none", label: "없음", path: "", symbol: "" },
        {
            key: "pin",
            label: "위치",
            symbol: PIN_SYMBOL,
            path: "M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12ZM12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
        },
        {
            key: "phone",
            label: "전화",
            symbol: "☎",
            path: "M6.6 3.8 9.2 7a1.5 1.5 0 0 1-.1 2l-1.3 1.4a15 15 0 0 0 5.8 5.8l1.4-1.3a1.5 1.5 0 0 1 2-.1l3.2 2.6a1.5 1.5 0 0 1 .3 1.9c-.8 1.4-2.3 2.2-4 1.9C9.8 20 4 14.2 2.8 7.5c-.3-1.7.5-3.2 1.9-4a1.5 1.5 0 0 1 1.9.3Z",
        },
        {
            key: "clock",
            label: "시계",
            symbol: "◷",
            path: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v5l3.2 2",
        },
        {
            key: "music",
            label: "음표",
            symbol: "♫",
            path: "M9 18V6l10-2v12M9 10l10-2M6.5 21A2.5 2.5 0 1 0 6.5 16a2.5 2.5 0 0 0 0 5ZM16.5 19a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
        },
        {
            key: "lotus",
            label: "연꽃",
            symbol: LOTUS_SYMBOL,
            path: "M12 18c-3.2-3.4-3.7-6.8 0-12 3.7 5.2 3.2 8.6 0 12Zm-1 1c-4.7-.5-7.2-2.7-7-7.8 4.3.5 6.8 3.1 7 7.8Zm2 0c4.7-.5 7.2-2.7 7-7.8-4.3.5-6.8 3.1-7 7.8ZM4 21h16",
        },
        {
            key: "info",
            label: "안내",
            symbol: "ⓘ",
            path: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-10v6M12 7.5v.2",
        },
        {
            key: "pointer",
            label: "화살표",
            symbol: "→",
            path: "M3.5 13.5c0-1.3 1-2.3 2.3-2.3h6.9l-1.6-1.6a1.7 1.7 0 0 1 2.4-2.4l6 4.8a2 2 0 0 1 0 3.1l-6 4.8a1.7 1.7 0 0 1-2.4-2.4l1.6-1.6H5.8a2.3 2.3 0 0 1-2.3-2.4Z",
            filled: true,
        },
    ];

const channels: Record<
    ChannelKey,
    {
        label: string;
        size: string;
        width: number;
        height: number;
        guide: string;
    }
> = {
    kakao: {
        label: "카카오톡",
        size: "1080 × 1080",
        width: 1080,
        height: 1080,
        guide: "이미지를 저장하고 안내 문구를 복사한 뒤 대화방에서 함께 보내세요.",
    },
    instagram: {
        label: "인스타 피드",
        size: "1080 × 1350",
        width: 1080,
        height: 1350,
        guide:
            "새 게시물에서 저장한 이미지를 선택하고 본문과 해시태그를 붙여 넣으세요.",
    },
    story: {
        label: "인스타 스토리",
        size: "1080 × 1920",
        width: 1080,
        height: 1920,
        guide: "스토리 만들기에서 저장한 이미지를 선택하고 링크 스티커를 더하세요.",
    },
    blog: {
        label: "네이버 블로그",
        size: "1200 × 628",
        width: 1200,
        height: 628,
        guide: "글쓰기에서 이미지를 올리고 준비된 제목과 본문을 붙여 넣으세요.",
    },
    youtube: {
        label: "유튜브 썸네일",
        size: "1280 × 720",
        width: 1280,
        height: 720,
        guide: "YouTube Studio의 동영상 세부정보에서 맞춤 썸네일로 올리세요.",
    },
    share: {
        label: "문자·일반 공유",
        size: "1080 × 1080",
        width: 1080,
        height: 1080,
        guide:
            "이미지를 저장한 뒤 문자나 원하는 앱에서 짧은 안내문과 함께 보내세요.",
    },
    a4: {
        label: "A4 인쇄",
        size: "2480 × 3508",
        width: 2480,
        height: 3508,
        guide:
            "A4 세로 인쇄용 PNG입니다. 인쇄할 때 여백 없음과 실제 크기를 선택하세요.",
    },
};

const copyEmojiOptions = [
    "📅",
    "📍",
    "☎️",
    "⏰",
    "🎵",
    "🙏",
    "🌿",
    "🌸",
    "🪷",
    "✨",
    "🎉",
    "📢",
    "✅",
    "💛",
    "🍵",
    "🥗",
    "🏯",
    "📷",
    "🎁",
    "🙌",
];

type SceneOption = {
    key: SceneKey;
    label: string;
    description: string;
    image: string;
};

const featuredScenes: SceneOption[] = [
    {
        key: "otherLotus",
        label: "연꽃 동자승",
        description: "따뜻한 인사와 일반 행사에 어울려요",
        image: "/images/promote/promote-other-lotus-novice.webp",
    },
    {
        key: "otherMoon",
        label: "고요한 달빛",
        description: "명상·기도·교육 안내에 어울려요",
        image: "/images/promote/promote-other-moon-novice.webp",
    },
    {
        key: "otherLanterns",
        label: "한지 연등",
        description: "어떤 불교 행사에도 편하게 사용할 수 있어요",
        image: "/images/promote/promote-other-lanterns.webp",
    },
];

const otherScenes: SceneOption[] = [
    {
        key: "moreMountain",
        label: "산사 능선",
        description: "사찰 안내와 일반 행사에 어울려요",
        image: "/images/promote/promote-more-mountain.webp",
    },
    {
        key: "moreBamboo",
        label: "대나무 바람",
        description: "명상·교육·자연 행사에 어울려요",
        image: "/images/promote/promote-more-bamboo.webp",
    },
    {
        key: "moreLotus",
        label: "연꽃 물결",
        description: "법회와 문화행사에 어울려요",
        image: "/images/promote/promote-more-lotus.webp",
    },
    {
        key: "moreTwilight",
        label: "초저녁 산사",
        description: "음악회와 저녁 행사에 어울려요",
        image: "/images/promote/promote-more-twilight.webp",
    },
    {
        key: "moreTea",
        label: "차와 다식",
        description: "사찰음식과 차 행사에 어울려요",
        image: "/images/promote/promote-more-tea.webp",
    },
    {
        key: "moreMoonLanterns",
        label: "달과 연등",
        description: "기도·법회·연등 행사에 어울려요",
        image: "/images/promote/promote-more-moon-lanterns.webp",
    },
];

const scenesByCategory: Record<ImageCategory, SceneOption[]> = {
    featured: featuredScenes,
    other: otherScenes,
};

const fieldClass =
    "mt-2 w-full rounded-xl border border-[#E1E4E8] bg-white px-4 py-3 text-[15px] font-normal text-[#8B95A1] outline-none transition placeholder:font-normal placeholder:text-[#A1A8B2] focus:border-[#B9BA28] focus:ring-2 focus:ring-[#F4F54A]/30";

const fontOptions: Record<
    FontKey,
    { label: string; css: string; canvas: string }
> = {
    system: {
        label: "기본 고딕",
        css: "Arial, sans-serif",
        canvas: "Arial, sans-serif",
    },
    pretendard: {
        label: "Pretendard",
        css: "Pretendard, sans-serif",
        canvas: "Pretendard, sans-serif",
    },
    notoSans: {
        label: "Noto Sans",
        css: "'Noto Sans KR', sans-serif",
        canvas: "'Noto Sans KR', sans-serif",
    },
    gmarket: {
        label: "Gmarket Sans",
        css: "GmarketSans, sans-serif",
        canvas: "GmarketSans, sans-serif",
    },
    notoSerif: {
        label: "Noto Serif",
        css: "'Noto Serif KR', serif",
        canvas: "'Noto Serif KR', serif",
    },
    gowun: {
        label: "부드러운 고딕",
        css: "'Gowun Dodum', sans-serif",
        canvas: "'Gowun Dodum', sans-serif",
    },
};

const colorPalette = [
    "#171B22",
    "#FFFFFF",
    "#F4F54A",
    "#5A3E2B",
    "#233B68",
    "#285943",
    "#6B315E",
    "#B73535",
];

const colorNames: Record<string, string> = {
    "#171B22": "먹색",
    "#FFFFFF": "흰색",
    "#F4F54A": "레몬색",
    "#5A3E2B": "짙은 갈색",
    "#233B68": "남색",
    "#285943": "짙은 녹색",
    "#6B315E": "자주색",
    "#B73535": "붉은색",
};

const imageCategories: { key: ImageCategory; label: string }[] = [
    { key: "featured", label: "대표" },
    { key: "other", label: "기타" },
];

const textLabels: Record<TextKey, string> = {
    title: "행사명",
    organizer: "사찰·기관명",
    date: "일시",
    place: "장소",
    description: "행사 내용",
    application: "신청·문의",
};

type TextFormat = {
    fontKey: FontKey;
    color: string;
    fontWeight: number;
    scale: number;
    shadowKey: ShadowKey;
};

type ResolvedTextFormat = TextFormat & {
    size: number;
    family: string;
    shadow: { blur: number; opacity: number; offset: number };
};

const initialTextFormats: Record<TextKey, TextFormat> = {
    title: {
        fontKey: "pretendard",
        color: "#171B22",
        fontWeight: 500,
        scale: 100,
        shadowKey: "soft",
    },
    organizer: {
        fontKey: "pretendard",
        color: "#171B22",
        fontWeight: 500,
        scale: 100,
        shadowKey: "soft",
    },
    date: {
        fontKey: "pretendard",
        color: "#171B22",
        fontWeight: 500,
        scale: 100,
        shadowKey: "soft",
    },
    place: {
        fontKey: "pretendard",
        color: "#171B22",
        fontWeight: 500,
        scale: 100,
        shadowKey: "soft",
    },
    description: {
        fontKey: "pretendard",
        color: "#171B22",
        fontWeight: 500,
        scale: 100,
        shadowKey: "soft",
    },
    application: {
        fontKey: "pretendard",
        color: "#171B22",
        fontWeight: 500,
        scale: 100,
        shadowKey: "soft",
    },
};

const SAFE_AREA = {
    left: 0.07,
    right: 0.93,
    top: 0.08,
    bottom: 0.95,
};

const LINE_MIN_LENGTH = {
    horizontal: 0.08,
    vertical: 0.05,
};

const LINE_DRAW_THRESHOLD = 0.015;


type HsvColor = { h: number; s: number; v: number };

function hexToHsv(hex: string): HsvColor {
    const normalized = hex.replace("#", "");
    const r = parseInt(normalized.slice(0, 2), 16) / 255;
    const g = parseInt(normalized.slice(2, 4), 16) / 255;
    const b = parseInt(normalized.slice(4, 6), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    let h = 0;

    if (delta) {
        if (max === r) h = 60 * (((g - b) / delta) % 6);
        else if (max === g) h = 60 * ((b - r) / delta + 2);
        else h = 60 * ((r - g) / delta + 4);
    }

    if (h < 0) h += 360;

    return {
        h,
        s: max === 0 ? 0 : (delta / max) * 100,
        v: max * 100,
    };
}

function hsvToHex({ h, s, v }: HsvColor) {
    const saturation = s / 100;
    const value = v / 100;
    const chroma = value * saturation;
    const x = chroma * (1 - Math.abs(((h / 60) % 2) - 1));
    const match = value - chroma;
    let rgb = [0, 0, 0];

    if (h < 60) rgb = [chroma, x, 0];
    else if (h < 120) rgb = [x, chroma, 0];
    else if (h < 180) rgb = [0, chroma, x];
    else if (h < 240) rgb = [0, x, chroma];
    else if (h < 300) rgb = [x, 0, chroma];
    else rgb = [chroma, 0, x];

    return `#${rgb
        .map((channel) =>
            Math.round((channel + match) * 255)
                .toString(16)
                .padStart(2, "0"),
        )
        .join("")}`.toUpperCase();
}

function ModernColorPicker({
    value,
    onChange,
    label,
}: {
    value: string;
    onChange: (color: string) => void;
    label: string;
}) {
    const [open, setOpen] = useState(false);
    const areaRef = useRef<HTMLDivElement>(null);
    const hsv = hexToHsv(value);

    const updateSaturationValue = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (event.type === "pointermove" && event.buttons !== 1) return;
        const bounds = areaRef.current?.getBoundingClientRect();
        if (!bounds) return;

        const s = Math.max(
            0,
            Math.min(100, ((event.clientX - bounds.left) / bounds.width) * 100),
        );
        const v = Math.max(
            0,
            Math.min(100, 100 - ((event.clientY - bounds.top) / bounds.height) * 100),
        );

        event.currentTarget.setPointerCapture(event.pointerId);
        onChange(hsvToHex({ h: hsv.h, s, v }));
    };

    const applyHex = (raw: string) => {
        const normalized = raw.trim().replace("#", "");
        if (/^[0-9A-Fa-f]{6}$/.test(normalized)) {
            onChange(`#${normalized.toUpperCase()}`);
        }
    };

    return (
        <div className="relative inline-flex flex-col items-center">
            <button
                type="button"
                onClick={() => setOpen(true)}
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-white shadow-sm ring-1 transition hover:scale-110 ${!colorPalette.includes(value) ? "ring-2 ring-[#3182F6]" : "ring-[#DDE1E5]"}`}
                style={{
                    background:
                        "conic-gradient(#F04438, #FFB020, #F4F54A, #32B768, #2E90FA, #7A5AF8, #E85AAD, #F04438)",
                }}
                aria-label={label}
                title={label}
            >
                <span className="h-2.5 w-2.5 rounded-full bg-white/95 shadow-sm" />
            </button>
            <span className="mt-1 text-[10px] font-normal leading-none text-[#8B95A1]">
                색상표
            </span>

            {open && (
                <>
                    <button
                        type="button"
                        className="fixed inset-0 z-40 cursor-default bg-black/10 sm:bg-transparent"
                        onClick={() => setOpen(false)}
                        aria-label="색상 선택 닫기"
                    />
                    <div className="fixed inset-x-4 bottom-4 z-50 rounded-[22px] border border-[#E1E4E8] bg-white p-4 text-left shadow-[0_24px_70px_rgba(25,31,40,0.22)] sm:absolute sm:inset-x-auto sm:bottom-12 sm:right-0 sm:w-[300px]">
                        <div className="mb-3 flex items-center justify-between">
                            <strong className="text-sm font-medium text-[#252A31]">
                                색상 직접 선택
                            </strong>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F2F4F6] text-sm text-[#737B87]"
                                aria-label="닫기"
                            >
                                ×
                            </button>
                        </div>

                        <span
                            ref={areaRef}
                            role="slider"
                            aria-label="색상 밝기와 채도"
                            aria-valuetext={value}
                            tabIndex={0}
                            onPointerDown={updateSaturationValue}
                            onPointerMove={updateSaturationValue}
                            className="relative block h-40 touch-none cursor-crosshair overflow-hidden rounded-xl"
                            style={{
                                background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${hsv.h}, 100%, 50%))`,
                            }}
                        >
                            <span
                                className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_1px_4px_rgba(0,0,0,0.65)]"
                                style={{ left: `${hsv.s}%`, top: `${100 - hsv.v}%` }}
                            />
                        </span>

                        <input
                            type="range"
                            min="0"
                            max="359"
                            value={Math.round(hsv.h)}
                            onChange={(event) =>
                                onChange(hsvToHex({ ...hsv, h: Number(event.target.value) }))
                            }
                            className="mt-4 h-3 w-full cursor-pointer appearance-none rounded-full [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-transparent [&::-webkit-slider-thumb]:shadow-[0_1px_5px_rgba(0,0,0,0.55)]"
                            style={{
                                background:
                                    "linear-gradient(to right, #F00, #FF0, #0F0, #0FF, #00F, #F0F, #F00)",
                            }}
                            aria-label="색조"
                        />

                        <div className="mt-4 flex items-center gap-3">
                            <span
                                className="h-10 w-10 shrink-0 rounded-xl border border-[#DDE1E5]"
                                style={{ backgroundColor: value }}
                                aria-hidden="true"
                            />
                            <label className="flex flex-1 items-center rounded-xl border border-[#DDE1E5] bg-[#F7F8FA] px-3 py-2.5 text-sm">
                                <span className="mr-2 text-xs text-[#8B95A1]">HEX</span>
                                <input
                                    key={value}
                                    defaultValue={value.replace("#", "")}
                                    onBlur={(event) => applyHex(event.target.value)}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            applyHex(event.currentTarget.value);
                                            event.currentTarget.blur();
                                        }
                                    }}
                                    maxLength={7}
                                    className="min-w-0 flex-1 bg-transparent font-medium uppercase text-[#252A31] outline-none"
                                    aria-label="HEX 색상 코드"
                                />
                            </label>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

const shadowOptions: Record<
    ShadowKey,
    { label: string; blur: number; opacity: number; offset: number }
> = {
    none: { label: "없음", blur: 0, opacity: 0, offset: 0 },
    soft: { label: "약하게", blur: 3, opacity: 0.45, offset: 1 },
    normal: { label: "보통", blur: 6, opacity: 0.62, offset: 2 },
    strong: { label: "선명하게", blur: 10, opacity: 0.8, offset: 2 },
};

function contrastShadow(color: string, opacity: number) {
    const value = color.replace("#", "");
    const r = parseInt(value.slice(0, 2), 16);
    const g = parseInt(value.slice(2, 4), 16);
    const b = parseInt(value.slice(4, 6), 16);
    const light = (r * 299 + g * 587 + b * 114) / 1000 > 160;
    return light
        ? `rgba(0,0,0,${opacity})`
        : `rgba(255,255,255,${Math.min(opacity + 0.18, 0.95)})`;
}

function LotusMark() {
    return (
        <svg viewBox="0 0 32 32" fill="none" className="h-6 w-6" aria-hidden="true">
            <path
                d="M16 24c-4-4.1-5.2-8.2 0-15 5.2 6.8 4 10.9 0 15Z"
                stroke="currentColor"
                strokeWidth="1.6"
            />
            <path
                d="M15 24C9.5 23.3 6.6 20.5 7 14c5.4.7 8.1 4 8 10Z"
                stroke="currentColor"
                strokeWidth="1.6"
            />
            <path
                d="M17 24c5.5-.7 8.4-3.5 8-10-5.4.7-8.1 4-8 10Z"
                stroke="currentColor"
                strokeWidth="1.6"
            />
            <path
                d="M7 25h18"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
            />
        </svg>
    );
}

function isRichTextKey(key: TextKey): key is RichTextKey {
    return Boolean(key);
}

function PictogramIcon({
    icon,
    className = "h-[1em] w-[1em]",
}: {
    icon: PictogramKey;
    className?: string;
}) {
    const option = pictogramOptions.find((item) => item.key === icon);

    if (!option || icon === "none") return null;

    return (
        <svg
            viewBox="0 0 24 24"
            fill={option.filled ? "white" : "none"}
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            <path d={option.path} />
        </svg>
    );
}

function wrapText(
    context: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
    maxLines: number,
) {
    const lines: string[] = [];
    const paragraphs = text.replace(/\r\n/g, "\n").split("\n");

    for (const paragraph of paragraphs) {
        if (lines.length >= maxLines) break;

        if (!paragraph) {
            lines.push("");
            continue;
        }

        let line = "";

        for (const char of Array.from(paragraph)) {
            const next = line + char;

            if (context.measureText(next).width > maxWidth && line) {
                lines.push(line);

                if (lines.length >= maxLines) return lines;

                line = char;
            } else {
                line = next;
            }
        }

        if (line && lines.length < maxLines) lines.push(line);
    }

    return lines;
}

function drawPosterText(
    context: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    color: string,
    shadow: { blur: number; opacity: number; offset: number },
) {
    context.save();
    context.fillStyle = color;
    context.shadowColor = contrastShadow(color, shadow.opacity);
    context.shadowBlur = shadow.blur;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = shadow.offset;
    context.fillText(text, x, y);
    context.restore();
}

function drawCanvasPictogram(
    context: CanvasRenderingContext2D,
    icon: PictogramKey,
    x: number,
    centerY: number,
    size: number,
    color: string,
) {
    const option = pictogramOptions.find((item) => item.key === icon);

    if (!option || icon === "none") return;

    context.save();
    context.translate(x, centerY - size / 2);
    context.scale(size / 24, size / 24);
    context.lineWidth = 1.7;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = color;
    context.fillStyle = option.filled ? "#FFFFFF" : "transparent";

    const path = new Path2D(option.path);

    if (option.filled) context.fill(path);
    context.stroke(path);
    context.restore();
}

function richRunAt(runs: RichTextRun[], index: number) {
    return runs.find((run) => index >= run.start && index < run.end);
}

function layoutRichText(
    context: CanvasRenderingContext2D,
    text: string,
    base: ResolvedTextFormat,
    runs: RichTextRun[],
    maxWidth: number,
    maxLines: number,
) {
    type Glyph = {
        char: string;
        width: number;
        style: ResolvedTextFormat;
    };

    const lines: Glyph[][] = [[]];
    let lineWidth = 0;

    for (let index = 0; index < text.length; index += 1) {
        const char = text[index];

        if (char === "\r") continue;

        if (char === "\n") {
            if (lines.length >= maxLines) break;
            lines.push([]);
            lineWidth = 0;
            continue;
        }

        const run = richRunAt(runs, index);
        const style: ResolvedTextFormat = run
            ? {
                ...base,
                color: run.color,
                fontWeight: run.fontWeight,
                size: base.size * (run.scale / 100),
            }
            : base;

        context.font = `${style.fontWeight} ${style.size}px ${style.family}`;
        const width =
            char === LOTUS_SYMBOL || char === PIN_SYMBOL
                ? style.size * 1.05
                : context.measureText(char).width;

        if (lineWidth + width > maxWidth && lines[lines.length - 1].length) {
            if (lines.length >= maxLines) break;
            lines.push([]);
            lineWidth = 0;
        }

        lines[lines.length - 1].push({ char, width, style });
        lineWidth += width;
    }

    return lines;
}

function drawRichText(
    context: CanvasRenderingContext2D,
    lines: ReturnType<typeof layoutRichText>,
    x: number,
    firstBaselineY: number,
    defaultLineHeight: number,
) {
    let baselineY = firstBaselineY;

    lines.forEach((line, lineIndex) => {
        let cursorX = x;
        const largestSize = Math.max(...line.map((glyph) => glyph.style.size), 0);

        line.forEach((glyph) => {
            context.font = `${glyph.style.fontWeight} ${glyph.style.size}px ${glyph.style.family}`;
            if (glyph.char === LOTUS_SYMBOL || glyph.char === PIN_SYMBOL) {
                drawCanvasPictogram(
                    context,
                    glyph.char === LOTUS_SYMBOL ? "lotus" : "pin",
                    cursorX,
                    baselineY - glyph.style.size * 0.36,
                    glyph.style.size,
                    glyph.style.color,
                );
            } else {
                drawPosterText(
                    context,
                    glyph.char,
                    cursorX,
                    baselineY,
                    glyph.style.color,
                    glyph.style.shadow,
                );
            }
            cursorX += glyph.width;
        });

        if (lineIndex < lines.length - 1) {
            baselineY += Math.max(defaultLineHeight, largestSize * 1.28);
        }
    });

    const lastLine = lines[lines.length - 1] ?? [];
    const lastLargestSize = Math.max(
        ...lastLine.map((glyph) => glyph.style.size),
        0,
    );

    return (
        baselineY -
        firstBaselineY +
        Math.max(defaultLineHeight, lastLargestSize * 1.28)
    );
}

function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
}

function normalizeLine(line: CustomLine): CustomLine {
    if (line.orientation === "horizontal") {
        const y = clamp(line.start.y, SAFE_AREA.top, SAFE_AREA.bottom);
        let startX = clamp(line.start.x, SAFE_AREA.left, SAFE_AREA.right);
        let endX = clamp(line.end.x, SAFE_AREA.left, SAFE_AREA.right);

        if (endX < startX) {
            [startX, endX] = [endX, startX];
        }

        if (endX - startX < LINE_MIN_LENGTH.horizontal) {
            endX = clamp(startX + LINE_MIN_LENGTH.horizontal, SAFE_AREA.left, SAFE_AREA.right);
        }

        return {
            ...line,
            start: { x: startX, y },
            end: { x: endX, y },
        };
    }

    const x = clamp(line.start.x, SAFE_AREA.left, SAFE_AREA.right);
    let startY = clamp(line.start.y, SAFE_AREA.top, SAFE_AREA.bottom);
    let endY = clamp(line.end.y, SAFE_AREA.top, SAFE_AREA.bottom);

    if (endY < startY) {
        [startY, endY] = [endY, startY];
    }

    if (endY - startY < LINE_MIN_LENGTH.vertical) {
        endY = clamp(startY + LINE_MIN_LENGTH.vertical, SAFE_AREA.top, SAFE_AREA.bottom);
    }

    return {
        ...line,
        start: { x, y: startY },
        end: { x, y: endY },
    };
}

function lineBounds(line: CustomLine) {
    const left = Math.min(line.start.x, line.end.x);
    const right = Math.max(line.start.x, line.end.x);
    const top = Math.min(line.start.y, line.end.y);
    const bottom = Math.max(line.start.y, line.end.y);

    return { left, right, top, bottom };
}

function createLineStyle(line: CustomLine, selected: boolean): CSSProperties {
    const bounds = lineBounds(line);

    if (line.orientation === "horizontal") {
        return {
            left: `${bounds.left * 100}%`,
            width: `${Math.max((bounds.right - bounds.left) * 100, 1)}%`,
            top: `calc(${line.start.y * 100}% - 9px)`,
            height: "18px",
            cursor: "pointer",
        };
    }

    return {
        left: `calc(${line.start.x * 100}% - 9px)`,
        width: "18px",
        top: `${bounds.top * 100}%`,
        height: `${Math.max((bounds.bottom - bounds.top) * 100, 1)}%`,
        cursor: "pointer",
    };
}

function createLineStrokeStyle(line: CustomLine): CSSProperties {
    if (line.orientation === "horizontal") {
        return {
            position: "absolute",
            left: 0,
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            borderTop: `${line.width}px ${line.variant === "dashed" ? "dashed" : "solid"} ${line.color}`,
        };
    }

    return {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        borderLeft: `${line.width}px ${line.variant === "dashed" ? "dashed" : "solid"} ${line.color}`,
    };
}

export default function EventPromotePage() {
    const [channel, setChannel] = useState<ChannelKey>("instagram");

    const [scene, setScene] = useState<SceneKey>("otherLotus");
    const [imageFit, setImageFit] = useState<ImageFit>("cover");

    const [title, setTitle] = useState("♫ 연꽃 피는 산사 음악회");

    const [organizer, setOrganizer] = useState("연화사");

    const [date, setDate] = useState("2026. 8. 22. 토요일 오후 6시");

    const [place, setPlace] = useState(`${PIN_SYMBOL} 연화사 앞마당`);

    const [description, setDescription] = useState(
        "여름 저녁, 산사의 고요함과 음악이 만나는 시간\n차 한 잔과 함께 잠시 머물며\n마음에 작은 쉼표를 놓아보세요",
    );

    const [application, setApplication] = useState(
        "문의 02-000-0000 · 참가비 무료",
    );

    const [imageSrc, setImageSrc] = useState(
        "/images/promote/promote-other-lotus-novice.webp",
    );

    const [copied, setCopied] = useState("");
    const [editorTab, setEditorTab] = useState<EditorTab>("content");
    const [copyChannel, setCopyChannel] = useState<CopyKey>("instagram");
    const [imageCategory, setImageCategory] = useState<ImageCategory>("featured");
    const [visibleOtherCount, setVisibleOtherCount] = useState(6);
    const [selectedText, setSelectedText] = useState<TextKey>("title");
    const [activeContentText, setActiveContentText] = useState<TextKey>("title");
    const [selectedElement, setSelectedElement] =
        useState<SelectedElement>("title");
    const [dividerStyle, setDividerStyle] = useState({
        color: "#171B22",
        width: 2,
        visible: true,
        variant: "solid" as LineVariant,
    });
    const [customLines, setCustomLines] = useState<CustomLine[]>([]);
    const [selectedLineId, setSelectedLineId] = useState<string | null>(null);
    const [lineDraftVariant, setLineDraftVariant] = useState<LineVariant | null>(null);
    const [lineMenuOpen, setLineMenuOpen] = useState(false);
    const [drawingLine, setDrawingLine] = useState<CustomLine | null>(null);
    const [textFormats, setTextFormats] =
        useState<Record<TextKey, TextFormat>>(initialTextFormats);
    const [textIcons] = useState<Record<TextKey, PictogramKey>>({
        title: "none",
        organizer: "none",
        date: "none",
        place: "none",
        description: "none",
        application: "none",
    });
    const [richTextRuns, setRichTextRuns] = useState<
        Record<RichTextKey, RichTextRun[]>
    >({
        title: [
            {
                start: 11,
                end: 14,
                color: "#B73535",
                fontWeight: 700,
                scale: 145,
            },
        ],
        organizer: [],
        date: [],
        place: [],
        description: [],
        application: [],
    });
    const [textSelection, setTextSelection] = useState<{
        start: number;
        end: number;
    } | null>(null);

    const imageObjectUrl = useRef<string | null>(null);
    const copyTextareaRef = useRef<HTMLTextAreaElement | null>(null);
    const styleTextareaRef = useRef<HTMLTextAreaElement | null>(null);
    const previewFrameRef = useRef<HTMLDivElement | null>(null);
    const linePointerIdRef = useRef<number | null>(null);
    const lineStartRef = useRef<{ x: number; y: number } | null>(null);
    const lineOrientationRef = useRef<LineOrientation | null>(null);
    const lineInteractionRef = useRef<{
        pointerId: number;
        lineId: string;
        mode: LineInteractionMode;
        origin: { x: number; y: number };
        original: CustomLine;
    } | null>(null);

    const copy = useMemo(() => {
        return {
            kakao: `[${organizer} 행사 안내]\n\n${title}\n\n${description}\n\n일시: ${date}\n장소: ${place}\n신청·문의: ${application}\n\n함께하고 싶은 분께 공유해 주세요.`,

            instagram: `${description}\n\n일시: ${date}\n장소: ${place}\n신청·문의: ${application}\n\n#${organizer.replaceAll(" ", "")} #불교행사 #산사문화 #연`,

            blog: `${title}\n\n${description}\n\n일시: ${date}\n장소: ${place}\n주최: ${organizer}\n신청·문의: ${application}\n\n행사에 관심 있는 분들의 많은 참여 바랍니다.`,

            youtube: `${title} | ${organizer}\n\n${description}\n일시: ${date}\n장소: ${place}\n신청·문의: ${application}\n\n#불교행사 #산사문화 #${organizer.replaceAll(" ", "")}`,

            sms: `[${organizer}] ${title} / ${date} / ${place} / ${application}`,
        };
    }, [application, date, description, organizer, place, title]);

    const [copyDrafts, setCopyDrafts] = useState<
        Partial<Record<CopyKey, string>>
    >({});

    const activeCopy = copyDrafts[copyChannel] ?? copy[copyChannel];
    const visibleScenes =
        imageCategory === "other"
            ? scenesByCategory.other.slice(0, visibleOtherCount)
            : scenesByCategory.featured;
    const selectedLine = customLines.find((line) => line.id === selectedLineId) ?? null;
    const isFixedDividerSelected = selectedElement === "divider";
    const activeLineVariant = isFixedDividerSelected
        ? dividerStyle.variant
        : selectedLine?.variant;
    const activeLineWidth = isFixedDividerSelected
        ? dividerStyle.width
        : selectedLine?.width;
    const activeLineColor = isFixedDividerSelected
        ? dividerStyle.color
        : selectedLine?.color;
    const hasActiveLine = isFixedDividerSelected || Boolean(selectedLine);

    const beginLineInsert = (variant: LineVariant) => {
        setLineDraftVariant(variant);
        setLineMenuOpen(false);
        setSelectedLineId(null);
        setSelectedElement("line");
    };

    const cancelLineInsert = () => {
        setLineDraftVariant(null);
        setDrawingLine(null);
        linePointerIdRef.current = null;
        lineStartRef.current = null;
        lineOrientationRef.current = null;
    };

    const selectCustomLine = (lineId: string) => {
        setSelectedLineId(lineId);
        setSelectedElement("line");
    };

    const clearLineInteraction = () => {
        lineInteractionRef.current = null;
    };

    const deleteSelectedLine = () => {
        if (!selectedLineId) return;
        setCustomLines((current) => current.filter((line) => line.id !== selectedLineId));
        setSelectedLineId(null);
        setSelectedElement("title");
        cancelLineInsert();
    };

    const updateSelectedLine = (patch: Partial<CustomLine>) => {
        if (!selectedLineId) return;
        setCustomLines((current) =>
            current.map((line) =>
                line.id === selectedLineId ? normalizeLine({ ...line, ...patch }) : line,
            ),
        );
    };

    const updateActiveLineStyle = (
        patch: Partial<Pick<CustomLine, "variant" | "width" | "color">>,
    ) => {
        if (isFixedDividerSelected) {
            setDividerStyle((current) => ({
                ...current,
                ...patch,
                visible: true,
            }));
            return;
        }

        updateSelectedLine(patch);
    };

    const deleteActiveLine = () => {
        if (isFixedDividerSelected) {
            setDividerStyle((current) => ({ ...current, visible: false }));
            setSelectedElement("title");
            setSelectedLineId(null);
            return;
        }

        deleteSelectedLine();
    };


    const startLineInteraction = (
        event: ReactPointerEvent<HTMLElement>,
        line: CustomLine,
        mode: LineInteractionMode,
    ) => {
        selectCustomLine(line.id);

        if (editorTab !== "content" || lineDraftVariant) return;

        const bounds = previewFrameRef.current?.getBoundingClientRect();
        if (!bounds) return;

        event.preventDefault();
        event.stopPropagation();

        const origin = {
            x: clamp((event.clientX - bounds.left) / bounds.width, SAFE_AREA.left, SAFE_AREA.right),
            y: clamp((event.clientY - bounds.top) / bounds.height, SAFE_AREA.top, SAFE_AREA.bottom),
        };

        lineInteractionRef.current = {
            pointerId: event.pointerId,
            lineId: line.id,
            mode,
            origin,
            original: line,
        };

        previewFrameRef.current?.setPointerCapture(event.pointerId);
    };

    const moveLineWithinSafeArea = (
        line: CustomLine,
        dx: number,
        dy: number,
    ) => {
        const minDx = SAFE_AREA.left - Math.min(line.start.x, line.end.x);
        const maxDx = SAFE_AREA.right - Math.max(line.start.x, line.end.x);
        const minDy = SAFE_AREA.top - Math.min(line.start.y, line.end.y);
        const maxDy = SAFE_AREA.bottom - Math.max(line.start.y, line.end.y);
        const safeDx = clamp(dx, minDx, maxDx);
        const safeDy = clamp(dy, minDy, maxDy);

        return {
            ...line,
            start: { x: line.start.x + safeDx, y: line.start.y + safeDy },
            end: { x: line.end.x + safeDx, y: line.end.y + safeDy },
        };
    };

    const resizeLineFromHandle = (
        line: CustomLine,
        mode: "start" | "end",
        point: { x: number; y: number },
        dragOrigin: { x: number; y: number },
    ) => {
        const anchor = mode === "start" ? line.end : line.start;
        const pointerMoveX = point.x - dragOrigin.x;
        const pointerMoveY = point.y - dragOrigin.y;
        const switchThreshold = 0.012;

        let orientation = line.orientation;

        if (
            Math.abs(pointerMoveX) > switchThreshold ||
            Math.abs(pointerMoveY) > switchThreshold
        ) {
            if (Math.abs(pointerMoveX) > Math.abs(pointerMoveY) * 1.1) {
                orientation = "horizontal";
            } else if (Math.abs(pointerMoveY) > Math.abs(pointerMoveX) * 1.1) {
                orientation = "vertical";
            }
        }

        if (orientation === "horizontal") {
            const axisDelta = point.x - anchor.x;
            const originalDirection =
                mode === "start"
                    ? Math.sign(line.start.x - line.end.x) || -1
                    : Math.sign(line.end.x - line.start.x) || 1;
            const movementDirection = Math.sign(pointerMoveX);
            let direction =
                Math.abs(axisDelta) > 0.004
                    ? Math.sign(axisDelta)
                    : movementDirection || originalDirection;

            const availableInDirection = () =>
                direction > 0
                    ? SAFE_AREA.right - anchor.x
                    : anchor.x - SAFE_AREA.left;

            if (availableInDirection() < LINE_MIN_LENGTH.horizontal) {
                direction *= -1;
            }

            const distance = Math.min(
                Math.max(Math.abs(axisDelta), LINE_MIN_LENGTH.horizontal),
                availableInDirection(),
            );
            const target = {
                x: anchor.x + distance * direction,
                y: anchor.y,
            };

            return normalizeLine({
                ...line,
                orientation,
                start: mode === "start" ? target : anchor,
                end: mode === "start" ? anchor : target,
            });
        }

        const axisDelta = point.y - anchor.y;
        const originalDirection =
            mode === "start"
                ? Math.sign(line.start.y - line.end.y) || -1
                : Math.sign(line.end.y - line.start.y) || 1;
        const movementDirection = Math.sign(pointerMoveY);
        let direction =
            Math.abs(axisDelta) > 0.004
                ? Math.sign(axisDelta)
                : movementDirection || originalDirection;

        const availableInDirection = () =>
            direction > 0
                ? SAFE_AREA.bottom - anchor.y
                : anchor.y - SAFE_AREA.top;

        if (availableInDirection() < LINE_MIN_LENGTH.vertical) {
            direction *= -1;
        }

        const distance = Math.min(
            Math.max(Math.abs(axisDelta), LINE_MIN_LENGTH.vertical),
            availableInDirection(),
        );
        const target = {
            x: anchor.x,
            y: anchor.y + distance * direction,
        };

        return normalizeLine({
            ...line,
            orientation,
            start: mode === "start" ? target : anchor,
            end: mode === "start" ? anchor : target,
        });
    };

    const previewPoint = (event: ReactPointerEvent<HTMLDivElement>) => {
        const bounds = previewFrameRef.current?.getBoundingClientRect();
        if (!bounds) return null;

        return {
            x: clamp((event.clientX - bounds.left) / bounds.width, SAFE_AREA.left, SAFE_AREA.right),
            y: clamp((event.clientY - bounds.top) / bounds.height, SAFE_AREA.top, SAFE_AREA.bottom),
        };
    };

    const handlePreviewPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (!lineDraftVariant) return;

        const point = previewPoint(event);
        if (!point) return;

        event.preventDefault();
        event.stopPropagation();

        linePointerIdRef.current = event.pointerId;
        lineStartRef.current = point;
        lineOrientationRef.current = null;

        const nextLine: CustomLine = {
            id: `line-${Date.now()}`,
            variant: lineDraftVariant,
            orientation: "horizontal",
            start: point,
            end: point,
            color: "#171B22",
            width: 2,
        };

        setDrawingLine(nextLine);
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const handlePreviewPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
        const interaction = lineInteractionRef.current;

        if (interaction && interaction.pointerId === event.pointerId) {
            const point = previewPoint(event);
            if (!point) return;

            const nextLine =
                interaction.mode === "move"
                    ? moveLineWithinSafeArea(
                        interaction.original,
                        point.x - interaction.origin.x,
                        point.y - interaction.origin.y,
                    )
                    : resizeLineFromHandle(
                        interaction.original,
                        interaction.mode,
                        point,
                        interaction.origin,
                    );

            setCustomLines((current) =>
                current.map((line) =>
                    line.id === interaction.lineId ? nextLine : line,
                ),
            );
            return;
        }

        if (!lineDraftVariant || linePointerIdRef.current !== event.pointerId) return;
        const point = previewPoint(event);
        const start = lineStartRef.current;
        if (!point || !start) return;

        const dx = point.x - start.x;
        const dy = point.y - start.y;

        let orientation = lineOrientationRef.current;
        if (!orientation && (Math.abs(dx) > LINE_DRAW_THRESHOLD || Math.abs(dy) > LINE_DRAW_THRESHOLD)) {
            orientation = Math.abs(dx) >= Math.abs(dy) ? "horizontal" : "vertical";
            lineOrientationRef.current = orientation;
        }

        if (!orientation) orientation = "horizontal";

        const draft = normalizeLine({
            id: drawingLine?.id ?? `line-${Date.now()}`,
            variant: lineDraftVariant,
            orientation,
            start,
            end:
                orientation === "horizontal"
                    ? { x: point.x, y: start.y }
                    : { x: start.x, y: point.y },
            color: drawingLine?.color ?? "#171B22",
            width: drawingLine?.width ?? 2,
        });

        setDrawingLine(draft);
    };

    const handlePreviewPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
        const interaction = lineInteractionRef.current;
        if (interaction && interaction.pointerId === event.pointerId) {
            clearLineInteraction();
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                event.currentTarget.releasePointerCapture(event.pointerId);
            }
            return;
        }

        if (!lineDraftVariant || linePointerIdRef.current !== event.pointerId) return;
        const draft = drawingLine;
        if (draft) {
            const finalized = normalizeLine(draft);
            setCustomLines((current) => [...current, finalized]);
            setSelectedLineId(finalized.id);
            setSelectedElement("line");
        }

        cancelLineInsert();

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
    };

    const handlePreviewPointerCancel = (event: ReactPointerEvent<HTMLDivElement>) => {
        clearLineInteraction();
        cancelLineInsert();
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
    };

    const insertCopyEmoji = (emoji: string) => {
        const textarea = copyTextareaRef.current;
        const selectionStart = textarea?.selectionStart ?? activeCopy.length;
        const selectionEnd = textarea?.selectionEnd ?? selectionStart;
        const nextValue =
            activeCopy.slice(0, selectionStart) +
            emoji +
            activeCopy.slice(selectionEnd);
        const nextCursor = selectionStart + emoji.length;

        setCopyDrafts((current) => ({
            ...current,
            [copyChannel]: nextValue,
        }));

        window.requestAnimationFrame(() => {
            copyTextareaRef.current?.focus();
            copyTextareaRef.current?.setSelectionRange(nextCursor, nextCursor);
        });
    };

    const updateCopyDraft = (value: string) => {
        setCopyDrafts((current) => ({
            ...current,
            [copyChannel]: value,
        }));
    };

    const selectedFormat = textFormats[selectedText];
    const selectedRichRun = textSelection
        ? richTextRuns[selectedText].find(
            (run) =>
                run.start === textSelection.start && run.end === textSelection.end,
        )
        : undefined;
    const activeScale = selectedRichRun?.scale ?? selectedFormat.scale;
    const activeWeight = selectedRichRun?.fontWeight ?? selectedFormat.fontWeight;
    const activeColor = selectedRichRun?.color ?? selectedFormat.color;
    const selectedTextValue: Record<TextKey, string> = {
        title,
        organizer,
        date,
        place,
        description,
        application,
    };

    const updateTextValuePreservingRuns = (key: TextKey, nextValue: string) => {
        const previousValue = selectedTextValue[key];
        const setters: Record<TextKey, (next: string) => void> = {
            title: setTitle,
            organizer: setOrganizer,
            date: setDate,
            place: setPlace,
            description: setDescription,
            application: setApplication,
        };

        let prefix = 0;
        while (
            prefix < previousValue.length &&
            prefix < nextValue.length &&
            previousValue[prefix] === nextValue[prefix]
        ) {
            prefix += 1;
        }

        let suffix = 0;
        while (
            suffix < previousValue.length - prefix &&
            suffix < nextValue.length - prefix &&
            previousValue[previousValue.length - 1 - suffix] ===
            nextValue[nextValue.length - 1 - suffix]
        ) {
            suffix += 1;
        }

        const removedEnd = previousValue.length - suffix;
        const insertedEnd = nextValue.length - suffix;
        const delta = insertedEnd - removedEnd;

        setRichTextRuns((current) => ({
            ...current,
            [key]: current[key]
                .map((run) => {
                    if (run.end <= prefix) return run;
                    if (run.start >= removedEnd) {
                        return {
                            ...run,
                            start: run.start + delta,
                            end: run.end + delta,
                        };
                    }
                    return {
                        ...run,
                        start: Math.min(run.start, prefix),
                        end: Math.max(prefix, run.end + delta),
                    };
                })
                .filter((run) => run.end > run.start),
        }));
        setters[key](nextValue);
    };

    const insertPictogram = (key: TextKey, symbol: string) => {
        if (!symbol) return;

        const field = document.getElementById(`promote-${key}`) as
            | HTMLInputElement
            | HTMLTextAreaElement
            | null;
        const value = selectedTextValue[key];
        const start = field?.selectionStart ?? value.length;
        const end = field?.selectionEnd ?? start;
        const nextValue = value.slice(0, start) + symbol + value.slice(end);
        updateTextValuePreservingRuns(key, nextValue);

        const nextCursor = start + symbol.length;
        window.requestAnimationFrame(() => {
            field?.focus();
            field?.setSelectionRange(nextCursor, nextCursor);
        });
    };

    const pictogramPicker = () => (
        <details className="group relative mt-2 shrink-0">
            <summary
                className="flex h-[46px] w-[46px] cursor-pointer list-none items-center justify-center rounded-xl border border-[#E2E32E] bg-[#F4F54A] text-xl font-normal text-[#252A31] transition hover:bg-[#EDEF36] [&::-webkit-details-marker]:hidden"
                title="픽토그램 넣기"
                aria-label={`${textLabels[activeContentText]}에 픽토그램 넣기`}
            >
                ＋
            </summary>
            <div
                className="absolute right-0 top-[52px] z-40 grid w-[246px] grid-cols-3 gap-1.5 rounded-2xl border border-[#E1E4E8] bg-white p-2 shadow-[0_12px_30px_rgba(25,31,40,0.14)]"
                role="group"
                aria-label={`${textLabels[activeContentText]} 픽토그램 선택표`}
            >
                {pictogramOptions.map((item) => (
                    <button
                        key={item.key}
                        type="button"
                        onClick={(event) => {
                            insertPictogram(activeContentText, item.symbol);
                            event.currentTarget.closest("details")?.removeAttribute("open");
                        }}
                        className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-left text-[11px] transition hover:bg-[#FFFFD8]"
                        title={`${item.label} 삽입`}
                        aria-label={`${textLabels[activeContentText]}에 ${item.label} 삽입`}
                    >
                        {item.key === "none" ? (
                            <span className="flex h-4 w-4 items-center justify-center text-[#A1A8B2]">
                                —
                            </span>
                        ) : (
                            <PictogramIcon icon={item.key} className="h-4 w-4 shrink-0" />
                        )}
                        <span>{item.label}</span>
                    </button>
                ))}
            </div>
        </details>
    );

    const updateSelectedTextValue = (value: string) => {
        updateTextValuePreservingRuns(selectedText, value);
        setTextSelection(null);
    };
    const updateSelectedFormat = (patch: Partial<TextFormat>) => {
        setTextFormats((current) => ({
            ...current,
            [selectedText]: { ...current[selectedText], ...patch },
        }));
    };

    const selectPreviewText = (key: TextKey) => {
        setSelectedText(key);
        setSelectedElement(key);
        setSelectedLineId(null);
        setTextSelection(null);

        // 내용 입력 중에는 작업 흐름을 유지한다.
        // 미리보기의 글자를 눌러도 편집 탭으로 강제 이동하지 않는다.
        if (editorTab !== "content") {
            setEditorTab("style");
        }
    };

    const applyPartialStyle = (
        patch: Partial<Pick<RichTextRun, "color" | "fontWeight" | "scale">>,
    ) => {
        if (!isRichTextKey(selectedText) || !textSelection) return;

        const { start, end } = textSelection;

        if (start === end) return;

        setRichTextRuns((current) => {
            const existing = current[selectedText].find(
                (run) => run.start === start && run.end === end,
            );
            const nextRun: RichTextRun = {
                start,
                end,
                color: existing?.color ?? textFormats[selectedText].color,
                fontWeight:
                    existing?.fontWeight ?? textFormats[selectedText].fontWeight,
                scale: existing?.scale ?? 100,
                ...patch,
            };

            return {
                ...current,
                [selectedText]: [
                    ...current[selectedText].filter(
                        (run) => run.end <= start || run.start >= end,
                    ),
                    nextRun,
                ].sort((a, b) => a.start - b.start),
            };
        });
    };

    const updateSizeWeightOrColor = (
        patch: Partial<Pick<RichTextRun, "color" | "fontWeight" | "scale">>,
    ) => {
        if (isRichTextKey(selectedText) && textSelection) {
            applyPartialStyle(patch);
            return;
        }
        updateSelectedFormat(patch);
    };

    const selectDivider = () => {
        if (editorTab !== "style") return;
        setSelectedLineId(null);
        setSelectedElement("divider");
    };

    const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (imageObjectUrl.current) {
            URL.revokeObjectURL(imageObjectUrl.current);
        }

        imageObjectUrl.current = URL.createObjectURL(file);

        setImageSrc(imageObjectUrl.current);
        setImageFit("cover");
    };

    const copyText = async (key: CopyKey) => {
        await navigator.clipboard.writeText(copyDrafts[key] ?? copy[key]);

        setCopied(key);

        window.setTimeout(() => {
            setCopied("");
        }, 1400);
    };

    const downloadFlyer = async () => {
        await document.fonts.ready;
        const selected = channels[channel];

        const canvas = document.createElement("canvas");

        canvas.width = selected.width;
        canvas.height = selected.height;

        const context = canvas.getContext("2d");

        if (!context) return;

        context.fillStyle = "#E8ECEF";
        context.fillRect(0, 0, selected.width, selected.height);

        try {
            const image = new Image();

            image.src = imageSrc;

            await image.decode();

            if (scene === "custom" && imageFit === "contain") {
                const backgroundScale =
                    Math.max(
                        selected.width / image.width,
                        selected.height / image.height,
                    ) * 1.12;
                const backgroundWidth = image.width * backgroundScale;
                const backgroundHeight = image.height * backgroundScale;

                context.save();
                context.filter = `blur(${Math.max(selected.width, selected.height) * 0.035}px)`;
                context.drawImage(
                    image,
                    (selected.width - backgroundWidth) / 2,
                    (selected.height - backgroundHeight) / 2,
                    backgroundWidth,
                    backgroundHeight,
                );
                context.restore();

                context.fillStyle = "rgba(23,27,34,0.18)";
                context.fillRect(0, 0, selected.width, selected.height);

                const foregroundScale = Math.min(
                    selected.width / image.width,
                    selected.height / image.height,
                );
                const foregroundWidth = image.width * foregroundScale;
                const foregroundHeight = image.height * foregroundScale;

                context.drawImage(
                    image,
                    (selected.width - foregroundWidth) / 2,
                    (selected.height - foregroundHeight) / 2,
                    foregroundWidth,
                    foregroundHeight,
                );
            } else {
                const scale = Math.max(
                    selected.width / image.width,
                    selected.height / image.height,
                );
                const drawWidth = image.width * scale;
                const drawHeight = image.height * scale;

                context.drawImage(
                    image,
                    (selected.width - drawWidth) / 2,
                    (selected.height - drawHeight) / 2,
                    drawWidth,
                    drawHeight,
                );
            }
        } catch {
            context.fillStyle = "rgba(255,255,255,0.9)";

            context.font = "600 34px sans-serif";

            context.fillText("행사 이미지를 올려주세요", 72, 100);
        }

        const isLandscape = selected.width / selected.height > 1.45;
        const outputScale = channel === "a4" ? selected.width / 1080 : 1;

        const side = (isLandscape ? 62 : 76) * outputScale;
        const top = (isLandscape ? 62 : 105) * outputScale;

        const contentWidth = isLandscape
            ? selected.width * 0.56
            : selected.width - side * 2;
        const format = (key: TextKey, baseSize: number): ResolvedTextFormat => {
            const value = textFormats[key];
            return {
                ...value,
                size: Math.round(baseSize * (value.scale / 100)),
                family: fontOptions[value.fontKey].canvas,
                shadow: shadowOptions[value.shadowKey],
            };
        };
        const organizerFormat = format(
            "organizer",
            (isLandscape ? 27 : 34) * outputScale,
        );
        const titleFormat = format("title", (isLandscape ? 55 : 68) * outputScale);
        const dateFormat = format("date", (isLandscape ? 29 : 36) * outputScale);
        const placeFormat = format("place", (isLandscape ? 27 : 34) * outputScale);
        const descriptionFormat = format(
            "description",
            (isLandscape ? 25 : 31) * outputScale,
        );
        const applicationFormat = format(
            "application",
            (isLandscape ? 25 : 32) * outputScale,
        );
        const iconOffset = (key: TextKey, size: number) =>
            textIcons[key] === "none" ? 0 : size * 1.35;

        context.textBaseline = "alphabetic";
        context.font = `${organizerFormat.fontWeight} ${organizerFormat.size}px ${organizerFormat.family}`;
        drawCanvasPictogram(
            context,
            textIcons.organizer,
            side,
            top - organizerFormat.size * 0.35,
            organizerFormat.size * 0.9,
            organizerFormat.color,
        );
        drawRichText(
            context,
            layoutRichText(
                context,
                organizer,
                organizerFormat,
                richTextRuns.organizer,
                contentWidth - iconOffset("organizer", organizerFormat.size),
                1,
            ),
            side + iconOffset("organizer", organizerFormat.size),
            top,
            organizerFormat.size * 1.28,
        );

        const titleOffset = iconOffset("title", titleFormat.size);
        const titleLines = layoutRichText(
            context,
            title,
            titleFormat,
            richTextRuns.title,
            contentWidth - titleOffset,
            isLandscape ? 2 : 3,
        );

        const titleStartY = top + Math.round(titleFormat.size * 1.42);
        const titleLineHeight = Math.round(titleFormat.size * 1.18);
        drawCanvasPictogram(
            context,
            textIcons.title,
            side,
            titleStartY - titleFormat.size * 0.35,
            titleFormat.size,
            titleFormat.color,
        );
        const titleBlockHeight = drawRichText(
            context,
            titleLines,
            side + titleOffset,
            titleStartY,
            titleLineHeight,
        );

        const infoY =
            titleStartY +
            Math.max(0, titleBlockHeight - titleLineHeight) +
            Math.round(dateFormat.size * 1.9);

        context.font = `${dateFormat.fontWeight} ${dateFormat.size}px ${dateFormat.family}`;
        drawCanvasPictogram(
            context,
            textIcons.date,
            side,
            infoY - dateFormat.size * 0.35,
            dateFormat.size * 0.9,
            dateFormat.color,
        );
        drawRichText(
            context,
            layoutRichText(
                context,
                date,
                dateFormat,
                richTextRuns.date,
                contentWidth - iconOffset("date", dateFormat.size),
                1,
            ),
            side + iconOffset("date", dateFormat.size),
            infoY,
            dateFormat.size * 1.28,
        );

        context.font = `${placeFormat.fontWeight} ${placeFormat.size}px ${placeFormat.family}`;
        const placeY =
            infoY + Math.round(Math.max(dateFormat.size, placeFormat.size) * 1.55);
        drawCanvasPictogram(
            context,
            textIcons.place,
            side,
            placeY - placeFormat.size * 0.35,
            placeFormat.size * 0.9,
            placeFormat.color,
        );
        drawRichText(
            context,
            layoutRichText(
                context,
                place,
                placeFormat,
                richTextRuns.place,
                contentWidth - iconOffset("place", placeFormat.size),
                1,
            ),
            side + iconOffset("place", placeFormat.size),
            placeY,
            placeFormat.size * 1.28,
        );

        const descriptionOffset = iconOffset("description", descriptionFormat.size);
        const descriptionY = placeY + Math.round(placeFormat.size * 1.7);
        const descriptionLines = layoutRichText(
            context,
            description,
            descriptionFormat,
            richTextRuns.description,
            contentWidth - descriptionOffset,
            4,
        );
        drawCanvasPictogram(
            context,
            textIcons.description,
            side,
            descriptionY - descriptionFormat.size * 0.35,
            descriptionFormat.size * 0.9,
            descriptionFormat.color,
        );
        drawRichText(
            context,
            descriptionLines,
            side + descriptionOffset,
            descriptionY,
            Math.round(descriptionFormat.size * 1.45),
        );

        const contactLineY =
            selected.height - (isLandscape ? 87 : 122) * outputScale;

        if (dividerStyle.visible) {
            context.save();
            context.strokeStyle = dividerStyle.color;
            context.lineWidth = dividerStyle.width * outputScale;
            context.setLineDash(
                dividerStyle.variant === "dashed"
                    ? [10 * outputScale, 8 * outputScale]
                    : [],
            );
            context.beginPath();
            context.moveTo(side, contactLineY);
            context.lineTo(selected.width - side, contactLineY);
            context.stroke();
            context.restore();
        }

        customLines.forEach((line) => {
            context.save();
            context.strokeStyle = line.color;
            context.lineWidth = line.width * outputScale;
            if (line.variant === "dashed") {
                context.setLineDash([10 * outputScale, 8 * outputScale]);
            } else {
                context.setLineDash([]);
            }
            context.beginPath();
            context.moveTo(line.start.x * selected.width, line.start.y * selected.height);
            context.lineTo(line.end.x * selected.width, line.end.y * selected.height);
            context.stroke();
            context.restore();
        });

        context.font = `${applicationFormat.fontWeight} ${applicationFormat.size}px ${applicationFormat.family}`;
        const applicationY = contactLineY + (isLandscape ? 44 : 57) * outputScale;
        drawCanvasPictogram(
            context,
            textIcons.application,
            side,
            applicationY - applicationFormat.size * 0.35,
            applicationFormat.size * 0.9,
            applicationFormat.color,
        );

        drawRichText(
            context,
            layoutRichText(
                context,
                application,
                applicationFormat,
                richTextRuns.application,
                contentWidth - iconOffset("application", applicationFormat.size),
                1,
            ),
            side + iconOffset("application", applicationFormat.size),
            applicationY,
            applicationFormat.size * 1.28,
        );

        const link = document.createElement("a");

        link.download = `${organizer}-${title}-${selected.label}.png`.replaceAll(
            " ",
            "-",
        );

        link.href = canvas.toDataURL("image/png");

        link.click();
    };

    const aspectClass =
        channel === "instagram"
            ? "aspect-[4/5]"
            : channel === "story"
                ? "aspect-[9/16]"
                : channel === "blog"
                    ? "aspect-[1200/628]"
                    : channel === "youtube"
                        ? "aspect-video"
                        : channel === "a4"
                            ? "aspect-[210/297]"
                            : "aspect-square";

    const copyLabels: Record<CopyKey, string> = {
        kakao: "카카오톡",
        instagram: "인스타그램",
        blog: "네이버 블로그",
        youtube: "유튜브",
        sms: "문자",
    };

    const tabs: { key: EditorTab; label: string }[] = [
        { key: "content", label: "내용" },
        { key: "image", label: "이미지" },
        { key: "style", label: "편집" },
        { key: "copy", label: "홍보 문구" },
    ];

    const textStyle = (key: TextKey, size: number) => {
        const value = textFormats[key];
        const previewShadow = shadowOptions[value.shadowKey];
        return {
            color: value.color,
            fontFamily: fontOptions[value.fontKey].css,
            fontWeight: value.fontWeight,
            fontSize: `${size * (value.scale / 100)}px`,
            textShadow:
                value.shadowKey === "none"
                    ? "none"
                    : `0 ${previewShadow.offset}px ${previewShadow.blur}px ${contrastShadow(value.color, previewShadow.opacity)}`,
        };
    };

    const renderTextCharacters = (key: TextKey, text: string, size: number) => {
        if (
            !isRichTextKey(key) ||
            (!richTextRuns[key].length &&
                !text.includes(LOTUS_SYMBOL) &&
                !text.includes(PIN_SYMBOL))
        )
            return text;

        const base = textFormats[key];

        return text.split("").map((char, index) => {
            const run = richRunAt(richTextRuns[key], index);

            if (char === LOTUS_SYMBOL || char === PIN_SYMBOL) {
                return (
                    <span
                        key={`${key}-${index}`}
                        className="inline-flex w-[1.05em] items-center justify-center align-[-0.12em]"
                        style={
                            run
                                ? {
                                    color: run.color,
                                    fontSize: `${size * (base.scale / 100) * (run.scale / 100)}px`,
                                }
                                : undefined
                        }
                    >
                        <PictogramIcon
                            icon={char === LOTUS_SYMBOL ? "lotus" : "pin"}
                            className="h-[1em] w-[1em]"
                        />
                    </span>
                );
            }

            if (!run) return <span key={`${key}-${index}`}>{char}</span>;

            const isDefaultMusicEmphasis =
                key === "title" && text.slice(run.start, run.end) === "음악회";

            return (
                <span
                    key={`${key}-${index}`}
                    className={
                        isDefaultMusicEmphasis ? "mobile-music-emphasis" : undefined
                    }
                    style={
                        {
                            color: run.color,
                            fontWeight: run.fontWeight,
                            fontSize: `${size * (base.scale / 100) * (run.scale / 100)}px`,
                            "--mobile-music-size": `${size * (base.scale / 100) * 1.05}px`,
                        } as CSSProperties
                    }
                >
                    {char}
                </span>
            );
        });
    };

    const previewButtonClass = (key: TextKey, extra = "") =>
        `${extra} cursor-pointer ${editorTab === "style" && selectedElement === key ? "rounded-md outline outline-1 outline-dashed outline-[#777900] outline-offset-4" : ""}`;

    return (
        <main className="min-h-screen bg-[#F7F8FA] text-[#171B22]">
            <style>{`@media (max-width: 639px) { .mobile-title { font-size: 24px !important; } .mobile-music-emphasis { font-size: var(--mobile-music-size) !important; } }`}</style>
            <header className="border-b border-[#E9EBEE] bg-white">
                <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-5 md:px-8">
                    <Link
                        href="/"
                        className="flex items-center gap-2.5"
                        aria-label="연 홈"
                    >
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F4F54A]">
                            <LotusMark />
                        </span>
                        <span className="text-2xl font-semibold">연</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Link
                            href="/events"
                            className="rounded-full border border-[#DFE2E7] px-4 py-2 text-sm text-[#56606D]"
                        >
                            행사 목록
                        </Link>
                        <Link
                            href="/events/new"
                            className="hidden rounded-full bg-[#20242C] px-4 py-2 text-sm font-medium text-white sm:block"
                        >
                            행사 등록
                        </Link>
                    </div>
                </div>
            </header>

            <section className="mx-auto max-w-[1280px] px-4 py-7 sm:px-5 md:px-8 md:py-11">
                <div className="mb-6 md:mb-8">
                    <p className="text-sm font-medium text-[#777900]">행사·교육</p>
                    <h1 className="mt-1.5 text-[30px] font-semibold tracking-[-0.045em] md:text-[42px]">
                        홍보물 만들기
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-[#68707D] md:text-[15px]">
                        이미지를 보면서 내용을 바꾸고 바로 저장하세요.
                    </p>
                </div>

                <div className="overflow-hidden rounded-[28px] border border-[#E4E7EB] bg-white shadow-[0_14px_42px_rgba(25,31,40,0.06)]">
                    <div className="flex flex-col gap-3 border-b border-[#ECEEF1] px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-7">
                        <div className="flex items-center gap-3">
                            <label
                                htmlFor="promote-channel"
                                className="text-sm font-medium text-[#4E5968]"
                            >
                                게시 크기
                            </label>
                            <select
                                id="promote-channel"
                                value={channel}
                                onChange={(event) =>
                                    setChannel(event.target.value as ChannelKey)
                                }
                                className="min-w-0 rounded-xl border border-[#DDE1E5] bg-white px-3 py-2.5 text-sm font-medium outline-none focus:border-[#B9BA28] focus:ring-2 focus:ring-[#F4F54A]/30"
                            >
                                {(Object.keys(channels) as ChannelKey[]).map((key) => (
                                    <option key={key} value={key}>
                                        {channels[key].label} · {channels[key].size}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="button"
                            onClick={downloadFlyer}
                            className="w-full rounded-xl bg-[#20242C] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#11151B] sm:w-auto"
                        >
                            이미지 저장
                        </button>
                    </div>

                    <div className="grid lg:grid-cols-[0.94fr_1.06fr]">
                        <div className="border-b border-[#ECEEF1] bg-[#F4F5F6] p-4 sm:p-6 lg:border-b-0 lg:border-r lg:p-8">
                            <p className="mb-3 text-center text-xs text-[#7A818D]">
                                {channels[channel].label} · {channels[channel].size}px
                            </p>
                            <div
                                ref={previewFrameRef}
                                onPointerDown={handlePreviewPointerDown}
                                onPointerMove={handlePreviewPointerMove}
                                onPointerUp={handlePreviewPointerUp}
                                onPointerCancel={handlePreviewPointerCancel}
                                className={`relative mx-auto w-full max-w-[480px] overflow-hidden rounded-[24px] bg-[#E8ECEF] shadow-[0_16px_38px_rgba(25,31,40,0.14)] ${aspectClass} ${lineDraftVariant ? "cursor-crosshair" : ""}`}
                            >
                                {scene === "custom" && imageFit === "contain" ? (
                                    <>
                                        <img
                                            src={imageSrc}
                                            alt=""
                                            aria-hidden="true"
                                            className="absolute -inset-[6%] h-[112%] w-[112%] scale-110 object-cover blur-xl"
                                        />
                                        <span className="absolute inset-0 bg-[#171B22]/20" />
                                        <img
                                            src={imageSrc}
                                            alt="웹전단 대표 이미지"
                                            className="absolute inset-0 h-full w-full object-contain"
                                        />
                                    </>
                                ) : (
                                    <img
                                        src={imageSrc}
                                        alt="웹전단 대표 이미지"
                                        className="absolute inset-0 h-full w-full object-cover"
                                    />
                                )}

                                {customLines.map((line) => {
                                    const selected = selectedLineId === line.id;
                                    const canArrange = editorTab === "content" && !lineDraftVariant;
                                    return (
                                        <div
                                            key={line.id}
                                            role="button"
                                            tabIndex={0}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                selectCustomLine(line.id);
                                            }}
                                            onKeyDown={(event) => {
                                                if (event.key === "Enter" || event.key === " ") {
                                                    event.preventDefault();
                                                    selectCustomLine(line.id);
                                                }
                                            }}
                                            onPointerDown={(event) =>
                                                startLineInteraction(event, line, "move")
                                            }
                                            className={`absolute z-[1] bg-transparent outline-none ${lineDraftVariant ? "pointer-events-none" : ""} ${canArrange ? "cursor-move touch-none" : "cursor-pointer"}`}
                                            style={createLineStyle(line, selected)}
                                            aria-label={`${line.variant === "dashed" ? "점선" : "실선"} 선택`}
                                        >
                                            <span style={createLineStrokeStyle(line)} />
                                            {selected && canArrange && (
                                                <>
                                                    <span
                                                        onPointerDown={(event) => {
                                                            event.stopPropagation();
                                                            startLineInteraction(event, line, "start");
                                                        }}
                                                        className={`absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 touch-none rounded-full border-2 border-white bg-[#2E90FA] shadow-md ${line.orientation === "horizontal" ? "cursor-ew-resize" : "cursor-ns-resize"}`}
                                                        style={{
                                                            left: line.orientation === "horizontal" ? 0 : "50%",
                                                            top: line.orientation === "horizontal" ? "50%" : 0,
                                                        }}
                                                        aria-label="선 시작점 조절"
                                                    />
                                                    <span
                                                        onPointerDown={(event) => {
                                                            event.stopPropagation();
                                                            startLineInteraction(event, line, "end");
                                                        }}
                                                        className={`absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 touch-none rounded-full border-2 border-white bg-[#2E90FA] shadow-md ${line.orientation === "horizontal" ? "cursor-ew-resize" : "cursor-ns-resize"}`}
                                                        style={{
                                                            left: line.orientation === "horizontal" ? "100%" : "50%",
                                                            top: line.orientation === "horizontal" ? "50%" : "100%",
                                                        }}
                                                        aria-label="선 끝점 조절"
                                                    />
                                                </>
                                            )}
                                        </div>
                                    );
                                })}

                                {drawingLine && (
                                    <span
                                        className="absolute z-[2] pointer-events-none"
                                        style={createLineStyle(drawingLine, true)}
                                        aria-hidden="true"
                                    >
                                        <span style={createLineStrokeStyle(drawingLine)} />
                                        <span
                                            className="absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-[#2E90FA] shadow"
                                            style={{
                                                left: drawingLine.orientation === "horizontal" ? 0 : "50%",
                                                top: drawingLine.orientation === "horizontal" ? "50%" : 0,
                                            }}
                                        />
                                        <span
                                            className="absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-[#2E90FA] shadow"
                                            style={{
                                                left: drawingLine.orientation === "horizontal" ? "100%" : "50%",
                                                top: drawingLine.orientation === "horizontal" ? "50%" : "100%",
                                            }}
                                        />
                                    </span>
                                )}

                                {lineDraftVariant && (
                                    <div className="absolute inset-x-[7%] top-[4.5%] z-[3] rounded-full bg-[#2E90FA]/92 px-3 py-2 text-center text-[11px] font-medium text-white shadow-lg">
                                        미리보기에서 드래그해 {lineDraftVariant === "dashed" ? "점선" : "실선"}을 넣어보세요.
                                    </div>
                                )}

                                <div className="absolute inset-x-0 top-0 px-[7%] pb-4 pt-[8%]">
                                    <button
                                        type="button"
                                        onClick={() => selectPreviewText("organizer")}
                                        className={previewButtonClass(
                                            "organizer",
                                            "block text-left",
                                        )}
                                        aria-label="사찰 기관명 편집"
                                    >
                                        <span
                                            className="inline-flex items-center gap-[0.35em]"
                                            style={textStyle("organizer", 15)}
                                        >
                                            <PictogramIcon icon={textIcons.organizer} />
                                            <span>
                                                {renderTextCharacters("organizer", organizer, 15)}
                                            </span>
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => selectPreviewText("title")}
                                        className={previewButtonClass(
                                            "title",
                                            "mt-1.5 block text-left",
                                        )}
                                        aria-label="행사명 편집"
                                    >
                                        <span
                                            className="mobile-title flex max-w-full items-start gap-[0.35em] leading-[1.1] tracking-[-0.05em]"
                                            style={textStyle("title", channel === "story" ? 34 : 32)}
                                        >
                                            <PictogramIcon
                                                icon={textIcons.title}
                                                className="mt-[0.08em] h-[1em] w-[1em] shrink-0"
                                            />
                                            <span className="min-w-0 whitespace-pre-wrap break-words">
                                                {renderTextCharacters(
                                                    "title",
                                                    title,
                                                    channel === "story" ? 34 : 32,
                                                )}
                                            </span>
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => selectPreviewText("date")}
                                        className={previewButtonClass(
                                            "date",
                                            "mt-4 block text-left",
                                        )}
                                        aria-label="일시 편집"
                                    >
                                        <span
                                            className="inline-flex items-center gap-[0.35em]"
                                            style={textStyle("date", 15)}
                                        >
                                            <PictogramIcon icon={textIcons.date} />
                                            <span>{renderTextCharacters("date", date, 15)}</span>
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => selectPreviewText("place")}
                                        className={previewButtonClass(
                                            "place",
                                            "mt-1 block text-left",
                                        )}
                                        aria-label="장소 편집"
                                    >
                                        <span
                                            className="inline-flex items-center gap-[0.35em]"
                                            style={textStyle("place", 14)}
                                        >
                                            <PictogramIcon icon={textIcons.place} />
                                            <span>{renderTextCharacters("place", place, 14)}</span>
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => selectPreviewText("description")}
                                        className={previewButtonClass(
                                            "description",
                                            "mt-2 block max-w-full text-left",
                                        )}
                                        aria-label="행사 내용 편집"
                                    >
                                        <span
                                            className="flex max-w-full items-start gap-[0.35em] whitespace-pre-wrap break-words leading-[1.55]"
                                            style={textStyle("description", 14)}
                                        >
                                            <PictogramIcon
                                                icon={textIcons.description}
                                                className="mt-[0.2em] h-[1em] w-[1em] shrink-0"
                                            />
                                            <span className="line-clamp-4 min-w-0 whitespace-pre-wrap break-words">
                                                {renderTextCharacters("description", description, 14)}
                                            </span>
                                        </span>
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    onClick={selectDivider}
                                    className={`absolute inset-x-[7%] bottom-[10.5%] h-4 -translate-y-1/2 ${editorTab === "style" ? "cursor-pointer" : "pointer-events-none"} ${editorTab === "style" && selectedElement === "divider" ? "rounded outline outline-1 outline-dashed outline-[#777900] outline-offset-2" : ""} ${editorTab === "style" && !dividerStyle.visible ? "border border-dashed border-[#AAB0B8]/60" : ""}`}
                                    aria-label="구분선 편집"
                                >
                                    {dividerStyle.visible && (
                                        <span
                                            className="absolute inset-x-0 top-1/2 block -translate-y-1/2"
                                            style={{
                                                borderTop: `${Math.max(1, dividerStyle.width / 2)}px ${dividerStyle.variant === "dashed" ? "dashed" : "solid"} ${dividerStyle.color}`,
                                            }}
                                        />
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => selectPreviewText("application")}
                                    className={previewButtonClass(
                                        "application",
                                        "absolute inset-x-[7%] bottom-[5%] text-left",
                                    )}
                                    aria-label="신청 문의 편집"
                                >
                                    <span
                                        className="inline-flex items-center gap-[0.35em]"
                                        style={textStyle("application", 14)}
                                    >
                                        <PictogramIcon icon={textIcons.application} />
                                        <span>
                                            {renderTextCharacters("application", application, 14)}
                                        </span>
                                    </span>
                                </button>
                            </div>
                            <p className="mt-4 text-center text-xs leading-5 text-[#8B95A1]">
                                미리보기의 글자나 선을 누르면 해당 요소를 편집할 수 있어요.
                            </p>
                        </div>

                        <div className="min-w-0 p-5 md:p-7 lg:p-8">
                            <div className="flex border-b border-[#E7E9EC]">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.key}
                                        type="button"
                                        onClick={() => setEditorTab(tab.key)}
                                        className={`relative flex-1 px-2 pb-3 text-sm transition sm:flex-none sm:px-6 ${editorTab === tab.key ? "font-semibold text-[#171B22]" : "font-medium text-[#8B95A1] hover:text-[#4E5968]"}`}
                                    >
                                        {tab.label}
                                        {editorTab === tab.key && (
                                            <span className="absolute inset-x-2 -bottom-px h-0.5 bg-[#F4F54A] sm:inset-x-5" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {editorTab === "content" && (
                                <div className="pt-6">
                                    <h2 className="text-lg font-semibold">행사 내용</h2>
                                    <div className="mt-4 grid gap-x-4 gap-y-4 sm:grid-cols-2">
                                        <div className="text-sm font-medium sm:col-span-2">
                                            <label htmlFor="promote-title">행사명</label>
                                            <div className="flex items-start gap-2">
                                                <input
                                                    id="promote-title"
                                                    onFocus={() => setActiveContentText("title")}
                                                    value={title}
                                                    onChange={(event) =>
                                                        updateTextValuePreservingRuns(
                                                            "title",
                                                            event.target.value,
                                                        )
                                                    }
                                                    className={fieldClass}
                                                />
                                                {pictogramPicker()}
                                            </div>
                                        </div>
                                        <div className="text-sm font-medium">
                                            <label htmlFor="promote-organizer">사찰·기관명</label>
                                            <div className="flex items-start gap-2">
                                                <input
                                                    id="promote-organizer"
                                                    onFocus={() => setActiveContentText("organizer")}
                                                    value={organizer}
                                                    onChange={(event) =>
                                                        updateTextValuePreservingRuns(
                                                            "organizer",
                                                            event.target.value,
                                                        )
                                                    }
                                                    className={fieldClass}
                                                />
                                            </div>
                                        </div>
                                        <div className="text-sm font-medium">
                                            <label htmlFor="promote-date">일시</label>
                                            <div className="flex items-start gap-2">
                                                <input
                                                    id="promote-date"
                                                    onFocus={() => setActiveContentText("date")}
                                                    value={date}
                                                    onChange={(event) =>
                                                        updateTextValuePreservingRuns(
                                                            "date",
                                                            event.target.value,
                                                        )
                                                    }
                                                    className={fieldClass}
                                                />
                                            </div>
                                        </div>
                                        <div className="text-sm font-medium">
                                            <label htmlFor="promote-place">장소</label>
                                            <div className="flex items-start gap-2">
                                                <input
                                                    id="promote-place"
                                                    onFocus={() => setActiveContentText("place")}
                                                    value={place}
                                                    onChange={(event) =>
                                                        updateTextValuePreservingRuns(
                                                            "place",
                                                            event.target.value,
                                                        )
                                                    }
                                                    className={fieldClass}
                                                />
                                            </div>
                                        </div>
                                        <div className="text-sm font-medium">
                                            <label htmlFor="promote-application">신청·문의</label>
                                            <div className="flex items-start gap-2">
                                                <input
                                                    id="promote-application"
                                                    onFocus={() => setActiveContentText("application")}
                                                    value={application}
                                                    onChange={(event) =>
                                                        updateTextValuePreservingRuns(
                                                            "application",
                                                            event.target.value,
                                                        )
                                                    }
                                                    className={fieldClass}
                                                />
                                            </div>
                                        </div>
                                        <div className="text-sm font-medium sm:col-span-2">
                                            <label htmlFor="promote-description">행사 내용</label>
                                            <div className="flex items-start gap-2">
                                                <textarea
                                                    id="promote-description"
                                                    onFocus={() => setActiveContentText("description")}
                                                    value={description}
                                                    onChange={(event) =>
                                                        updateTextValuePreservingRuns(
                                                            "description",
                                                            event.target.value,
                                                        )
                                                    }
                                                    rows={3}
                                                    className={`${fieldClass} min-h-[96px] resize-y leading-6`}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex flex-wrap items-center gap-2.5 border-t border-[#E7E9EC] pt-5">
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setLineMenuOpen((open) => !open)}
                                                className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${lineDraftVariant ? "border-[#2E90FA] bg-[#EEF5FF] text-[#1B5FC1]" : "border-[#E1E4E8] bg-white text-[#4E5968] hover:border-[#B8BEC6] hover:bg-[#F8F9FA]"}`}
                                            >
                                                ＋ 선 추가
                                            </button>
                                            {lineMenuOpen && (
                                                <div className="absolute left-0 top-[calc(100%+8px)] z-30 w-36 rounded-2xl border border-[#E1E4E8] bg-white p-2 shadow-[0_12px_30px_rgba(25,31,40,0.14)]">
                                                    <button
                                                        type="button"
                                                        onClick={() => beginLineInsert("solid")}
                                                        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-[#252A31] transition hover:bg-[#FFFFD8]"
                                                    >
                                                        <span>실선 추가</span>
                                                        <span className="h-px w-8 bg-[#252A31]" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => beginLineInsert("dashed")}
                                                        className="mt-1 flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-[#252A31] transition hover:bg-[#FFFFD8]"
                                                    >
                                                        <span>점선 추가</span>
                                                        <span className="w-8 border-t-2 border-dashed border-[#252A31]" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {lineDraftVariant && (
                                            <button
                                                type="button"
                                                onClick={cancelLineInsert}
                                                className="rounded-xl border border-[#DDE1E5] bg-white px-4 py-2.5 text-sm font-medium text-[#4E5968] transition hover:border-[#B8BEC6] hover:bg-[#F8F9FA]"
                                            >
                                                선 넣기 취소
                                            </button>
                                        )}

                                        {selectedLine && (
                                            <button
                                                type="button"
                                                onClick={deleteSelectedLine}
                                                className="rounded-xl border border-[#F0C9C9] bg-white px-4 py-2.5 text-sm font-medium text-[#B73535] transition hover:bg-[#FFF4F4]"
                                            >
                                                선 삭제
                                            </button>
                                        )}
                                    </div>

                                    {selectedLine && (
                                        <div className="mt-4 rounded-2xl border border-[#E7E9EC] bg-[#F8F9FA] px-4 py-4">
                                            <label className="flex items-center justify-between text-sm text-[#4E5968]">
                                                <span>선 길이</span>
                                                <span className="text-[#8B95A1]">
                                                    {selectedLine.orientation === "horizontal"
                                                        ? `${Math.round((selectedLine.end.x - selectedLine.start.x) * 100)}%`
                                                        : `${Math.round((selectedLine.end.y - selectedLine.start.y) * 100)}%`}
                                                </span>
                                            </label>
                                            <input
                                                type="range"
                                                min={selectedLine.orientation === "horizontal"
                                                    ? String(Math.round(LINE_MIN_LENGTH.horizontal * 100))
                                                    : String(Math.round(LINE_MIN_LENGTH.vertical * 100))}
                                                max={selectedLine.orientation === "horizontal"
                                                    ? String(Math.max(
                                                        Math.round(LINE_MIN_LENGTH.horizontal * 100),
                                                        Math.round((SAFE_AREA.right - selectedLine.start.x) * 100),
                                                    ))
                                                    : String(Math.max(
                                                        Math.round(LINE_MIN_LENGTH.vertical * 100),
                                                        Math.round((SAFE_AREA.bottom - selectedLine.start.y) * 100),
                                                    ))}
                                                step="1"
                                                value={selectedLine.orientation === "horizontal"
                                                    ? Math.round((selectedLine.end.x - selectedLine.start.x) * 100)
                                                    : Math.round((selectedLine.end.y - selectedLine.start.y) * 100)}
                                                onChange={(event) => {
                                                    const nextLength = Number(event.target.value) / 100;
                                                    updateSelectedLine({
                                                        end:
                                                            selectedLine.orientation === "horizontal"
                                                                ? {
                                                                    x: clamp(
                                                                        selectedLine.start.x + nextLength,
                                                                        SAFE_AREA.left,
                                                                        SAFE_AREA.right,
                                                                    ),
                                                                    y: selectedLine.start.y,
                                                                }
                                                                : {
                                                                    x: selectedLine.start.x,
                                                                    y: clamp(
                                                                        selectedLine.start.y + nextLength,
                                                                        SAFE_AREA.top,
                                                                        SAFE_AREA.bottom,
                                                                    ),
                                                                },
                                                    });
                                                }}
                                                className="mt-3 w-full accent-[#BABB25]"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {editorTab === "image" && (
                                <div className="pt-6">
                                    <h2 className="text-lg font-semibold">이미지 선택</h2>
                                    <p className="mt-1 text-sm text-[#8B95A1]">
                                        대표 또는 기타 배경 중 하나를 선택해 주세요.
                                    </p>
                                    <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                                        {imageCategories.map((category) => (
                                            <button
                                                key={category.key}
                                                type="button"
                                                onClick={() => {
                                                    setImageCategory(category.key);
                                                    const firstScene = scenesByCategory[category.key][0];
                                                    setScene(firstScene.key);
                                                    setImageSrc(firstScene.image);
                                                }}
                                                className={`shrink-0 rounded-full px-4 py-2 text-sm transition ${imageCategory === category.key ? "bg-[#F4F54A] text-[#252A31]" : "bg-[#F2F4F6] text-[#737B87]"}`}
                                            >
                                                {category.label}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                                        {visibleScenes.map((item) => (
                                            <button
                                                key={item.key}
                                                type="button"
                                                onClick={() => {
                                                    setScene(item.key);
                                                    setImageSrc(item.image);
                                                }}
                                                className={`overflow-hidden rounded-2xl border text-left transition ${scene === item.key ? "border-[#BABB25] ring-2 ring-[#F4F54A]/60" : "border-[#E1E4E8] hover:border-[#B8BEC6]"}`}
                                            >
                                                <span className="block aspect-square overflow-hidden bg-[#EEF1F3]">
                                                    <img
                                                        src={item.image}
                                                        alt={item.label}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </span>
                                                <span className="block truncate px-3 py-2.5 text-center text-xs font-medium">
                                                    {item.label}
                                                </span>
                                            </button>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                document.getElementById("promote-image-upload")?.click()
                                            }
                                            className={`relative overflow-hidden rounded-2xl border text-left transition ${scene === "custom" ? "border-[#BABB25] ring-2 ring-[#F4F54A]/60" : "border-[#E1E4E8] hover:border-[#B8BEC6]"}`}
                                        >
                                            <span
                                                className="relative flex aspect-square items-center justify-center overflow-hidden bg-[#F7F8F2]"
                                                style={
                                                    scene === "custom"
                                                        ? undefined
                                                        : {
                                                            backgroundImage:
                                                                "radial-gradient(circle at 1px 1px, rgba(119,121,0,0.16) 1px, transparent 0)",
                                                            backgroundSize: "14px 14px",
                                                        }
                                                }
                                            >
                                                {scene === "custom" ? (
                                                    <img
                                                        src={imageSrc}
                                                        alt="사용자가 올린 이미지"
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="flex flex-col items-center text-[#777900]">
                                                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-[0_4px_14px_rgba(25,31,40,0.08)]">
                                                            <svg
                                                                viewBox="0 0 32 32"
                                                                fill="none"
                                                                className="h-7 w-7"
                                                                aria-hidden="true"
                                                            >
                                                                <rect
                                                                    x="5"
                                                                    y="7"
                                                                    width="22"
                                                                    height="18"
                                                                    rx="3"
                                                                    stroke="currentColor"
                                                                    strokeWidth="1.8"
                                                                />
                                                                <circle
                                                                    cx="12"
                                                                    cy="13"
                                                                    r="2.2"
                                                                    stroke="currentColor"
                                                                    strokeWidth="1.8"
                                                                />
                                                                <path
                                                                    d="m7.5 22 5.2-5 3.8 3.4 3.1-2.8 4.9 4.4"
                                                                    stroke="currentColor"
                                                                    strokeWidth="1.8"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                                <path
                                                                    d="M23 4v6M20 7h6"
                                                                    stroke="currentColor"
                                                                    strokeWidth="1.8"
                                                                    strokeLinecap="round"
                                                                />
                                                            </svg>
                                                        </span>
                                                        <span className="mt-2 text-xs font-medium">
                                                            사진 올리기
                                                        </span>
                                                    </span>
                                                )}
                                            </span>
                                            <span className="block truncate px-3 py-2.5 text-center text-xs font-medium">
                                                내 이미지
                                            </span>
                                        </button>
                                    </div>

                                    {imageCategory === "other" &&
                                        visibleOtherCount < scenesByCategory.other.length && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setVisibleOtherCount((count) => count + 6)
                                                }
                                                className="mt-4 w-full rounded-xl border border-[#E1E4E8] bg-white px-4 py-3 text-sm font-medium text-[#4E5968] transition hover:border-[#B8BEC6] hover:bg-[#F8F9FA]"
                                            >
                                                이미지 더보기
                                            </button>
                                        )}

                                    <label className="mt-5 flex cursor-pointer items-center justify-between border-t border-[#E7E9EC] py-5 text-sm">
                                        <span>
                                            <strong className="block font-medium">
                                                내 행사 이미지 사용
                                            </strong>
                                            <span className="mt-1 block text-xs text-[#8B95A1]">
                                                JPG·PNG·WEBP 파일을 올릴 수 있어요.
                                            </span>
                                        </span>
                                        <span className="ml-4 shrink-0 rounded-xl bg-[#F4F54A] px-4 py-2.5 font-medium">
                                            내 이미지 선택
                                        </span>
                                        <input
                                            id="promote-image-upload"
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            onChange={(event) => {
                                                handleImage(event);
                                                if (event.target.files?.[0]) setScene("custom");
                                            }}
                                            className="sr-only"
                                        />
                                    </label>

                                    {scene === "custom" && (
                                        <div className="flex items-center justify-between gap-3 border-t border-[#E7E9EC] py-4">
                                            <span className="text-sm font-normal text-[#4E5968]">
                                                사진 맞춤
                                            </span>
                                            <div
                                                className="flex rounded-xl bg-[#F2F4F6] p-1"
                                                role="group"
                                                aria-label="사진 맞춤 방식"
                                            >
                                                {(
                                                    [
                                                        { key: "cover", label: "화면 채우기" },
                                                        { key: "contain", label: "전체 사진" },
                                                    ] as const
                                                ).map((item) => (
                                                    <button
                                                        key={item.key}
                                                        type="button"
                                                        onClick={() => setImageFit(item.key)}
                                                        aria-pressed={imageFit === item.key}
                                                        className={`rounded-lg px-3 py-2 text-xs font-normal transition ${imageFit === item.key ? "bg-white text-[#252A31] shadow-sm ring-1 ring-[#E1E4E8]" : "text-[#737B87]"}`}
                                                    >
                                                        {item.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {editorTab === "style" && (
                                <div className="pt-3 sm:pt-6">
                                    {selectedElement !== "divider" && selectedElement !== "line" && (
                                        <label className="block text-sm font-normal text-[#4E5968]">
                                            <span className="flex items-center justify-between gap-3">
                                                <span>선택한 글자 내용</span>
                                                <span className="shrink-0 text-xs font-medium text-[#777900]">
                                                    선택: {textLabels[selectedElement]}
                                                </span>
                                            </span>
                                            <textarea
                                                ref={styleTextareaRef}
                                                value={selectedTextValue[selectedText]}
                                                onChange={(event) =>
                                                    updateSelectedTextValue(event.target.value)
                                                }
                                                onSelect={(event) => {
                                                    if (!isRichTextKey(selectedText)) {
                                                        setTextSelection(null);
                                                        return;
                                                    }

                                                    const start = event.currentTarget.selectionStart;
                                                    const end = event.currentTarget.selectionEnd;
                                                    setTextSelection(
                                                        start === end ? null : { start, end },
                                                    );
                                                }}
                                                rows={selectedText === "description" ? 4 : 1}
                                                className="mt-2 w-full resize-none rounded-xl border border-[#E1E4E8] bg-white px-4 py-3 text-[15px] font-normal leading-6 text-[#6B7280] outline-none transition focus:border-[#B9BA28] focus:ring-2 focus:ring-[#F4F54A]/30"
                                            />
                                            {isRichTextKey(selectedText) && (
                                                <span className="mt-1.5 block text-xs text-[#8B95A1]">
                                                    일부 글자만 바꾸려면 입력창에서 글자를 드래그한 뒤
                                                    아래의 크기·굵기·색상을 선택하세요.
                                                </span>
                                            )}
                                        </label>
                                    )}

                                    {(selectedElement === "divider" || selectedElement === "line") && (
                                        <div>
                                            <div className="flex items-center justify-between gap-3 text-sm text-[#4E5968]">
                                                <span>추가한 선 편집</span>
                                                <span className="shrink-0 text-xs font-medium text-[#777900]">
                                                    선택: 사용자 선
                                                </span>
                                            </div>

                                            {!hasActiveLine || !activeLineVariant || activeLineWidth === undefined || !activeLineColor ? (
                                                <p className="mt-3 rounded-2xl border border-[#E7E9EC] bg-[#F8F9FA] px-4 py-4 text-sm leading-6 text-[#6B7280]">
                                                    미리보기에서 선을 눌러 선택하거나 내용 탭에서 선을 추가해 주세요.
                                                </p>
                                            ) : (
                                                <>
                                                    <div className="mt-3 border-b border-[#E7E9EC] pb-5">
                                                        <p className="text-sm text-[#4E5968]">선 종류</p>
                                                        <div className="mt-3 grid grid-cols-2 gap-2">
                                                            {[
                                                                { value: "solid", label: "실선" },
                                                                { value: "dashed", label: "점선" },
                                                            ].map((item) => (
                                                                <button
                                                                    key={item.value}
                                                                    type="button"
                                                                    onClick={() =>
                                                                        updateActiveLineStyle({
                                                                            variant: item.value as LineVariant,
                                                                        })
                                                                    }
                                                                    className={`rounded-xl border px-3 py-2.5 text-sm transition ${activeLineVariant === item.value ? "border-[#BABB25] bg-[#FFFFD8]" : "border-[#E1E4E8]"}`}
                                                                >
                                                                    {item.label}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="border-b border-[#E7E9EC] py-5">
                                                        <label className="flex items-center justify-between text-sm text-[#4E5968]">
                                                            <span>선 굵기</span>
                                                            <span className="text-[#8B95A1]">
                                                                {activeLineWidth}px
                                                            </span>
                                                        </label>
                                                        <input
                                                            type="range"
                                                            min="1"
                                                            max="8"
                                                            step="1"
                                                            value={activeLineWidth}
                                                            onChange={(event) =>
                                                                updateActiveLineStyle({
                                                                    width: Number(event.target.value),
                                                                })
                                                            }
                                                            className="mt-3 w-full accent-[#BABB25]"
                                                        />
                                                    </div>

                                                    <div className="pt-5">
                                                        <p className="text-sm text-[#4E5968]">선 색상</p>
                                                        <div className="mt-3 flex flex-wrap items-start gap-2.5">
                                                            {colorPalette.map((color) => (
                                                                <span key={`active-line-${color}`} className="group relative">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => updateActiveLineStyle({ color })}
                                                                        className={`h-9 w-9 rounded-full border-2 shadow-sm ${activeLineColor === color ? "scale-110 border-[#3182F6]" : "border-white ring-1 ring-[#DDE1E5]"}`}
                                                                        style={{ backgroundColor: color }}
                                                                        title={`${colorNames[color]} · ${color}`}
                                                                        aria-label={`선 색상 ${colorNames[color]}, ${color}`}
                                                                    />
                                                                    <span
                                                                        role="tooltip"
                                                                        className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#252A31] px-2.5 py-1.5 text-[11px] font-normal text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
                                                                    >
                                                                        {colorNames[color]} · {color}
                                                                    </span>
                                                                </span>
                                                            ))}
                                                            <ModernColorPicker
                                                                value={activeLineColor}
                                                                onChange={(color) => updateActiveLineStyle({ color })}
                                                                label="선 색상 직접 선택"
                                                            />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={deleteActiveLine}
                                                            className="mt-5 rounded-xl border border-[#F0C9C9] bg-white px-4 py-2.5 text-sm font-medium text-[#B73535] transition hover:bg-[#FFF4F4]"
                                                        >
                                                            선 삭제
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}

                                    <div
                                        className={
                                            selectedElement === "divider" || selectedElement === "line" ? "hidden" : "block"
                                        }
                                    >
                                        <div className="mt-4 border-b border-[#E7E9EC] pb-5">
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                                                <label className="min-w-0 flex-1 text-xs text-[#4E5968]">
                                                    <span className="flex items-center justify-between">
                                                        <span>글자 크기</span>
                                                        <span className="text-[#8B95A1]">
                                                            {activeScale}%
                                                        </span>
                                                    </span>
                                                    <input
                                                        type="range"
                                                        min="50"
                                                        max="200"
                                                        step="5"
                                                        value={activeScale}
                                                        onChange={(event) =>
                                                            updateSizeWeightOrColor({
                                                                scale: Number(event.target.value),
                                                            })
                                                        }
                                                        className="mt-2 w-full accent-[#BABB25]"
                                                    />
                                                </label>
                                                <div className="shrink-0">
                                                    <p className="text-xs text-[#4E5968]">그림자</p>
                                                    <div className="mt-2 flex gap-1.5">
                                                        {(Object.keys(shadowOptions) as ShadowKey[]).map(
                                                            (key) => (
                                                                <button
                                                                    key={key}
                                                                    type="button"
                                                                    onClick={() =>
                                                                        updateSelectedFormat({ shadowKey: key })
                                                                    }
                                                                    className={`rounded-lg border px-2 py-1.5 text-[11px] ${selectedFormat.shadowKey === key ? "border-[#BABB25] bg-[#FFFFD8]" : "border-[#E1E4E8]"}`}
                                                                >
                                                                    {shadowOptions[key].label}
                                                                </button>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-b border-[#E7E9EC] py-5">
                                            <p className="text-sm font-normal text-[#4E5968]">
                                                글씨체
                                            </p>
                                            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                                                {(Object.keys(fontOptions) as FontKey[]).map((key) => (
                                                    <button
                                                        key={key}
                                                        type="button"
                                                        onClick={() =>
                                                            updateSelectedFormat({ fontKey: key })
                                                        }
                                                        className={`rounded-xl border px-3 py-3 text-sm font-normal transition ${selectedFormat.fontKey === key ? "border-[#BABB25] bg-[#FFFFD8]" : "border-[#E1E4E8] hover:border-[#B8BEC6]"}`}
                                                        style={{ fontFamily: fontOptions[key].css }}
                                                    >
                                                        {fontOptions[key].label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="border-b border-[#E7E9EC] py-5">
                                            <p className="text-sm font-normal text-[#4E5968]">
                                                글씨 굵기
                                            </p>
                                            <div className="mt-3 grid grid-cols-3 gap-2">
                                                {[
                                                    { value: 400, label: "보통" },
                                                    { value: 500, label: "중간" },
                                                    { value: 700, label: "굵게" },
                                                ].map((item) => (
                                                    <button
                                                        key={item.value}
                                                        type="button"
                                                        onClick={() =>
                                                            updateSizeWeightOrColor({
                                                                fontWeight: item.value,
                                                            })
                                                        }
                                                        className={`rounded-xl border px-3 py-2.5 text-sm transition ${activeWeight === item.value ? "border-[#BABB25] bg-[#FFFFD8]" : "border-[#E1E4E8]"}`}
                                                        style={{ fontWeight: item.value }}
                                                    >
                                                        {item.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="pt-5">
                                            <p className="text-sm font-normal text-[#4E5968]">
                                                글자색
                                            </p>
                                            <div className="mt-3 flex flex-wrap items-start gap-2.5">
                                                {colorPalette.map((color) => (
                                                    <span key={color} className="group relative">
                                                        <button
                                                            type="button"
                                                            onClick={() => updateSizeWeightOrColor({ color })}
                                                            className={`h-9 w-9 rounded-full border-2 shadow-sm transition ${activeColor === color ? "scale-110 border-[#3182F6]" : "border-white ring-1 ring-[#DDE1E5]"}`}
                                                            style={{ backgroundColor: color }}
                                                            title={`${colorNames[color]} · ${color}`}
                                                            aria-label={`글자색 ${colorNames[color]}, ${color}`}
                                                        />
                                                        <span
                                                            role="tooltip"
                                                            className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#252A31] px-2.5 py-1.5 text-[11px] font-normal text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
                                                        >
                                                            {colorNames[color]} · {color}
                                                        </span>
                                                    </span>
                                                ))}
                                                <ModernColorPicker
                                                    value={activeColor}
                                                    onChange={(color) =>
                                                        updateSizeWeightOrColor({ color })
                                                    }
                                                    label="글자색 직접 선택"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {editorTab === "copy" && (
                                <div className="pt-6">
                                    <h2 className="text-lg font-semibold">홍보 문구</h2>
                                    <p className="mt-1 text-sm text-[#8B95A1]">
                                        자동으로 만든 문구에 내용을 자유롭게 덧붙이거나 고쳐보세요.
                                    </p>
                                    <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
                                        {(Object.keys(copyLabels) as CopyKey[]).map((key) => (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() => setCopyChannel(key)}
                                                className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-medium ${copyChannel === key ? "bg-[#F4F54A] text-[#252A31]" : "bg-[#F2F4F6] text-[#737B87]"}`}
                                            >
                                                {copyLabels[key]}
                                            </button>
                                        ))}
                                    </div>
                                    <label className="mt-4 block">
                                        <span className="text-xs font-normal text-[#8B95A1]">
                                            {copyLabels[copyChannel]} 문구 편집
                                        </span>
                                        <textarea
                                            ref={copyTextareaRef}
                                            value={activeCopy}
                                            onChange={(event) => updateCopyDraft(event.target.value)}
                                            rows={copyChannel === "sms" ? 4 : 11}
                                            className="mt-2 w-full resize-y rounded-xl border border-[#E1E4E8] bg-white px-4 py-3 text-sm font-normal leading-7 text-[#59616D] outline-none transition focus:border-[#B9BA28] focus:ring-2 focus:ring-[#F4F54A]/30"
                                            aria-label={`${copyLabels[copyChannel]} 홍보 문구 편집`}
                                        />
                                    </label>
                                    <details className="group mt-3 rounded-xl bg-[#F7F8FA] px-3 py-3">
                                        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
                                            <span className="text-xs font-medium text-[#667085]">
                                                이모지 표
                                            </span>
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                className="h-6 w-6 text-[#BABB25] transition-transform group-open:rotate-180"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    d="m7 7 5 5 5-5M7 12l5 5 5-5"
                                                    stroke="currentColor"
                                                    strokeWidth="2.2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </summary>
                                        <div className="mt-2.5 grid grid-cols-5 gap-1.5 sm:grid-cols-10">
                                            {copyEmojiOptions.map((emoji) => (
                                                <button
                                                    key={emoji}
                                                    type="button"
                                                    onClick={() => insertCopyEmoji(emoji)}
                                                    className="flex aspect-square items-center justify-center rounded-lg bg-white text-lg transition hover:bg-[#F4F54A]"
                                                    aria-label={`${emoji} 이모지 삽입`}
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    </details>
                                    <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setCopyDrafts((current) => {
                                                    const next = { ...current };
                                                    delete next[copyChannel];
                                                    return next;
                                                })
                                            }
                                            className="rounded-xl border border-[#DDE1E5] px-4 py-3 text-sm font-normal text-[#667085] sm:w-auto"
                                        >
                                            자동 문구로 되돌리기
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => copyText(copyChannel)}
                                            className="flex-1 rounded-xl bg-[#20242C] px-5 py-3 text-sm font-medium text-white"
                                        >
                                            {copied === copyChannel
                                                ? "복사됨"
                                                : `${copyLabels[copyChannel]} 문구 복사`}
                                        </button>
                                    </div>
                                </div>
                            )}

                            <p className="mt-7 border-t border-[#ECEEF1] pt-4 text-xs leading-5 text-[#8B95A1]">
                                저장 전 행사 정보와 이미지 사용 권한을 확인해 주세요. 홍보
                                문구는 선택한 서비스에서 직접 붙여 넣을 수 있어요.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
