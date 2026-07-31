import Link from "next/link";
import { notFound } from "next/navigation";

const foodPrograms = {
    "1": {
        title: "사찰음식 기본 체험",
        place: "서울 사찰음식문화체험관",
        location: "서울 종로구",
        type: "체험",
        schedule: "매주 토요일",
        price: "30,000원",
        icon: "🥣",
        background: "bg-[#F6F1EA]",
        description:
            "자연의 재료를 소중히 다루며 사찰음식의 기본 정신과 조리 방법을 배우는 체험 프로그램입니다.",
    },
    "2": {
        title: "계절 나물과 사찰 밥상",
        place: "봉녕사",
        location: "경기 수원",
        type: "교육",
        schedule: "월 2회",
        price: "50,000원",
        icon: "🌿",
        background: "bg-[#EEF5E9]",
        description:
            "제철 나물과 자연 재료를 활용해 건강하고 정갈한 사찰 밥상을 만드는 방법을 배웁니다.",
    },
    "3": {
        title: "발우공양 체험",
        place: "통도사",
        location: "경남 양산",
        type: "체험",
        schedule: "주말 운영",
        price: "20,000원",
        icon: "🍚",
        background: "bg-[#FFF8D9]",
        description:
            "음식을 소중히 여기고 필요한 만큼만 덜어 먹는 발우공양의 의미와 예절을 체험합니다.",
    },
    "4": {
        title: "사찰 장 담그기",
        place: "전통사찰문화원",
        location: "전북 완주",
        type: "교육",
        schedule: "계절 프로그램",
        price: "60,000원",
        icon: "🏺",
        background: "bg-[#F3EDE6]",
        description:
            "전통 방식으로 장을 담그며 발효 음식에 담긴 사찰의 지혜와 기다림의 의미를 배웁니다.",
    },
    "5": {
        title: "연잎밥 만들기",
        place: "연화사",
        location: "충남 공주",
        type: "가족 체험",
        schedule: "매월 둘째 주",
        price: "35,000원",
        icon: "🪷",
        background: "bg-[#F9EFF2]",
        description:
            "가족이 함께 건강한 재료를 준비하고 향긋한 연잎에 밥을 싸서 만드는 체험 프로그램입니다.",
    },
    "6": {
        title: "외국인을 위한 사찰음식",
        place: "한국사찰음식문화관",
        location: "서울",
        type: "영문 체험",
        schedule: "예약 운영",
        price: "문의",
        icon: "🥢",
        background: "bg-[#EAF3FF]",
        description:
            "외국인 참가자가 영어 안내와 함께 한국 사찰음식의 문화와 조리법을 경험하는 프로그램입니다.",
    },
};

type FoodProgramId = keyof typeof foodPrograms;

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

export default async function TempleFoodDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const program = foodPrograms[id as FoodProgramId];

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
                        href="/temples/food"
                        className="rounded-xl border border-[#E3E8EF] px-4 py-2.5 text-sm font-medium text-[#4E5968]"
                    >
                        사찰음식 목록
                    </Link>
                </div>
            </header>

            <main>
                <section className={program.background}>
                    <div className="mx-auto grid min-h-[380px] max-w-6xl items-center gap-8 px-5 py-12 md:grid-cols-[1fr_360px] md:px-8 md:py-16">
                        <div>
                            <span className="inline-flex rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[#786B5A]">
                                {program.type}
                            </span>

                            <h1 className="mt-5 text-[36px] font-semibold tracking-[-0.05em] md:text-[52px]">
                                {program.title}
                            </h1>

                            <p className="mt-3 text-base text-[#667085]">
                                {program.place} · {program.location}
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
                            <p className="text-sm font-medium text-[#786B5A]">
                                프로그램 소개
                            </p>

                            <h2 className="mt-2 text-[27px] font-semibold tracking-[-0.035em]">
                                자연을 존중하는 사찰의 밥상
                            </h2>

                            <div className="mt-5 space-y-4 text-[15px] leading-8 text-[#4E5968]">
                                <p>
                                    사찰음식은 제철에 나는 자연의 재료를 소중히 사용하고,
                                    음식이 우리에게 오기까지의 모든 수고에 감사하는 음식입니다.
                                </p>

                                <p>
                                    조리 경험이 많지 않아도 안내에 따라 편안하게 참여할 수
                                    있습니다. 직접 음식을 만들고 함께 나누며 사찰음식에 담긴
                                    지혜를 만나보세요.
                                </p>
                            </div>
                        </section>

                        <section className="mt-11">
                            <p className="text-sm font-medium text-[#786B5A]">
                                주요 체험
                            </p>

                            <h2 className="mt-2 text-[27px] font-semibold tracking-[-0.035em]">
                                이런 시간을 함께합니다
                            </h2>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                {[
                                    "사찰음식의 기본 정신 알아보기",
                                    "제철 재료와 조리법 배우기",
                                    "음식 직접 만들기",
                                    "완성한 음식 함께 나누기",
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

                        <section className="mt-11 rounded-[24px] bg-[#F6F1EA] p-6">
                            <p className="text-sm font-medium text-[#786B5A]">
                                참여 전 안내
                            </p>

                            <ul className="mt-4 space-y-2 text-sm leading-6 text-[#655C52]">
                                <li>· 편안한 복장과 앞치마를 준비해 주세요.</li>
                                <li>· 음식 알레르기가 있다면 신청할 때 알려주세요.</li>
                                <li>· 프로그램 내용은 재료 수급에 따라 달라질 수 있습니다.</li>
                            </ul>
                        </section>
                    </div>

                    <aside className="md:sticky md:top-24 md:self-start">
                        <div className="rounded-[24px] border border-[#E3E8EF] bg-white p-6 shadow-[0_10px_30px_rgba(25,31,40,0.07)]">
                            <h2 className="text-xl font-semibold">프로그램 정보</h2>

                            <dl className="mt-5 space-y-4">
                                <div>
                                    <dt className="text-xs text-[#8B95A1]">운영 장소</dt>
                                    <dd className="mt-1 text-sm font-medium">{program.place}</dd>
                                </div>

                                <div>
                                    <dt className="text-xs text-[#8B95A1]">지역</dt>
                                    <dd className="mt-1 text-sm font-medium">
                                        {program.location}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-xs text-[#8B95A1]">운영 일정</dt>
                                    <dd className="mt-1 text-sm font-medium">
                                        {program.schedule}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-xs text-[#8B95A1]">참가비</dt>
                                    <dd className="mt-1 text-sm font-medium">
                                        {program.price}
                                    </dd>
                                </div>
                            </dl>

                            <Link
                                href={`/temples/food/${id}/apply`}
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