"use client";

import { useState } from "react";

export function PdfImportDialogQuestionSource({
  sourceExcerpt,
}: {
  sourceExcerpt: string;
}) {
  const [showSource, setShowSource] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#6B7280]">
          Source
        </span>
        <button
          type="button"
          onClick={() => setShowSource((current) => !current)}
          className="inline-flex h-8 items-center justify-center rounded-full border border-[#D0D5DD] bg-white px-3 text-[12px] font-medium text-[#344054] transition hover:bg-[#F9FAFB]"
        >
          {showSource ? "Нуух" : "Харах"}
        </button>
      </div>
      {showSource ? (
        <pre className="overflow-x-auto whitespace-pre-wrap rounded-2xl border border-[#D0D5DD] bg-[#F8FAFC] px-4 py-3 text-[13px] leading-6 text-[#475467]">
          {sourceExcerpt}
        </pre>
      ) : null}
    </div>
  );
}

export function PdfImportDialogQuestionActions({
  onMergeWithNext,
  onMove,
  onSplit,
}: {
  onMergeWithNext?: () => void;
  onMove?: (direction: "up" | "down") => void;
  onSplit?: () => void;
}) {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => onMove?.("up")}
        className="inline-flex h-9 items-center justify-center rounded-full border border-[#D0D5DD] bg-white px-3 text-[13px] font-medium text-[#344054] transition hover:bg-[#F9FAFB]"
      >
        Дээш
      </button>
      <button
        type="button"
        onClick={() => onMove?.("down")}
        className="inline-flex h-9 items-center justify-center rounded-full border border-[#D0D5DD] bg-white px-3 text-[13px] font-medium text-[#344054] transition hover:bg-[#F9FAFB]"
      >
        Доош
      </button>
      <button
        type="button"
        onClick={onSplit}
        className="inline-flex h-9 items-center justify-center rounded-full border border-[#B2DDFF] bg-white px-3 text-[13px] font-medium text-[#175CD3] transition hover:bg-[#EFF8FF]"
      >
        Split
      </button>
      <button
        type="button"
        onClick={onMergeWithNext}
        className="inline-flex h-9 items-center justify-center rounded-full border border-[#B2DDFF] bg-white px-3 text-[13px] font-medium text-[#175CD3] transition hover:bg-[#EFF8FF]"
      >
        Merge next
      </button>
    </div>
  );
}
