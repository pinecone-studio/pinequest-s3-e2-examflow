import Link from "next/link";
import { CreateExamQuickActionIcon, CreateQuestionBankQuickActionIcon, GradeQuickActionIcon, TakeExamQuickActionIcon } from "./dashboard-quick-action-icons";
import type { DashboardQuickActionView, DashboardRecentResultItem, DashboardUpcomingExamItem } from "./dashboard/dashboard-types";
import { ArrowRightIcon, CalendarIcon, ClipboardIcon } from "./icons";

type DashboardMainGridProps = { actions: DashboardQuickActionView[]; pendingReviewCount: number; recentResults: DashboardRecentResultItem[]; searchActive: boolean; upcomingExams: DashboardUpcomingExamItem[] };

const actionIcons = {
  bank: CreateQuestionBankQuickActionIcon,
  classes: TakeExamQuickActionIcon,
  create: CreateExamQuickActionIcon,
  review: GradeQuickActionIcon,
} as const;
const actionWidths: Record<string, string> = {
  "Шалгалт үүсгэх": "lg:w-[175px]",
  "Асуултын сан үүсгэх": "lg:w-[210px]",
  "Шалгалт авах": "lg:w-[161px]",
  "Дүн тавих": "lg:w-[136px]",
};
const cardClassName =
  "rounded-[28px] border border-[#F0EEFA] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]";
const scoreRanges = [[0, 19], [20, 59], [60, 69], [70, 79], [80, 100]] as const;

const buildCalendar = (values: string[]) => {
  const focus = values[0] ? new Date(values[0]) : new Date();
  const month = new Date(focus.getFullYear(), focus.getMonth(), 1);
  const total = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const offset = month.getDay();
  return {
    active: new Set(values.map((value) => new Date(value).getDate())),
    days: Array.from({ length: offset + total }, (_, index) => (index < offset ? 0 : index - offset + 1)),
    label: month.toLocaleString("mn-MN", { month: "long", year: "numeric" }),
    selected: focus.getDate(),
    today: new Date().getMonth() === month.getMonth() ? new Date().getDate() : 0,
  };
};

export function DashboardMainGrid({ actions, pendingReviewCount, recentResults, searchActive, upcomingExams }: DashboardMainGridProps) {
  const calendar = buildCalendar(upcomingExams.map(({ scheduledAt }) => scheduledAt));
  const scoreData = scoreRanges.map(([start, end]) => ({
    label: `${start}-${end}%`,
    value: recentResults.filter(({ averageScorePercent }) => averageScorePercent >= start && averageScorePercent <= end).length,
  }));
  const scoreMax = Math.max(...scoreData.map(({ value }) => value), 1);
  // TODO: Replace this proxy list when backend exposes dedicated pending-review exam items.
  const reviewItems = recentResults.slice(0, 3);

  return (
    <>
      <div className="flex flex-wrap gap-5 lg:max-w-[742px] lg:flex-nowrap">
        {actions.map((action) => {
          const Icon = actionIcons[action.icon];
          return (
            <Link key={action.label} className={`inline-flex h-10 w-full items-center justify-start gap-[10px] rounded-[5px] border px-5 py-[10px] text-[14px] font-semibold leading-5 [font-family:Inter] transition sm:w-auto ${actionWidths[action.label] ?? "lg:w-auto"} ${
              action.primary
                ? "border-[#6434F8] bg-[#6434F8] text-white hover:bg-[#5527E8]"
                : "border-[#DFE1E5] bg-[#FAFAFA] text-black shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_rgba(0,0,0,0.06),0px_0px_0px_4px_#F5F5F5] hover:bg-[#F7F7F7]"
            }`} href={action.href}>
              <Icon className="shrink-0" />
              <span className={`inline-flex items-center font-semibold text-[14px] leading-5 [font-family:Inter] ${
                action.primary ? "text-[#FFF]" : "text-[#000]"
              }`}>{action.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)]">
        <section className={cardClassName}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[14px] text-[#8B879A]">Суралцагчийн онооны хуваарилалт</p>
              <h2 className="mt-2 text-[22px] font-semibold tracking-[-0.04em] text-[#18161F]">Онооны задрал</h2>
            </div>
            <div className="rounded-full bg-[#F6F2FF] px-3 py-1 text-[12px] font-medium text-[#6434F8]">{recentResults.length} үр дүн</div>
          </div>
          {recentResults.length ? (
            <div className="mt-8 flex h-[210px] items-end gap-3">
              {scoreData.map((item) => (
                <div key={item.label} className="flex flex-1 flex-col items-center gap-3">
                  <span className="text-[12px] font-medium text-[#8B879A]">{item.value}</span>
                  <div className="flex h-[150px] w-full items-end">
                    <div
                      className="w-full rounded-[14px] bg-[linear-gradient(180deg,#CDBDFF_0%,#6434F8_100%)]"
                      style={{ height: `${item.value ? Math.max((item.value / scoreMax) * 100, 22) : 8}%` }}
                    />
                  </div>
                  <span className="text-center text-[11px] font-medium text-[#5F5A6D]">{item.label}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-10 rounded-[20px] bg-[#FAF8FF] px-4 py-8 text-center text-[14px] text-[#8B879A]">{searchActive ? "Хайлтад тохирох онооны мэдээлэл алга." : "Одоогоор онооны хуваарилалт хараахан бүрдээгүй байна."}</p>
          )}
        </section>

        <section className={cardClassName}>
          <div className="flex items-start justify-between gap-4">
            <h2 className="max-w-[280px] text-[22px] font-semibold tracking-[-0.04em] text-[#18161F]">Үнэлгээ хүлээгдэж байгаа шалгалтууд</h2>
            <div className="flex h-10 min-w-10 items-center justify-center rounded-full bg-[#F6F2FF] px-3 text-[14px] font-semibold text-[#6434F8]">{pendingReviewCount}</div>
          </div>
          <div className="mt-6 space-y-3">
            {reviewItems.length ? (
              reviewItems.map((item, index) => (
                <Link key={item.id} className={`block rounded-[20px] border px-4 py-4 transition hover:border-[#D8D2F7] hover:bg-[#FCFBFF] ${
                  index === 2 ? "border-[#F2E6B5] bg-[#FFF9EA]" : "border-[#F0EEFA] bg-[#FCFBFF]"
                }`} href={item.href}>
                  <p className="text-[16px] font-semibold text-[#18161F]">{item.title}</p>
                  <p className="mt-1 text-[13px] text-[#8B879A]">{item.averageScoreLabel}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-[12px] font-medium text-[#6434F8]">
                    <span className="rounded-full bg-[#F6F2FF] px-3 py-1">{item.progressPercent}% гүйцэтгэл</span>
                    <span className="rounded-full bg-[#F6F2FF] px-3 py-1">{item.passCount + item.failCount} оролдлого</span>
                  </div>
                </Link>
              ))
            ) : (
              <p className="rounded-[20px] bg-[#FAF8FF] px-4 py-8 text-center text-[14px] text-[#8B879A]">{searchActive ? "Хайлтад тохирох шалгалт олдсонгүй." : "Үнэлгээ хүлээж буй шалгалтын жагсаалт одоогоор байхгүй байна."}</p>
            )}
          </div>
          <Link className="mt-4 inline-flex items-center gap-2 text-[14px] font-semibold text-[#6434F8]" href="/evaluation">Дэлгэрэнгүй харах<ArrowRightIcon className="h-4 w-4" /></Link>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className={cardClassName}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[14px] text-[#8B879A]">Төлөвлөгдсөн шалгалтын тойм</p>
              <h2 className="mt-2 text-[22px] font-semibold tracking-[-0.04em] text-[#18161F]">Удахгүй болох шалгалтууд</h2>
            </div>
            <span className="text-[40px] font-semibold leading-none tracking-[-0.05em] text-[#18161F]">{upcomingExams.length}</span>
          </div>
          <div className="mt-6 space-y-4">
            {upcomingExams.length ? upcomingExams.slice(0, 3).map((exam) => (
              <Link key={exam.id} className="flex items-start gap-4 border-t border-[#F3F1FA] pt-4 first:border-t-0 first:pt-0" href={exam.href}>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] bg-[#F6F2FF] text-[#6434F8]">
                  <ClipboardIcon className="h-[18px] w-[18px]" />
                </div>
                <div>
                  <p className="text-[16px] font-semibold text-[#18161F]">{exam.title}</p>
                  <p className="mt-1 text-[14px] text-[#5F5A6D]">{exam.questionCountLabel}</p>
                  <p className="mt-1 text-[14px] font-medium text-[#6434F8]">{exam.scheduledLabel}</p>
                </div>
              </Link>
            )) : (
              <p className="rounded-[20px] bg-[#FAF8FF] px-4 py-8 text-center text-[14px] text-[#8B879A]">{searchActive ? "Хайлтад тохирох товлосон шалгалт олдсонгүй." : "Одоогоор удахгүй болох шалгалт алга."}</p>
            )}
          </div>
        </section>

        <section className={cardClassName}>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-[#F6F2FF] text-[#6434F8]">
              <CalendarIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[14px] text-[#8B879A]">Хуанли</p>
              <h2 className="text-[20px] font-semibold text-[#18161F]">{calendar.label}</h2>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-7 gap-2 text-center text-[11px] font-medium uppercase tracking-[0.08em] text-[#AAA5B5]">{["Ня", "Да", "Мя", "Лх", "Пү", "Ба", "Бя"].map((day) => <span key={day}>{day}</span>)}</div>
          <div className="mt-4 grid grid-cols-7 gap-2">
            {calendar.days.map((day, index) => {
              const isSelected = day === calendar.selected && calendar.active.has(day);
              const isActive = day > 0 && calendar.active.has(day);
              return (
                <div key={`${day}-${index}`} className={`flex h-10 items-center justify-center rounded-[14px] text-[14px] font-medium ${
                  day === 0 ? "text-transparent" : isSelected ? "bg-[#6434F8] text-white" : isActive ? "bg-[#F3EEFF] text-[#6434F8]" : day === calendar.today ? "border border-[#D8D2F7] text-[#18161F]" : "text-[#5F5A6D]"
                }`}>{day || "."}</div>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
