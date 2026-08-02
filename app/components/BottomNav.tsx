"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    id: "home",
    label: "홈",
    href: "/",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955a1.126 1.126 0 0 1 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    id: "hire",
    label: "구인",
    href: "/jobs",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0" />
      </svg>
    ),
  },
  {
    id: "seek",
    label: "구직",
    href: "/job-seekers",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
  },
  {
    id: "events",
    label: "행사",
    href: "/events",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
    ),
  },
  {
    id: "experience",
    label: "체험",
    href: "/temples/stay",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.8}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 10c3 0 6-1.2 9-5 3 3.8 6 5 9 5M5 10h14M6 13h12M7 13v6M12 13v6M17 13v6M5 19h14"
        />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  const isCurrentItem = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/temples/stay") return pathname.startsWith("/temples");
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="bottom-nav-safe fixed inset-x-0 bottom-0 z-40 border-t border-[#F2F4F6] bg-white/95 backdrop-blur" aria-label="하단 메뉴"
    >
      <div className="mx-auto flex max-w-lg items-center px-2 pt-1.5">
        {navItems.map((item) => {
          const isActive = isCurrentItem(item.href);
          return (
            <Link
              key={item.id}
              id={`nav-${item.id}`}
              href={item.href}
              className={`flex min-h-[58px] flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1 transition-all duration-200 ${isActive
                ? "text-[#6B7684]"
                : "text-[#B0B8C1] hover:text-[#8B95A1]"
                }`}
              aria-current={isActive ? "page" : undefined}
            >
              <span
                className={`transition-transform duration-200 ${isActive ? "scale-110" : "scale-100"
                  }`}
              >
                {item.icon}
              </span>
              <span
                className={`text-[11px] font-medium transition-colors ${isActive ? "text-[#6B7684]" : "text-[#B0B8C1]"
                  }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="mt-0.5 h-1 w-1 rounded-full bg-[#FEE500]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
