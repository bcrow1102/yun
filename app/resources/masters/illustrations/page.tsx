import Link from "next/link";
import { wonhyoIllustrations } from "./data/wonhyo";

export default function IllustrationsArchivePage() {
    return (
        <main className="min-h-screen bg-[#F7F8FA] px-5 py-14 text-[#171B22] md:px-8">
            <div className="mx-auto max-w-[1000px]">
                <Link href="/resources/masters" className="text-sm text-[#777900]">← 한국의 고승</Link>
                <h1 className="mt-5 text-[34px] font-semibold tracking-[-0.04em] md:text-[46px]">삽화로 보는 일화</h1>
                <p className="mt-4 max-w-[680px] break-keep text-[15px] leading-7 text-[#667085]">고승별로 공개된 삽화 일화를 한곳에서 살펴봅니다.</p>
                <div className="mt-9 grid gap-5 md:grid-cols-2">
                    {wonhyoIllustrations.map((item) => (
                        <Link key={item.slug} href={`/resources/masters/${item.masterSlug}/illustrations`} className="rounded-[22px] border border-[#E2E5DF] bg-white p-5">
                            <p className="text-xs text-[#777900]">원효대사</p>
                            <h2 className="mt-2 break-keep text-xl font-medium">{item.title}</h2>
                            <p className="mt-3 break-keep text-sm leading-7 text-[#667085]">{item.summary}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
