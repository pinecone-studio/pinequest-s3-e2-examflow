import { ChevronDownIcon, SaveIcon } from "./create-exam-icons";

export function CreateExamHeader() {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-[24px] font-semibold text-[#0F1216]">
          Шалгалт үүсгэх
        </h1>
        <p className="mt-1 text-[14px] text-[#52555B]">
          Асуулт нэмэх замаар шалгалтаа бүрдүүлнэ
        </p>
      </div>
      <button
        className="inline-flex items-center gap-2 rounded-md bg-[#00267F] px-3 py-2 text-[14px] font-medium text-white/90 shadow-sm"
        type="button"
      >
        <SaveIcon className="h-4 w-4" />
        Хадгалах
        <ChevronDownIcon className="h-4 w-4 opacity-70" />
      </button>
    </div>
  );
}
