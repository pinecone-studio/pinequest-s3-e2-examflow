"use client";

import Link from "next/link";
import { useState } from "react";
import { DashboardTopBar } from "../components/dashboard-top-bar";
import {
  AddCircleIcon,
  ArrowDownIcon,
  CalendarIcon,
  GridViewIcon,
  ListIcon,
  PeopleIcon,
  SchoolIcon,
  ViewIcon,
} from "../components/icons-more";
import { TEACHER_COMMON_TEXT } from "../components/teacher-ui";
import { CreateClassDialog } from "./components/create-class-dialog";
import { ClassesStatePanel } from "./components/classes-state-panel";
import { useClassesList } from "./use-classes-list";

const filterButtonClassName =
  "flex h-10 items-center gap-[16px] rounded-[20px] border border-[#ECEAF8] bg-white px-3 py-2 text-[14px] font-normal leading-[20px] text-[#0F1216] shadow-[0_4px_8px_-2px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.06)]";
const detailButtonClassName = "inline-flex h-8 items-center justify-center gap-[4px] rounded-[8px] px-3 text-[12px] font-semibold transition";
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
    <section className="relative mx-auto flex h-[900px] w-full max-w-[1184px] flex-col overflow-y-auto bg-[#FAFAFA]">
      <CreateClassDialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} />
      <DashboardTopBar value={search} onChange={setSearch} />
      <div className="flex flex-1 flex-col gap-[36px] px-8 pt-[26px]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex h-10 w-[372px] items-center gap-[20px]">
            <button type="button" className={`${filterButtonClassName} w-[135px] justify-center`}><span className="w-[77px] whitespace-nowrap text-center">Бүх Хичээл</span><ArrowDownIcon className="h-[18px] w-[18px] text-[#0F1216]" /></button>
            <button type="button" className={`${filterButtonClassName} w-[117px] justify-center`}><span className="w-[59px] whitespace-nowrap text-center">Бүх Анги</span><ArrowDownIcon className="h-[18px] w-[18px] text-[#0F1216]" /></button>
            <div className="flex h-10 w-20 overflow-hidden rounded-full bg-white shadow-[0_4px_8px_-2px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.06)]">
              {[{ key: "grid", icon: GridViewIcon, label: "Карт" }, { key: "list", icon: ListIcon, label: "Жагсаалт" }].map(({ key, icon: Icon, label }, index) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={view === key}
                  aria-label={label}
                  onClick={() => setView(key as "grid" | "list")}
                  className={`flex h-10 w-10 items-center justify-center transition ${
                    view === key ? "bg-[#EEEDFC] text-[#6434F8]" : "bg-[#FAFAFA] text-[#71717B]"
                  } ${index === 0 ? "rounded-l-[8.4px]" : "rounded-r-[8.4px]"}`}
                >
                  <Icon className="h-5 w-5" />
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-[148px] items-center justify-center gap-2 rounded-[5px] bg-[#6434F8] px-5 text-[14px] font-semibold text-white shadow-[0_4px_8px_-2px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.06)]"
            onClick={() => setCreateDialogOpen(true)}
          >
            <AddCircleIcon className="h-4 w-4 text-white" />
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
                          <span className="flex items-center gap-1"><PeopleIcon className="h-3 w-3 text-[#1C1D1D]" />{item.studentCountLabel}</span>
                          <span className="flex items-center gap-1"><SchoolIcon className="h-3 w-3 text-[#1C1D1D]" />Дундаж дүн: -</span>
                          <span className="flex items-center gap-1 sm:col-span-2"><CalendarIcon className="h-3 w-3 text-[#1C1D1D]" />{item.completedLabel}</span>
                        </div>
                      </div>
                      <div className="border-t border-[#E4E4E4] pt-4 text-[10px] text-[#71717B]">
                        Сүүлд авсан шалгалт: мэдээлэл алга
                      </div>
                    </div>
                      <Link
                        href={item.href}
                        className="mt-auto inline-flex h-6 items-center justify-center gap-[4px] rounded-[4px] bg-[#6434F8] px-3 text-[10px] font-semibold text-white"
                      >
                        <ViewIcon className="h-3 w-3 translate-y-[1.5px] text-white" />
                        Дэлгэрэнгүй харах
                      </Link>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="h-[180.4px] w-[1120px] overflow-hidden rounded-[8px] border border-[#E4E4E7] bg-white [font-family:Inter]">
              <table className="w-[1120px] table-fixed border-collapse">
                <thead className="bg-[rgba(244,244,245,0.5)] text-left font-semibold text-[#231D17]">
                  <tr className="h-[52px]">
                    <th className="w-[216px] px-4 py-4 text-[12.8px] leading-[20px]">Ангийн нэр</th>
                    <th className="w-[160px] px-4 py-4 text-[12.7px] leading-[20px]">Хичээл</th>
                    <th className="w-[126px] px-4 py-4 text-[12.7px] leading-[20px]">Сурагчид</th>
                    <th className="w-[100px] px-4 py-4 pr-0 text-[13px] leading-[20px]">Дундаж дүн</th>
                    <th className="w-[100px] px-4 py-4 text-[12.6px] leading-[20px]">Шалгалтууд</th>
                    <th className="w-[274px] px-4 py-4 text-[12.7px] leading-[20px]">Сүүлд хийсэн үйлдэл</th>
                    <th className="w-[142px] px-4 py-4 pr-[26px] text-right text-[13.1px] leading-[20px]">Үйлдэл</th>
                  </tr>
                </thead>
                <tbody>
                    {classes.map((item) => {
                      const [subject] = item.meta.split(" · ");
                      return (
                        <tr key={item.id} className="h-[65px] border-t border-[#E4E4E7] text-[#231D17]">
                          <td className="w-[214px] px-4 py-5 text-[15px] font-semibold leading-[24px]">{item.name}</td>
                          <td className="w-[160px] px-4 py-5 text-[13px] leading-[20px]">{subject}</td>
                          <td className="w-[126px] px-4 py-5 pl-[18px] text-[12.4px] leading-[20px]">{getLeadingNumber(item.studentCountLabel)}</td>
                          <td className="w-[100px] px-4 py-5 pr-0 text-[13.2px] font-semibold leading-[20px] text-[#1447E6]">-</td>
                          <td className="w-[100px] px-4 py-5 pl-[18px] text-[14px] leading-[20px]">{getLeadingNumber(item.completedLabel)}</td>
                          <td className="w-[276px] px-4 py-5 pl-[18px] text-[10.9px] leading-[16px] text-[#71717B]">Сүүлд авсан шалгалт: мэдээлэл алга</td>
                          <td className="w-[142px] px-4 py-4 pr-[26px] text-right">
                            <Link
                              href={item.href}
                              className="inline-flex h-8 w-[142px] items-center justify-center gap-[4px] rounded-[8.4px] text-[12px] font-semibold leading-[20px] text-[#231D17] hover:bg-[#F8F6FF]"
                            >
                              <ViewIcon className="h-[14px] w-[14px] translate-y-[1.5px] text-[#0F1216]" />
                              <span className="w-[76px] text-center">Дэлгэрэнгүй</span>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
              </table>
            </div>
          )}
        </>
        )}
      </div>
    </section>
  );
}
