"use client";

import Link from "next/link";
import { StudentEmptyState } from "./student-empty-state";
import { StudentPageHeader } from "./student-page-header";
import { StudentSummaryCard } from "./student-summary-card";
import { useStudentHomeData } from "./use-student-home-data";

export function StudentResultsContent() {
  const { data, error } = useStudentHomeData();
  const results = data?.results;

  if (!results) {
    return <StudentEmptyState message="Үнэлгээний мэдээлэл ачаалж байна..." />;
  }

  return (
    <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-8 pb-12">
      <StudentPageHeader
        description="Авсан дүн, ахиц, дүгнэлтээ нэг дороос харна."
        title="Үнэлгээ болон Дүгнэлт"
      />

      <section className="grid gap-4 lg:grid-cols-4">
        <StudentSummaryCard accent="bg-[#EEF4FF] text-[#2466D0]" label="Дундаж" note="Нийт оролдлогын дундаж хувь" value={results.averageLabel} />
        <StudentSummaryCard accent="bg-[#ECFDF3] text-[#16A34A]" label="Шилдэг" note="Таны хамгийн өндөр үзүүлэлт" value={results.bestLabel} />
        <StudentSummaryCard accent="bg-[#FFF4E8] text-[#C46A00]" label="Дуусгасан" note="Нийт илгээсэн шалгалтын тоо" value={results.completedLabel} />
        <StudentSummaryCard accent="bg-[#F4F3FF] text-[#6434F8]" label="Онцлох хичээл" note="Хамгийн тогтвортой өндөр үзүүлэлт" value={results.strongestSubject} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_360px]">
        <article className="rounded-[28px] border border-[#E5E7EB] bg-white p-6 shadow-[0_18px_44px_rgba(15,23,42,0.07)]">
          <h2 className="text-[22px] font-semibold tracking-[-0.03em] text-[#101828]">Сүүлийн үр дүнгүүд</h2>
          <div className="mt-5 space-y-3">
            {results.items.length ? results.items.map((item) => (
              <Link
                key={item.id}
                className="flex flex-col gap-3 rounded-[20px] border border-[#EAECF0] px-4 py-4 transition hover:border-[#D0D5DD] hover:bg-[#FCFCFD] sm:flex-row sm:items-center sm:justify-between"
                href={item.href}
              >
                <div>
                  <p className="text-[16px] font-semibold text-[#101828]">{item.title}</p>
                  <p className="mt-1 text-[14px] text-[#667085]">{item.subject} · {item.dateLabel}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="rounded-full bg-[#F4F3FF] px-3 py-1 text-[12px] font-semibold text-[#6434F8]">{item.statusLabel}</span>
                  <div className="text-right">
                    <p className="text-[14px] font-semibold text-[#101828]">{item.percentLabel}</p>
                    <p className="text-[13px] text-[#667085]">{item.scoreLabel}</p>
                  </div>
                </div>
              </Link>
            )) : <StudentEmptyState message="Одоогоор харуулах дүн алга." />}
          </div>
        </article>

        <article className="rounded-[28px] border border-[#E5E7EB] bg-white p-6 shadow-[0_18px_44px_rgba(15,23,42,0.07)]">
          <h2 className="text-[22px] font-semibold tracking-[-0.03em] text-[#101828]">Дүгнэлт</h2>
          <div className="mt-5 space-y-3">
            {results.insights.map((insight) => (
              <div key={insight} className="rounded-[18px] bg-[#F8FAFC] px-4 py-4 text-[14px] leading-6 text-[#475467]">
                {insight}
              </div>
            ))}
          </div>
          {error ? <p className="mt-4 text-[13px] text-[#B42318]">Үр дүнгийн мэдээллийг шинэчлэх үед алдаа гарлаа.</p> : null}
        </article>
      </section>
    </div>
  );
}
