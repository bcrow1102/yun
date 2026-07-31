import Link from "next/link";
import { notFound } from "next/navigation";

const foodPrograms = {
    "1": {
        title: "사찰음식 기본 체험",
        place: "서울 사찰음식문화체험관",
        location: "서울 종로구",
        schedule: "매주 토요일",
        price: "30,000원",
    },
    "2": {
        title: "계절 나물과 사찰 밥상",
        place: "봉녕사",
        location: "경기 수원",
        schedule: "월 2회",
        price: "50,000원",
    },
    "3": {
        title: "발우공양 체험",
        place: "통도사",
        location: "경남 양산",
        schedule: "주말 운영",
        price: "20,000원",
    },
    "4": {
        title: "사찰 장 담그기",
        place: "전통사찰문화원",
        location: "전북 완주",
        schedule: "계절 프로그램",
        price: "60,000원",
    },
    "5": {
        title: "연잎밥 만들기",
        place: "연화사",
        location: "충남 공주",
        schedule: "매월 둘째 주",
        price: "35,000원",
    },
    "6": {
        title: "외국인을 위한 사찰음식",
        place: "한국사찰음식문화관",
        location: "서울",
        schedule: "예약 운영",
        price: "문의",
    },
};

type FoodProgramId = keyof typeof foodPrograms;

const inputStyle =
    "mt-2 w-full rounded-xl border border-[#E3E6EB] bg-white px-4 py-3 text-[15px] text-[#20242C] outline-none transition placeholder:text-[#A0A6B0] focus:border-[#9B8B77] focus:ring-2 focus:ring-[#E8DDD1]";

const labelStyle = "block text-sm font-medium text-[#343A46]";

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

export default async function TempleFoodApplyPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const program = foodPrograms[id as FoodProgramId];

    if (!program) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-[#F7F8FA] text-[#171B22]">
            <header className="border-b border-[#ECEEF1] bg-white">
                <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 md:h-[72px] md:px-8">
                    <Link href="/" className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FEE500] md:h-10 md:w-10">
                            <LotusIcon />
                        </span>
                        <span className="text-xl font-semibold">연</span>
                    </Link>

                    <Link
                        href={`/temples/food/${id}`}
                        className="rounded-xl border border-[#E3E8EF] px-4 py-2.5 text-sm font-medium text-[#4E5968]"
                    >
                        상세 페이지로
                    </Link>
                </div>
            </header>

            <section className="mx-auto max-w-3xl px-4 py-10 md:px-8 md:py-14">
                <div className="mb-8">
                    <p className="text-sm font-medium text-[#786B5A]">
                        사찰음식 프로그램 신청
                    </p>

                    <h1 className="mt-2 text-[30px] font-semibold tracking-[-0.04em] md:text-[38px]">
                        체험에 참여할 정보를 입력해 주세요
                    </h1>

                    <p className="mt-4 text-[15px] leading-7 text-[#667085]">
                        참가 확인과 재료 준비를 위해 신청자 정보를 정확하게 입력해
                        주세요.
                    </p>
                </div>

                <section className="mb-6 rounded-[22px] border border-[#E4D9CD] bg-[#F6F1EA] p-5 md:p-6">
                    <p className="text-sm font-medium text-[#786B5A]">신청 프로그램</p>

                    <h2 className="mt-2 text-xl font-semibold">{program.title}</h2>

                    <dl className="mt-4 grid gap-3 text-sm text-[#655C52] sm:grid-cols-2">
                        <div>
                            <dt className="text-xs text-[#8B7F73]">운영 장소</dt>
                            <dd className="mt-1">{program.place}</dd>
                        </div>

                        <div>
                            <dt className="text-xs text-[#8B7F73]">지역</dt>
                            <dd className="mt-1">{program.location}</dd>
                        </div>

                        <div>
                            <dt className="text-xs text-[#8B7F73]">운영 일정</dt>
                            <dd className="mt-1">{program.schedule}</dd>
                        </div>

                        <div>
                            <dt className="text-xs text-[#8B7F73]">참가비</dt>
                            <dd className="mt-1">{program.price}</dd>
                        </div>
                    </dl>
                </section>

                <form className="rounded-[24px] border border-[#E3E6EB] bg-white p-5 shadow-[0_10px_30px_rgba(25,31,40,0.05)] md:p-8">
                    <div className="grid gap-6">
                        <fieldset>
                            <legend className={labelStyle}>
                                신청자 구분 <span className="text-[#C74848]">*</span>
                            </legend>

                            <div className="mt-3 flex flex-wrap gap-4">
                                {["개인", "가족", "단체"].map((type) => (
                                    <label
                                        key={type}
                                        className="flex cursor-pointer items-center gap-2 text-sm text-[#4E5968]"
                                    >
                                        <input
                                            type="radio"
                                            name="applicantType"
                                            value={type}
                                            required
                                            className="h-4 w-4 accent-[#9B8B77]"
                                        />
                                        {type}
                                    </label>
                                ))}
                            </div>
                        </fieldset>

                        <div className="grid gap-6 sm:grid-cols-2">
                            <label className={labelStyle}>
                                신청자 이름 <span className="text-[#C74848]">*</span>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="이름을 입력해 주세요"
                                    className={inputStyle}
                                />
                            </label>

                            <label className={labelStyle}>
                                연락처 <span className="text-[#C74848]">*</span>
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    inputMode="tel"
                                    placeholder="010-0000-0000"
                                    className={inputStyle}
                                />
                            </label>
                        </div>

                        <label className={labelStyle}>
                            이메일
                            <input
                                type="email"
                                name="email"
                                placeholder="선택 입력"
                                className={inputStyle}
                            />
                        </label>

                        <div className="grid gap-6 sm:grid-cols-2">
                            <label className={labelStyle}>
                                참여 희망일 <span className="text-[#C74848]">*</span>
                                <input
                                    type="date"
                                    name="participationDate"
                                    required
                                    className={inputStyle}
                                />
                            </label>

                            <label className={labelStyle}>
                                참여 인원 <span className="text-[#C74848]">*</span>
                                <input
                                    type="number"
                                    name="participants"
                                    min="1"
                                    max="20"
                                    defaultValue="1"
                                    required
                                    className={inputStyle}
                                />
                            </label>
                        </div>

                        <label className={labelStyle}>
                            음식 알레르기 및 식이 특이사항
                            <textarea
                                name="allergy"
                                rows={4}
                                placeholder="알레르기가 없다면 비워두셔도 됩니다"
                                className={`${inputStyle} resize-none`}
                            />
                        </label>

                        <label className={labelStyle}>
                            요청 사항
                            <textarea
                                name="request"
                                rows={4}
                                placeholder="참여와 관련해 미리 알려주실 내용이 있다면 적어주세요"
                                className={`${inputStyle} resize-none`}
                            />
                        </label>

                        <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-[#F7F8FA] p-4 text-sm leading-6 text-[#4E5968]">
                            <input
                                type="checkbox"
                                name="privacyAgreement"
                                required
                                className="mt-1 h-4 w-4 shrink-0 accent-[#9B8B77]"
                            />

                            <span>
                                참가 신청 확인과 안내를 위한 개인정보 수집 및 이용에
                                동의합니다. <span className="text-[#C74848]">(필수)</span>
                            </span>
                        </label>

                        <p className="text-sm leading-6 text-[#8B95A1]">
                            현재는 신청 화면을 구성하는 단계입니다. 입력 내용 저장과 신청
                            완료 안내는 데이터베이스 연결 후 작동합니다.
                        </p>

                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <Link
                                href={`/temples/food/${id}`}
                                className="inline-flex items-center justify-center rounded-xl border border-[#E3E6EB] px-5 py-3.5 text-sm font-medium text-[#4E5968]"
                            >
                                취소
                            </Link>

                            <button
                                type="submit"
                                className="inline-flex items-center justify-center rounded-xl bg-[#FEE500] px-6 py-3.5 text-sm font-medium text-[#171B22] transition hover:bg-[#F5DC00]"
                            >
                                참가 신청하기
                            </button>
                        </div>
                    </div>
                </form>
            </section>
        </main>
    );
}