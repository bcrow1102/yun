import JobCard from "@/app/components/JobCard";
import TempleStayCard from "@/app/components/TempleStayCard";
import BottomNav from "@/app/components/BottomNav";
import MobileHome from "@/app/components/MobileHome";

const mainMenus = ["구인", "구직", "행사·교육", "템플스테이", "사찰음식"];

const latestJobs = [
  {
    id: 1,
    temple: "조계사",
    title: "사무행정 담당자 모집",
    location: "서울 종로구",
    date: "~07.31",
    tag: "정규직",
  },
  {
    id: 2,
    temple: "해인사",
    title: "문화해설 자원봉사자",
    location: "경남 합천",
    date: "~08.15",
    tag: "봉사",
  },
  {
    id: 3,
    temple: "불국사",
    title: "템플스테이 코디네이터",
    location: "경북 경주",
    date: "~08.05",
    tag: "계약직",
  },
];

const recommendedTempleStays = [
  {
    id: 1,
    name: "월정사 숲속 힐링",
    location: "강원 평창",
    duration: "1박 2일",
    price: "50,000원",
    rating: 4.8,
    image: "🌲",
  },
  {
    id: 2,
    name: "해인사 명상 수련",
    location: "경남 합천",
    duration: "2박 3일",
    price: "80,000원",
    rating: 4.9,
    image: "🧘",
  },
  {
    id: 3,
    name: "통도사 체험형",
    location: "경남 양산",
    duration: "당일",
    price: "30,000원",
    rating: 4.7,
    image: "🕯️",
  },
];

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 12h14m-5-5 5 5-5 5"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path strokeLinecap="round" d="m20 20-4-4" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <MobileHome />

      <div className="hidden min-h-screen bg-[#fffcf8] pb-24 md:block">
        <header className="sticky top-0 z-30 border-b border-[#f1e8e5] bg-[#fffcf8]/92 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
            <div className="flex items-center gap-3">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f3c9d0] text-[#b86f7b] shadow-sm"
                aria-hidden="true"
              >
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
              </span>

              <div className="flex items-baseline gap-2">
                <strong className="text-xl tracking-[-0.04em] text-[#40333e]">
                  연
                </strong>
                <span className="text-[10px] font-semibold tracking-[0.2em] text-[#ad8991]">
                  YUN
                </span>
              </div>
            </div>

            <button
              type="button"
              aria-label="검색"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#718064] shadow-sm ring-1 ring-[#eee3df] transition hover:bg-[#fff4f3]"
            >
              <SearchIcon />
            </button>
          </div>
        </header>

        <main>
          <div className="mx-auto max-w-6xl px-5 pt-4 md:px-8 md:pt-6">
            <nav
              className="scrollbar-none mb-4 flex overflow-x-auto rounded-2xl border border-[#eee3df] bg-white px-2 py-1.5 shadow-sm md:mb-5 md:justify-center"
              aria-label="주요 메뉴"
            >
              {mainMenus.map((menu, index) => (
                <div key={menu} className="flex shrink-0 items-center">
                  {index > 0 && (
                    <span
                      className="h-4 w-px bg-[#eadeda]"
                      aria-hidden="true"
                    />
                  )}

                  <button
                    type="button"
                    className="whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold text-[#594851] transition hover:bg-[#fff2f2] hover:text-[#b76471] md:px-7"
                  >
                    {menu}
                  </button>
                </div>
              ))}
            </nav>

            <section className="hero-surface relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#fff0f1] via-[#f9f1f7] to-[#f1f5e9] text-[#40333e] shadow-[0_22px_65px_-32px_rgba(117,88,101,0.38)]">
              <div
                className="hero-grid-pattern absolute inset-0 opacity-[0.12]"
                aria-hidden="true"
              />

              <div
                className="absolute -right-24 -top-32 h-80 w-80 rounded-full bg-[#efb7c2]/45 blur-3xl"
                aria-hidden="true"
              />

              <div
                className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-[#dce8cc]/45 blur-3xl"
                aria-hidden="true"
              />

              <div className="relative grid min-h-[430px] gap-8 px-6 py-9 md:grid-cols-[0.9fr_1.1fr] md:items-center md:px-14 md:py-14">
                <div className="relative z-10 max-w-lg">
                  <p className="mb-4 text-[11px] font-semibold tracking-[0.2em] text-[#a46672]">
                    BUDDHIST LIFE &amp; COMMUNITY
                  </p>

                  <h1 className="text-[38px] font-bold leading-[1.16] tracking-[-0.055em] text-[#40333e] md:text-6xl">
                    불교 정보가
                    <br />
                    더 쉽고 가까이
                  </h1>

                  <p className="mt-5 text-sm leading-7 text-[#71636e] md:text-base">
                    사찰 구인·구직부터 행사, 템플스테이와 사찰음식까지
                    <br className="hidden md:block" /> 필요한 정보를 한곳에서
                    편하게 만나보세요.
                  </p>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <button
                      type="button"
                      className="flex items-center gap-2 rounded-xl bg-[#c97883] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#b85f6d]/20 transition hover:-translate-y-0.5 hover:bg-[#b96875]"
                    >
                      정보 둘러보기
                      <ArrowIcon />
                    </button>

                    <button
                      type="button"
                      className="rounded-xl border border-[#c97883]/30 bg-white/65 px-5 py-3 text-sm font-semibold text-[#754c56] backdrop-blur-sm transition hover:bg-white"
                    >
                      행사 등록
                    </button>
                  </div>
                </div>

                <div className="relative mx-auto h-[295px] w-full max-w-[460px] md:h-[330px]">
                  <div className="absolute left-0 top-4 w-[78%] rotate-[-4deg] rounded-2xl border border-white/80 bg-[#fffaf5] p-4 text-[#40333e] shadow-[0_18px_45px_-18px_rgba(104,73,88,0.38)] md:p-5">
                    <div className="mb-5 flex items-center justify-between">
                      <span className="rounded-full bg-[#e9efdf] px-2.5 py-1 text-[10px] font-bold text-[#66745a]">
                        최신 구인
                      </span>
                      <span className="text-xs text-[#ad8991]">오늘 등록</span>
                    </div>

                    <p className="text-xs text-[#987d84]">서울 · 조계사</p>
                    <strong className="mt-1 block text-base">
                      사무행정 담당자 모집
                    </strong>

                    <div className="mt-4 flex items-center justify-between border-t border-[#eee1dd] pt-3 text-xs">
                      <span className="text-[#8d737a]">정규직 · 경력무관</span>
                      <span className="font-bold text-[#b76471]">
                        자세히 보기 →
                      </span>
                    </div>
                  </div>

                  <div className="absolute right-0 top-[92px] w-[72%] rotate-[4deg] rounded-2xl border border-white bg-white p-4 text-[#40333e] shadow-[0_18px_45px_-18px_rgba(104,73,88,0.35)] md:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold tracking-[0.12em] text-[#b37580]">
                          TEMPLESTAY
                        </span>
                        <strong className="mt-1 block text-base">
                          월정사 숲속 힐링
                        </strong>
                        <p className="mt-1 text-xs text-[#987d84]">
                          강원 평창 · 1박 2일
                        </p>
                      </div>

                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef2e7] text-[#718064]">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className="h-6 w-6"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 3v18M8 7c0 2.5 1.8 4 4 4M16 7c0 2.5-1.8 4-4 4M7 13c0 2.7 2.2 4.5 5 4.5M17 13c0 2.7-2.2 4.5-5 4.5"
                          />
                        </svg>
                      </span>
                    </div>

                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#f2eee9]">
                      <span className="block h-full w-2/3 rounded-full bg-[#a5b68e]" />
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-[8%] w-[70%] rounded-2xl border border-[#f0cfd3] bg-[#f8dfe2] p-4 text-[#40333e] shadow-[0_18px_45px_-18px_rgba(104,73,88,0.35)] md:p-5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#c97883] text-white">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          className="h-5 w-5"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 4h14v16H5zM8 8h8M8 11h8M8 14h5"
                          />
                        </svg>
                      </span>

                      <div>
                        <span className="text-[10px] font-bold text-[#a46672]">
                          한 번 입력하면
                        </span>
                        <strong className="block text-sm">
                          행사 웹전단 자동 완성
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="mx-auto grid max-w-6xl gap-9 px-5 py-10 md:grid-cols-2 md:px-8 md:py-14">
            <section aria-label="최신 구인 정보">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.18em] text-[#b37580]">
                    JOBS
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-[#40333e]">
                    최신 구인
                  </h2>
                </div>

                <button className="text-sm font-medium text-[#b76471] hover:text-[#92505b]">
                  더보기 →
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {latestJobs.map((job, index) => (
                  <JobCard key={job.id} job={job} delay={index * 0.08} />
                ))}
              </div>
            </section>

            <section aria-label="추천 템플스테이">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.18em] text-[#b37580]">
                    EXPERIENCE
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-[#40333e]">
                    추천 템플스테이
                  </h2>
                </div>

                <button className="text-sm font-medium text-[#b76471] hover:text-[#92505b]">
                  더보기 →
                </button>
              </div>

              <div className="scrollbar-none flex gap-3 overflow-x-auto px-1 pb-3 snap-x snap-mandatory">
                {recommendedTempleStays.map((stay, index) => (
                  <TempleStayCard
                    key={stay.id}
                    stay={stay}
                    delay={index * 0.08}
                  />
                ))}
              </div>
            </section>
          </div>
        </main>

      </div>

      <div className="md:hidden">
        <BottomNav />
      </div>
    </>
  );
}