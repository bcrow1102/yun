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

const inputStyle =
    "mt-2 w-full rounded-xl border border-[#DDE2E8] bg-white px-4 py-3.5 text-[15px] font-normal outline-none transition placeholder:text-[#A8B0BA] focus:border-[#B9BA28] focus:ring-2 focus:ring-[#F4F54A]/25";

const labelStyle = "block text-sm font-medium text-[#333D4B]";

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

export default function NewTempleFoodPage() {
    const [formData, setFormData] =
        useState<TempleFoodFormData>(initialFormData);

    const [showRestoreDialog, setShowRestoreDialog] = useState(false);
    const [pendingDraft, setPendingDraft] =
        useState<TempleFoodFormData | null>(null);

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
            loadDraft<TempleFoodFormData>("temple-food");

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
            const success = saveDraft("temple-food", formData);

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
                    | HTMLInputElement
                    | HTMLTextAreaElement
                    | HTMLSelectElement
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
        deleteDraft("temple-food");

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
            "저장된 사찰음식 작성 내용을 삭제하고 처음부터 작성할까요?",
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
        <div className="min-h-screen bg-[#F7F8FA] text-[#252A31]">
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
                        href="/temples/food"
                        className="rounded-xl border border-[#E3E8EF] bg-white px-4 py-2.5 text-sm font-medium text-[#4D5562] transition hover:border-[#20242C] hover:text-[#20242C]"
                    >
                        사찰음식
                    </Link>
                </div>
            </header>

            <main>
                <section className="border-b border-[#E8EA8A] bg-[#FDFDC7]">
                    <div className="mx-auto max-w-4xl px-5 py-10 md:px-8 md:py-14">
                        <span className="text-sm font-medium text-[#5F610E]">
                            프로그램 등록
                        </span>

                        <h1 className="mt-3 text-[31px] font-semibold leading-tight tracking-[-0.045em] md:text-[44px]">
                            사찰음식 프로그램 등록
                        </h1>

                        <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#667085]">
                            체험과 교육 및 행사 정보를 작성해 주시면 확인 후
                            사이트에 게시됩니다.
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
                    className="mx-auto max-w-4xl px-4 py-8 md:px-8 md:py-12"
                    onSubmit={handleSubmit}
                >
                    <section className="rounded-[24px] border border-[#E3E8EF] bg-white p-5 md:p-8">
                        <h2 className="text-xl font-medium">
                            기본 정보
                        </h2>

                        <div className="mt-6 grid gap-6">
                            <label className={labelStyle}>
                                프로그램명 *
                                <input
                                    type="text"
                                    required
                                    value={formData.programName}
                                    onChange={handleTextChange(
                                        "programName",
                                    )}
                                    placeholder="예: 계절 나물과 사찰 밥상 체험"
                                    className={inputStyle}
                                />
                            </label>

                            <label className={labelStyle}>
                                사찰 또는 운영기관 *
                                <input
                                    type="text"
                                    required
                                    value={formData.operatorName}
                                    onChange={handleTextChange(
                                        "operatorName",
                                    )}
                                    placeholder="사찰 또는 기관 이름"
                                    className={inputStyle}
                                />
                            </label>

                            <div className="grid gap-6 md:grid-cols-2">
                                <label className={labelStyle}>
                                    프로그램 유형 *
                                    <select
                                        required
                                        value={formData.programType}
                                        onChange={handleTextChange(
                                            "programType",
                                        )}
                                        className={inputStyle}
                                    >
                                        <option value="" disabled>
                                            유형 선택
                                        </option>
                                        <option value="experience">
                                            체험
                                        </option>
                                        <option value="education">
                                            교육
                                        </option>
                                        <option value="event">
                                            행사
                                        </option>
                                        <option value="class">
                                            강좌
                                        </option>
                                        <option value="family">
                                            가족 프로그램
                                        </option>
                                        <option value="english">
                                            영문 프로그램
                                        </option>
                                        <option value="other">
                                            기타
                                        </option>
                                    </select>
                                </label>

                                <label className={labelStyle}>
                                    지역 *
                                    <select
                                        required
                                        value={formData.region}
                                        onChange={handleTextChange(
                                            "region",
                                        )}
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
                                        <option value="온라인">
                                            온라인
                                        </option>
                                    </select>
                                </label>
                            </div>

                            <label className={labelStyle}>
                                진행 장소 및 주소 *
                                <input
                                    type="text"
                                    required
                                    value={formData.location}
                                    onChange={handleTextChange(
                                        "location",
                                    )}
                                    placeholder="프로그램 진행 장소와 주소"
                                    className={inputStyle}
                                />
                            </label>
                        </div>
                    </section>

                    <section className="mt-5 rounded-[24px] border border-[#E3E8EF] bg-white p-5 md:p-8">
                        <h2 className="text-xl font-medium">
                            일정과 참가 정보
                        </h2>

                        <div className="mt-6 grid gap-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <label className={labelStyle}>
                                    시작일 *
                                    <input
                                        type="date"
                                        required
                                        value={formData.startDate}
                                        onChange={handleTextChange(
                                            "startDate",
                                        )}
                                        className={inputStyle}
                                    />
                                </label>

                                <label className={labelStyle}>
                                    종료일 *
                                    <input
                                        type="date"
                                        required
                                        value={formData.endDate}
                                        onChange={handleTextChange(
                                            "endDate",
                                        )}
                                        className={inputStyle}
                                    />
                                </label>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <label className={labelStyle}>
                                    시작 시간
                                    <input
                                        type="time"
                                        value={formData.startTime}
                                        onChange={handleTextChange(
                                            "startTime",
                                        )}
                                        className={inputStyle}
                                    />
                                </label>

                                <label className={labelStyle}>
                                    모집 인원
                                    <input
                                        type="number"
                                        min="1"
                                        value={formData.capacity}
                                        onChange={handleTextChange(
                                            "capacity",
                                        )}
                                        placeholder="예: 20"
                                        className={inputStyle}
                                    />
                                </label>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <label className={labelStyle}>
                                    참가비
                                    <input
                                        type="text"
                                        value={formData.fee}
                                        onChange={handleTextChange("fee")}
                                        placeholder="예: 30,000원 또는 무료"
                                        className={inputStyle}
                                    />
                                </label>

                                <label className={labelStyle}>
                                    신청 마감일
                                    <input
                                        type="date"
                                        value={formData.deadline}
                                        onChange={handleTextChange(
                                            "deadline",
                                        )}
                                        className={inputStyle}
                                    />
                                </label>
                            </div>
                        </div>
                    </section>

                    <section className="mt-5 rounded-[24px] border border-[#E3E8EF] bg-white p-5 md:p-8">
                        <h2 className="text-xl font-medium">
                            프로그램 소개
                        </h2>

                        <div className="mt-6 grid gap-6">
                            <label className={labelStyle}>
                                대표 이미지
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
                                    className="mt-2 block w-full rounded-xl border border-dashed border-[#C9D0D8] bg-[#F7F8FA] px-4 py-6 text-sm font-normal"
                                />

                                <span className="mt-2 block text-xs font-normal leading-5 text-[#A06B28]">
                                    임시 저장을 불러온 뒤에는 이미지를 다시
                                    선택해야 합니다.
                                </span>
                            </label>

                            <label className={labelStyle}>
                                상세 설명 *
                                <textarea
                                    required
                                    rows={8}
                                    value={formData.description}
                                    onChange={handleTextChange(
                                        "description",
                                    )}
                                    placeholder="프로그램 내용, 준비물, 신청 대상과 안내사항을 작성해 주세요."
                                    className={`${inputStyle} resize-y leading-7`}
                                />
                            </label>

                            <label className={labelStyle}>
                                신청 링크
                                <input
                                    type="url"
                                    value={formData.applicationUrl}
                                    onChange={handleTextChange(
                                        "applicationUrl",
                                    )}
                                    placeholder="https://"
                                    className={inputStyle}
                                />
                            </label>
                        </div>
                    </section>

                    <section className="mt-5 rounded-[24px] border border-[#E3E8EF] bg-white p-5 md:p-8">
                        <h2 className="text-xl font-medium">
                            담당자 정보
                        </h2>

                        <div className="mt-6 grid gap-6">
                            <label className={labelStyle}>
                                담당자 이름 *
                                <input
                                    type="text"
                                    required
                                    value={formData.managerName}
                                    onChange={handleTextChange(
                                        "managerName",
                                    )}
                                    placeholder="담당자 또는 관계자 이름"
                                    className={inputStyle}
                                />
                            </label>

                            <div className="grid gap-6 md:grid-cols-2">
                                <label className={labelStyle}>
                                    전화번호 *
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={handleTextChange(
                                            "phone",
                                        )}
                                        placeholder="010-0000-0000"
                                        className={inputStyle}
                                    />
                                </label>

                                <label className={labelStyle}>
                                    이메일
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={handleTextChange(
                                            "email",
                                        )}
                                        placeholder="example@email.com"
                                        className={inputStyle}
                                    />
                                </label>
                            </div>

                            <label className="flex items-start gap-3 rounded-xl bg-[#F7F8FA] p-4 text-sm font-normal leading-6 text-[#667085]">
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
                                    className="mt-1 h-4 w-4"
                                />

                                <span>
                                    등록 확인과 연락을 위한 개인정보 수집 및
                                    이용에 동의합니다. *
                                </span>
                            </label>
                        </div>
                    </section>

                    <div className="mt-6 rounded-[20px] bg-[#FDFDC7] p-5">
                        <span className="text-sm font-medium">
                            등록 전 확인해 주세요
                        </span>

                        <p className="mt-2 text-sm leading-6 text-[#5F610E]">
                            제출된 내용은 관리자 확인 후 공개됩니다. 허위
                            정보나 관련 없는 광고는 게시되지 않을 수 있습니다.
                        </p>
                    </div>

                    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <Link
                            href="/temples/food"
                            className="rounded-xl border border-[#DDE2E8] bg-white px-6 py-4 text-center text-sm font-medium"
                        >
                            취소
                        </Link>

                        <button
                            type="submit"
                            className="rounded-xl bg-[#20242C] px-8 py-4 text-sm font-medium text-white transition hover:bg-[#11151B]"
                        >
                            등록 요청 보내기
                        </button>
                    </div>
                </form>
            </main>

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
        </div>
    );
}
