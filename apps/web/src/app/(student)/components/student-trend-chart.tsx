import type { StudentTrendPoint } from "./student-portal-types";

type StudentTrendChartProps = {
  averageLabel: string;
  points: StudentTrendPoint[];
};

export function StudentTrendChart({ averageLabel, points }: StudentTrendChartProps) {
  const values = points.map((point) => point.value);
  const max = Math.max(...values, 100);
  const min = Math.min(...values, 0);
  const range = Math.max(max - min, 1);
  const path = points
    .map((point, index) => {
      const x = (index / Math.max(points.length - 1, 1)) * 100;
      const y = 100 - ((point.value - min) / range) * 100;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <article className="rounded-[28px] border border-[#D9E2F1] bg-white p-6 shadow-[0_18px_44px_rgba(15,23,42,0.07)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-[#101828]">Гүйцэтгэлийн явц</h2>
          <p className="mt-1 text-[14px] text-[#667085]">Таны дундаж онооны өөрчлөлт</p>
        </div>
        <div className="rounded-full bg-[#F4F3FF] px-3 py-1 text-[12px] font-semibold text-[#6434F8]">
          Дундаж {averageLabel}
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-[22px] border border-[#E5E7EB] bg-[linear-gradient(180deg,#F8F5FF_0%,#FFFFFF_100%)] p-4">
        <svg className="h-[260px] w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {[25, 50, 75].map((line) => (
            <line key={line} x1="0" x2="100" y1={line} y2={line} stroke="#E9D5FF" strokeDasharray="2 3" />
          ))}
          <path d={`${path} L 100 100 L 0 100 Z`} fill="rgba(100,52,248,0.10)" />
          <path d={path} fill="none" stroke="#6434F8" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="mt-3 grid grid-cols-6 gap-2 text-[12px] text-[#667085]">
          {points.map((point) => (
            <span key={point.label} className="text-center">
              {point.label}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
