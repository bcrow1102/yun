import Link from "next/link";
import { notFound } from "next/navigation";
import { getMaster } from "../../data";
import { wonhyoIllustrations } from "../../illustrations/data/wonhyo";

type PageProps = {
    params: Promise<{ slug: string }>;
};

export default async function MasterIllustrationsPage({
    params,
}: PageProps) {
    const { slug } = await params;
    const master = getMaster(slug);

    if (!master) notFound();

    const items = slug === "wonhyo" ? wonhyoIllustrations : [];

    return (
        <main className="min-h-screen bg-[#F7F8FA] text-[#171B22]">

            <section className="border-b border-[#E4E7DF] bg-[#F4F6EF]">
                <div className="mx-auto max-w-[900px] px-5 py-8 md:px-8 md:py-11">
                    <Link href={`/resources/masters/${slug}`} className="text-sm text-[#777900]">← {master.name}</Link>
                    <p className="mt-4 text-xs text-[#8B95A1]">{master.eraLabel} · {master.years}</p>
                    <h1 className="mt-1 text-[30px] font-semibold tracking-[-0.04em] md:text-[40px]">삽화로 보는 일화</h1>
                    <p className="mt-3 max-w-[680px] break-keep text-sm leading-7 text-[#667085]">{master.name}의 생애와 전승을 삽화와 함께 살펴봅니다.</p>
                </div>
            </section>

            <nav className="sticky top-16 z-20 hidden border-b border-[#E6E8E3] bg-white/95 backdrop-blur md:block" aria-label={`${master.name} 자료 탭`}>
                <div className="mx-auto flex max-w-[900px] gap-9 px-8">
                    <Link href={`/resources/masters/${slug}`} className="py-4 text-sm text-[#667085]">인물 개요</Link>
                    <span className="border-b-2 border-[#F4F54A] py-4 text-sm font-semibold text-[#20242B]">삽화로 보는 일화</span>
                    <Link href={`/resources/masters/${slug}/videos`} className="py-4 text-sm text-[#667085]">다큐·영상</Link>
                    <Link href={`/resources/masters/${slug}/academic`} className="py-4 text-sm text-[#667085]">학술 자료</Link>
                </div>
            </nav>

            <div className="mx-auto max-w-[1100px] px-5 py-12 md:px-8 md:py-16">
                <p className="text-sm leading-7 text-[#7B8490]">문헌 기록과 후대 전승, 이야기의 재구성 부분을 구분해 소개합니다.</p>

                {items.length ? (
                    <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {items.map((item) => (
                            <Link
                                key={item.slug}
                                href={`/resources/masters/${slug}/illustrations/${item.slug}`}
                                className="group overflow-hidden rounded-[22px] border border-[#E2E5DF] bg-white transition duration-200 hover:-translate-y-1 hover:border-[#D7DA75] hover:shadow-[0_14px_32px_rgba(25,31,40,0.08)]"
                            >
                                <div className="aspect-[4/3] overflow-hidden bg-[#EEF0E8]">
                                    <img
                                        src={item.coverImage.src}
                                        alt={item.coverImage.alt}
                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                                    />
                                </div>

                                <div className="p-5">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <p className="text-xs text-[#777900]">
                                            {item.classification}
                                        </p>

                                        <span className="text-xs text-[#A0A60B]">
                                            {item.scenes.length}장면
                                        </span>
                                    </div>

                                    <h3 className="mt-2 break-keep text-xl font-medium leading-8">
                                        {item.title}
                                    </h3>

                                    <p className="mt-3 break-keep text-sm leading-7 text-[#667085]">
                                        {item.summary}
                                    </p>

                                    <p className="mt-4 text-xs leading-5 text-[#8B95A1]">
                                        출전: {item.source}
                                    </p>

                                    <span className="mt-5 inline-flex items-center gap-1 text-xs text-[#68713A] transition group-hover:text-[#20242B]">
                                        이야기 읽기
                                        <span aria-hidden="true">→</span>
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="mt-8 rounded-[22px] border border-[#E2E5DF] bg-white px-5 py-10 text-center md:px-8">
                        <p className="break-keep text-base font-medium text-[#303641]">
                            {master.name}의 삽화 일화를 준비하고 있습니다.
                        </p>

                        <p className="mx-auto mt-3 max-w-[560px] break-keep text-sm leading-7 text-[#7B8490]">
                            삽화와 이야기 본문, 출전과 해설을 함께 검토한 뒤
                            공개합니다.
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}
