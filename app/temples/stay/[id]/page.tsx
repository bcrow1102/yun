import Link from "next/link";
import { notFound } from "next/navigation";
import {
    getTempleStayById,
    getTempleStayDisplayInfo,
} from "../data";

export default async function TempleStayDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const program = getTempleStayById(id);

    if (!program) {
        notFound();
    }

    const { canonicalTemple, templeName, location } =
        getTempleStayDisplayInfo(program);

    return (
        <div className="min-h-screen bg-white text-[#252A31]">
            <main>
                <section className={program.background}>
                    <div className="mx-auto grid min-h-[380px] max-w-6xl items-center gap-8 px-5 py-12 md:grid-cols-[1fr_360px] md:px-8 md:py-16">
                        <div>
                            <Link
                                href="/temples/stay"
                                className="inline-flex text-sm font-medium text-[#4E5968] transition hover:text-[#171B22]"
                            >
                                ← 템플스테이 목록
                            </Link>

                            <h1 className="mt-6 text-[36px] font-semibold tracking-[-0.05em] md:text-[52px]">
                                {program.name}
                            </h1>

                            <div className="mt-2 flex min-h-11 flex-wrap items-center gap-x-2 gap-y-1 text-base text-[#667085]">
                                {canonicalTemple ? (
                                    <Link
                                        href={`/temples/guide/${canonicalTemple.slug}`}
                                        className="group inline-flex min-h-11 items-center whitespace-nowrap font-medium text-[#4E5968] transition-colors duration-200 hover:text-[#252A31] focus-visible:text-[#252A31]"
                                    >
                                        <span className="relative inline-flex items-center gap-1 pb-1 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-[#D4D93A] after:transition-transform after:duration-200 group-hover:after:scale-x-100 group-focus-visible:after:scale-x-100">
                                            {templeName}
                                            <span
                                                aria-hidden="true"
                                                className="transition-transform duration-200 group-hover:translate-x-0.5"
                                            >
                                                →
                                            </span>
                                        </span>
                                    </Link>
                                ) : (
                                    <span className="whitespace-nowrap">
                                        {templeName}
                                    </span>
                                )}

                                <span className="whitespace-nowrap">
                                    · {location}
                                </span>
                                <span className="whitespace-nowrap">
                                    · {program.type}
                                </span>
                            </div>

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
                                        {canonicalTemple ? (
                                            <Link
                                                href={`/temples/guide/${canonicalTemple.slug}`}
                                                className="group inline-flex min-h-8 items-center text-[#252A31] transition-colors duration-200 hover:text-[#61705B] focus-visible:text-[#61705B]"
                                            >
                                                <span className="relative inline-flex items-center gap-1 pb-1 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-[#D4D93A] after:transition-transform after:duration-200 group-hover:after:scale-x-100 group-focus-visible:after:scale-x-100">
                                                    {templeName}
                                                    <span
                                                        aria-hidden="true"
                                                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                                                    >
                                                        →
                                                    </span>
                                                </span>
                                            </Link>
                                        ) : (
                                            templeName
                                        )}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-xs text-[#8B95A1]">지역</dt>
                                    <dd className="mt-1 text-sm font-medium">
                                        {location}
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
