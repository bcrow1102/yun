import Link from "next/link";
import { notFound } from "next/navigation";
import {
    getTempleFoodById,
    getTempleFoodDisplayInfo,
} from "../data";

export default async function TempleFoodDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const program = getTempleFoodById(id);

    if (!program) {
        notFound();
    }

    const { canonicalTemple, place, location } =
        getTempleFoodDisplayInfo(program);

    return (
        <div className="min-h-screen bg-white text-[#252A31]">

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
                                {canonicalTemple ? (
                                    <Link
                                        href={`/temples/guide/${canonicalTemple.slug}`}
                                        className="underline decoration-[#B7A995] underline-offset-2"
                                    >
                                        {place}
                                    </Link>
                                ) : (
                                    place
                                )}{" "}
                                · {location}
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
                                    <dd className="mt-1 text-sm font-medium">
                                        {canonicalTemple ? (
                                            <Link
                                                href={`/temples/guide/${canonicalTemple.slug}`}
                                                className="underline decoration-[#B7A995] underline-offset-2"
                                            >
                                                {place}
                                            </Link>
                                        ) : (
                                            place
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
