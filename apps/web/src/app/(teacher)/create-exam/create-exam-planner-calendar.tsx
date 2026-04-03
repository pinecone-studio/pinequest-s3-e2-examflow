"use client";

import type { ExamStatus } from "@/graphql/generated";
import type { PlannerDay, PlannerEvent } from "./create-exam-planner-utils";

type CreateExamPlannerCalendarProps = {
  days: PlannerDay[];
  onSelect: (dateKey: string) => void;
  selectedDateKey: string;
};

const toneByStatus: Record<ExamStatus, string> = {
  CLOSED: "border-[#FDE68A] bg-[#FFFBEB] text-[#A16207]",
  DRAFT: "border-[#E9D5FF] bg-[#FAF5FF] text-[#9333EA]",
  PUBLISHED: "border-[#CFF7D3] bg-[#F0FDF4] text-[#16A34A]",
};

function CalendarEvent({ event }: { event: PlannerEvent }) {
  return (
    <div
      className={`rounded-[10px] border px-2 py-1.5 text-left shadow-[0_1px_2px_rgba(16,24,40,0.04)] ${toneByStatus[event.status]}`}
    >
      <p className="line-clamp-2 text-[12px] font-semibold leading-4">{event.title}</p>
      <p className="mt-1 text-[12px] leading-4 opacity-90">{event.timeLabel}</p>
    </div>
  );
}

export function CreateExamPlannerCalendar({
  days,
  onSelect,
  selectedDateKey,
}: CreateExamPlannerCalendarProps) {
  return (
    <section className="rounded-[22px] border border-[#E4E7EC] bg-white p-4 shadow-[0_20px_50px_rgba(15,23,42,0.05)]">
      <div className="max-h-[680px] overflow-auto pr-1">
      <div className="sticky top-0 z-10 grid grid-cols-7 gap-3 rounded-[14px] border border-[#EAECF0] bg-[#FCFCFD] px-4 py-4 text-center">
        {["Ня", "Да", "Мя", "Лх", "Пү", "Ба", "Бя"].map((label) => (
          <span key={label} className="text-[13px] font-semibold text-[#667085]">
            {label}
          </span>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-7 gap-3">
        {days.map((day) => {
          const isSelected = selectedDateKey === day.key;

          return (
            <button
              key={day.key}
              className={`min-h-[132px] rounded-[18px] border p-3 text-left transition ${
                isSelected
                  ? "border-[#6434F8] bg-[#F7F4FF] shadow-[0_0_0_3px_rgba(100,52,248,0.08)]"
                  : day.inMonth
                    ? "border-[#EAECF0] bg-white hover:border-[#C7B9FF] hover:bg-[#FBFAFF]"
                    : "border-[#F2F4F7] bg-[#FCFCFD] text-[#98A2B3]"
              }`}
              onClick={() => onSelect(day.key)}
              type="button"
            >
              <span
                className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-[15px] font-semibold ${
                  isSelected ? "bg-[#6434F8] text-white" : "text-[#101828]"
                }`}
              >
                {day.dayOfMonth}
              </span>
              <div className="mt-3 flex flex-col gap-2">
                {day.events.slice(0, 2).map((event) => (
                  <CalendarEvent key={event.id} event={event} />
                ))}
                {day.events.length > 2 ? (
                  <span className="px-1 text-[12px] font-medium text-[#667085]">
                    +{day.events.length - 2} бусад
                  </span>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
      </div>
    </section>
  );
}
