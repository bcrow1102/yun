"use client";

import Link from "next/link";
import RegionSelector from "../../../components/forms/RegionSelector";
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

const inputClassName =
    "mt-2 w-full rounded-xl border border-[#DDE2E8] bg-white px-4 py-3.5 text-[15px] text-[#252A31] outline-none transition placeholder:text-[#A8B0BA] focus:border-[#B9BA28] focus:ring-2 focus:ring-[#F4F54A]/25";

const labelClassName = "block text-sm font-medium text-[#333D4B]";

const TOTAL_STEPS = 3;

type TempleFoodFormData = {
    programName: string;
    operatorName: string;
    programType: string;
    region: string;
    location: string;
    startDate: string;
    endDate: string;
    startTime: string;
    capacity: string;
    fee: string;
    deadline: string;
    description: string;
    applicationUrl: string;
    managerName: string;
    phone: string;
    email: string;
    agreement: boolean;
};

type TempleFoodDraftData = {
    formData: TempleFoodFormData;
    currentStep: number;
};

type SaveStatus = "idle" | "saving" | "saved" | "error";

const initialFormData: TempleFoodFormData = {
    programName: "",
    operatorName: "",
    programType: "",
    region: "",
    location: "",
    startDate: "",
    endDate: "",
    startTime: "",
    capacity: "",
    fee: "",
    deadline: "",
    description: "",
    applicationUrl: "",
    managerName: "",
    phone: "",
    email: "",
    agreement: false,
};

const steps = [
    { number: 1, label: "기본 정보" },
    { number: 2, label: "일정·내용" },
    { number: 3, label: "담당자" },
];

function isTempleFoodDraftData(value: unknown): value is TempleFoodDraftData {
    if (!value || typeof value !== "object") return false;
    return "formData" in value && "currentStep" in value;
}

function normalizeDraft(value: unknown): TempleFoodDraftData {
    if (isTempleFoodDraftData(value)) {
        return {
            formData: {
                ...initialFormData,
                ...value.formData,
            },
            currentStep: Math.min(
                Math.max(Number(value.currentStep) || 1, 1),
                TOTAL_STEPS,
            ),
        };
    }

    return {
        formData: {
            ...initialFormData,
            ...(value as Partial<TempleFoodFormData>),
        },
        currentStep: 1,
    };
}

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

export default function NewTempleFoodPage() {
    const [formData, setFormData] =
        useState<TempleFoodFormData>(initialFormData);
    const [currentStep, setCurrentStep] = useState(1);
    const [highestVisitedStep, setHighestVisitedStep] = useState(1);

    const [showRestoreDialog, setShowRestoreDialog] = useState(false);
    const [pendingDraft, setPendingDraft] =
        useState<TempleFoodDraftData | null>(null);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
    const [savedAt, setSavedAt] = useState<number | null>(null);
    const [hasStarted, setHasStarted] = useState(false);
    const [isReady, setIsReady] = useState(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const saved = loadDraft<unknown>("temple-food");

        if (saved) {
            setPendingDraft(normalizeDraft(saved.data));
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
            const success = saveDraft<TempleFoodDraftData>("temple-food", {
                formData,
                currentStep,
            });

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
    }, [
        currentStep,
        formData,
        hasStarted,
        isReady,
        showRestoreDialog,
    ]);

    const updateField = <K extends keyof TempleFoodFormData>(
        key: K,
        value: TempleFoodFormData[K],
    ) => {
        setHasStarted(true);
        setFormData((current) => ({
            ...current,
            [key]: value,
        }));
    };

    const handleTextChange =
        (key: keyof TempleFoodFormData) =>
            (
                event: ChangeEvent<
                    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
                >,
            ) => {
                updateField(key, event.target.value as never);
            };

    const moveToStep = (step: number) => {
        setCurrentStep(step);
        setHighestVisitedStep((current) => Math.max(current, step));
        setHasStarted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const goToNextStep = () => {
        moveToStep(Math.min(currentStep + 1, TOTAL_STEPS));
    };

    const goToPreviousStep = () => {
        moveToStep(Math.max(currentStep - 1, 1));
    };

    const restoreDraft = () => {
        if (pendingDraft) {
            setFormData(pendingDraft.formData);
            setCurrentStep(pendingDraft.currentStep);
            setHighestVisitedStep(pendingDraft.currentStep);
            setHasStarted(false);
            setSaveStatus("saved");
        }

        setPendingDraft(null);
        setShowRestoreDialog(false);
    };

    const startNewDraft = () => {
        deleteDraft("temple-food");
        setFormData(initialFormData);
        setCurrentStep(1);
        setHighestVisitedStep(1);
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
            "저장된 사찰음식 프로그램 작성 내용을 삭제하고 처음부터 작성할까요?",
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
                        href="/temples/food"
                        className="rounded-xl border border-[#E3E8EF] bg-white px-4 py-2.5 text-sm font-medium text-[#4D5562] transition hover:border-[#20242C] hover:text-[#20242C]"
                    >
                        사찰음식
                    </Link>
                </div>
            </header>

            <section className="border-b border-[#E8EA8A] bg-[#FDFDC7]">
                <div className="mx-auto max-w-4xl px-5 py-10 md:px-8 md:py-14">
                    <Link
                        href="/temples/food"
                        className="mb-5 hidden w-fit items-center text-sm font-medium text-[#667085] transition hover:text-[#252A31] md:inline-flex"
                    >
                        ← 사찰음식
                    </Link>

                    <p className="text-sm font-medium text-[#5F610E]">
                        사찰음식 등록
                    </p>
                    <h1 className="mt-3 text-[31px] font-semibold leading-tight tracking-[-0.045em] md:text-[44px]">
                        사찰음식 프로그램을 소개해 주세요
                    </h1>
                    <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#667085]">
                        체험과 교육, 행사 정보를 작성해 주시면 확인 후
                        사이트에 공개됩니다.
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
                    <div className="grid grid-cols-3 gap-2">
                        {steps.map((step) => {
                            const isAvailable =
                                step.number <= highestVisitedStep;

                            return (
                                <button
                                    key={step.number}
                                    type="button"
                                    onClick={() =>
                                        isAvailable && moveToStep(step.number)
                                    }
                                    disabled={!isAvailable}
                                    className="min-w-0 text-center disabled:cursor-default"
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
                            );
                        })}
                    </div>
                </div>
            </section>

            <form
                className="mx-auto grid max-w-4xl gap-5 px-4 py-8 md:px-8 md:py-12"
                onSubmit={handleSubmit}
            >
                <div className="rounded-[18px] border border-[#E7E9EC] bg-white px-4 py-4 text-sm leading-6 text-[#667085]">
                    모르는 항목은 비워두셔도 됩니다. 필수 항목만 입력해도
                    등록을 요청할 수 있습니다.
                </div>

                {currentStep === 1 && (
                    <section className="rounded-[24px] border border-[#E3E8EF] bg-white p-5 md:p-8">
                        <SectionHeader
                            number="01"
                            title="프로그램 기본 정보"
                            description="프로그램명과 운영 사찰, 유형과 진행 지역을 입력해 주세요."
                        />

                        <div className="mt-6 grid gap-6">
                            <label className={labelClassName}>
                                프로그램명{" "}
                                <span className="text-[#E5484D]">*</span>
                                <input
                                    type="text"
                                    required
                                    value={formData.programName}
                                    onChange={handleTextChange("programName")}
                                    placeholder="예: 계절 나물과 사찰 밥상 체험"
                                    className={inputClassName}
                                />
                            </label>

                            <label className={labelClassName}>
                                사찰 또는 운영기관{" "}
                                <span className="text-[#E5484D]">*</span>
                                <input
                                    type="text"
                                    required
                                    value={formData.operatorName}
                                    onChange={handleTextChange("operatorName")}
                                    placeholder="사찰 또는 기관 이름"
                                    className={inputClassName}
                                />
                            </label>

                            <div className="grid gap-6 md:grid-cols-2">
                                <label className={labelClassName}>
                                    프로그램 유형{" "}
                                    <span className="text-[#E5484D]">*</span>
                                    <select
                                        required
                                        value={formData.programType}
                                        onChange={handleTextChange("programType")}
                                        className={inputClassName}
                                    >
                                        <option value="" disabled>유형 선택</option>
                                        <option value="experience">체험</option>
                                        <option value="education">교육</option>
                                        <option value="event">행사</option>
                                        <option value="class">강좌</option>
                                        <option value="family">가족 프로그램</option>
                                        <option value="english">영문 프로그램</option>
                                        <option value="other">기타</option>
                                    </select>
                                </label>

                                <RegionSelector
                                    value={formData.region}
                                    onChange={(value) =>
                                        updateField("region", value)
                                    }
                                />
                            </div>

                            <label className={labelClassName}>
                                진행 장소 및 주소
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={handleTextChange("location")}
                                    placeholder="프로그램 진행 장소와 주소"
                                    className={inputClassName}
                                />
                            </label>
                        </div>
                    </section>
                )}

                {currentStep === 2 && (
                    <section className="rounded-[24px] border border-[#E3E8EF] bg-white p-5 md:p-8">
                        <SectionHeader
                            number="02"
                            title="일정과 프로그램 안내"
                            description="운영 일정과 참가 정보, 프로그램 내용을 적어주세요."
                        />

                        <div className="mt-6 grid gap-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <label className={labelClassName}>
                                    시작일
                                    <input type="date" value={formData.startDate} onChange={handleTextChange("startDate")} className={inputClassName} />
                                </label>
                                <label className={labelClassName}>
                                    종료일
                                    <input type="date" value={formData.endDate} onChange={handleTextChange("endDate")} className={inputClassName} />
                                </label>
                            </div>

                            <div className="grid gap-6 md:grid-cols-3">
                                <label className={labelClassName}>
                                    시작 시간
                                    <input type="time" value={formData.startTime} onChange={handleTextChange("startTime")} className={inputClassName} />
                                </label>
                                <label className={labelClassName}>
                                    모집 인원
                                    <input type="number" min="1" value={formData.capacity} onChange={handleTextChange("capacity")} placeholder="예: 20" className={inputClassName} />
                                </label>
                                <label className={labelClassName}>
                                    참가비
                                    <input type="text" value={formData.fee} onChange={handleTextChange("fee")} placeholder="예: 30,000원 또는 무료" className={inputClassName} />
                                </label>
                            </div>

                            <label className={labelClassName}>
                                신청 마감일
                                <input type="date" value={formData.deadline} onChange={handleTextChange("deadline")} className={inputClassName} />
                            </label>

                            <label className={labelClassName}>
                                상세 설명{" "}<span className="text-[#E5484D]">*</span>
                                <textarea required rows={8} value={formData.description} onChange={handleTextChange("description")} placeholder="프로그램 내용, 준비물, 신청 대상과 안내사항을 작성해 주세요." className={`${inputClassName} resize-y leading-7`} />
                            </label>

                            <label className={labelClassName}>
                                신청 링크
                                <input type="url" value={formData.applicationUrl} onChange={handleTextChange("applicationUrl")} placeholder="https://" className={inputClassName} />
                            </label>

                            <label className={labelClassName}>
                                대표 이미지
                                <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="mt-2 block w-full rounded-xl border border-dashed border-[#C9D0D8] bg-[#F7F8FA] px-4 py-6 text-sm text-[#667085]" />
                                <span className="mt-2 block text-xs font-normal leading-5 text-[#A06B28]">임시 저장을 불러온 뒤에는 이미지를 다시 선택해야 합니다. 직접 촬영하거나 사용 권한이 확인된 사진만 등록해 주세요.</span>
                            </label>
                        </div>
                    </section>
                )}

                {currentStep === 3 && (
                    <section className="rounded-[24px] border border-[#E3E8EF] bg-white p-5 md:p-8">
                        <SectionHeader
                            number="03"
                            title="담당자 정보"
                            description="등록 내용을 확인할 수 있도록 연락 가능한 정보를 입력해 주세요."
                        />

                        <div className="mt-6 grid gap-6">
                            <label className={labelClassName}>
                                담당자 이름{" "}
                                <span className="text-[#E5484D]">*</span>
                                <input
                                    type="text"
                                    required
                                    value={formData.managerName}
                                    onChange={handleTextChange("managerName")}
                                    placeholder="담당자 또는 관계자 이름"
                                    className={inputClassName}
                                />
                            </label>

                            <div className="grid gap-6 md:grid-cols-2">
                                <label className={labelClassName}>
                                    전화번호{" "}
                                    <span className="text-[#E5484D]">*</span>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={handleTextChange("phone")}
                                        placeholder="010-0000-0000"
                                        className={inputClassName}
                                    />
                                </label>

                                <label className={labelClassName}>
                                    이메일
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={handleTextChange("email")}
                                        placeholder="example@email.com"
                                        className={inputClassName}
                                    />
                                </label>
                            </div>

                            <label className="flex items-start gap-3 rounded-xl bg-[#F7F8FA] p-4 text-sm leading-6 text-[#667085]">
                                <input
                                    type="checkbox"
                                    required
                                    checked={formData.agreement}
                                    onChange={(event) =>
                                        updateField(
                                            "agreement",
                                            event.target.checked,
                                        )
                                    }
                                    className="mt-1 h-4 w-4 shrink-0 accent-[#252A31]"
                                />
                                <span>
                                    등록 내용 확인과 연락을 위한 개인정보 수집 및
                                    이용에 동의합니다.{" "}
                                    <span className="text-[#E5484D]">
                                        (필수)
                                    </span>
                                </span>
                            </label>

                            <div className="rounded-[18px] bg-[#FDFDC7] p-5">
                                <p className="text-sm font-medium text-[#4E4F0D]">
                                    등록 전 확인해 주세요
                                </p>
                                <p className="mt-2 text-sm leading-6 text-[#6D6200]">
                                    제출된 내용은 관리자 확인 후 공개됩니다. 운영 내용이 바뀌면 이후 정보 수정을 요청할 수 있습니다.
                                </p>
                            </div>
                        </div>
                    </section>
                )}

                <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        {currentStep === 1 ? (
                            <Link
                                href="/temples/food"
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

                    {currentStep < TOTAL_STEPS ? (
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
                            사찰음식 등록 요청
                        </button>
                    )}
                </div>
            </form>

            {showRestoreDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-5">
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="restore-temple-food-title"
                        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)] md:p-7"
                    >
                        <p className="text-sm font-medium text-[#7A6A00]">
                            임시 저장된 작업
                        </p>

                        <h2
                            id="restore-temple-food-title"
                            className="mt-2 text-2xl font-semibold"
                        >
                            작성하던 사찰음식 프로그램이 있어요
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-[#68707D]">
                            마지막으로 작성한 내용을 이어서 작성할까요? 임시
                            작업은 마지막 수정일부터 3일간 보관됩니다.
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
