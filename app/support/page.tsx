import type { Metadata } from "next";
import CopyAccountButton from "./CopyAccountButton";

export const metadata: Metadata = {
    title: "후원 | 연",
    description: "개인이 만들고 운영하는 한국불교 생활 플랫폼 연의 후원 안내입니다.",
};

export default function SupportPage() {
    return (
        <main className="flex-1 bg-white text-[#252A31]">
            <article className="mx-auto w-full max-w-[760px] px-5 pb-20 pt-14 sm:px-8 md:pb-28 md:pt-24">
                <header>
                    <h1 className="text-[32px] font-medium tracking-[-0.045em] text-[#191F28] md:text-[40px]">
                        후원
                    </h1>
                    <p className="mt-8 text-[17px] font-normal leading-8 tracking-[-0.02em] text-[#30352D] md:text-[18px]">
                        연은 개인이 만들고 운영하는 한국불교 생활 플랫폼입니다.
                    </p>
                </header>

                <div className="mt-5 space-y-5 text-[15px] font-normal leading-7 tracking-[-0.015em] text-[#667085] md:text-[16px] md:leading-8">
                    <p>
                        연은 한국불교 생활에 필요한 기능과 자료를 누구나 편하게 이용할 수
                        있도록 무료로 제공하고 있습니다. 보내주신 후원은 서버와 서비스 유지,
                        자료 제작·정리, 디자인과 유지보수에 보탬이 됩니다.
                    </p>
                    <p className="border-l border-[#C9CC98] pl-4 text-[#4E574E]">
                        후원 여부와 관계없이 연의 모든 기능과 자료는 동일하게 이용할 수
                        있습니다.
                    </p>
                </div>

                <section
                    className="mt-14 border-y border-[#D9DAD4] py-8 md:mt-16 md:py-10"
                    aria-labelledby="support-account-title"
                >
                    <h2
                        id="support-account-title"
                        className="text-[15px] font-medium tracking-[-0.02em] text-[#30352D]"
                    >
                        후원 계좌
                    </h2>

                    <dl className="mt-6 space-y-3.5">
                        <div className="flex items-baseline gap-5">
                            <dt className="w-16 shrink-0 text-[13px] font-normal text-[#8B95A1]">
                                은행
                            </dt>
                            <dd className="text-[15px] font-normal text-[#30352D]">
                                토스뱅크
                            </dd>
                        </div>
                        <div className="flex items-center gap-5">
                            <dt className="w-16 shrink-0 text-[13px] font-normal text-[#8B95A1]">
                                계좌번호
                            </dt>
                            <dd className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-2">
                                <span className="text-[18px] font-medium tracking-[0.01em] text-[#26342D] md:text-[20px]">
                                    1000-3576-9785
                                </span>
                                <CopyAccountButton />
                            </dd>
                        </div>
                        <div className="flex items-baseline gap-5">
                            <dt className="w-16 shrink-0 text-[13px] font-normal text-[#8B95A1]">
                                예금주
                            </dt>
                            <dd className="text-[15px] font-normal text-[#30352D]">
                                변남용
                            </dd>
                        </div>
                    </dl>
                </section>

                <p className="mt-6 text-[13px] font-normal leading-6 text-[#8B95A1]">
                    후원은 원하는 분만 자유롭게 참여하실 수 있습니다.
                </p>
            </article>
        </main>
    );
}
