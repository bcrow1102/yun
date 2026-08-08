import Link from "next/link";

const upcomingEvents = [
    {
        category: "문화행사",
        title: "산사 음악회",
        place: "연화사",
        date: "2026. 08. 22",
        description: "고요한 산사에서 음악과 이야기가 함께하는 초저녁 문화행사",
        href: "/events/1",
        image: "/images/hero/temple-concert.webp",
        ready: true,
    },
    {
        category: "체험",
        title: "연꽃등 만들기",
        place: "마음사",
        date: "준비 중",
        description: "온 가족이 함께 만드는 전통 연꽃등 체험",
        image: "",
        ready: false,
    },
    {
        category: "교육",
        title: "초심자를 위한 불교문화 강좌",
        place: "보현사",
        date: "준비 중",
        description: "생활 속에서 쉽게 만나는 불교문화 이야기",
        image: "",
        ready: false,
    },
];

export default function EventsPage() {
    return (
        <div className="min-h-screen bg-white text-[#191F28]">
            <main>
                <section className="bg-[#FDFDC7]">
                    <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
                        <p className="text-sm font-medium text-[#766900]">행사·교육</p>

                        <h1 className="mt-3 text-[34px] font-semibold tracking-[-0.045em] md:text-[48px]">
                            함께하면 더 깊어지는 시간
                        </h1>

                        <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#667085] md:text-base">
                            산사 문화행사부터 체험과 교육까지, 가까운 곳에서 열리는 다양한
                            불교 소식을 만나보세요.
                        </p>
                    </div>
                </section>

                <section className="mx-auto max-w-6xl px-4 py-9 md:px-8 md:py-14">
                    <div className="mb-6 flex items-end justify-between">
                        <div>
                            <p className="text-sm font-medium text-[#766900]">추천 행사</p>

                            <h2 className="mt-1 text-[25px] font-semibold tracking-[-0.035em] md:text-[30px]">
                                지금 만나볼 행사·교육
                            </h2>
                        </div>

                        <span className="text-sm text-[#8B95A1]">
                            준비된 소식부터 공개됩니다
                        </span>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {upcomingEvents.map((event) =>
                            event.ready ? (
                                <Link
                                    key={event.title}
                                    href={event.href!}
                                    className="group overflow-hidden rounded-[24px] border border-[#E3E8EF] bg-white transition hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(25,31,40,0.09)]"
                                >
                                    <span className="block h-52 overflow-hidden">
                                        <img
                                            src={event.image}
                                            alt="산사에서 열리는 음악회"
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                                        />
                                    </span>

                                    <span className="block p-5">
                                        <span className="flex items-center justify-between gap-3">
                                            <span className="rounded-full bg-[#FDFDC7] px-3 py-1.5 text-xs font-medium text-[#5F610E]">
                                                {event.category}
                                            </span>

                                            <span className="text-sm text-[#667085]">
                                                {event.date}
                                            </span>
                                        </span>

                                        <strong className="mt-4 block text-[21px] font-semibold">
                                            {event.title}
                                        </strong>

                                        <span className="mt-1 block text-sm text-[#8B95A1]">
                                            {event.place}
                                        </span>

                                        <span className="mt-4 block text-sm leading-6 text-[#667085]">
                                            {event.description}
                                        </span>

                                        <span className="mt-5 block border-t border-[#EEF0F2] pt-4 text-sm font-medium text-[#252A31]">
                                            자세히 보기 →
                                        </span>
                                    </span>
                                </Link>
                            ) : (
                                <article
                                    key={event.title}
                                    className="overflow-hidden rounded-[24px] border border-[#E8EAED] bg-[#FAFAFA]"
                                >
                                    <div className="flex h-52 items-center justify-center bg-[#F3F4F6] text-5xl opacity-60">
                                        {event.category === "교육" ? "📖" : "🏮"}
                                    </div>

                                    <div className="p-5">
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[#667085]">
                                                {event.category}
                                            </span>

                                            <span className="text-sm text-[#A0A7B0]">
                                                {event.date}
                                            </span>
                                        </div>

                                        <h3 className="mt-4 text-[20px] font-medium text-[#4E5968]">
                                            {event.title}
                                        </h3>

                                        <p className="mt-1 text-sm text-[#8B95A1]">
                                            {event.place}
                                        </p>

                                        <p className="mt-4 text-sm leading-6 text-[#8B95A1]">
                                            {event.description}
                                        </p>
                                    </div>
                                </article>
                            )
                        )}
                    </div>

                    <div className="mt-10 rounded-[24px] bg-[#FDFDC7] px-5 py-6 md:flex md:items-center md:justify-between md:px-7">
                        <div>
                            <p className="mt-2 text-sm leading-6 text-[#6D6200]">
                                행사와 교육 소식을 직접 등록해 보세요.
                            </p>
                        </div>

                        <Link
                            href="/events/new"
                            className="mt-5 inline-flex rounded-xl bg-[#F4F54A] px-5 py-3 text-sm font-medium text-[#171B22] transition hover:bg-[#E8EA35] md:mt-0"
                        >
                            행사·교육 등록하기
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
}
