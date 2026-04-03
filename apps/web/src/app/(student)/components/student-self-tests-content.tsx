"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { StudentEmptyState } from "./student-empty-state";
import { StudentPageHeader } from "./student-page-header";
import { StudentPracticeCard } from "./student-practice-card";
import { useStudentHomeData } from "./use-student-home-data";

export function StudentSelfTestsContent() {
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search.trim().toLowerCase());
  const { data, error, loading } = useStudentHomeData();

  const view = useMemo(() => {
    if (!data) {
      return { easy: [], hard: [], medium: [] };
    }
    return {
      easy: data.practice.easy.filter((exam) => !deferredSearch || exam.searchText.includes(deferredSearch)),
      hard: data.practice.hard.filter((exam) => !deferredSearch || exam.searchText.includes(deferredSearch)),
      medium: data.practice.medium.filter((exam) => !deferredSearch || exam.searchText.includes(deferredSearch)),
    };
  }, [data, deferredSearch]);

  return (
    <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-8 pb-12">
      <StudentPageHeader
        description="Хэзээ ч орж болох чөлөөт сорилоор XP цуглуулж, шат ахиарай."
        searchPlaceholder="Сорил хайх..."
        searchValue={search}
        title="Өөрийгөө сорьё"
        onSearchChange={setSearch}
      />

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-[30px] bg-[linear-gradient(135deg,#6434F8_0%,#9B7CFF_100%)] p-6 text-white shadow-[0_24px_60px_rgba(100,52,248,0.22)]">
          <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-white/70">Ахицын сорил</p>
          <h1 className="mt-3 text-[34px] font-semibold tracking-[-0.03em]">Шат ахиулдаг чөлөөт сорил</h1>
          <p className="mt-3 max-w-[620px] text-[15px] leading-7 text-white/85">
            Хялбар, дунд, хэцүү шаттай сорилуудаас сонгож хүссэн үедээ ажиллана. Оролдлого бүр XP болж хуримтлагдана.
          </p>
        </article>
        <article className="rounded-[30px] border border-[#E5E7EB] bg-white p-6 shadow-[0_18px_44px_rgba(15,23,42,0.07)]">
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#6434F8]">Нийт XP</p>
          <p className="mt-3 text-[42px] font-semibold tracking-[-0.04em] text-[#101828]">{data?.practice.totalXpLabel ?? "0 XP"}</p>
          <p className="mt-3 text-[14px] leading-6 text-[#667085]">Товлосон шалгалтаас тусдаа, зөвхөн чөлөөт сорилын ахиц энд цугларна.</p>
        </article>
      </section>

      {([
        { key: "easy", label: "Хялбар түвшин", items: view.easy },
        { key: "medium", label: "Дунд түвшин", items: view.medium },
        { key: "hard", label: "Хэцүү түвшин", items: view.hard },
      ] as const).map((section) => (
        <section key={section.key} className="space-y-4">
          <div>
            <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-[#101828]">{section.label}</h2>
            <p className="mt-1 text-[14px] text-[#667085]">Чөлөөт сорилын {section.label.toLowerCase()} багц</p>
          </div>

          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-[280px] animate-pulse rounded-[26px] bg-white" />)}
            </div>
          ) : section.items.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {section.items.map((exam) => <StudentPracticeCard key={exam.id} exam={exam} />)}
            </div>
          ) : (
            <StudentEmptyState message={`${section.label} хараахан нийтлэгдээгүй байна.`} />
          )}
        </section>
      ))}
      {error ? <p className="text-[14px] text-[#B42318]">Өөрийгөө сорьё өгөгдөл уншихад алдаа гарлаа.</p> : null}
    </div>
  );
}
