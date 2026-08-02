import Link from "next/link";

const inputStyle =
    "mt-2 w-full rounded-xl border border-[#E3E6EB] bg-white px-4 py-3 text-[15px] text-[#20242C] outline-none transition placeholder:text-[#A0A6B0] focus:border-[#B9BA28] focus:ring-2 focus:ring-[#F4F54A]/25";

const labelStyle = "block text-sm font-medium text-[#343A46]";

export default function EventNewPage() {
    return (
        <main className="min-h-screen bg-[#F7F8FA] text-[#171B22]">
            <header className="border-b border-[#ECEEF1] bg-white">
                <div className="mx-auto flex h-[74px] max-w-[1180px] items-center justify-between px-5 md:px-8">
                    <Link href="/" className="flex items-center gap-3" aria-label="연 홈">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F4F54A]">
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
                        </span>
                        <span className="text-2xl font-semibold">연</span>
                    </Link>
                    <Link
                        href="/events"
                        className="rounded-full border border-[#DFE2E7] px-4 py-2 text-sm text-[#4D5562] transition hover:border-[#20242C] hover:text-[#20242C]"
                    >
                        행사·교육 목록
                    </Link>
                </div>
            </header>

            <section className="mx-auto max-w-[980px] px-5 py-10 md:px-8 md:py-16">
                <div className="mb-8">
                    <p className="mb-3 text-sm font-medium text-[#7A6A00]">
                        행사·교육 등록
                    </p>
                    <h1 className="text-[30px] font-semibold leading-tight md:text-[42px]">
                        새로운 소식을 알려주세요
                    </h1>
                    <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#68707D] md:text-base">
                        사찰의 문화행사, 교육, 체험 프로그램을 등록할 수 있습니다.
                        <br className="hidden md:block" /> 확인이 필요한 항목은 담당자가
                        연락드릴 수 있어요.
                    </p>
                </div>

                <form className="space-y-6">
                    <section className="rounded-3xl border border-[#E8EAEE] bg-white p-5 shadow-[0_8px_30px_rgba(25,30,40,0.04)] md:p-8">
                        <div className="mb-7 border-b border-[#EFF0F2] pb-5">
                            <h2 className="text-xl font-semibold">등록자 정보</h2>
                            <p className="mt-2 text-sm text-[#7A818D]">
                                연락 가능한 정보를 정확하게 입력해 주세요.
                            </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <fieldset className="md:col-span-2">
                                <legend className={labelStyle}>
                                    등록자 구분 <span className="text-[#D45643]">*</span>
                                </legend>
                                <div className="mt-3 grid grid-cols-2 gap-3">
                                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#D8DCE2] px-4 py-3 text-sm">
                                        <input
                                            type="radio"
                                            name="registrantType"
                                            defaultChecked
                                            className="h-4 w-4 accent-[#20242C]"
                                        />
                                        사찰·기관
                                    </label>
                                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#D8DCE2] px-4 py-3 text-sm">
                                        <input
                                            type="radio"
                                            name="registrantType"
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
                                    placeholder="예: 연화사"
                                    required
                                />
                            </label>
                            <label className={labelStyle}>
                                담당자명 <span className="text-[#D45643]">*</span>
                                <input
                                    className={inputStyle}
                                    type="text"
                                    placeholder="담당자 이름"
                                    required
                                />
                            </label>
                            <label className={labelStyle}>
                                연락처 <span className="text-[#D45643]">*</span>
                                <input
                                    className={inputStyle}
                                    type="tel"
                                    placeholder="010-0000-0000"
                                    required
                                />
                            </label>
                            <label className={labelStyle}>
                                이메일
                                <input
                                    className={inputStyle}
                                    type="email"
                                    placeholder="example@email.com"
                                />
                            </label>
                        </div>
                    </section>

                    <section className="rounded-3xl border border-[#E8EAEE] bg-white p-5 shadow-[0_8px_30px_rgba(25,30,40,0.04)] md:p-8">
                        <div className="mb-7 border-b border-[#EFF0F2] pb-5">
                            <h2 className="text-xl font-semibold">행사 기본 정보</h2>
                            <p className="mt-2 text-sm text-[#7A818D]">
                                목록과 상세 페이지에 표시될 내용입니다.
                            </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <label className={labelStyle}>
                                행사 구분 <span className="text-[#D45643]">*</span>
                                <select className={inputStyle} defaultValue="" required>
                                    <option value="" disabled>
                                        구분을 선택해 주세요
                                    </option>
                                    <option>문화행사</option>
                                    <option>교육</option>
                                    <option>체험</option>
                                    <option>법회</option>
                                    <option>기타</option>
                                </select>
                            </label>
                            <label className={labelStyle}>
                                행사명 <span className="text-[#D45643]">*</span>
                                <input
                                    className={inputStyle}
                                    type="text"
                                    placeholder="행사명을 입력해 주세요"
                                    required
                                />
                            </label>

                            <label className={labelStyle}>
                                시작 일시 <span className="text-[#D45643]">*</span>
                                <input className={inputStyle} type="datetime-local" required />
                            </label>
                            <label className={labelStyle}>
                                종료 일시
                                <input className={inputStyle} type="datetime-local" />
                            </label>

                            <label className={labelStyle}>
                                장소 <span className="text-[#D45643]">*</span>
                                <input
                                    className={inputStyle}
                                    type="text"
                                    placeholder="예: 연화사 야외마당"
                                    required
                                />
                            </label>
                            <label className={labelStyle}>
                                주소
                                <input
                                    className={inputStyle}
                                    type="text"
                                    placeholder="행사 장소의 주소"
                                />
                            </label>

                            <label className={labelStyle}>
                                참여 대상·정원
                                <input
                                    className={inputStyle}
                                    type="text"
                                    placeholder="예: 누구나 · 선착순 100명"
                                />
                            </label>
                            <label className={labelStyle}>
                                참가비
                                <input
                                    className={inputStyle}
                                    type="text"
                                    placeholder="예: 무료 또는 30,000원"
                                />
                            </label>
                        </div>
                    </section>

                    <section className="rounded-3xl border border-[#E8EAEE] bg-white p-5 shadow-[0_8px_30px_rgba(25,30,40,0.04)] md:p-8">
                        <div className="mb-7 border-b border-[#EFF0F2] pb-5">
                            <h2 className="text-xl font-semibold">상세 내용</h2>
                            <p className="mt-2 text-sm text-[#7A818D]">
                                방문자가 이해하기 쉽도록 간결하게 작성해 주세요.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <label className={labelStyle}>
                                행사 소개 <span className="text-[#D45643]">*</span>
                                <textarea
                                    className={`${inputStyle} min-h-36 resize-y`}
                                    placeholder="행사의 취지와 주요 내용을 소개해 주세요."
                                    required
                                />
                            </label>
                            <label className={labelStyle}>
                                일정·프로그램
                                <textarea
                                    className={`${inputStyle} min-h-32 resize-y`}
                                    placeholder={"예: 17:00 입장\n18:00 공연 시작\n20:00 종료"}
                                />
                            </label>
                            <label className={labelStyle}>
                                신청 방법
                                <textarea
                                    className={`${inputStyle} min-h-28 resize-y`}
                                    placeholder="신청 링크, 전화 접수 등 참여 방법을 안내해 주세요."
                                />
                            </label>
                        </div>
                    </section>

                    <section className="rounded-3xl border border-[#E8EAEE] bg-white p-5 shadow-[0_8px_30px_rgba(25,30,40,0.04)] md:p-8">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold">대표 이미지</h2>
                            <p className="mt-2 text-sm leading-6 text-[#7A818D]">
                                가로형 사진을 권장합니다. JPG, PNG, WEBP 파일을 사용할 수
                                있어요.
                            </p>
                        </div>
                        <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#C9CED6] bg-[#FAFAFB] px-5 text-center transition hover:border-[#B8A000] hover:bg-[#FFFDF0]">
                            <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F54A] text-xl">
                                +
                            </span>
                            <span className="text-sm font-medium">이미지 선택</span>
                            <span className="mt-1 text-xs text-[#8A919D]">
                                권장 크기 1600 × 700px
                            </span>
                            <input
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
                                className="mt-1 h-4 w-4 shrink-0 accent-[#20242C]"
                            />
                            <span>
                                등록한 내용이 사이트에 공개되는 것에 동의하며, 행사 정보가
                                정확함을 확인했습니다.
                            </span>
                        </label>
                    </section>

                    <div className="flex flex-col-reverse gap-3 pb-10 sm:flex-row sm:justify-end">
                        <Link
                            href="/events"
                            className="rounded-xl border border-[#D9DDE3] bg-white px-7 py-4 text-center text-sm font-medium text-[#4D5562]"
                        >
                            취소
                        </Link>
                        <button
                            type="button"
                            className="rounded-xl bg-[#F4F54A] px-8 py-4 text-sm font-medium text-[#171B22] transition hover:bg-[#E8EA35]"
                        >
                            등록하기
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
}
