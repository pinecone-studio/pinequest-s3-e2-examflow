"use client";

export function PdfImportDialogSourceExcerpt({
  sourceExcerpt,
  actionLabel,
  onAction,
}: {
  sourceExcerpt: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="space-y-2 rounded-2xl border border-[#D0D5DD] bg-[#F8FAFC] px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#6B7280]">
          Source excerpt
        </span>
        {actionLabel && onAction ? (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex h-8 items-center justify-center rounded-full border border-[#B2DDFF] bg-white px-3 text-[12px] font-medium text-[#175CD3] transition hover:bg-[#EFF8FF]"
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
      <pre className="overflow-x-auto whitespace-pre-wrap break-words text-[13px] leading-6 text-[#475467]">
        {sourceExcerpt}
      </pre>
    </div>
  );
}
