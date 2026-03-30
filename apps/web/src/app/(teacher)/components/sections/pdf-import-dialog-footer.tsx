import type { ImportJobView } from "./pdf-import-dialog-utils";

export function PdfImportDialogFooter({
  examEditHref,
  jobView,
  isCreating,
  isApproving,
  classOptions,
  reviewQuestionCount,
  selectedClassId,
  onClose,
  onClassChange,
  onImport,
  onApprove,
}: {
  examEditHref: string | null;
  jobView: ImportJobView | null;
  isCreating: boolean;
  isApproving: boolean;
  classOptions: Array<{ id: string; name: string }>;
  reviewQuestionCount: number;
  selectedClassId: string;
  onClose: () => void;
  onClassChange: (value: string) => void;
  onImport: () => void;
  onApprove: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 border-t border-[#EAECF0] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[13px] text-[#667085]">
        {jobView
          ? "Баталсны дараа импортолсон асуултууд шинэ question bank болон draft exam үүсгэнэ."
          : "Эхний алхамд import job үүсгээд draft асуултуудыг гаргаж ирнэ."}
      </p>
      <div className="flex flex-wrap items-center justify-end gap-3">
        {jobView && !jobView.questionBank ? (
          <label className="relative inline-flex h-11 min-w-[220px] items-center rounded-full border border-[#D0D5DD] bg-white px-4 text-[14px] text-[#344054]">
            <select
              value={selectedClassId}
              onChange={(event) => onClassChange(event.target.value)}
              className="h-full w-full cursor-pointer appearance-none bg-transparent pr-6 outline-none"
            >
              <option value="" disabled>
                Анги сонгох
              </option>
              {classOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <button
          type="button"
          className="inline-flex h-11 items-center justify-center rounded-full border border-[#D0D5DD] bg-white px-5 text-[14px] font-medium text-[#344054] transition hover:bg-[#F9FAFB]"
          onClick={onClose}
        >
          Хаах
        </button>
        {!jobView ? (
          <button
            type="button"
            className="inline-flex h-11 items-center justify-center rounded-full bg-[#16A34A] px-5 text-[14px] font-medium text-white transition hover:bg-[#15803D] disabled:cursor-not-allowed disabled:opacity-60"
            onClick={onImport}
            disabled={isCreating}
          >
            {isCreating ? "Бэлтгэж байна..." : "PDF боловсруулж эхлэх"}
          </button>
        ) : !jobView.questionBank ? (
          <button
            type="button"
            className="inline-flex h-11 items-center justify-center rounded-full bg-[#175CD3] px-5 text-[14px] font-medium text-white transition hover:bg-[#155EEF] disabled:cursor-not-allowed disabled:opacity-60"
            onClick={onApprove}
            disabled={
              isApproving ||
              !selectedClassId ||
              classOptions.length === 0 ||
              reviewQuestionCount === 0
            }
          >
            {isApproving ? "Хадгалж байна..." : "Асуултын санд хадгалах"}
          </button>
        ) : (
          <>
            <a
              href={`/question-bank/${jobView.questionBank.id}`}
              className="inline-flex h-11 items-center justify-center rounded-full border border-[#D0D5DD] bg-white px-5 text-[14px] font-medium text-[#344054] transition hover:bg-[#F9FAFB]"
            >
              Асуултын сан руу очих
            </a>
            {examEditHref ? (
              <a
                href={examEditHref}
                className="inline-flex h-11 items-center justify-center rounded-full bg-[#175CD3] px-5 text-[14px] font-medium text-white transition hover:bg-[#155EEF]"
              >
                Шалгалт засах руу очих
              </a>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
