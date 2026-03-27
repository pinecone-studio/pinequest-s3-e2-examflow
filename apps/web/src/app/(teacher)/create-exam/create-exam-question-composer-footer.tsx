"use client";

type CreateExamQuestionComposerFooterProps = {
  saveToBank: boolean;
  disabled: boolean;
  loading: boolean;
  bankSummary: string | null;
  errorMessage: string | null;
  onToggleSave: (value: boolean) => void;
  onOpenLibrary?: () => void;
  onCancel: () => void;
  onSubmit: () => void;
};

export function CreateExamQuestionComposerFooter({
  saveToBank,
  disabled,
  loading,
  bankSummary,
  errorMessage,
  onToggleSave,
  onOpenLibrary,
  onCancel,
  onSubmit,
}: CreateExamQuestionComposerFooterProps) {
  return (
    <>
      <div className="space-y-3 rounded-[20px] border border-[#E4E7EC] bg-[#FCFCFD] px-4 py-4">
        <label className="flex items-start gap-3 text-[14px] text-[#101828]">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border border-[#D0D5DD]"
            checked={saveToBank}
            onChange={(event) => onToggleSave(event.target.checked)}
            disabled={disabled || loading}
          />
          <span>Энэ асуултыг асуултын санд хадгалах</span>
        </label>
        {bankSummary ? <p className="text-[13px] text-[#667085]">{bankSummary}</p> : null}
        {errorMessage ? <p className="text-[13px] text-[#B42318]">{errorMessage}</p> : null}
      </div>

      <div className="flex flex-col gap-3 border-t border-[#EAECF0] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          className="inline-flex h-11 items-center justify-center rounded-xl border border-[#D0D5DD] bg-white px-4 text-[14px] font-semibold text-[#344054] shadow-[0px_1px_2px_rgba(16,24,40,0.05)]"
          onClick={onOpenLibrary}
          disabled={disabled || loading}
        >
          Сангаас нэмэх
        </button>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            className="inline-flex h-11 items-center justify-center px-2 text-[14px] font-medium text-[#667085]"
            onClick={onCancel}
            disabled={disabled || loading}
          >
            Цуцлах
          </button>
          <button
            type="button"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#163D99] px-5 text-[14px] font-semibold text-white shadow-[0px_10px_20px_rgba(22,61,153,0.18)] disabled:cursor-not-allowed disabled:opacity-60"
            onClick={onSubmit}
            disabled={disabled || loading}
          >
            {loading ? "Нэмж байна..." : "Асуулт нэмэх"}
          </button>
        </div>
      </div>
    </>
  );
}
