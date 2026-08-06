import Link from "next/link";
import { notFound } from "next/navigation";
import { getMaster } from "../../data";

type PageProps = { params: Promise<{ slug: string }> };


function LotusMark() {
    return (
        <svg viewBox="0 0 32 32" fill="none" className="h-6 w-6" aria-hidden="true">
            <path d="M16 24c-4-4.1-5.2-8.2 0-15 5.2 6.8 4 10.9 0 15Z" stroke="currentColor" strokeWidth="1.6" />
            <path d="M15 24C9.5 23.3 6.6 20.5 7 14c5.4.7 8.1 4 8 10Z" stroke="currentColor" strokeWidth="1.6" />
            <path d="M17 24c5.5-.7 8.4-3.5 8-10-5.4.7-8.1 4-8 10Z" stroke="currentColor" strokeWidth="1.6" />
            <path d="M7 25h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
    );
}

const topics = [
    "한문 원문과 독음",
    "직역과 현대어 해설",
    "주요 저술과 판본 정보",
    "핵심 개념과 사상적 쟁점",
    "국내외 연구논문과 참고문헌",
    "연구자별 해석과 논쟁점",
];

export default async function MasterAcademicPage({ params }: PageProps) {
    const { slug } = await params;
    const master = getMaster(slug);
    if (!master) notFound();

    return (
        <main className="min-h-screen bg-[#F7F8FA] text-[#171B22]">
            <header className="border-b border-[#E9EBEE] bg-white">
                <div className="mx-auto flex h-[68px] max-w-[1100px] items-center justify-between px-5 md:px-8">
                    <Link href="/" className="flex items-center gap-2.5" aria-label="연 홈">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F4F54A]">
                            <LotusMark />
                        </span>
                        <span className="text-2xl font-semibold">연</span>
                    </Link>
                    <Link href="/resources/masters" className="rounded-full border border-[#DFE2E7] px-4 py-2 text-sm text-[#56606D]">← 한국의 고승</Link>
                </div>
            </header>

            <section className="border-b border-[#E4E7DF] bg-[#F4F6EF]">
                <div className="mx-auto max-w-[900px] px-5 py-10 md:px-8 md:py-14">
                    <p className="text-sm text-[#777900]">{master.eraLabel} · {master.years}</p>
                    <h1 className="mt-2 text-[34px] font-semibold tracking-[-0.04em] md:text-[46px]">{master.name}</h1>
                    <p className="mt-4 max-w-[680px] break-keep text-[15px] leading-7 text-[#667085]">{master.introduction}</p>
                </div>
            </section>

            <nav className="sticky top-0 z-20 border-b border-[#E6E8E3] bg-white/95 backdrop-blur" aria-label={`${master.name} 자료 탭`}>
                <div className="mx-auto flex max-w-[900px] gap-1 overflow-x-auto px-5 py-3 md:px-8">
                    <Link href={`/resources/masters/${slug}#videos`} className="shrink-0 rounded-full px-3.5 py-2 text-sm text-[#667085] hover:bg-[#F4F54A] hover:text-[#252A31]">다큐·영상</Link>
                    <Link href={`/resources/masters/${slug}/illustrations`} className="shrink-0 rounded-full px-3.5 py-2 text-sm text-[#667085] hover:bg-[#F4F54A] hover:text-[#252A31]">삽화로 보는 일화</Link>
                    <Link href={`/resources/masters/${slug}/academic`} className="shrink-0 rounded-full bg-[#F4F54A] px-3.5 py-2 text-sm text-[#252A31]">학술 자료</Link>
                </div>
            </nav>

            <div className="mx-auto max-w-[900px] px-5 py-12 md:px-8 md:py-16">
                <p className="text-sm font-medium text-[#777900]">원문·번역·연구</p>
                <h2 className="mt-2 text-[28px] font-semibold tracking-[-0.04em] md:text-[36px]">학술 자료</h2>
                <div className="mt-8 rounded-[22px] border border-[#E2E5DF] bg-white p-5 md:p-8">
                    <p className="break-keep text-[15px] leading-8 text-[#4E5968]">원문과 번역, 주요 저술의 판본, 연구논문과 학계의 다양한 해석을 검토하고 있습니다.</p>
                    <p className="mt-4 break-keep text-[15px] leading-8 text-[#4E5968]">자료의 정확한 출처와 저작권, 서로 다른 연구 견해를 확인한 뒤 차례로 공개합니다.</p>
                    <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                        {topics.map((item) => (
                            <li key={item} className="flex break-keep items-start gap-3 rounded-[16px] bg-[#F7F8FA] px-4 py-3 text-sm leading-6 text-[#596270]">
                                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C8CB25]" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="mt-7 break-keep border-t border-[#E8EAE5] pt-6 text-sm leading-7 text-[#667085]">자료 취합과 검토가 완료된 항목부터 순차적으로 공개됩니다.</p>
                    <div className="mt-5">
                        <span aria-disabled="true" className="inline-flex cursor-not-allowed items-center rounded-full border border-[#DDE1D8] bg-[#F7F8FA] px-4 py-2.5 text-sm text-[#8B95A1]">자료 협력 안내 · 준비 중</span>
                    </div>
                </div>
            </div>
        </main>
    );
}
