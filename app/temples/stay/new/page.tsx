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

const inputClassName =
    "mt-2 w-full rounded-xl border border-[#DDE2E8] bg-white px-4 py-3.5 text-[15px] outline-none transition placeholder:text-[#A8B0BA] focus:border-[#B9BA28] focus:ring-2 focus:ring-[#F4F54A]/25";

const labelClassName =
    "block text-sm font-medium text-[#333D4B]";

export default function NewTempleStayPage() {
    return (
        <div className="min-h-screen bg-[#F7F8FA] text-[#252A31]">
            <header className="sticky top-0 z-30 border-b border-[#E7E9EC] bg-white/95 backdrop-blur">
                <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 md:h-[72px] md:px-8">
                    <Link href="/" className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F4F54A] md:h-10 md:w-10">
                            <LotusIcon />
                        </span>

                        <strong className="text-xl font-medium">연</strong>
                    </Link>

                    <Link
                        href="/temples/stay"
                        className="rounded-xl border border-[#E3E8EF] bg-white px-4 py-2.5 text-sm font-semibold"
                    >
                        템플스테이
                    </Link>
                </div>
            </header>

            <main>
                <section className="border-b border-[#E8EA8A] bg-[#FDFDC7]">
                    <div className="mx-auto max-w-4xl px-5 py-10 md:px-8 md:py-14">
                        <span className="text-sm font-medium text-[#7A6D00]">
                            프로그램 등록
                        </span>

                        <h1 className="mt-3 text-[31px] font-semibold leading-tight tracking-[-0.045em] md:text-[44px]">
                            템플스테이 프로그램 등록
                        </h1>

                        <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#667085]">
                            프로그램 정보를 작성해 주시면 확인 후 사이트에
                            게시됩니다. 정확한 연락처와 행사 일정을 입력해 주세요.
                        </p>
                    </div>
                </section>

                <form className="mx-auto max-w-4xl px-4 py-8 md:px-8 md:py-12">
                    <section className="rounded-[24px] border border-[#E3E8EF] bg-white p-5 md:p-8">
                        <div className="border-b border-[#EEF0F2] pb-5">
                            <span className="text-xs font-medium text-[#8D8040]">
                                01
                            </span>

                            <h2 className="mt-1 text-[22px] font-medium">
                                기본 정보
                            </h2>

                            <p className="mt-2 text-sm text-[#8B95A1]">
                                프로그램을 소개할 기본 정보를 입력해 주세요.
                            </p>
                        </div>

                        <div className="mt-6 grid gap-6">
                            <label className={labelClassName}>
                                프로그램명
                                <span className="ml-1 text-[#E5484D]">*</span>

                                <input
                                    type="text"
                                    required
                                    placeholder="예: 월정사 숲속 힐링 템플스테이"
                                    className={inputClassName}
                                />
                            </label>

                            <label className={labelClassName}>
                                사찰 또는 운영기관
                                <span className="ml-1 text-[#E5484D]">*</span>

                                <input
                                    type="text"
                                    required
                                    placeholder="사찰 또는 기관 이름"
                                    className={inputClassName}
                                />
                            </label>

                            <div className="grid gap-6 md:grid-cols-2">
                                <label className={labelClassName}>
                                    프로그램 유형
                                    <span className="ml-1 text-[#E5484D]">*</span>

                                    <select
                                        required
                                        defaultValue=""
                                        className={inputClassName}
                                    >
                                        <option value="" disabled>
                                            유형을 선택해 주세요
                                        </option>
                                        <option value="rest">휴식형</option>
                                        <option value="experience">체험형</option>
                                        <option value="day">당일형</option>
                                        <option value="training">수련형</option>
                                        <option value="family">가족형</option>
                                        <option value="other">기타</option>
                                    </select>
                                </label>

                                <label className={labelClassName}>
                                    지역
                                    <span className="ml-1 text-[#E5484D]">*</span>

                                    <select
                                        required
                                        defaultValue=""
                                        className={inputClassName}
                                    >
                                        <option value="" disabled>
                                            지역을 선택해 주세요
                                        </option>
                                        <option value="seoul">서울</option>
                                        <option value="gyeonggi">경기</option>
                                        <option value="incheon">인천</option>
                                        <option value="gangwon">강원</option>
                                        <option value="chungcheong">충청</option>
                                        <option value="jeolla">전라</option>
                                        <option value="gyeongsang">경상</option>
                                        <option value="jeju">제주</option>
                                    </select>
                                </label>
                            </div>

                            <label className={labelClassName}>
                                주소
                                <span className="ml-1 text-[#E5484D]">*</span>

                                <input
                                    type="text"
                                    required
                                    placeholder="프로그램이 진행되는 주소"
                                    className={inputClassName}
                                />
                            </label>
                        </div>
                    </section>

                    <section className="mt-5 rounded-[24px] border border-[#E3E8EF] bg-white p-5 md:p-8">
                        <div className="border-b border-[#EEF0F2] pb-5">
                            <span className="text-xs font-medium text-[#8D8040]">
                                02
                            </span>

                            <h2 className="mt-1 text-[22px] font-medium">
                                일정과 참가 정보
                            </h2>
                        </div>

                        <div className="mt-6 grid gap-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <label className={labelClassName}>
                                    시작일
                                    <span className="ml-1 text-[#E5484D]">*</span>

                                    <input
                                        type="date"
                                        required
                                        className={inputClassName}
                                    />
                                </label>

                                <label className={labelClassName}>
                                    종료일
                                    <span className="ml-1 text-[#E5484D]">*</span>

                                    <input
                                        type="date"
                                        required
                                        className={inputClassName}
                                    />
                                </label>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <label className={labelClassName}>
                                    기간
                                    <input
                                        type="text"
                                        placeholder="예: 당일 또는 1박 2일"
                                        className={inputClassName}
                                    />
                                </label>

                                <label className={labelClassName}>
                                    모집 인원
                                    <input
                                        type="number"
                                        min="1"
                                        placeholder="예: 20"
                                        className={inputClassName}
                                    />
                                </label>
                            </div>

                            <label className={labelClassName}>
                                참가비
                                <input
                                    type="text"
                                    placeholder="예: 50,000원 또는 무료"
                                    className={inputClassName}
                                />
                            </label>
                        </div>
                    </section>

                    <section className="mt-5 rounded-[24px] border border-[#E3E8EF] bg-white p-5 md:p-8">
                        <div className="border-b border-[#EEF0F2] pb-5">
                            <span className="text-xs font-medium text-[#8D8040]">
                                03
                            </span>

                            <h2 className="mt-1 text-[22px] font-medium">
                                프로그램 소개
                            </h2>
                        </div>

                        <div className="mt-6 grid gap-6">
                            <label className={labelClassName}>
                                대표 이미지
                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
                                    className="mt-2 block w-full rounded-xl border border-dashed border-[#C9D0D8] bg-[#F7F8FA] px-4 py-6 text-sm text-[#667085]"
                                />

                                <span className="mt-2 block text-xs font-normal leading-5 text-[#8B95A1]">
                                    JPG, PNG 또는 WebP 이미지를 등록해 주세요.
                                </span>
                            </label>

                            <label className={labelClassName}>
                                상세 설명
                                <span className="ml-1 text-[#E5484D]">*</span>

                                <textarea
                                    required
                                    rows={8}
                                    placeholder="프로그램 일정, 주요 활동, 준비물 및 참가자 안내사항 등을 자세히 작성해 주세요."
                                    className={`${inputClassName} resize-y leading-7`}
                                />
                            </label>

                            <label className={labelClassName}>
                                신청 링크
                                <input
                                    type="url"
                                    placeholder="https://"
                                    className={inputClassName}
                                />
                            </label>
                        </div>
                    </section>

                    <section className="mt-5 rounded-[24px] border border-[#E3E8EF] bg-white p-5 md:p-8">
                        <div className="border-b border-[#EEF0F2] pb-5">
                            <span className="text-xs font-medium text-[#8D8040]">
                                04
                            </span>

                            <h2 className="mt-1 text-[22px] font-medium">
                                담당자 정보
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-[#8B95A1]">
                                등록 내용 확인을 위해 연락 가능한 정보를 입력해
                                주세요.
                            </p>
                        </div>

                        <div className="mt-6 grid gap-6">
                            <label className={labelClassName}>
                                담당자 이름
                                <span className="ml-1 text-[#E5484D]">*</span>

                                <input
                                    type="text"
                                    required
                                    placeholder="담당자 또는 관계자 이름"
                                    className={inputClassName}
                                />
                            </label>

                            <div className="grid gap-6 md:grid-cols-2">
                                <label className={labelClassName}>
                                    전화번호
                                    <span className="ml-1 text-[#E5484D]">*</span>

                                    <input
                                        type="tel"
                                        required
                                        placeholder="010-0000-0000"
                                        className={inputClassName}
                                    />
                                </label>

                                <label className={labelClassName}>
                                    이메일
                                    <input
                                        type="email"
                                        placeholder="example@email.com"
                                        className={inputClassName}
                                    />
                                </label>
                            </div>

                            <label className="flex items-start gap-3 rounded-xl bg-[#F7F8FA] p-4 text-sm leading-6 text-[#667085]">
                                <input
                                    type="checkbox"
                                    required
                                    className="mt-1 h-4 w-4"
                                />

                                <span>
                                    등록 내용 확인과 연락을 위한 개인정보 수집 및
                                    이용에 동의합니다.
                                    <span className="ml-1 text-[#E5484D]">
                                        *
                                    </span>
                                </span>
                            </label>
                        </div>
                    </section>

                    <div className="mt-6 rounded-[22px] bg-[#FDFDC7] p-5">
                        <strong className="text-sm">
                            등록 전 확인해 주세요
                        </strong>

                        <p className="mt-2 text-sm leading-6 text-[#6D6200]">
                            제출된 프로그램은 관리자 확인 후 공개됩니다. 허위
                            정보나 프로그램과 관련 없는 광고는 게시되지 않을 수
                            있습니다.
                        </p>
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <Link
                            href="/temples/stay"
                            className="rounded-xl border border-[#DDE2E8] bg-white px-6 py-4 text-center text-sm font-medium"
                        >
                            취소
                        </Link>

                        <button
                            type="button"
                            className="rounded-xl bg-[#F4F54A] px-8 py-4 text-sm font-medium text-[#191F28]"
                        >
                            등록 요청 보내기
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
