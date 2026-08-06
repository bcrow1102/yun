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

const inputStyle =
    "mt-2 w-full rounded-xl border border-[#DDE2E8] bg-white px-4 py-3.5 text-[15px] text-[#252A31] outline-none transition placeholder:text-[#A8B0BA] focus:border-[#B9BA28] focus:ring-2 focus:ring-[#F4F54A]/25";

const labelStyle = "block text-sm font-medium text-[#333D4B]";

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

type TempleGuideFormData = {
    templeName: string;
    region: string;
    orderName: string;
    address: string;
    introduction: string;
    phone: string;
    website: string;
    visitingHours: string;
    transportation: string;
    registrantName: string;
    registrantPhone: string;
    agreement: boolean;
};

const initialFormData: TempleGuideFormData = {
    templeName: "",
    region: "",
    orderName: "",
    address: "",
    introduction: "",
    phone: "",
    website: "",
    visitingHours: "",
    transportation: "",
    registrantName: "",
    registrantPhone: "",
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

export default function NewTempleGuidePage() {
    const [formData, setFormData] =
        useState<TempleGuideFormData>(initialFormData);

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
            <header className="border-b border-[#E7E9EC] bg-white">
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
                    <p className="text-sm font-medium text-[#5F610E]">
                        사찰 정보 등록
                    </p>

                    <h1 className="mt-3 text-[31px] font-semibold leading-tight tracking-[-0.045em] md:text-[44px]">
                        사찰을 소개해 주세요
                    </h1>

                    <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#667085]">
                        방문자가 사찰을 쉽게 찾고 필요한 정보를 확인할 수 있도록
                        작성해 주세요.
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

            <form
                className="mx-auto grid max-w-4xl gap-5 px-4 py-8 md:px-8 md:py-12"
                onSubmit={handleSubmit}
            >
                <section className="rounded-[24px] border border-[#E3E8EF] bg-white p-5 md:p-8">
                    <div className="border-b border-[#EEF0F2] pb-5">
                        <span className="text-xs font-medium text-[#8D8040]">
                            01
                        </span>

                        <h2 className="mt-1 text-[22px] font-medium">
                            사찰 기본 정보
                        </h2>
                    </div>

                    <div className="mt-6 grid gap-6">
                        <label className={labelStyle}>
                            사찰명{" "}
                            <span className="text-[#E5484D]">*</span>
                            <input
                                required
                                type="text"
                                value={formData.templeName}
                                onChange={handleTextChange("templeName")}
                                placeholder="사찰 이름"
                                className={inputStyle}
                            />
                        </label>

                        <div className="grid gap-6 md:grid-cols-2">
                            <label className={labelStyle}>
                                지역{" "}
                                <span className="text-[#E5484D]">*</span>
                                <select
                                    required
                                    value={formData.region}
                                    onChange={handleTextChange("region")}
                                    className={inputStyle}
                                >
                                    <option value="" disabled>
                                        지역 선택
                                    </option>
                                    <option value="서울">서울</option>
                                    <option value="경기">경기</option>
                                    <option value="인천">인천</option>
                                    <option value="강원">강원</option>
                                    <option value="충청">충청</option>
                                    <option value="전라">전라</option>
                                    <option value="경상">경상</option>
                                    <option value="제주">제주</option>
                                    <option value="해외">해외</option>
                                </select>
                            </label>

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

                        <label className={labelStyle}>
                            사찰 소개{" "}
                            <span className="text-[#E5484D]">*</span>
                            <textarea
                                required
                                rows={7}
                                value={formData.introduction}
                                onChange={handleTextChange("introduction")}
                                placeholder="사찰의 역사, 특징과 방문자가 알아두면 좋은 내용을 적어주세요."
                                className={`${inputStyle} resize-y leading-7`}
                            />
                        </label>
                    </div>
                </section>

                <section className="rounded-[24px] border border-[#E3E8EF] bg-white p-5 md:p-8">
                    <div className="border-b border-[#EEF0F2] pb-5">
                        <span className="text-xs font-medium text-[#8D8040]">
                            02
                        </span>

                        <h2 className="mt-1 text-[22px] font-medium">
                            방문 안내
                        </h2>
                    </div>

                    <div className="mt-6 grid gap-6 md:grid-cols-2">
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
                            홈페이지
                            <input
                                type="url"
                                value={formData.website}
                                onChange={handleTextChange("website")}
                                placeholder="https://"
                                className={inputStyle}
                            />
                        </label>

                        <label className={`${labelStyle} md:col-span-2`}>
                            운영·방문 시간
                            <input
                                type="text"
                                value={formData.visitingHours}
                                onChange={handleTextChange("visitingHours")}
                                placeholder="예: 매일 09:00~18:00"
                                className={inputStyle}
                            />
                        </label>

                        <label className={`${labelStyle} md:col-span-2`}>
                            교통 및 주차 안내
                            <textarea
                                rows={4}
                                value={formData.transportation}
                                onChange={handleTextChange("transportation")}
                                placeholder="대중교통, 주차 등 방문 방법"
                                className={`${inputStyle} resize-y leading-7`}
                            />
                        </label>
                    </div>
                </section>

                <section className="rounded-[24px] border border-[#E3E8EF] bg-white p-5 md:p-8">
                    <div className="border-b border-[#EEF0F2] pb-5">
                        <span className="text-xs font-medium text-[#8D8040]">
                            03
                        </span>

                        <h2 className="mt-1 text-[22px] font-medium">
                            사진과 등록자 정보
                        </h2>
                    </div>

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
                                임시 저장을 불러온 뒤에는 이미지를 다시 선택해야
                                합니다.
                            </span>
                        </label>

                        <div className="grid gap-6 md:grid-cols-2">
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
                                등록 내용 확인과 연락을 위한 개인정보 수집 및 이용에
                                동의합니다.{" "}
                                <span className="text-[#E5484D]">
                                    (필수)
                                </span>
                            </span>
                        </label>
                    </div>
                </section>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <Link
                        href="/temples/guide"
                        className="rounded-xl border border-[#DDE2E8] bg-white px-6 py-4 text-center text-sm font-medium"
                    >
                        취소
                    </Link>

                    <button
                        type="submit"
                        className="rounded-xl bg-[#20242C] px-8 py-4 text-sm font-medium text-white transition hover:bg-[#11151B]"
                    >
                        사찰 등록 요청
                    </button>
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
