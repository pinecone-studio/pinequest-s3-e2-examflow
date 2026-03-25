"use client";

import { useState } from "react";
import { ChevronDownIcon, PlusIcon, SearchIcon } from "../icons";
import { ExamPreviewDialog } from "./exam-preview-dialog";
import { ExamResultsDialog } from "./exam-results-dialog";
import { MyExamCard } from "./my-exams-card";
import { exams } from "./my-exams-data";

export function MyExamsSection() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isResultsOpen, setIsResultsOpen] = useState(false);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-[24px] font-semibold text-[#0F1216]">
            Миний шалгалтууд
          </h1>
          <p className="mt-1 text-[14px] text-[#52555B]">
            Шалгалтуудаа харах, удирдах
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-md bg-[#00267F] px-4 py-2 text-[14px] font-medium text-white">
          <PlusIcon className="h-4 w-4" />
          Шинэ шалгалт
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative block flex-1">
          <span className="sr-only">Шалгалт хайх</span>
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#52555B]">
            <SearchIcon className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Шалгалт хайх..."
            className="h-9 w-full rounded-md border border-[#DFE1E5] bg-white px-9 text-[14px] text-[#0F1216] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] placeholder:text-[#52555B]"
          />
        </label>
        <button
          className={[
            "inline-flex h-9 w-full items-center justify-between gap-2",
            "rounded-md border border-[#DFE1E5] bg-white px-3 text-[14px]",
            "text-[#0F1216] shadow-[0px_1px_2px_rgba(0,0,0,0.05)]",
            "sm:w-[140px]",
          ].join(" ")}
          type="button"
        >
          Бүх төлөв
          <ChevronDownIcon className="h-4 w-4 text-[#52555B]" />
        </button>
      </div>

      <div className="space-y-4">
        {exams.map((exam) => (
          <MyExamCard
            key={exam.id}
            exam={exam}
            onView={() => {
              setIsResultsOpen(false);
              setIsPreviewOpen(true);
            }}
            onResults={() => {
              setIsPreviewOpen(false);
              setIsResultsOpen(true);
            }}
          />
        ))}
      </div>

      <ExamPreviewDialog
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
      <ExamResultsDialog
        key={isResultsOpen ? "results-open" : "results-closed"}
        open={isResultsOpen}
        onClose={() => setIsResultsOpen(false)}
      />
    </section>
  );
}
