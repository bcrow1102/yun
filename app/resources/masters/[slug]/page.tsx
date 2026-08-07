import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMaster, masters } from "../data";
import { wonhyoArticle } from "./articles/wonhyo";
import { wonkwangArticle } from "./articles/wonkwang";
import { gyunyeoArticle } from "./articles/gyunyeo";
import MobileArchiveSection, {
    MobileArchiveDefault,
    MobileArchiveRoot,
} from "./MobileArchiveSection";

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
    return (
        <span className="text-xs font-normal text-[#8B95A1]">
            {type === "기록" ? "문헌 기록" : type === "전승" ? "후대 전승" : "연구 해석"}
        </span>
    );
}

function DeepPage({ slug }: { slug: "wonhyo" | "wonkwang" | "gyunyeo" }) {
    const article =
        slug === "wonhyo"
            ? wonhyoArticle
            : slug === "wonkwang"
                ? wonkwangArticle
                : gyunyeoArticle;

    const master = getMaster(slug)!;

    const illustrationCountBySlug: Record<typeof slug, number> = {
        wonhyo: 3,
        wonkwang: 1,
        gyunyeo: 1,
    };

    const illustrationCount = illustrationCountBySlug[slug];

    const detailLinks = [
        { href: "timeline", label: "생애 연표" },
        { href: "life", label: "상세 일대기" },
        { href: "thought", label: "핵심 사상" },
        { href: "works", label: "주요 저술" },
        { href: "stories", label: "일화와 전승" },
    ] as const;

    return (
        <main className="min-h-screen bg-[#F7F8FA] text-[#171B22]">
            <SiteHeader />

            <MobileArchiveRoot>
                <article>
                    <MobileArchiveDefault>
                        <section className="border-b border-[#E4E7DF] bg-[#F4F6EF]">
                            <div className="mx-auto max-w-[1120px] px-4 py-9 md:grid md:grid-cols-[300px_1fr] md:items-center md:gap-12 md:px-8 md:py-14">
                                <figure>
                                    <div className="relative mx-auto aspect-[4/5] w-full max-w-[320px] overflow-hidden rounded-[22px] border border-[#D7D9CF] bg-white md:mx-0 md:max-w-none">
                                        <img
                                            src={article.portrait.src}
                                            alt={article.portrait.alt}
                                            className="h-full w-full object-cover object-center"
                                        />
                                    </div>

                                    <figcaption className="mx-auto mt-3 max-w-[320px] text-xs font-normal leading-5 text-[#8B95A1] md:mx-0 md:max-w-[300px]">
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

                                <div className="mt-7 min-w-0 md:mt-0">
                                    <p className="text-sm text-[#777900]">
                                        한국의 고승 {master.number} · {master.eraLabel} · {master.years}
                                    </p>

                                    <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                                        <h1 className="text-[36px] font-semibold leading-[1.15] tracking-[-0.05em] md:text-[52px]">
                                            {master.name}
                                        </h1>
                                        <span className="text-sm text-[#8A8173] md:text-base">
                                            {master.hanja}
                                        </span>
                                    </div>

                                    <p className="mt-3 text-sm text-[#746A57] md:text-[15px]">
                                        {master.theme}
                                    </p>

                                    <p className="mt-4 max-w-[640px] break-keep text-[15px] leading-7 text-[#667085] md:text-[17px] md:leading-8">
                                        {article.subtitle}
                                    </p>

                                    <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#8B95A1]">
                                        <span>{article.readingTime}</span>
                                        <span>검토 {article.lastReviewed}</span>
                                    </div>

                                    <dl
                                        className="mt-6 hidden grid-cols-2 gap-x-8 gap-y-2.5 md:grid"
                                        aria-label={`${master.name} 기본 정보`}
                                    >
                                        {article.quickFacts.map((fact) => (
                                            <div
                                                key={fact.label}
                                                className="border-t border-[#DDE1D8] pt-2"
                                            >
                                                <dt className="text-[11px] leading-4 text-[#8B95A1]">
                                                    {fact.label}
                                                </dt>
                                                <dd className="mt-1 break-keep text-[13px] leading-5 text-[#3F4752]">
                                                    {fact.value}
                                                </dd>
                                            </div>
                                        ))}
                                    </dl>
                                </div>
                            </div>
                        </section>
                    </MobileArchiveDefault>

                    {/* PC: 인물 허브 */}
                    <section className="hidden border-b border-[#E5E7EA] bg-white md:block">
                        <div className="mx-auto max-w-[1000px] px-8">
                            <div className="flex items-center gap-8 border-b border-[#ECEEE9] py-4">
                                <span className="w-[76px] shrink-0 text-xs font-medium text-[#8B95A1]">
                                    관련 자료
                                </span>

                                <nav
                                    className="flex flex-wrap items-center gap-x-9 gap-y-3"
                                    aria-label={`${master.name} 관련 자료`}
                                >
                                    <Link
                                        href={`/resources/masters/${slug}/illustrations`}
                                        className="group relative inline-flex items-center pb-1 text-sm text-[#303641] transition hover:text-[#777900]"
                                    >
                                        삽화로 보는 일화
                                        <span className="ml-1.5 text-xs text-[#9AA1AB]">
                                            {illustrationCount}편
                                        </span>
                                        <span
                                            aria-hidden="true"
                                            className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-[#F4F54A] transition-transform duration-200 group-hover:scale-x-100"
                                        />
                                    </Link>

                                    <Link
                                        href={`/resources/masters/${slug}/videos`}
                                        className="group relative inline-flex items-center pb-1 text-sm text-[#303641] transition hover:text-[#777900]"
                                    >
                                        다큐·영상
                                        {master.videos?.length ? (
                                            <span className="ml-1.5 text-xs text-[#9AA1AB]">
                                                {master.videos.length}편
                                            </span>
                                        ) : null}
                                        <span
                                            aria-hidden="true"
                                            className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-[#F4F54A] transition-transform duration-200 group-hover:scale-x-100"
                                        />
                                    </Link>

                                    <Link
                                        href={`/resources/masters/${slug}/academic`}
                                        className="group relative inline-flex pb-1 text-sm text-[#303641] transition hover:text-[#777900]"
                                    >
                                        학술 자료
                                        <span
                                            aria-hidden="true"
                                            className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-[#F4F54A] transition-transform duration-200 group-hover:scale-x-100"
                                        />
                                    </Link>
                                </nav>
                            </div>

                            <div className="flex items-center gap-8 py-5">
                                <span className="w-[76px] shrink-0 text-xs font-medium text-[#8B95A1]">
                                    깊이 읽기
                                </span>

                                <nav
                                    className="flex flex-wrap items-center gap-x-8 gap-y-3"
                                    aria-label={`${master.name} 상세 읽기`}
                                >
                                    {detailLinks.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={`/resources/masters/${slug}/${item.href}`}
                                            className="group relative inline-flex items-center gap-1.5 pb-1 text-sm text-[#303641] transition hover:text-[#777900]"
                                        >
                                            <span>{item.label}</span>
                                            <span
                                                aria-hidden="true"
                                                className="text-[#AEB4BC] transition group-hover:translate-x-0.5 group-hover:text-[#777900]"
                                            >
                                                ›
                                            </span>
                                            <span
                                                aria-hidden="true"
                                                className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-[#F4F54A] transition-transform duration-200 group-hover:scale-x-100"
                                            />
                                        </Link>
                                    ))}
                                </nav>
                            </div>
                        </div>
                    </section>

                    {/* 모바일: 기존 집중형 아코디언 유지 */}
                    <div
                        id="profile"
                        className="mx-auto max-w-[900px] px-5 py-8 md:hidden"
                    >
                        <MobileArchiveDefault>
                            <nav
                                className="mb-5 grid grid-cols-3 overflow-hidden border-y border-[#E5E7EA]"
                                aria-label={`${master.name} 모바일 자료 둘러보기`}
                            >
                                <Link
                                    href={`/resources/masters/${slug}/illustrations`}
                                    className="flex min-h-[58px] items-center justify-center border-r border-[#E5E7EA] px-2 text-center text-[13px] leading-5 text-[#777900]"
                                >
                                    삽화 일화 {illustrationCount}편
                                </Link>

                                <Link
                                    href={`/resources/masters/${slug}/videos`}
                                    className="flex min-h-[58px] items-center justify-center border-r border-[#E5E7EA] px-2 text-center text-[13px] leading-5 text-[#777900]"
                                >
                                    영상{master.videos?.length ? ` ${master.videos.length}편` : ""}
                                </Link>

                                <Link
                                    href={`/resources/masters/${slug}/academic`}
                                    className="flex min-h-[58px] items-center justify-center px-2 text-center text-[13px] leading-5 text-[#777900]"
                                >
                                    학술 자료
                                </Link>
                            </nav>
                        </MobileArchiveDefault>

                        <MobileArchiveSection id="basic" title="기본 정보">
                            <dl className="divide-y divide-[#E5E7EA] border-y border-[#E5E7EA]">
                                {article.quickFacts.map((fact) => (
                                    <div
                                        key={fact.label}
                                        className="grid grid-cols-[88px_1fr] gap-4 py-4"
                                    >
                                        <dt className="text-xs leading-6 text-[#8B95A1]">
                                            {fact.label}
                                        </dt>
                                        <dd className="break-keep text-sm leading-6 text-[#3F4752]">
                                            {fact.value}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </MobileArchiveSection>

                        <MobileArchiveSection id="timeline" title="생애 연표">
                            <section id="timeline" className="scroll-mt-24 pt-16">
                                <SectionTitle
                                    eyebrow={`${master.name}의 생애`}
                                    title="생애 연표"
                                    description="확정 가능한 기록과 후대 전승, 연구상 추정을 구분해서 살펴봅니다."
                                />

                                <div className="relative mt-8 space-y-0 before:absolute before:bottom-3 before:left-[5px] before:top-3 before:w-px before:bg-[#DDE1D8]">
                                    {article.timeline.map((item) => (
                                        <div
                                            key={`${item.year}-${item.title}`}
                                            className="relative grid gap-3 pb-8 pl-8"
                                        >
                                            <span className="absolute left-0 top-2 h-[11px] w-[11px] rounded-full border-[3px] border-[#F4F54A] bg-white" />

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

                                            <div className="rounded-[18px] border border-[#E4E7E1] bg-white p-5">
                                                <div className="flex flex-wrap items-center justify-between gap-2">
                                                    <h3 className="text-[17px] font-medium">
                                                        {item.title}
                                                    </h3>
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
                        </MobileArchiveSection>

                        <MobileArchiveSection id="life" title="상세 일대기">
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
                                            <p className="text-sm text-[#A0A60B]">
                                                {section.eyebrow}
                                            </p>
                                            <h3 className="mt-2 text-[25px] font-semibold tracking-[-0.035em]">
                                                {section.title}
                                            </h3>

                                            <div className="mt-5 space-y-5">
                                                {section.paragraphs.map((p) => (
                                                    <p
                                                        key={p}
                                                        className="text-[15px] font-normal leading-[1.95] text-[#4E5968]"
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
                        </MobileArchiveSection>

                        <MobileArchiveSection id="thought" title="핵심 사상">
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
                                            className="rounded-[22px] border border-[#E2E5DF] bg-white p-5"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <p className="text-sm text-[#8B95A1]">
                                                        {thought.hanja}
                                                    </p>
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
                                                        className="text-sm font-normal leading-7 text-[#596270]"
                                                    >
                                                        {p}
                                                    </p>
                                                ))}
                                            </div>
                                        </section>
                                    ))}
                                </div>
                            </section>
                        </MobileArchiveSection>

                        <MobileArchiveSection id="works" title="주요 저술">
                            <section id="works" className="scroll-mt-24 pt-20">
                                <SectionTitle
                                    eyebrow="저술"
                                    title="주요 저술과 전승 상태"
                                    description="제목만 나열하지 않고 각 책이 무엇을 해결하려 했는지 살펴봅니다."
                                />

                                <div className="mt-8 grid gap-4">
                                    {article.works.map((work) => (
                                        <article
                                            key={work.title}
                                            className="rounded-[20px] border border-[#E2E5DF] bg-white p-5"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="text-xs text-[#8B95A1]">
                                                        {work.hanja}
                                                    </p>
                                                    <h3 className="mt-1 text-lg font-medium">
                                                        『{work.title}』
                                                    </h3>
                                                </div>

                                                <span className="shrink-0 text-xs text-[#8B95A1]">
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
                        </MobileArchiveSection>

                        <MobileArchiveSection id="stories" title="일화와 전승">
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
                                            <div className="border-b border-[#ECEEE9] bg-[#F5F6F1] px-5 py-4">
                                                <div className="flex flex-wrap items-center justify-between gap-2">
                                                    <h3 className="text-lg font-medium">
                                                        {story.title}
                                                    </h3>
                                                    <span className="text-xs text-[#8B95A1]">
                                                        {story.classification}
                                                    </span>
                                                </div>

                                                <p className="mt-1 text-xs text-[#8B95A1]">
                                                    출전: {story.source}
                                                </p>
                                            </div>

                                            <div className="p-5">
                                                <p className="text-[15px] font-normal leading-8 text-[#4E5968]">
                                                    {story.text}
                                                </p>

                                                <div className="mt-5 rounded-[16px] bg-[#F7F8FA] px-4 py-4">
                                                    <p className="text-xs text-[#8B95A1]">
                                                        어떻게 읽을까
                                                    </p>
                                                    <p className="mt-1.5 text-sm font-normal leading-7 text-[#596270]">
                                                        {story.meaning}
                                                    </p>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        </MobileArchiveSection>

                        <MobileArchiveDefault>
                            <section className="mt-20 rounded-[24px] bg-[#20242C] px-5 py-7 text-white">
                                <p className="text-sm text-[#D7D96A]">
                                    오늘 우리에게 묻는 것
                                </p>

                                <ol className="mt-5 space-y-4">
                                    {article.today.map((question, index) => (
                                        <li
                                            key={question}
                                            className="flex gap-3 text-sm font-normal leading-7 text-white/80"
                                        >
                                            <span className="text-[#D7D96A]">
                                                0{index + 1}
                                            </span>
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
                                                <p className="text-sm font-medium text-[#777900] md:text-[#303641] md:group-hover:text-[#777900]">
                                                    {source.label}
                                                </p>
                                                <p className="mt-1 text-xs text-[#8B95A1]">
                                                    {source.organization}
                                                </p>
                                                <p className="mt-2 text-sm font-normal leading-6 text-[#667085]">
                                                    {source.note}
                                                </p>
                                            </div>

                                            <span className="mt-1 shrink-0 text-[#A0A60B]">
                                                ↗
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            </section>

                            <div className="mt-14 flex justify-center">
                                <Link
                                    href="/resources/masters"
                                    className="rounded-full border border-[#DDE1D8] bg-white px-5 py-3 text-sm text-[#777900] md:text-[#56606D]"
                                >
                                    한국의 고승 목록으로
                                </Link>
                            </div>
                        </MobileArchiveDefault>
                    </div>
                </article>
            </MobileArchiveRoot>
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
                        className={`mx-auto max-w-[1100px] px-4 py-12 md:px-8 md:py-20 ${hasWonkwangImage
                            ? "grid gap-8 md:grid-cols-[1fr_300px] md:items-center"
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
                                <div className="relative mx-auto aspect-[4/5] w-full max-w-[320px] overflow-hidden rounded-[22px] border border-[#D7D9CF] bg-white md:max-w-none">
                                    <img
                                        src="/images/masters/wonkwang.webp"
                                        alt="원광법사가 귀산과 추항에게 세속오계를 전하는 장면"
                                        className="h-full w-full object-cover object-center"
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
