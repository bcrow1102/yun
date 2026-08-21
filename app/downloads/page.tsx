"use client";

import { useState } from "react";
import Link from "next/link";

type ToolItem = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
};

type FormItem = {
  title: string;
  description: string;
  format: "Excel" | "한글";
  filename: string;
  ready: boolean;
};

type FormGroup = {
  title: string;
  description: string;
  items: FormItem[];
};

const tools: ToolItem[] = [
  {
    eyebrow: "웹 실무도구",
    title: "연등 꼬리표 만들기",
    description:
      "이름과 발원 내용을 입력해 연등 꼬리표를 배치하고 바로 인쇄할 수 있습니다.",
    href: "/temple-tools/lantern-tags",
  },
  {
    eyebrow: "웹 실무도구",
    title: "위패 만들기",
    description:
      "위패 내용을 입력하고 인쇄에 맞는 형태로 배치해 바로 사용할 수 있습니다.",
    href: "/temple-tools/memorial-tablets",
  },
];

const formGroups: FormGroup[] = [
  {
    title: "접수·명단",
    description: "행사와 기도, 연등 접수 및 명단 정리에 사용하는 서식입니다.",
    items: [
      {
        title: "출석부",
        description: "교육·법회·모임 등의 출석 현황을 기록합니다.",
        format: "Excel",
        filename: "attendance.xlsx",
        ready: false,
      },
      {
        title: "행사 참가자명단",
        description: "행사 신청자와 참가 현황을 한곳에서 정리합니다.",
        format: "Excel",
        filename: "event-participants.xlsx",
        ready: false,
      },
      {
        title: "축원명단",
        description: "축원 대상과 내용을 정리해 사용할 수 있는 명단입니다.",
        format: "한글",
        filename: "blessing-list.hwpx",
        ready: false,
      },
      {
        title: "영가명단",
        description: "영가 정보를 정리해 의식과 접수 업무에 활용합니다.",
        format: "한글",
        filename: "spirit-list-aligned.hwpx",
        ready: false,
      },
      {
        title: "기도 수기 접수서",
        description: "기도 접수 내용과 발원 내용을 손으로 기록하기 좋은 서식입니다.",
        format: "한글",
        filename: "prayer-reception.hwpx",
        ready: false,
      },
      {
        title: "연등 수기 접수서",
        description: "연등 접수와 축원·발원 내용을 함께 기록할 수 있습니다.",
        format: "한글",
        filename: "lantern-reception.hwpx",
        ready: false,
      },
      {
        title: "재 수기 접수서",
        description: "재 관련 접수 내용과 필요한 메모를 기록하는 서식입니다.",
        format: "한글",
        filename: "memorial-reception.hwpx",
        ready: false,
      },
    ],
  },
  {
    title: "등록·관리",
    description: "신도와 기도·연등·위패 등의 등록 내용을 지속적으로 관리하는 서식입니다.",
    items: [
      {
        title: "인등 등록대장",
        description: "인등 신청과 관리에 필요한 내용을 기록합니다.",
        format: "Excel",
        filename: "indung-register.xlsx",
        ready: false,
      },
      {
        title: "연등 등록대장",
        description: "연등 접수와 납부·관리 내용을 정리합니다.",
        format: "Excel",
        filename: "lantern-register.xlsx",
        ready: false,
      },
      {
        title: "신도 등록대장",
        description: "사찰 신도 기본 정보를 필요한 범위에서 정리합니다.",
        format: "Excel",
        filename: "member-register.xlsx",
        ready: false,
      },
      {
        title: "재 등록대장",
        description: "재 일정과 접수 내용을 지속적으로 관리합니다.",
        format: "Excel",
        filename: "memorial-service-register.xlsx",
        ready: false,
      },
      {
        title: "위패 등록대장",
        description: "위패 접수와 관리에 필요한 내용을 정리합니다.",
        format: "Excel",
        filename: "memorial-tablet-register.xlsx",
        ready: false,
      },
      {
        title: "기도 등록대장",
        description: "기도 신청과 기간, 납부 등 관리 내용을 기록합니다.",
        format: "Excel",
        filename: "prayer-register.xlsx",
        ready: false,
      },
      {
        title: "위패 서식",
        description: "한글에서 직접 입력하거나 빈 양식을 출력해 사용할 수 있습니다.",
        format: "한글",
        filename: "memorial-tablets.hwpx",
        ready: false,
      },
    ],
  },
  {
    title: "회계·운영",
    description: "사찰의 일상적인 운영과 봉사 업무를 정리하는 서식입니다.",
    items: [
      {
        title: "수입·지출 장부",
        description: "일상적인 수입과 지출 내역을 간단하게 기록합니다.",
        format: "Excel",
        filename: "income-expense.xlsx",
        ready: false,
      },
      {
        title: "봉사자 명단",
        description: "봉사자 정보와 참여 내용을 정리해 관리합니다.",
        format: "Excel",
        filename: "volunteers.xlsx",
        ready: false,
      },
    ],
  },
];

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M5 12h14m-5-5 5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function DownloadsPage() {
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  return (
    <main className="flex-1 bg-white text-[#252A31]">
      <section className="border-b border-[#ECE9DE] bg-[#FAF8F2]">
        <div className="mx-auto max-w-6xl px-5 py-11 md:px-8 md:py-16">
          <Link
            href="/"
            className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-[#667085] transition-colors hover:text-[#252A31] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9BA28] focus-visible:ring-offset-2 md:hidden"
            aria-label="홈으로 돌아가기"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path
                d="M19 12H5m5-5-5 5 5 5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            돌아가기
          </Link>

          <h1 className="text-[34px] font-medium tracking-[-0.045em] md:text-[48px]">
            사찰 실무서식
          </h1>
          <p className="mt-4 max-w-2xl break-keep text-[15px] leading-7 text-[#667085] md:text-base">
            사찰에서 반복되는 접수·명단·장부·출력 업무에 바로 활용할 수 있는
            도구와 서식을 정리했습니다.
          </p>
        </div>
      </section>

      <section
        className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-14"
        aria-labelledby="temple-tools-title"
      >
        <div className="max-w-2xl">
          <h2
            id="temple-tools-title"
            className="text-[24px] font-medium tracking-[-0.035em] md:text-[28px]"
          >
            웹에서 바로 만들기
          </h2>
          <p className="mt-3 break-keep text-sm leading-6 text-[#667085] md:text-[15px]">
            별도 프로그램 없이 내용을 입력하고 배치한 뒤 바로 인쇄할 수 있습니다.
          </p>
        </div>

        <div className="mt-7 grid gap-3 md:grid-cols-2 md:gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group relative flex min-h-[178px] flex-col overflow-hidden rounded-[18px] border border-[#E3E5DF] bg-[#FFFDF8] px-5 py-5 transition-colors hover:border-[#D8DA72] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9BA28] focus-visible:ring-offset-2 md:px-6 md:py-6"
            >
              <span
                className="absolute inset-y-5 left-0 w-[3px] rounded-r-full bg-[#F4F54A]"
                aria-hidden="true"
              />
              <span className="text-xs font-medium text-[#777900]">
                {tool.eyebrow}
              </span>
              <h3 className="mt-2 text-[20px] font-medium tracking-[-0.035em] md:text-[22px]">
                {tool.title}
              </h3>
              <p className="mt-3 max-w-md break-keep text-sm leading-6 text-[#667085]">
                {tool.description}
              </p>
              <span className="mt-auto flex items-center gap-1.5 pt-5 text-sm font-medium text-[#252A31]">
                바로 만들기
                <span className="transition-transform group-hover:translate-x-0.5">
                  <ArrowIcon />
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-[#ECEEEA] bg-[#FCFCFA]">
        <div className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-14">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-[24px] font-medium tracking-[-0.035em] md:text-[28px]">
                다운로드 서식
              </h2>
              <p className="mt-3 break-keep text-sm leading-6 text-[#667085] md:text-[15px]">
                Excel과 한글에서 직접 작성·수정·인쇄할 수 있는 기본 서식입니다.
              </p>
            </div>
            <p className="text-xs leading-5 text-[#8B95A1]">
              현재 서식 파일을 다시 검수하고 있습니다.
              <br className="hidden md:block" /> 검수가 끝난 파일부터 다운로드를 엽니다.
            </p>
          </div>

          <div className="mt-8 overflow-hidden border-y border-[#DDE1DA]">
            {formGroups.map((group) => {
              const isOpen = openGroup === group.title;

              return (
                <section
                  key={group.title}
                  className="border-b border-[#ECEEEA] last:border-b-0"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenGroup((current) =>
                        current === group.title ? null : group.title,
                      )
                    }
                    className="flex w-full items-center justify-between gap-5 px-1 py-5 text-left transition-colors hover:bg-[#FAFAF7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#B9BA28] md:px-2 md:py-6"
                    aria-expanded={isOpen}
                    aria-controls={`forms-${group.title}`}
                  >
                    <span className="min-w-0">
                      <span className="block text-[18px] font-medium tracking-[-0.025em] text-[#252A31]">
                        {group.title}
                      </span>
                      <span className="mt-1.5 block break-keep text-sm leading-6 text-[#7A818D]">
                        {group.description}
                      </span>
                    </span>

                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#E0E3DC] bg-white text-[#68705F] transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                        }`}
                      aria-hidden="true"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-4 w-4"
                      >
                        <path
                          d="m7 9.5 5 5 5-5"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>

                  {isOpen && (
                    <div
                      id={`forms-${group.title}`}
                      className="border-t border-[#ECEEEA] bg-white"
                    >
                      {group.items.map((item) => {
                        const href = `/downloads/yeon-temple-forms/${item.filename}`;

                        return (
                          <div
                            key={item.filename}
                            className="grid gap-3 border-b border-[#F0F1EE] px-1 py-5 last:border-b-0 md:grid-cols-[minmax(0,1fr)_110px_118px] md:items-center md:gap-5 md:px-2"
                          >
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="text-[16px] font-medium tracking-[-0.02em]">
                                  {item.title}
                                </h4>
                                <span className="rounded-md bg-[#F1F3EC] px-2 py-1 text-[11px] font-medium text-[#68705F]">
                                  {item.format}
                                </span>
                              </div>
                              <p className="mt-1.5 break-keep text-sm leading-6 text-[#7A818D]">
                                {item.description}
                              </p>
                            </div>

                            <span className="text-xs text-[#A0A7B1] md:text-right">
                              {item.filename}
                            </span>

                            {item.ready ? (
                              <a
                                href={href}
                                download
                                className="inline-flex h-10 w-fit items-center justify-center gap-1.5 rounded-lg border border-[#D9DDD5] bg-white px-3.5 text-sm font-medium text-[#252A31] transition-colors hover:border-[#CBCD61] hover:bg-[#FFFEEA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9BA28] focus-visible:ring-offset-2 md:justify-self-end"
                              >
                                다운로드
                                <ArrowIcon />
                              </a>
                            ) : (
                              <span
                                className="inline-flex h-9 w-fit items-center rounded-lg bg-[#F4F5F3] px-3 text-xs font-medium text-[#8B95A1] md:justify-self-end"
                                aria-label={`${item.title} 검수 중`}
                              >
                                검수 중
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-[#E7E9EC] bg-white">
        <div className="mx-auto max-w-6xl px-5 py-9 md:px-8 md:py-11">
          <h2 className="text-[20px] font-medium tracking-[-0.03em]">
            사용 안내
          </h2>
          <p className="mt-3 max-w-3xl break-keep text-sm leading-6 text-[#667085]">
            연에서 제공하는 서식은 사찰의 반복적인 접수·명단·기록 업무를 돕기 위한
            기본형입니다. 종무 프로그램이나 전문 회계·관리 시스템을 대체하지 않으며,
            실제 사찰의 운영 방식과 필요한 항목에 맞게 확인·수정하여 사용해 주세요.
          </p>
        </div>
      </section>
    </main>
  );
}
