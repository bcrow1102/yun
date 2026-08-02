import Link from "next/link";

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

export default function NewJobPage() {
    return (
        <main className="min-h-screen bg-[#F7F8FA] text-[#252A31]">
            <header className="border-b border-[#E7E9EC] bg-white">
                <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 md:h-[72px] md:px-8">
                    <Link href="/" className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F4F54A] md:h-10 md:w-10">
                            <LotusIcon />
                        </span>
                        <span className="text-xl font-semibold">연</span>
                    </Link>

                    <Link
                        href="/jobs"
                        className="rounded-xl border border-[#E3E8EF] px-4 py-2.5 text-sm font-medium text-[#4E5968]"
                    >
                        구인 목록
                    </Link>
                </div>
            </header>

            <section className="border-b border-[#E8EA8A] bg-[#FDFDC7]">
                <div className="mx-auto max-w-4xl px-5 py-10 md:px-8 md:py-14">
                    <p className="text-sm font-medium text-[#766900]">구인 공고 등록</p>

                    <h1 className="mt-3 break-keep text-[31px] font-semibold tracking-[-0.045em] md:text-[44px]">
                        함께할 분을 찾고 계신가요?
                    </h1>

                    <p className="mt-4 break-keep text-[15px] leading-7 text-[#667085]">
                        필요한 내용을 간단하게 작성해 주세요.
                    </p>
                </div>
            </section>

            <form className="mx-auto grid max-w-4xl gap-5 px-4 py-8 md:px-8 md:py-12">
                <section className="rounded-[24px] border border-[#E3E8EF] bg-white p-5 md:p-8">
                    <div className="border-b border-[#EEF0F2] pb-5">
                        <p className="text-xs font-medium text-[#8D8040]">01</p>
                        <h2 className="mt-1 text-[22px] font-medium">기본 정보</h2>
                    </div>

                    <div className="mt-6 grid gap-6">
                        <label className={labelStyle}>
                            기관·사찰명 <span className="text-[#E5484D]">*</span>
                            <input
                                name="organizationName"
                                type="text"
                                required
                                placeholder="기관 또는 사찰 이름"
                                className={inputStyle}
                            />
                        </label>

                        <label className={labelStyle}>
                            구인 제목 <span className="text-[#E5484D]">*</span>
                            <input
                                name="title"
                                type="text"
                                required
                                placeholder="구인 제목"
                                className={inputStyle}
                            />
                        </label>

                        <div className="grid gap-6 md:grid-cols-2">
                            <label className={labelStyle}>
                                지역 <span className="text-[#E5484D]">*</span>
                                <select
                                    name="location"
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
                                    <option>해외</option>
                                </select>
                            </label>

                            <label className={labelStyle}>
                                고용 형태 <span className="text-[#E5484D]">*</span>
                                <select
                                    name="employmentType"
                                    required
                                    defaultValue=""
                                    className={inputStyle}
                                >
                                    <option value="" disabled>
                                        고용 형태 선택
                                    </option>
                                    <option value="fullTime">정규직</option>
                                    <option value="contract">계약직</option>
                                    <option value="partTime">시간제</option>
                                    <option value="volunteer">봉사</option>
                                    <option value="other">기타</option>
                                </select>
                            </label>
                        </div>
                    </div>
                </section>

                <section className="rounded-[24px] border border-[#E3E8EF] bg-white p-5 md:p-8">
                    <div className="border-b border-[#EEF0F2] pb-5">
                        <p className="text-xs font-medium text-[#8D8040]">02</p>
                        <h2 className="mt-1 text-[22px] font-medium">모집 내용</h2>
                    </div>

                    <label className={`${labelStyle} mt-6`}>
                        모집 내용 <span className="text-[#E5484D]">*</span>
                        <textarea
                            name="content"
                            required
                            rows={12}
                            placeholder="모집 내용을 자유롭게 작성해 주세요."
                            className={`${inputStyle} resize-y leading-7`}
                        />
                    </label>
                </section>

                <section className="rounded-[24px] border border-[#E3E8EF] bg-white p-5 md:p-8">
                    <div className="border-b border-[#EEF0F2] pb-5">
                        <p className="text-xs font-medium text-[#8D8040]">03</p>
                        <h2 className="mt-1 text-[22px] font-medium">지원 방법</h2>
                    </div>

                    <div className="mt-6 grid gap-6">
                        <label className={labelStyle}>
                            지원 방식 <span className="text-[#E5484D]">*</span>
                            <select
                                name="applicationMethod"
                                required
                                defaultValue=""
                                className={inputStyle}
                            >
                                <option value="" disabled>
                                    지원 방식 선택
                                </option>
                                <option value="phone">전화</option>
                                <option value="email">이메일</option>
                                <option value="external">외부 지원 페이지</option>
                                <option value="yun">연에서 직접 지원</option>
                            </select>
                        </label>

                        <label className={labelStyle}>
                            지원 연락처 또는 링크 <span className="text-[#E5484D]">*</span>
                            <input
                                name="applicationContact"
                                type="text"
                                required
                                placeholder="전화번호, 이메일 또는 링크"
                                className={inputStyle}
                            />
                        </label>

                        <label className="flex items-start gap-3 rounded-xl bg-[#F7F8FA] p-4 text-sm leading-6 text-[#667085]">
                            <input
                                name="privacyAgreement"
                                type="checkbox"
                                required
                                className="mt-1 h-4 w-4"
                            />
                            <span>
                                등록 확인을 위한 개인정보 수집 및 이용에 동의합니다.{" "}
                                <span className="text-[#E5484D]">(필수)</span>
                            </span>
                        </label>
                    </div>
                </section>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <Link
                        href="/jobs"
                        className="rounded-xl border border-[#DDE2E8] bg-white px-6 py-4 text-center text-sm font-medium"
                    >
                        취소
                    </Link>

                    <button
                        type="button"
                        className="rounded-xl bg-[#F4F54A] px-8 py-4 text-sm font-medium"
                    >
                        구인 등록 요청
                    </button>
                </div>
            </form>
        </main>
    );
}
