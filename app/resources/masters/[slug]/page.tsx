import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMaster, masters } from "../data";
import { wonhyoArticle } from "./articles/wonhyo";
import { wonkwangArticle } from "./articles/wonkwang";
import { gyunyeoArticle } from "./articles/gyunyeo";

type PageProps = { params: Promise<{ slug: string }> };

const representativePreviewSlugs = new Set(["gyunyeo", "gihwa", "mangong"]);

export function generateStaticParams() {
    return masters
        .filter(
            (master) =>
                master.status !== "planned" ||
                representativePreviewSlugs.has(master.slug),
        )
        .map((master) => ({ slug: master.slug }));
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const master = getMaster(slug);
    if (!master) return { title: "한국의 고승 | 연" };
    return {
        title: `${master.name} | 한국의 고승 | 연`,
        description: master.introduction,
    };
}

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

function SiteHeader() {
    return (
        <header className="border-b border-[#E9EBEE] bg-white">
            <div className="mx-auto flex h-[68px] max-w-[1100px] items-center justify-between px-5 md:px-8">
                <Link href="/" className="flex items-center gap-2.5" aria-label="연 홈">
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
    );
}

function RecordBadge({ type }: { type: "기록" | "전승" | "연구" }) {
    const style =
        type === "기록"
            ? "bg-[#EEF1D8] text-[#666B27]"
            : type === "전승"
                ? "bg-[#F4EFE8] text-[#806D56]"
                : "bg-[#EDF1F5] text-[#637083]";
    return (
        <span className={`rounded-full px-2.5 py-1 text-[11px] ${style}`}>
            {type}
        </span>
    );
}

function DeepPage({
    slug,
}: {
    slug: "wonhyo" | "wonkwang" | "gyunyeo";
}) {
    const article =
        slug === "wonhyo"
            ? wonhyoArticle
            : slug === "wonkwang"
                ? wonkwangArticle
                : gyunyeoArticle;

    const master = getMaster(slug)!;

    return (
        <main className="min-h-screen bg-[#F7F8FA] text-[#171B22]">
            <SiteHeader />

            <article>
                <section className="border-b border-[#E4E7DF] bg-[#F4F6EF]">
                    <div className="mx-auto grid max-w-[1000px] gap-8 px-5 py-12 md:grid-cols-[1fr_280px] md:px-8 md:py-20">
                        <div className="self-center">
                            <div className="flex flex-wrap items-center gap-2 text-sm text-[#777900]">
                                <span>한국의 고승 {master.number}</span>
                                <span className="text-[#C4C8BD]">·</span>
                                <span>{article.readingTime}</span>
                                <span className="text-[#C4C8BD]">·</span>
                                <span>검토 {article.lastReviewed}</span>
                            </div>
                            <p className="mt-6 text-base text-[#8A8173]">
                                {master.hanja} · {master.years}
                            </p>
                            <h1 className="mt-2 max-w-[680px] text-[38px] font-semibold leading-[1.18] tracking-[-0.05em] md:text-[54px]">
                                {article.title}
                            </h1>
                            <p className="mt-5 max-w-[680px] text-[15px] leading-7 text-[#667085] md:text-[17px] md:leading-8">
                                {article.subtitle}
                            </p>
                            <div className="mt-7 flex flex-wrap gap-2">
                                {master.theme.split(" · ").map((item) => (
                                    <span
                                        key={item}
                                        className="rounded-full bg-white px-3.5 py-2 text-sm text-[#666B27]"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <figure>
                            <div className="relative overflow-hidden rounded-[26px] border border-[#D7D9CF] bg-[#D6C6A7]">
                                <img
                                    src={article.portrait.src}
                                    alt={article.portrait.alt}
                                    className="h-auto w-full object-contain"
                                />

                                <span
                                    aria-hidden="true"
                                    className="absolute bottom-4 left-4 h-1 w-12 rounded-full bg-[#F4F54A]"
                                />
                            </div>

                            <figcaption className="mt-3 text-xs font-normal leading-5 text-[#8B95A1]">
                                {slug === "wonhyo" ? (
                                    <>
                                        전해지는 원효대사 초상 · 일본 교토 고산사 소장
                                        <span className="mx-1 text-[#C2C7CE]">·</span>
                                        퍼블릭 도메인
                                    </>
                                ) : (
                                    article.portrait.caption
                                )}
                            </figcaption>
                        </figure>
                    </div>
                </section>

                <nav
                    className="sticky top-0 z-20 border-b border-[#E6E8E3] bg-white/95 backdrop-blur"
                    aria-label={`${master.name} 페이지 목차`}
                >
                    <div className="mx-auto flex max-w-[1000px] gap-1 overflow-x-auto px-5 py-3 md:px-8">
                        {article.navigation.map((item) => (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                className="shrink-0 rounded-full px-3.5 py-2 text-sm text-[#667085] hover:bg-[#F4F54A] hover:text-[#252A31]"
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>
                </nav>

                <div className="mx-auto max-w-[900px] px-5 py-10 md:px-8 md:py-16">
                    <section
                        className="grid gap-3 sm:grid-cols-2 md:grid-cols-3"
                        aria-label={`${master.name} 기본 정보`}
                    >
                        {article.quickFacts.map((fact) => (
                            <div
                                key={fact.label}
                                className="rounded-[18px] border border-[#E2E5DF] bg-white p-4"
                            >
                                <p className="text-xs text-[#8B95A1]">{fact.label}</p>
                                <p className="mt-1.5 text-sm leading-6 text-[#3F4752]">
                                    {fact.value}
                                </p>
                            </div>
                        ))}
                    </section>

                    <section id="timeline" className="scroll-mt-24 pt-16">
                        <SectionTitle
                            eyebrow={`${master.name}의 생애`}
                            title="생애 연표"
                            description="확정 가능한 기록과 후대 전승, 연구상 추정을 구분해서 살펴봅니다."
                        />
                        <div className="relative mt-8 space-y-0 before:absolute before:bottom-3 before:left-[5px] before:top-3 before:w-px before:bg-[#DDE1D8] md:before:left-[119px]">
                            {article.timeline.map((item) => (
                                <div
                                    key={`${item.year}-${item.title}`}
                                    className="relative grid gap-3 pb-8 pl-8 md:grid-cols-[96px_1fr] md:gap-6 md:pl-0"
                                >
                                    <span className="absolute left-0 top-2 h-[11px] w-[11px] rounded-full border-[3px] border-[#F4F54A] bg-white md:left-[114px]" />
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
                                    <div className="rounded-[18px] border border-[#E4E7E1] bg-white p-5 md:ml-4">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <h3 className="text-[17px] font-medium">{item.title}</h3>
                                            <RecordBadge type={item.recordType} />
                                        </div>
                                        <p className="mt-3 text-sm font-normal leading-7 text-[#667085]">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section id="life" className="scroll-mt-24 pt-16">
                        <SectionTitle
                            eyebrow="깊이 읽기"
                            title="상세 일대기"
                            description="한 사람의 삶을 당시의 전쟁과 지식, 신앙의 변화 속에서 읽습니다."
                        />
                        <div className="mt-9 space-y-14">
                            {article.lifeSections.map((section) => (
                                <section
                                    key={section.id}
                                    id={section.id}
                                    className="border-t border-[#E5E7EA] pt-8"
                                >
                                    <p className="text-sm text-[#A0A60B]">{section.eyebrow}</p>
                                    <h3 className="mt-2 text-[25px] font-semibold tracking-[-0.035em] md:text-[30px]">
                                        {section.title}
                                    </h3>
                                    <div className="mt-5 space-y-5">
                                        {section.paragraphs.map((p) => (
                                            <p
                                                key={p}
                                                className="text-[15px] font-normal leading-[1.95] text-[#4E5968] md:text-base"
                                            >
                                                {p}
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
                    </section>

                    <section id="thought" className="scroll-mt-24 pt-20">
                        <SectionTitle
                            eyebrow="사상"
                            title={`세 가지 핵심어로 읽는 ${master.name}`}
                            description="어려운 용어의 뜻을 먼저 잡고, 이 인물이 해결하려 한 문제를 함께 봅니다."
                        />
                        <div className="mt-8 space-y-4">
                            {article.thoughts.map((thought, index) => (
                                <section
                                    key={thought.id}
                                    className="rounded-[22px] border border-[#E2E5DF] bg-white p-5 md:p-7"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-sm text-[#8B95A1]">{thought.hanja}</p>
                                            <h3 className="mt-1 text-[24px] font-semibold">
                                                {thought.term}
                                            </h3>
                                        </div>
                                        <span className="text-2xl font-light text-[#D0D45A]">
                                            0{index + 1}
                                        </span>
                                    </div>
                                    <p className="mt-4 border-l-4 border-[#F4F54A] pl-4 text-[15px] leading-7 text-[#626A32]">
                                        {thought.summary}
                                    </p>
                                    <div className="mt-5 space-y-4">
                                        {thought.explanation.map((p) => (
                                            <p
                                                key={p}
                                                className="text-sm font-normal leading-7 text-[#596270] md:text-[15px] md:leading-8"
                                            >
                                                {p}
                                            </p>
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </div>
                    </section>

                    <section id="works" className="scroll-mt-24 pt-20">
                        <SectionTitle
                            eyebrow="저술"
                            title="주요 저술과 전승 상태"
                            description="제목만 나열하지 않고 각 책이 무엇을 해결하려 했는지 살펴봅니다."
                        />
                        <div className="mt-8 grid gap-4 md:grid-cols-2">
                            {article.works.map((work) => (
                                <article
                                    key={work.title}
                                    className="rounded-[20px] border border-[#E2E5DF] bg-white p-5"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-xs text-[#8B95A1]">{work.hanja}</p>
                                            <h3 className="mt-1 text-lg font-medium">
                                                『{work.title}』
                                            </h3>
                                        </div>
                                        <span className="shrink-0 rounded-full bg-[#F1F3ED] px-2.5 py-1 text-[11px] text-[#6D7538]">
                                            {work.status}
                                        </span>
                                    </div>
                                    <p className="mt-4 text-sm font-normal leading-7 text-[#667085]">
                                        {work.description}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section id="stories" className="scroll-mt-24 pt-20">
                        <SectionTitle
                            eyebrow="기록과 기억"
                            title="일화와 전승을 구분해 읽기"
                            description="이야기의 재미는 살리되, 어느 문헌에서 언제 전해졌는지를 함께 밝힙니다."
                        />
                        <div className="mt-8 space-y-5">
                            {article.stories.map((story) => (
                                <article
                                    key={story.title}
                                    className="overflow-hidden rounded-[22px] border border-[#E2E5DF] bg-white"
                                >
                                    <div className="border-b border-[#ECEEE9] bg-[#F5F6F1] px-5 py-4 md:px-6">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <h3 className="text-lg font-medium">{story.title}</h3>
                                            <span className="rounded-full bg-white px-3 py-1 text-xs text-[#777900]">
                                                {story.classification}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-xs text-[#8B95A1]">
                                            출전: {story.source}
                                        </p>
                                    </div>
                                    <div className="p-5 md:p-6">
                                        <p className="text-[15px] font-normal leading-8 text-[#4E5968]">
                                            {story.text}
                                        </p>
                                        <div className="mt-5 rounded-[16px] bg-[#F7F8FA] px-4 py-4">
                                            <p className="text-xs text-[#8B95A1]">어떻게 읽을까</p>
                                            <p className="mt-1.5 text-sm font-normal leading-7 text-[#596270]">
                                                {story.meaning}
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className="mt-20 rounded-[24px] bg-[#20242C] px-5 py-7 text-white md:px-8 md:py-9">
                        <p className="text-sm text-[#D7D96A]">
                            {master.name}이 오늘 우리에게 묻는 것
                        </p>
                        <ol className="mt-5 space-y-4">
                            {article.today.map((question, index) => (
                                <li
                                    key={question}
                                    className="flex gap-3 text-sm font-normal leading-7 text-white/80"
                                >
                                    <span className="text-[#D7D96A]">0{index + 1}</span>
                                    <span>{question}</span>
                                </li>
                            ))}
                        </ol>
                    </section>

                    <section id="sources" className="scroll-mt-24 pt-20">
                        <SectionTitle
                            eyebrow="검토 자료"
                            title="출전과 참고자료"
                            description="본문의 사실관계를 확인할 수 있는 기관 자료를 우선 연결했습니다."
                        />
                        <div className="mt-7 divide-y divide-[#E5E7EA] border-y border-[#E5E7EA]">
                            {article.sources.map((source) => (
                                <a
                                    key={source.url}
                                    href={source.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group flex items-start justify-between gap-4 py-5"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-[#303641] group-hover:text-[#777900]">
                                            {source.label}
                                        </p>
                                        <p className="mt-1 text-xs text-[#8B95A1]">
                                            {source.organization}
                                        </p>
                                        <p className="mt-2 text-sm font-normal leading-6 text-[#667085]">
                                            {source.note}
                                        </p>
                                    </div>
                                    <span className="mt-1 shrink-0 text-[#A0A60B]">↗</span>
                                </a>
                            ))}
                        </div>
                    </section>

                    <div className="mt-14 flex justify-center">
                        <Link
                            href="/resources/masters"
                            className="rounded-full border border-[#DDE1D8] bg-white px-5 py-3 text-sm text-[#56606D]"
                        >
                            한국의 고승 목록으로
                        </Link>
                    </div>
                </div>
            </article>
        </main>
    );
}

function SectionTitle({
    eyebrow,
    title,
    description,
}: {
    eyebrow: string;
    title: string;
    description: string;
}) {
    return (
        <div>
            <p className="text-sm font-medium text-[#777900]">{eyebrow}</p>
            <h2 className="mt-2 text-[28px] font-semibold tracking-[-0.04em] md:text-[36px]">
                {title}
            </h2>
            <p className="mt-3 max-w-[680px] text-sm font-normal leading-7 text-[#7B8490] md:text-[15px]">
                {description}
            </p>
        </div>
    );
}

function SummaryPage({ slug }: { slug: string }) {
    const master = getMaster(slug);
    if (!master) notFound();
    const hasWonkwangImage = master.slug === "wonkwang";
    const currentIndex = masters.findIndex((item) => item.slug === master.slug);
    const previousMaster =
        currentIndex > 0 ? masters[currentIndex - 1] : undefined;
    const nextMaster =
        currentIndex < masters.length - 1 ? masters[currentIndex + 1] : undefined;

    return (
        <main className="min-h-screen bg-[#F7F8FA] text-[#171B22]">
            <SiteHeader />
            <article>
                <section className="border-b border-[#E4E7DF] bg-[#F4F6EF]">
                    <div
                        className={`mx-auto max-w-[900px] px-5 py-12 md:px-8 md:py-20 ${hasWonkwangImage
                            ? "grid gap-8 md:grid-cols-[1fr_280px] md:items-center"
                            : ""
                            }`}
                    >
                        <div>
                            <p className="text-sm text-[#777900]">
                                한국의 고승 {master.number} · {master.eraLabel} · {master.years}
                            </p>
                            <p className="mt-5 text-base text-[#8A8173]">{master.hanja}</p>
                            <h1 className="mt-1 text-[38px] font-semibold tracking-[-0.05em] md:text-[56px]">
                                {master.name}
                            </h1>
                            <p className="mt-5 max-w-[720px] text-[15px] leading-7 text-[#667085] md:text-[17px] md:leading-8">
                                {master.introduction}
                            </p>
                            <div className="mt-7 flex flex-wrap gap-2">
                                {master.theme.split(" · ").map((item) => (
                                    <span
                                        key={item}
                                        className="rounded-full bg-white px-3.5 py-2 text-sm text-[#666B27]"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {hasWonkwangImage && (
                            <figure>
                                <div className="relative overflow-hidden rounded-[26px] border border-[#D7D9CF] bg-[#DED5C1]">
                                    <img
                                        src="/images/masters/wonkwang.webp"
                                        alt="원광법사가 귀산과 추항에게 세속오계를 전하는 장면"
                                        className="h-auto w-full object-contain"
                                    />

                                    <span
                                        aria-hidden="true"
                                        className="absolute bottom-4 left-4 h-1 w-12 rounded-full bg-[#F4F54A]"
                                    />
                                </div>

                                <figcaption className="mt-3 text-xs font-normal leading-5 text-[#8B95A1]">
                                    원광법사가 귀산과 추항에게 세속오계를 전하는 장면
                                    <span className="mx-1 text-[#C2C7CE]">·</span>
                                    기록을 바탕으로 재구성한 상상도
                                </figcaption>
                            </figure>
                        )}
                    </div>
                </section>
                <div className="mx-auto max-w-[800px] px-5 py-10 md:px-8 md:py-16">
                    {master.sections.map((section, index) => (
                        <section
                            key={section.title}
                            className={index ? "mt-12 border-t border-[#E6E8EB] pt-12" : ""}
                        >
                            <div className="flex items-start gap-3">
                                <span className="mt-2 h-5 w-1 rounded-full bg-[#F4F54A]" />
                                <h2 className="text-[24px] font-semibold md:text-[28px]">
                                    {section.title}
                                </h2>
                            </div>
                            <div className="mt-5 space-y-5">
                                {section.paragraphs.map((p) => (
                                    <p
                                        key={p}
                                        className="text-[15px] font-normal leading-[1.9] text-[#4E5968] md:text-base"
                                    >
                                        {p}
                                    </p>
                                ))}
                            </div>
                        </section>
                    ))}
                    <p className="mt-12 rounded-[20px] bg-[#F1F3ED] px-5 py-5 text-sm leading-7 text-[#66705C]">
                        이 인물의 심화 연표·원문·출전은 차례로 보완하고 있습니다.
                    </p>
                </div>
            </article>
            <nav className="border-t border-[#E2E5E9] bg-white">
                <div className="mx-auto grid max-w-[800px] gap-3 px-5 py-8 md:grid-cols-2 md:px-8">
                    {previousMaster ? (
                        <Link
                            href={`/resources/masters/${previousMaster.slug}`}
                            className="rounded-[18px] border border-[#E1E4E8] p-4 text-sm"
                        >
                            ← {previousMaster.name}
                        </Link>
                    ) : (
                        <div />
                    )}
                    {nextMaster && (
                        <Link
                            href={`/resources/masters/${nextMaster.slug}`}
                            className="rounded-[18px] border border-[#E1E4E8] p-4 text-right text-sm"
                        >
                            {nextMaster.name} →
                        </Link>
                    )}
                </div>
            </nav>
        </main>
    );
}

export default async function MasterDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const master = getMaster(slug);

    if (
        !master ||
        (master.status === "planned" &&
            !representativePreviewSlugs.has(master.slug))
    ) {
        notFound();
    }

    return slug === "wonhyo" ||
        slug === "wonkwang" ||
        slug === "gyunyeo" ? (
        <DeepPage slug={slug} />
    ) : (
        <SummaryPage slug={slug} />
    );
}
