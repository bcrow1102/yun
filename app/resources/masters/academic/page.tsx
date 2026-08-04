import Link from "next/link";

export default function AcademicArchivePage() {
    return (
        <main className="min-h-screen bg-[#F7F8FA] px-5 py-14 text-[#171B22] md:px-8">
            <div className="mx-auto max-w-[1000px]">
                <Link href="/resources/masters" className="text-sm text-[#777900]">← 한국의 고승</Link>
                <h1 className="mt-5 text-[34px] font-semibold tracking-[-0.04em] md:text-[46px]">학술 자료</h1>
                <p className="mt-4 max-w-[680px] break-keep text-[15px] leading-7 text-[#667085]">고승별 원문, 번역, 판본과 연구자료를 검토한 뒤 공개합니다.</p>
                <div className="mt-9 rounded-[22px] border border-[#E2E5DF] bg-white p-6 md:p-8">
                    <p className="break-keep text-base font-medium text-[#303641]">원효대사 학술 자료를 준비하고 있습니다.</p>
                    <Link href="/resources/masters/wonhyo/academic" className="mt-5 inline-flex rounded-full border border-[#DDE1D8] px-4 py-2.5 text-sm text-[#56606D]">원효 학술 자료 보기</Link>
                </div>
            </div>
        </main>
    );
}
