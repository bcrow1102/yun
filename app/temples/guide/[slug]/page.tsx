import Link from "next/link";
import { notFound } from "next/navigation";

import {
    getTempleBySlug,
    temples,
    type TemplePublicTransitV1,
} from "../temples";
import { getTempleStaysByTempleSlug } from "../../stay/data";
import { getEventsByTempleSlug } from "../../../events/data";
import { getTempleFoodsByTempleSlug } from "../../food/data";

type TempleDetailPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

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

function BackIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
        >
            <path
                d="m15 5-7 7 7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function LocationIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
        >
            <path
                d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="12" cy="10" r="2.5" />
        </svg>
    );
}

function BusIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
        >
            <rect
                x="4"
                y="3"
                width="16"
                height="16"
                rx="3"
            />
            <path
                d="M7 19v2m10-2v2M4 12h16M8 16h.01M16 16h.01"
                strokeLinecap="round"
            />
        </svg>
    );
}

function CarIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
        >
            <path
                d="m5 11 2-5h10l2 5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <rect
                x="3"
                y="11"
                width="18"
                height="7"
                rx="2"
            />
            <path
                d="M6 18v2m12-2v2M7 14h.01M17 14h.01"
                strokeLinecap="round"
            />
        </svg>
    );
}

function ClockIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
        >
            <circle cx="12" cy="12" r="9" />
            <path
                d="M12 7v5l3 2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function PhoneIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
        >
            <path
                d="M7 3h3l1.2 4-2 1.5a15 15 0 0 0 6.3 6.3l1.5-2L21 14v3c0 2.2-1.8 4-4 4C9.3 21 3 14.7 3 7c0-2.2 1.8-4 4-4Z"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function TempleIllustration() {
    return (
        <svg
            viewBox="0 0 180 130"
            fill="none"
            className="h-36 w-48 text-[#65755F]"
            aria-hidden="true"
        >
            <path
                d="M28 105h124"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M42 104V72h96v32"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
            />
            <path
                d="M53 72V50h74v22"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
            />
            <path
                d="M27 72h126l-20-16H47L27 72Z"
                fill="#E2ECDD"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
            />
            <path
                d="M42 50h96l-18-15H60L42 50Z"
                fill="#EDF3EA"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
            />
            <path
                d="M73 104V81h34v23M90 81v23"
                stroke="currentColor"
                strokeWidth="2"
            />
            <path
                d="M66 35h48"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}

function InformationRow({
    label,
    value,
}: {
    label: string;
    value?: string;
}) {
    return (
        <div className="grid gap-1 border-b border-[#EEF0F2] py-4 last:border-b-0 sm:grid-cols-[120px_1fr] sm:gap-5">
            <dt className="text-sm font-medium text-[#8B95A1]">
                {label}
            </dt>

            <dd className="text-sm leading-6 text-[#252A31]">
                {value || "정보 확인 중"}
            </dd>
        </div>
    );
}

function getAccessPointLabel(
    accessPoint: TemplePublicTransitV1["accessPoint"],
) {
    if (!accessPoint) {
        return undefined;
    }

    const typeLabels = {
        subway: "지하철역",
        train: "기차역",
        bus: "버스 정류장",
        terminal: "터미널",
    } as const;
    const typeLabel = typeLabels[accessPoint.type];

    return accessPoint.name
        ? `${typeLabel} · ${accessPoint.name}`
        : typeLabel;
}

function getLastMileLabel(
    lastMile: TemplePublicTransitV1["lastMile"],
) {
    if (!lastMile) {
        return undefined;
    }

    const modeLabels = {
        walk: "도보",
        localBus: "지역버스",
        shuttle: "셔틀버스",
        taxi: "택시",
        none: "추가 이동 없음",
    } as const;
    const modeLabel = modeLabels[lastMile.mode];

    return lastMile.minutes === undefined
        ? modeLabel
        : `${modeLabel} 약 ${lastMile.minutes}분`;
}

export function generateStaticParams() {
    return temples
        .filter((temple) => temple.published)
        .map((temple) => ({
            slug: temple.slug,
        }));
}

export default async function TempleDetailPage({
    params,
}: TempleDetailPageProps) {
    const { slug } = await params;
    const temple = getTempleBySlug(slug);

    if (!temple) {
        notFound();
    }

    const templeStays = getTempleStaysByTempleSlug(temple.slug);
    const relatedEvents = getEventsByTempleSlug(temple.slug);
    const templeFoods = getTempleFoodsByTempleSlug(temple.slug);

    const hasTransportInformation =
        temple.publicTransit?.accessPoint ||
        temple.publicTransit?.lastMile ||
        temple.publicTransit?.note;

    const hasParkingInformation =
        temple.parking?.available !== undefined ||
        temple.parking?.type ||
        temple.parking?.fee ||
        temple.parking?.notes;

    return (
        <div className="min-h-screen bg-white text-[#252A31]">
            <header className="sticky top-0 z-30 border-b border-[#E7E9EC] bg-white/95 backdrop-blur md:hidden">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:h-[72px] md:px-8">
                    <Link
                        href="/"
                        className="flex items-center gap-2.5"
                        aria-label="연 홈"
                    >
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F4F54A] md:h-10 md:w-10">
                            <LotusIcon />
                        </span>

                        <strong className="text-xl font-semibold">
                            연
                        </strong>
                    </Link>

                    <Link
                        href="/temples/guide"
                        className="inline-flex min-h-10 items-center gap-1 rounded-xl border border-[#E3E8EF] bg-white px-3 py-2.5 text-sm font-medium"
                    >
                        <BackIcon />
                        목록
                    </Link>
                </div>
            </header>

            <main>
                <section className="bg-[#F3F7F1]">
                    <div className="mx-auto grid max-w-6xl gap-7 px-5 py-10 md:grid-cols-[1fr_360px] md:items-center md:px-8 md:py-16">
                        <div>
                            <Link
                                href="/temples/guide"
                                className="inline-flex items-center gap-1 text-sm font-medium text-[#61705B]"
                            >
                                <BackIcon />
                                사찰 안내
                            </Link>

                            <h1 className="mt-6 text-[38px] font-bold tracking-[-0.045em] md:text-[56px]">
                                {temple.name}
                            </h1>

                            {temple.hanja && (
                                <p className="mt-2 text-base text-[#8B95A1]">
                                    {temple.hanja}
                                </p>
                            )}

                            <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[#61705B]">
                                <span>
                                    {temple.location.sido}{" "}
                                    {temple.location.sigungu}
                                </span>

                                {temple.order && (
                                    <>
                                        <span aria-hidden="true">·</span>
                                        <span>{temple.order}</span>
                                    </>
                                )}
                            </div>

                            <p className="mt-4 max-w-2xl text-[16px] leading-8 text-[#56615B] md:text-[18px]">
                                {temple.summary}
                            </p>
                        </div>

                        <div className="overflow-hidden rounded-[26px] border border-[#DDE7D9] bg-white">
                            <div className="flex h-60 items-center justify-center bg-[#EAF2E7]">
                                {temple.image ? (
                                    <img
                                        src={temple.image}
                                        alt={
                                            temple.imageAlt ??
                                            `${temple.name} 전경`
                                        }
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <TempleIllustration />
                                )}
                            </div>

                            {temple.imageSource && (
                                <p className="px-4 py-3 text-xs text-[#8B95A1]">
                                    이미지 출처: {temple.imageSource}
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
                    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
                        <div className="space-y-6">
                            <section className="rounded-[24px] border border-[#E3E8EF] bg-white p-5 md:p-7">
                                <h2 className="text-[24px] font-semibold tracking-[-0.035em]">
                                    {temple.name} 안내
                                </h2>

                                <p className="mt-5 whitespace-pre-line text-[15px] leading-8 text-[#667085]">
                                    {temple.description ??
                                        temple.summary}
                                </p>

                                {temple.tags.length > 0 && (
                                    <p className="mt-5 text-[13px] leading-6 text-[#77817A]">
                                        {temple.tags.join(" · ")}
                                    </p>
                                )}

                                {templeStays.length > 0 && (
                                    <div className="mt-7 border-t border-[#EEF0F2] pt-6">
                                        <p className="text-sm font-medium text-[#7A8B74]">
                                            이 사찰의 템플스테이
                                        </p>

                                        <div className="mt-3 divide-y divide-[#EEF0F2]">
                                            {templeStays.map((program) => (
                                                <Link
                                                    key={program.id}
                                                    href={`/temples/stay/${program.id}`}
                                                    className="group block min-h-11 py-2 first:pt-0 last:pb-0"
                                                >
                                                    <span className="inline-flex items-center gap-1 text-[15px] font-medium text-[#252A31] transition-colors group-hover:text-[#61705B]">
                                                        {program.name}
                                                        <span
                                                            aria-hidden="true"
                                                            className="transition-transform group-hover:translate-x-0.5"
                                                        >
                                                            →
                                                        </span>
                                                    </span>

                                                    <span className="mt-1 block text-sm text-[#8B95A1]">
                                                        {program.type} · {program.duration}
                                                    </span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {relatedEvents.length > 0 && (
                                    <div className="mt-7 border-t border-[#EEF0F2] pt-6">
                                        <p className="text-sm font-medium text-[#7A8B74]">
                                            이 사찰의 행사·교육
                                        </p>

                                        <div className="mt-3 divide-y divide-[#EEF0F2]">
                                            {relatedEvents.map((event) => (
                                                <Link
                                                    key={event.id}
                                                    href={event.detailHref}
                                                    className="group block min-h-11 py-2 first:pt-0 last:pb-0"
                                                >
                                                    <span className="inline-flex items-center gap-1 text-[15px] font-medium text-[#252A31] transition-colors group-hover:text-[#61705B]">
                                                        {event.shortTitle}
                                                        <span
                                                            aria-hidden="true"
                                                            className="transition-transform group-hover:translate-x-0.5"
                                                        >
                                                            →
                                                        </span>
                                                    </span>

                                                    <span className="mt-1 block text-sm text-[#8B95A1]">
                                                        {event.listDate} · {event.place}
                                                    </span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {templeFoods.length > 0 && (
                                    <div className="mt-7 border-t border-[#EEF0F2] pt-6">
                                        <p className="text-sm font-medium text-[#7A8B74]">
                                            이 사찰의 사찰음식 프로그램
                                        </p>

                                        <div className="mt-3 divide-y divide-[#EEF0F2]">
                                            {templeFoods.map((program) => (
                                                <Link
                                                    key={program.id}
                                                    href={`/temples/food/${program.id}`}
                                                    className="group block min-h-11 py-2 first:pt-0 last:pb-0"
                                                >
                                                    <span className="inline-flex items-center gap-1 text-[15px] font-medium text-[#252A31] transition-colors group-hover:text-[#61705B]">
                                                        {program.title}
                                                        <span
                                                            aria-hidden="true"
                                                            className="transition-transform group-hover:translate-x-0.5"
                                                        >
                                                            →
                                                        </span>
                                                    </span>

                                                    <span className="mt-1 block text-sm text-[#8B95A1]">
                                                        {program.type} · {program.schedule}
                                                    </span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </section>

                            <section className="rounded-[24px] border border-[#E3E8EF] bg-white p-5 md:p-7">
                                <div className="flex items-center gap-2">
                                    <span className="text-[#61705B]">
                                        <BusIcon />
                                    </span>

                                    <h2 className="text-[22px] font-semibold tracking-[-0.03em]">
                                        대중교통
                                    </h2>
                                </div>

                                {hasTransportInformation ? (
                                    <dl className="mt-4">
                                        <InformationRow
                                            label="주요 접근 지점"
                                            value={getAccessPointLabel(
                                                temple.publicTransit
                                                    ?.accessPoint,
                                            )}
                                        />

                                        <InformationRow
                                            label="마지막 이동"
                                            value={getLastMileLabel(
                                                temple.publicTransit
                                                    ?.lastMile,
                                            )}
                                        />

                                        <InformationRow
                                            label="참고사항"
                                            value={temple.publicTransit?.note}
                                        />
                                    </dl>
                                ) : (
                                    <div className="mt-5">
                                        <p className="text-sm font-medium text-[#252A31]">
                                            교통정보 확인 중
                                        </p>

                                        <p className="mt-2 text-sm leading-6 text-[#667085]">
                                            버스·지하철·도보 이동 정보를
                                            확인해 순차적으로 등록합니다.
                                        </p>
                                    </div>
                                )}

                                {temple.publicTransit?.updatedAt && (
                                    <p className="mt-4 text-xs text-[#8B95A1]">
                                        교통정보 최종 확인:{" "}
                                        {temple.publicTransit.updatedAt}
                                    </p>
                                )}
                            </section>

                            <section className="rounded-[24px] border border-[#E3E8EF] bg-white p-5 md:p-7">
                                <div className="flex items-center gap-2">
                                    <span className="text-[#61705B]">
                                        <CarIcon />
                                    </span>

                                    <h2 className="text-[22px] font-semibold tracking-[-0.03em]">
                                        주차 안내
                                    </h2>
                                </div>

                                {hasParkingInformation ? (
                                    <dl className="mt-4">
                                        <InformationRow
                                            label="주차 가능"
                                            value={
                                                temple.parking
                                                    ?.available === true
                                                    ? "가능"
                                                    : temple.parking
                                                        ?.available ===
                                                        false
                                                        ? "불가"
                                                        : undefined
                                            }
                                        />

                                        <InformationRow
                                            label="주차 방식"
                                            value={
                                                temple.parking?.type
                                            }
                                        />

                                        <InformationRow
                                            label="주차 요금"
                                            value={
                                                temple.parking?.fee
                                            }
                                        />

                                        <InformationRow
                                            label="참고사항"
                                            value={
                                                temple.parking?.notes
                                            }
                                        />
                                    </dl>
                                ) : (
                                    <div className="mt-5">
                                        <p className="text-sm font-medium text-[#252A31]">
                                            주차정보 확인 중
                                        </p>

                                        <p className="mt-2 text-sm leading-6 text-[#667085]">
                                            주차 가능 여부와 이용 방법을
                                            확인해 순차적으로 등록합니다.
                                        </p>
                                    </div>
                                )}

                                {temple.parking?.updatedAt && (
                                    <p className="mt-4 text-xs text-[#8B95A1]">
                                        주차정보 최종 확인:{" "}
                                        {temple.parking.updatedAt}
                                    </p>
                                )}
                            </section>
                        </div>

                        <aside className="space-y-5">
                            <section className="rounded-[24px] border border-[#E3E8EF] bg-white p-5">
                                <h2 className="text-lg font-semibold">
                                    방문 정보
                                </h2>

                                <dl className="mt-3">
                                    <InformationRow
                                        label="주소"
                                        value={temple.location.address}
                                    />

                                    <InformationRow
                                        label="운영시간"
                                        value={temple.openingHours}
                                    />

                                    <InformationRow
                                        label="입장료"
                                        value={temple.admissionFee}
                                    />

                                    <InformationRow
                                        label="전화"
                                        value={temple.phone}
                                    />
                                </dl>

                                <div className="mt-4 grid gap-2">
                                    {temple.phone && (
                                        <a
                                            href={`tel:${temple.phone.replace(
                                                /[^0-9+]/g,
                                                "",
                                            )}`}
                                            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#252A31] px-4 text-sm font-medium text-white"
                                        >
                                            <PhoneIcon />
                                            전화하기
                                        </a>
                                    )}

                                    {temple.website && (
                                        <a
                                            href={temple.website}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#DDE1E6] bg-white px-4 text-sm font-medium"
                                        >
                                            공식 홈페이지
                                        </a>
                                    )}
                                </div>
                            </section>

                            <section className="rounded-[24px] bg-[#FFF9DC] p-5">
                                <div className="flex items-center gap-2 text-[#5E574C]">
                                    <LocationIcon />
                                    <strong>정보를 확인해 주세요</strong>
                                </div>

                                <p className="mt-3 text-sm leading-6 text-[#5E574C]">
                                    운영시간과 교통편은 행사·계절·현지
                                    사정에 따라 달라질 수 있습니다. 방문
                                    전 사찰에 확인하는 것이 좋습니다.
                                </p>
                            </section>

                            <section className="rounded-[24px] border border-[#E3E8EF] bg-white p-5">
                                <h2 className="text-lg font-semibold">
                                    정보 참여
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-[#667085]">
                                    주소·교통·주차 등 달라진 정보를
                                    알려주세요.
                                </p>

                                <div className="mt-4 grid gap-2">
                                    <Link
                                        href={`/temples/guide/correction?temple=${encodeURIComponent(
                                            temple.name,
                                        )}`}
                                        className="rounded-xl border border-[#E8E2B8] bg-[#FFF9DC] px-4 py-3.5 text-center text-sm font-medium text-[#4F4A36]"
                                    >
                                        정보 수정 제안
                                    </Link>

                                    <Link
                                        href="/temples/guide"
                                        className="rounded-xl border border-[#DDE1E6] bg-white px-4 py-3.5 text-center text-sm font-medium"
                                    >
                                        다른 사찰 보기
                                    </Link>
                                </div>
                            </section>
                        </aside>
                    </div>
                </section>
            </main>
        </div>
    );
}
