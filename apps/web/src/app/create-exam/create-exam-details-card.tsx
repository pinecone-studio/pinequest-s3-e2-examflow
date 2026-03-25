export function CreateExamDetailsCard() {
  return (
    <div className="rounded-xl border border-[#DFE1E5] bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4">
        <input
          className="w-full rounded-md border border-[#DFE1E5] bg-white px-3 py-2 text-[14px] text-[#0F1216] shadow-sm placeholder:text-[#52555B]"
          placeholder="Шалгалтын нэр..."
        />
        <div className="flex flex-wrap items-center gap-3 text-[14px] text-[#52555B]">
          <span className="font-medium">Хугацаа</span>
          <input
            className="w-20 rounded-md border border-[#DFE1E5] bg-white px-3 py-2 text-[14px] text-[#0F1216] shadow-sm"
            defaultValue="60"
          />
          <span>минут</span>
        </div>
        <textarea
          className="min-h-[64px] w-full rounded-md border border-[#DFE1E5] bg-white px-3 py-2 text-[14px] text-[#0F1216] shadow-sm placeholder:text-[#52555B]"
          placeholder="Сурагчдад өгөх заавар (заавал биш)..."
        />
      </div>
    </div>
  );
}
