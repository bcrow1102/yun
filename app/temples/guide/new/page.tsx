"use client";

import Link from "next/link";
import {
    useEffect,
    useRef,
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";

import {
    deleteDraft,
    loadDraft,
    saveDraft,
} from "../../../lib/draftStorage";
import { SIDO_LIST } from "../temples";

const inputStyle =
    "mt-2 w-full rounded-xl border border-[#DDE2E8] bg-white px-4 py-3.5 text-[15px] text-[#252A31] outline-none transition placeholder:text-[#A8B0BA] focus:border-[#B9BA28] focus:ring-2 focus:ring-[#F4F54A]/25";

const labelStyle = "block text-sm font-medium text-[#333D4B]";

const PROGRAM_STATUSES = [
    "운영",
    "일부 프로그램 포함",
    "비정기",
    "확인 중",
    "미운영",
] as const;

type ProgramStatus = (typeof PROGRAM_STATUSES)[number];

type ProgramFormData = {
    status: ProgramStatus;
    description: string;
    reservationUrl: string;
};

type TempleGuideFormData = {
    templeName: string;
    hanjaName: string;

    sido: string;
    sigungu: string;
    address: string;

    orderName: string;
    founded: string;
    founder: string;

    summary: string;
    introduction: string;
    features: string[];
    tags: string;
    keywords: string;

    phone: string;
    website: string;
    visitingHours: string;
    admissionFee: string;

    nearestStation: string;
    bus: string;
    walking: string;
    shuttle: string;
    transportNotes: string;

    parkingAvailable: "" | "가능" | "불가";
    parkingType: string;
    parkingFee: string;
    parkingNotes: string;

    templeStay: ProgramFormData;
    templeFood: ProgramFormData;
    culturalExperience: ProgramFormData;

    imageAlt: string;
    imageSource: string;

    registrantType: "" | "사찰 관계자" | "일반 이용자";
    registrantName: string;
    registrantPhone: string;
    registrantEmail: string;
    agreement: boolean;
};

const emptyProgram: ProgramFormData = {
    status: "확인 중",
    description: "",
    reservationUrl: "",
};

const initialFormData: TempleGuideFormData = {
    templeName: "",
    hanjaName: "",

    sido: "",
    sigungu: "",
    address: "",

    orderName: "",
    founded: "",
    founder: "",

    summary: "",
    introduction: "",
    features: [""],
    tags: "",
    keywords: "",

    phone: "",
    website: "",
    visitingHours: "",
    admissionFee: "",

    nearestStation: "",
    bus: "",
    walking: "",
    shuttle: "",
    transportNotes: "",

    parkingAvailable: "",
    parkingType: "",
    parkingFee: "",
    parkingNotes: "",

    templeStay: { ...emptyProgram },
    templeFood: { ...emptyProgram },
    culturalExperience: { ...emptyProgram },

    imageAlt: "",
    imageSource: "",

    registrantType: "",
    registrantName: "",
    registrantPhone: "",
    registrantEmail: "",
    agreement: false,
};

type SaveStatus = "idle" | "saving" | "saved" | "error";

function formatSavedTime(timestamp: number | null) {
    if (!timestamp) return "";

    return new Intl.DateTimeFormat("ko-KR", {
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(new Date(timestamp));
}

function LotusIcon() {
    return (
        <svg viewBox="0 0 32 32" fill="none" className="h-6 w-6">
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
                d="M17 24c5.5-.7 8.4-3.5 8-10-5.4-.7-8.1 4-8 10Z"
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

function SectionHeader({
    number,
    title,
    description,
}: {
    number: string;
    title: string;
    description?: string;
}) {
    return (
        <div className="border-b border-[#EEF0F2] pb-5">
            <span className="text-xs font-medium text-[#8D8040]">
                {number}
            </span>

            <h2 className="mt-1 text-[22px] font-medium">{title}</h2>

            {description && (
                <p className="mt-2 text-sm leading-6 text-[#7B8490]">
                    {description}
                </p>
            )}
        </div>
    );
}

function ProgramFields({
    title,
    value,
    onChange,
}: {
    title: string;
    value: ProgramFormData;
    onChange: <K extends keyof ProgramFormData>(
        key: K,
        value: ProgramFormData[K],
    ) => void;
}) {
    return (
        <div className="rounded-[18px] border border-[#E4E7EB] bg-[#FAFBFC] p-4 md:p-5">
            <h3 className="text-base font-medium text-[#252A31]">{title}</h3>

            <div className="mt-4 grid gap-4">
                <label className={labelStyle}>
                    운영 상태
                    <select
                        value={value.status}
                        onChange={(event) =>
                            onChange(
                                "status",
                                event.target.value as ProgramStatus,
                            )
                        }
                        className={inputStyle}
                    >
                        {PROGRAM_STATUSES.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </label>

                <label className={labelStyle}>
                    프로그램 설명
                    <textarea
                        rows={3}
                        value={value.description}
                        onChange={(event) =>
                            onChange("description", event.target.value)
                        }
                        placeholder={`${title}의 내용과 운영 방식을 적어주세요.`}
                        className={`${inputStyle} resize-y leading-7`}
                    />
                </label>

                <label className={labelStyle}>
                    예약·안내 주소
                    <input
                        type="url"
                        value={value.reservationUrl}
                        onChange={(event) =>
                            onChange("reservationUrl", event.target.value)
                        }
                        placeholder="https://"
                        className={inputStyle}
                    />
                </label>
            </div>
        </div>
    );
}

export default function NewTempleGuidePage() {
    const [formData, setFormData] =
        useState<TempleGuideFormData>(initialFormData);
    const [currentStep, setCurrentStep] = useState(1);

    const [showRestoreDialog, setShowRestoreDialog] = useState(false);
    const [pendingDraft, setPendingDraft] =
        useState<TempleGuideFormData | null>(null);

    const [saveStatus, setSaveStatus] =
        useState<SaveStatus>("idle");

    const [savedAt, setSavedAt] = useState<number | null>(null);
    const [hasStarted, setHasStarted] = useState(false);
    const [isReady, setIsReady] = useState(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
        null,
    );

    useEffect(() => {
        const saved =
            loadDraft<TempleGuideFormData>("temple-guide");

        if (saved) {
            setPendingDraft(saved.data);
            setSavedAt(saved.updatedAt);
            setShowRestoreDialog(true);
        }

        setIsReady(true);
    }, []);

    useEffect(() => {
        if (!isReady || showRestoreDialog || !hasStarted) return;

        if (saveTimerRef.current) {
            clearTimeout(saveTimerRef.current);
        }

        setSaveStatus("saving");

        saveTimerRef.current = setTimeout(() => {
            const success = saveDraft("temple-guide", formData);

            if (success) {
                const now = Date.now();
                setSavedAt(now);
                setSaveStatus("saved");
            } else {
                setSaveStatus("error");
            }
        }, 800);

        return () => {
            if (saveTimerRef.current) {
                clearTimeout(saveTimerRef.current);
            }
        };
    }, [formData, hasStarted, isReady, showRestoreDialog]);

    const updateField = <K extends keyof TempleGuideFormData>(
        key: K,
        value: TempleGuideFormData[K],
    ) => {
        setHasStarted(true);

        setFormData((current) => ({
            ...current,
            [key]: value,
        }));
    };

    const handleTextChange =
        (key: keyof TempleGuideFormData) =>
            (
                event: ChangeEvent<
                    HTMLInputElement |
                    HTMLTextAreaElement |
                    HTMLSelectElement
                >,
            ) => {
                updateField(key, event.target.value as never);
            };

    const updateProgram = (
        program:
            | "templeStay"
            | "templeFood"
            | "culturalExperience",
        key: keyof ProgramFormData,
        value: ProgramFormData[keyof ProgramFormData],
    ) => {
        setHasStarted(true);

        setFormData((current) => ({
            ...current,
            [program]: {
                ...current[program],
                [key]: value,
            },
        }));
    };

    const updateFeature = (index: number, value: string) => {
        setHasStarted(true);

        setFormData((current) => ({
            ...current,
            features: current.features.map((feature, featureIndex) =>
                featureIndex === index ? value : feature,
            ),
        }));
    };

    const addFeature = () => {
        if (formData.features.length >= 6) return;

        setHasStarted(true);
        setFormData((current) => ({
            ...current,
            features: [...current.features, ""],
        }));
    };

    const removeFeature = (index: number) => {
        setHasStarted(true);

        setFormData((current) => {
            const nextFeatures = current.features.filter(
                (_, featureIndex) => featureIndex !== index,
            );

            return {
                ...current,
                features:
                    nextFeatures.length > 0 ? nextFeatures : [""],
            };
        });
    };

    const restoreDraft = () => {
        if (pendingDraft) {
            setFormData({
                ...initialFormData,
                ...pendingDraft,
                templeStay: {
                    ...emptyProgram,
                    ...pendingDraft.templeStay,
                },
                templeFood: {
                    ...emptyProgram,
                    ...pendingDraft.templeFood,
                },
                culturalExperience: {
                    ...emptyProgram,
                    ...pendingDraft.culturalExperience,
                },
                features:
                    pendingDraft.features?.length > 0
                        ? pendingDraft.features
                        : [""],
            });

            setHasStarted(false);
            setSaveStatus("saved");
        }

        setPendingDraft(null);
        setShowRestoreDialog(false);
    };

    const startNewDraft = () => {
        deleteDraft("temple-guide");

        setFormData(initialFormData);
        setPendingDraft(null);
        setSavedAt(null);
        setHasStarted(false);
        setSaveStatus("idle");
        setShowRestoreDialog(false);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const removeCurrentDraft = () => {
        const confirmed = window.confirm(
            "저장된 사찰 등록 내용을 삭제하고 처음부터 작성할까요?",
        );

        if (!confirmed) return;

        startNewDraft();
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        alert(
            "실제 등록은 회원가입과 Supabase 연결 후 사용할 수 있습니다. 현재 작성 내용은 이 브라우저에 자동 저장되어 있습니다.",
        );
    };

    const steps = [
        { number: 1, label: "기본 정보" },
        { number: 2, label: "소개" },
        { number: 3, label: "방문 안내" },
        { number: 4, label: "프로그램" },
        { number: 5, label: "등록자" },
    ];

    const goToNextStep = () => {
        setCurrentStep((step) => Math.min(step + 1, 5));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const goToPreviousStep = () => {
        setCurrentStep((step) => Math.max(step - 1, 1));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const saveStatusText = (() => {
        if (saveStatus === "saving") return "저장 중…";
        if (saveStatus === "error") return "저장되지 않았습니다";

        if (saveStatus === "saved" && savedAt) {
            return `자동 저장됨 · ${formatSavedTime(savedAt)}`;
        }

        if (savedAt) {
            return `임시 저장됨 · ${formatSavedTime(savedAt)}`;
        }

        return "작성 내용은 이 브라우저에 3일간 임시 저장됩니다.";
    })();

    return (
        <main className="min-h-screen bg-[#F7F8FA] text-[#252A31]">
            <header className="border-b border-[#E7E9EC] bg-white md:hidden">
                <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 md:h-[72px] md:px-8">
                    <Link
                        href="/"
                        className="flex items-center gap-2.5"
                        aria-label="연 홈"
                    >
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F4F54A] md:h-10 md:w-10">
                            <LotusIcon />
                        </span>

                        <span className="text-xl font-semibold">연</span>
                    </Link>

                    <Link
                        href="/temples/guide"
                        className="rounded-xl border border-[#E3E8EF] bg-white px-4 py-2.5 text-sm font-medium text-[#4D5562] transition hover:border-[#20242C] hover:text-[#20242C]"
                    >
                        사찰 안내
                    </Link>
                </div>
            </header>

            <section className="border-b border-[#E8EA8A] bg-[#FDFDC7]">
                <div className="mx-auto max-w-4xl px-5 py-10 md:px-8 md:py-14">
                    <Link
                        href="/temples/guide"
                        className="mb-5 hidden w-fit items-center text-sm font-medium text-[#667085] transition hover:text-[#252A31] md:inline-flex"
                    >
                        ← 사찰 안내
                    </Link>

                    <p className="text-sm font-medium text-[#5F610E]">
                        사찰 정보 등록
                    </p>

                    <h1 className="mt-3 text-[31px] font-semibold leading-tight tracking-[-0.045em] md:text-[44px]">
                        사찰을 소개해 주세요
                    </h1>

                    <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#667085]">
                        사찰의 대표 특징과 방문 정보, 운영 프로그램을
                        구체적으로 작성해 주세요. 등록 내용은 검수 후
                        공개됩니다.
                    </p>

                    <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-[#E5E58E] bg-white/80 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <p
                            className={`text-sm ${saveStatus === "error"
                                ? "text-[#D45643]"
                                : "text-[#737B87]"
                                }`}
                        >
                            {saveStatusText}
                        </p>

                        {(savedAt || hasStarted) && (
                            <button
                                type="button"
                                onClick={removeCurrentDraft}
                                className="self-start text-sm text-[#68707D] underline underline-offset-4 sm:self-auto"
                            >
                                초안 삭제
                            </button>
                        )}
                    </div>
                </div>
            </section>

            <section className="border-b border-[#E7E9EC] bg-white">
                <div className="mx-auto max-w-4xl px-4 py-5 md:px-8">
                    <div className="grid grid-cols-5 gap-2">
                        {steps.map((step) => (
                            <button
                                key={step.number}
                                type="button"
                                onClick={() => setCurrentStep(step.number)}
                                className="min-w-0 text-center"
                                aria-current={
                                    currentStep === step.number
                                        ? "step"
                                        : undefined
                                }
                            >
                                <span
                                    className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium ${currentStep === step.number
                                        ? "bg-[#252A31] text-white"
                                        : currentStep > step.number
                                            ? "bg-[#F4F54A] text-[#252A31]"
                                            : "bg-[#EEF0F2] text-[#7B8490]"
                                        }`}
                                >
                                    {step.number}
                                </span>

                                <span
                                    className={`mt-2 block truncate text-[11px] md:text-xs ${currentStep === step.number
                                        ? "font-medium text-[#252A31]"
                                        : "text-[#8A919D]"
                                        }`}
                                >
                                    {step.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <form
                className="mx-auto grid max-w-4xl gap-5 px-4 py-8 md:px-8 md:py-12"
                onSubmit={handleSubmit}
            >
                <div className="rounded-[18px] border border-[#E7E9EC] bg-white px-4 py-4 text-sm leading-6 text-[#667085]">
                    모르는 항목은 비워두셔도 됩니다. 연 운영자가 공식
                    자료를 확인해 보완합니다.
                </div>
                {currentStep === 1 && (
                    <section className="rounded-[24px] border border-[#E3E8EF] bg-white p-5 md:p-8">
                        <SectionHeader
                            number="01"
                            title="사찰 기본 정보"
                            description="사찰명과 정확한 소재지, 종단 및 창건 정보를 입력해 주세요."
                        />

                        <div className="mt-6 grid gap-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <label className={labelStyle}>
                                    사찰명{" "}
                                    <span className="text-[#E5484D]">*</span>
                                    <input
                                        required
                                        type="text"
                                        value={formData.templeName}
                                        onChange={handleTextChange("templeName")}
                                        placeholder="예: 월정사"
                                        className={inputStyle}
                                    />
                                </label>

                                <label className={labelStyle}>
                                    한자명
                                    <input
                                        type="text"
                                        value={formData.hanjaName}
                                        onChange={handleTextChange("hanjaName")}
                                        placeholder="예: 月精寺"
                                        className={inputStyle}
                                    />
                                </label>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <label className={labelStyle}>
                                    시·도{" "}
                                    <span className="text-[#E5484D]">*</span>
                                    <select
                                        required
                                        value={formData.sido}
                                        onChange={handleTextChange("sido")}
                                        className={inputStyle}
                                    >
                                        <option value="" disabled>
                                            시·도 선택
                                        </option>

                                        {SIDO_LIST.filter(
                                            (region) => region !== "전체",
                                        ).map((region) => (
                                            <option key={region} value={region}>
                                                {region}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label className={labelStyle}>
                                    시·군·구{" "}
                                    <span className="text-[#E5484D]">*</span>
                                    <input
                                        required
                                        type="text"
                                        value={formData.sigungu}
                                        onChange={handleTextChange("sigungu")}
                                        placeholder="예: 평창군"
                                        className={inputStyle}
                                    />
                                </label>
                            </div>

                            <label className={labelStyle}>
                                상세 주소{" "}
                                <span className="text-[#E5484D]">*</span>
                                <input
                                    required
                                    type="text"
                                    value={formData.address}
                                    onChange={handleTextChange("address")}
                                    placeholder="도로명 주소를 입력해 주세요"
                                    className={inputStyle}
                                />
                            </label>

                            <div className="grid gap-6 md:grid-cols-3">
                                <label className={labelStyle}>
                                    소속 종단
                                    <input
                                        type="text"
                                        value={formData.orderName}
                                        onChange={handleTextChange("orderName")}
                                        placeholder="예: 대한불교조계종"
                                        className={inputStyle}
                                    />
                                </label>

                                <label className={labelStyle}>
                                    창건 시기
                                    <input
                                        type="text"
                                        value={formData.founded}
                                        onChange={handleTextChange("founded")}
                                        placeholder="예: 신라 선덕여왕 12년"
                                        className={inputStyle}
                                    />
                                </label>

                                <label className={labelStyle}>
                                    창건 인물
                                    <input
                                        type="text"
                                        value={formData.founder}
                                        onChange={handleTextChange("founder")}
                                        placeholder="예: 자장율사"
                                        className={inputStyle}
                                    />
                                </label>
                            </div>
                        </div>
                    </section>
                )}

                {currentStep === 2 && (
                    <section className="rounded-[24px] border border-[#E3E8EF] bg-white p-5 md:p-8">
                        <SectionHeader
                            number="02"
                            title="사찰 소개와 대표 특징"
                            description="목록 카드의 한 줄 소개와 상세 소개를 나누어 작성해 주세요."
                        />

                        <div className="mt-6 grid gap-6">
                            <label className={labelStyle}>
                                한 줄 소개{" "}
                                <span className="text-[#E5484D]">*</span>
                                <input
                                    required
                                    type="text"
                                    maxLength={90}
                                    value={formData.summary}
                                    onChange={handleTextChange("summary")}
                                    placeholder="예: 전나무숲길과 팔각구층석탑으로 널리 알려진 오대산의 대표 사찰"
                                    className={inputStyle}
                                />
                                <span className="mt-2 block text-xs text-[#8A919D]">
                                    목록 카드에 표시됩니다. 90자 이내가
                                    적당합니다.
                                </span>
                            </label>

                            <label className={labelStyle}>
                                상세 소개
                                <textarea
                                    rows={7}
                                    value={formData.introduction}
                                    onChange={handleTextChange("introduction")}
                                    placeholder="사찰의 역사, 문화재, 신앙적 의미, 자연환경과 방문자가 알아두면 좋은 내용을 적어주세요."
                                    className={`${inputStyle} resize-y leading-7`}
                                />
                            </label>

                            <div>
                                <div className="flex items-end justify-between gap-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-[#333D4B]">
                                            대표 특징
                                        </h3>
                                        <p className="mt-1 text-xs leading-5 text-[#8A919D]">
                                            역사·문화재·자연·신앙·수행·체험
                                            가운데 알고 있는 내용을 적어주세요.
                                            입력하면 상세 페이지가 더 풍성해집니다.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={addFeature}
                                        disabled={formData.features.length >= 6}
                                        className="shrink-0 rounded-xl border border-[#DDE2E8] bg-white px-3 py-2 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        특징 추가
                                    </button>
                                </div>

                                <div className="mt-3 grid gap-3">
                                    {formData.features.map((feature, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2"
                                        >
                                            <input
                                                type="text"
                                                value={feature}
                                                onChange={(event) =>
                                                    updateFeature(
                                                        index,
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder={`대표 특징 ${index + 1}`}
                                                className={`${inputStyle} mt-0`}
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeFeature(index)
                                                }
                                                className="shrink-0 rounded-xl border border-[#E2E5E9] px-3 py-3.5 text-xs text-[#68707D]"
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <label className={labelStyle}>
                                    태그
                                    <input
                                        type="text"
                                        value={formData.tags}
                                        onChange={handleTextChange("tags")}
                                        placeholder="예: 숲길, 문화유산, 산사"
                                        className={inputStyle}
                                    />
                                    <span className="mt-2 block text-xs text-[#8A919D]">
                                        쉼표로 구분해 주세요.
                                    </span>
                                </label>

                                <label className={labelStyle}>
                                    검색 키워드
                                    <input
                                        type="text"
                                        value={formData.keywords}
                                        onChange={handleTextChange("keywords")}
                                        placeholder="예: 오대산, 전나무숲길, 평창"
                                        className={inputStyle}
                                    />
                                    <span className="mt-2 block text-xs text-[#8A919D]">
                                        사찰명 별칭, 지역명, 문화재 등을 쉼표로
                                        구분해 주세요.
                                    </span>
                                </label>
                            </div>
                        </div>
                    </section>
                )}

                {currentStep === 3 && (
                    <section className="rounded-[24px] border border-[#E3E8EF] bg-white p-5 md:p-8">
                        <SectionHeader
                            number="03"
                            title="방문·교통·주차 안내"
                            description="방문자가 현장에서 바로 활용할 수 있도록 항목별로 나누어 작성해 주세요."
                        />

                        <div className="mt-6 grid gap-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <label className={labelStyle}>
                                    전화번호
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleTextChange("phone")}
                                        placeholder="사찰 대표 전화번호"
                                        className={inputStyle}
                                    />
                                </label>

                                <label className={labelStyle}>
                                    공식 홈페이지
                                    <input
                                        type="url"
                                        value={formData.website}
                                        onChange={handleTextChange("website")}
                                        placeholder="https://"
                                        className={inputStyle}
                                    />
                                </label>

                                <label className={labelStyle}>
                                    운영·방문 시간
                                    <input
                                        type="text"
                                        value={formData.visitingHours}
                                        onChange={handleTextChange("visitingHours")}
                                        placeholder="예: 매일 09:00~18:00"
                                        className={inputStyle}
                                    />
                                </label>

                                <label className={labelStyle}>
                                    입장료·관람료
                                    <input
                                        type="text"
                                        value={formData.admissionFee}
                                        onChange={handleTextChange("admissionFee")}
                                        placeholder="예: 무료 또는 성인 5,000원"
                                        className={inputStyle}
                                    />
                                </label>
                            </div>

                            <div className="rounded-[18px] bg-[#F8F9FA] p-4 md:p-5">
                                <h3 className="text-base font-medium">
                                    대중교통
                                </h3>

                                <div className="mt-4 grid gap-5 md:grid-cols-2">
                                    <label className={labelStyle}>
                                        가까운 역·터미널
                                        <input
                                            type="text"
                                            value={formData.nearestStation}
                                            onChange={handleTextChange(
                                                "nearestStation",
                                            )}
                                            placeholder="예: 진부역 또는 진부버스터미널"
                                            className={inputStyle}
                                        />
                                    </label>

                                    <label className={labelStyle}>
                                        도보 이동
                                        <input
                                            type="text"
                                            value={formData.walking}
                                            onChange={handleTextChange("walking")}
                                            placeholder="예: 정류장에서 도보 약 10분"
                                            className={inputStyle}
                                        />
                                    </label>

                                    <label
                                        className={`${labelStyle} md:col-span-2`}
                                    >
                                        버스·하차 정류장
                                        <textarea
                                            rows={3}
                                            value={formData.bus}
                                            onChange={handleTextChange("bus")}
                                            placeholder="버스 번호와 하차 정류장을 줄바꿈해 적어주세요."
                                            className={`${inputStyle} resize-y leading-7`}
                                        />
                                    </label>

                                    <label className={labelStyle}>
                                        셔틀버스
                                        <input
                                            type="text"
                                            value={formData.shuttle}
                                            onChange={handleTextChange("shuttle")}
                                            placeholder="운행하지 않으면 미운영"
                                            className={inputStyle}
                                        />
                                    </label>

                                    <label className={labelStyle}>
                                        교통 참고사항
                                        <input
                                            type="text"
                                            value={formData.transportNotes}
                                            onChange={handleTextChange(
                                                "transportNotes",
                                            )}
                                            placeholder="막차, 환승, 행사일 혼잡 등"
                                            className={inputStyle}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="rounded-[18px] bg-[#F8F9FA] p-4 md:p-5">
                                <h3 className="text-base font-medium">
                                    주차 안내
                                </h3>

                                <div className="mt-4 grid gap-5 md:grid-cols-2">
                                    <label className={labelStyle}>
                                        주차 가능 여부
                                        <select
                                            value={formData.parkingAvailable}
                                            onChange={handleTextChange(
                                                "parkingAvailable",
                                            )}
                                            className={inputStyle}
                                        >
                                            <option value="">확인 중</option>
                                            <option value="가능">가능</option>
                                            <option value="불가">불가</option>
                                        </select>
                                    </label>

                                    <label className={labelStyle}>
                                        주차 방식
                                        <input
                                            type="text"
                                            value={formData.parkingType}
                                            onChange={handleTextChange(
                                                "parkingType",
                                            )}
                                            placeholder="예: 사찰 전용 주차장"
                                            className={inputStyle}
                                        />
                                    </label>

                                    <label className={labelStyle}>
                                        주차 요금
                                        <input
                                            type="text"
                                            value={formData.parkingFee}
                                            onChange={handleTextChange(
                                                "parkingFee",
                                            )}
                                            placeholder="예: 무료 또는 시간당 요금"
                                            className={inputStyle}
                                        />
                                    </label>

                                    <label className={labelStyle}>
                                        주차 참고사항
                                        <input
                                            type="text"
                                            value={formData.parkingNotes}
                                            onChange={handleTextChange(
                                                "parkingNotes",
                                            )}
                                            placeholder="대형차, 혼잡 시간, 임시주차 등"
                                            className={inputStyle}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {currentStep === 4 && (
                    <section className="rounded-[24px] border border-[#E3E8EF] bg-white p-5 md:p-8">
                        <SectionHeader
                            number="04"
                            title="체험 및 프로그램"
                            description="운영 여부가 바뀔 수 있으므로 현재 상태와 공식 안내 주소를 함께 적어주세요."
                        />

                        <div className="mt-6 grid gap-4">
                            <ProgramFields
                                title="템플스테이"
                                value={formData.templeStay}
                                onChange={(key, value) =>
                                    updateProgram(
                                        "templeStay",
                                        key,
                                        value,
                                    )
                                }
                            />

                            <ProgramFields
                                title="사찰음식 프로그램"
                                value={formData.templeFood}
                                onChange={(key, value) =>
                                    updateProgram(
                                        "templeFood",
                                        key,
                                        value,
                                    )
                                }
                            />

                            <ProgramFields
                                title="문화·수행 체험"
                                value={formData.culturalExperience}
                                onChange={(key, value) =>
                                    updateProgram(
                                        "culturalExperience",
                                        key,
                                        value,
                                    )
                                }
                            />
                        </div>
                    </section>
                )}

                {currentStep === 5 && (
                    <section className="rounded-[24px] border border-[#E3E8EF] bg-white p-5 md:p-8">
                        <SectionHeader
                            number="05"
                            title="사진과 등록자 정보"
                            description="대표 사진의 사용 권한과 등록 내용을 확인할 수 있는 담당자 정보를 입력해 주세요."
                        />

                        <div className="mt-6 grid gap-6">
                            <label className={labelStyle}>
                                대표 사진
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
                                    className="mt-2 block w-full rounded-xl border border-dashed border-[#C9D0D8] bg-[#F7F8FA] px-4 py-6 text-sm text-[#667085]"
                                />

                                <span className="mt-2 block text-xs leading-5 text-[#A06B28]">
                                    임시 저장을 불러온 뒤에는 이미지를 다시
                                    선택해야 합니다. 직접 촬영하거나 사용 권한이
                                    확인된 사진만 등록해 주세요.
                                </span>
                            </label>

                            <div className="grid gap-6 md:grid-cols-2">
                                <label className={labelStyle}>
                                    사진 설명
                                    <input
                                        type="text"
                                        value={formData.imageAlt}
                                        onChange={handleTextChange("imageAlt")}
                                        placeholder="예: 월정사 팔각구층석탑 전경"
                                        className={inputStyle}
                                    />
                                </label>

                                <label className={labelStyle}>
                                    사진 출처
                                    <input
                                        type="text"
                                        value={formData.imageSource}
                                        onChange={handleTextChange("imageSource")}
                                        placeholder="예: 월정사 제공 또는 직접 촬영"
                                        className={inputStyle}
                                    />
                                </label>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <label className={labelStyle}>
                                    등록자 관계{" "}
                                    <span className="text-[#E5484D]">*</span>
                                    <select
                                        required
                                        value={formData.registrantType}
                                        onChange={handleTextChange(
                                            "registrantType",
                                        )}
                                        className={inputStyle}
                                    >
                                        <option value="" disabled>
                                            관계 선택
                                        </option>
                                        <option value="사찰 관계자">
                                            사찰 관계자
                                        </option>
                                        <option value="일반 이용자">
                                            일반 이용자
                                        </option>
                                    </select>
                                </label>

                                <label className={labelStyle}>
                                    등록자·담당자명{" "}
                                    <span className="text-[#E5484D]">*</span>
                                    <input
                                        required
                                        type="text"
                                        value={formData.registrantName}
                                        onChange={handleTextChange(
                                            "registrantName",
                                        )}
                                        className={inputStyle}
                                    />
                                </label>

                                <label className={labelStyle}>
                                    연락처{" "}
                                    <span className="text-[#E5484D]">*</span>
                                    <input
                                        required
                                        type="tel"
                                        value={formData.registrantPhone}
                                        onChange={handleTextChange(
                                            "registrantPhone",
                                        )}
                                        placeholder="010-0000-0000"
                                        className={inputStyle}
                                    />
                                </label>

                                <label className={labelStyle}>
                                    이메일
                                    <input
                                        type="email"
                                        value={formData.registrantEmail}
                                        onChange={handleTextChange(
                                            "registrantEmail",
                                        )}
                                        placeholder="name@example.com"
                                        className={inputStyle}
                                    />
                                </label>
                            </div>

                            <label className="flex items-start gap-3 rounded-xl bg-[#F7F8FA] p-4 text-sm leading-6 text-[#667085]">
                                <input
                                    required
                                    type="checkbox"
                                    checked={formData.agreement}
                                    onChange={(event) =>
                                        updateField(
                                            "agreement",
                                            event.target.checked,
                                        )
                                    }
                                    className="mt-1 h-4 w-4 accent-[#B9BA28]"
                                />

                                <span>
                                    등록 내용 확인과 연락을 위한 개인정보 수집 및
                                    이용에 동의합니다.{" "}
                                    <span className="text-[#E5484D]">
                                        (필수)
                                    </span>
                                </span>
                            </label>
                        </div>
                    </section>
                )}

                <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        {currentStep === 1 ? (
                            <Link
                                href="/temples/guide"
                                className="block rounded-xl border border-[#DDE2E8] bg-white px-6 py-4 text-center text-sm font-medium"
                            >
                                취소
                            </Link>
                        ) : (
                            <button
                                type="button"
                                onClick={goToPreviousStep}
                                className="w-full rounded-xl border border-[#DDE2E8] bg-white px-6 py-4 text-sm font-medium sm:w-auto"
                            >
                                이전
                            </button>
                        )}
                    </div>

                    {currentStep < 5 ? (
                        <button
                            type="button"
                            onClick={goToNextStep}
                            className="rounded-xl bg-[#20242C] px-8 py-4 text-sm font-medium text-white transition hover:bg-[#11151B]"
                        >
                            다음
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="rounded-xl bg-[#20242C] px-8 py-4 text-sm font-medium text-white transition hover:bg-[#11151B]"
                        >
                            사찰 등록 요청
                        </button>
                    )}
                </div>


            </form>

            {showRestoreDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-5">
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="restore-temple-guide-title"
                        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)] md:p-7"
                    >
                        <p className="text-sm font-medium text-[#7A6A00]">
                            임시 저장된 작업
                        </p>

                        <h2
                            id="restore-temple-guide-title"
                            className="mt-2 text-2xl font-semibold"
                        >
                            작성하던 사찰 정보가 있어요
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-[#68707D]">
                            마지막으로 작성한 내용을 이어서 작성할까요?
                            임시 작업은 마지막 수정일부터 3일간
                            보관됩니다.
                        </p>

                        {savedAt && (
                            <p className="mt-3 text-xs text-[#8A919D]">
                                마지막 저장: {formatSavedTime(savedAt)}
                            </p>
                        )}

                        <div className="mt-6 grid gap-3 sm:grid-cols-2">
                            <button
                                type="button"
                                onClick={startNewDraft}
                                className="rounded-xl border border-[#D9DDE3] bg-white px-5 py-3.5 text-sm font-medium text-[#4D5562]"
                            >
                                새로 작성
                            </button>

                            <button
                                type="button"
                                onClick={restoreDraft}
                                className="rounded-xl bg-[#F4F54A] px-5 py-3.5 text-sm font-medium text-[#171B22]"
                            >
                                이어서 작성
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
