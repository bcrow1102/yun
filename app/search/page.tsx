import Link from "next/link";

type SearchItem = {
    category: string;
    title: string;
    description: string;
    href: string;
    keywords: string;
    external?: boolean;
};

const searchItems: SearchItem[] = [
    { category: "구인", title: "조계사 사무행정 담당자 모집", description: "서울 종로구 · 정규직", href: "/jobs/1", keywords: "조계사 서울 종로 사무 행정 채용 구인 정규직" },
    { category: "구인", title: "해인사 문화해설 자원봉사자", description: "경남 합천 · 봉사", href: "/jobs/2", keywords: "해인사 경남 합천 문화 해설 봉사 구인" },
    { category: "구인", title: "불국사 템플스테이 코디네이터", description: "경북 경주 · 계약직", href: "/jobs/3", keywords: "불국사 경주 템플스테이 코디네이터 채용 구인" },

    { category: "사찰 안내", title: "조계사", description: "서울 도심에서 만나는 한국 불교의 대표적인 사찰", href: "/temples/guide", keywords: "조계사 서울 종로 도심 사찰 대중교통" },
    { category: "사찰 안내", title: "해인사", description: "가야산과 팔만대장경을 품은 전통사찰", href: "/temples/guide", keywords: "해인사 경남 합천 가야산 팔만대장경 문화유산 산사" },
    { category: "사찰 안내", title: "불국사", description: "신라 역사와 불교문화를 함께 만나는 사찰", href: "/temples/guide", keywords: "불국사 경북 경주 신라 문화유산 관광" },
    { category: "사찰 안내", title: "통도사", description: "고요한 숲길과 수행의 전통이 이어지는 사찰", href: "/temples/guide", keywords: "통도사 경남 양산 산사 숲길 수행" },
    { category: "사찰 안내", title: "월정사", description: "전나무 숲길과 함께 걷기 좋은 오대산 사찰", href: "/temples/guide", keywords: "월정사 강원 평창 오대산 전나무 숲길" },
    { category: "사찰 안내", title: "봉은사", description: "도심 속에서 잠시 쉬어갈 수 있는 사찰", href: "/temples/guide", keywords: "봉은사 서울 강남 도심 외국인 방문" },

    { category: "템플스테이", title: "월정사 숲속 힐링", description: "강원 평창 · 1박 2일 휴식형", href: "/temples/stay/1", keywords: "월정사 강원 평창 숲 힐링 휴식 템플스테이" },
    { category: "템플스테이", title: "해인사 명상 수련", description: "경남 합천 · 2박 3일 체험형", href: "/temples/stay/2", keywords: "해인사 경남 합천 명상 수련 체험 템플스테이" },
    { category: "템플스테이", title: "낙산사 바다 명상", description: "강원 양양 · 1박 2일 휴식형", href: "/temples/stay", keywords: "낙산사 강원 양양 바다 명상 휴식 템플스테이" },

    { category: "사찰음식", title: "사찰음식 기본 체험", description: "서울 사찰음식문화체험관", href: "/temples/food/1", keywords: "서울 사찰음식 요리 체험 기본" },
    { category: "사찰음식", title: "계절 나물과 사찰 밥상", description: "봉녕사 · 경기 수원", href: "/temples/food/2", keywords: "봉녕사 경기 수원 계절 나물 밥상 사찰음식 교육" },
    { category: "사찰음식", title: "발우공양 체험", description: "통도사 · 경남 양산", href: "/temples/food/3", keywords: "통도사 경남 양산 발우공양 체험 사찰음식" },

    { category: "행사·교육", title: "산사 음악회", description: "연화사 · 2026년 8월 22일", href: "/events/1", keywords: "산사 음악회 연화사 행사 문화 공연 연등" },
    { category: "행사·교육", title: "행사·교육 전체보기", description: "문화행사, 체험과 교육 일정을 찾아보세요.", href: "/events", keywords: "행사 교육 강좌 체험 음악회 일정" },

    { category: "부처님 이야기", title: "화를 내는 사람에게 돌려준 선물", description: "분노를 받아들이지 않고 마음을 지키는 이야기", href: "/stories/1", keywords: "부처님 이야기 분노 화 마음 선물" },
    { category: "부처님 이야기", title: "겨자씨를 구하러 다닌 어머니", description: "상실과 삶과 죽음에 관한 이야기", href: "/stories/2", keywords: "부처님 이야기 겨자씨 어머니 죽음 상실 슬픔" },
    { category: "부처님 이야기", title: "가난한 여인의 등불", description: "작은 나눔과 정성에 관한 이야기", href: "/stories/3", keywords: "부처님 이야기 가난 여인 등불 나눔 정성 자비" },

    { category: "불교자료", title: "불교기록문화유산 아카이브", description: "통합대장경과 한국불교전서를 검색하는 동국대학교 공식 자료", href: "https://kabc.dongguk.edu/", keywords: "경전 대장경 한국불교전서 동국대학교 원문 학술", external: true },
    { category: "불교자료", title: "한국구비문학대계", description: "전국에서 채록한 설화·민요·무가 자료", href: "https://kdp.aks.ac.kr/inde/gubi", keywords: "민간 전승 설화 구비문학 민요 무가 불교설화", external: true },
    { category: "불교자료", title: "RISS 학술연구정보서비스", description: "불교학 관련 논문과 학위자료 검색", href: "https://www.riss.kr/", keywords: "논문 학술 연구 학위 불교학 RISS", external: true },
];

function LotusIcon() {
    return (
        <svg viewBox="0 0 32 32" fill="none" className="h-6 w-6">
            <path d="M16 24c-4-4.1-5.2-8.2 0-15 5.2 6.8 4 10.9 0 15Z" stroke="currentColor" strokeWidth="1.6" />
            <path d="M15 24C9.5 23.3 6.6 20.5 7 14c5.4.7 8.1 4 8 10Z" stroke="currentColor" strokeWidth="1.6" />
            <path d="M17 24c5.5-.7 8.4-3.5 8-10-5.4.7-8.1 4-8 10Z" stroke="currentColor" strokeWidth="1.6" />
            <path d="M7 25h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
    );
}

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const params = await searchParams;
    const query = (params.q ?? "").trim();
    const normalizedQuery = query.toLocaleLowerCase("ko-KR");
    const results = query
        ? searchItems.filter((item) =>
            `${item.category} ${item.title} ${item.description} ${item.keywords}`
                .toLocaleLowerCase("ko-KR")
                .includes(normalizedQuery)
        )
        : [];

    const groupedResults = results.reduce<Record<string, SearchItem[]>>((groups, item) => {
        (groups[item.category] ??= []).push(item);
        return groups;
    }, {});

    const categories = ["구인", "사찰 안내", "템플스테이", "사찰음식", "행사·교육", "부처님 이야기", "불교자료"];

    return (
        <div className="min-h-screen bg-[#F7F8FA] text-[#252A31]">
            <header className="border-b border-[#E7E9EC] bg-white">
                <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 md:h-[72px] md:px-8">
                    <Link href="/" className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F4F54A] md:h-10 md:w-10"><LotusIcon /></span>
                        <strong className="text-xl font-semibold tracking-[-0.04em]">연</strong>
                    </Link>
                    <Link href="/" className="rounded-xl border border-[#E3E8EF] bg-white px-4 py-2.5 text-sm font-medium">홈으로</Link>
                </div>
            </header>

            <main>
                <section className="border-b border-[#E8EA8A] bg-[#FDFDC7]">
                    <div className="mx-auto max-w-5xl px-4 py-9 md:px-8 md:py-12">
                        <h1 className="text-[30px] font-semibold tracking-[-0.04em] md:text-[42px]">통합검색</h1>
                        <form action="/search" method="get" className="mt-6 flex max-w-3xl gap-2 rounded-[18px] border border-[#D8DA72] bg-white p-2 shadow-[0_6px_20px_rgba(25,31,40,0.06)]">
                            <input name="q" type="search" defaultValue={query} autoFocus placeholder="사찰, 행사, 경전과 이야기를 검색해 보세요" className="min-w-0 flex-1 bg-transparent px-3 py-3 text-[15px] outline-none placeholder:text-[#A8B0BA]" />
                            <button type="submit" className="rounded-xl bg-[#252A31] px-5 py-3 text-sm font-medium text-white">검색</button>
                        </form>
                    </div>
                </section>

                <section className="mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-12">
                    {!query ? (
                        <div>
                            <p className="text-sm text-[#667085]">검색어를 입력하거나 분야별 정보를 둘러보세요.</p>
                            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
                                {categories.map((category) => (
                                    <Link key={category} href={`/search?q=${encodeURIComponent(category)}`} className="rounded-[18px] border border-[#E3E8EF] bg-white px-4 py-5 text-center text-sm font-medium transition hover:border-[#D8DA72]">{category}</Link>
                                ))}
                            </div>
                        </div>
                    ) : results.length === 0 ? (
                        <div className="rounded-[22px] border border-[#E3E8EF] bg-white px-5 py-14 text-center">
                            <h2 className="text-xl font-semibold">검색 결과가 없습니다</h2>
                            <p className="mt-3 text-sm leading-6 text-[#667085]">다른 사찰명, 지역 또는 짧은 단어로 다시 검색해 보세요.</p>
                        </div>
                    ) : (
                        <div>
                            <div className="mb-6 flex items-end justify-between gap-4">
                                <div><span className="text-sm text-[#777900]">‘{query}’ 검색 결과</span><h2 className="mt-1 text-[24px] font-semibold">총 {results.length}건</h2></div>
                            </div>

                            <div className="space-y-7">
                                {categories.filter((category) => groupedResults[category]?.length).map((category) => (
                                    <section key={category}>
                                        <h3 className="mb-3 text-[17px] font-semibold">{category} <span className="ml-1 text-sm font-normal text-[#8B95A1]">{groupedResults[category].length}</span></h3>
                                        <div className="overflow-hidden rounded-[20px] border border-[#E3E8EF] bg-white">
                                            {groupedResults[category].map((item) => {
                                                const content = <><span className="min-w-0"><strong className="block text-[15px] font-medium">{item.title}</strong><span className="mt-1 block text-sm leading-6 text-[#667085]">{item.description}</span></span><span className="ml-4 shrink-0 text-[#B0B8C1]">{item.external ? "↗" : "→"}</span></>;
                                                const className = "flex items-center justify-between border-b border-[#EEF0F2] px-5 py-4 last:border-b-0 hover:bg-[#FFFFF0]";
                                                return item.external ? <a key={item.title} href={item.href} target="_blank" rel="noreferrer" className={className}>{content}</a> : <Link key={item.title} href={item.href} className={className}>{content}</Link>;
                                            })}
                                        </div>
                                    </section>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
