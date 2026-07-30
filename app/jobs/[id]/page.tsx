import Link from "next/link";
import { notFound } from "next/navigation";

interface Job {
    id: number;
    temple: string;
    title: string;
    location: string;
    date: string;
    type: string;
}

const jobs: Job[] = [
    {
        id: 1,
        temple: "조계사",
        title: "사무행정 담당자 모집",
        location: "서울 종로구",
        date: "~07.31",
        type: "정규직",
    },
    {
        id: 2,
        temple: "해인사",
        title: "문화해설 자원봉사자",
        location: "경남 합천",
        date: "~08.15",
        type: "봉사",
    },
    {
        id: 3,
        temple: "불국사",
        title: "템플스테이 코디네이터",
        location: "경북 경주",
        date: "~08.05",
        type: "계약직",
    },
    {
        id: 4,
        temple: "봉은사",
        title: "종무행정 실무자 채용",
        location: "서울 강남구",
        date: "~08.10",
        type: "정규직",
    },
    {
        id: 5,
        temple: "통도사",
        title: "사찰 안내 및 방문객 응대",
        location: "경남 양산",
        date: "~08.20",
        type: "계약직",
    },
    {
        id: 6,
        temple: "월정사",
        title: "템플스테이 운영 보조",
        location: "강원 평창",
        date: "~08.18",
        type: "계약직",
    },
    {
        id: 101,
        temple: "진관사",
        title: "공양간 조리 및 운영 담당자 모집",
        location: "서울",
        date: "~08.22",
        type: "정규직",
    },
    {
        id: 102,
        temple: "수덕사",
        title: "종무소 행정직원 채용",
        location: "충남",
        date: "~08.25",
        type: "정규직",
    },
    {
        id: 103,
        temple: "백양사",
        title: "템플스테이 프로그램 진행자",
        location: "전남",
        date: "~08.29",
        type: "계약직",
    },
    {
        id: 104,
        temple: "전등사",
        title: "사찰 시설관리 담당자 모집",
        location: "인천",
        date: "~08.30",
        type: "계약직",
    },
    {
        id: 105,
        temple: "법주사",
        title: "문화재 안내 자원봉사자 모집",
        location: "충북",
        date: "상시",
        type: "봉사",
    },
    {
        id: 106,
        temple: "송광사",
        title: "사찰 회계 및 사무보조 채용",
        location: "전남",
        date: "~09.02",
        type: "정규직",
    },
    {
        id: 107,
        temple: "범어사",
        title: "불교문화 교육행사 운영 보조",
        location: "부산",
        date: "~09.05",
        type: "계약직",
    },
    {
        id: 108,
        temple: "마곡사",
        title: "방문객 안내 및 매표 담당자",
        location: "충남",
        date: "~09.06",
        type: "계약직",
    },
    {
        id: 109,
        temple: "대흥사",
        title: "템플스테이 객실관리 담당자",
        location: "전남",
        date: "~09.08",
        type: "계약직",
    },
    {
        id: 110,
        temple: "동화사",
        title: "사찰 홍보 콘텐츠 제작자 모집",
        location: "대구",
        date: "~09.10",
        type: "정규직",
    },
    {
        id: 111,
        temple: "화엄사",
        title: "주말 행사 진행 자원봉사자",
        location: "전남",
        date: "상시",
        type: "봉사",
    },
    {
        id: 112,
        temple: "용주사",
        title: "종무행정 경력직 채용",
        location: "경기",
        date: "~09.12",
        type: "정규직",
    },
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

export default async function JobDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const job = jobs.find((item) => item.id === Number(id));

    if (!job) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-[#F7F8FA] text-[#252A31]">
            <header className="border-b border-[#E7E9EC] bg-white">
                <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 md:h-[72px] md:px-8">
                    <Link href="/" className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FEE500] md:h-10 md:w-10">
                            <LotusIcon />
                        </span>

                        <strong className="text-xl font-bold">연</strong>
                    </Link>

                    <Link
                        href="/jobs"
                        className="rounded-xl border border-[#E3E8EF] bg-white px-4 py-2.5 text-sm font-semibold"
                    >
                        구인 목록
                    </Link>
                </div>
            </header>

            <main className="mx-auto max-w-4xl px-4 py-7 md:px-8 md:py-10">
                <Link
                    href="/jobs"
                    className="inline-flex items-center gap-1 text-sm font-medium text-[#667085]"
                >
                    ← 전체 구인으로 돌아가기
                </Link>

                <article className="mt-5 overflow-hidden rounded-[24px] border border-[#E3E8EF] bg-white">
                    <div className="border-b border-[#E7E9EC] px-5 py-6 md:px-8 md:py-8">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-semibold text-[#667085]">
                                {job.temple}
                            </span>

                            <span className="rounded-full bg-[#FFF9C4] px-3 py-1 text-xs font-semibold text-[#6D6200]">
                                {job.type}
                            </span>
                        </div>

                        <h1 className="mt-4 text-[26px] font-bold leading-snug tracking-[-0.035em] md:text-[34px]">
                            {job.title}
                        </h1>

                        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#667085]">
                            <span>근무지역 · {job.location}</span>
                            <span>마감일 · {job.date}</span>
                        </div>
                    </div>

                    <div className="grid gap-8 px-5 py-7 md:grid-cols-[minmax(0,1fr)_280px] md:px-8 md:py-9">
                        <div>
                            <section>
                                <h2 className="text-lg font-bold">모집 안내</h2>

                                <p className="mt-3 text-[15px] leading-7 text-[#4E5968]">
                                    {job.temple}에서 함께 근무할 분을 모집합니다. 불교문화와
                                    사찰 업무에 관심이 있고 맡은 업무를 성실하게 수행할 분의
                                    지원을 기다립니다.
                                </p>
                            </section>

                            <section className="mt-8">
                                <h2 className="text-lg font-bold">주요 업무</h2>

                                <ul className="mt-3 space-y-2 text-[15px] leading-7 text-[#4E5968]">
                                    <li>• 담당 분야의 일상적인 실무와 운영 보조</li>
                                    <li>• 방문객 및 관계자 안내와 응대</li>
                                    <li>• 행사 준비와 사찰 내 업무 협조</li>
                                </ul>
                            </section>

                            <section className="mt-8">
                                <h2 className="text-lg font-bold">지원 자격</h2>

                                <ul className="mt-3 space-y-2 text-[15px] leading-7 text-[#4E5968]">
                                    <li>• 맡은 업무에 책임감을 가지고 성실하게 근무할 분</li>
                                    <li>• 원활한 의사소통과 협업이 가능한 분</li>
                                    <li>• 관련 업무 경험자는 우대합니다</li>
                                </ul>
                            </section>

                            <section className="mt-8">
                                <h2 className="text-lg font-bold">지원 방법</h2>

                                <p className="mt-3 text-[15px] leading-7 text-[#4E5968]">
                                    이력서와 간단한 자기소개서를 준비한 후 아래의 지원하기
                                    버튼을 눌러 접수해주세요. 상세 일정은 담당자가 개별적으로
                                    안내합니다.
                                </p>
                            </section>
                        </div>

                        <aside>
                            <div className="rounded-[20px] border border-[#E3E8EF] bg-[#F4F7FA] p-5">
                                <h2 className="text-lg font-bold">공고 정보</h2>

                                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-5">
                                    <div>
                                        <dt className="text-xs text-[#667085]">기관</dt>
                                        <dd className="mt-1 text-sm font-semibold">
                                            {job.temple}
                                        </dd>
                                    </div>

                                    <div>
                                        <dt className="text-xs text-[#667085]">근무지역</dt>
                                        <dd className="mt-1 text-sm font-semibold">
                                            {job.location}
                                        </dd>
                                    </div>

                                    <div>
                                        <dt className="text-xs text-[#667085]">고용형태</dt>
                                        <dd className="mt-1 text-sm font-semibold">
                                            {job.type}
                                        </dd>
                                    </div>

                                    <div>
                                        <dt className="text-xs text-[#667085]">접수마감</dt>
                                        <dd className="mt-1 text-sm font-semibold">
                                            {job.date}
                                        </dd>
                                    </div>
                                </dl>

                                <div className="my-5 border-t border-[#DDE3EA]" />

                                <section>
                                    <h2 className="font-bold">채용 담당자</h2>

                                    <div className="mt-3 space-y-3 text-sm">
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="shrink-0 text-[#667085]">담당자</span>
                                            <strong className="text-right">
                                                {job.temple} 채용담당자
                                            </strong>
                                        </div>

                                        <div className="flex items-center justify-between gap-4">
                                            <span className="shrink-0 text-[#667085]">전화</span>

                                            <a
                                                href="tel:01012345678"
                                                className="text-right font-semibold text-[#191F28] underline decoration-[#B0B8C1] underline-offset-4"
                                            >
                                                010-1234-5678
                                            </a>
                                        </div>

                                        <div className="flex items-start justify-between gap-4">
                                            <span className="shrink-0 text-[#667085]">이메일</span>

                                            <a
                                                href="mailto:recruit@example.com"
                                                className="min-w-0 break-all text-right text-sm font-semibold text-[#191F28]"
                                            >
                                                recruit@example.com
                                            </a>
                                        </div>
                                    </div>
                                </section>

                                <div className="mt-5 grid grid-cols-2 gap-2">
                                    <a
                                        href="tel:01012345678"
                                        className="flex items-center justify-center rounded-xl bg-[#FEE500] px-3 py-3.5 text-sm font-bold text-[#191F28]"
                                    >
                                        전화 문의
                                    </a>

                                    <a
                                        href="mailto:recruit@example.com"
                                        className="flex items-center justify-center rounded-xl border border-[#D9DEE5] bg-white px-3 py-3.5 text-sm font-bold text-[#252A31]"
                                    >
                                        이메일 지원
                                    </a>
                                </div>
                            </div>
                        </aside>
                    </div>
                </article>
            </main>
        </div>
    );
}