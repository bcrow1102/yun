import Link from "next/link";
import { notFound } from "next/navigation";
import { getMaster } from "../../data";
import { wonhyoIllustrations } from "../../illustrations/data/wonhyo";

type PageProps = {
    params: Promise<{ slug: string }>;
};

function LotusMark() {
    return (
        <svg
            viewBox="0 0 32 32"
            fill="none"
            className="h-6 w-6"
            aria-hidden="true"
        >
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

export default async function MasterIllustrationsPage({
    params,
}: PageProps) {
    const { slug } = await params;
    const master = getMaster(slug);

    if (!master) notFound();

    const items = slug === "wonhyo" ? wonhyoIllustrations : [];

    return (
        <main className="min-h-screen bg-[#F7F8FA] text-[#171B22]">
            <header className="border-b border-[#E9EBEE] bg-white">
                <div className="mx-auto flex h-[68px] max-w-[1100px] items-center justify-between px-5 md:px-8">
                    <Link
                        href="/"
                        className="flex items-center gap-2.5"
                        aria-label="연 홈"
                    >
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F4F54A]">
                            <LotusMark />
                        </span>
                        <span className="text-2xl font-semibold">연</span>
                    </Link>

                    <Link
                        href="/resources/masters"
                        className="rounded-full border border-[#DFE2E7] px-4 py-2 text-sm text-[#56606D]"
                    >
                        ← 한국의 고승
                    </Link>
                </div>
            </header>

            <section className="border-b border-[#E4E7DF] bg-[#F4F6EF]">
                <div className="mx-auto max-w-[900px] px-5 py-10 md:px-8 md:py-14">
                    <p className="text-sm text-[#777900]">
                        {master.eraLabel} · {master.years}
                    </p>

                    <h1 className="mt-2 text-[34px] font-semibold tracking-[-0.04em] md:text-[46px]">
                        {master.name}
                    </h1>

                    <p className="mt-4 max-w-[680px] break-keep text-[15px] leading-7 text-[#667085]">
                        {master.introduction}
                    </p>
                </div>
            </section>

            <nav
                className="sticky top-0 z-20 border-b border-[#E6E8E3] bg-white/95 backdrop-blur"
                aria-label={`${master.name} 자료 탭`}
            >
                <div className="mx-auto flex max-w-[900px] gap-1 overflow-x-auto px-5 py-3 md:px-8">
                    <Link
                        href={`/resources/masters/${slug}#videos`}
                        className="shrink-0 rounded-full px-3.5 py-2 text-sm text-[#667085] hover:bg-[#F4F54A] hover:text-[#252A31]"
                    >
                        다큐·영상
                    </Link>

                    <Link
                        href={`/resources/masters/${slug}/illustrations`}
                        className="shrink-0 rounded-full bg-[#F4F54A] px-3.5 py-2 text-sm text-[#252A31]"
                    >
                        삽화로 보는 일화
                    </Link>

                    <Link
                        href={`/resources/masters/${slug}/academic`}
                        className="shrink-0 rounded-full px-3.5 py-2 text-sm text-[#667085] hover:bg-[#F4F54A] hover:text-[#252A31]"
                    >
                        학술 자료
                    </Link>
                </div>
            </nav>

            <div className="mx-auto max-w-[900px] px-5 py-12 md:px-8 md:py-16">
                <p className="text-sm font-medium text-[#777900]">
                    이야기로 만나는 고승
                </p>

                <h2 className="mt-2 text-[28px] font-semibold tracking-[-0.04em] md:text-[36px]">
                    삽화로 보는 일화
                </h2>

                <p className="mt-3 max-w-[680px] break-keep text-sm leading-7 text-[#7B8490]">
                    문헌에 전하는 일화를 삽화와 함께 읽되, 역사적 기록과
                    후대 전승, 이야기의 재구성 부분을 구분해 소개합니다.
                </p>

                {items.length ? (
                    <div className="mt-8 grid gap-5 md:grid-cols-2">
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

                                    <span className="mt-5 inline-flex items-center gap-1 rounded-full bg-[#F7F8FA] px-3 py-2 text-xs text-[#68713A] transition group-hover:bg-[#F4F54A] group-hover:text-[#252A31]">
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