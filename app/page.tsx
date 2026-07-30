import Link from "next/link";
import JobCard from "@/app/components/JobCard";
import TempleStayCard from "@/app/components/TempleStayCard";
import BottomNav from "@/app/components/BottomNav";
import MobileHome from "@/app/components/MobileHome";

const mainMenus = ["구인", "구직", "행사·교육", "템플스테이", "사찰음식"];

const quickMenus = [
  {
    title: "구인",
    description: "사찰 채용정보",
    image: "/images/menu/hire.webp",
  },
  {
    title: "구직",
    description: "일자리 등록",
    image: "/images/menu/job-seeker.webp",
  },
  {
    title: "행사·교육",
    description: "불교 행사 소식",
    image: "/images/menu/event-education.webp",
  },
  {
    title: "체험",
    description: "템플스테이·사찰음식",
    image: "/images/menu/experience.webp",
  },
];

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

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <path
        d="M5 12h14m-5-5 5 5-5 5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <MobileHome />

      <div className="hidden min-h-screen bg-white pb-20 text-[#252A31] md:block">
        <header className="sticky top-0 z-30 border-b border-[#F2F4F6] bg-white/95 backdrop-blur">
          <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-8">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#FEE500] text-[#191F28]">
                <LotusIcon />
              </span>

              <strong className="text-[22px] font-bold tracking-[-0.04em]">
                연
              </strong>
            </div>

            <nav className="flex items-center gap-1" aria-label="주요 메뉴">
              {mainMenus.map((menu) =>
                menu === "구인" ? (
                  <Link
                    key={menu}
                    href="/jobs"
                    className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#4E5968] transition hover:bg-[#FFF9C4] hover:text-[#191F28]"
                  >
                    {menu}
                  </Link>
                ) : (
                  <button
                    key={menu}
                    className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#4E5968] transition hover:bg-[#FFF9C4] hover:text-[#191F28]"
                  >
                    {menu}
                  </button>
                )
              )}
            </nav>

            <div className="flex items-center gap-2">
              <button className="px-2 py-2 text-xs font-bold">KR</button>

              <button className="px-2 py-2 text-xs text-[#8B95A1]">
                EN
              </button>

              <button
                className="flex h-10 w-10 items-center justify-center rounded-full text-[#333D4B] transition hover:bg-[#F2F4F6]"
                aria-label="검색"
              >
                <SearchIcon />
              </button>

              <button className="ml-1 rounded-xl bg-[#FEE500] px-4 py-2.5 text-sm font-bold text-[#191F28]">
                로그인
              </button>
            </div>
          </div>
        </header>

        <main>
          <section className="bg-[#FEE500]">
            <div className="mx-auto grid min-h-[390px] max-w-6xl grid-cols-[0.9fr_1.1fr] items-center gap-14 px-8 py-14">
              <div>
                <p className="text-base font-semibold text-[#6D6200]">
                  오늘 필요한 불교 정보를
                </p>

                <h1 className="mt-3 text-[52px] font-bold leading-[1.12] tracking-[-0.055em]">
                  쉽고 빠르게
                  <br />
                  찾아보세요
                </h1>

                <p className="mt-5 max-w-md text-[16px] leading-7 text-[#514A00]">
                  사찰 구인·구직부터 행사와 교육, 템플스테이,
                  사찰음식까지 필요한 정보를 한곳에서 편하게 만나보세요.
                </p>

                <div className="mt-8 flex gap-3">
                  <button className="flex items-center gap-2 rounded-xl bg-[#191F28] px-5 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5">
                    정보 둘러보기
                    <ArrowIcon />
                  </button>

                  <button className="rounded-xl border border-[#191F28]/15 bg-white/70 px-5 py-3.5 text-sm font-bold text-[#191F28] transition hover:bg-white">
                    행사 등록
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {quickMenus.map((menu) =>
                  menu.title === "구인" ? (
                    <Link
                      key={menu.title}
                      href="/jobs"
                      className="group flex min-h-[140px] items-center gap-4 rounded-[24px] border border-[#E7E9EC] bg-[#FFFBE0] p-5 text-left shadow-[0_3px_12px_rgba(25,31,40,0.04)] transition hover:-translate-y-1"
                    >
                      <span className="flex h-[86px] w-[86px] shrink-0 items-center justify-center rounded-[20px] bg-[#FFFBE0] p-2">
                        <img
                          src={menu.image}
                          alt=""
                          className="h-full w-full object-contain"
                        />
                      </span>

                      <span className="min-w-0">
                        <strong className="block text-lg font-semibold text-[#252A31]">
                          {menu.title}
                        </strong>

                        <span className="mt-1 block text-sm leading-5 text-[#667085]">
                          {menu.description}
                        </span>
                      </span>
                    </Link>
                  ) : (
                    <button
                      key={menu.title}
                      className="group flex min-h-[140px] items-center gap-4 rounded-[24px] border border-[#E7E9EC] bg-[#FFFBE0] p-5 text-left shadow-[0_3px_12px_rgba(25,31,40,0.04)] transition hover:-translate-y-1"
                    >
                      <span className="flex h-[86px] w-[86px] shrink-0 items-center justify-center rounded-[20px] bg-[#FFFBE0] p-2">
                        <img
                          src={menu.image}
                          alt=""
                          className="h-full w-full object-contain"
                        />
                      </span>

                      <span className="min-w-0">
                        <strong className="block text-lg font-semibold text-[#252A31]">
                          {menu.title}
                        </strong>

                        <span className="mt-1 block text-sm leading-5 text-[#667085]">
                          {menu.description}
                        </span>
                      </span>
                    </button>
                  )
                )}

              </div>
            </div>
          </section>

          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 px-8 py-14">
            <section aria-label="최신 구인 정보">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-[24px] font-bold tracking-[-0.04em]">
                  최신 구인
                </h2>

                <button className="text-sm font-semibold text-[#8B95A1] transition hover:text-[#191F28]">
                  전체보기
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {latestJobs.map((job, index) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    delay={index * 0.08}
                  />
                ))}
              </div>
            </section>

            <section aria-label="추천 템플스테이">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-[24px] font-bold tracking-[-0.04em]">
                  추천 템플스테이
                </h2>

                <button className="text-sm font-semibold text-[#8B95A1] transition hover:text-[#191F28]">
                  전체보기
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 pb-3">
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
      </div >

      <div className="md:hidden">
        <BottomNav />
      </div>
    </>
  );
}
