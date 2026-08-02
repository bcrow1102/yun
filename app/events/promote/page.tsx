"use client";

import Link from "next/link";
import {
    useMemo,
    useRef,
    useState,
    type ChangeEvent,
    type PointerEvent as ReactPointerEvent,
} from "react";

type ChannelKey =
    | "kakao"
    | "instagram"
    | "story"
    | "blog"
    | "youtube"
    | "share";

type SceneKey = "welcome" | "point" | "experience" | "custom";
type ImageCategory = "novice" | "temple" | "food" | "other";
type ImageFit = "cover" | "contain";
type TextKey =
    | "title"
    | "organizer"
    | "date"
    | "place"
    | "description"
    | "application";
type SelectedElement = TextKey | "divider";

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

const scenes: {
    key: SceneKey;
    label: string;
    description: string;
    image: string;
}[] = [
        {
            key: "welcome",
            label: "반가운 인사",
            description: "두 손 모아 따뜻하게 맞이해요",
            image: "/images/promote/novice-welcome.webp",
        },
        {
            key: "point",
            label: "정보 가리키기",
            description: "행사명과 신청 정보를 안내해요",
            image: "/images/promote/novice-point.webp",
        },
        {
            key: "experience",
            label: "체험 중",
            description: "연꽃·숲 체험에 어울려요",
            image: "/images/promote/novice-experience.webp",
        },
    ];

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
    { key: "novice", label: "동자승" },
    { key: "temple", label: "산사" },
    { key: "food", label: "사찰음식" },
    { key: "other", label: "기타" },
];

const textLabels: Record<TextKey, string> = {
    title: "행사명",
    organizer: "사찰·기관명",
    date: "일시",
    place: "장소",
    description: "한 줄 소개",
    application: "신청·문의",
};

type TextFormat = {
    fontKey: FontKey;
    color: string;
    fontWeight: number;
    scale: number;
    shadowKey: ShadowKey;
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
        color: "#F4F54A",
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
        color: "#F4F54A",
        fontWeight: 500,
        scale: 100,
        shadowKey: "soft",
    },
};

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

function wrapText(
    context: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
    maxLines: number,
) {
    const chars = Array.from(text);
    const lines: string[] = [];
    let line = "";

    chars.forEach((char) => {
        const next = line + char;

        if (context.measureText(next).width > maxWidth && line) {
            if (lines.length < maxLines) {
                lines.push(line);
            }

            line = char;
        } else {
            line = next;
        }
    });

    if (line && lines.length < maxLines) {
        lines.push(line);
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

export default function EventPromotePage() {
    const [channel, setChannel] = useState<ChannelKey>("instagram");

    const [scene, setScene] = useState<SceneKey>("welcome");
    const [imageFit, setImageFit] = useState<ImageFit>("cover");

    const [title, setTitle] = useState("연꽃 피는 산사 음악회");

    const [organizer, setOrganizer] = useState("연화사");

    const [date, setDate] = useState("2026. 8. 22. 토요일 오후 6시");

    const [place, setPlace] = useState("연화사 앞마당");

    const [description, setDescription] = useState(
        "여름 저녁, 산사의 고요함과 음악이 만나는 시간",
    );

    const [application, setApplication] = useState(
        "문의 02-000-0000 · 참가비 무료",
    );

    const [imageSrc, setImageSrc] = useState(
        "/images/promote/novice-welcome.webp",
    );

    const [copied, setCopied] = useState("");
    const [editorTab, setEditorTab] = useState<EditorTab>("content");
    const [copyChannel, setCopyChannel] = useState<CopyKey>("instagram");
    const [imageCategory, setImageCategory] = useState<ImageCategory>("novice");
    const [selectedText, setSelectedText] = useState<TextKey>("title");
    const [selectedElement, setSelectedElement] =
        useState<SelectedElement>("title");
    const [dividerStyle, setDividerStyle] = useState({
        color: "#171B22",
        width: 2,
        visible: true,
    });
    const [textFormats, setTextFormats] =
        useState<Record<TextKey, TextFormat>>(initialTextFormats);

    const imageObjectUrl = useRef<string | null>(null);
    const copyTextareaRef = useRef<HTMLTextAreaElement | null>(null);

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
    const selectedTextValue: Record<TextKey, string> = {
        title,
        organizer,
        date,
        place,
        description,
        application,
    };

    const updateSelectedTextValue = (value: string) => {
        const setters: Record<TextKey, (next: string) => void> = {
            title: setTitle,
            organizer: setOrganizer,
            date: setDate,
            place: setPlace,
            description: setDescription,
            application: setApplication,
        };

        setters[selectedText](value);
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
        setEditorTab("style");
    };

    const selectDivider = () => {
        if (editorTab !== "style") return;
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

        const side = isLandscape ? 62 : 76;
        const top = isLandscape ? 62 : 105;

        const contentWidth = isLandscape
            ? selected.width * 0.56
            : selected.width - side * 2;
        const format = (key: TextKey, baseSize: number) => {
            const value = textFormats[key];
            return {
                ...value,
                size: Math.round(baseSize * (value.scale / 100)),
                family: fontOptions[value.fontKey].canvas,
                shadow: shadowOptions[value.shadowKey],
            };
        };
        const organizerFormat = format("organizer", isLandscape ? 27 : 34);
        const titleFormat = format("title", isLandscape ? 55 : 68);
        const dateFormat = format("date", isLandscape ? 29 : 36);
        const placeFormat = format("place", isLandscape ? 27 : 34);
        const descriptionFormat = format("description", isLandscape ? 25 : 31);
        const applicationFormat = format("application", isLandscape ? 25 : 32);

        context.textBaseline = "alphabetic";
        context.font = `${organizerFormat.fontWeight} ${organizerFormat.size}px ${organizerFormat.family}`;
        drawPosterText(
            context,
            organizer,
            side,
            top,
            organizerFormat.color,
            organizerFormat.shadow,
        );

        context.font = `${titleFormat.fontWeight} ${titleFormat.size}px ${titleFormat.family}`;

        const titleLines = wrapText(
            context,
            title,
            contentWidth,
            isLandscape ? 2 : 3,
        );

        const titleStartY = top + Math.round(titleFormat.size * 1.42);
        const titleLineHeight = Math.round(titleFormat.size * 1.18);

        titleLines.forEach((line, index) => {
            drawPosterText(
                context,
                line,
                side,
                titleStartY + index * titleLineHeight,
                titleFormat.color,
                titleFormat.shadow,
            );
        });

        const infoY =
            titleStartY +
            (titleLines.length - 1) * titleLineHeight +
            Math.round(dateFormat.size * 1.9);

        context.font = `${dateFormat.fontWeight} ${dateFormat.size}px ${dateFormat.family}`;
        drawPosterText(
            context,
            date,
            side,
            infoY,
            dateFormat.color,
            dateFormat.shadow,
        );

        context.font = `${placeFormat.fontWeight} ${placeFormat.size}px ${placeFormat.family}`;
        const placeY =
            infoY + Math.round(Math.max(dateFormat.size, placeFormat.size) * 1.55);
        drawPosterText(
            context,
            place,
            side,
            placeY,
            placeFormat.color,
            placeFormat.shadow,
        );

        context.font = `${descriptionFormat.fontWeight} ${descriptionFormat.size}px ${descriptionFormat.family}`;

        const descriptionLines = wrapText(context, description, contentWidth, 2);

        descriptionLines.forEach((line, index) => {
            drawPosterText(
                context,
                line,
                side,
                placeY +
                Math.round(placeFormat.size * 1.7) +
                index * Math.round(descriptionFormat.size * 1.45),
                descriptionFormat.color,
                descriptionFormat.shadow,
            );
        });

        const contactLineY = selected.height - (isLandscape ? 87 : 122);

        if (dividerStyle.visible) {
            context.save();
            context.strokeStyle = dividerStyle.color;
            context.lineWidth = dividerStyle.width;
            context.beginPath();
            context.moveTo(side, contactLineY);
            context.lineTo(selected.width - side, contactLineY);
            context.stroke();
            context.restore();
        }

        context.font = `${applicationFormat.fontWeight} ${applicationFormat.size}px ${applicationFormat.family}`;

        drawPosterText(
            context,
            application,
            side,
            contactLineY + (isLandscape ? 44 : 57),
            applicationFormat.color,
            applicationFormat.shadow,
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

    const previewButtonClass = (key: TextKey, extra = "") =>
        `${extra} cursor-pointer ${editorTab === "style" && selectedElement === key ? "rounded-md outline outline-1 outline-dashed outline-[#777900] outline-offset-4" : ""}`;

    return (
        <main className="min-h-screen bg-[#F7F8FA] text-[#171B22]">
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
                                className={`relative mx-auto w-full max-w-[480px] overflow-hidden rounded-[24px] bg-[#E8ECEF] shadow-[0_16px_38px_rgba(25,31,40,0.14)] ${aspectClass}`}
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
                                        <span style={textStyle("organizer", 15)}>{organizer}</span>
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
                                            className="block leading-[1.1] tracking-[-0.05em]"
                                            style={textStyle("title", channel === "story" ? 34 : 32)}
                                        >
                                            {title}
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
                                        <span style={textStyle("date", 15)}>{date}</span>
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
                                        <span style={textStyle("place", 14)}>{place}</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => selectPreviewText("description")}
                                        className={previewButtonClass(
                                            "description",
                                            "mt-2 block max-w-full text-left",
                                        )}
                                        aria-label="한 줄 소개 편집"
                                    >
                                        <span
                                            className="line-clamp-2 leading-[1.65]"
                                            style={textStyle("description", 14)}
                                        >
                                            {description}
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
                                                height: `${Math.max(1, dividerStyle.width / 2)}px`,
                                                backgroundColor: dividerStyle.color,
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
                                    <span style={textStyle("application", 14)}>
                                        {application}
                                    </span>
                                </button>
                            </div>
                            <p className="mt-4 text-center text-xs leading-5 text-[#8B95A1]">
                                미리보기의 글자를 누르면 해당 글자를 편집할 수 있어요.
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
                                        <label className="text-sm font-medium sm:col-span-2">
                                            행사명
                                            <input
                                                value={title}
                                                onChange={(event) => setTitle(event.target.value)}
                                                className={fieldClass}
                                            />
                                        </label>
                                        <label className="text-sm font-medium">
                                            사찰·기관명
                                            <input
                                                value={organizer}
                                                onChange={(event) => setOrganizer(event.target.value)}
                                                className={fieldClass}
                                            />
                                        </label>
                                        <label className="text-sm font-medium">
                                            일시
                                            <input
                                                value={date}
                                                onChange={(event) => setDate(event.target.value)}
                                                className={fieldClass}
                                            />
                                        </label>
                                        <label className="text-sm font-medium">
                                            장소
                                            <input
                                                value={place}
                                                onChange={(event) => setPlace(event.target.value)}
                                                className={fieldClass}
                                            />
                                        </label>
                                        <label className="text-sm font-medium">
                                            신청·문의
                                            <input
                                                value={application}
                                                onChange={(event) => setApplication(event.target.value)}
                                                className={fieldClass}
                                            />
                                        </label>
                                        <label className="text-sm font-medium sm:col-span-2">
                                            한 줄 소개
                                            <input
                                                value={description}
                                                onChange={(event) => setDescription(event.target.value)}
                                                className={fieldClass}
                                            />
                                        </label>
                                    </div>
                                </div>
                            )}

                            {editorTab === "image" && (
                                <div className="pt-6">
                                    <h2 className="text-lg font-semibold">이미지 선택</h2>
                                    <p className="mt-1 text-sm text-[#8B95A1]">
                                        주제를 고른 뒤 이미지 3장 중 하나를 선택해 주세요.
                                    </p>
                                    <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                                        {imageCategories.map((category) => (
                                            <button
                                                key={category.key}
                                                type="button"
                                                onClick={() => setImageCategory(category.key)}
                                                className={`shrink-0 rounded-full px-4 py-2 text-sm transition ${imageCategory === category.key ? "bg-[#F4F54A] text-[#252A31]" : "bg-[#F2F4F6] text-[#737B87]"}`}
                                            >
                                                {category.label}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                                        {scenes.map((item) => (
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

                                    {imageCategory !== "novice" && (
                                        <p className="mt-3 text-xs leading-5 text-[#8B95A1]">
                                            {
                                                imageCategories.find(
                                                    (item) => item.key === imageCategory,
                                                )?.label
                                            }{" "}
                                            전용 이미지는 가독성을 확인한 뒤 순서대로 연결할
                                            예정이에요. 지금은 배치 확인용 이미지를 보여드려요.
                                        </p>
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
                                                {([
                                                    { key: "cover", label: "화면 채우기" },
                                                    { key: "contain", label: "전체 사진" },
                                                ] as const).map((item) => (
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
                                    {selectedElement !== "divider" && (
                                        <label className="block text-sm font-normal text-[#4E5968]">
                                            <span className="flex items-center justify-between gap-3">
                                                <span>선택한 글자 내용</span>
                                                <span className="shrink-0 text-xs font-medium text-[#777900]">
                                                    선택: {textLabels[selectedElement]}
                                                </span>
                                            </span>
                                            <textarea
                                                value={selectedTextValue[selectedText]}
                                                onChange={(event) =>
                                                    updateSelectedTextValue(event.target.value)
                                                }
                                                rows={selectedText === "description" ? 2 : 1}
                                                className="mt-2 w-full resize-none rounded-xl border border-[#E1E4E8] bg-white px-4 py-3 text-[15px] font-normal leading-6 text-[#6B7280] outline-none transition focus:border-[#B9BA28] focus:ring-2 focus:ring-[#F4F54A]/30"
                                            />
                                        </label>
                                    )}

                                    {selectedElement === "divider" && (
                                        <div>
                                            <div className="flex items-center justify-between gap-3 text-sm text-[#4E5968]">
                                                <span>구분선 편집</span>
                                                <span className="shrink-0 text-xs font-medium text-[#777900]">
                                                    선택: 구분선
                                                </span>
                                            </div>
                                            <div className="mt-3 flex items-center justify-between border-b border-[#E7E9EC] pb-5">
                                                <span className="text-sm text-[#4E5968]">선 표시</span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setDividerStyle((current) => ({
                                                            ...current,
                                                            visible: !current.visible,
                                                        }))
                                                    }
                                                    className={`rounded-full px-4 py-2 text-xs ${dividerStyle.visible ? "bg-[#F4F54A] text-[#252A31]" : "bg-[#F2F4F6] text-[#737B87]"}`}
                                                >
                                                    {dividerStyle.visible ? "표시 중" : "숨김"}
                                                </button>
                                            </div>
                                            <div className="border-b border-[#E7E9EC] py-5">
                                                <label className="flex items-center justify-between text-sm text-[#4E5968]">
                                                    <span>선 굵기</span>
                                                    <span className="text-[#8B95A1]">
                                                        {dividerStyle.width}px
                                                    </span>
                                                </label>
                                                <input
                                                    type="range"
                                                    min="1"
                                                    max="8"
                                                    step="1"
                                                    value={dividerStyle.width}
                                                    onChange={(event) =>
                                                        setDividerStyle((current) => ({
                                                            ...current,
                                                            width: Number(event.target.value),
                                                        }))
                                                    }
                                                    className="mt-3 w-full accent-[#BABB25]"
                                                />
                                            </div>
                                            <div className="pt-5">
                                                <p className="text-sm text-[#4E5968]">선 색상</p>
                                                <div className="mt-3 flex flex-wrap items-start gap-2.5">
                                                    {colorPalette.map((color) => (
                                                        <span
                                                            key={`divider-${color}`}
                                                            className="group relative"
                                                        >
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setDividerStyle((current) => ({
                                                                        ...current,
                                                                        color,
                                                                    }))
                                                                }
                                                                className={`h-9 w-9 rounded-full border-2 shadow-sm ${dividerStyle.color === color ? "scale-110 border-[#3182F6]" : "border-white ring-1 ring-[#DDE1E5]"}`}
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
                                                        value={dividerStyle.color}
                                                        onChange={(color) =>
                                                            setDividerStyle((current) => ({
                                                                ...current,
                                                                color,
                                                            }))
                                                        }
                                                        label="선 색상 직접 선택"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div
                                        className={
                                            selectedElement === "divider" ? "hidden" : "block"
                                        }
                                    >
                                        <div className="mt-4 border-b border-[#E7E9EC] pb-5">
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                                                <label className="min-w-0 flex-1 text-xs text-[#4E5968]">
                                                    <span className="flex items-center justify-between">
                                                        <span>글자 크기</span>
                                                        <span className="text-[#8B95A1]">
                                                            {selectedFormat.scale}%
                                                        </span>
                                                    </span>
                                                    <input
                                                        type="range"
                                                        min="80"
                                                        max="130"
                                                        step="5"
                                                        value={selectedFormat.scale}
                                                        onChange={(event) =>
                                                            updateSelectedFormat({
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
                                                            updateSelectedFormat({ fontWeight: item.value })
                                                        }
                                                        className={`rounded-xl border px-3 py-2.5 text-sm transition ${selectedFormat.fontWeight === item.value ? "border-[#BABB25] bg-[#FFFFD8]" : "border-[#E1E4E8]"}`}
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
                                                            onClick={() => updateSelectedFormat({ color })}
                                                            className={`h-9 w-9 rounded-full border-2 shadow-sm transition ${selectedFormat.color === color ? "scale-110 border-[#3182F6]" : "border-white ring-1 ring-[#DDE1E5]"}`}
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
                                                    value={selectedFormat.color}
                                                    onChange={(color) => updateSelectedFormat({ color })}
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
                                            onChange={(event) =>
                                                updateCopyDraft(event.target.value)
                                            }
                                            rows={copyChannel === "sms" ? 4 : 11}
                                            className="mt-2 w-full resize-y rounded-xl border border-[#E1E4E8] bg-white px-4 py-3 text-sm font-normal leading-7 text-[#59616D] outline-none transition focus:border-[#B9BA28] focus:ring-2 focus:ring-[#F4F54A]/30"
                                            aria-label={`${copyLabels[copyChannel]} 홍보 문구 편집`}
                                        />
                                    </label>
                                    <div className="mt-3 rounded-xl bg-[#F7F8FA] px-3 py-3">
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="text-xs font-medium text-[#667085]">
                                                이모지 표
                                            </span>
                                            <span className="text-[11px] text-[#8B95A1]">
                                                원하는 위치에 직접 넣어보세요
                                            </span>
                                        </div>
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
                                    </div>
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
