import Link from "next/link";
import { notFound } from "next/navigation";

const programs = {
    "1": {
        name: "월정사 숲속 힐링",
        temple: "월정사",
        location: "강원 평창",
        type: "휴식형",
        duration: "1박 2일",
        price: "50,000원",
        rating: "4.8",
        icon: "🌲",
        background: "bg-[#EEF5E9]",
        description:
            "고요한 숲과 맑은 공기 속에서 바쁜 일상을 잠시 내려놓고 편안하게 쉬어가는 템플스테이입니다.",
    },
    "2": {
        name: "해인사 명상 수련",
        temple: "해인사",
        location: "경남 합천",
        type: "체험형",
        duration: "2박 3일",
        price: "80,000원",
        rating: "4.9",
        icon: "🧘",
        background: "bg-[#FFF8D9]",
        description:
            "명상과 사찰 생활을 체험하며 몸과 마음을 차분하게 돌아보는 프로그램입니다.",
    },
    "3": {
        name: "통도사 하루 체험",
        temple: "통도사",
        location: "경남 양산",
        type: "당일형",
        duration: "당일",
        price: "30,000원",
        rating: "4.7",
        icon: "🕯️",
        background: "bg-[#F7F0E8]",
        description:
            "짧은 하루 동안 사찰의 고요한 일상과 불교문화를 편안하게 경험할 수 있습니다.",
    },
    "4": {
        name: "전등사 마음 쉬기",
        temple: "전등사",
        location: "인천 강화",
        type: "휴식형",
        duration: "1박 2일",
        price: "60,000원",
        rating: "4.8",
        icon: "🍃",
        background: "bg-[#EAF3F5]",
        description:
            "자연 속 산사에서 천천히 걷고 쉬며 마음의 여유를 되찾는 시간입니다.",
    },
    "5": {
        name: "봉선사 연꽃 명상",
        temple: "봉선사",
        location: "경기 남양주",
        type: "체험형",
        duration: "1박 2일",
        price: "55,000원",
        rating: "4.6",
        icon: "🪷",
        background: "bg-[#F9EFF2]",
        description:
            "연꽃처럼 맑고 편안한 마음을 만나기 위한 명상과 사찰문화 체험 프로그램입니다.",
    },
    "6": {
        name: "낙산사 바다 명상",
        temple: "낙산사",
        location: "강원 양양",
        type: "휴식형",
        duration: "1박 2일",
        price: "70,000원",
        rating: "4.9",
        icon: "🌊",
        background: "bg-[#EAF3FF]",
        description:
            "바다를 바라보며 명상하고 산사의 고요함 속에서 편안하게 쉬어가는 프로그램입니다.",
    },
};

type ProgramId = keyof typeof programs;

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

export default async function TempleStayDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const program = programs[id as ProgramId];

    if (!program) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-white text-[#252A31]">
            <header className="sticky top-0 z-30 border-b border-[#E7E9EC] bg-white/95 backdrop-blur">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:h-[72px] md:px-8">
                    <Link href="/" className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FEE500] md:h-10 md:w-10">
                            <LotusIcon />
                        </span>
                        <span className="text-xl font-semibold">연</span>
                    </Link>

                    <Link
                        href="/temples/stay"
                        className="rounded-xl border border-[#E3E8EF] px-4 py-2.5 text-sm font-medium text-[#4E5968]"
                    >
                        템플스테이 목록
                    </Link>
                </div>
            </header>

            <main>
                <section className={program.background}>
                    <div className="mx-auto grid min-h-[380px] max-w-6xl items-center gap-8 px-5 py-12 md:grid-cols-[1fr_360px] md:px-8 md:py-16">
                        <div>
                            <span className="inline-flex rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[#6D6200]">
                                {program.type}
                            </span>

                            <h1 className="mt-5 text-[36px] font-semibold tracking-[-0.05em] md:text-[52px]">
                                {program.name}
                            </h1>

                            <p className="mt-3 text-base text-[#667085]">
                                {program.temple} · {program.location}
                            </p>

                            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[#4E5968]">
                                {program.description}
                            </p>
                        </div>

                        <div className="flex h-56 items-center justify-center rounded-[28px] bg-white/70 text-8xl shadow-[0_12px_30px_rgba(25,31,40,0.06)]">
                            {program.icon}
                        </div>
                    </div>
                </section>

                <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1fr_340px] md:px-8 md:py-14">
                    <div>
                        <section>
                            <p className="text-sm font-medium text-[#766900]">
                                프로그램 소개
                            </p>

                            <h2 className="mt-2 text-[27px] font-semibold tracking-[-0.035em]">
                                잠시 멈추고 나를 만나는 시간
                            </h2>

                            <div className="mt-5 space-y-4 text-[15px] leading-8 text-[#4E5968]">
                                <p>
                                    자연과 사찰의 고요함 속에서 일상의 복잡한 생각을 잠시
                                    내려놓고 몸과 마음을 편안하게 쉬어가는 프로그램입니다.
                                </p>

                                <p>
                                    불교를 잘 알지 못하더라도 누구나 부담 없이 참여할 수
                                    있으며, 사찰 예절과 프로그램 진행 방법을 친절하게
                                    안내합니다.
                                </p>
                            </div>
                        </section>

                        <section className="mt-11">
                            <p className="text-sm font-medium text-[#766900]">
                                주요 프로그램
                            </p>

                            <h2 className="mt-2 text-[27px] font-semibold tracking-[-0.035em]">
                                이런 시간을 함께합니다
                            </h2>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                {[
                                    "사찰과 주변 숲길 둘러보기",
                                    "스님과 함께하는 차담",
                                    "마음을 쉬게 하는 명상",
                                    "정갈한 사찰음식 체험",
                                ].map((activity) => (
                                    <div
                                        key={activity}
                                        className="rounded-[18px] border border-[#E3E8EF] bg-white px-5 py-4 text-sm text-[#4E5968]"
                                    >
                                        {activity}
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="mt-11 rounded-[24px] bg-[#FFF9DC] p-6">
                            <p className="text-sm font-medium text-[#766900]">
                                참여 전 안내
                            </p>

                            <ul className="mt-4 space-y-2 text-sm leading-6 text-[#5E574C]">
                                <li>· 편안한 복장과 개인 세면도구를 준비해 주세요.</li>
                                <li>· 사찰 안에서는 음주와 흡연이 불가능합니다.</li>
                                <li>· 프로그램 일정은 사찰 사정에 따라 달라질 수 있습니다.</li>
                            </ul>
                        </section>
                    </div>

                    <aside className="md:sticky md:top-24 md:self-start">
                        <div className="rounded-[24px] border border-[#E3E8EF] bg-white p-6 shadow-[0_10px_30px_rgba(25,31,40,0.07)]">
                            <h2 className="text-xl font-semibold">프로그램 정보</h2>

                            <dl className="mt-5 space-y-4">
                                <div>
                                    <dt className="text-xs text-[#8B95A1]">운영 사찰</dt>
                                    <dd className="mt-1 text-sm font-medium">
                                        {program.temple}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-xs text-[#8B95A1]">지역</dt>
                                    <dd className="mt-1 text-sm font-medium">
                                        {program.location}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-xs text-[#8B95A1]">기간</dt>
                                    <dd className="mt-1 text-sm font-medium">
                                        {program.duration}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-xs text-[#8B95A1]">참가비</dt>
                                    <dd className="mt-1 text-sm font-medium">
                                        {program.price}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-xs text-[#8B95A1]">평점</dt>
                                    <dd className="mt-1 text-sm font-medium">
                                        ★ {program.rating}
                                    </dd>
                                </div>
                            </dl>

                            <Link
                                href={`/temples/stay/${id}/apply`}
                                className="mt-6 flex w-full items-center justify-center rounded-xl bg-[#FEE500] px-4 py-3.5 text-sm font-medium text-[#171B22] transition hover:bg-[#F5DC00]"
                            >
                                참가 신청하기
                            </Link>

                            <p className="mt-3 text-center text-xs leading-5 text-[#A0A7B0]">
                                프로그램 일정과 참가 안내를 확인한 후 신청해 주세요.
                            </p>
                        </div>
                    </aside>
                </section>
            </main>
        </div>
    );
}