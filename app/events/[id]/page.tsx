import Link from "next/link";
import { notFound } from "next/navigation";

const events = {
    "1": {
        category: "문화행사",
        title: "별빛 아래 만나는 산사의 음악",
        shortTitle: "산사 음악회",
        organizer: "연화사",
        location: "연화사 산사마당",
        date: "2026년 8월 22일",
        time: "17:30",
        target: "누구나 참여 가능",
        price: "무료",
        image: "/images/hero/temple-concert.webp",
        description:
            "저녁 노을이 내려앉은 산사에서 가야금과 대금, 첼로의 선율을 만나보세요. 음악과 차담이 함께하는 편안한 문화행사입니다.",
    },
};

type EventId = keyof typeof events;

const eventProgram = [
    { time: "17:30", title: "입장 및 산사 둘러보기" },
    { time: "18:00", title: "스님의 환영 이야기" },
    { time: "18:20", title: "가야금·대금·첼로가 함께하는 음악회" },
    { time: "19:20", title: "차담과 자유로운 이야기" },
];

export default async function EventDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const event = events[id as EventId];

    if (!event) {
        notFound();
    }

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
                                {event.category} · {event.organizer}
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
                                고요한 산사에서 만나는 특별한 저녁
                            </h2>

                            <div className="mt-5 space-y-4 text-[15px] leading-8 text-[#4E5968]">
                                <p>
                                    분주한 일상에서 잠시 벗어나 산사의 자연과 음악을 함께
                                    느껴보는 시간입니다. 전통악기와 서양악기의 조화로운 선율이
                                    해 질 무렵의 산사에 잔잔하게 울려 퍼집니다.
                                </p>

                                <p>
                                    공연이 끝난 뒤에는 따뜻한 차와 함께 연주자와 참가자가
                                    자유롭게 이야기를 나누는 차담 시간이 이어집니다.
                                </p>
                            </div>
                        </section>

                        <section className="mt-11">
                            <p className="text-sm font-medium text-[#766900]">프로그램</p>

                            <h2 className="mt-2 text-[27px] font-semibold tracking-[-0.035em]">
                                행사 일정
                            </h2>

                            <div className="mt-5 overflow-hidden rounded-[22px] border border-[#E3E8EF]">
                                {eventProgram.map((item, index) => (
                                    <div
                                        key={item.time}
                                        className={`flex gap-5 px-5 py-4 md:px-6 ${index !== eventProgram.length - 1
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
                                <li>
                                    · 산사는 저녁에 기온이 내려갈 수 있으니 얇은 겉옷을
                                    준비해주세요.
                                </li>
                                <li>· 공연 중에는 휴대전화의 소리를 꺼주세요.</li>
                                <li>· 사찰 내에서는 음주와 흡연이 불가능합니다.</li>
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
                                        {event.location}
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
                                href={`/events/${id}/apply`}
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
