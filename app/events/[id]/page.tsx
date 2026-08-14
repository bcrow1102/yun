import Link from "next/link";
import { notFound } from "next/navigation";
import {
    getEventById,
    getHostTempleForEvent,
    getVenueTempleForEvent,
} from "../data";

export default async function EventDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const event = getEventById(id);

    if (!event) {
        notFound();
    }

    const hostTemple = getHostTempleForEvent(event);
    const venueTemple = getVenueTempleForEvent(event);
    const distinctVenueTemple =
        venueTemple?.slug === hostTemple?.slug ? undefined : venueTemple;

    return (
        <div className="min-h-screen bg-white text-[#252A31]">

            <main>
                <section className="relative overflow-hidden bg-[#F4E9D5]">
                    <img
                        src={event.image}
                        alt={event.shortTitle}
                        className="absolute inset-0 h-full w-full object-cover object-center"
                    />

                    <div className="absolute inset-0 bg-black/35" />

                    <div className="relative mx-auto flex min-h-[440px] max-w-6xl items-center px-5 py-14 md:min-h-[520px] md:px-8">
                        <div className="max-w-[620px]">
                            <span className="inline-flex rounded-full border border-white/30 bg-black/25 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                                {event.category} · {hostTemple ? (
                                    <Link
                                        href={`/temples/guide/${hostTemple.slug}`}
                                        className="ml-1 underline decoration-white/60 underline-offset-2"
                                    >
                                        {event.organizer}
                                    </Link>
                                ) : (
                                    event.organizer
                                )}
                            </span>

                            <h1 className="mt-5 break-keep text-[38px] font-semibold leading-[1.15] tracking-[-0.05em] text-white drop-shadow-lg md:text-[58px]">
                                {event.title}
                            </h1>

                            <p className="mt-5 max-w-[560px] break-keep text-[15px] leading-7 text-white/90 drop-shadow-md md:text-base">
                                {event.description}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1fr_340px] md:px-8 md:py-14">
                    <div>
                        <section>
                            <p className="text-sm font-medium text-[#766900]">행사 소개</p>

                            <h2 className="mt-2 text-[27px] font-semibold tracking-[-0.035em]">
                                {event.detailHeading}
                            </h2>

                            <div className="mt-5 space-y-4 text-[15px] leading-8 text-[#4E5968]">
                                {event.detailParagraphs.map((paragraph) => (
                                    <p key={paragraph}>{paragraph}</p>
                                ))}
                            </div>
                        </section>

                        <section className="mt-11">
                            <p className="text-sm font-medium text-[#766900]">프로그램</p>

                            <h2 className="mt-2 text-[27px] font-semibold tracking-[-0.035em]">
                                행사 일정
                            </h2>

                            <div className="mt-5 overflow-hidden rounded-[22px] border border-[#E3E8EF]">
                                {event.program.map((item, index) => (
                                    <div
                                        key={item.time}
                                        className={`flex gap-5 px-5 py-4 md:px-6 ${index !== event.program.length - 1
                                            ? "border-b border-[#EEF0F2]"
                                            : ""
                                            }`}
                                    >
                                        <span className="w-14 shrink-0 text-sm font-medium text-[#766900]">
                                            {item.time}
                                        </span>

                                        <span className="text-sm text-[#4E5968]">
                                            {item.title}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="mt-11 rounded-[24px] bg-[#FFF9DC] p-6">
                            <p className="text-sm font-medium text-[#766900]">
                                참여 전 안내
                            </p>

                            <ul className="mt-4 space-y-2 text-sm leading-6 text-[#5E574C]">
                                {event.notices.map((notice) => (
                                    <li key={notice}>· {notice}</li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    <aside className="md:sticky md:top-24 md:self-start">
                        <div className="rounded-[24px] border border-[#E3E8EF] bg-white p-6 shadow-[0_10px_30px_rgba(25,31,40,0.07)]">
                            <h2 className="text-xl font-semibold">행사 정보</h2>

                            <dl className="mt-5 space-y-4">
                                <div>
                                    <dt className="text-xs text-[#8B95A1]">일시</dt>
                                    <dd className="mt-1 text-sm font-medium">
                                        {event.date} {event.time}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-xs text-[#8B95A1]">장소</dt>
                                    <dd className="mt-1 text-sm font-medium">
                                        {distinctVenueTemple ? (
                                            <Link
                                                href={`/temples/guide/${distinctVenueTemple.slug}`}
                                                className="underline decoration-[#B7C1B2] underline-offset-2"
                                            >
                                                {event.location}
                                            </Link>
                                        ) : (
                                            event.location
                                        )}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-xs text-[#8B95A1]">대상</dt>
                                    <dd className="mt-1 text-sm font-medium">{event.target}</dd>
                                </div>

                                <div>
                                    <dt className="text-xs text-[#8B95A1]">참가비</dt>
                                    <dd className="mt-1 text-sm font-medium">
                                        {event.price} · 사전 신청
                                    </dd>
                                </div>
                            </dl>

                            <Link
                                href={event.applyHref}
                                className="mt-6 flex w-full items-center justify-center rounded-xl bg-[#FEE500] px-4 py-3.5 text-sm font-medium text-[#171B22] transition hover:bg-[#F5DC00]"
                            >
                                참가 신청하기
                            </Link>

                            <p className="mt-3 text-center text-xs leading-5 text-[#A0A7B0]">
                                행사 일정과 참가 안내를 확인한 후 신청해 주세요.
                            </p>
                        </div>
                    </aside>
                </section>
            </main>
        </div>
    );
}
