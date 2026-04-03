"use client";

import { StudentDashboardCalendar } from "./student-dashboard-calendar";
import { StudentEmptyState } from "./student-empty-state";
import { StudentPageHeader } from "./student-page-header";
import { StudentScheduledExamCard } from "./student-scheduled-exam-card";
import { StudentSummaryCard } from "./student-summary-card";
import { StudentTrendChart } from "./student-trend-chart";
import { useLiveExamEvents } from "./use-live-exam-events";
import { useStudentHomeData } from "./use-student-home-data";

export function StudentHomeContent() {
  const { data, error, loading, refetch } = useStudentHomeData();

  useLiveExamEvents({
    classIds: data?.classIds ?? [],
    enabled: Boolean(data),
    onEvent: () => {
      void refetch();
    },
  });

  const dashboard = data?.dashboard;

  return (
    <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-8 pb-12">
      <StudentPageHeader
        description="Таны сургалтын явцын тойм"
        title={`Тавтай морил, ${dashboard?.studentName ?? "сурагч"}!`}
      />

      <section className="grid gap-4 lg:grid-cols-3">
        {(dashboard?.stats ?? []).map((stat) => (
          <StudentSummaryCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_320px]">
        {dashboard ? <StudentTrendChart averageLabel={dashboard.averageLabel} points={dashboard.trend} /> : null}
        {dashboard ? <StudentDashboardCalendar days={dashboard.calendarDays} monthLabel={dashboard.calendarMonthLabel} /> : null}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-[#101828]">Танд ойр байгаа шалгалтууд</h2>
          <p className="mt-1 text-[14px] text-[#667085]">Идэвхтэй болон удахгүй эхлэх товлосон шалгалтууд</p>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-[260px] animate-pulse rounded-[24px] bg-white" />
            ))}
          </div>
        ) : dashboard?.upcoming.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {dashboard.upcoming.map((exam) => (
              <StudentScheduledExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        ) : (
          <StudentEmptyState message="Одоогоор харагдах товлосон шалгалт алга." />
        )}
        {error ? <p className="text-[13px] text-[#B42318]">Dashboard өгөгдөл шинэчлэх үед алдаа гарлаа.</p> : null}
      </section>
    </div>
  );
}
