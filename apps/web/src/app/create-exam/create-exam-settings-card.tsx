import { CheckCircleIcon } from "./create-exam-icons";

export function CreateExamSettingsCard() {
  return (
    <div className="rounded-xl border border-[#DFE1E5] bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-[14px] font-medium text-[#0F1216]">
        <CheckCircleIcon className="h-4 w-4 text-[#52555B]" />
        Шалгалтын тохиргоо
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#DFE1E5] px-3 py-3">
          <span className="mt-0.5 h-4 w-4 rounded border border-[#DFE1E5] bg-white shadow-sm" />
          <span>
            <span className="block text-[14px] font-medium text-[#0F1216]">
              Асуултыг холих
            </span>
            <span className="block text-[12px] text-[#52555B]">
              Асуултын дарааллыг санамсаргүй болгоно
            </span>
          </span>
        </label>
        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#DFE1E5] px-3 py-3">
          <span className="mt-0.5 h-4 w-4 rounded border border-[#DFE1E5] bg-white shadow-sm" />
          <span>
            <span className="block text-[14px] font-medium text-[#0F1216]">
              Хариултыг холих
            </span>
            <span className="block text-[12px] text-[#52555B]">
              Сонголтуудын дарааллыг санамсаргүй болгоно
            </span>
          </span>
        </label>
      </div>
    </div>
  );
}
