"use client";

import Link from "next/link";
import RegionSelector from "../../components/forms/RegionSelector";
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
} from "../../lib/draftStorage";

const inputStyle =
    "mt-2 w-full rounded-xl border border-[#DDE2E8] bg-white px-4 py-3.5 text-[15px] text-[#252A31] outline-none transition placeholder:text-[#A8B0BA] focus:border-[#B9BA28] focus:ring-2 focus:ring-[#F4F54A]/25";

const labelStyle = "block text-sm font-medium text-[#333D4B]";

const TOTAL_STEPS = 3;

type EventFormData = {
    registrantType: "organization" | "individual";
    registrantName: string;
    managerName: string;
    phone: string;
    email: string;
    eventType: string;
    eventName: string;
    startDateTime: string;
    endDateTime: string;
    place: string;
    region: string;
    address: string;
    capacity: string;
    fee: string;
    introduction: string;
    program: string;
    applicationMethod: string;
    agreement: boolean;
};

type EventDraftData = {
    formData: EventFormData;
    currentStep: number;
};

type SaveStatus = "idle" | "saving" | "saved" | "error";

const initialFormData: EventFormData = {
    registrantType: "organization",
    registrantName: "",
    managerName: "",
    phone: "",
    email: "",
    eventType: "",
    eventName: "",
    startDateTime: "",
    endDateTime: "",
    place: "",
    region: "",
    address: "",
    capacity: "",
    fee: "",
    introduction: "",
    program: "",
    applicationMethod: "",
    agreement: false,
};

const steps = [
    { number: 1, label: "기본 정보" },
    { number: 2, label: "상세 안내" },
    { number: 3, label: "등록자" },
];

function isEventDraftData(value: unknown): value is EventDraftData {
    if (!value || typeof value !== "object") return false;

    return "formData" in value && "currentStep" in value;
}

function normalizeDraft(value: unknown): EventDraftData {
    if (isEventDraftData(value)) {
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
            ...(value as Partial<EventFormData>),
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

export default function EventNewPage() {
    const [formData, setFormData] =
        useState<EventFormData>(initialFormData);
    const [currentStep, setCurrentStep] = useState(1);
    const [highestVisitedStep, setHighestVisitedStep] = useState(1);

    const [showRestoreDialog, setShowRestoreDialog] = useState(false);
    const [pendingDraft, setPendingDraft] =
        useState<EventDraftData | null>(null);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
    const [savedAt, setSavedAt] = useState<number | null>(null);
    const [hasStarted, setHasStarted] = useState(false);
    const [isReady, setIsReady] = useState(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const saved = loadDraft<unknown>("event");

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
            const success = saveDraft<EventDraftData>("event", {
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

    const updateField = <K extends keyof EventFormData>(
        key: K,
        value: EventFormData[K],
    ) => {
        setHasStarted(true);
        setFormData((current) => ({
            ...current,
            [key]: value,
        }));
    };

    const handleTextChange =
        (key: keyof EventFormData) =>
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
        deleteDraft("event");
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
            "저장된 행사 등록 내용을 삭제하고 처음부터 작성할까요?",
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

            <section className="border-b border-[#E8EA8A] bg-[#FDFDC7]">
                <div className="mx-auto max-w-4xl px-5 py-10 md:px-8 md:py-14">
                    <p className="text-sm font-medium text-[#5F610E]">
                        행사·교육 등록
                    </p>
                    <h1 className="mt-3 text-[31px] font-semibold leading-tight tracking-[-0.045em] md:text-[44px]">
                        새로운 소식을 알려주세요
                    </h1>
                    <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#667085]">
                        사찰의 문화행사, 교육, 체험 프로그램을 등록할 수
                        있습니다. 등록 내용은 확인 후 공개됩니다.
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
                            title="행사 기본 정보"
                            description="목록과 상세 페이지에 표시될 행사명, 일정, 장소를 입력해 주세요."
                        />

                        <div className="mt-6 grid gap-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <label className={labelStyle}>
                                    행사 구분{" "}
                                    <span className="text-[#E5484D]">*</span>
                                    <select
                                        className={inputStyle}
                                        value={formData.eventType}
                                        onChange={handleTextChange("eventType")}
                                        required
                                    >
                                        <option value="" disabled>
                                            구분을 선택해 주세요
                                        </option>
                                        <option value="문화행사">문화행사</option>
                                        <option value="교육">교육</option>
                                        <option value="체험">체험</option>
                                        <option value="법회">법회</option>
                                        <option value="기타">기타</option>
                                    </select>
                                </label>

                                <label className={labelStyle}>
                                    행사명{" "}
                                    <span className="text-[#E5484D]">*</span>
                                    <input
                                        className={inputStyle}
                                        type="text"
                                        value={formData.eventName}
                                        onChange={handleTextChange("eventName")}
                                        placeholder="행사명을 입력해 주세요"
                                        required
                                    />
                                </label>

                                <label className={labelStyle}>
                                    시작 일시{" "}
                                    <span className="text-[#E5484D]">*</span>
                                    <input
                                        className={inputStyle}
                                        type="datetime-local"
                                        value={formData.startDateTime}
                                        onChange={handleTextChange(
                                            "startDateTime",
                                        )}
                                        required
                                    />
                                </label>

                                <label className={labelStyle}>
                                    종료 일시
                                    <input
                                        className={inputStyle}
                                        type="datetime-local"
                                        value={formData.endDateTime}
                                        onChange={handleTextChange(
                                            "endDateTime",
                                        )}
                                    />
                                </label>

                                <label className={labelStyle}>
                                    장소{" "}
                                    <span className="text-[#E5484D]">*</span>
                                    <input
                                        className={inputStyle}
                                        type="text"
                                        value={formData.place}
                                        onChange={handleTextChange("place")}
                                        placeholder="예: 연화사 야외마당"
                                        required
                                    />
                                </label>

                                <RegionSelector
                                    value={formData.region}
                                    onChange={(value) =>
                                        updateField("region", value)
                                    }
                                />

                                <label className={labelStyle}>
                                    주소
                                    <input
                                        className={inputStyle}
                                        type="text"
                                        value={formData.address}
                                        onChange={handleTextChange("address")}
                                        placeholder="행사 장소의 주소"
                                    />
                                </label>

                                <label className={labelStyle}>
                                    참여 대상·정원
                                    <input
                                        className={inputStyle}
                                        type="text"
                                        value={formData.capacity}
                                        onChange={handleTextChange("capacity")}
                                        placeholder="예: 누구나 · 선착순 100명"
                                    />
                                </label>

                                <label className={labelStyle}>
                                    참가비
                                    <input
                                        className={inputStyle}
                                        type="text"
                                        value={formData.fee}
                                        onChange={handleTextChange("fee")}
                                        placeholder="예: 무료 또는 30,000원"
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
                            title="상세 내용과 신청 안내"
                            description="행사의 취지와 일정, 참여 방법을 방문자가 이해하기 쉽게 적어주세요."
                        />

                        <div className="mt-6 grid gap-6">
                            <label className={labelStyle}>
                                행사 소개{" "}
                                <span className="text-[#E5484D]">*</span>
                                <textarea
                                    className={`${inputStyle} min-h-36 resize-y leading-7`}
                                    value={formData.introduction}
                                    onChange={handleTextChange("introduction")}
                                    placeholder="행사의 취지와 주요 내용을 소개해 주세요."
                                    required
                                />
                            </label>

                            <label className={labelStyle}>
                                일정·프로그램
                                <textarea
                                    className={`${inputStyle} min-h-32 resize-y leading-7`}
                                    value={formData.program}
                                    onChange={handleTextChange("program")}
                                    placeholder={
                                        "예: 17:00 입장\n18:00 공연 시작\n20:00 종료"
                                    }
                                />
                            </label>

                            <label className={labelStyle}>
                                신청 방법
                                <textarea
                                    className={`${inputStyle} min-h-28 resize-y leading-7`}
                                    value={formData.applicationMethod}
                                    onChange={handleTextChange(
                                        "applicationMethod",
                                    )}
                                    placeholder="신청 링크, 전화 접수 등 참여 방법을 안내해 주세요."
                                />
                            </label>

                            <label className={labelStyle}>
                                대표 이미지
                                <span className="mt-2 block text-xs font-normal leading-5 text-[#8A919D]">
                                    가로형 사진을 권장합니다. JPG, PNG, WEBP
                                    파일을 사용할 수 있습니다.
                                </span>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    className="mt-3 block w-full rounded-xl border border-dashed border-[#C9D0D8] bg-[#F7F8FA] px-4 py-6 text-sm text-[#667085]"
                                />
                                <span className="mt-2 block text-xs leading-5 text-[#A06B28]">
                                    임시 저장을 불러온 뒤에는 이미지를 다시
                                    선택해야 합니다. 직접 촬영하거나 사용 권한이
                                    확인된 사진만 등록해 주세요.
                                </span>
                            </label>
                        </div>
                    </section>
                )}

                {currentStep === 3 && (
                    <section className="rounded-[24px] border border-[#E3E8EF] bg-white p-5 md:p-8">
                        <SectionHeader
                            number="03"
                            title="등록자 정보"
                            description="등록 내용을 확인할 수 있도록 연락 가능한 정보를 입력해 주세요."
                        />

                        <div className="mt-6 grid gap-6">
                            <fieldset>
                                <legend className={labelStyle}>
                                    등록자 구분
                                </legend>
                                <div className="mt-3 grid grid-cols-2 gap-3">
                                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#D8DCE2] px-4 py-3 text-sm">
                                        <input
                                            type="radio"
                                            name="registrantType"
                                            checked={
                                                formData.registrantType ===
                                                "organization"
                                            }
                                            onChange={() =>
                                                updateField(
                                                    "registrantType",
                                                    "organization",
                                                )
                                            }
                                            className="h-4 w-4 accent-[#B9BA28]"
                                        />
                                        사찰·기관
                                    </label>

                                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#D8DCE2] px-4 py-3 text-sm">
                                        <input
                                            type="radio"
                                            name="registrantType"
                                            checked={
                                                formData.registrantType ===
                                                "individual"
                                            }
                                            onChange={() =>
                                                updateField(
                                                    "registrantType",
                                                    "individual",
                                                )
                                            }
                                            className="h-4 w-4 accent-[#B9BA28]"
                                        />
                                        개인
                                    </label>
                                </div>
                            </fieldset>

                            <div className="grid gap-6 md:grid-cols-2">
                                <label className={labelStyle}>
                                    사찰·기관명 또는 등록자명{" "}
                                    <span className="text-[#E5484D]">*</span>
                                    <input
                                        className={inputStyle}
                                        type="text"
                                        value={formData.registrantName}
                                        onChange={handleTextChange(
                                            "registrantName",
                                        )}
                                        placeholder="예: 연화사"
                                        required
                                    />
                                </label>

                                <label className={labelStyle}>
                                    담당자명
                                    <input
                                        className={inputStyle}
                                        type="text"
                                        value={formData.managerName}
                                        onChange={handleTextChange(
                                            "managerName",
                                        )}
                                        placeholder="기관 등록일 때 입력해 주세요"
                                    />
                                </label>

                                <label className={labelStyle}>
                                    연락처{" "}
                                    <span className="text-[#E5484D]">*</span>
                                    <input
                                        className={inputStyle}
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleTextChange("phone")}
                                        placeholder="010-0000-0000"
                                        required
                                    />
                                </label>

                                <label className={labelStyle}>
                                    이메일
                                    <input
                                        className={inputStyle}
                                        type="email"
                                        value={formData.email}
                                        onChange={handleTextChange("email")}
                                        placeholder="example@email.com"
                                    />
                                </label>
                            </div>

                            <label className="flex items-start gap-3 rounded-xl bg-[#F7F8FA] p-4 text-sm leading-6 text-[#667085]">
                                <input
                                    type="checkbox"
                                    checked={formData.agreement}
                                    onChange={(event) =>
                                        updateField(
                                            "agreement",
                                            event.target.checked,
                                        )
                                    }
                                    className="mt-1 h-4 w-4 shrink-0 accent-[#B9BA28]"
                                    required
                                />
                                <span>
                                    등록한 내용이 사이트에 공개되는 것에
                                    동의하며, 행사 정보가 정확함을 확인했습니다.{" "}
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
                                href="/events"
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
                            행사 등록 요청
                        </button>
                    )}
                </div>
            </form>

            {showRestoreDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-5">
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="restore-event-title"
                        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)] md:p-7"
                    >
                        <p className="text-sm font-medium text-[#7A6A00]">
                            임시 저장된 작업
                        </p>
                        <h2
                            id="restore-event-title"
                            className="mt-2 text-2xl font-semibold"
                        >
                            작성하던 행사 정보가 있어요
                        </h2>
                        <p className="mt-3 text-sm leading-6 text-[#68707D]">
                            마지막으로 작성한 단계부터 이어서 작성할까요?
                            임시 작업은 마지막 수정일부터 3일간 보관됩니다.
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
