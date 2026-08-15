import Link from "next/link";

import { searchYeon, type SearchItem } from "./data";

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
    const results = searchYeon(query);

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
