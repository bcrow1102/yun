import Link from "next/link";
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

export default function NewTempleFoodPage() {
    return (
        <div className="min-h-screen bg-[#F7F8FA] text-[#252A31]">
            <header className="border-b border-[#E7E9EC] bg-white">
                <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 md:px-8">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F4F54A] text-[#191F28]">
                            <LotusIcon />
                        </span>

                        <span className="text-lg font-medium">연</span>
                    </Link>

                    <Link
                        href="/temples/food"
                        className="rounded-xl border border-[#E3E8EF] px-4 py-2.5 text-sm"
                    >
                        사찰음식
                    </Link>
                </div>
            </header>

            <main>
                <section className="border-b border-[#E8EA8A] bg-[#FDFDC7]">
                    <div className="mx-auto max-w-4xl px-5 py-10 md:px-8 md:py-14">
                        <span className="text-sm text-[#786B5A]">
                            프로그램 등록
                        </span>

                        <h1 className="mt-3 text-[30px] font-semibold leading-tight tracking-[-0.04em] md:text-[42px]">
                            사찰음식 프로그램 등록
                        </h1>

                        <p className="mt-4 text-[15px] leading-7 text-[#667085]">
                            체험과 교육 및 행사 정보를 작성해 주시면 확인 후
                            사이트에 게시됩니다.
                        </p>
                    </div>
                </section>

                <form className="mx-auto max-w-4xl px-4 py-8 md:px-8">
                    <section className="rounded-[22px] border border-[#E3E8EF] bg-white p-5 md:p-8">
                        <h2 className="text-xl font-medium">기본 정보</h2>

                        <div className="mt-6 grid gap-6">
                            <label className={labelStyle}>
                                프로그램명 *
                                <input
                                    type="text"
                                    required
                                    placeholder="예: 계절 나물과 사찰 밥상 체험"
                                    className={inputStyle}
                                />
                            </label>

                            <label className={labelStyle}>
                                사찰 또는 운영기관 *
                                <input
                                    type="text"
                                    required
                                    placeholder="사찰 또는 기관 이름"
                                    className={inputStyle}
                                />
                            </label>

                            <div className="grid gap-6 md:grid-cols-2">
                                <label className={labelStyle}>
                                    프로그램 유형 *
                                    <select
                                        required
                                        defaultValue=""
                                        className={inputStyle}
                                    >
                                        <option value="" disabled>
                                            유형 선택
                                        </option>
                                        <option value="experience">체험</option>
                                        <option value="education">교육</option>
                                        <option value="event">행사</option>
                                        <option value="class">강좌</option>
                                        <option value="family">
                                            가족 프로그램
                                        </option>
                                        <option value="english">
                                            영문 프로그램
                                        </option>
                                        <option value="other">기타</option>
                                    </select>
                                </label>

                                <label className={labelStyle}>
                                    지역 *
                                    <select
                                        required
                                        defaultValue=""
                                        className={inputStyle}
                                    >
                                        <option value="" disabled>
                                            지역 선택
                                        </option>
                                        <option>서울</option>
                                        <option>경기</option>
                                        <option>인천</option>
                                        <option>강원</option>
                                        <option>충청</option>
                                        <option>전라</option>
                                        <option>경상</option>
                                        <option>제주</option>
                                        <option>온라인</option>
                                    </select>
                                </label>
                            </div>

                            <label className={labelStyle}>
                                진행 장소 및 주소 *
                                <input
                                    type="text"
                                    required
                                    placeholder="프로그램 진행 장소와 주소"
                                    className={inputStyle}
                                />
                            </label>
                        </div>
                    </section>

                    <section className="mt-5 rounded-[22px] border border-[#E3E8EF] bg-white p-5 md:p-8">
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
                                        className={inputStyle}
                                    />
                                </label>

                                <label className={labelStyle}>
                                    종료일 *
                                    <input
                                        type="date"
                                        required
                                        className={inputStyle}
                                    />
                                </label>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <label className={labelStyle}>
                                    시작 시간
                                    <input
                                        type="time"
                                        className={inputStyle}
                                    />
                                </label>

                                <label className={labelStyle}>
                                    모집 인원
                                    <input
                                        type="number"
                                        min="1"
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
                                        placeholder="예: 30,000원 또는 무료"
                                        className={inputStyle}
                                    />
                                </label>

                                <label className={labelStyle}>
                                    신청 마감일
                                    <input
                                        type="date"
                                        className={inputStyle}
                                    />
                                </label>
                            </div>
                        </div>
                    </section>

                    <section className="mt-5 rounded-[22px] border border-[#E3E8EF] bg-white p-5 md:p-8">
                        <h2 className="text-xl font-medium">
                            프로그램 소개
                        </h2>

                        <div className="mt-6 grid gap-6">
                            <label className={labelStyle}>
                                대표 이미지
                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
                                    className="mt-2 block w-full rounded-xl border border-dashed border-[#C9D0D8] bg-[#F7F8FA] px-4 py-6 text-sm font-normal"
                                />
                            </label>

                            <label className={labelStyle}>
                                상세 설명 *
                                <textarea
                                    required
                                    rows={8}
                                    placeholder="프로그램 내용, 준비물, 신청 대상과 안내사항을 작성해 주세요."
                                    className={`${inputStyle} resize-y leading-7`}
                                />
                            </label>

                            <label className={labelStyle}>
                                신청 링크
                                <input
                                    type="url"
                                    placeholder="https://"
                                    className={inputStyle}
                                />
                            </label>
                        </div>
                    </section>

                    <section className="mt-5 rounded-[22px] border border-[#E3E8EF] bg-white p-5 md:p-8">
                        <h2 className="text-xl font-medium">담당자 정보</h2>

                        <div className="mt-6 grid gap-6">
                            <label className={labelStyle}>
                                담당자 이름 *
                                <input
                                    type="text"
                                    required
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
                                        placeholder="010-0000-0000"
                                        className={inputStyle}
                                    />
                                </label>

                                <label className={labelStyle}>
                                    이메일
                                    <input
                                        type="email"
                                        placeholder="example@email.com"
                                        className={inputStyle}
                                    />
                                </label>
                            </div>

                            <label className="flex items-start gap-3 rounded-xl bg-[#F7F8FA] p-4 text-sm font-normal leading-6 text-[#667085]">
                                <input
                                    type="checkbox"
                                    required
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

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <Link
                            href="/temples/food"
                            className="rounded-xl border border-[#DDE2E8] bg-white px-6 py-4 text-center text-sm font-medium"
                        >
                            취소
                        </Link>

                        <button
                            type="button"
                            className="rounded-xl bg-[#F4F54A] px-8 py-4 text-sm font-medium"
                        >
                            등록 요청 보내기
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
