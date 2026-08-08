import Link from "next/link";
import { notFound } from "next/navigation";
import { getMaster } from "../../../data";
import { wonhyoIllustrations } from "../../../illustrations/data/wonhyo";

type PageProps = {
    params: Promise<{
        slug: string;
        storySlug: string;
    }>;
};

export default async function IllustrationStoryPage({
    params,
}: PageProps) {
    const { slug, storySlug } = await params;
    const master = getMaster(slug);

    if (!master) notFound();

    const stories = slug === "wonhyo" ? wonhyoIllustrations : [];
    const story = stories.find((item) => item.slug === storySlug);

    if (!story) notFound();

    return (
        <main className="min-h-screen bg-[#F7F8FA] text-[#171B22]">

            <section className="border-b border-[#E4E7DF] bg-[#F4F6EF]">
                <div className="mx-auto max-w-[900px] px-5 py-12 md:px-8 md:py-18">
                    <Link href={`/resources/masters/${slug}/illustrations`} className="text-sm text-[#777900]">← 삽화 일화</Link>

                    <div className="flex flex-wrap items-center gap-2 text-sm text-[#777900]">
                        <span>{master.name}</span>
                        <span className="text-[#C4C8BD]">·</span>
                        <span>{story.classification}</span>
                        <span className="text-[#C4C8BD]">·</span>
                        <span>{story.scenes.length}장면</span>
                    </div>

                    <h1 className="mt-4 max-w-[760px] break-keep text-[36px] font-semibold leading-[1.25] tracking-[-0.045em] md:text-[52px]">
                        {story.title}
                    </h1>

                    <p className="mt-5 max-w-[720px] break-keep text-[15px] leading-7 text-[#667085] md:text-[17px] md:leading-8">
                        {story.summary}
                    </p>

                    <p className="mt-6 text-xs leading-6 text-[#8B95A1]">
                        출전: {story.source}
                    </p>
                </div>
            </section>

            <nav
                className="border-b border-[#E6E8E3] bg-white/95 backdrop-blur"
                aria-label="장면 바로가기"
            >
                <div className="mx-auto flex max-w-[900px] gap-1 overflow-x-auto px-5 py-3 md:px-8">
                    {story.scenes.map((scene) => (
                        <a
                            key={scene.number}
                            href={`#scene-${scene.number}`}
                            className="shrink-0 rounded-full px-3.5 py-2 text-sm text-[#667085] hover:bg-[#F4F54A] hover:text-[#252A31]"
                        >
                            {scene.number}. {scene.title}
                        </a>
                    ))}
                </div>
            </nav>

            <article className="mx-auto max-w-[900px] px-5 py-12 md:px-8 md:py-16">
                <div className="space-y-20 md:space-y-28">
                    {story.scenes.map((scene) => (
                        <section
                            key={scene.number}
                            id={`scene-${scene.number}`}
                            className="scroll-mt-24"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium tabular-nums text-[#A0A60B]">
                                    {scene.number}
                                </span>

                                <span className="h-px flex-1 bg-[#E2E5DF]" />
                            </div>

                            <h2 className="mt-4 break-keep text-[28px] font-semibold tracking-[-0.04em] md:text-[38px]">
                                {scene.title}
                            </h2>

                            <figure className="mt-7">
                                <div className="aspect-square overflow-hidden rounded-[24px] border border-[#E2E5DF] bg-[#F5F2E9]">
                                    <img
                                        src={scene.image.src}
                                        alt={scene.image.alt}
                                        className="h-full w-full object-cover object-bottom"
                                    />
                                </div>
                            </figure>

                            <div className="mx-auto mt-9 max-w-[720px] space-y-5">
                                {scene.content.map((item, index) =>
                                    item.type === "dialogue" ? (
                                        <p
                                            key={`${scene.number}-${index}`}
                                            className="break-keep border-l-4 border-[#F4F54A] bg-white py-3 pl-5 pr-4 text-[15px] font-medium leading-8 text-[#434B56] md:text-base"
                                        >
                                            {item.text}
                                        </p>
                                    ) : (
                                        <p
                                            key={`${scene.number}-${index}`}
                                            className="break-keep text-[15px] font-normal leading-[1.95] text-[#4E5968] md:text-base"
                                        >
                                            {item.text}
                                        </p>
                                    ),
                                )}
                            </div>
                        </section>
                    ))}
                </div>

                <section className="mt-24 rounded-[24px] border border-[#E2E5DF] bg-white p-5 md:p-8">
                    <p className="text-sm font-medium text-[#777900]">
                        기록 안내
                    </p>

                    <h2 className="mt-2 text-[25px] font-semibold tracking-[-0.035em] md:text-[30px]">
                        기록과 이야기의 재구성
                    </h2>

                    <div className="mt-5 space-y-4">
                        {story.recordGuide.map((paragraph) => (
                            <p
                                key={paragraph}
                                className="break-keep text-sm font-normal leading-7 text-[#667085] md:text-[15px] md:leading-8"
                            >
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </section>

                <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">
                    <Link
                        href={`/resources/masters/${slug}/illustrations`}
                        className="rounded-full border border-[#DDE1D8] bg-white px-5 py-3 text-center text-sm text-[#56606D]"
                    >
                        다른 삽화 일화 보기
                    </Link>

                    <Link
                        href={`/resources/masters/${slug}`}
                        className="rounded-full bg-[#F4F54A] px-5 py-3 text-center text-sm text-[#252A31]"
                    >
                        {master.name} 상세자료
                    </Link>
                </div>
            </article>
        </main>
    );
}
