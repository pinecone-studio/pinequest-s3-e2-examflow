import type { StudentCalendarDay } from "./student-portal-types";

type StudentDashboardCalendarProps = {
  days: StudentCalendarDay[];
  monthLabel: string;
};

const markerTone = {
  deadline: "bg-[#FB923C]",
  exam: "bg-[#E879F9]",
  result: "bg-[#60A5FA]",
};

export function StudentDashboardCalendar({
  days,
  monthLabel,
}: StudentDashboardCalendarProps) {
  return (
    <article className="rounded-[28px] border border-[#E5E7EB] bg-white p-5 shadow-[0_18px_44px_rgba(15,23,42,0.07)]">
      <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-[#101828]">{monthLabel}</h2>
      <div className="mt-5 grid grid-cols-7 gap-2 text-center text-[12px] font-medium text-[#667085]">
        {["Ня", "Да", "Мя", "Лх", "Пү", "Ба", "Бя"].map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-7 gap-2">
        {days.map((day) => (
          <div
            key={day.key}
            className={`flex min-h-[54px] flex-col items-center justify-center rounded-[18px] ${
              day.isToday ? "bg-[#6434F8] text-white" : day.inMonth ? "bg-[#F8FAFC]" : "bg-transparent text-[#98A2B3]"
            }`}
          >
            <span className="text-[13px] font-semibold">{day.dayNumber}</span>
            <div className="mt-1 flex gap-1">
              {day.markers.slice(0, 3).map((marker) => (
                <span key={`${day.key}-${marker}`} className={`h-1.5 w-1.5 rounded-full ${markerTone[marker]}`} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-4 text-[12px] text-[#667085]">
        <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#E879F9]" />Шалгалт</span>
        <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#FB923C]" />Дуусах өдөр</span>
        <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#60A5FA]" />Дүн</span>
      </div>
    </article>
  );
}
