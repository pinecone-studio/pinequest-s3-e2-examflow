"use client";

import { NotificationIcon } from "@/app/(teacher)/components/icons-ui";
import { SearchIcon } from "./student-home-icons";

type StudentPageHeaderProps = {
  description: string;
  searchPlaceholder?: string;
  searchValue?: string;
  title: string;
  onSearchChange?: (value: string) => void;
};

export function StudentPageHeader({
  description,
  searchPlaceholder = "Шалгалт хайх...",
  searchValue = "",
  title,
  onSearchChange,
}: StudentPageHeaderProps) {
  return (
    <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-[#101828] sm:text-[38px]">
          {title}
        </h1>
        <p className="mt-2 text-[15px] leading-6 text-[#667085]">{description}</p>
      </div>

      <div className="flex items-center gap-3">
        {onSearchChange ? (
          <label className="flex h-12 w-full min-w-[280px] items-center gap-3 rounded-full border border-[#E5E7EB] bg-white px-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            <SearchIcon className="h-4 w-4 text-[#98A2B3]" />
            <input
              className="w-full bg-transparent text-[14px] text-[#101828] outline-none placeholder:text-[#98A2B3]"
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={searchPlaceholder}
              type="text"
              value={searchValue}
            />
          </label>
        ) : null}

        <button
          className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#667085] shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
          type="button"
        >
          <NotificationIcon className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
