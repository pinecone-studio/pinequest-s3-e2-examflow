import { ArrowRightIcon } from "../icons";

const studentRows = [
  {
    name: "Sarah Williams",
    subject: "Физик (сонгон)",
    score: "68",
    percent: "91%",
    status: "Шалгасан",
    submitted: "Feb 10, 3:20 PM",
  },
  {
    name: "Chris Brown",
    subject: "Physics Advanced",
    score: "45",
    percent: "60%",
    status: "Graded",
    submitted: "Feb 10, 3:30 PM",
  },
];

export function ExamResultsStudents() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[1.4fr_0.9fr_0.8fr_1fr_0.5fr_0.7fr] items-center gap-4 px-2 text-[14px] font-medium text-[#0F1216]">
        <span>Сурагч</span>
        <span>Оноо</span>
        <span>Төлөв</span>
        <span>Илгээсэн</span>
        <span>Сэжиг</span>
        <span className="text-right">Үйлдэл</span>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        <div className="space-y-1">
          {studentRows.map((row) => (
            <div
              key={row.name}
              className="grid grid-cols-[1.4fr_0.9fr_0.8fr_1fr_0.5fr_0.7fr] items-center gap-4 border-t border-[#E4E7EC] px-2 py-3 text-[14px]"
            >
              <div>
                <div className="font-medium text-[#0F1216]">{row.name}</div>
                <div className="text-[12px] text-[#52555B]">
                  {row.subject}
                </div>
              </div>
              <div className="flex items-center gap-2 text-[#0F1216]">
                <span className="font-medium">{row.score}</span>
                <span className="text-[#52555B]">/ 75</span>
                <span className="rounded-md border border-[#31AA4033] bg-[#31AA401A] px-2 py-0.5 text-[12px] font-medium text-[#31AA40]">
                  {row.percent}
                </span>
              </div>
              <span className="rounded-md border border-[#31AA4033] bg-[#31AA401A] px-2 py-0.5 text-[12px] font-medium text-[#31AA40]">
                {row.status}
              </span>
              <span className="text-[#52555B]">{row.submitted}</span>
              <span className="text-[#52555B]">-</span>
              <button
                type="button"
                className="flex items-center justify-end gap-2 text-[#0F1216]"
              >
                View
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
