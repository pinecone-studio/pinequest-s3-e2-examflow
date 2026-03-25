import { CloseIcon, PlusIcon } from "../components/icons";
import { ChevronDownIcon, UploadIcon } from "./create-exam-icons";

export function CreateExamQuestionCard() {
  return (
    <div>
      <div className="text-[14px] font-medium text-[#52555B]">
        Асуултууд (0)
      </div>
      <div className="mt-3 rounded-xl border border-[#00267F] bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4">
          <div>
            <div className="text-[12px] font-medium uppercase tracking-[0.3px] text-[#52555B]">
              Асуулт
            </div>
            <textarea
              className="mt-2 min-h-[64px] w-full rounded-md border border-[#DFE1E5] bg-white px-3 py-2 text-[14px] text-[#0F1216] shadow-sm placeholder:text-[#52555B]"
              placeholder="Асуултаа оруулна уу..."
            />
          </div>

          <div>
            <div className="text-[12px] font-medium uppercase tracking-[0.3px] text-[#52555B]">
              Медиа (заавал биш)
            </div>
            <div className="mt-2 grid gap-3 md:grid-cols-2">
              <button
                type="button"
                className="flex h-[76px] flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-[#DFE1E5] text-[12px] text-[#52555B]"
              >
                <UploadIcon className="h-5 w-5" />
                Зураг оруулах
              </button>
              <button
                type="button"
                className="flex h-[76px] flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-[#DFE1E5] text-[12px] text-[#52555B]"
              >
                <UploadIcon className="h-5 w-5" />
                Видео оруулах
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {["Сонгох (олон сонголттой)", "Хичээл", "Дунд түвшин"].map(
              (label) => (
                <button
                  key={label}
                  type="button"
                  className="inline-flex items-center gap-2 rounded-md border border-[#DFE1E5] bg-white px-3 py-2 text-[14px] text-[#0F1216] shadow-sm"
                >
                  {label}
                  <ChevronDownIcon className="h-4 w-4 text-[#52555B]" />
                </button>
              )
            )}
          </div>

          <div className="border-t border-[#DFE1E5] pt-4">
            <div className="text-[12px] font-medium uppercase tracking-[0.3px] text-[#52555B]">
              Хариултууд (зөвийг сонгоно)
            </div>
            <div className="mt-3 flex flex-col gap-2">
              {(["A", "B", "C", "D"] as const).map((letter) => (
                <div
                  key={letter}
                  className="flex items-center gap-2 text-[12px] text-[#52555B]"
                >
                  <span className="h-4 w-4 rounded-full border border-[#DFE1E5]" />
                  <span className="w-4">{letter}.</span>
                  <input
                    className="flex-1 rounded-md border border-[#DFE1E5] bg-white px-3 py-2 text-[14px] text-[#0F1216] shadow-sm placeholder:text-[#52555B]"
                    placeholder={`Сонголт ${letter}`}
                  />
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-md text-[#52555B]"
                  >
                    <CloseIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="mt-1 inline-flex w-fit items-center gap-2 rounded-md px-2 py-1 text-[12px] font-medium text-[#52555B]"
              >
                <PlusIcon className="h-4 w-4" />
                Сонголт нэмэх
              </button>
            </div>
          </div>

          <div className="border-t border-[#DFE1E5] pt-4">
            <label className="flex items-center gap-2 text-[14px] text-[#0F1216]">
              <span className="h-4 w-4 rounded border border-[#DFE1E5] bg-white shadow-sm" />
              Энэ асуултыг асуултын санд хадгалах
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-md border border-[#DFE1E5] bg-[#FAFAFA] px-3 py-2 text-[14px] font-medium text-[#0F1216] shadow-sm"
            >
              <UploadIcon className="h-4 w-4" />
              Сангаас нэмэх
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-md px-4 py-2 text-[14px] font-medium text-[#0F1216]"
              >
                Цуцлах
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-md bg-[#00267F] px-4 py-2 text-[14px] font-medium text-white/90 shadow-sm"
              >
                <PlusIcon className="h-4 w-4" />
                Асуулт нэмэх
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
