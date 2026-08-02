import Link from "next/link";

const inputStyle =
    "mt-2 w-full rounded-xl border border-[#DDE2E8] bg-white px-4 py-3.5 text-[15px] text-[#252A31] outline-none transition placeholder:text-[#A8B0BA] focus:border-[#B9BA28] focus:ring-2 focus:ring-[#F4F54A]/25";

const labelStyle = "block text-sm font-medium text-[#333D4B]";

function LotusIcon() {
    return (
        <svg viewBox="0 0 32 32" fill="none" className="h-6 w-6">
            <path d="M16 24c-4-4.1-5.2-8.2 0-15 5.2 6.8 4 10.9 0 15Z" stroke="currentColor" strokeWidth="1.6" />
            <path d="M15 24C9.5 23.3 6.6 20.5 7 14c5.4.7 8.1 4 8 10Z" stroke="currentColor" strokeWidth="1.6" />
            <path d="M17 24c5.5-.7 8.4-3.5 8-10-5.4.7-8.1 4-8 10Z" stroke="currentColor" strokeWidth="1.6" />
            <path d="M7 25h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
    );
}

export default function NewTempleGuidePage() {
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

                    <Link href="/temples/guide" className="rounded-xl border border-[#E3E8EF] bg-white px-4 py-2.5 text-sm font-medium">
                        사찰 안내
                    </Link>
                </div>
            </header>

            <section className="border-b border-[#E8EA8A] bg-[#FDFDC7]">
                <div className="mx-auto max-w-4xl px-5 py-10 md:px-8 md:py-14">
                    <p className="text-sm font-medium text-[#5F610E]">사찰 정보 등록</p>
                    <h1 className="mt-3 text-[31px] font-semibold tracking-[-0.045em] md:text-[44px]">
                        사찰을 소개해 주세요
                    </h1>
                    <p className="mt-4 text-[15px] leading-7 text-[#667085]">
                        방문자가 사찰을 쉽게 찾고 필요한 정보를 확인할 수 있도록 작성해 주세요.
                    </p>
                </div>
            </section>

            <form className="mx-auto grid max-w-4xl gap-5 px-4 py-8 md:px-8 md:py-12">
                <section className="rounded-[24px] border border-[#E3E8EF] bg-white p-5 md:p-8">
                    <div className="border-b border-[#EEF0F2] pb-5">
                        <span className="text-xs font-medium text-[#8D8040]">01</span>
                        <h2 className="mt-1 text-[22px] font-medium">사찰 기본 정보</h2>
                    </div>

                    <div className="mt-6 grid gap-6">
                        <label className={labelStyle}>
                            사찰명 <span className="text-[#E5484D]">*</span>
                            <input required type="text" placeholder="사찰 이름" className={inputStyle} />
                        </label>

                        <div className="grid gap-6 md:grid-cols-2">
                            <label className={labelStyle}>
                                지역 <span className="text-[#E5484D]">*</span>
                                <select required defaultValue="" className={inputStyle}>
                                    <option value="" disabled>지역 선택</option>
                                    <option>서울</option><option>경기</option><option>인천</option>
                                    <option>강원</option><option>충청</option><option>전라</option>
                                    <option>경상</option><option>제주</option><option>해외</option>
                                </select>
                            </label>

                            <label className={labelStyle}>
                                소속 종단
                                <input type="text" placeholder="예: 대한불교조계종" className={inputStyle} />
                            </label>
                        </div>

                        <label className={labelStyle}>
                            상세 주소 <span className="text-[#E5484D]">*</span>
                            <input required type="text" placeholder="도로명 주소를 입력해 주세요" className={inputStyle} />
                        </label>

                        <label className={labelStyle}>
                            사찰 소개 <span className="text-[#E5484D]">*</span>
                            <textarea required rows={7} placeholder="사찰의 역사, 특징과 방문자가 알아두면 좋은 내용을 적어주세요." className={`${inputStyle} resize-y leading-7`} />
                        </label>
                    </div>
                </section>

                <section className="rounded-[24px] border border-[#E3E8EF] bg-white p-5 md:p-8">
                    <div className="border-b border-[#EEF0F2] pb-5">
                        <span className="text-xs font-medium text-[#8D8040]">02</span>
                        <h2 className="mt-1 text-[22px] font-medium">방문 안내</h2>
                    </div>

                    <div className="mt-6 grid gap-6 md:grid-cols-2">
                        <label className={labelStyle}>전화번호<input type="tel" placeholder="사찰 대표 전화번호" className={inputStyle} /></label>
                        <label className={labelStyle}>홈페이지<input type="url" placeholder="https://" className={inputStyle} /></label>
                        <label className={`${labelStyle} md:col-span-2`}>운영·방문 시간<input type="text" placeholder="예: 매일 09:00~18:00" className={inputStyle} /></label>
                        <label className={`${labelStyle} md:col-span-2`}>교통 및 주차 안내<textarea rows={4} placeholder="대중교통, 주차 등 방문 방법" className={`${inputStyle} resize-y leading-7`} /></label>
                    </div>
                </section>

                <section className="rounded-[24px] border border-[#E3E8EF] bg-white p-5 md:p-8">
                    <div className="border-b border-[#EEF0F2] pb-5">
                        <span className="text-xs font-medium text-[#8D8040]">03</span>
                        <h2 className="mt-1 text-[22px] font-medium">사진과 등록자 정보</h2>
                    </div>

                    <div className="mt-6 grid gap-6">
                        <label className={labelStyle}>
                            대표 사진
                            <input type="file" accept="image/png,image/jpeg,image/webp" className="mt-2 block w-full rounded-xl border border-dashed border-[#C9D0D8] bg-[#F7F8FA] px-4 py-6 text-sm text-[#667085]" />
                        </label>
                        <div className="grid gap-6 md:grid-cols-2">
                            <label className={labelStyle}>등록자·담당자명 <span className="text-[#E5484D]">*</span><input required type="text" className={inputStyle} /></label>
                            <label className={labelStyle}>연락처 <span className="text-[#E5484D]">*</span><input required type="tel" placeholder="010-0000-0000" className={inputStyle} /></label>
                        </div>
                        <label className="flex items-start gap-3 rounded-xl bg-[#F7F8FA] p-4 text-sm leading-6 text-[#667085]">
                            <input required type="checkbox" className="mt-1 h-4 w-4 accent-[#B9BA28]" />
                            <span>등록 내용 확인과 연락을 위한 개인정보 수집 및 이용에 동의합니다. <span className="text-[#E5484D]">(필수)</span></span>
                        </label>
                    </div>
                </section>

                <div className="grid grid-cols-2 gap-3">
                    <Link href="/temples/guide" className="rounded-xl border border-[#DDE2E8] bg-white px-6 py-4 text-center text-sm font-medium">취소</Link>
                    <button type="submit" className="rounded-xl bg-[#F4F54A] px-6 py-4 text-sm font-medium">사찰 등록 요청</button>
                </div>
            </form>
        </main>
    );
}
