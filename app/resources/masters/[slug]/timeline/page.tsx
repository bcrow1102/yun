import Link from "next/link";
import { notFound } from "next/navigation";
import { getMaster } from "../../data";
import { wonhyoArticle } from "../articles/wonhyo";
import { wonkwangArticle } from "../articles/wonkwang";
import { gyunyeoArticle } from "../articles/gyunyeo";

type PageProps = {
    params: Promise<{
        slug: string;
    }>;
};


function LotusMark() {
    return (
        <svg viewBox="0 0 32 32" fill="none" className="h-6 w-6" aria-hidden="true">
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

function getArticle(slug: string) {
    if (slug === "wonhyo") return wonhyoArticle;
    if (slug === "wonkwang") return wonkwangArticle;
    if (slug === "gyunyeo") return gyunyeoArticle;
    return null;
}

function RecordLabel({
    type,
}: {
    type: "기록" | "전승" | "연구";
}) {
    const label =
        type === "기록"
            ? "문헌 기록"
            : type === "전승"
                ? "후대 전승"
                : "연구 해석";

    return (
        <span className="shrink-0 text-xs font-normal text-[#8B95A1]">
            {label}
        </span>
    );
}

const detailTabs = [
    { key: "timeline", label: "생애 연표" },
    { key: "life", label: "상세 일대기" },
    { key: "thought", label: "핵심 사상" },
    { key: "works", label: "주요 저술" },
    { key: "stories", label: "일화와 전승" },
] as const;

export default async function TimelinePage({
    params,
}: PageProps) {
    const { slug } = await params;

    const master = getMaster(slug);
    const article = getArticle(slug);

    if (!master || !article) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-[#F7F8FA] text-[#171B22]">
            <header className="border-b border-[#E7E9EC] bg-white">
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
                        href={`/resources/masters/${slug}`}
                        className="text-sm text-[#667085] transition hover:text-[#20242B]"
                    >
                        ← {master.name} 인물 개요
                    </Link>
                </div>
            </header>

            <section className="border-b border-[#E4E7DF] bg-[#F4F6EF]">
                <div className="mx-auto max-w-[1000px] px-5 py-10 md:px-8 md:py-14">
                    <p className="text-sm text-[#777900]">
                        한국의 고승 {master.number} · {master.eraLabel} ·{" "}
                        {master.years}
                    </p>

                    <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h1 className="text-[34px] font-semibold tracking-[-0.045em] md:text-[46px]">
                            {master.name}
                        </h1>
                        <span className="text-sm text-[#8A8173] md:text-base">
                            {master.hanja}
                        </span>
                    </div>

                    <p className="mt-4 max-w-[720px] break-keep text-[15px] leading-7 text-[#667085] md:text-base md:leading-8">
                        {article.subtitle}
                    </p>
                </div>
            </section>

            <nav
                className="border-b border-[#E5E7EA] bg-white"
                aria-label={`${master.name} 상세 자료`}
            >
                <div className="mx-auto flex max-w-[1000px] overflow-x-auto px-5 md:px-8">
                    {detailTabs.map((tab) => {
                        const active = tab.key === "timeline";

                        return (
                            <Link
                                key={tab.key}
                                href={`/resources/masters/${slug}/${tab.key}`}
                                className={`shrink-0 border-b-2 px-1 py-4 text-sm transition md:mr-8 ${active
                                        ? "border-[#F4F54A] font-semibold text-[#20242B]"
                                        : "border-transparent text-[#7B8490] hover:text-[#20242B]"
                                    }`}
                            >
                                {tab.label}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            <article className="mx-auto max-w-[900px] px-5 py-12 md:px-8 md:py-16">
                <div className="border-b border-[#E5E7EA] pb-8">
                    <p className="text-sm font-medium text-[#777900]">
                        {master.name}의 생애
                    </p>
                    <h2 className="mt-2 text-[30px] font-semibold tracking-[-0.04em] md:text-[40px]">
                        생애 연표
                    </h2>
                    <p className="mt-4 max-w-[680px] break-keep text-sm font-normal leading-7 text-[#7B8490] md:text-[15px]">
                        확정 가능한 기록과 후대 전승, 연구상 추정을 구분해서
                        살펴봅니다.
                    </p>
                </div>

                <div className="relative mt-10 space-y-0 before:absolute before:bottom-4 before:left-[5px] before:top-4 before:w-px before:bg-[#DDE1D8] md:before:left-[135px]">
                    {article.timeline.map((item) => (
                        <div
                            key={`${item.year}-${item.title}`}
                            className="relative grid gap-3 pb-9 pl-8 md:grid-cols-[110px_1fr] md:gap-8 md:pl-0"
                        >
                            <span className="absolute left-0 top-2 h-[11px] w-[11px] rounded-full border-[3px] border-[#F4F54A] bg-white md:left-[130px]" />

                            <div>
                                <p className="text-sm font-medium text-[#666B27]">
                                    {item.year}
                                </p>

                                {item.age && (
                                    <p className="mt-0.5 text-xs text-[#9AA1AB]">
                                        {item.age}
                                    </p>
                                )}
                            </div>

                            <section className="rounded-[20px] border border-[#E1E4DE] bg-white px-5 py-5 md:ml-5 md:px-6 md:py-6">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <h3 className="text-[17px] font-medium text-[#252A31] md:text-lg">
                                        {item.title}
                                    </h3>
                                    <RecordLabel type={item.recordType} />
                                </div>

                                <p className="mt-3 break-keep text-sm font-normal leading-7 text-[#667085] md:text-[15px] md:leading-8">
                                    {item.description}
                                </p>
                            </section>
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-[#E5E7EA] pt-7">
                    <Link
                        href={`/resources/masters/${slug}`}
                        className="text-sm text-[#667085] transition hover:text-[#20242B]"
                    >
                        ← 인물 개요
                    </Link>

                    <Link
                        href={`/resources/masters/${slug}/life`}
                        className="text-sm font-medium text-[#303641] transition hover:text-[#777900]"
                    >
                        상세 일대기 →
                    </Link>
                </div>
            </article>
        </main>
    );
}
