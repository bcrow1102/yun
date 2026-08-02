import Link from "next/link";

const resources = [
    {
        group: "한국 불교 원전",
        title: "불교기록문화유산 아카이브",
        organization: "동국대학교 불교학술원",
        description: "통합대장경, 한국불교전서와 한국 불교 기록문화유산을 찾아볼 수 있습니다.",
        language: "한국어·한문",
        href: "https://kabc.dongguk.edu/",
    },
    {
        group: "한국 불교 원전",
        title: "한국불교전서",
        organization: "동국대학교 불교학술원",
        description: "한국 불교의 주요 저술을 서명, 저자와 권별로 찾아볼 수 있습니다.",
        language: "한국어·한문",
        href: "https://kabc.dongguk.edu/content/list?itemId=ABC_BJ",
    },
    {
        group: "역사 자료",
        title: "한국사데이터베이스",
        organization: "국사편찬위원회",
        description: "한국 불교사와 관련된 사료를 포함해 다양한 한국사 원문 자료를 검색할 수 있습니다.",
        language: "한국어·한문",
        href: "https://db.history.go.kr/",
    },
    {
        group: "민간 전승·불교설화",
        title: "한국민속대백과사전",
        organization: "국립민속박물관",
        description: "민속신앙, 의례, 세시풍속과 지역에서 이어진 전승을 전문 사전에서 찾아볼 수 있습니다.",
        language: "한국어",
        href: "https://folkency.nfm.go.kr/",
    },
    {
        group: "민간 전승·불교설화",
        title: "한국구비문학대계",
        organization: "한국학중앙연구원",
        description: "전국에서 채록한 설화, 민요와 무가를 통해 사찰·고승·불교 신앙 관련 구전 자료를 찾아볼 수 있습니다.",
        language: "한국어",
        href: "https://kdp.aks.ac.kr/inde/gubi",
    },
    {
        group: "민간 전승·불교설화",
        title: "한국향토문화전자대전",
        organization: "한국학중앙연구원",
        description: "지역별 사찰 전설, 지명 유래, 인물과 향토 신앙 자료를 지역문화 기록에서 찾아볼 수 있습니다.",
        language: "한국어",
        href: "https://www.grandculture.net/",
    },
    {
        group: "민간 전승·불교설화",
        title: "불교설화 DB",
        organization: "동국대학교 전자불전문화콘텐츠연구소",
        description: "불교설화와 관련 문화콘텐츠를 주제로 구축한 전문 연구 자료를 살펴볼 수 있습니다.",
        language: "한국어",
        href: "https://www.iebtc.net/%EC%9E%90%EB%A3%8C%EA%B5%AC%EC%B6%95-db/%EB%B6%88%EA%B5%90%EC%84%A4%ED%99%94-db",
    },
    {
        group: "민간 전승·불교설화",
        title: "무형유산지식새김",
        organization: "국립무형유산원",
        description: "의례, 공연과 전승 공동체 등 오늘날까지 이어지는 무형유산 정보를 확인할 수 있습니다.",
        language: "한국어",
        href: "https://www.iha.go.kr/",
    },
    {
        group: "논문·연구",
        title: "RISS 학술연구정보서비스",
        organization: "한국교육학술정보원",
        description: "불교학 관련 국내 학술논문, 학위논문과 연구자료의 서지정보를 찾아볼 수 있습니다.",
        language: "한국어·영어",
        href: "https://www.riss.kr/",
    },
    {
        group: "국제 경전 자료",
        title: "CBETA Online",
        organization: "Chinese Buddhist Electronic Text Association",
        description: "한문 불전 원문을 검색하고 판본 정보를 확인할 수 있는 국제 전자불전 자료입니다.",
        language: "한문·중국어·영어",
        href: "https://cbetaonline.dila.edu.tw/",
        caution: "비상업 이용과 표시 조건 등 원문 제공처의 이용조건을 확인해 주세요.",
    },
    {
        group: "국제 경전 자료",
        title: "SAT 대정신수대장경 데이터베이스",
        organization: "SAT Daizōkyō Text Database Committee",
        description: "대정신수대장경 원문과 관련 학술정보를 검색할 수 있는 데이터베이스입니다.",
        language: "한문·일본어·영어",
        href: "https://21dzk.l.u-tokyo.ac.jp/SAT/index_en.html",
        caution: "인용과 재사용 전 제공처의 이용조건을 확인해 주세요.",
    },
    {
        group: "영문 경전",
        title: "BDK English Tripiṭaka",
        organization: "BDK·SAT",
        description: "영문 불전 번역과 대응하는 한문 원문을 함께 살펴볼 수 있습니다.",
        language: "영어·한문",
        href: "https://www.bdk.or.jp/bdk/digital/",
        caution: "번역문을 재사용할 때는 해당 저작권과 이용조건을 확인해 주세요.",
    },
];

const principles = [
    "원문·번역문을 임의로 바꾸지 않습니다.",
    "출처, 저자·번역자, 판본과 연결 주소를 함께 표시합니다.",
    "학술 자료와 연의 쉬운 해설을 명확히 구분합니다.",
    "저작권과 이용조건이 확인되지 않은 자료는 복제하지 않습니다.",
    "민간 전승은 경전이나 역사적 사실과 구분해 표시합니다.",
    "구전 자료는 채록 지역·전승자·채록 시기와 서로 다른 판본을 함께 확인합니다.",
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

export default function ResourcesPage() {
    return (
        <div className="min-h-screen bg-white text-[#252A31]">
            <header className="sticky top-0 z-30 border-b border-[#E7E9EC] bg-white/95 backdrop-blur">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:h-[72px] md:px-8">
                    <Link href="/" className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F4F54A] md:h-10 md:w-10"><LotusIcon /></span>
                        <strong className="text-xl font-semibold tracking-[-0.04em]">연</strong>
                    </Link>
                    <Link href="/" className="rounded-xl border border-[#E3E8EF] bg-white px-4 py-2.5 text-sm font-medium">홈으로</Link>
                </div>
            </header>

            <main>
                <section className="border-b border-[#E8EA8A] bg-[#FDFDC7]">
                    <div className="mx-auto max-w-6xl px-5 py-11 md:px-8 md:py-16">
                        <span className="text-sm font-medium text-[#5F610E]">신뢰할 수 있는 출처로 연결합니다</span>
                        <h1 className="mt-3 text-[34px] font-semibold tracking-[-0.045em] md:text-[48px]">불교자료</h1>
                        <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#667085] md:text-base">
                            경전과 한국 불교사, 논문과 영문 자료를 공식 제공처에서 안전하게 찾아보세요.
                        </p>
                    </div>
                </section>

                <section className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {resources.map((resource) => (
                            <a key={resource.title} href={resource.href} target="_blank" rel="noreferrer" className="group flex min-h-[260px] flex-col rounded-[22px] border border-[#E3E8EF] bg-white p-5 transition hover:-translate-y-1 hover:border-[#D8DA72] hover:shadow-[0_12px_30px_rgba(25,31,40,0.08)]">
                                <span className="text-xs font-medium text-[#777900]">{resource.group}</span>
                                <h2 className="mt-3 text-[20px] font-semibold tracking-[-0.025em]">{resource.title}</h2>
                                <p className="mt-1 text-xs text-[#8B95A1]">{resource.organization}</p>
                                <p className="mt-4 text-sm leading-6 text-[#667085]">{resource.description}</p>
                                {resource.caution && <p className="mt-3 rounded-xl bg-[#F7F8FA] px-3 py-2.5 text-xs leading-5 text-[#667085]">{resource.caution}</p>}
                                <span className="mt-auto pt-5 text-xs text-[#8B95A1]">{resource.language}</span>
                                <span className="mt-3 text-sm font-medium text-[#252A31]">공식 자료 열기 →</span>
                            </a>
                        ))}
                    </div>
                </section>

                <section className="border-t border-[#E7E9EC] bg-[#F7F8FA]">
                    <div className="mx-auto max-w-6xl px-4 py-9 md:px-8 md:py-12">
                        <h2 className="text-[22px] font-semibold">연의 자료 원칙</h2>
                        <div className="mt-5 grid gap-3 md:grid-cols-2">
                            {principles.map((principle) => <p key={principle} className="rounded-xl border border-[#E3E8EF] bg-white px-4 py-4 text-sm leading-6 text-[#667085]">{principle}</p>)}
                        </div>
                        <p className="mt-5 text-xs leading-6 text-[#8B95A1]">연은 현재 원문을 직접 제공하지 않으며, 각 자료의 정확한 인용 및 이용 범위는 공식 제공처의 최신 안내를 기준으로 합니다.</p>
                    </div>
                </section>
            </main>
        </div>
    );
}
