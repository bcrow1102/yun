"use client";

import { useEffect, useState } from "react";

export const REGION_OPTIONS = [
    { label: "전국", value: "전국" },
    { label: "서울", value: "서울특별시" },
    { label: "부산", value: "부산광역시" },
    { label: "대구", value: "대구광역시" },
    { label: "인천", value: "인천광역시" },
    { label: "광주", value: "광주광역시" },
    { label: "대전", value: "대전광역시" },
    { label: "울산", value: "울산광역시" },
    { label: "세종", value: "세종특별자치시" },
    { label: "경기", value: "경기도" },
    { label: "강원", value: "강원특별자치도" },
    { label: "충북", value: "충청북도" },
    { label: "충남", value: "충청남도" },
    { label: "전북", value: "전북특별자치도" },
    { label: "전남", value: "전라남도" },
    { label: "경북", value: "경상북도" },
    { label: "경남", value: "경상남도" },
    { label: "제주", value: "제주특별자치도" },
] as const;

type RegionSelectorProps = {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    required?: boolean;
};

export default function RegionSelector({
    value,
    onChange,
    label = "지역",
    required = false,
}: RegionSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", closeOnEscape);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", closeOnEscape);
        };
    }, [isOpen]);

    const selectedLabel =
        REGION_OPTIONS.find((region) => region.value === value)?.label ??
        "시·도를 선택해 주세요";

    return (
        <div>
            <label className="block text-sm font-medium text-[#333D4B]">
                {label}{" "}
                {required && <span className="text-[#E5484D]">*</span>}
            </label>

            <button
                type="button"
                onClick={() => setIsOpen(true)}
                aria-expanded={isOpen}
                aria-haspopup="dialog"
                className={`mt-2 flex w-full items-center justify-between rounded-xl border bg-white px-4 py-3.5 text-left text-[15px] outline-none transition ${isOpen
                        ? "border-[#B9BA28] ring-2 ring-[#F4F54A]/25"
                        : "border-[#DDE2E8]"
                    }`}
            >
                <span className={value ? "text-[#252A31]" : "text-[#667085]"}>
                    {selectedLabel}
                </span>

                <span
                    aria-hidden="true"
                    className={`text-lg leading-none transition-transform ${isOpen ? "rotate-180" : ""
                        }`}
                >
                    ⌄
                </span>
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/25 px-4 py-6"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-label="지역 선택"
                        onClick={(event) => event.stopPropagation()}
                        className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-[24px] border border-[#DDE2E8] bg-white p-5 shadow-[0_24px_80px_rgba(0,0,0,0.18)] md:p-6"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-medium text-[#252A31]">
                                지역 선택
                            </h3>

                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="rounded-lg px-2 py-1 text-sm text-[#68707D] transition hover:bg-[#F4F5F6]"
                            >
                                닫기
                            </button>
                        </div>

                        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                            {REGION_OPTIONS.map((region, index) => {
                                const isSelected = value === region.value;
                                const isNationwide = index === 0;

                                return (
                                    <button
                                        key={region.value}
                                        type="button"
                                        onClick={() => {
                                            onChange(region.value);
                                            setIsOpen(false);
                                        }}
                                        className={`min-w-0 whitespace-nowrap rounded-xl border px-2 py-3 text-sm transition ${isNationwide
                                                ? "col-span-3 sm:col-span-4 md:col-span-6"
                                                : ""
                                            } ${isSelected
                                                ? "border-[#252A31] bg-[#252A31] text-white"
                                                : "border-[#DDE2E8] bg-white text-[#596273] hover:border-[#B9BA28] hover:bg-[#FDFDC7]"
                                            }`}
                                    >
                                        {region.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
