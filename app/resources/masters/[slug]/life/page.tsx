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

function getArticle(slug: string) {
    if (slug === "wonhyo") return wonhyoArticle;
    if (slug === "wonkwang") return wonkwangArticle;
    if (slug === "gyunyeo") return gyunyeoArticle;
    return null;
}

const detailTabs = [
    { key: "timeline", label: "생애 연표" },
    { key: "life", label: "상세 일대기" },
    { key: "thought", label: "핵심 사상" },
    { key: "works", label: "주요 저술" },
    { key: "stories", label: "일화와 전승" },
] as const;

export default async function LifePage({
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
                        const active = tab.key === "life";

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
                        깊이 읽기
                    </p>
                    <h2 className="mt-2 text-[30px] font-semibold tracking-[-0.04em] md:text-[40px]">
                        상세 일대기
                    </h2>
                    <p className="mt-4 max-w-[680px] break-keep text-sm font-normal leading-7 text-[#7B8490] md:text-[15px]">
                        한 사람의 삶을 당시의 전쟁과 지식, 신앙의 변화 속에서 읽습니다.
                    </p>
                </div>

                <div className="mt-10 space-y-12 md:space-y-14">
                    {article.lifeSections.map((section) => (
                        <section
                            key={section.id}
                            id={section.id}
                            className="border-t border-[#E5E7EA] pt-8 first:border-t-0 first:pt-0"
                        >
                            <p className="text-sm font-medium text-[#A0A60B]">
                                {section.eyebrow}
                            </p>

                            <h3 className="mt-2 text-[25px] font-semibold tracking-[-0.035em] md:text-[32px]">
                                {section.title}
                            </h3>

                            <div className="mt-5 space-y-5">
                                {section.paragraphs.map((paragraph) => (
                                    <p
                                        key={paragraph}
                                        className="break-keep text-[15px] font-normal leading-[1.95] text-[#4E5968] md:text-base"
                                    >
                                        {paragraph}
                                    </p>
                                ))}
                            </div>

                            {section.note && (
                                <p className="mt-6 rounded-[18px] bg-[#F1F3ED] px-5 py-4 text-sm font-normal leading-7 text-[#66705C]">
                                    {section.note}
                                </p>
                            )}
                        </section>
                    ))}
                </div>

                <div className="mt-12 flex items-center justify-between border-t border-[#E5E7EA] pt-7">
                    <Link
                        href={`/resources/masters/${slug}/timeline`}
                        className="text-sm text-[#667085] transition hover:text-[#20242B]"
                    >
                        ← 생애 연표
                    </Link>

                    <Link
                        href={`/resources/masters/${slug}/thought`}
                        className="text-sm font-medium text-[#303641] transition hover:text-[#777900]"
                    >
                        핵심 사상 →
                    </Link>
                </div>
            </article>
        </main>
    );
}
