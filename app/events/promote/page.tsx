"use client";

import {
    useMemo,
    useEffect,
    useLayoutEffect,
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
type ImageComposition =
    | "bottom-left"
    | "bottom-center"
    | "bottom-right"
    | "upper-left"
    | "upper-right"
    | "center"
    | "full";
type CropAnchor = Readonly<{ x: number; y: number }>;

const CENTER_CROP_ANCHOR: CropAnchor = { x: 0.5, y: 0.5 };
const CONTAIN_BACKGROUND_SCALE = 1.12;
const CONTAIN_BACKGROUND_BLUR_RATIO = 0.035;
const STORY_CONTAIN_BACKGROUND_BLUR_RATIO = 0.06;
const STORY_CONTAIN_BACKGROUND_OVERLAY_ALPHA = 0;
const CUSTOM_CONTAIN_BACKGROUND_OVERLAY_ALPHA = 0.18;
const STORY_CONTAIN_BLEND_SIZE = 60;

const cropAnchorByComposition: Readonly<
    Record<ImageComposition, CropAnchor>
> = {
    "bottom-left": { x: 0.15, y: 0.9 },
    "bottom-center": { x: 0.5, y: 0.9 },
    "bottom-right": { x: 0.85, y: 0.9 },
    "upper-left": { x: 0.15, y: 0.1 },
    "upper-right": { x: 0.85, y: 0.1 },
    center: CENTER_CROP_ANCHOR,
    full: CENTER_CROP_ANCHOR,
};

function resolveCompositionAnchor(
    composition: ImageComposition,
): CropAnchor {
    return cropAnchorByComposition[composition];
}
type ImageCategory = "featured" | "other";
type ImageFit = "cover" | "contain";
type ImageFitOverride = ImageFit | null;
type TextKey =
    | "title"
    | "organizer"
    | "date"
    | "place"
    | "description"
    | "application";
type MovableTextKey = TextKey;
type TextPosition = { x: number; y: number };
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
    shadowKey?: ShadowKey;
};

const LOTUS_SYMBOL = "❀";
const PIN_SYMBOL = "⌖";

function focusContentField(key: TextKey) {
    const field = document.getElementById(`promote-${key}`) as
        | HTMLInputElement
        | HTMLTextAreaElement
        | null;

    field?.focus({ preventScroll: true });
    field?.scrollIntoView({ behavior: "smooth", block: "center" });
}

const DEFAULT_TITLE = "♫ 연꽃 피는 산사 음악회";
const KAKAO_RECOMMENDED_TITLE = "♫ 연꽃 피는 산사\n음악회";
const DEFAULT_ORGANIZER = "연화사";
const DEFAULT_DATE = "2026. 8. 22. 토요일 오후 6시";
const DEFAULT_PLACE = `${PIN_SYMBOL} 연화사 앞마당`;
const DEFAULT_APPLICATION = "문의 02-000-0000 · 참가비 무료";
const DEFAULT_DESCRIPTION =
    "여름 저녁, 산사의 고요함과\n음악이 만나는 시간";
const KAKAO_RECOMMENDED_DESCRIPTION =
    "고요한 산사의 여름밤\n음악과 연꽃의 만남.\n\n은은한 등불 아래\n편안한 쉼을 누려보세요.\n\n가족, 친구와 함께\n산사의 밤을 즐겨보세요.";
const INSTAGRAM_DEFAULT_DESCRIPTION =
    "여름 저녁, 산사의 고요함과\n음악이 만나는 특별한 시간\n\n연꽃 향기 머무는 뜰에서\n편안한 선율과 함께 쉬어가 보세요.\n\n가족, 친구와 함께\n산사의 여름밤을 천천히 즐겨보세요.";
const INSTAGRAM_RECOMMENDED_TITLE = "♫ 연꽃 피는 산사\n음악회";
const STORY_RECOMMENDED_TITLE = "♫ 연꽃 피는 산사 음악회";
const STORY_RECOMMENDED_DESCRIPTION =
    "여름 저녁, 산사의 고요함과\n음악이 만나는 특별한 시간\n\n연꽃 향기 머무는 뜰에서\n편안한 선율과 함께 쉬어가 보세요.\n\n가족, 친구와 함께\n산사의 여름밤을 천천히 즐겨보세요.";
const STORY_RECOMMENDED_APPLICATION = "문의 02-000-0000  참가비 무료";
const LANDSCAPE_RECOMMENDED_DESCRIPTION =
    "여름 저녁, 산사의 고요함과\n음악이 만나는 특별한 시간";
const A4_RECOMMENDED_DESCRIPTION = INSTAGRAM_DEFAULT_DESCRIPTION;
const A4_RECOMMENDED_APPLICATION = "문의 02-000-0000  참가비 무료";
const defaultDescriptionByChannel: Record<ChannelKey, string> = {
    instagram: INSTAGRAM_DEFAULT_DESCRIPTION,
    story: STORY_RECOMMENDED_DESCRIPTION,
    kakao: KAKAO_RECOMMENDED_DESCRIPTION,
    share: KAKAO_RECOMMENDED_DESCRIPTION,
    youtube: LANDSCAPE_RECOMMENDED_DESCRIPTION,
    blog: LANDSCAPE_RECOMMENDED_DESCRIPTION,
    a4: A4_RECOMMENDED_DESCRIPTION,
};
const INITIAL_TITLE_RUNS: RichTextRun[] = [
    {
        start: 11,
        end: 14,
        color: "#B73535",
        fontWeight: 700,
        scale: 145,
    },
];

const STORY_RECOMMENDED_TITLE_RUNS: RichTextRun[] = [
    {
        start: STORY_RECOMMENDED_TITLE.indexOf("음악회"),
        end:
            STORY_RECOMMENDED_TITLE.indexOf("음악회") + "음악회".length,
        color: "#B73535",
        fontWeight: 700,
        scale: 110,
    },
];

const KAKAO_RECOMMENDED_DESCRIPTION_RUNS: RichTextRun[] = [
    {
        start: KAKAO_RECOMMENDED_DESCRIPTION.indexOf("고요한 산사"),
        end:
            KAKAO_RECOMMENDED_DESCRIPTION.indexOf("고요한 산사") +
            "고요한 산사".length,
        color: "#B73535",
        fontWeight: 600,
        scale: 125,
        shadowKey: "soft",
    },
    {
        start: KAKAO_RECOMMENDED_DESCRIPTION.indexOf("음악과 연꽃"),
        end:
            KAKAO_RECOMMENDED_DESCRIPTION.indexOf("음악과 연꽃") +
            "음악과 연꽃".length,
        color: "#B73535",
        fontWeight: 600,
        scale: 140,
        shadowKey: "soft",
    },
    {
        start: KAKAO_RECOMMENDED_DESCRIPTION.indexOf("편안한 쉼"),
        end:
            KAKAO_RECOMMENDED_DESCRIPTION.indexOf("편안한 쉼") +
            "편안한 쉼".length,
        color: "#285943",
        fontWeight: 600,
        scale: 125,
        shadowKey: "soft",
    },
    {
        start: KAKAO_RECOMMENDED_DESCRIPTION.indexOf("가족, 친구와 함께"),
        end:
            KAKAO_RECOMMENDED_DESCRIPTION.indexOf("가족, 친구와 함께") +
            "가족, 친구와 함께".length,
        color: "#5A3E2B",
        fontWeight: 600,
        scale: 112,
        shadowKey: "soft",
    },
];

const INSTAGRAM_RECOMMENDED_DESCRIPTION_RUNS: RichTextRun[] = [
    {
        start: INSTAGRAM_DEFAULT_DESCRIPTION.indexOf("산사의 고요함"),
        end:
            INSTAGRAM_DEFAULT_DESCRIPTION.indexOf("산사의 고요함") +
            "산사의 고요함".length,
        color: "#B73535",
        fontWeight: 600,
        scale: 118,
        shadowKey: "soft",
    },
    {
        start: INSTAGRAM_DEFAULT_DESCRIPTION.indexOf(
            "음악이 만나는 특별한 시간",
        ),
        end:
            INSTAGRAM_DEFAULT_DESCRIPTION.indexOf(
                "음악이 만나는 특별한 시간",
            ) + "음악이 만나는 특별한 시간".length,
        color: "#B73535",
        fontWeight: 600,
        scale: 126,
        shadowKey: "soft",
    },
    {
        start: INSTAGRAM_DEFAULT_DESCRIPTION.indexOf("편안한 선율"),
        end:
            INSTAGRAM_DEFAULT_DESCRIPTION.indexOf("편안한 선율") +
            "편안한 선율".length,
        color: "#285943",
        fontWeight: 600,
        scale: 114,
        shadowKey: "soft",
    },
];

const STORY_RECOMMENDED_DESCRIPTION_RUNS: RichTextRun[] = [
    {
        start: STORY_RECOMMENDED_DESCRIPTION.indexOf("산사의 고요함"),
        end:
            STORY_RECOMMENDED_DESCRIPTION.indexOf("산사의 고요함") +
            "산사의 고요함".length,
        color: "#B73535",
        fontWeight: 600,
        scale: 118,
        shadowKey: "soft",
    },
    {
        start: STORY_RECOMMENDED_DESCRIPTION.indexOf(
            "음악이 만나는 특별한 시간",
        ),
        end:
            STORY_RECOMMENDED_DESCRIPTION.indexOf(
                "음악이 만나는 특별한 시간",
            ) + "음악이 만나는 특별한 시간".length,
        color: "#B73535",
        fontWeight: 600,
        scale: 126,
        shadowKey: "soft",
    },
    {
        start: STORY_RECOMMENDED_DESCRIPTION.indexOf("편안한 선율"),
        end:
            STORY_RECOMMENDED_DESCRIPTION.indexOf("편안한 선율") +
            "편안한 선율".length,
        color: "#285943",
        fontWeight: 600,
        scale: 114,
        shadowKey: "soft",
    },
];

const LANDSCAPE_RECOMMENDED_DESCRIPTION_RUNS: RichTextRun[] = [
    {
        start: LANDSCAPE_RECOMMENDED_DESCRIPTION.indexOf("산사의 고요함"),
        end:
            LANDSCAPE_RECOMMENDED_DESCRIPTION.indexOf("산사의 고요함") +
            "산사의 고요함".length,
        color: "#B73535",
        fontWeight: 600,
        scale: 118,
        shadowKey: "soft",
    },
    {
        start: LANDSCAPE_RECOMMENDED_DESCRIPTION.indexOf(
            "음악이 만나는 특별한 시간",
        ),
        end:
            LANDSCAPE_RECOMMENDED_DESCRIPTION.indexOf(
                "음악이 만나는 특별한 시간",
            ) + "음악이 만나는 특별한 시간".length,
        color: "#B73535",
        fontWeight: 600,
        scale: 120,
        shadowKey: "soft",
    },
];

const A4_RECOMMENDED_DESCRIPTION_RUNS: RichTextRun[] =
    INSTAGRAM_RECOMMENDED_DESCRIPTION_RUNS.map((run) => ({ ...run }));

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

const allVisibleFields: Readonly<Record<TextKey, boolean>> = {
    organizer: true,
    title: true,
    date: true,
    place: true,
    application: true,
    description: true,
};

const visibleFieldsByChannel: Record<
    ChannelKey,
    Readonly<Record<TextKey, boolean>>
> = {
    instagram: allVisibleFields,
    story: allVisibleFields,
    a4: allVisibleFields,
    kakao: allVisibleFields,
    share: allVisibleFields,
    youtube: {
        organizer: true,
        title: true,
        date: true,
        place: false,
        application: false,
        description: true,
    },
    blog: {
        organizer: true,
        title: true,
        date: true,
        place: true,
        application: false,
        description: true,
    },
};

type DescriptionMode = "full" | "compact";
type PosterLayoutTextKey =
    | "organizer"
    | "title"
    | "date"
    | "place"
    | "description";

type ChannelPosterLayout = {
    textSide: "left" | "right";
    textArea: {
        left: number;
        right: number;
        top: number;
        bottom: number;
    };
    elementTop: Readonly<Record<PosterLayoutTextKey, number>>;
    baseFontSizes: Readonly<Record<PosterLayoutTextKey, number>>;
    lineHeightRatios?: Readonly<Partial<Record<PosterLayoutTextKey, number>>>;
    titleMaxLines: number;
    defaultDividerVisible: boolean;
};

const youtubePosterLayoutBase = {
    elementTop: {
        organizer: 0.095,
        title: 0.18,
        date: 0.535,
        place: 0.67,
        description: 0.655,
    },
    baseFontSizes: {
        organizer: 40,
        title: 96,
        date: 48,
        place: 27,
        description: 42,
    },
    lineHeightRatios: {
        organizer: 1.2,
        title: 1.12,
        date: 1.22,
        description: 1.28,
    },
    titleMaxLines: 2,
    defaultDividerVisible: false,
} as const;

const blogPosterLayoutBase = {
    elementTop: {
        organizer: 0.075,
        title: 0.16,
        date: 0.56 - 12 / 628,
        place: 0.66 - 12 / 628,
        description: 0.765 - 15 / 628,
    },
    baseFontSizes: {
        organizer: 38,
        title: 84,
        date: 46,
        place: 42,
        description: 40,
    },
    lineHeightRatios: {
        title: 1.11,
        description: 1.3,
    },
    titleMaxLines: 2,
    defaultDividerVisible: false,
} as const;

const blogTextAreaBySide = {
    left: {
        left: 0.06,
        right: 0.55,
        top: 0.085,
        bottom: 0.94,
    },
    right: {
        left: 0.45,
        right: 0.94,
        top: 0.085,
        bottom: 0.94,
    },
} as const;

function resolveCompositionTextSide(
    composition: ImageComposition,
): ChannelPosterLayout["textSide"] {
    return composition === "bottom-left" || composition === "upper-left"
        ? "right"
        : "left";
}

const youtubeTextAreaBySide = {
    left: {
        left: 0.065,
        right: 0.55,
        top: 0.09,
        bottom: 0.91,
    },
    right: {
        left: 0.45,
        right: 0.935,
        top: 0.09,
        bottom: 0.91,
    },
} as const;

function resolveYoutubeCompositionLayout(
    composition: ImageComposition,
): ChannelPosterLayout {
    const textSide = resolveCompositionTextSide(composition);

    return {
        ...youtubePosterLayoutBase,
        textSide,
        textArea: youtubeTextAreaBySide[textSide],
    };
};

function resolveBlogCompositionLayout(
    composition: ImageComposition,
): ChannelPosterLayout {
    const textSide = resolveCompositionTextSide(composition);

    return {
        ...blogPosterLayoutBase,
        textSide,
        textArea: blogTextAreaBySide[textSide],
    };
}

const descriptionModeByChannel: Record<ChannelKey, DescriptionMode> = {
    instagram: "full",
    story: "full",
    kakao: "compact",
    share: "compact",
    youtube: "compact",
    blog: "compact",
    a4: "full",
};

const KAKAO_RECOMMENDED_BASE_FONT_SIZES = {
    organizer: 34.875,
    title: 72,
    date: 36.45,
    place: 32.625,
    description: 31.5,
    application: 33.525,
} as const;

const KAKAO_RECOMMENDED_PREVIEW_FONT_SIZES = {
    organizer: 15.5,
    date: 16.2,
    place: 14.5,
    description: 14,
    application: 14.9,
} as const;

const INSTAGRAM_RECOMMENDED_BASE_FONT_SIZES = {
    organizer: 34.875,
    title: 72,
    date: 35.55,
    place: 32.625,
    description: 33.75,
    application: 33.525,
} as const;

const INSTAGRAM_RECOMMENDED_PREVIEW_FONT_SIZES = {
    organizer: 15.5,
    date: 15.8,
    place: 14.5,
    description: 15,
    application: 14.9,
} as const;

const STORY_RECOMMENDED_BASE_FONT_SIZES = {
    organizer: 40,
    title: 82,
    date: 40,
    place: 36,
    description: 37,
    application: 35,
} as const;

const A4_RECOMMENDED_BASE_FONT_SIZES = {
    organizer: 80,
    title: 170,
    date: 90,
    place: 84,
    description: 75,
    application: 76,
} as const;

const KAKAO_RECOMMENDED_DESCRIPTION_LINE_HEIGHT = 1.42;
const INSTAGRAM_RECOMMENDED_DESCRIPTION_LINE_HEIGHT = 1.58;
const STORY_RECOMMENDED_DESCRIPTION_LINE_HEIGHT = 1.52;
const KAKAO_RECOMMENDED_DATE_GAP_FACTOR = 2.45;
const KAKAO_RECOMMENDED_DATE_MARGIN_TOP = 22;
const KAKAO_RECOMMENDED_APPLICATION_OFFSET = 76;
const KAKAO_RECOMMENDED_APPLICATION_BOTTOM = "3.4%";
const KAKAO_RECOMMENDED_NOTE_BASELINE_SHIFT = 3;

type ChannelLayout = (typeof channels)[ChannelKey] & {
    aspectRatio: number;
    isLandscape: boolean;
    visibleFields: Readonly<Record<TextKey, boolean>>;
    descriptionMode: DescriptionMode;
    posterLayout: ChannelPosterLayout | null;
    defaultDividerVisible: boolean;
    coverCropAnchor: CropAnchor;
    preview: {
        aspectClass: string;
        titleSize: number;
        mobileFontSizes: Record<TextKey, number>;
        mobileScaleMode: "proportional" | "preset";
    };
    png: {
        outputScale: number;
        shadowScale: number;
        side: number;
        top: number;
        contentWidth: number;
        baseFontSizes: Record<TextKey, number>;
        contactInset: number;
        applicationOffset: number;
        titleMaxLines: number;
    };
};

function resolveChannelLayout(
    channel: ChannelKey,
    imageComposition: ImageComposition = "center",
): ChannelLayout {
    const selected = channels[channel];
    const posterLayout =
        channel === "youtube"
            ? resolveYoutubeCompositionLayout(imageComposition)
            : channel === "blog"
                ? resolveBlogCompositionLayout(imageComposition)
                : null;
    const aspectRatio = selected.width / selected.height;
    const isLandscape = aspectRatio > 1.45;
    const outputScale = channel === "a4" ? selected.width / 1080 : 1;
    const baseFontScale = channel === "a4" ? 1 : outputScale;
    const side = posterLayout
        ? posterLayout.textArea.left * selected.width
        : (isLandscape ? 62 : 76) * outputScale;
    const baseFontSizes: Record<TextKey, number> = {
        organizer:
            posterLayout?.baseFontSizes.organizer ??
            (channel === "a4"
                ? A4_RECOMMENDED_BASE_FONT_SIZES.organizer
                : channel === "instagram"
                ? INSTAGRAM_RECOMMENDED_BASE_FONT_SIZES.organizer
                : channel === "story"
                  ? STORY_RECOMMENDED_BASE_FONT_SIZES.organizer
                : channel === "kakao"
                  ? KAKAO_RECOMMENDED_BASE_FONT_SIZES.organizer
                : isLandscape
                  ? 27
                  : 34) * baseFontScale,
        title:
            posterLayout?.baseFontSizes.title ??
            (channel === "a4"
                ? A4_RECOMMENDED_BASE_FONT_SIZES.title
                : channel === "story"
                ? STORY_RECOMMENDED_BASE_FONT_SIZES.title
                : channel === "kakao" || channel === "instagram"
                ? channel === "kakao"
                    ? KAKAO_RECOMMENDED_BASE_FONT_SIZES.title
                    : INSTAGRAM_RECOMMENDED_BASE_FONT_SIZES.title
                : isLandscape
                  ? 55
                  : 68) * baseFontScale,
        date:
            posterLayout?.baseFontSizes.date ??
            (channel === "a4"
                ? A4_RECOMMENDED_BASE_FONT_SIZES.date
                : channel === "instagram"
                ? INSTAGRAM_RECOMMENDED_BASE_FONT_SIZES.date
                : channel === "story"
                  ? STORY_RECOMMENDED_BASE_FONT_SIZES.date
                : channel === "kakao"
                  ? KAKAO_RECOMMENDED_BASE_FONT_SIZES.date
                : isLandscape
                  ? 29
                  : 36) * baseFontScale,
        place:
            posterLayout?.baseFontSizes.place ??
            (channel === "a4"
                ? A4_RECOMMENDED_BASE_FONT_SIZES.place
                : channel === "instagram"
                ? INSTAGRAM_RECOMMENDED_BASE_FONT_SIZES.place
                : channel === "story"
                  ? STORY_RECOMMENDED_BASE_FONT_SIZES.place
                : channel === "kakao"
                  ? KAKAO_RECOMMENDED_BASE_FONT_SIZES.place
                : isLandscape
                  ? 27
                  : 34) * baseFontScale,
        description:
            posterLayout?.baseFontSizes.description ??
            (channel === "a4"
                ? A4_RECOMMENDED_BASE_FONT_SIZES.description
                : channel === "instagram"
                ? INSTAGRAM_RECOMMENDED_BASE_FONT_SIZES.description
                : channel === "story"
                  ? STORY_RECOMMENDED_BASE_FONT_SIZES.description
                : channel === "kakao"
                  ? KAKAO_RECOMMENDED_BASE_FONT_SIZES.description
                : isLandscape
                  ? 25
                  : 31) * baseFontScale,
        application:
            (channel === "a4"
                ? A4_RECOMMENDED_BASE_FONT_SIZES.application
                : channel === "instagram"
                ? INSTAGRAM_RECOMMENDED_BASE_FONT_SIZES.application
                : channel === "story"
                  ? STORY_RECOMMENDED_BASE_FONT_SIZES.application
                : channel === "kakao"
                  ? KAKAO_RECOMMENDED_BASE_FONT_SIZES.application
                : isLandscape
                  ? 25
                  : 32) * baseFontScale,
    };
    const previewLogicalWidth = posterLayout
        ? selected.width * (TEXT_SAFE_AREA.right - TEXT_SAFE_AREA.left)
        : selected.width;
    const mobileFontSizes = Object.fromEntries(
        (Object.keys(baseFontSizes) as TextKey[]).map((key) => [
            key,
            (baseFontSizes[key] /
                (channel !== "kakao" && key !== "application"
                    ? selected.width * (TEXT_SAFE_AREA.right - TEXT_SAFE_AREA.left)
                    : key === "application"
                      ? selected.width
                      : previewLogicalWidth)) *
                100,
        ]),
    ) as Record<TextKey, number>;

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

    return {
        ...selected,
        aspectRatio,
        isLandscape,
        visibleFields: visibleFieldsByChannel[channel],
        descriptionMode: descriptionModeByChannel[channel],
        posterLayout,
        defaultDividerVisible: posterLayout?.defaultDividerVisible ?? true,
        coverCropAnchor:
            channel === "youtube" || channel === "blog"
                ? resolveCompositionAnchor(imageComposition)
                : CENTER_CROP_ANCHOR,
        preview: {
            aspectClass,
            titleSize: channel === "story" ? 34 : 32,
            mobileFontSizes,
            mobileScaleMode:
                channel === "youtube" || channel === "blog"
                    ? "preset"
                    : "proportional",
        },
        png: {
            outputScale,
            shadowScale: selected.width / 480,
            side,
            top: posterLayout
                ? posterLayout.elementTop.organizer * selected.height +
                  baseFontSizes.organizer
                : (isLandscape ? 62 : 105) * outputScale,
            contentWidth: posterLayout
                ? selected.width *
                  (posterLayout.textArea.right - posterLayout.textArea.left)
                : isLandscape
                    ? selected.width * 0.56
                    : selected.width - side * 2,
            baseFontSizes,
            contactInset: (isLandscape ? 87 : 122) * outputScale,
            applicationOffset:
                (channel === "kakao"
                    ? KAKAO_RECOMMENDED_APPLICATION_OFFSET
                    : isLandscape
                      ? 44
                      : 57) * outputScale,
            titleMaxLines: posterLayout?.titleMaxLines ?? (isLandscape ? 2 : 3),
        },
    };
}

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
    key: Exclude<SceneKey, "custom">;
    label: string;
    description: string;
    image: string;
    composition: ImageComposition;
};

const featuredScenes: SceneOption[] = [
    {
        key: "otherLotus",
        label: "연꽃 동자승",
        description: "따뜻한 인사와 일반 행사에 어울려요",
        image: "/images/promote/promote-other-lotus-novice.webp",
        composition: "bottom-right",
    },
    {
        key: "otherMoon",
        label: "고요한 달빛",
        description: "명상·기도·교육 안내에 어울려요",
        image: "/images/promote/promote-other-moon-novice.webp",
        composition: "bottom-right",
    },
    {
        key: "otherLanterns",
        label: "한지 연등",
        description: "어떤 불교 행사에도 편하게 사용할 수 있어요",
        image: "/images/promote/promote-other-lanterns.webp",
        composition: "upper-right",
    },
];

const otherScenes: SceneOption[] = [
    {
        key: "moreMountain",
        label: "산사 능선",
        description: "사찰 안내와 일반 행사에 어울려요",
        image: "/images/promote/promote-more-mountain.webp",
        composition: "bottom-right",
    },
    {
        key: "moreBamboo",
        label: "대나무 바람",
        description: "명상·교육·자연 행사에 어울려요",
        image: "/images/promote/promote-more-bamboo.webp",
        composition: "bottom-right",
    },
    {
        key: "moreLotus",
        label: "연꽃 물결",
        description: "법회와 문화행사에 어울려요",
        image: "/images/promote/promote-more-lotus.webp",
        composition: "bottom-center",
    },
    {
        key: "moreTwilight",
        label: "초저녁 산사",
        description: "음악회와 저녁 행사에 어울려요",
        image: "/images/promote/promote-more-twilight.webp",
        composition: "bottom-right",
    },
    {
        key: "moreTea",
        label: "차와 다식",
        description: "사찰음식과 차 행사에 어울려요",
        image: "/images/promote/promote-more-tea.webp",
        composition: "bottom-right",
    },
    {
        key: "moreMoonLanterns",
        label: "달과 연등",
        description: "기도·법회·연등 행사에 어울려요",
        image: "/images/promote/promote-more-moon-lanterns.webp",
        composition: "upper-right",
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
    application: "문의 문구",
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
    shadowScale: number;
};

const scenesByKey = Object.fromEntries(
    [...featuredScenes, ...otherScenes].map((item) => [item.key, item]),
) as Record<Exclude<SceneKey, "custom">, SceneOption>;

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

const initialRichTextRuns: Record<RichTextKey, RichTextRun[]> = {
    title: INITIAL_TITLE_RUNS,
    organizer: [],
    date: [],
    place: [],
    description: [],
    application: [],
};

const SAFE_AREA = {
    left: 0.07,
    right: 0.93,
    top: 0.08,
    bottom: 0.95,
};

type DividerStyle = {
    color: string;
    width: number;
    visible: boolean;
    variant: LineVariant;
};

type DiyHistorySnapshot = {
    textValues: Record<TextKey, string>;
    editedTextFields: TextKey[];
    scene: SceneKey;
    imageFitOverride: ImageFitOverride;
    imageSrc: string;
    textFormats: Record<TextKey, TextFormat>;
    richTextRuns: Record<RichTextKey, RichTextRun[]>;
    textPositions: Record<MovableTextKey, TextPosition>;
    textIcons: Record<TextKey, PictogramKey>;
    dividerStyle: DividerStyle;
    dividerPosition: TextPosition;
    customLines: CustomLine[];
    copyDrafts: Partial<Record<CopyKey, string>>;
};

type ChannelEditorDraft = {
    snapshot: DiyHistorySnapshot;
    historyPast: DiyHistorySnapshot[];
    historyFuture: DiyHistorySnapshot[];
};

const HISTORY_LIMIT = 75;
const TEXT_HISTORY_DEBOUNCE_MS = 800;
const CONTINUOUS_HISTORY_DEBOUNCE_MS = 500;

const TEXT_SAFE_AREA = {
    left: SAFE_AREA.left,
    right: SAFE_AREA.right,
    top: 0.08,
    bottom: 0.895,
};

const FOOTER_TEXT_SAFE_AREA = {
    left: SAFE_AREA.left,
    right: SAFE_AREA.right,
    top: TEXT_SAFE_AREA.bottom,
    bottom: 0.98,
};

const DIVIDER_BASE_Y = TEXT_SAFE_AREA.bottom;
const DIVIDER_MOVE_AREA = {
    left: 0,
    right: 1,
    top: SAFE_AREA.top,
    bottom: SAFE_AREA.bottom,
};

const initialTextPositions: Record<MovableTextKey, TextPosition> = {
    organizer: { x: 0, y: 0 },
    title: { x: 0, y: 0 },
    date: { x: 0, y: 0 },
    place: { x: 0, y: 0 },
    description: { x: 0, y: 0 },
    application: { x: 0, y: 0 },
};

function isInitialTextPresentation(
    key: MovableTextKey,
    position: TextPosition,
    format: TextFormat,
    runs: RichTextRun[],
    expectedRuns: RichTextRun[] = initialRichTextRuns[key],
) {
    const initialPosition = initialTextPositions[key];
    const initialFormat = initialTextFormats[key];

    return (
        position.x === initialPosition.x &&
        position.y === initialPosition.y &&
        format.fontKey === initialFormat.fontKey &&
        format.color === initialFormat.color &&
        format.fontWeight === initialFormat.fontWeight &&
        format.scale === initialFormat.scale &&
        format.shadowKey === initialFormat.shadowKey &&
        runs.length === expectedRuns.length &&
        runs.every((run, index) => {
            const initialRun = expectedRuns[index];
            return (
                run.start === initialRun.start &&
                run.end === initialRun.end &&
                run.color === initialRun.color &&
                run.fontWeight === initialRun.fontWeight &&
                run.scale === initialRun.scale &&
                run.shadowKey === initialRun.shadowKey
            );
        })
    );
}

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
    soft: { label: "약하게", blur: 2, opacity: 0.36, offset: 1 },
    normal: { label: "보통", blur: 4, opacity: 0.64, offset: 2 },
    strong: { label: "선명하게", blur: 6, opacity: 0.86, offset: 3 },
};

function contrastShadow(color: string, opacity: number) {
    const value = color.replace("#", "");
    const r = parseInt(value.slice(0, 2), 16);
    const g = parseInt(value.slice(2, 4), 16);
    const b = parseInt(value.slice(4, 6), 16);
    const light = (r * 299 + g * 587 + b * 114) / 1000 > 160;
    return light
        ? `rgba(0,0,0,${opacity})`
        : `rgba(255,255,255,${Math.min(opacity * 0.48, 0.42)})`;
}

function cssTextShadow(color: string, shadowKey: ShadowKey) {
    if (shadowKey === "none") return "none";

    const shadow = shadowOptions[shadowKey];
    return `0 ${shadow.offset}px ${shadow.blur}px ${contrastShadow(color, shadow.opacity)}`;
}

function resolvedCanvasShadow(shadowKey: ShadowKey, scale: number) {
    const shadow = shadowOptions[shadowKey];
    return {
        ...shadow,
        blur: shadow.blur * scale,
        offset: shadow.offset * scale,
    };
}

function isRichTextKey(key: TextKey): key is RichTextKey {
    return Boolean(key);
}

function isMovableTextKey(key: TextKey): key is MovableTextKey {
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

function PictogramPicker({
    targetLabel,
    onSelect,
    compact = false,
    className = "relative mt-2 shrink-0",
}: {
    targetLabel: string;
    onSelect: (symbol: string) => void;
    compact?: boolean;
    className?: string;
}) {
    return (
        <details className={`group ${className}`}>
            <summary
                className={`flex cursor-pointer list-none items-center justify-center border font-normal transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden ${compact ? "h-10 w-10 rounded-[10px] border-[#747D6F] bg-[#BABB25] text-lg text-[#FFFDF3] hover:bg-[#B9BA28] focus-visible:ring-[#7E8977]" : "h-[46px] w-[46px] rounded-xl border-[#E2E32E] bg-[#F4F54A] text-xl text-[#252A31] hover:bg-[#EDEF36] focus-visible:ring-[#B9BA28]"}`}
                title="픽토그램 넣기"
                aria-label={`${targetLabel}에 픽토그램 넣기`}
            >
                ＋
            </summary>
            <div
                className={`absolute right-0 z-40 grid w-[246px] grid-cols-3 gap-1.5 rounded-2xl border border-[#E1E4E8] bg-white p-2 shadow-[0_12px_30px_rgba(25,31,40,0.14)] ${compact ? "top-[44px]" : "top-[52px]"}`}
                role="group"
                aria-label={`${targetLabel} 픽토그램 선택표`}
            >
                {pictogramOptions.map((item) => (
                    <button
                        key={item.key}
                        type="button"
                        onClick={(event) => {
                            onSelect(item.symbol);
                            event.currentTarget.closest("details")?.removeAttribute("open");
                        }}
                        className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-left text-[11px] transition hover:bg-[#FFFFD8]"
                        title={`${item.label} 삽입`}
                        aria-label={`${targetLabel}에 ${item.label} 삽입`}
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
    maxLines = Number.POSITIVE_INFINITY,
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
        const runShadowKey = run?.shadowKey ?? base.shadowKey;
        const style: ResolvedTextFormat = run
            ? {
                ...base,
                color: run.color,
                fontWeight: run.fontWeight,
                size: base.size * (run.scale / 100),
                shadowKey: runShadowKey,
                shadow: resolvedCanvasShadow(runShadowKey, base.shadowScale),
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

function richTextMetrics(
    lines: ReturnType<typeof layoutRichText>,
    defaultLineHeight: number,
) {
    const lineHeights = lines.map((line) => {
        const largestSize = Math.max(...line.map((glyph) => glyph.style.size), 0);
        return Math.max(defaultLineHeight, largestSize * 1.28);
    });

    return {
        width: Math.max(
            ...lines.map((line) =>
                line.reduce((total, glyph) => total + glyph.width, 0),
            ),
            0,
        ),
        height: lineHeights.reduce((total, height) => total + height, 0),
        firstLineSize: Math.max(
            ...(lines[0] ?? []).map((glyph) => glyph.style.size),
            0,
        ),
        lineHeights,
    };
}

function drawRichText(
    context: CanvasRenderingContext2D,
    lines: ReturnType<typeof layoutRichText>,
    x: number,
    firstBaselineY: number,
    defaultLineHeight: number,
    noteBaselineShift = 0,
) {
    let baselineY = firstBaselineY;
    const metrics = richTextMetrics(lines, defaultLineHeight);

    lines.forEach((line, lineIndex) => {
        let cursorX = x;

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
                    baselineY - (glyph.char === "♫" ? noteBaselineShift : 0),
                    glyph.style.color,
                    glyph.style.shadow,
                );
            }
            cursorX += glyph.width;
        });

        if (lineIndex < lines.length - 1) {
            baselineY += metrics.lineHeights[lineIndex];
        }
    });

    return metrics.height;
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
        };
    }

    return {
        left: `calc(${line.start.x * 100}% - 9px)`,
        width: "18px",
        top: `${bounds.top * 100}%`,
        height: `${Math.max((bounds.bottom - bounds.top) * 100, 1)}%`,
    };
}

function createLineStrokeStyle(line: CustomLine): CSSProperties {
    const logicalWidth = `${(line.width / 1080) * 100}cqw`;

    if (line.orientation === "horizontal") {
        return {
            position: "absolute",
            left: 0,
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            borderTop: `${logicalWidth} ${line.variant === "dashed" ? "dashed" : "solid"} ${line.color}`,
        };
    }

    return {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        borderLeft: `${logicalWidth} ${line.variant === "dashed" ? "dashed" : "solid"} ${line.color}`,
    };
}

export default function EventPromotePage() {
    const [channel, setChannel] = useState<ChannelKey>("instagram");

    const [scene, setScene] = useState<SceneKey>("otherLotus");
    const [imageFitOverride, setImageFitOverride] =
        useState<ImageFitOverride>(null);

    const [title, setTitle] = useState(DEFAULT_TITLE);

    const [organizer, setOrganizer] = useState(DEFAULT_ORGANIZER);

    const [date, setDate] = useState(DEFAULT_DATE);

    const [place, setPlace] = useState(DEFAULT_PLACE);

    const [description, setDescription] = useState(
        INSTAGRAM_DEFAULT_DESCRIPTION,
    );

    const [application, setApplication] = useState(DEFAULT_APPLICATION);

    const [imageSrc, setImageSrc] = useState(
        "/images/promote/promote-other-lotus-novice.webp",
    );

    const [copied, setCopied] = useState("");
    const [editorTab, setEditorTab] = useState<EditorTab>("content");
    const [pendingFocusField, setPendingFocusField] = useState<TextKey | null>(null);
    const [copyChannel, setCopyChannel] = useState<CopyKey>("instagram");
    const [copyDrafts, setCopyDrafts] = useState<
        Partial<Record<CopyKey, string>>
    >({});
    const [imageCategory, setImageCategory] = useState<ImageCategory>("featured");
    const [visibleOtherCount, setVisibleOtherCount] = useState(6);
    const [selectedText, setSelectedText] = useState<TextKey>("title");
    const [activeContentText, setActiveContentText] = useState<TextKey>("title");
    const [selectedElement, setSelectedElement] =
        useState<SelectedElement>("title");
    const [dividerStyle, setDividerStyle] = useState<DividerStyle>({
        color: "#171B22",
        width: 2,
        visible: true,
        variant: "solid" as LineVariant,
    });
    const [dividerPosition, setDividerPosition] = useState<TextPosition>({ x: 0, y: 0 });
    const [customLines, setCustomLines] = useState<CustomLine[]>([]);
    const [selectedLineId, setSelectedLineId] = useState<string | null>(null);
    const [lineDraftVariant, setLineDraftVariant] = useState<LineVariant | null>(null);
    const [lineMenuOpen, setLineMenuOpen] = useState(false);
    const [drawingLine, setDrawingLine] = useState<CustomLine | null>(null);
    const [textFormats, setTextFormats] =
        useState<Record<TextKey, TextFormat>>(initialTextFormats);
    const [textPositions, setTextPositions] =
        useState<Record<MovableTextKey, TextPosition>>(initialTextPositions);
    const [descriptionUserViewport, setDescriptionUserViewport] = useState<{
        maxHeight: number;
        maxLines: number;
    } | null>(null);
    const [selectedPreviewText, setSelectedPreviewText] =
        useState<MovableTextKey | null>(null);
    const [isDividerPreviewSelected, setIsDividerPreviewSelected] = useState(false);
    const [textIcons, setTextIcons] = useState<Record<TextKey, PictogramKey>>({
        title: "none",
        organizer: "none",
        date: "none",
        place: "none",
        description: "none",
        application: "none",
    });
    const [richTextRuns, setRichTextRuns] = useState<
        Record<RichTextKey, RichTextRun[]>
    >(() => ({
        ...initialRichTextRuns,
        description: INSTAGRAM_RECOMMENDED_DESCRIPTION_RUNS.map((run) => ({
            ...run,
        })),
    }));
    const [editedTextFields, setEditedTextFields] = useState<ReadonlySet<TextKey>>(
        () => new Set(),
    );
    const [textSelection, setTextSelection] = useState<{
        start: number;
        end: number;
    } | null>(null);

    const imageObjectUrlsRef = useRef<Set<string>>(new Set());
    const copyTextareaRef = useRef<HTMLTextAreaElement | null>(null);
    const styleTextareaRef = useRef<HTMLTextAreaElement | null>(null);
    const lineAddButtonRef = useRef<HTMLButtonElement | null>(null);
    const previewFrameRef = useRef<HTMLDivElement | null>(null);
    const textSafeAreaRef = useRef<HTMLDivElement | null>(null);
    const footerTextSafeAreaRef = useRef<HTMLDivElement | null>(null);
    const textBlockRefs = useRef<
        Partial<Record<MovableTextKey, HTMLElement | null>>
    >({});
    const textInteractionRef = useRef<{
        pointerId: number;
        key: MovableTextKey;
        origin: { x: number; y: number };
        original: TextPosition;
        bounds: {
            minX: number;
            maxX: number;
            minY: number;
            maxY: number;
        };
        historyRecorded: boolean;
    } | null>(null);
    const linePointerIdRef = useRef<number | null>(null);
    const lineStartRef = useRef<{ x: number; y: number } | null>(null);
    const lineOrientationRef = useRef<LineOrientation | null>(null);
    const lineInteractionRef = useRef<{
        pointerId: number;
        lineId: string;
        mode: LineInteractionMode;
        origin: { x: number; y: number };
        original: CustomLine;
        historyRecorded: boolean;
    } | null>(null);
    const historyPastRef = useRef<DiyHistorySnapshot[]>([]);
    const historyFutureRef = useRef<DiyHistorySnapshot[]>([]);
    const channelDraftsRef = useRef<Partial<Record<ChannelKey, ChannelEditorDraft>>>(
        {},
    );
    const currentHistorySnapshotRef = useRef<DiyHistorySnapshot | null>(null);
    const textHistoryGroupRef = useRef<{
        key: string | null;
        timer: ReturnType<typeof setTimeout> | null;
    }>({ key: null, timer: null });
    const continuousHistoryGroupRef = useRef<{
        key: string | null;
        timer: ReturnType<typeof setTimeout> | null;
    }>({ key: null, timer: null });
    const [historyAvailability, setHistoryAvailability] = useState({
        canUndo: false,
        canRedo: false,
    });
    const undoActionRef = useRef<() => void>(() => undefined);
    const redoActionRef = useRef<() => void>(() => undefined);

    useEffect(
        () => () => {
            imageObjectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
            imageObjectUrlsRef.current.clear();
        },
        [],
    );

    const captureHistorySnapshot = (): DiyHistorySnapshot => ({
        textValues: {
            title,
            organizer,
            date,
            place,
            description,
            application,
        },
        editedTextFields: Array.from(editedTextFields),
        scene,
        imageFitOverride,
        imageSrc,
        textFormats: Object.fromEntries(
            (Object.keys(textFormats) as TextKey[]).map((key) => [
                key,
                { ...textFormats[key] },
            ]),
        ) as Record<TextKey, TextFormat>,
        richTextRuns: Object.fromEntries(
            (Object.keys(richTextRuns) as RichTextKey[]).map((key) => [
                key,
                richTextRuns[key].map((run) => ({ ...run })),
            ]),
        ) as Record<RichTextKey, RichTextRun[]>,
        textPositions: Object.fromEntries(
            (Object.keys(textPositions) as MovableTextKey[]).map((key) => [
                key,
                { ...textPositions[key] },
            ]),
        ) as Record<MovableTextKey, TextPosition>,
        textIcons: { ...textIcons },
        dividerStyle: { ...dividerStyle },
        dividerPosition: { ...dividerPosition },
        customLines: customLines.map((line) => ({
            ...line,
            start: { ...line.start },
            end: { ...line.end },
        })),
        copyDrafts: { ...copyDrafts },
    });

    useEffect(() => {
        currentHistorySnapshotRef.current = captureHistorySnapshot();
    });

    const syncHistoryAvailability = () => {
        setHistoryAvailability({
            canUndo: historyPastRef.current.length > 0,
            canRedo: historyFutureRef.current.length > 0,
        });
    };

    const finishTextHistoryGroup = () => {
        if (textHistoryGroupRef.current.timer) {
            clearTimeout(textHistoryGroupRef.current.timer);
        }
        textHistoryGroupRef.current = { key: null, timer: null };
    };

    const finishContinuousHistoryGroup = () => {
        if (continuousHistoryGroupRef.current.timer) {
            clearTimeout(continuousHistoryGroupRef.current.timer);
        }
        continuousHistoryGroupRef.current = { key: null, timer: null };
    };

    const finishHistoryGroups = () => {
        finishTextHistoryGroup();
        finishContinuousHistoryGroup();
    };

    const recordHistory = () => {
        const snapshot = currentHistorySnapshotRef.current;
        if (!snapshot) return;

        historyPastRef.current.push(snapshot);
        if (historyPastRef.current.length > HISTORY_LIMIT) {
            historyPastRef.current.shift();
        }
        historyFutureRef.current = [];
        syncHistoryAvailability();
    };

    const beginTextHistoryGroup = (key: string) => {
        const group = textHistoryGroupRef.current;
        if (group.key !== key) {
            finishTextHistoryGroup();
            finishContinuousHistoryGroup();
            recordHistory();
            textHistoryGroupRef.current.key = key;
        } else if (group.timer) {
            clearTimeout(group.timer);
        }

        textHistoryGroupRef.current.timer = setTimeout(() => {
            textHistoryGroupRef.current = { key: null, timer: null };
        }, TEXT_HISTORY_DEBOUNCE_MS);
    };

    const beginContinuousHistoryGroup = (key: string) => {
        const group = continuousHistoryGroupRef.current;
        if (group.key !== key) {
            finishContinuousHistoryGroup();
            finishTextHistoryGroup();
            recordHistory();
            continuousHistoryGroupRef.current.key = key;
        } else if (group.timer) {
            clearTimeout(group.timer);
        }

        continuousHistoryGroupRef.current.timer = setTimeout(() => {
            continuousHistoryGroupRef.current = { key: null, timer: null };
        }, CONTINUOUS_HISTORY_DEBOUNCE_MS);
    };

    const applyHistorySnapshot = (snapshot: DiyHistorySnapshot) => {
        setTitle(snapshot.textValues.title);
        setOrganizer(snapshot.textValues.organizer);
        setDate(snapshot.textValues.date);
        setPlace(snapshot.textValues.place);
        setDescription(snapshot.textValues.description);
        setApplication(snapshot.textValues.application);
        setEditedTextFields(new Set(snapshot.editedTextFields));
        setScene(snapshot.scene);
        setImageFitOverride(snapshot.imageFitOverride);
        setImageSrc(snapshot.imageSrc);
        setTextFormats(snapshot.textFormats);
        setRichTextRuns(snapshot.richTextRuns);
        setTextPositions(snapshot.textPositions);
        setTextIcons(snapshot.textIcons);
        setDividerStyle(snapshot.dividerStyle);
        setDividerPosition(snapshot.dividerPosition);
        setCustomLines(snapshot.customLines);
        setCopyDrafts(snapshot.copyDrafts);
        setTextSelection(null);

        if (
            selectedLineId &&
            !snapshot.customLines.some((line) => line.id === selectedLineId)
        ) {
            setSelectedLineId(null);
            setSelectedElement(selectedText);
        }
    };

    const undoHistory = () => {
        const previous = historyPastRef.current.pop();
        const current = currentHistorySnapshotRef.current;
        if (!previous || !current) return;

        finishHistoryGroups();
        historyFutureRef.current.push(current);
        if (historyFutureRef.current.length > HISTORY_LIMIT) {
            historyFutureRef.current.shift();
        }
        applyHistorySnapshot(previous);
        syncHistoryAvailability();
    };

    const redoHistory = () => {
        const next = historyFutureRef.current.pop();
        const current = currentHistorySnapshotRef.current;
        if (!next || !current) return;

        finishHistoryGroups();
        historyPastRef.current.push(current);
        if (historyPastRef.current.length > HISTORY_LIMIT) {
            historyPastRef.current.shift();
        }
        applyHistorySnapshot(next);
        syncHistoryAvailability();
    };

    undoActionRef.current = undoHistory;
    redoActionRef.current = redoHistory;

    useEffect(() => {
        if (editorTab !== "content" || !pendingFocusField) return;

        const frame = window.requestAnimationFrame(() => {
            focusContentField(pendingFocusField);
            setPendingFocusField(null);
        });

        return () => window.cancelAnimationFrame(frame);
    }, [editorTab, pendingFocusField]);

    useEffect(() => {
        const handleHistoryShortcut = (event: KeyboardEvent) => {
            if (!(event.ctrlKey || event.metaKey) || event.altKey) return;

            const key = event.key.toLowerCase();
            if (key === "z") {
                event.preventDefault();
                if (event.shiftKey) {
                    redoActionRef.current();
                } else {
                    undoActionRef.current();
                }
                return;
            }

            if (key === "y" && !event.shiftKey) {
                event.preventDefault();
                redoActionRef.current();
            }
        };

        window.addEventListener("keydown", handleHistoryShortcut);
        return () => {
            window.removeEventListener("keydown", handleHistoryShortcut);
            finishTextHistoryGroup();
            finishContinuousHistoryGroup();
        };
    }, []);

    const copy = useMemo(() => {
        return {
            kakao: `[${organizer} 행사 안내]\n\n${title}\n\n${description}\n\n일시: ${date}\n장소: ${place}\n신청·문의: ${application}\n\n함께하고 싶은 분께 공유해 주세요.`,

            instagram: `${description}\n\n일시: ${date}\n장소: ${place}\n신청·문의: ${application}\n\n#${organizer.replaceAll(" ", "")} #불교행사 #산사문화 #연`,

            blog: `${title}\n\n${description}\n\n일시: ${date}\n장소: ${place}\n주최: ${organizer}\n신청·문의: ${application}\n\n행사에 관심 있는 분들의 많은 참여 바랍니다.`,

            youtube: `${title} | ${organizer}\n\n${description}\n일시: ${date}\n장소: ${place}\n신청·문의: ${application}\n\n#불교행사 #산사문화 #${organizer.replaceAll(" ", "")}`,

            sms: `[${organizer}] ${title} / ${date} / ${place} / ${application}`,
        };
    }, [application, date, description, organizer, place, title]);

    const activeCopy = copyDrafts[copyChannel] ?? copy[copyChannel];
    const imageComposition: ImageComposition =
        scene === "custom" ? "center" : scenesByKey[scene].composition;
    const channelLayout = resolveChannelLayout(channel, imageComposition);
    const visibleFields = channelLayout.visibleFields;
    const effectiveImageFit: ImageFit =
        imageFitOverride ??
        (channel === "story" && scene !== "custom" ? "contain" : "cover");
    const shouldRenderContainedImage =
        effectiveImageFit === "contain" &&
        (scene === "custom" || channel === "story");
    const usesSharedStoryContainBackground =
        channel === "story" && shouldRenderContainedImage;
    const coverCropAnchor =
        channel === "kakao" || channel === "share" || channel === "story"
            ? resolveCompositionAnchor(imageComposition)
            : channelLayout.coverCropAnchor;
    const hasLateralImageComposition =
        imageComposition === "bottom-left" ||
        imageComposition === "upper-left" ||
        imageComposition === "bottom-right" ||
        imageComposition === "upper-right";
    const kakaoTextSide = hasLateralImageComposition
        ? resolveCompositionTextSide(imageComposition)
        : null;
    const currentTextValue = (key: MovableTextKey) => {
        const values: Record<MovableTextKey, string> = {
            organizer,
            title,
            date,
            place,
            description,
            application,
        };
        return values[key];
    };
    const defaultTextValue = (key: MovableTextKey) => {
        const values: Record<MovableTextKey, string> = {
            organizer: DEFAULT_ORGANIZER,
            title: DEFAULT_TITLE,
            date: DEFAULT_DATE,
            place: DEFAULT_PLACE,
            description: defaultDescriptionByChannel[channel],
            application:
                channel === "story"
                    ? STORY_RECOMMENDED_APPLICATION
                    : channel === "a4"
                      ? A4_RECOMMENDED_APPLICATION
                    : DEFAULT_APPLICATION,
        };
        return values[key];
    };
    const usesRecommendedTextLayout = (key: MovableTextKey) =>
        !editedTextFields.has(key) &&
        currentTextValue(key) === defaultTextValue(key) &&
        isInitialTextPresentation(
            key,
            textPositions[key],
            textFormats[key],
            richTextRuns[key],
            key === "description" && channel === "kakao"
                ? KAKAO_RECOMMENDED_DESCRIPTION_RUNS
                : key === "description" && channel === "instagram"
                  ? INSTAGRAM_RECOMMENDED_DESCRIPTION_RUNS
                  : key === "description" && channel === "story"
                    ? STORY_RECOMMENDED_DESCRIPTION_RUNS
                    : key === "description" &&
                        (channel === "blog" || channel === "youtube")
                      ? LANDSCAPE_RECOMMENDED_DESCRIPTION_RUNS
                : key === "description" && channel === "share"
                  ? KAKAO_RECOMMENDED_DESCRIPTION_RUNS
                  : key === "description" && channel === "a4"
                    ? A4_RECOMMENDED_DESCRIPTION_RUNS
                : initialRichTextRuns[key],
        );
    const renderedTitle =
        title === DEFAULT_TITLE && usesRecommendedTextLayout("title")
            ? channel === "kakao"
                ? KAKAO_RECOMMENDED_TITLE
                : channel === "instagram"
                  ? INSTAGRAM_RECOMMENDED_TITLE
                  : channel === "story"
                    ? STORY_RECOMMENDED_TITLE
                  : title
            : title;
    const resolveRenderedRichTextRuns = (key: RichTextKey) => {
        const runs = richTextRuns[key];
        if (
            channel === "story" &&
            key === "title" &&
            usesRecommendedTextLayout("title")
        ) {
            return STORY_RECOMMENDED_TITLE_RUNS;
        }
        if (
            channel === "kakao" &&
            key === "description" &&
            usesRecommendedTextLayout("description")
        ) {
            return KAKAO_RECOMMENDED_DESCRIPTION_RUNS;
        }
        if (
            channel === "instagram" &&
            key === "description" &&
            usesRecommendedTextLayout("description")
        ) {
            return INSTAGRAM_RECOMMENDED_DESCRIPTION_RUNS;
        }
        if (
            channel === "story" &&
            key === "description" &&
            usesRecommendedTextLayout("description")
        ) {
            return STORY_RECOMMENDED_DESCRIPTION_RUNS;
        }
        if (
            channel !== "youtube" ||
            key !== "title" ||
            !title.startsWith("♫") ||
            richRunAt(runs, 0)
        ) {
            return runs;
        }

        const titleFormat = textFormats.title;
        return [
            {
                start: 0,
                end: 1,
                color: titleFormat.color,
                fontWeight: titleFormat.fontWeight,
                scale: 68,
                shadowKey: titleFormat.shadowKey,
            },
            ...runs,
        ];
    };
    const resolvedTextIcon = (key: TextKey): PictogramKey => {
        if (channel === "kakao" && usesRecommendedTextLayout(key)) {
            if (key === "date") return "clock";
            if (key === "application") return "phone";
        }
        if (channel === "instagram" && usesRecommendedTextLayout(key)) {
            if (key === "date") return "clock";
            if (key === "application") return "phone";
        }
        if (channel === "story" && usesRecommendedTextLayout(key)) {
            if (key === "date") return "clock";
            if (key === "place") return "pin";
            if (key === "application") return "phone";
        }

        return textIcons[key];
    };
    const resolveKakaoTitleDescriptionArea = (key: MovableTextKey) =>
        channel === "kakao" &&
        (key === "title" || key === "description") &&
        kakaoTextSide &&
        usesRecommendedTextLayout(key)
            ? {
                  start: kakaoTextSide === "right" ? 0.34 : 0,
                  width: 0.66,
              }
            : { start: 0, width: 1 };
    const resolvePosterTextPlacement = (key: PosterLayoutTextKey) => {
        const posterLayout = channelLayout.posterLayout;
        if (!posterLayout) return null;

        const recommended = usesRecommendedTextLayout(key);
        const commonWidth = TEXT_SAFE_AREA.right - TEXT_SAFE_AREA.left;
        const commonHeight = TEXT_SAFE_AREA.bottom - TEXT_SAFE_AREA.top;
        const safeArea = recommended ? posterLayout.textArea : TEXT_SAFE_AREA;
        const renderLeft = recommended
            ? posterLayout.textArea.left
            : clamp(
                  posterLayout.textArea.left + textPositions[key].x * commonWidth,
                  TEXT_SAFE_AREA.left,
                  TEXT_SAFE_AREA.right,
              );
        const renderTop = recommended
            ? posterLayout.elementTop[key]
            : clamp(
                  posterLayout.elementTop[key] + textPositions[key].y * commonHeight,
                  TEXT_SAFE_AREA.top,
                  TEXT_SAFE_AREA.bottom,
              );

        return { safeArea, renderLeft, renderTop };
    };
    const previewCoverImageStyle = {
        objectPosition: `${coverCropAnchor.x * 100}% ${coverCropAnchor.y * 100}%`,
    } as CSSProperties;
    const previewContainBackgroundImageStyle = {
        objectPosition: "50% 50%",
        transform: `scale(${CONTAIN_BACKGROUND_SCALE})`,
        filter: `blur(${STORY_CONTAIN_BACKGROUND_BLUR_RATIO * 100}cqmax)`,
    } as CSSProperties;
    const previewContainBackgroundOverlayStyle = {
        backgroundColor: `rgba(23, 27, 34, ${STORY_CONTAIN_BACKGROUND_OVERLAY_ALPHA})`,
    } as CSSProperties;
    const previewStoryContainForegroundStyle = {
        maskImage: `linear-gradient(to bottom, transparent 0, black ${(STORY_CONTAIN_BLEND_SIZE / channels.story.height) * 100}cqh, black calc(100% - ${(STORY_CONTAIN_BLEND_SIZE / channels.story.height) * 100}cqh), transparent 100%)`,
        WebkitMaskImage: `linear-gradient(to bottom, transparent 0, black ${(STORY_CONTAIN_BLEND_SIZE / channels.story.height) * 100}cqh, black calc(100% - ${(STORY_CONTAIN_BLEND_SIZE / channels.story.height) * 100}cqh), transparent 100%)`,
    } as CSSProperties;
    const activeTextSafeArea = TEXT_SAFE_AREA;
    const isSelectedElementVisible =
        selectedElement === "divider"
            ? channelLayout.defaultDividerVisible
            : selectedElement === "line"
                ? true
                : visibleFields[selectedElement];
    const createInitialChannelSnapshot = (
        targetChannel: ChannelKey,
    ): DiyHistorySnapshot => ({
        textValues: {
            title: DEFAULT_TITLE,
            organizer: DEFAULT_ORGANIZER,
            date: DEFAULT_DATE,
            place: DEFAULT_PLACE,
            description:
                targetChannel === "story"
                    ? STORY_RECOMMENDED_DESCRIPTION
                    : targetChannel === "blog" || targetChannel === "youtube"
                      ? LANDSCAPE_RECOMMENDED_DESCRIPTION
                      : targetChannel === "share"
                        ? KAKAO_RECOMMENDED_DESCRIPTION
                        : targetChannel === "a4"
                          ? A4_RECOMMENDED_DESCRIPTION
                    : defaultDescriptionByChannel[targetChannel],
            application:
                targetChannel === "story"
                    ? STORY_RECOMMENDED_APPLICATION
                    : targetChannel === "a4"
                      ? A4_RECOMMENDED_APPLICATION
                    : DEFAULT_APPLICATION,
        },
        editedTextFields: [],
        scene: "otherLotus",
        imageFitOverride: null,
        imageSrc: "/images/promote/promote-other-lotus-novice.webp",
        textFormats: Object.fromEntries(
            (Object.keys(initialTextFormats) as TextKey[]).map((key) => [
                key,
                { ...initialTextFormats[key] },
            ]),
        ) as Record<TextKey, TextFormat>,
        richTextRuns: Object.fromEntries(
            (Object.keys(initialRichTextRuns) as RichTextKey[]).map((key) => [
                key,
                (key === "description" && targetChannel === "story"
                    ? STORY_RECOMMENDED_DESCRIPTION_RUNS
                    : key === "description" && targetChannel === "kakao"
                      ? KAKAO_RECOMMENDED_DESCRIPTION_RUNS
                      : key === "description" && targetChannel === "instagram"
                        ? INSTAGRAM_RECOMMENDED_DESCRIPTION_RUNS
                    : key === "description" &&
                        (targetChannel === "blog" || targetChannel === "youtube")
                      ? LANDSCAPE_RECOMMENDED_DESCRIPTION_RUNS
                      : key === "description" && targetChannel === "share"
                        ? KAKAO_RECOMMENDED_DESCRIPTION_RUNS
                        : key === "description" && targetChannel === "a4"
                          ? A4_RECOMMENDED_DESCRIPTION_RUNS
                      : initialRichTextRuns[key]
                ).map((run) => ({ ...run })),
            ]),
        ) as Record<RichTextKey, RichTextRun[]>,
        textPositions: Object.fromEntries(
            (Object.keys(initialTextPositions) as MovableTextKey[]).map((key) => [
                key,
                { ...initialTextPositions[key] },
            ]),
        ) as Record<MovableTextKey, TextPosition>,
        textIcons: {
            title: "none",
            organizer: "none",
            date: "none",
            place: "none",
            description: "none",
            application: "none",
        },
        dividerStyle: {
            color: "#171B22",
            width: 2,
            visible: true,
            variant: "solid",
        },
        dividerPosition: { x: 0, y: 0 },
        customLines: [],
        copyDrafts: {},
    });
    const changeChannel = (nextChannel: ChannelKey) => {
        if (nextChannel === channel) return;

        finishHistoryGroups();
        channelDraftsRef.current[channel] = {
            snapshot: captureHistorySnapshot(),
            historyPast: [...historyPastRef.current],
            historyFuture: [...historyFutureRef.current],
        };

        const nextDraft =
            channelDraftsRef.current[nextChannel] ?? {
                snapshot: createInitialChannelSnapshot(nextChannel),
                historyPast: [],
                historyFuture: [],
            };
        channelDraftsRef.current[nextChannel] = nextDraft;
        historyPastRef.current = [...nextDraft.historyPast];
        historyFutureRef.current = [...nextDraft.historyFuture];
        currentHistorySnapshotRef.current = nextDraft.snapshot;
        applyHistorySnapshot(nextDraft.snapshot);

        const nextImageComposition =
            nextDraft.snapshot.scene === "custom"
                ? "center"
                : scenesByKey[nextDraft.snapshot.scene].composition;
        const nextLayout = resolveChannelLayout(nextChannel, nextImageComposition);
        const nextVisibleFields = nextLayout.visibleFields;

        if (!nextVisibleFields[selectedText]) {
            setSelectedText("title");
            setTextSelection(null);
        }
        if (
            (selectedElement === "divider" && !nextLayout.defaultDividerVisible) ||
            (selectedElement !== "divider" &&
                selectedElement !== "line" &&
                !nextVisibleFields[selectedElement])
        ) {
            setSelectedElement("title");
            setSelectedPreviewText(null);
            setIsDividerPreviewSelected(false);
        }
        if (selectedPreviewText && !nextVisibleFields[selectedPreviewText]) {
            setSelectedPreviewText(null);
        }
        if (!nextVisibleFields[activeContentText]) {
            setActiveContentText("title");
        }

        setSelectedLineId(null);
        setSelectedPreviewText(null);
        setIsDividerPreviewSelected(false);
        setLineDraftVariant(null);
        setDrawingLine(null);
        setChannel(nextChannel);
        syncHistoryAvailability();
    };
    const mobilePreviewStyle = {
        containerType: "size",
        "--mobile-preview-organizer-size": `${channelLayout.preview.mobileFontSizes.organizer}cqw`,
        "--mobile-preview-organizer-text-size": `${channelLayout.preview.mobileFontSizes.organizer * (textFormats.organizer.scale / 100)}cqw`,
        "--mobile-preview-title-size": `${channelLayout.preview.mobileFontSizes.title}cqw`,
        "--mobile-preview-title-text-size": `${channelLayout.preview.mobileFontSizes.title * (textFormats.title.scale / 100)}cqw`,
        "--mobile-preview-date-size": `${channelLayout.preview.mobileFontSizes.date}cqw`,
        "--mobile-preview-date-text-size": `${channelLayout.preview.mobileFontSizes.date * (textFormats.date.scale / 100)}cqw`,
        "--mobile-preview-place-size": `${channelLayout.preview.mobileFontSizes.place}cqw`,
        "--mobile-preview-place-text-size": `${channelLayout.preview.mobileFontSizes.place * (textFormats.place.scale / 100)}cqw`,
        "--mobile-preview-description-size": `${channelLayout.preview.mobileFontSizes.description}cqw`,
        "--mobile-preview-description-text-size": `${channelLayout.preview.mobileFontSizes.description * (textFormats.description.scale / 100)}cqw`,
        "--mobile-preview-application-text-size": `${channelLayout.preview.mobileFontSizes.application * (textFormats.application.scale / 100)}cqw`,
    } as CSSProperties;
    const visibleScenes =
        imageCategory === "other"
            ? scenesByCategory.other.slice(0, visibleOtherCount)
            : scenesByCategory.featured;
    const selectedLine = customLines.find((line) => line.id === selectedLineId) ?? null;
    const fixedDividerLine: CustomLine = {
        id: "divider",
        variant: dividerStyle.variant,
        orientation: "horizontal",
        start: {
            x: SAFE_AREA.left + dividerPosition.x,
            y: DIVIDER_BASE_Y + dividerPosition.y,
        },
        end: {
            x: SAFE_AREA.right + dividerPosition.x,
            y: DIVIDER_BASE_Y + dividerPosition.y,
        },
        color: dividerStyle.color,
        width: dividerStyle.width,
    };
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
        setSelectedPreviewText(null);
        setIsDividerPreviewSelected(false);
    };

    const cancelLineInsert = () => {
        setLineDraftVariant(null);
        setDrawingLine(null);
        linePointerIdRef.current = null;
        lineStartRef.current = null;
        lineOrientationRef.current = null;
    };

    const focusContentLineControls = () => {
        if (editorTab !== "content") return;

        window.requestAnimationFrame(() => {
            lineAddButtonRef.current?.focus({ preventScroll: true });
            lineAddButtonRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        });
    };

    const selectCustomLine = (lineId: string) => {
        setSelectedLineId(lineId);
        setSelectedElement("line");
        setSelectedPreviewText(null);
        setIsDividerPreviewSelected(false);
        focusContentLineControls();
    };

    const clearLineInteraction = () => {
        lineInteractionRef.current = null;
    };

    const deleteSelectedLine = () => {
        if (!selectedLineId) return;
        finishHistoryGroups();
        recordHistory();
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
        historyGroup?: string,
    ) => {
        if (historyGroup) {
            beginContinuousHistoryGroup(historyGroup);
        } else {
            finishHistoryGroups();
            recordHistory();
        }

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
            finishHistoryGroups();
            recordHistory();
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
        if (editorTab !== "style" || lineDraftVariant) return;

        selectCustomLine(line.id);

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
            historyRecorded: false,
        };

        previewFrameRef.current?.setPointerCapture(event.pointerId);
    };

    const startDividerInteraction = (event: ReactPointerEvent<HTMLButtonElement>) => {
        if (editorTab !== "style" || lineDraftVariant) return;

        selectDivider();

        const bounds = previewFrameRef.current?.getBoundingClientRect();
        if (!bounds) return;

        event.preventDefault();
        event.stopPropagation();
        lineInteractionRef.current = {
            pointerId: event.pointerId,
            lineId: "divider",
            mode: "move",
            origin: {
                x: (event.clientX - bounds.left) / bounds.width,
                y: (event.clientY - bounds.top) / bounds.height,
            },
            original: fixedDividerLine,
            historyRecorded: false,
        };
        previewFrameRef.current?.setPointerCapture(event.pointerId);
    };

    const moveLineWithinSafeArea = (
        line: CustomLine,
        dx: number,
        dy: number,
        safeArea = SAFE_AREA,
    ) => {
        const minDx = safeArea.left - Math.min(line.start.x, line.end.x);
        const maxDx = safeArea.right - Math.max(line.start.x, line.end.x);
        const minDy = safeArea.top - Math.min(line.start.y, line.end.y);
        const maxDy = safeArea.bottom - Math.max(line.start.y, line.end.y);
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

    const previewPoint = (
        event: ReactPointerEvent<HTMLDivElement>,
        safeArea = SAFE_AREA,
    ) => {
        const bounds = previewFrameRef.current?.getBoundingClientRect();
        if (!bounds) return null;

        return {
            x: clamp((event.clientX - bounds.left) / bounds.width, safeArea.left, safeArea.right),
            y: clamp((event.clientY - bounds.top) / bounds.height, safeArea.top, safeArea.bottom),
        };
    };

    const handlePreviewPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (!lineDraftVariant) {
            setSelectedPreviewText(null);
            setIsDividerPreviewSelected(false);
            setSelectedLineId(null);
            return;
        }

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
            const point = previewPoint(
                event,
                interaction.lineId === "divider" ? DIVIDER_MOVE_AREA : SAFE_AREA,
            );
            if (!point) return;

            const nextLine =
                interaction.mode === "move"
                    ? moveLineWithinSafeArea(
                        interaction.original,
                        point.x - interaction.origin.x,
                        point.y - interaction.origin.y,
                        interaction.lineId === "divider"
                            ? DIVIDER_MOVE_AREA
                            : SAFE_AREA,
                    )
                    : resizeLineFromHandle(
                        interaction.original,
                        interaction.mode,
                        point,
                        interaction.origin,
                    );

            const lineChanged =
                nextLine.start.x !== interaction.original.start.x ||
                nextLine.start.y !== interaction.original.start.y ||
                nextLine.end.x !== interaction.original.end.x ||
                nextLine.end.y !== interaction.original.end.y;
            if (!lineChanged) return;

            if (!interaction.historyRecorded) {
                finishHistoryGroups();
                recordHistory();
                interaction.historyRecorded = true;
            }

            if (interaction.lineId === "divider") {
                setDividerPosition({
                    x: nextLine.start.x - SAFE_AREA.left,
                    y: nextLine.start.y - DIVIDER_BASE_Y,
                });
            } else {
                setCustomLines((current) =>
                    current.map((line) =>
                        line.id === interaction.lineId ? nextLine : line,
                    ),
                );
            }
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
            finishHistoryGroups();
            recordHistory();
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
        if (!emoji) return;
        const textarea = copyTextareaRef.current;
        const selectionStart = textarea?.selectionStart ?? activeCopy.length;
        const selectionEnd = textarea?.selectionEnd ?? selectionStart;
        const nextValue =
            activeCopy.slice(0, selectionStart) +
            emoji +
            activeCopy.slice(selectionEnd);
        const nextCursor = selectionStart + emoji.length;

        finishHistoryGroups();
        recordHistory();
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
        if (value === activeCopy) return;
        beginTextHistoryGroup(`copy:${copyChannel}`);
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
    const activeShadowKey = selectedRichRun?.shadowKey ?? selectedFormat.shadowKey;
    const selectedTextValue: Record<TextKey, string> = {
        title,
        organizer,
        date,
        place,
        description,
        application,
    };

    const startTextInteraction = (
        event: ReactPointerEvent<HTMLButtonElement>,
        key: MovableTextKey,
    ) => {
        if (editorTab !== "style" || lineDraftVariant) return;

        const safeArea = (
            key === "application" ? footerTextSafeAreaRef : textSafeAreaRef
        ).current?.getBoundingClientRect();
        const block = textBlockRefs.current[key]?.getBoundingClientRect();

        if (!safeArea || !block || safeArea.width <= 0 || safeArea.height <= 0) {
            selectPreviewText(key);
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        selectPreviewText(key);

        const original = textPositions[key];
        textInteractionRef.current = {
            pointerId: event.pointerId,
            key,
            origin: { x: event.clientX, y: event.clientY },
            original,
            bounds: {
                minX: original.x + (safeArea.left - block.left) / safeArea.width,
                maxX: original.x + (safeArea.right - block.right) / safeArea.width,
                minY: original.y + (safeArea.top - block.top) / safeArea.height,
                maxY: original.y + (safeArea.bottom - block.bottom) / safeArea.height,
            },
            historyRecorded: false,
        };
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const markTextEdited = (key: TextKey) => {
        setEditedTextFields((current) => {
            if (current.has(key)) return current;
            const next = new Set(current);
            next.add(key);
            return next;
        });
    };

    const moveTextInteraction = (
        event: ReactPointerEvent<HTMLButtonElement>,
        key: MovableTextKey,
    ) => {
        const interaction = textInteractionRef.current;
        if (
            !interaction ||
            interaction.pointerId !== event.pointerId ||
            interaction.key !== key
        ) {
            return;
        }

        const safeArea = (
            key === "application" ? footerTextSafeAreaRef : textSafeAreaRef
        ).current?.getBoundingClientRect();
        if (!safeArea || safeArea.width <= 0 || safeArea.height <= 0) return;

        event.preventDefault();
        event.stopPropagation();

        const requestedX =
            interaction.original.x + (event.clientX - interaction.origin.x) / safeArea.width;
        const requestedY =
            interaction.original.y + (event.clientY - interaction.origin.y) / safeArea.height;
        const { minX, maxX, minY, maxY } = interaction.bounds;
        const nextPosition = {
            x: minX <= maxX ? clamp(requestedX, minX, maxX) : minX,
            y: minY <= maxY ? clamp(requestedY, minY, maxY) : minY,
        };

        if (
            nextPosition.x === interaction.original.x &&
            nextPosition.y === interaction.original.y
        ) {
            return;
        }

        if (!interaction.historyRecorded) {
            finishHistoryGroups();
            recordHistory();
            interaction.historyRecorded = true;
        }

        setTextPositions((current) => ({
            ...current,
            [key]: nextPosition,
        }));
        markTextEdited(key);
    };

    const finishTextInteraction = (
        event: ReactPointerEvent<HTMLButtonElement>,
        key: MovableTextKey,
    ) => {
        const interaction = textInteractionRef.current;
        if (
            !interaction ||
            interaction.pointerId !== event.pointerId ||
            interaction.key !== key
        ) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
        textInteractionRef.current = null;
    };

    const movableTextInteractionProps = (key: MovableTextKey) => ({
        onPointerDown: (event: ReactPointerEvent<HTMLButtonElement>) =>
            startTextInteraction(event, key),
        onPointerMove: (event: ReactPointerEvent<HTMLButtonElement>) =>
            moveTextInteraction(event, key),
        onPointerUp: (event: ReactPointerEvent<HTMLButtonElement>) =>
            finishTextInteraction(event, key),
        onPointerCancel: (event: ReactPointerEvent<HTMLButtonElement>) =>
            finishTextInteraction(event, key),
        "aria-pressed": selectedPreviewText === key,
        onClick: () => {
            if (!lineDraftVariant) selectPreviewText(key);
        },
    });

    const updateTextValuePreservingRuns = (
        key: TextKey,
        nextValue: string,
        recordChange = true,
        markAsEdited = true,
    ) => {
        const previousValue = selectedTextValue[key];
        if (previousValue === nextValue) return;
        if (recordChange) beginTextHistoryGroup(key);
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
        if (markAsEdited) markTextEdited(key);
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
        finishHistoryGroups();
        recordHistory();
        updateTextValuePreservingRuns(key, nextValue, false);

        const nextCursor = start + symbol.length;
        window.requestAnimationFrame(() => {
            field?.focus();
            field?.setSelectionRange(nextCursor, nextCursor);
        });
    };

    const updateSelectedTextValue = (value: string) => {
        updateTextValuePreservingRuns(selectedText, value);
        setTextSelection(null);
    };
    const recordStyleHistory = (historyGroup?: string) => {
        if (historyGroup) {
            beginContinuousHistoryGroup(historyGroup);
        } else {
            finishHistoryGroups();
            recordHistory();
        }
    };
    const updateSelectedFormat = (
        patch: Partial<TextFormat>,
        historyGroup?: string,
    ) => {
        recordStyleHistory(historyGroup);
        markTextEdited(selectedText);
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
        setSelectedPreviewText(isMovableTextKey(key) ? key : null);
        setIsDividerPreviewSelected(false);

        if (editorTab === "content") {
            window.requestAnimationFrame(() => focusContentField(key));
        } else if (editorTab === "copy") {
            setPendingFocusField(key);
            setEditorTab("content");
        } else {
            setEditorTab("style");
        }
    };

    const applyPartialStyle = (
        patch: Partial<Pick<RichTextRun, "color" | "fontWeight" | "scale" | "shadowKey">>,
    ) => {
        if (!isRichTextKey(selectedText) || !textSelection) return;

        const { start, end } = textSelection;

        if (start === end) return;

        setRichTextRuns((current) => {
            const existing = current[selectedText].find(
                (run) => run.start === start && run.end === end,
            );
            const containing = current[selectedText].find(
                (run) => run.start <= start && run.end >= end,
            );
            const source = existing ?? containing;
            const nextRun: RichTextRun = {
                start,
                end,
                color: source?.color ?? textFormats[selectedText].color,
                fontWeight:
                    source?.fontWeight ?? textFormats[selectedText].fontWeight,
                scale: source?.scale ?? 100,
                shadowKey: source?.shadowKey,
                ...patch,
            };
            const preservedRuns = current[selectedText].flatMap((run) => {
                if (run.end <= start || run.start >= end) return [run];

                const fragments: RichTextRun[] = [];
                if (run.start < start) fragments.push({ ...run, end: start });
                if (run.end > end) fragments.push({ ...run, start: end });
                return fragments;
            });

            return {
                ...current,
                [selectedText]: [
                    ...preservedRuns,
                    nextRun,
                ].sort((a, b) => a.start - b.start),
            };
        });
    };

    const updateSizeWeightOrColor = (
        patch: Partial<Pick<RichTextRun, "color" | "fontWeight" | "scale" | "shadowKey">>,
        historyGroup?: string,
    ) => {
        recordStyleHistory(historyGroup);
        markTextEdited(selectedText);
        if (isRichTextKey(selectedText) && textSelection) {
            applyPartialStyle(patch);
            return;
        }
        setTextFormats((current) => ({
            ...current,
            [selectedText]: { ...current[selectedText], ...patch },
        }));
    };

    const selectDivider = () => {
        setSelectedLineId(null);
        setSelectedElement("divider");
        setSelectedPreviewText(null);
        setIsDividerPreviewSelected(true);
        focusContentLineControls();
    };

    const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) return;

        finishHistoryGroups();
        recordHistory();
        const objectUrl = URL.createObjectURL(file);
        imageObjectUrlsRef.current.add(objectUrl);
        setImageSrc(objectUrl);
        setImageFitOverride(null);
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
        const selected = channelLayout;

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

            if (shouldRenderContainedImage) {
                const backgroundScale =
                    Math.max(
                        selected.width / image.width,
                        selected.height / image.height,
                    ) * CONTAIN_BACKGROUND_SCALE;
                const backgroundWidth = image.width * backgroundScale;
                const backgroundHeight = image.height * backgroundScale;
                const backgroundBlurRatio =
                    channel === "story"
                        ? STORY_CONTAIN_BACKGROUND_BLUR_RATIO
                        : CONTAIN_BACKGROUND_BLUR_RATIO;

                context.save();
                context.filter = `blur(${Math.max(selected.width, selected.height) * backgroundBlurRatio}px)`;
                context.drawImage(
                    image,
                    (selected.width - backgroundWidth) / 2,
                    (selected.height - backgroundHeight) / 2,
                    backgroundWidth,
                    backgroundHeight,
                );
                context.restore();

                const backgroundOverlayAlpha =
                    channel === "story"
                        ? STORY_CONTAIN_BACKGROUND_OVERLAY_ALPHA
                        : CUSTOM_CONTAIN_BACKGROUND_OVERLAY_ALPHA;
                context.fillStyle = `rgba(23,27,34,${backgroundOverlayAlpha})`;
                context.fillRect(0, 0, selected.width, selected.height);

                const foregroundScale = Math.min(
                    selected.width / image.width,
                    selected.height / image.height,
                );
                const foregroundWidth = image.width * foregroundScale;
                const foregroundHeight = image.height * foregroundScale;

                const foregroundX = (selected.width - foregroundWidth) / 2;
                const foregroundY = (selected.height - foregroundHeight) / 2;

                if (channel === "story") {
                    const foregroundCanvas = document.createElement("canvas");
                    foregroundCanvas.width = selected.width;
                    foregroundCanvas.height = selected.height;
                    const foregroundContext = foregroundCanvas.getContext("2d");

                    if (foregroundContext) {
                        foregroundContext.drawImage(
                            image,
                            foregroundX,
                            foregroundY,
                            foregroundWidth,
                            foregroundHeight,
                        );
                        const blendSize = Math.min(
                            STORY_CONTAIN_BLEND_SIZE,
                            foregroundHeight / 2,
                        );
                        const blendRatio = blendSize / foregroundHeight;
                        const feather = foregroundContext.createLinearGradient(
                            0,
                            foregroundY,
                            0,
                            foregroundY + foregroundHeight,
                        );
                        feather.addColorStop(0, "rgba(0,0,0,0)");
                        feather.addColorStop(blendRatio, "rgba(0,0,0,1)");
                        feather.addColorStop(1 - blendRatio, "rgba(0,0,0,1)");
                        feather.addColorStop(1, "rgba(0,0,0,0)");
                        foregroundContext.globalCompositeOperation = "destination-in";
                        foregroundContext.fillStyle = feather;
                        foregroundContext.fillRect(
                            foregroundX,
                            foregroundY,
                            foregroundWidth,
                            foregroundHeight,
                        );
                        context.drawImage(foregroundCanvas, 0, 0);
                    } else {
                        context.drawImage(
                            image,
                            foregroundX,
                            foregroundY,
                            foregroundWidth,
                            foregroundHeight,
                        );
                    }
                } else {
                    context.drawImage(
                        image,
                        foregroundX,
                        foregroundY,
                        foregroundWidth,
                        foregroundHeight,
                    );
                }
            } else {
                const scale = Math.max(
                    selected.width / image.width,
                    selected.height / image.height,
                );
                const drawWidth = image.width * scale;
                const drawHeight = image.height * scale;

                context.drawImage(
                    image,
                    (selected.width - drawWidth) * coverCropAnchor.x,
                    (selected.height - drawHeight) * coverCropAnchor.y,
                    drawWidth,
                    drawHeight,
                );
            }
        } catch {
            context.fillStyle = "rgba(255,255,255,0.9)";

            context.font = "600 34px sans-serif";

            context.fillText("행사 이미지를 올려주세요", 72, 100);
        }

        const {
            outputScale,
            shadowScale: exportShadowScale,
            side,
            top,
            contentWidth,
            baseFontSizes,
            contactInset,
            applicationOffset: applicationBaselineOffset,
            titleMaxLines,
        } = selected.png;
        const format = (key: TextKey, baseSize: number): ResolvedTextFormat => {
            const value = textFormats[key];
            return {
                ...value,
                size:
                    channel === "kakao" || channel === "instagram"
                        ? baseSize * (value.scale / 100)
                        : Math.round(baseSize * (value.scale / 100)),
                family: fontOptions[value.fontKey].canvas,
                shadow: resolvedCanvasShadow(value.shadowKey, exportShadowScale),
                shadowScale: exportShadowScale,
            };
        };
        const organizerBaseSize = baseFontSizes.organizer;
        const titleBaseSize = baseFontSizes.title;
        const dateBaseSize = baseFontSizes.date;
        const placeBaseSize = baseFontSizes.place;
        const descriptionBaseSize = baseFontSizes.description;
        const organizerFormat = format("organizer", organizerBaseSize);
        const titleFormat = format("title", titleBaseSize);
        const dateFormat = format("date", dateBaseSize);
        const placeFormat = format("place", placeBaseSize);
        const descriptionFormat = format("description", descriptionBaseSize);
        const applicationFormat = format("application", baseFontSizes.application);
        const iconOffset = (key: TextKey, size: number) =>
            resolvedTextIcon(key) === "none" ? 0 : size * 1.35;
        const contactLineY = selected.height - contactInset;
        const posterLayout = selected.posterLayout;
        const textSafeBottom = posterLayout
            ? posterLayout.textArea.bottom * selected.height
            : contactLineY;

        const resolveCanvasTextMaxWidth = (
            key: PosterLayoutTextKey,
            pictogramWidth: number,
            horizontalArea = { start: 0, width: 1 },
        ) => {
            const placement = resolvePosterTextPlacement(key);
            if (placement) {
                return Math.max(
                    1,
                    (placement.safeArea.right - placement.renderLeft) *
                        selected.width -
                        pictogramWidth,
                );
            }

            const availableWidth = contentWidth * horizontalArea.width;
            const userOffset = usesRecommendedTextLayout(key)
                ? 0
                : clamp(textPositions[key].x, 0, 1) * availableWidth;
            return Math.max(1, availableWidth - userOffset - pictogramWidth);
        };

        const resolveCanvasBaselineY = (
            key: PosterLayoutTextKey,
            formatSize: number,
            fallback: number,
        ) => {
            const placement = resolvePosterTextPlacement(key);
            return placement
                ? placement.renderTop * selected.height + formatSize
                : fallback;
        };

        const resolveCanvasTextPosition = (
            key: MovableTextKey,
            _lines: ReturnType<typeof layoutRichText>,
            _formatValue: ResolvedTextFormat,
            baseBaselineY: number,
            _lineHeight: number,
            horizontalArea = { start: 0, width: 1 },
        ) => {
            const placement =
                key === "application"
                    ? null
                    : resolvePosterTextPlacement(key as PosterLayoutTextKey);
            if (placement) {
                return {
                    x: placement.renderLeft * selected.width,
                    baselineY: baseBaselineY,
                };
            }

            return {
                x:
                    side +
                    horizontalArea.start * contentWidth +
                    textPositions[key].x * horizontalArea.width * contentWidth,
                baselineY:
                    baseBaselineY +
                    textPositions[key].y *
                        (TEXT_SAFE_AREA.bottom - TEXT_SAFE_AREA.top) *
                        selected.height,
            };
        };

        context.textBaseline = "alphabetic";
        context.font = `${organizerFormat.fontWeight} ${organizerFormat.size}px ${organizerFormat.family}`;
        const organizerLineHeight =
            organizerFormat.size *
            (posterLayout?.lineHeightRatios?.organizer ?? 1.28);
        const organizerLines = layoutRichText(
            context,
            organizer,
            organizerFormat,
            richTextRuns.organizer,
            resolveCanvasTextMaxWidth(
                "organizer",
                iconOffset("organizer", organizerFormat.size),
            ),
        );
        const organizerY = resolveCanvasBaselineY(
            "organizer",
            organizerFormat.size,
            top,
        );
        const organizerPosition = resolveCanvasTextPosition(
            "organizer",
            organizerLines,
            organizerFormat,
            organizerY,
            organizerLineHeight,
        );
        if (selected.visibleFields.organizer) {
            drawCanvasPictogram(
                context,
                resolvedTextIcon("organizer"),
                organizerPosition.x,
                organizerPosition.baselineY - organizerFormat.size * 0.35,
                organizerFormat.size * 0.9,
                organizerFormat.color,
            );
            drawRichText(
                context,
                organizerLines,
                organizerPosition.x + iconOffset("organizer", organizerFormat.size),
                organizerPosition.baselineY,
                organizerLineHeight,
            );
        }

        const titleOffset = iconOffset("title", titleFormat.size);
        const titleHorizontalArea = resolveKakaoTitleDescriptionArea("title");
        const titleLines = layoutRichText(
            context,
            renderedTitle,
            titleFormat,
            resolveRenderedRichTextRuns("title"),
            resolveCanvasTextMaxWidth("title", titleOffset, titleHorizontalArea),
            usesRecommendedTextLayout("title")
                ? (posterLayout?.titleMaxLines ?? Number.POSITIVE_INFINITY)
                : Number.POSITIVE_INFINITY,
        );

        const titleStartY = resolveCanvasBaselineY(
            "title",
            titleFormat.size,
            top + Math.round(titleBaseSize * 1.42),
        );
        const titleLineHeight = Math.round(
            titleFormat.size *
                (channel === "kakao" || channel === "instagram"
                    ? 1.1
                    : (posterLayout?.lineHeightRatios?.title ?? 1.18)),
        );
        const titlePosition = resolveCanvasTextPosition(
            "title",
            titleLines,
            titleFormat,
            titleStartY,
            titleLineHeight,
            titleHorizontalArea,
        );
        if (selected.visibleFields.title) {
            drawCanvasPictogram(
                context,
                resolvedTextIcon("title"),
                titlePosition.x,
                titlePosition.baselineY - titleFormat.size * 0.35,
                titleFormat.size,
                titleFormat.color,
            );
            drawRichText(
                context,
                titleLines,
                titlePosition.x + titleOffset,
                titlePosition.baselineY,
                titleLineHeight,
                channel === "kakao" && usesRecommendedTextLayout("title")
                    ? KAKAO_RECOMMENDED_NOTE_BASELINE_SHIFT
                    : channel === "youtube"
                      ? titleFormat.size * 0.68 * 0.06
                      : 0,
            );
        }

        const initialTitleFormat: ResolvedTextFormat = {
            ...titleFormat,
            ...initialTextFormats.title,
            size: titleBaseSize,
            family: fontOptions[initialTextFormats.title.fontKey].canvas,
            shadow: resolvedCanvasShadow(
                initialTextFormats.title.shadowKey,
                exportShadowScale,
            ),
            shadowScale: exportShadowScale,
        };
        const initialTitleLines = layoutRichText(
            context,
            channel === "kakao"
                ? KAKAO_RECOMMENDED_TITLE
                : channel === "instagram"
                  ? INSTAGRAM_RECOMMENDED_TITLE
                  : channel === "story"
                    ? STORY_RECOMMENDED_TITLE
                : DEFAULT_TITLE,
            initialTitleFormat,
            channel === "story"
                ? STORY_RECOMMENDED_TITLE_RUNS
                : INITIAL_TITLE_RUNS,
            contentWidth,
            titleMaxLines,
        );
        const initialTitleLineHeight = Math.round(
            initialTitleFormat.size *
                (channel === "kakao" || channel === "instagram" ? 1.1 : 1.18),
        );
        const initialTitleBlockHeight = richTextMetrics(
            initialTitleLines,
            initialTitleLineHeight,
        ).height;

        const infoY = resolveCanvasBaselineY(
            "date",
            dateFormat.size,
            titleStartY +
                Math.max(0, initialTitleBlockHeight - initialTitleLineHeight) +
                Math.round(
                    dateBaseSize *
                        (channel === "kakao" && usesRecommendedTextLayout("date")
                            ? KAKAO_RECOMMENDED_DATE_GAP_FACTOR
                            : 1.9),
                ),
        );

        context.font = `${dateFormat.fontWeight} ${dateFormat.size}px ${dateFormat.family}`;
        const dateLineHeight =
            dateFormat.size * (posterLayout?.lineHeightRatios?.date ?? 1.28);
        const dateLines = layoutRichText(
            context,
            date,
            dateFormat,
            richTextRuns.date,
            resolveCanvasTextMaxWidth(
                "date",
                iconOffset("date", dateFormat.size),
            ),
        );
        const datePosition = resolveCanvasTextPosition(
            "date",
            dateLines,
            dateFormat,
            infoY,
            dateLineHeight,
        );
        if (selected.visibleFields.date) {
            drawCanvasPictogram(
                context,
                resolvedTextIcon("date"),
                datePosition.x,
                datePosition.baselineY - dateFormat.size * 0.35,
                dateFormat.size * 0.9,
                dateFormat.color,
            );
            drawRichText(
                context,
                dateLines,
                datePosition.x + iconOffset("date", dateFormat.size),
                datePosition.baselineY,
                dateLineHeight,
            );
        }

        context.font = `${placeFormat.fontWeight} ${placeFormat.size}px ${placeFormat.family}`;
        const placeY = resolveCanvasBaselineY(
            "place",
            placeFormat.size,
            infoY + Math.round(Math.max(dateBaseSize, placeBaseSize) * 1.55),
        );
        const placeLineHeight = placeFormat.size * 1.28;
        const placeLines = layoutRichText(
            context,
            place,
            placeFormat,
            richTextRuns.place,
            resolveCanvasTextMaxWidth(
                "place",
                iconOffset("place", placeFormat.size),
            ),
        );
        const placePosition = resolveCanvasTextPosition(
            "place",
            placeLines,
            placeFormat,
            placeY,
            placeLineHeight,
        );
        if (selected.visibleFields.place) {
            drawCanvasPictogram(
                context,
                resolvedTextIcon("place"),
                placePosition.x,
                placePosition.baselineY - placeFormat.size * 0.35,
                placeFormat.size * 0.9,
                placeFormat.color,
            );
            drawRichText(
                context,
                placeLines,
                placePosition.x + iconOffset("place", placeFormat.size),
                placePosition.baselineY,
                placeLineHeight,
            );
        }

        const descriptionOffset = iconOffset("description", descriptionFormat.size);
        const descriptionHorizontalArea =
            resolveKakaoTitleDescriptionArea("description");
        const descriptionY = resolveCanvasBaselineY(
            "description",
            descriptionFormat.size,
            placeY + Math.round(placeBaseSize * 1.7),
        );
        const descriptionLines = layoutRichText(
            context,
            description,
            descriptionFormat,
            resolveRenderedRichTextRuns("description"),
            resolveCanvasTextMaxWidth(
                "description",
                descriptionOffset,
                descriptionHorizontalArea,
            ),
            Number.POSITIVE_INFINITY,
        );
        const descriptionLineHeight = Math.round(
            descriptionFormat.size *
                (channel === "instagram" &&
                usesRecommendedDescriptionLayout
                    ? INSTAGRAM_RECOMMENDED_DESCRIPTION_LINE_HEIGHT
                    : channel === "story"
                      ? STORY_RECOMMENDED_DESCRIPTION_LINE_HEIGHT
                    : channel === "kakao"
                      ? KAKAO_RECOMMENDED_DESCRIPTION_LINE_HEIGHT
                      : (posterLayout?.lineHeightRatios?.description ?? 1.45)),
        );
        const descriptionPosition = resolveCanvasTextPosition(
            "description",
            channel !== "kakao" && usesRecommendedDescriptionLayout
                ? descriptionLines
                : descriptionLines.slice(0, 1),
            descriptionFormat,
            descriptionY,
            descriptionLineHeight,
            descriptionHorizontalArea,
        );
        const descriptionPlacement =
            resolvePosterTextPlacement("description");
        const descriptionSafeBottom =
            selected.defaultDividerVisible
                ? (DIVIDER_BASE_Y + dividerPosition.y) * selected.height
                : descriptionPlacement
                  ? descriptionPlacement.safeArea.bottom * selected.height
                  : textSafeBottom;
        const descriptionBlockTop =
            descriptionPosition.baselineY -
            Math.max(
                ...(descriptionLines[0] ?? []).map(
                    (glyph) => glyph.style.size,
                ),
                descriptionFormat.size,
        );
        if (selected.visibleFields.description) {
            if (
                descriptionLines.length > 0 &&
                descriptionBlockTop < descriptionSafeBottom
            ) {
                context.save();
                context.beginPath();
                context.rect(
                    0,
                    Math.max(0, descriptionBlockTop),
                    selected.width,
                    Math.max(0, descriptionSafeBottom - descriptionBlockTop),
                );
                context.clip();
                drawCanvasPictogram(
                    context,
                    resolvedTextIcon("description"),
                    descriptionPosition.x,
                    descriptionPosition.baselineY -
                        descriptionFormat.size * 0.35,
                    descriptionFormat.size * 0.9,
                    descriptionFormat.color,
                );
                drawRichText(
                    context,
                    descriptionLines,
                    descriptionPosition.x + descriptionOffset,
                    descriptionPosition.baselineY,
                    descriptionLineHeight,
                );
                context.restore();
            }
        }

        if (selected.defaultDividerVisible && dividerStyle.visible) {
            context.save();
            context.strokeStyle = dividerStyle.color;
            context.lineWidth = dividerStyle.width * outputScale;
            context.setLineDash(
                dividerStyle.variant === "dashed"
                    ? [10 * outputScale, 8 * outputScale]
                    : [],
            );
            context.beginPath();
            const dividerBaseY = DIVIDER_BASE_Y * selected.height;
            context.moveTo(
                side + dividerPosition.x * selected.width,
                dividerBaseY + dividerPosition.y * selected.height,
            );
            context.lineTo(
                selected.width - side + dividerPosition.x * selected.width,
                dividerBaseY + dividerPosition.y * selected.height,
            );
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
        const applicationY = contactLineY + applicationBaselineOffset;
        const applicationLineHeight = applicationFormat.size * 1.28;
        const applicationOffset = iconOffset("application", applicationFormat.size);
        const footerSafeWidth =
            (FOOTER_TEXT_SAFE_AREA.right - FOOTER_TEXT_SAFE_AREA.left) *
            selected.width;
        const footerSafeHeight =
            (FOOTER_TEXT_SAFE_AREA.bottom - FOOTER_TEXT_SAFE_AREA.top) *
            selected.height;
        const applicationLines = layoutRichText(
            context,
            application,
            applicationFormat,
            richTextRuns.application,
            Math.max(
                1,
                footerSafeWidth *
                    (usesRecommendedTextLayout("application")
                        ? 1
                        : clamp(1 - textPositions.application.x, 0.01, 1)) -
                    applicationOffset,
            ),
        );
        const applicationPosition = {
            x:
                FOOTER_TEXT_SAFE_AREA.left * selected.width +
                textPositions.application.x * footerSafeWidth,
            baselineY:
                applicationY +
                textPositions.application.y * footerSafeHeight,
        };
        if (selected.visibleFields.application) {
            drawCanvasPictogram(
                context,
                resolvedTextIcon("application"),
                applicationPosition.x,
                applicationPosition.baselineY - applicationFormat.size * 0.35,
                applicationFormat.size * 0.9,
                applicationFormat.color,
            );

            drawRichText(
                context,
                applicationLines,
                applicationPosition.x + applicationOffset,
                applicationPosition.baselineY,
                applicationLineHeight,
            );
        }

        const link = document.createElement("a");

        link.download = `${organizer}-${title}-${selected.label}.png`.replaceAll(
            " ",
            "-",
        );

        link.href = canvas.toDataURL("image/png");

        link.click();
    };

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
        const lineHeight =
            channel === "instagram" &&
            key === "description" &&
            usesRecommendedTextLayout("description")
                ? INSTAGRAM_RECOMMENDED_DESCRIPTION_LINE_HEIGHT
                : channel === "story" && key === "description"
                  ? STORY_RECOMMENDED_DESCRIPTION_LINE_HEIGHT
                : channel === "kakao" && key === "description"
                  ? KAKAO_RECOMMENDED_DESCRIPTION_LINE_HEIGHT
                  : key === "application"
                    ? undefined
                    : channelLayout.posterLayout?.lineHeightRatios?.[key];
        return {
            color: value.color,
            fontFamily: fontOptions[value.fontKey].css,
            fontWeight: value.fontWeight,
            fontSize: `${size * (value.scale / 100)}px`,
            textShadow: cssTextShadow(value.color, value.shadowKey),
            ...(lineHeight ? { lineHeight } : {}),
        };
    };

    const initialTextStyle = (key: MovableTextKey, size: number) => {
        const lineHeight =
            channel === "instagram" && key === "description"
                ? INSTAGRAM_RECOMMENDED_DESCRIPTION_LINE_HEIGHT
                : channel === "story" && key === "description"
                  ? STORY_RECOMMENDED_DESCRIPTION_LINE_HEIGHT
                : channel === "kakao" && key === "description"
                  ? KAKAO_RECOMMENDED_DESCRIPTION_LINE_HEIGHT
                : key === "application"
                ? undefined
                : channelLayout.posterLayout?.lineHeightRatios?.[key];
        return {
            color: initialTextFormats[key].color,
            fontFamily: fontOptions[initialTextFormats[key].fontKey].css,
            fontWeight: initialTextFormats[key].fontWeight,
            fontSize: `${size}px`,
            ...(lineHeight ? { lineHeight } : {}),
        };
    };

    const previewTextBaseSize = (key: TextKey, fallback: number) => {
        if (channel === "instagram") {
            if (key === "organizer") {
                return INSTAGRAM_RECOMMENDED_PREVIEW_FONT_SIZES.organizer;
            }
            if (key === "date") {
                return INSTAGRAM_RECOMMENDED_PREVIEW_FONT_SIZES.date;
            }
            if (key === "place") {
                return INSTAGRAM_RECOMMENDED_PREVIEW_FONT_SIZES.place;
            }
            if (key === "description") {
                return INSTAGRAM_RECOMMENDED_PREVIEW_FONT_SIZES.description;
            }
            if (key === "application") {
                return INSTAGRAM_RECOMMENDED_PREVIEW_FONT_SIZES.application;
            }

            return fallback;
        }
        if (channel !== "kakao") return fallback;

        if (key === "organizer") {
            return KAKAO_RECOMMENDED_PREVIEW_FONT_SIZES.organizer;
        }
        if (key === "date") return KAKAO_RECOMMENDED_PREVIEW_FONT_SIZES.date;
        if (key === "place") return KAKAO_RECOMMENDED_PREVIEW_FONT_SIZES.place;
        if (key === "description") {
            return KAKAO_RECOMMENDED_PREVIEW_FONT_SIZES.description;
        }
        if (key === "application") {
            return KAKAO_RECOMMENDED_PREVIEW_FONT_SIZES.application;
        }

        return fallback;
    };

    const textPositionStyle = (key: MovableTextKey): CSSProperties => {
        if (channelLayout.posterLayout && key !== "application") return {};

        const kakaoArea = resolveKakaoTitleDescriptionArea(key);
        return {
            transform:
                key === "application"
                    ? `translate(${textPositions[key].x * (FOOTER_TEXT_SAFE_AREA.right - FOOTER_TEXT_SAFE_AREA.left) * 100}cqw, ${textPositions[key].y * (FOOTER_TEXT_SAFE_AREA.bottom - FOOTER_TEXT_SAFE_AREA.top) * 100}cqh)`
                    : `translate(${textPositions[key].x * kakaoArea.width * 100}cqw, ${textPositions[key].y * 100}cqh)`,
            ...(channel === "kakao" && key === "application"
                ? { bottom: KAKAO_RECOMMENDED_APPLICATION_BOTTOM }
                : {}),
        };
    };

    const userTextAvailableWidthStyle = (
        key: MovableTextKey,
    ): CSSProperties | undefined => {
        if (usesRecommendedTextLayout(key)) return undefined;
        if (channelLayout.posterLayout && key !== "application") return undefined;

        const remainingRatio = clamp(1 - textPositions[key].x, 0.01, 1);
        if (key === "application") {
            return {
                width: `${(FOOTER_TEXT_SAFE_AREA.right - FOOTER_TEXT_SAFE_AREA.left) * remainingRatio * 100}%`,
                maxWidth: `${(FOOTER_TEXT_SAFE_AREA.right - FOOTER_TEXT_SAFE_AREA.left) * remainingRatio * 100}%`,
            };
        }

        return {
            width: `${remainingRatio * 100}%`,
            maxWidth: `${remainingRatio * 100}%`,
        };
    };

    const previewKakaoTextAreaStyle = (
        key: MovableTextKey,
    ): CSSProperties | undefined => {
        const kakaoArea = resolveKakaoTitleDescriptionArea(key);
        return kakaoArea.width < 1
            ? {
                  left: `${kakaoArea.start * 100}%`,
                  right: "auto",
                  width: `${kakaoArea.width * 100}%`,
              }
            : undefined;
    };

    const previewRowStyle = (
        key: PosterLayoutTextKey,
    ): CSSProperties | undefined => {
        const posterLayout = channelLayout.posterLayout;
        if (!posterLayout) {
            return channel === "kakao" &&
                key === "date" &&
                usesRecommendedTextLayout("date")
                ? { marginTop: KAKAO_RECOMMENDED_DATE_MARGIN_TOP }
                : undefined;
        }

        const placement = resolvePosterTextPlacement(key);
        if (!placement) return undefined;

        const areaWidth = TEXT_SAFE_AREA.right - TEXT_SAFE_AREA.left;
        const areaHeight = TEXT_SAFE_AREA.bottom - TEXT_SAFE_AREA.top;
        return {
            position: "absolute",
            left: `${((placement.renderLeft - TEXT_SAFE_AREA.left) / areaWidth) * 100}%`,
            right: "auto",
            width: `${((placement.safeArea.right - placement.renderLeft) / areaWidth) * 100}%`,
            top: `${((placement.renderTop - TEXT_SAFE_AREA.top) / areaHeight) * 100}%`,
            marginTop: 0,
        };
    };

    const previewLineClampStyle = (
        maxLines: number | undefined,
    ): CSSProperties | undefined =>
        maxLines
            ? {
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: maxLines,
                overflow: "hidden",
            }
            : undefined;
    const usesRecommendedDescriptionLayout =
        usesRecommendedTextLayout("description");

    useLayoutEffect(() => {
        const measure = () => {
            const safeArea = textSafeAreaRef.current?.getBoundingClientRect();
            const previewFrame = previewFrameRef.current?.getBoundingClientRect();
            const block = textBlockRefs.current.description;
            if (!safeArea || !block) return;

            const blockBounds = block.getBoundingClientRect();
            const computed = window.getComputedStyle(block);
            const fontSize = Number.parseFloat(computed.fontSize) || 0;
            const computedLineHeight = Number.parseFloat(computed.lineHeight);
            const baseLineHeight = Number.isFinite(computedLineHeight)
                ? computedLineHeight
                : fontSize * 1.2;
            const largestRunScale = Math.max(
                1,
                ...resolveRenderedRichTextRuns("description").map(
                    (run) => run.scale / 100,
                ),
            );
            const actualLineHeight = Math.max(
                baseLineHeight,
                fontSize * largestRunScale * 1.28,
            );
            const descriptionPlacement =
                resolvePosterTextPlacement("description");
            const logicalSafeBottom = channelLayout.defaultDividerVisible
                ? DIVIDER_BASE_Y + dividerPosition.y
                : (descriptionPlacement?.safeArea.bottom ?? TEXT_SAFE_AREA.bottom);
            const safeBottom = previewFrame
                ? previewFrame.top + logicalSafeBottom * previewFrame.height
                : safeArea.bottom;
            const availableHeight = Math.max(0, safeBottom - blockBounds.top);
            const maxLines = Math.max(
                0,
                Math.floor((availableHeight + 0.01) / actualLineHeight),
            );
            const nextViewport = {
                maxHeight: availableHeight,
                maxLines,
            };
            setDescriptionUserViewport((current) =>
                current &&
                Math.abs(current.maxHeight - nextViewport.maxHeight) < 0.1 &&
                current.maxLines === nextViewport.maxLines
                    ? current
                    : nextViewport,
            );
        };

        measure();
        const observer = new ResizeObserver(measure);
        if (previewFrameRef.current) observer.observe(previewFrameRef.current);
        if (textSafeAreaRef.current) observer.observe(textSafeAreaRef.current);
        window.addEventListener("resize", measure);
        return () => {
            observer.disconnect();
            window.removeEventListener("resize", measure);
        };
    }, [
        channel,
        description,
        richTextRuns.description,
        textFormats.description,
        textPositions.description,
        dividerPosition.y,
    ]);

    const renderTextCharacters = (key: TextKey, text: string, size: number) => {
        const renderedRuns = isRichTextKey(key)
            ? resolveRenderedRichTextRuns(key)
            : [];
        if (
            !isRichTextKey(key) ||
            (!renderedRuns.length &&
                !text.includes(LOTUS_SYMBOL) &&
                !text.includes(PIN_SYMBOL))
        )
            return text;

        const base = textFormats[key];

        return text.split("").map((char, index) => {
            const run = richRunAt(renderedRuns, index);
            const isRecommendedKakaoNote =
                channel === "kakao" &&
                key === "title" &&
                index === 0 &&
                char === "♫" &&
                usesRecommendedTextLayout("title");
            const isRecommendedYoutubeNote =
                channel === "youtube" &&
                key === "title" &&
                index === 0 &&
                char === "♫" &&
                !richRunAt(richTextRuns.title, 0);

            if (char === LOTUS_SYMBOL || char === PIN_SYMBOL) {
                return (
                    <span
                        key={`${key}-${index}`}
                        className={`${run ? "preview-rich-run " : ""}inline-flex w-[1.05em] items-center justify-center align-[-0.12em]`}
                        style={
                            run
                                ? {
                                    color: run.color,
                                    fontSize: `${size * (base.scale / 100) * (run.scale / 100)}px`,
                                    textShadow: cssTextShadow(
                                        run.color,
                                        run.shadowKey ?? base.shadowKey,
                                    ),
                                    "--mobile-run-size": `${channelLayout.preview.mobileFontSizes[key] * (base.scale / 100) * (run.scale / 100)}cqw`,
                                } as CSSProperties
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

            if (!run) {
                return (
                    <span
                        key={`${key}-${index}`}
                        style={
                            isRecommendedKakaoNote
                                ? { position: "relative", top: "-2px" }
                                : undefined
                        }
                    >
                        {char}
                    </span>
                );
            }

            const isDefaultMusicEmphasis =
                key === "title" && text.slice(run.start, run.end) === "음악회";

            return (
                <span
                    key={`${key}-${index}`}
                    className={`preview-rich-run${isDefaultMusicEmphasis ? " mobile-music-emphasis" : ""}`}
                    style={
                        {
                            color: run.color,
                            fontWeight: run.fontWeight,
                            fontSize: `${size * (base.scale / 100) * (run.scale / 100)}px`,
                            textShadow: cssTextShadow(
                                run.color,
                                run.shadowKey ?? base.shadowKey,
                            ),
                            "--mobile-run-size": `${channelLayout.preview.mobileFontSizes[key] * (base.scale / 100) * (run.scale / 100)}cqw`,
                            "--mobile-music-size": `${size * (base.scale / 100) * 1.05}px`,
                            "--proportional-mobile-music-size": `${channelLayout.preview.mobileFontSizes[key] * (base.scale / 100) * 1.05}cqw`,
                            ...(isRecommendedYoutubeNote
                                ? {
                                      position: "relative",
                                      top: "-0.06em",
                                  }
                                : {}),
                        } as CSSProperties
                    }
                >
                    {char}
                </span>
            );
        });
    };

    const previewButtonClass = (key: TextKey, extra = "") => {
        const movable = isMovableTextKey(key);
        const selected = movable && selectedPreviewText === key;
        const canDrag = editorTab === "style" && movable;

        return `${extra} ${selected && canDrag ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"} ${canDrag ? "touch-none select-none" : ""} ${selected ? "rounded-[2px] outline outline-2 outline-[#1677FF] outline-offset-2" : ""}`;
    };

    const renderHistoryControls = (className: string) => (
        <div className={className} aria-label="편집 기록">
            <button
                type="button"
                onClick={undoHistory}
                disabled={!historyAvailability.canUndo}
                aria-label="되돌리기"
                title="되돌리기"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#4E5968] outline-none transition hover:bg-[#F4F5F6] focus-visible:ring-2 focus-visible:ring-[#8B95A1]/35 disabled:cursor-not-allowed disabled:text-[#C7CCD2] disabled:hover:bg-transparent sm:h-8 sm:w-8"
            >
                <svg
                    viewBox="0 0 24 24"
                    className="h-[18px] w-[18px]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <path d="M9 7 4.5 11.5 9 16" />
                    <path d="M5 11.5h7.5a6 6 0 0 1 6 6" />
                </svg>
            </button>
            <button
                type="button"
                onClick={redoHistory}
                disabled={!historyAvailability.canRedo}
                aria-label="다시 실행"
                title="다시 실행"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#4E5968] outline-none transition hover:bg-[#F4F5F6] focus-visible:ring-2 focus-visible:ring-[#8B95A1]/35 disabled:cursor-not-allowed disabled:text-[#C7CCD2] disabled:hover:bg-transparent sm:h-8 sm:w-8"
            >
                <svg
                    viewBox="0 0 24 24"
                    className="h-[18px] w-[18px]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <path d="m15 7 4.5 4.5L15 16" />
                    <path d="M19 11.5h-7.5a6 6 0 0 0-6 6" />
                </svg>
            </button>
        </div>
    );

    return (
        <main className="min-h-screen bg-[#F7F8FA] text-[#171B22]">
            <style>{`
                .canonical-scale-preview .preview-organizer-placeholder,
                .channel-preset-preview .preview-organizer-placeholder { --mobile-preview-base-size: var(--mobile-preview-organizer-size); font-size: var(--mobile-preview-base-size) !important; }
                .canonical-scale-preview .preview-organizer-text,
                .channel-preset-preview .preview-organizer-text { --mobile-preview-base-size: var(--mobile-preview-organizer-text-size); font-size: var(--mobile-preview-base-size) !important; }
                .canonical-scale-preview .preview-title-placeholder,
                .channel-preset-preview .preview-title-placeholder { --mobile-preview-base-size: var(--mobile-preview-title-size); font-size: var(--mobile-preview-base-size) !important; }
                .canonical-scale-preview .preview-title-text,
                .channel-preset-preview .preview-title-text { --mobile-preview-base-size: var(--mobile-preview-title-text-size); font-size: var(--mobile-preview-base-size) !important; }
                .canonical-scale-preview .preview-date-placeholder,
                .channel-preset-preview .preview-date-placeholder { --mobile-preview-base-size: var(--mobile-preview-date-size); font-size: var(--mobile-preview-base-size) !important; }
                .canonical-scale-preview .preview-date-text,
                .channel-preset-preview .preview-date-text { --mobile-preview-base-size: var(--mobile-preview-date-text-size); font-size: var(--mobile-preview-base-size) !important; }
                .canonical-scale-preview .preview-place-placeholder,
                .channel-preset-preview .preview-place-placeholder { --mobile-preview-base-size: var(--mobile-preview-place-size); font-size: var(--mobile-preview-base-size) !important; }
                .canonical-scale-preview .preview-place-text,
                .channel-preset-preview .preview-place-text { --mobile-preview-base-size: var(--mobile-preview-place-text-size); font-size: var(--mobile-preview-base-size) !important; }
                .canonical-scale-preview .preview-description-placeholder,
                .channel-preset-preview .preview-description-placeholder { --mobile-preview-base-size: var(--mobile-preview-description-size); font-size: var(--mobile-preview-base-size) !important; }
                .canonical-scale-preview .preview-description-text,
                .channel-preset-preview .preview-description-text { --mobile-preview-base-size: var(--mobile-preview-description-text-size); font-size: var(--mobile-preview-base-size) !important; }
                .canonical-scale-preview .preview-application-text,
                .channel-preset-preview .preview-application-text { --mobile-preview-base-size: var(--mobile-preview-application-text-size); font-size: var(--mobile-preview-base-size) !important; }
                .canonical-scale-preview .preview-rich-run,
                .channel-preset-preview .preview-rich-run { font-size: var(--mobile-run-size) !important; }
                .canonical-scale-preview .mobile-music-emphasis,
                .channel-preset-preview .mobile-music-emphasis { font-size: var(--proportional-mobile-music-size) !important; }
                .canonical-scale-preview .preview-title-row { margin-top: 1.453488cqw !important; }
                .canonical-scale-preview .preview-date-row { margin-top: 3.875969cqw !important; }
                .canonical-scale-preview .preview-place-row { margin-top: 0.968992cqw !important; }
                .canonical-scale-preview .preview-description-row { margin-top: 1.937984cqw !important; }
                .story-preview .preview-title-row { margin-top: 2.153317cqw !important; }
                .story-preview .preview-date-row { margin-top: 5.167959cqw !important; }
                .story-preview .preview-place-row { margin-top: 1.291990cqw !important; }
                .story-preview .preview-description-row { margin-top: 3.229974cqw !important; }
                @media (max-width: 639px) {
                    .mobile-title { font-size: 24px !important; }
                    .kakao-preview { left: 50%; width: calc(100% + 32px) !important; max-width: calc(100vw - 24px) !important; transform: translateX(-50%); }
                    .mobile-music-emphasis { font-size: var(--mobile-music-size) !important; }
                    .proportional-mobile-preview .preview-organizer-placeholder { --mobile-preview-base-size: var(--mobile-preview-organizer-size); font-size: var(--mobile-preview-base-size) !important; }
                    .proportional-mobile-preview .preview-organizer-text { --mobile-preview-base-size: var(--mobile-preview-organizer-text-size); font-size: var(--mobile-preview-base-size) !important; }
                    .proportional-mobile-preview .preview-title-placeholder { --mobile-preview-base-size: var(--mobile-preview-title-size); font-size: var(--mobile-preview-base-size) !important; }
                    .proportional-mobile-preview .preview-title-text { --mobile-preview-base-size: var(--mobile-preview-title-text-size); font-size: var(--mobile-preview-base-size) !important; }
                    .proportional-mobile-preview .preview-date-placeholder { --mobile-preview-base-size: var(--mobile-preview-date-size); font-size: var(--mobile-preview-base-size) !important; }
                    .proportional-mobile-preview .preview-date-text { --mobile-preview-base-size: var(--mobile-preview-date-text-size); font-size: var(--mobile-preview-base-size) !important; }
                    .proportional-mobile-preview .preview-place-placeholder { --mobile-preview-base-size: var(--mobile-preview-place-size); font-size: var(--mobile-preview-base-size) !important; }
                    .proportional-mobile-preview .preview-place-text { --mobile-preview-base-size: var(--mobile-preview-place-text-size); font-size: var(--mobile-preview-base-size) !important; }
                    .proportional-mobile-preview .preview-description-placeholder { --mobile-preview-base-size: var(--mobile-preview-description-size); font-size: var(--mobile-preview-base-size) !important; }
                    .proportional-mobile-preview .preview-description-text { --mobile-preview-base-size: var(--mobile-preview-description-text-size); font-size: var(--mobile-preview-base-size) !important; }
                    .proportional-mobile-preview .preview-application-text { --mobile-preview-base-size: var(--mobile-preview-application-text-size); font-size: var(--mobile-preview-base-size) !important; }
                    .proportional-mobile-preview .preview-rich-run { font-size: var(--mobile-run-size) !important; }
                    .proportional-mobile-preview .mobile-music-emphasis { font-size: var(--proportional-mobile-music-size) !important; }
                    .proportional-mobile-preview .preview-title-row { margin-top: 1.25cqw !important; }
                    .proportional-mobile-preview .preview-date-row { margin-top: 3.333333cqw !important; }
                    .kakao-preview .preview-date-row { margin-top: 4.583333cqw !important; }
                    .proportional-mobile-preview .preview-place-row { margin-top: 0.833333cqw !important; }
                    .proportional-mobile-preview .preview-description-row { margin-top: 1.666667cqw !important; }
                }
                .instagram-preview.proportional-mobile-preview .preview-organizer-placeholder { font-size: var(--mobile-preview-organizer-size) !important; }
                .instagram-preview.proportional-mobile-preview .preview-organizer-text { font-size: var(--mobile-preview-organizer-text-size) !important; }
                .instagram-preview.proportional-mobile-preview .preview-title-placeholder { font-size: var(--mobile-preview-title-size) !important; }
                .instagram-preview.proportional-mobile-preview .preview-title-text { font-size: var(--mobile-preview-title-text-size) !important; }
                .instagram-preview.proportional-mobile-preview .preview-date-placeholder { font-size: var(--mobile-preview-date-size) !important; }
                .instagram-preview.proportional-mobile-preview .preview-date-text { font-size: var(--mobile-preview-date-text-size) !important; }
                .instagram-preview.proportional-mobile-preview .preview-place-placeholder { font-size: var(--mobile-preview-place-size) !important; }
                .instagram-preview.proportional-mobile-preview .preview-place-text { font-size: var(--mobile-preview-place-text-size) !important; }
                .instagram-preview.proportional-mobile-preview .preview-description-placeholder { font-size: var(--mobile-preview-description-size) !important; }
                .instagram-preview.proportional-mobile-preview .preview-description-text { font-size: var(--mobile-preview-description-text-size) !important; }
                .instagram-preview.proportional-mobile-preview .preview-application-text { font-size: var(--mobile-preview-application-text-size) !important; }
                .instagram-preview.proportional-mobile-preview .preview-rich-run { font-size: var(--mobile-run-size) !important; }
                .instagram-preview.proportional-mobile-preview .mobile-music-emphasis { font-size: var(--proportional-mobile-music-size) !important; }
                .instagram-preview.proportional-mobile-preview .preview-title-row { margin-top: 1.453488cqw !important; }
                .instagram-preview.proportional-mobile-preview .preview-date-row { margin-top: 3.875969cqw !important; }
                .instagram-preview.proportional-mobile-preview .preview-place-row { margin-top: 0.968992cqw !important; }
                .instagram-preview.proportional-mobile-preview .preview-description-row { margin-top: 1.937984cqw !important; }
                .canonical-scale-preview .preview-organizer-placeholder { font-size: var(--mobile-preview-organizer-size) !important; }
                .canonical-scale-preview .preview-organizer-text { font-size: var(--mobile-preview-organizer-text-size) !important; }
                .canonical-scale-preview .preview-title-placeholder { font-size: var(--mobile-preview-title-size) !important; }
                .canonical-scale-preview .preview-title-text { font-size: var(--mobile-preview-title-text-size) !important; }
                .canonical-scale-preview .preview-date-placeholder { font-size: var(--mobile-preview-date-size) !important; }
                .canonical-scale-preview .preview-date-text { font-size: var(--mobile-preview-date-text-size) !important; }
                .canonical-scale-preview .preview-place-placeholder { font-size: var(--mobile-preview-place-size) !important; }
                .canonical-scale-preview .preview-place-text { font-size: var(--mobile-preview-place-text-size) !important; }
                .canonical-scale-preview .preview-description-placeholder { font-size: var(--mobile-preview-description-size) !important; }
                .canonical-scale-preview .preview-description-text { font-size: var(--mobile-preview-description-text-size) !important; }
                .canonical-scale-preview .preview-application-text { font-size: var(--mobile-preview-application-text-size) !important; }
                .canonical-scale-preview .preview-rich-run { font-size: var(--mobile-run-size) !important; }
                .canonical-scale-preview .mobile-music-emphasis { font-size: var(--proportional-mobile-music-size) !important; }
                .canonical-scale-preview .preview-title-row { margin-top: 1.453488cqw !important; }
                .canonical-scale-preview .preview-date-row { margin-top: 3.875969cqw !important; }
                .canonical-scale-preview .preview-place-row { margin-top: 0.968992cqw !important; }
                .canonical-scale-preview .preview-description-row { margin-top: 1.937984cqw !important; }
                .story-preview .preview-title-row { margin-top: 2.153317cqw !important; }
                .story-preview .preview-date-row { margin-top: 5.167959cqw !important; }
                .story-preview .preview-place-row { margin-top: 1.291990cqw !important; }
                .story-preview .preview-description-row { margin-top: 3.229974cqw !important; }
                .channel-preset-preview .preview-organizer-placeholder { --mobile-preview-base-size: var(--mobile-preview-organizer-size); font-size: var(--mobile-preview-base-size) !important; }
                .channel-preset-preview .preview-organizer-text { --mobile-preview-base-size: var(--mobile-preview-organizer-text-size); font-size: var(--mobile-preview-base-size) !important; }
                .channel-preset-preview .preview-title-placeholder { --mobile-preview-base-size: var(--mobile-preview-title-size); font-size: var(--mobile-preview-base-size) !important; }
                .channel-preset-preview .preview-title-text { --mobile-preview-base-size: var(--mobile-preview-title-text-size); font-size: var(--mobile-preview-base-size) !important; }
                .channel-preset-preview .preview-date-placeholder { --mobile-preview-base-size: var(--mobile-preview-date-size); font-size: var(--mobile-preview-base-size) !important; }
                .channel-preset-preview .preview-date-text { --mobile-preview-base-size: var(--mobile-preview-date-text-size); font-size: var(--mobile-preview-base-size) !important; }
                .channel-preset-preview .preview-place-placeholder { --mobile-preview-base-size: var(--mobile-preview-place-size); font-size: var(--mobile-preview-base-size) !important; }
                .channel-preset-preview .preview-place-text { --mobile-preview-base-size: var(--mobile-preview-place-text-size); font-size: var(--mobile-preview-base-size) !important; }
                .channel-preset-preview .preview-description-placeholder { --mobile-preview-base-size: var(--mobile-preview-description-size); font-size: var(--mobile-preview-base-size) !important; }
                .channel-preset-preview .preview-description-text { --mobile-preview-base-size: var(--mobile-preview-description-text-size); font-size: var(--mobile-preview-base-size) !important; }
                .channel-preset-preview .preview-application-text { --mobile-preview-base-size: var(--mobile-preview-application-text-size); font-size: var(--mobile-preview-base-size) !important; }
                .channel-preset-preview .preview-rich-run { font-size: var(--mobile-run-size) !important; }
                .channel-preset-preview .mobile-music-emphasis { font-size: var(--proportional-mobile-music-size) !important; }
            `}</style>

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
                                    changeChannel(event.target.value as ChannelKey)
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
                            <div className="mb-3 flex items-center justify-between gap-3 sm:block">
                                <p className="min-w-0 text-left text-xs text-[#7A818D] sm:text-center">
                                    {channels[channel].label} · {channels[channel].size}px
                                </p>
                                {editorTab !== "image" &&
                                    renderHistoryControls(
                                        "flex shrink-0 items-center gap-1 sm:hidden",
                                    )}
                            </div>
                            <div
                                ref={previewFrameRef}
                                onPointerDown={handlePreviewPointerDown}
                                onPointerMove={handlePreviewPointerMove}
                                onPointerUp={handlePreviewPointerUp}
                                onPointerCancel={handlePreviewPointerCancel}
                                className={`relative mx-auto w-full max-w-[480px] overflow-hidden rounded-[24px] bg-[#E8ECEF] shadow-[0_16px_38px_rgba(25,31,40,0.14)] ${channelLayout.preview.aspectClass} ${channel === "instagram" ? "instagram-preview" : ""} ${channel === "kakao" ? "kakao-preview" : ""} ${channel === "story" ? "story-preview" : ""} ${channel === "story" || channel === "share" || channel === "a4" ? "canonical-scale-preview" : ""} ${channelLayout.preview.mobileScaleMode === "proportional" ? "proportional-mobile-preview" : ""} ${channelLayout.posterLayout ? "channel-preset-preview" : ""} ${lineDraftVariant ? "cursor-crosshair" : ""}`}
                                style={mobilePreviewStyle}
                            >
                                {shouldRenderContainedImage ? (
                                    <>
                                        <img
                                            src={imageSrc}
                                            alt=""
                                            aria-hidden="true"
                                            className={
                                                usesSharedStoryContainBackground
                                                    ? "absolute inset-0 h-full w-full object-cover"
                                                    : "absolute -inset-[6%] h-[112%] w-[112%] scale-110 object-cover blur-xl"
                                            }
                                            style={
                                                usesSharedStoryContainBackground
                                                    ? previewContainBackgroundImageStyle
                                                    : previewCoverImageStyle
                                            }
                                        />
                                        <span
                                            className={
                                                usesSharedStoryContainBackground
                                                    ? "absolute inset-0"
                                                    : "absolute inset-0 bg-[#171B22]/20"
                                            }
                                            style={
                                                usesSharedStoryContainBackground
                                                    ? previewContainBackgroundOverlayStyle
                                                    : undefined
                                            }
                                        />
                                        <img
                                            src={imageSrc}
                                            alt="웹전단 대표 이미지"
                                            className={
                                                usesSharedStoryContainBackground
                                                    ? "absolute left-1/2 top-1/2 h-auto max-h-full w-auto max-w-full -translate-x-1/2 -translate-y-1/2"
                                                    : "absolute inset-0 h-full w-full object-contain"
                                            }
                                            style={
                                                usesSharedStoryContainBackground
                                                    ? previewStoryContainForegroundStyle
                                                    : undefined
                                            }
                                        />
                                    </>
                                ) : (
                                    <img
                                        src={imageSrc}
                                        alt="웹전단 대표 이미지"
                                        className="absolute inset-0 h-full w-full object-cover"
                                        style={previewCoverImageStyle}
                                    />
                                )}

                                {customLines.map((line) => {
                                    const selected = selectedLineId === line.id;
                                    const canArrange = editorTab === "style" && !lineDraftVariant;
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
                                            className={`absolute z-[1] bg-transparent outline-none ${lineDraftVariant ? "pointer-events-none" : ""} ${canArrange ? "cursor-grab touch-none active:cursor-grabbing" : "cursor-pointer"} ${selected ? "rounded-sm outline outline-2 outline-[#1677FF] outline-offset-1" : ""}`}
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

                                <div
                                    ref={textSafeAreaRef}
                                    className="pointer-events-none absolute"
                                    style={{
                                        left: `${activeTextSafeArea.left * 100}%`,
                                        right: `${(1 - activeTextSafeArea.right) * 100}%`,
                                        top: `${activeTextSafeArea.top * 100}%`,
                                        bottom: `${(1 - activeTextSafeArea.bottom) * 100}%`,
                                        containerType: "size",
                                    }}
                                >
                                    <div
                                        className="preview-organizer-row relative"
                                        style={previewRowStyle("organizer")}
                                    >
                                        <span
                                            aria-hidden="true"
                                            className="preview-organizer-placeholder invisible inline-flex items-center"
                                            style={initialTextStyle(
                                                "organizer",
                                                previewTextBaseSize("organizer", 15),
                                            )}
                                        >
                                            {DEFAULT_ORGANIZER}
                                        </span>
                                        <button
                                            type="button"
                                            hidden={!visibleFields.organizer}
                                            {...movableTextInteractionProps("organizer")}
                                            className={previewButtonClass(
                                                "organizer",
                                                "pointer-events-auto absolute left-0 top-0 block max-w-full text-left",
                                            )}
                                            style={{
                                                ...textPositionStyle("organizer"),
                                                ...userTextAvailableWidthStyle("organizer"),
                                            }}
                                            aria-label="사찰 기관명 편집"
                                        >
                                            <span
                                                ref={(node) => {
                                                    textBlockRefs.current.organizer = node;
                                                }}
                                                className="preview-organizer-text flex max-w-full items-start gap-[0.35em] whitespace-pre-wrap break-words"
                                                style={textStyle(
                                                    "organizer",
                                                    previewTextBaseSize("organizer", 15),
                                                )}
                                            >
                                                <PictogramIcon
                                                    icon={resolvedTextIcon("organizer")}
                                                    className="mt-[0.08em] h-[1em] w-[1em] shrink-0"
                                                />
                                                <span className="min-w-0 whitespace-pre-wrap break-words">
                                                    {renderTextCharacters("organizer", organizer, 15)}
                                                </span>
                                            </span>
                                        </button>
                                    </div>
                                    <div
                                        className="preview-title-row relative mt-1.5"
                                        style={previewRowStyle("title")}
                                    >
                                        <span
                                            aria-hidden="true"
                                            className="mobile-title preview-title-placeholder invisible flex max-w-full leading-[1.1] tracking-[-0.05em]"
                                            style={{
                                                ...initialTextStyle(
                                                    "title",
                                                    channelLayout.preview.titleSize,
                                                ),
                                                ...previewKakaoTextAreaStyle("title"),
                                            }}
                                        >
                                            <span className="min-w-0 whitespace-pre-wrap break-words">
                                                ♫ 연꽃 피는 산사
                                                {channel === "kakao" ||
                                                channel === "instagram"
                                                    ? "\n"
                                                    : " "}
                                                <span
                                                    className="mobile-music-emphasis"
                                                    style={
                                                        {
                                                            color: INITIAL_TITLE_RUNS[0].color,
                                                            fontWeight: INITIAL_TITLE_RUNS[0].fontWeight,
                                                            fontSize: `${channelLayout.preview.titleSize * 1.45}px`,
                                                            "--mobile-music-size": `${channelLayout.preview.titleSize * 1.05}px`,
                                                            "--proportional-mobile-music-size": `${channelLayout.preview.mobileFontSizes.title * 1.05}cqw`,
                                                        } as CSSProperties
                                                    }
                                                >
                                                    음악회
                                                </span>
                                            </span>
                                        </span>
                                        <button
                                            type="button"
                                            hidden={!visibleFields.title}
                                            {...movableTextInteractionProps("title")}
                                            className={previewButtonClass(
                                                "title",
                                                "pointer-events-auto absolute left-0 top-0 block max-w-full text-left",
                                            )}
                                            style={{
                                                ...previewKakaoTextAreaStyle("title"),
                                                ...textPositionStyle("title"),
                                                ...userTextAvailableWidthStyle("title"),
                                            }}
                                            aria-label="행사명 편집"
                                        >
                                            <span
                                                ref={(node) => {
                                                    textBlockRefs.current.title = node;
                                                }}
                                                className="mobile-title preview-title-text flex max-w-full items-start gap-[0.35em] leading-[1.1] tracking-[-0.05em]"
                                                style={textStyle(
                                                    "title",
                                                    channelLayout.preview.titleSize,
                                                )}
                                            >
                                                <PictogramIcon
                                                    icon={resolvedTextIcon("title")}
                                                    className="mt-[0.08em] h-[1em] w-[1em] shrink-0"
                                                />
                                                <span
                                                    className="min-w-0 whitespace-pre-wrap break-words"
                                                    style={previewLineClampStyle(
                                                        usesRecommendedTextLayout("title")
                                                            ? channelLayout.posterLayout
                                                                  ?.titleMaxLines
                                                            : undefined,
                                                    )}
                                                >
                                                    {renderTextCharacters(
                                                        "title",
                                                        renderedTitle,
                                                        channelLayout.preview.titleSize,
                                                    )}
                                                </span>
                                            </span>
                                        </button>
                                    </div>
                                    <div
                                        className="preview-date-row relative mt-4"
                                        style={previewRowStyle("date")}
                                    >
                                        <span
                                            aria-hidden="true"
                                            className="preview-date-placeholder invisible inline-flex items-center"
                                            style={initialTextStyle(
                                                "date",
                                                previewTextBaseSize("date", 15),
                                            )}
                                        >
                                            {DEFAULT_DATE}
                                        </span>
                                        <button
                                            type="button"
                                            hidden={!visibleFields.date}
                                            {...movableTextInteractionProps("date")}
                                            className={previewButtonClass(
                                                "date",
                                                "pointer-events-auto absolute left-0 top-0 block max-w-full text-left",
                                            )}
                                            style={{
                                                ...textPositionStyle("date"),
                                                ...userTextAvailableWidthStyle("date"),
                                            }}
                                            aria-label="일시 편집"
                                        >
                                            <span
                                                ref={(node) => {
                                                    textBlockRefs.current.date = node;
                                                }}
                                                className="preview-date-text flex max-w-full items-start gap-[0.35em] whitespace-pre-wrap break-words"
                                                style={textStyle(
                                                    "date",
                                                    previewTextBaseSize("date", 15),
                                                )}
                                            >
                                                <PictogramIcon
                                                    icon={resolvedTextIcon("date")}
                                                    className="mt-[0.08em] h-[1em] w-[1em] shrink-0"
                                                />
                                                <span className="min-w-0 whitespace-pre-wrap break-words">
                                                    {renderTextCharacters("date", date, 15)}
                                                </span>
                                            </span>
                                        </button>
                                    </div>
                                    <div
                                        className="preview-place-row relative mt-1"
                                        style={previewRowStyle("place")}
                                    >
                                        <span
                                            aria-hidden="true"
                                            className="preview-place-placeholder invisible inline-flex items-center gap-[0.35em]"
                                            style={initialTextStyle(
                                                "place",
                                                previewTextBaseSize("place", 14),
                                            )}
                                        >
                                            <span className="inline-flex w-[1.05em] items-center justify-center align-[-0.12em]">
                                                <PictogramIcon icon="pin" />
                                            </span>
                                            연화사 앞마당
                                        </span>
                                        <button
                                            type="button"
                                            hidden={!visibleFields.place}
                                            {...movableTextInteractionProps("place")}
                                            className={previewButtonClass(
                                                "place",
                                                "pointer-events-auto absolute left-0 top-0 block max-w-full text-left",
                                            )}
                                            style={{
                                                ...textPositionStyle("place"),
                                                ...userTextAvailableWidthStyle("place"),
                                            }}
                                            aria-label="장소 편집"
                                        >
                                            <span
                                                ref={(node) => {
                                                    textBlockRefs.current.place = node;
                                                }}
                                                className="preview-place-text flex max-w-full items-start gap-[0.35em] whitespace-pre-wrap break-words"
                                                style={textStyle(
                                                    "place",
                                                    previewTextBaseSize("place", 14),
                                                )}
                                            >
                                                <PictogramIcon
                                                    icon={resolvedTextIcon("place")}
                                                    className="mt-[0.08em] h-[1em] w-[1em] shrink-0"
                                                />
                                                <span className="min-w-0 whitespace-pre-wrap break-words">
                                                    {renderTextCharacters("place", place, 14)}
                                                </span>
                                            </span>
                                        </button>
                                    </div>
                                    <div
                                        className={`preview-description-row relative mt-2 ${channel === "instagram" && usesRecommendedDescriptionLayout ? "instagram-recommended-description-row" : ""}`}
                                        style={previewRowStyle("description")}
                                    >
                                        <span
                                            aria-hidden="true"
                                            className={`preview-description-placeholder invisible flex max-w-full items-start gap-[0.35em] whitespace-pre-wrap break-words leading-[1.55] ${channel === "instagram" && usesRecommendedDescriptionLayout ? "instagram-recommended-description-text" : ""}`}
                                            style={{
                                                ...(usesRecommendedDescriptionLayout
                                                    ? initialTextStyle(
                                                          "description",
                                                          previewTextBaseSize(
                                                              "description",
                                                              14,
                                                          ),
                                                      )
                                                    : textStyle(
                                                          "description",
                                                          previewTextBaseSize(
                                                              "description",
                                                              14,
                                                          ),
                                                      )),
                                                ...userTextAvailableWidthStyle(
                                                    "description",
                                                ),
                                                ...(descriptionUserViewport
                                                    ? {
                                                          maxHeight:
                                                              descriptionUserViewport.maxHeight,
                                                          overflow: "hidden",
                                                      }
                                                    : {}),
                                            }}
                                        >
                                            <PictogramIcon
                                                icon={resolvedTextIcon("description")}
                                                className="mt-[0.2em] h-[1em] w-[1em] shrink-0"
                                            />
                                            <span
                                                className={`min-w-0 whitespace-pre-wrap break-words ${channel === "instagram" && usesRecommendedDescriptionLayout ? "instagram-recommended-description-copy" : ""}`}
                                            >
                                                {usesRecommendedDescriptionLayout
                                                    ? defaultDescriptionByChannel[channel]
                                                    : renderTextCharacters(
                                                          "description",
                                                          description,
                                                          14,
                                                      )}
                                            </span>
                                        </span>
                                        <button
                                            type="button"
                                            hidden={!visibleFields.description}
                                            {...movableTextInteractionProps("description")}
                                            className={previewButtonClass(
                                                "description",
                                                "pointer-events-auto absolute left-0 top-0 block max-w-full text-left",
                                            )}
                                            style={{
                                                ...previewKakaoTextAreaStyle("description"),
                                                ...textPositionStyle("description"),
                                                ...userTextAvailableWidthStyle("description"),
                                            }}
                                            aria-label="행사 내용 편집"
                                        >
                                            <span
                                                ref={(node) => {
                                                    textBlockRefs.current.description = node;
                                                }}
                                                className={`preview-description-text flex max-w-full items-start gap-[0.35em] whitespace-pre-wrap break-words leading-[1.55] ${channel === "instagram" && usesRecommendedDescriptionLayout ? "instagram-recommended-description-text" : ""}`}
                                                style={{
                                                    ...textStyle("description", 14),
                                                    ...(descriptionUserViewport
                                                        ? {
                                                              maxHeight:
                                                                  descriptionUserViewport.maxHeight,
                                                              overflow: "hidden",
                                                          }
                                                        : {}),
                                                }}
                                            >
                                                <PictogramIcon
                                                    icon={resolvedTextIcon("description")}
                                                    className="mt-[0.2em] h-[1em] w-[1em] shrink-0"
                                                />
                                                <span
                                                    className={`min-w-0 whitespace-pre-wrap break-words ${channel === "instagram" && usesRecommendedDescriptionLayout ? "instagram-recommended-description-copy" : ""}`}
                                                >
                                                    {renderTextCharacters(
                                                        "description",
                                                        description,
                                                        14,
                                                    )}
                                                </span>
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                <div
                                    ref={footerTextSafeAreaRef}
                                    className="pointer-events-none absolute"
                                    style={{
                                        left: `${FOOTER_TEXT_SAFE_AREA.left * 100}%`,
                                        right: `${(1 - FOOTER_TEXT_SAFE_AREA.right) * 100}%`,
                                        top: `${FOOTER_TEXT_SAFE_AREA.top * 100}%`,
                                        bottom: `${(1 - FOOTER_TEXT_SAFE_AREA.bottom) * 100}%`,
                                    }}
                                    aria-hidden="true"
                                />

                                {channelLayout.defaultDividerVisible && (
                                    <button
                                        type="button"
                                        onClick={selectDivider}
                                        onPointerDown={startDividerInteraction}
                                        className={`absolute h-4 -translate-y-1/2 ${editorTab === "style" ? "cursor-grab touch-none active:cursor-grabbing" : "cursor-pointer"} ${isDividerPreviewSelected ? "rounded-sm outline outline-2 outline-[#1677FF] outline-offset-1" : ""} ${editorTab === "style" && !dividerStyle.visible ? "border border-dashed border-[#AAB0B8]/60" : ""}`}
                                        style={{
                                            left: `${(SAFE_AREA.left + dividerPosition.x) * 100}%`,
                                            width: `${(SAFE_AREA.right - SAFE_AREA.left) * 100}%`,
                                            top: `${(DIVIDER_BASE_Y + dividerPosition.y) * 100}%`,
                                        }}
                                        aria-label="구분선 편집"
                                        aria-pressed={isDividerPreviewSelected}
                                    >
                                        {dividerStyle.visible && (
                                            <span
                                                className="absolute inset-x-0 top-1/2 block -translate-y-1/2"
                                                style={{
                                                    borderTop: `${(dividerStyle.width / 1080) * 100}cqw ${dividerStyle.variant === "dashed" ? "dashed" : "solid"} ${dividerStyle.color}`,
                                                }}
                                            />
                                        )}
                                    </button>
                                )}

                                <button
                                    type="button"
                                    hidden={!visibleFields.application}
                                    {...movableTextInteractionProps("application")}
                                    className={previewButtonClass(
                                        "application",
                                        "absolute left-[7%] bottom-[5%] max-w-[86%] text-left",
                                    )}
                                    style={{
                                        ...textPositionStyle("application"),
                                        ...userTextAvailableWidthStyle("application"),
                                    }}
                                    aria-label="신청 문의 편집"
                                >
                                    <span
                                        ref={(node) => {
                                            textBlockRefs.current.application = node;
                                        }}
                                        className="preview-application-text flex max-w-full items-start gap-[0.35em] whitespace-pre-wrap break-words"
                                        style={textStyle(
                                            "application",
                                            previewTextBaseSize("application", 14),
                                        )}
                                    >
                                        <PictogramIcon
                                            icon={resolvedTextIcon("application")}
                                            className="mt-[0.08em] h-[1em] w-[1em] shrink-0"
                                        />
                                        <span className="min-w-0 whitespace-pre-wrap break-words">
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
                            <div className="sticky top-0 z-20 border-b border-[#E7E9EC] bg-white/95 backdrop-blur-sm">
                                <div className="flex min-w-0 sm:mr-[68px]">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.key}
                                            type="button"
                                            onClick={() => setEditorTab(tab.key)}
                                            className={`relative min-w-[52px] flex-1 whitespace-nowrap px-2 pb-3 text-sm transition sm:flex-none sm:px-6 ${editorTab === tab.key ? "font-semibold text-[#171B22]" : "font-medium text-[#8B95A1] hover:text-[#4E5968]"}`}
                                        >
                                            {tab.label}
                                            {editorTab === tab.key && (
                                                <span className="absolute inset-x-2 -bottom-px h-0.5 bg-[#F4F54A] sm:inset-x-5" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                                {editorTab !== "image" &&
                                    renderHistoryControls(
                                        "absolute right-0 top-1/2 hidden -translate-y-1/2 items-center gap-1 sm:flex",
                                    )}
                            </div>

                            {editorTab === "content" && (
                                <div className="pt-6">
                                    <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2">
                                        <div
                                            hidden={!visibleFields.title}
                                            className="text-sm font-medium sm:col-span-2"
                                        >
                                            <label htmlFor="promote-title">행사명</label>
                                            <div className="flex items-start gap-2">
                                                <textarea
                                                    id="promote-title"
                                                    onFocus={() => setActiveContentText("title")}
                                                    onBlur={finishTextHistoryGroup}
                                                    value={title}
                                                    onChange={(event) =>
                                                        updateTextValuePreservingRuns(
                                                            "title",
                                                            event.target.value,
                                                        )
                                                    }
                                                    rows={1}
                                                    className={`${fieldClass} min-h-[46px] resize-y leading-6`}
                                                />
                                                <PictogramPicker
                                                    targetLabel={textLabels[activeContentText]}
                                                    onSelect={(symbol) =>
                                                        insertPictogram(activeContentText, symbol)
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div
                                            hidden={!visibleFields.organizer}
                                            className="text-sm font-medium"
                                        >
                                            <label htmlFor="promote-organizer">사찰·기관명</label>
                                            <div className="flex items-start gap-2">
                                                <textarea
                                                    id="promote-organizer"
                                                    onFocus={() => setActiveContentText("organizer")}
                                                    onBlur={finishTextHistoryGroup}
                                                    value={organizer}
                                                    onChange={(event) =>
                                                        updateTextValuePreservingRuns(
                                                            "organizer",
                                                            event.target.value,
                                                        )
                                                    }
                                                    rows={1}
                                                    className={`${fieldClass} min-h-[46px] resize-y leading-6`}
                                                />
                                            </div>
                                        </div>
                                        <div
                                            hidden={!visibleFields.date}
                                            className="text-sm font-medium"
                                        >
                                            <label htmlFor="promote-date">일시</label>
                                            <div className="flex items-start gap-2">
                                                <textarea
                                                    id="promote-date"
                                                    onFocus={() => setActiveContentText("date")}
                                                    onBlur={finishTextHistoryGroup}
                                                    value={date}
                                                    onChange={(event) =>
                                                        updateTextValuePreservingRuns(
                                                            "date",
                                                            event.target.value,
                                                        )
                                                    }
                                                    rows={1}
                                                    className={`${fieldClass} min-h-[46px] resize-y leading-6`}
                                                />
                                            </div>
                                        </div>
                                        <div
                                            hidden={!visibleFields.place}
                                            className="text-sm font-medium"
                                        >
                                            <label htmlFor="promote-place">장소</label>
                                            <div className="flex items-start gap-2">
                                                <textarea
                                                    id="promote-place"
                                                    onFocus={() => setActiveContentText("place")}
                                                    onBlur={finishTextHistoryGroup}
                                                    value={place}
                                                    onChange={(event) =>
                                                        updateTextValuePreservingRuns(
                                                            "place",
                                                            event.target.value,
                                                        )
                                                    }
                                                    rows={1}
                                                    className={`${fieldClass} min-h-[46px] resize-y leading-6`}
                                                />
                                            </div>
                                        </div>
                                        <div
                                            hidden={!visibleFields.application}
                                            className="text-sm font-medium"
                                        >
                                            <label htmlFor="promote-application">신청·문의</label>
                                            <div className="flex items-start gap-2">
                                                <textarea
                                                    id="promote-application"
                                                    onFocus={() => setActiveContentText("application")}
                                                    onBlur={finishTextHistoryGroup}
                                                    value={application}
                                                    onChange={(event) =>
                                                        updateTextValuePreservingRuns(
                                                            "application",
                                                            event.target.value,
                                                        )
                                                    }
                                                    rows={1}
                                                    className={`${fieldClass} min-h-[46px] resize-y leading-6`}
                                                />
                                            </div>
                                        </div>
                                        <div
                                            hidden={!visibleFields.description}
                                            className="text-sm font-medium sm:col-span-2"
                                        >
                                            <label htmlFor="promote-description">
                                                {channelLayout.descriptionMode === "compact"
                                                    ? "짧은 내용"
                                                    : "행사 내용"}
                                            </label>
                                            <div className="flex items-start gap-2">
                                                <textarea
                                                    id="promote-description"
                                                    onFocus={() => setActiveContentText("description")}
                                                    onBlur={finishTextHistoryGroup}
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
                                            {channelLayout.descriptionMode === "compact" &&
                                                channel !== "kakao" && (
                                                <p className="mt-1 text-xs font-normal leading-5 text-[#8B95A1]">
                                                    게시 이미지에는 최대 2줄 정도로 표시돼요.
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-6 flex flex-wrap items-center gap-2.5 border-t border-[#E7E9EC] pt-5">
                                        <div className="relative">
                                            <button
                                                ref={lineAddButtonRef}
                                                type="button"
                                                onClick={() => setLineMenuOpen((open) => !open)}
                                                className={`rounded-xl border px-4 py-2.5 text-sm font-medium outline-none transition focus:border-[#2E90FA] focus:ring-2 focus:ring-[#2E90FA]/20 ${lineDraftVariant ? "border-[#2E90FA] bg-[#EEF5FF] text-[#1B5FC1]" : "border-[#E1E4E8] bg-white text-[#4E5968] hover:border-[#B8BEC6] hover:bg-[#F8F9FA]"}`}
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
                                                    beginContinuousHistoryGroup("line-length");
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
                                                onPointerUp={finishContinuousHistoryGroup}
                                                onPointerCancel={finishContinuousHistoryGroup}
                                                onBlur={finishContinuousHistoryGroup}
                                                className="mt-3 w-full accent-[#BABB25]"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {editorTab === "image" && (
                                <div className="pt-6">
                                    <div className="inline-flex rounded-xl bg-[#F7F8FA] p-1">
                                        {imageCategories.map((category) => {
                                            const isSelected = imageCategory === category.key;

                                            return (
                                                <button
                                                    key={category.key}
                                                    type="button"
                                                    onClick={() => setImageCategory(category.key)}
                                                    className={`relative min-w-[72px] rounded-lg px-4 py-2 text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B9BA28] ${isSelected ? "bg-white font-medium text-[#252A31]" : "bg-transparent font-normal text-[#737B87] hover:bg-white/60 hover:text-[#4E5968]"}`}
                                                    aria-pressed={isSelected}
                                                >
                                                    {category.label}
                                                    {isSelected && (
                                                        <span className="absolute bottom-1 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-[#F4F54A]" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                                        {visibleScenes.map((item) => (
                                            <button
                                                key={item.key}
                                                type="button"
                                                onClick={() => {
                                                    finishHistoryGroups();
                                                    recordHistory();
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

                                    {(scene === "custom" || channel === "story") && (
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
                                                        onClick={() => {
                                                            finishHistoryGroups();
                                                            recordHistory();
                                                            setImageFitOverride(item.key);
                                                        }}
                                                        aria-pressed={
                                                            effectiveImageFit === item.key
                                                        }
                                                        className={`rounded-lg px-3 py-2 text-xs font-normal transition ${effectiveImageFit === item.key ? "bg-white text-[#252A31] shadow-sm ring-1 ring-[#E1E4E8]" : "text-[#737B87]"}`}
                                                    >
                                                        {item.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {editorTab === "style" && isSelectedElementVisible && (
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
                                                onBlur={finishTextHistoryGroup}
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
                                                rows={
                                                    selectedText === "description"
                                                        ? 4
                                                        : isMovableTextKey(selectedText)
                                                            ? 2
                                                            : 1
                                                }
                                                className="mt-2 w-full resize-y rounded-xl border border-[#E1E4E8] bg-white px-4 py-3 text-[15px] font-normal leading-6 text-[#6B7280] outline-none transition focus:border-[#B9BA28] focus:ring-2 focus:ring-[#F4F54A]/30"
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
                                                <span>선 편집</span>
                                                <span className="shrink-0 text-xs font-medium text-[#777900]">
                                                    선택: {isFixedDividerSelected ? "기본 구분선" : "사용자 선"}
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
                                                                }, "line-width")
                                                            }
                                                            onPointerUp={finishContinuousHistoryGroup}
                                                            onPointerCancel={finishContinuousHistoryGroup}
                                                            onBlur={finishContinuousHistoryGroup}
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
                                                                onChange={(color) =>
                                                                    updateActiveLineStyle(
                                                                        { color },
                                                                        "line-color-picker",
                                                                    )
                                                                }
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
                                                            }, "text-scale")
                                                        }
                                                        onPointerUp={finishContinuousHistoryGroup}
                                                        onPointerCancel={finishContinuousHistoryGroup}
                                                        onBlur={finishContinuousHistoryGroup}
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
                                                                        updateSizeWeightOrColor({ shadowKey: key })
                                                                    }
                                                                    className={`rounded-lg border px-2 py-1.5 text-[11px] ${activeShadowKey === key ? "border-[#BABB25] bg-[#FFFFD8]" : "border-[#E1E4E8]"}`}
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
                                                        updateSizeWeightOrColor(
                                                            { color },
                                                            "text-color-picker",
                                                        )
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
                                    <div className="overflow-x-auto pb-1">
                                        <div className="inline-flex min-w-max rounded-xl bg-[#F7F8FA] p-1">
                                            {(Object.keys(copyLabels) as CopyKey[]).map((key) => {
                                                const isSelected = copyChannel === key;

                                                return (
                                                    <button
                                                        key={key}
                                                        type="button"
                                                        onClick={() => setCopyChannel(key)}
                                                        className={`relative shrink-0 rounded-lg px-3.5 py-2 text-xs transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B9BA28] ${isSelected ? "bg-white font-medium text-[#252A31]" : "bg-transparent font-normal text-[#737B87] hover:bg-white/60 hover:text-[#4E5968]"}`}
                                                        aria-pressed={isSelected}
                                                    >
                                                        {copyLabels[key]}
                                                        {isSelected && (
                                                            <span className="absolute bottom-1 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-[#F4F54A]" />
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label
                                            htmlFor="promote-copy-editor"
                                            className="text-xs font-normal text-[#8B95A1]"
                                        >
                                            {copyLabels[copyChannel]} 문구 편집
                                        </label>
                                        <div className="relative mt-2">
                                            <textarea
                                                id="promote-copy-editor"
                                                ref={copyTextareaRef}
                                                onBlur={finishTextHistoryGroup}
                                                value={activeCopy}
                                                onChange={(event) =>
                                                    updateCopyDraft(event.target.value)
                                                }
                                                rows={copyChannel === "sms" ? 4 : 11}
                                                className="w-full resize-y rounded-xl border border-[#E1E4E8] bg-white pb-3 pl-4 pr-16 pt-14 text-sm font-normal leading-7 text-[#59616D] outline-none transition focus:border-[#B9BA28] focus:ring-2 focus:ring-[#F4F54A]/30"
                                                aria-label={`${copyLabels[copyChannel]} 홍보 문구 편집`}
                                            />
                                            <PictogramPicker
                                                targetLabel={`${copyLabels[copyChannel]} 홍보 문구`}
                                                onSelect={insertCopyEmoji}
                                                compact
                                                className="absolute right-6 top-3 z-20"
                                            />
                                        </div>
                                    </div>
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
                                게시 크기에 따라 입력·표시 항목이 달라져요. 작성한 내용은
                                크기를 바꿔도 유지됩니다.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
