"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { StudentEmptyState } from "./student-empty-state";
import { StudentPageHeader } from "./student-page-header";
import { StudentScheduledExamCard } from "./student-scheduled-exam-card";
import { useLiveExamEvents } from "./use-live-exam-events";
import { useStudentHomeData } from "./use-student-home-data";

export function StudentMyExamsContent() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"active" | "upcoming" | "completed">("active");
  const deferredSearch = useDeferredValue(search.trim().toLowerCase());
  const { data, error, loading, refetch } = useStudentHomeData();

  useLiveExamEvents({
    classIds: data?.classIds ?? [],
    enabled: Boolean(data),
    onEvent: () => {
      void refetch();
    },
  });

  const filtered = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.myExams[tab].filter((exam) => !deferredSearch || exam.searchText.includes(deferredSearch));
  }, [data, deferredSearch, tab]);

  return (
    <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-8 pb-12">
      <StudentPageHeader
        description="Өөрийн товлосон шалгалтуудыг харах, удирдах"
        searchPlaceholder="Шалгалт хайх..."
        searchValue={search}
        title="Миний шалгалтууд"
        onSearchChange={setSearch}
      />

      <section className="flex flex-wrap gap-3">
        {[
          { key: "active", label: "Явагдаж буй", count: data?.myExams.active.length ?? 0 },
          { key: "upcoming", label: "Удахгүй", count: data?.myExams.upcoming.length ?? 0 },
          { key: "completed", label: "Дууссан", count: data?.myExams.completed.length ?? 0 },
        ].map((item) => (
          <button
            key={item.key}
            className={`inline-flex h-11 items-center gap-2 rounded-full px-5 text-[14px] font-semibold transition ${
              tab === item.key
                ? "bg-[#6434F8] text-white shadow-[0_12px_24px_rgba(100,52,248,0.24)]"
                : "border border-[#EAECF0] bg-white text-[#667085]"
            }`}
            onClick={() => setTab(item.key as typeof tab)}
            type="button"
          >
            {item.label}
            <span className={`rounded-full px-2 py-0.5 text-[12px] ${tab === item.key ? "bg-white/20 text-white" : "bg-[#F2F4F7] text-[#667085]"}`}>
              {item.count}
            </span>
          </button>
        ))}
      </section>

      {error ? (
        <p className="text-[14px] text-[#B42318]">Шалгалтын мэдээлэл ачаалахад алдаа гарлаа. Дахин оролдоно уу.</p>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-[264px] animate-pulse rounded-[24px] bg-white" />
          ))
        ) : filtered.length ? (
          filtered.map((exam) => <StudentScheduledExamCard key={exam.id} exam={exam} />)
        ) : (
          <div className="md:col-span-2 xl:col-span-3">
            <StudentEmptyState message="Энэ төлөвт харагдах товлосон шалгалт алга." />
          </div>
        )}
      </section>
    </div>
  );
}
