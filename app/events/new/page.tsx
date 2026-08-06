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
} from "../../lib/draftStorage";

const inputStyle =
    "mt-2 w-full rounded-xl border border-[#E3E6EB] bg-white px-4 py-3 text-[15px] text-[#20242C] outline-none transition placeholder:text-[#A0A6B0] focus:border-[#B9BA28] focus:ring-2 focus:ring-[#F4F54A]/25";

const labelStyle = "block text-sm font-medium text-[#343A46]";

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
    address: string;
    capacity: string;
    fee: string;
    introduction: string;
    program: string;
    applicationMethod: string;
    agreement: boolean;
};

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
    address: "",
    capacity: "",
    fee: "",
    introduction: "",
    program: "",
    applicationMethod: "",
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

export default function EventNewPage() {
    const [formData, setFormData] =
        useState<EventFormData>(initialFormData);

    const [showRestoreDialog, setShowRestoreDialog] = useState(false);
    const [pendingDraft, setPendingDraft] =
        useState<EventFormData | null>(null);

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
        const saved = loadDraft<EventFormData>("event");

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
            const success = saveDraft("event", formData);

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
        (
            key: keyof EventFormData,
        ) =>
            (
                event: ChangeEvent<
                    HTMLInputElement |
                    HTMLTextAreaElement |
                    HTMLSelectElement
                >,
            ) => {
                updateField(key, event.target.value as never);
            };

    const restoreDraft = () => {
        if (pendingDraft) {
            setFormData({
                ...initialFormData,
                ...pendingDraft,
            });

            setHasStarted(false);
            setSaveStatus("saved");
        }

        setPendingDraft(null);
        setShowRestoreDialog(false);
    };

    const startNewDraft = () => {
        deleteDraft("event");

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
            "저장된 작성 내용을 삭제하고 처음부터 작성할까요?",
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
        <main className="min-h-screen bg-[#F7F8FA] text-[#171B22]">
            <header className="border-b border-[#E7E9EC] bg-white">
                <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 md:h-[72px] md:px-8">
                    <Link
                        href="/"
                        className="flex items-center gap-2.5"
                        aria-label="연 홈"
                    >
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F4F54A] md:h-10 md:w-10">
                            <svg
                                viewBox="0 0 32 32"
                                fill="none"
                                className="h-6 w-6"
                                aria-hidden="true"
                            >
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
                        </span>

                        <span className="text-xl font-semibold">연</span>
                    </Link>

                    <Link
                        href="/events"
                        className="rounded-xl border border-[#E3E8EF] bg-white px-4 py-2.5 text-sm font-medium text-[#4D5562] transition hover:border-[#20242C] hover:text-[#20242C]"
                    >
                        행사·교육 목록
                    </Link>
                </div>
            </header>

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
                        있습니다. 확인이 필요한 항목은 담당자가 연락드릴 수 있어요.
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

            <section className="mx-auto max-w-4xl px-4 py-8 md:px-8 md:py-12">
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <section className="rounded-3xl border border-[#E8EAEE] bg-white p-5 shadow-[0_8px_30px_rgba(25,30,40,0.04)] md:p-8">
                        <div className="mb-7 border-b border-[#EFF0F2] pb-5">
                            <h2 className="text-xl font-semibold">
                                등록자 정보
                            </h2>

                            <p className="mt-2 text-sm text-[#7A818D]">
                                연락 가능한 정보를 정확하게 입력해 주세요.
                            </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <fieldset className="md:col-span-2">
                                <legend className={labelStyle}>
                                    등록자 구분{" "}
                                    <span className="text-[#D45643]">
                                        *
                                    </span>
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
                                            className="h-4 w-4 accent-[#20242C]"
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
                                            className="h-4 w-4 accent-[#20242C]"
                                        />
                                        개인
                                    </label>
                                </div>
                            </fieldset>

                            <label className={labelStyle}>
                                사찰·기관명 또는 등록자명{" "}
                                <span className="text-[#D45643]">*</span>
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
                                담당자명{" "}
                                <span className="text-[#D45643]">*</span>
                                <input
                                    className={inputStyle}
                                    type="text"
                                    value={formData.managerName}
                                    onChange={handleTextChange(
                                        "managerName",
                                    )}
                                    placeholder="담당자 이름"
                                    required
                                />
                            </label>

                            <label className={labelStyle}>
                                연락처{" "}
                                <span className="text-[#D45643]">*</span>
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
                    </section>

                    <section className="rounded-3xl border border-[#E8EAEE] bg-white p-5 shadow-[0_8px_30px_rgba(25,30,40,0.04)] md:p-8">
                        <div className="mb-7 border-b border-[#EFF0F2] pb-5">
                            <h2 className="text-xl font-semibold">
                                행사 기본 정보
                            </h2>

                            <p className="mt-2 text-sm text-[#7A818D]">
                                목록과 상세 페이지에 표시될 내용입니다.
                            </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <label className={labelStyle}>
                                행사 구분{" "}
                                <span className="text-[#D45643]">*</span>
                                <select
                                    className={inputStyle}
                                    value={formData.eventType}
                                    onChange={handleTextChange("eventType")}
                                    required
                                >
                                    <option value="" disabled>
                                        구분을 선택해 주세요
                                    </option>
                                    <option value="문화행사">
                                        문화행사
                                    </option>
                                    <option value="교육">교육</option>
                                    <option value="체험">체험</option>
                                    <option value="법회">법회</option>
                                    <option value="기타">기타</option>
                                </select>
                            </label>

                            <label className={labelStyle}>
                                행사명{" "}
                                <span className="text-[#D45643]">*</span>
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
                                <span className="text-[#D45643]">*</span>
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
                                <span className="text-[#D45643]">*</span>
                                <input
                                    className={inputStyle}
                                    type="text"
                                    value={formData.place}
                                    onChange={handleTextChange("place")}
                                    placeholder="예: 연화사 야외마당"
                                    required
                                />
                            </label>

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
                    </section>

                    <section className="rounded-3xl border border-[#E8EAEE] bg-white p-5 shadow-[0_8px_30px_rgba(25,30,40,0.04)] md:p-8">
                        <div className="mb-7 border-b border-[#EFF0F2] pb-5">
                            <h2 className="text-xl font-semibold">
                                상세 내용
                            </h2>

                            <p className="mt-2 text-sm text-[#7A818D]">
                                방문자가 이해하기 쉽도록 간결하게 작성해
                                주세요.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <label className={labelStyle}>
                                행사 소개{" "}
                                <span className="text-[#D45643]">*</span>
                                <textarea
                                    className={`${inputStyle} min-h-36 resize-y`}
                                    value={formData.introduction}
                                    onChange={handleTextChange(
                                        "introduction",
                                    )}
                                    placeholder="행사의 취지와 주요 내용을 소개해 주세요."
                                    required
                                />
                            </label>

                            <label className={labelStyle}>
                                일정·프로그램
                                <textarea
                                    className={`${inputStyle} min-h-32 resize-y`}
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
                                    className={`${inputStyle} min-h-28 resize-y`}
                                    value={formData.applicationMethod}
                                    onChange={handleTextChange(
                                        "applicationMethod",
                                    )}
                                    placeholder="신청 링크, 전화 접수 등 참여 방법을 안내해 주세요."
                                />
                            </label>
                        </div>
                    </section>

                    <section className="rounded-3xl border border-[#E8EAEE] bg-white p-5 shadow-[0_8px_30px_rgba(25,30,40,0.04)] md:p-8">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold">
                                대표 이미지
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-[#7A818D]">
                                가로형 사진을 권장합니다. JPG, PNG, WEBP
                                파일을 사용할 수 있어요.
                            </p>
                        </div>

                        <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#C9CED6] bg-[#FAFAFB] px-5 text-center transition hover:border-[#B8A000] hover:bg-[#FFFDF0]">
                            <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F54A] text-xl">
                                +
                            </span>

                            <span className="text-sm font-medium">
                                이미지 선택
                            </span>

                            <span className="mt-1 text-xs text-[#8A919D]">
                                권장 크기 1600 × 700px
                            </span>

                            <span className="mt-2 text-xs text-[#A06B28]">
                                임시 저장 복구 후에는 이미지를 다시 선택해야
                                합니다.
                            </span>

                            <input
                                ref={fileInputRef}
                                className="sr-only"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                            />
                        </label>
                    </section>

                    <section className="rounded-3xl border border-[#E8EAEE] bg-white p-5 md:p-7">
                        <label className="flex items-start gap-3 text-sm leading-6 text-[#535B67]">
                            <input
                                type="checkbox"
                                checked={formData.agreement}
                                onChange={(event) =>
                                    updateField(
                                        "agreement",
                                        event.target.checked,
                                    )
                                }
                                className="mt-1 h-4 w-4 shrink-0 accent-[#20242C]"
                                required
                            />

                            <span>
                                등록한 내용이 사이트에 공개되는 것에 동의하며,
                                행사 정보가 정확함을 확인했습니다.
                            </span>
                        </label>
                    </section>

                    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <Link
                            href="/events"
                            className="rounded-xl border border-[#D9DDE3] bg-white px-7 py-4 text-center text-sm font-medium text-[#4D5562]"
                        >
                            취소
                        </Link>

                        <button
                            type="submit"
                            className="rounded-xl bg-[#20242C] px-8 py-4 text-sm font-medium text-white transition hover:bg-[#11151B]"
                        >
                            등록하기
                        </button>
                    </div>
                </form>
            </section>

            {showRestoreDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-5">
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="restore-draft-title"
                        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)] md:p-7"
                    >
                        <p className="text-sm font-medium text-[#7A6A00]">
                            임시 저장된 작업
                        </p>

                        <h2
                            id="restore-draft-title"
                            className="mt-2 text-2xl font-semibold"
                        >
                            이전에 작성하던 내용이 있어요
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-[#68707D]">
                            마지막으로 작성한 내용을 이어서 작성할까요?
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
