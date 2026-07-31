import Link from "next/link";

const program = [
    { time: "17:30", title: "입장 및 산사 둘러보기" },
    { time: "18:00", title: "스님의 환영 이야기" },
    { time: "18:20", title: "가야금·대금·첼로가 함께하는 음악회" },
    { time: "19:20", title: "차담과 자유로운 이야기" },
];

function LotusIcon() {
    return (
        <svg viewBox="0 0 32 32" fill="none" className="h-6 w-6">
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

export default function TempleConcertPage() {
    return (
        <div className="min-h-screen bg-white text-[#252A31]">
            <header className="sticky top-0 z-30 border-b border-[#EEF0F2] bg-white/95 backdrop-blur">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:h-[72px] md:px-8">
                    <Link href="/" className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FEE500] md:h-10 md:w-10">
                            <LotusIcon />
                        </span>
                        <span className="text-xl font-semibold">연</span>
                    </Link>

                    <Link
                        href="/events"
                        className="rounded-xl border border-[#E3E8EF] px-4 py-2.5 text-sm font-medium text-[#4E5968]"
                    >
                        행사·교육 목록
                    </Link>
                </div>
            </header>

            <main>
                <section className="relative overflow-hidden bg-[#F4E9D5]">
                    <img
                        src="/images/hero/temple-concert.webp"
                        alt="해 질 무렵 산사에서 열리는 음악회"
                        className="absolute inset-0 h-full w-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FFF8EA]/80 via-[#FFF8EA]/32 to-transparent" />

                    <div className="relative mx-auto flex min-h-[440px] max-w-6xl items-center px-5 py-14 md:min-h-[520px] md:px-8">
                        <div className="max-w-[620px]">
                            <span className="inline-flex rounded-full bg-white/80 px-3 py-1.5 text-xs font-medium text-[#6D6200] backdrop-blur">
                                예시 행사 · 산사 문화행사
                            </span>
                            <h1 className="mt-5 text-[38px] font-semibold leading-[1.15] tracking-[-0.05em] md:text-[58px]">
                                별빛 아래 만나는
                                <br />
                                산사의 음악
                            </h1>
                            <p className="mt-5 max-w-[520px] text-[15px] leading-7 text-[#5E574C] md:text-base">
                                저녁 노을이 내려앉은 산사에서 가야금과 대금, 첼로의 선율을
                                만나보세요. 음악과 차담이 함께하는 편안한 문화행사입니다.
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
                                {program.map((item, index) => (
                                    <div
                                        key={item.time}
                                        className={`flex gap-5 px-5 py-4 md:px-6 ${index !== program.length - 1
                                            ? "border-b border-[#EEF0F2]"
                                            : ""
                                            }`}
                                    >
                                        <span className="w-14 shrink-0 text-sm font-medium text-[#766900]">
                                            {item.time}
                                        </span>
                                        <span className="text-sm text-[#4E5968]">{item.title}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="mt-11 rounded-[24px] bg-[#FFF9DC] p-6">
                            <p className="text-sm font-medium text-[#766900]">참여 전 안내</p>
                            <ul className="mt-4 space-y-2 text-sm leading-6 text-[#5E574C]">
                                <li>· 산사는 저녁에 기온이 내려갈 수 있으니 얇은 겉옷을 준비해주세요.</li>
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
                                    <dd className="mt-1 text-sm font-medium">2026년 8월 22일 17:30</dd>
                                </div>
                                <div>
                                    <dt className="text-xs text-[#8B95A1]">장소</dt>
                                    <dd className="mt-1 text-sm font-medium">연화사 산사마당</dd>
                                </div>
                                <div>
                                    <dt className="text-xs text-[#8B95A1]">대상</dt>
                                    <dd className="mt-1 text-sm font-medium">누구나 참여 가능</dd>
                                </div>
                                <div>
                                    <dt className="text-xs text-[#8B95A1]">참가비</dt>
                                    <dd className="mt-1 text-sm font-medium">무료 · 사전 신청</dd>
                                </div>
                            </dl>

                            <Link
                                href="/events/temple-concert/apply"
                                className="mt-6 flex w-full items-center justify-center rounded-xl bg-[#FEE500] px-4 py-3.5 text-sm font-medium text-[#171B22] transition hover:bg-[#F5DC00]"
                            >
                                참가 신청하기
                            </Link>

                            <p className="mt-3 text-center text-xs leading-5 text-[#A0A7B0]">
                                참가비는 무료이며 사전 신청이 필요합니다.
                            </p>
                        </div>
                    </aside>
                </section>
            </main>
        </div>
    );
}
