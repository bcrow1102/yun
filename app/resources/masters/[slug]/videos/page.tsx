import Link from "next/link";
import { notFound } from "next/navigation";
import { getMaster } from "../../data";

type PageProps = {
    params: Promise<{ slug: string }>;
};

export default async function MasterVideosPage({ params }: PageProps) {
    const { slug } = await params;
    const master = getMaster(slug);

    if (!master) notFound();

    const videos = master.videos ?? [];

    return (
        <main className="min-h-screen bg-[#F7F8FA] text-[#171B22]">

            <section className="border-b border-[#E4E7DF] bg-[#F4F6EF]">
                <div className="mx-auto max-w-[900px] px-5 py-9 md:px-8 md:py-14">
                    <Link href={`/resources/masters/${slug}`} className="text-sm text-[#777900]">← {master.name}</Link>
                    <p className="text-sm text-[#777900]">
                        {master.eraLabel} · {master.years}
                    </p>

                    <h1 className="mt-2 text-[32px] font-semibold tracking-[-0.04em] md:text-[44px]">
                        다큐·영상
                    </h1>

                    <p className="mt-3 max-w-[680px] break-keep text-sm leading-7 text-[#667085] md:text-[15px]">
                        공식 채널에서 공개한 {master.name} 관련 영상을 모아 소개합니다.
                    </p>
                </div>
            </section>

            <nav
                className="sticky top-16 z-20 hidden border-b border-[#E1E4E8] bg-white/95 backdrop-blur md:block"
                aria-label={`${master.name} 자료 탭`}
            >
                <div className="mx-auto flex max-w-[900px] gap-9 px-8">
                    <Link
                        href={`/resources/masters/${slug}`}
                        className="py-4 text-sm text-[#667085] hover:text-[#20242B]"
                    >
                        인물 개요
                    </Link>

                    <Link
                        href={`/resources/masters/${slug}/illustrations`}
                        className="py-4 text-sm text-[#667085] hover:text-[#20242B]"
                    >
                        삽화로 보는 일화
                    </Link>

                    <Link
                        href={`/resources/masters/${slug}/videos`}
                        className="border-b-2 border-[#F4F54A] py-4 text-sm font-semibold text-[#20242B]"
                    >
                        다큐·영상
                    </Link>

                    <Link
                        href={`/resources/masters/${slug}/academic`}
                        className="py-4 text-sm text-[#667085] hover:text-[#20242B]"
                    >
                        학술 자료
                    </Link>
                </div>
            </nav>

            <div className="mx-auto max-w-[900px] px-5 py-10 md:px-8 md:py-16">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium text-[#777900]">
                            함께 보는 자료
                        </p>
                        <h2 className="mt-2 text-[27px] font-semibold tracking-[-0.04em] md:text-[36px]">
                            영상 목록
                        </h2>
                    </div>

                    <span className="text-sm text-[#8B95A1]">
                        총 {videos.length}편
                    </span>
                </div>

                {videos.length ? (
                    <div className="mt-7 divide-y divide-[#E1E4E8] border-y border-[#E1E4E8]">
                        {videos.map((video, index) => (
                            <article
                                key={video.youtubeId}
                                className="grid gap-4 py-6 md:grid-cols-[280px_1fr] md:gap-6"
                            >
                                <div className="aspect-video overflow-hidden rounded-[16px] bg-black">
                                    <iframe
                                        src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
                                        title={video.title}
                                        className="h-full w-full"
                                        loading="lazy"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        allowFullScreen
                                    />
                                </div>

                                <div className="min-w-0 md:py-1">
                                    <p className="text-xs text-[#8B95A1]">
                                        {String(index + 1).padStart(2, "0")}
                                        <span className="mx-2 text-[#CDD0D5]">·</span>
                                        {video.type ?? "관련 영상"}
                                        {video.duration ? (
                                            <>
                                                <span className="mx-2 text-[#CDD0D5]">·</span>
                                                {video.duration}
                                            </>
                                        ) : null}
                                    </p>

                                    <h3 className="mt-2 break-keep text-lg font-medium leading-7 text-[#303641]">
                                        {video.title}
                                    </h3>

                                    <p className="mt-2 text-sm text-[#8B95A1]">
                                        제작·제공: {video.channel}
                                    </p>

                                    {video.note ? (
                                        <p className="mt-3 break-keep text-sm font-normal leading-7 text-[#667085]">
                                            {video.note}
                                        </p>
                                    ) : null}
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="mt-7 border-y border-[#E1E4E8] py-12 text-center">
                        <p className="text-base font-medium text-[#303641]">
                            관련 영상을 준비하고 있습니다.
                        </p>
                        <p className="mt-2 text-sm leading-7 text-[#8B95A1]">
                            공식 채널에서 확인한 자료부터 순차적으로 연결합니다.
                        </p>
                    </div>
                )}

                <p className="mt-6 text-xs leading-6 text-[#8B95A1]">
                    영상은 원 게시자의 유튜브 플레이어를 통해 제공되며, 저작권과
                    운영 권한은 해당 제작자와 채널에 있습니다.
                </p>
            </div>
        </main>
    );
}
