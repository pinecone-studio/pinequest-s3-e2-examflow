"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ExamMode,
  useCreateExamOptionsQuery,
  useMyExamsSectionQueryQuery,
} from "@/graphql/generated";
import { DashboardTopBar } from "../components/dashboard-top-bar";
import { ChevronDownIcon, NotificationIcon } from "../components/icons";
import { CreateExamPlannerSkeleton } from "./create-exam-loading-skeletons";
import { CreateExamPlannerCalendar } from "./create-exam-planner-calendar";
import {
  buildMonthOptions,
  buildPlannerCalendar,
  formatMonthLabel,
  getDefaultMonthValue,
  toScheduledDateTimeValue,
} from "./create-exam-planner-utils";

export function CreateExamPlanner() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedDateKey, setSelectedDateKey] = useState("");
  const [visibleMonth, setVisibleMonth] = useState(getDefaultMonthValue());
  const classesQuery = useCreateExamOptionsQuery({ fetchPolicy: "cache-first", ssr: false });
  const examsQuery = useMyExamsSectionQueryQuery({ fetchPolicy: "cache-and-network", ssr: false });
  const classes = classesQuery.data?.classes ?? [];
  const effectiveSelectedClassId = selectedClassId || classes[0]?.id || "";
  const isLoading =
    (classesQuery.loading && !classesQuery.data?.classes?.length) ||
    (examsQuery.loading && !examsQuery.data?.exams?.length);

  const filteredExams = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return (examsQuery.data?.exams ?? []).filter((exam) => {
      if (exam.mode === ExamMode.Practice) {
        return false;
      }
      if (effectiveSelectedClassId && exam.class.id !== effectiveSelectedClassId) {
        return false;
      }
      if (!keyword) {
        return true;
      }
      const haystack = `${exam.title} ${exam.class.name} ${exam.class.subject}`.toLowerCase();
      return haystack.includes(keyword);
    });
  }, [effectiveSelectedClassId, examsQuery.data?.exams, search]);

  const monthOptions = useMemo(() => buildMonthOptions(new Date()), []);
  const calendarDays = useMemo(
    () => buildPlannerCalendar(visibleMonth, filteredExams),
    [filteredExams, visibleMonth],
  );
  const selectedClass = classes.find((item) => item.id === effectiveSelectedClassId) ?? null;
  const selectedDateLabel = selectedDateKey
    ? new Date(`${selectedDateKey}T09:00`).toLocaleDateString("mn-MN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Өдөр сонгоогүй";

  const handleContinue = () => {
    if (!effectiveSelectedClassId || !selectedDateKey) {
      return;
    }

    const params = new URLSearchParams({
      classId: effectiveSelectedClassId,
      mode: ExamMode.Scheduled,
      scheduledFor: toScheduledDateTimeValue(selectedDateKey),
    });

    router.push(`/create-exam?${params.toString()}`);
  };

  return (
    <div className="flex h-full w-full flex-col bg-[#FAFAFA]">
      <DashboardTopBar onChange={setSearch} value={search} />

      {isLoading ? (
        <CreateExamPlannerSkeleton />
      ) : (
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-8 pb-8 pt-3">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <label className="relative">
              <select
                className="h-12 appearance-none rounded-full border border-[#EAECF0] bg-white px-5 pr-11 text-[15px] font-semibold text-[#101828] shadow-[0_10px_25px_rgba(16,24,40,0.08)]"
                onChange={(event) => setSelectedClassId(event.target.value)}
                value={effectiveSelectedClassId}
              >
                {classes.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#667085]" />
            </label>

            <label className="relative">
              <select
                className="h-12 appearance-none rounded-full border border-[#EAECF0] bg-white px-5 pr-11 text-[15px] font-semibold text-[#101828] shadow-[0_10px_25px_rgba(16,24,40,0.08)]"
                onChange={(event) => setVisibleMonth(event.target.value)}
                value={visibleMonth}
              >
                {monthOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#667085]" />
            </label>
          </div>

          <div className="flex items-center gap-3 self-start xl:self-auto">
            <div className="rounded-[18px] border border-[#E4E7EC] bg-white px-4 py-3 shadow-[0_12px_30px_rgba(16,24,40,0.06)]">
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#667085]">
                Сонгосон өдөр
              </p>
              <p className="mt-1 text-[15px] font-semibold text-[#101828]">{selectedDateLabel}</p>
            </div>
            <button
              className="inline-flex h-12 items-center justify-center rounded-[14px] bg-[#6434F8] px-6 text-[15px] font-semibold text-white shadow-[0_16px_36px_rgba(100,52,248,0.28)] transition hover:bg-[#5326E0] disabled:cursor-not-allowed disabled:bg-[#B6A8F7] disabled:shadow-none"
              disabled={!effectiveSelectedClassId || !selectedDateKey}
              onClick={handleContinue}
              type="button"
            >
              Шалгалт авах
            </button>
          </div>
        </div>

        <div className="rounded-[24px] border border-[#EAECF0] bg-[linear-gradient(180deg,#FFFFFF_0%,#FCFCFD_100%)] p-6 shadow-[0_18px_40px_rgba(16,24,40,0.06)]">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-[30px] font-semibold tracking-[-0.03em] text-[#101828]">
                {selectedClass?.name ?? "Ангийн"} шалгалтын календарь
              </h1>
              <p className="mt-2 max-w-[680px] text-[15px] leading-7 text-[#667085]">
                Календарь дээрээс өдөр сонгоод, дараагийн алхам дээр шалгалтын дэлгэрэнгүй
                тохиргоогоо үргэлжлүүлнэ.
              </p>
            </div>
            <div className="inline-flex h-11 items-center gap-3 rounded-[14px] border border-[#EAECF0] bg-white px-4 text-[14px] text-[#667085]">
              <NotificationIcon className="h-5 w-5 text-[#667085]" />
              {formatMonthLabel(visibleMonth)} дотор {filteredExams.length} шалгалт
            </div>
          </div>

          <CreateExamPlannerCalendar
            days={calendarDays}
            onSelect={setSelectedDateKey}
            selectedDateKey={selectedDateKey}
          />
        </div>
      </div>
      )}
    </div>
  );
}
