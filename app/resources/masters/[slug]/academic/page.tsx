import Link from "next/link";
import { notFound } from "next/navigation";
import { getMaster } from "../../data";

type PageProps = { params: Promise<{ slug: string }> };


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

            <section className="border-b border-[#E4E7DF] bg-[#F4F6EF]">
                <div className="mx-auto max-w-[900px] px-5 py-8 md:px-8 md:py-11">
                    <Link href={`/resources/masters/${slug}`} className="text-sm text-[#777900]">← {master.name}</Link>
                    <p className="mt-4 text-xs text-[#8B95A1]">{master.eraLabel} · {master.years}</p>
                    <h1 className="mt-1 text-[30px] font-semibold tracking-[-0.04em] md:text-[40px]">학술 자료</h1>
                    <p className="mt-3 max-w-[680px] break-keep text-sm leading-7 text-[#667085]">원문·번역·판본과 연구 성과를 검토해 차례로 공개합니다.</p>
                </div>
            </section>

            <nav className="sticky top-16 z-20 hidden border-b border-[#E6E8E3] bg-white/95 backdrop-blur md:block" aria-label={`${master.name} 자료 탭`}>
                <div className="mx-auto flex max-w-[900px] gap-9 px-8">
                    <Link href={`/resources/masters/${slug}`} className="py-4 text-sm text-[#667085]">인물 개요</Link>
                    <Link href={`/resources/masters/${slug}/illustrations`} className="py-4 text-sm text-[#667085]">삽화로 보는 일화</Link>
                    <Link href={`/resources/masters/${slug}/videos`} className="py-4 text-sm text-[#667085]">다큐·영상</Link>
                    <span className="border-b-2 border-[#F4F54A] py-4 text-sm font-semibold text-[#20242B]">학술 자료</span>
                </div>
            </nav>

            <div className="mx-auto max-w-[900px] px-5 py-12 md:px-8 md:py-16">
                <p className="text-sm text-[#777900]">원문·번역·연구</p>
                <div className="mt-8 rounded-[22px] border border-[#E2E5DF] bg-white p-5 md:p-8">
                    <p className="break-keep text-[15px] leading-8 text-[#4E5968]">원문과 번역, 주요 저술의 판본, 연구논문과 학계의 다양한 해석을 검토하고 있습니다.</p>
                    <p className="mt-4 break-keep text-[15px] leading-8 text-[#4E5968]">자료의 정확한 출처와 저작권, 서로 다른 연구 견해를 확인한 뒤 차례로 공개합니다.</p>
                    <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                        {topics.map((item) => (
                            <li key={item} className="flex break-keep items-start gap-3 border-b border-[#ECEEE9] py-3 text-sm leading-6 text-[#596270]">
                                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C8CB25]" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="mt-7 break-keep border-t border-[#E8EAE5] pt-6 text-sm leading-7 text-[#667085]">자료 취합과 검토가 완료된 항목부터 순차적으로 공개됩니다.</p>
                    <p className="mt-5 text-sm text-[#8B95A1]">자료 협력 안내는 준비 중입니다.</p>
                </div>
            </div>
        </main>
    );
}
