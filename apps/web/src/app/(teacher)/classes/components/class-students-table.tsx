import { ClockIcon } from "../../components/icons";
import { ClassesStatusBadge } from "./classes-status-badge";

type StudentRow = {
  id: string;
  name: string;
  email: string;
  status: string;
  lastActive: string;
  averageScore: string;
  integrityDetail: string;
  integrityLabel: string;
  integrityTone: "success" | "warning" | "muted" | "danger";
  tone: "success" | "warning" | "muted" | "danger";
};

type ClassStudentsTableProps = {
  rows: StudentRow[];
};

export function ClassStudentsTable({ rows }: ClassStudentsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-[14px]">
        <thead className="border-b border-[#E4E7EC] text-[#0F1216]">
          <tr>
            <th className="py-3 pr-4 font-medium">Нэр</th>
            <th className="px-4 py-3 font-medium">Имэйл</th>
            <th className="px-4 py-3 font-medium">Төлөв</th>
            <th className="px-4 py-3 font-medium">Сүүлд идэвхтэй байсан</th>
            <th className="px-4 py-3 font-medium">Дундаж оноо</th>
            <th className="py-3 pl-4 text-right font-medium">Сэрэмжлүүлэг</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-[#E4E7EC] last:border-b-0">
              <td className="py-4 pr-4 font-medium text-[#0F1216]">{row.name}</td>
              <td className="px-4 py-4 text-[#52555B]">{row.email}</td>
              <td className="px-4 py-4">
                <ClassesStatusBadge label={row.status} tone={row.tone} />
              </td>
              <td className="px-4 py-4 text-[#52555B]">
                <span className="inline-flex items-center gap-2">
                  <ClockIcon className="h-4 w-4" />
                  {row.lastActive}
                </span>
              </td>
              <td className="px-4 py-4 text-[#0F1216]">{row.averageScore}</td>
              <td className="py-4 pl-4">
                <div className="space-y-1 text-right">
                  <div className="flex justify-end">
                    <ClassesStatusBadge
                      label={row.integrityLabel}
                      tone={row.integrityTone}
                    />
                  </div>
                  <p className="text-[12px] text-[#667085]">{row.integrityDetail}</p>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
