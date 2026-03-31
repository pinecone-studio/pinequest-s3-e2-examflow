"use client";

import Link from "next/link";
import { useState } from "react";
import { DashboardTopBar } from "../components/dashboard-top-bar";
import { CalendarIcon, ChartIcon, ChevronDownIcon, DetailsIcon, EyeIcon, GridIcon, PlusIcon, UsersIcon } from "../components/icons";
import { TEACHER_COMMON_TEXT } from "../components/teacher-ui";
import { CreateClassDialog } from "./components/create-class-dialog";
import { ClassesStatePanel } from "./components/classes-state-panel";
import { useClassesList } from "./use-classes-list";

const filterButtonClassName = "flex h-10 items-center gap-4 rounded-full border border-[#ECEAF8] bg-white px-4 text-[14px] font-normal text-[#0F1216] shadow-[0_10px_24px_rgba(15,23,42,0.08)]";
const detailButtonClassName = "inline-flex h-8 items-center justify-center gap-2 rounded-[8px] px-3 text-[12px] font-semibold transition";
const getLeadingNumber = (value: string) => value.match(/\d+/)?.[0] ?? "-";

export function ClassesPageContent() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { classes, search, setSearch, loading, error, hasData, hasServerData, refetch } =
    useClassesList();

  if (loading && !hasServerData) {
    return (
      <ClassesStatePanel
        title="Ангиуд ачаалж байна"
        description="Системээс ангийн мэдээллийг татаж байна."
      />
    );
  }

  if (error && !hasServerData) {
    return (
      <ClassesStatePanel
        tone="error"
        title="Ангиудыг уншиж чадсангүй"
        description={TEACHER_COMMON_TEXT.genericError}
        actionLabel={TEACHER_COMMON_TEXT.retry}
        onAction={() => {
          void refetch();
        }}
      />
    );
  }

  return (
    <section className="mx-auto flex w-full max-w-[1184px] flex-col gap-6 px-6 py-6 lg:px-8 lg:py-8">
      <CreateClassDialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} />
      <DashboardTopBar value={search} onChange={setSearch} />
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <button type="button" className={`${filterButtonClassName} min-w-[180px]`}><span>Бүх Хичээл</span><ChevronDownIcon className="h-[18px] w-[18px]" /></button>
          <button type="button" className={`${filterButtonClassName} min-w-[156px]`}><span>Бүх Анги</span><ChevronDownIcon className="h-[18px] w-[18px]" /></button>
          <div className="flex h-10 overflow-hidden rounded-full border border-[#ECEAF8] bg-white shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
            {[{ key: "grid", icon: GridIcon, label: "Карт" }, { key: "list", icon: DetailsIcon, label: "Жагсаалт" }].map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                type="button"
                aria-pressed={view === key}
                aria-label={label}
                onClick={() => setView(key as "grid" | "list")}
                className={`flex h-10 w-12 items-center justify-center transition ${
                  view === key ? "bg-[#EEEDFC] text-[#6434F8]" : "bg-[#FAFAFA] text-[#71717B]"
                }`}
              >
                <Icon className="h-5 w-5" />
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-[5px] bg-[linear-gradient(90deg,#6434F8_0%,#7C4DFF_100%)] px-5 text-[14px] font-semibold text-white shadow-[0_10px_24px_rgba(100,52,248,0.24)]"
          onClick={() => setCreateDialogOpen(true)}
        >
          <PlusIcon className="h-4 w-4" />
          Анги үүсгэх
        </button>
      </div>
      {!hasData ? (
        <ClassesStatePanel
          title={hasServerData ? "Хайлтад тохирох анги олдсонгүй" : "Анги бүртгэгдээгүй байна"}
          description={
            hasServerData
              ? "Хайлтын үгийг өөрчлөөд дахин оролдоно уу."
              : "Анхны ангиа үүсгээд шалгалт оноож эхлээрэй."
          }
        />
      ) : (
        <>
          {/* TODO: render average score and latest exam activity once ClassesList exposes those fields. */}
          {view === "grid" ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {classes.map((item) => {
                const [subject, gradeLabel = ""] = item.meta.split(" · ");
                return (
                  <article
                    key={item.id}
                    className="flex min-h-[234px] flex-col gap-4 rounded-[6px] border border-[#E4E4E7] bg-white p-4 shadow-[0_3.2px_4.8px_rgba(0,0,0,0.09)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="inline-flex h-[22px] items-center rounded-[8px] border border-[#E4E4E7] px-2 text-[11px] font-semibold text-[#231D17]">
                        {subject}
                      </span>
                      <span className="text-[11px] text-[#71717B]">{gradeLabel}</span>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <h2 className="text-[18px] font-bold leading-[22px] text-[#211C37]">{item.name}</h2>
                        <div className="grid gap-3 text-[10px] text-[#1C1D1D] sm:grid-cols-2">
                          <span className="flex items-center gap-1"><UsersIcon className="h-3 w-3" />{item.studentCountLabel}</span>
                          <span className="flex items-center gap-1"><ChartIcon className="h-3 w-3" />Дундаж дүн: -</span>
                          <span className="flex items-center gap-1 sm:col-span-2"><CalendarIcon className="h-3 w-3" />{item.completedLabel}</span>
                        </div>
                      </div>
                      <div className="border-t border-[#E4E4E4] pt-4 text-[10px] text-[#71717B]">
                        Сүүлд авсан шалгалт: мэдээлэл алга
                      </div>
                    </div>
                    <Link
                      href={item.href}
                      className="mt-auto inline-flex h-6 items-center justify-center gap-1 rounded-[4px] bg-[#6434F8] px-3 text-[10px] font-semibold text-white"
                    >
                      <EyeIcon className="h-3 w-3" />
                      Дэлгэрэнгүй харах
                    </Link>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="overflow-hidden rounded-[8px] border border-[#E4E4E7] bg-white">
              <div className="overflow-x-auto">
                <table className="min-w-[980px] w-full border-collapse">
                  <thead className="bg-[rgba(244,244,245,0.5)] text-left text-[13px] font-semibold text-[#231D17]">
                    <tr>
                      {["Ангийн нэр", "Хичээл", "Сурагчид", "Дундаж дүн", "Шалгалтууд", "Сүүлд хийсэн үйлдэл", "Үйлдэл"].map((label) => <th key={label} className="px-6 py-4">{label}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {classes.map((item) => {
                      const [subject] = item.meta.split(" · ");
                      return (
                        <tr key={item.id} className="border-t border-[#E4E4E7] text-[14px] text-[#231D17]">
                          <td className="px-6 py-5 text-[15px] font-semibold">{item.name}</td>
                          <td className="px-6 py-5">{subject}</td>
                          <td className="px-6 py-5">{getLeadingNumber(item.studentCountLabel)}</td>
                          <td className="px-6 py-5 font-semibold text-[#1447E6]">-</td>
                          <td className="px-6 py-5">{getLeadingNumber(item.completedLabel)}</td>
                          <td className="px-6 py-5 text-[11px] text-[#71717B]">Сүүлд авсан шалгалт: мэдээлэл алга</td>
                          <td className="px-6 py-4 text-right">
                            <Link
                              href={item.href}
                              className={`${detailButtonClassName} border border-transparent text-[#231D17] hover:bg-[#F8F6FF]`}
                            >
                              <EyeIcon className="h-[14px] w-[14px]" />
                              Дэлгэрэнгүй
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
