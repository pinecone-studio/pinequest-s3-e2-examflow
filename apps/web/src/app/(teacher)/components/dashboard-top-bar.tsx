"use client";

import { BellIcon } from "./icons-ui";
import { SearchIcon } from "./icons-actions";

type DashboardTopBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export function DashboardTopBar({ value, onChange }: DashboardTopBarProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <button
        aria-label="Цэс"
        className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#ECEAF8] bg-white text-[#605B71] shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition hover:border-[#D8D2F7]"
        type="button"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 7h10M4 12h16M4 17h12" strokeLinecap="round" />
          <path d="m16 7 4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <label className="group relative flex-1">
        <SearchIcon className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8B879A]" />
        <input
          className="h-14 w-full rounded-[22px] border border-[#ECEAF8] bg-white px-14 pr-5 text-[15px] text-[#18161F] shadow-[0_10px_30px_rgba(15,23,42,0.05)] outline-none transition placeholder:text-[#8B879A] focus:border-[#B8A8FF] focus:ring-4 focus:ring-[#EEE9FF]"
          onChange={(event) => onChange(event.target.value)}
          placeholder="Шалгалт, Анги, Сурагч хайх"
          value={value}
        />
      </label>

      <button
        aria-label="Мэдэгдэл"
        className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#ECEAF8] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition hover:border-[#D8D2F7]"
        type="button"
      >
        <BellIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
