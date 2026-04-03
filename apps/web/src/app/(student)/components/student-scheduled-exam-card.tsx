import Link from "next/link";
import type { StudentScheduledExamCard } from "./student-portal-types";

type StudentScheduledExamCardProps = {
  exam: StudentScheduledExamCard;
};

const statusTone = {
  active: "bg-[#FFF4E8] text-[#C46A00]",
  completed: "bg-[#ECFDF3] text-[#16A34A]",
  upcoming: "bg-[#EFF6FF] text-[#2563EB]",
};

const actionTone = {
  active: "bg-[#FDBA74] text-white hover:bg-[#FB923C]",
  completed: "bg-[#6434F8] text-white hover:bg-[#5727E7]",
  upcoming: "bg-[#F5F7FB] text-[#98A2B3]",
};

export function StudentScheduledExamCard({ exam }: StudentScheduledExamCardProps) {
  const buttonClass = `inline-flex h-11 w-full items-center justify-center rounded-full text-[14px] font-semibold transition ${actionTone[exam.status]}`;
  const showSubject = exam.subject.trim() && exam.subject.trim() !== "Ерөнхий";
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className={`rounded-full px-3 py-1 text-[12px] font-semibold ${statusTone[exam.status]}`}>
          {exam.statusLabel}
        </span>
        {exam.scoreLabel ? (
          <span className="text-[16px] font-semibold text-[#101828]">{exam.scoreLabel}</span>
        ) : null}
      </div>
      <h3 className="mt-6 line-clamp-2 text-[28px] font-semibold tracking-[-0.03em] text-[#101828]">
        {exam.title}
      </h3>
      {showSubject ? (
        <p className="mt-3 text-[14px] font-medium text-[#344054]">{exam.subject}</p>
      ) : null}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-[14px] text-[#667085]">
        <span>{exam.questionCountLabel}</span>
        <span>{exam.durationLabel}</span>
      </div>
      <p className="mt-3 text-[13px] text-[#667085]">{exam.dateLabel}</p>
    </>
  );

  return (
    <article className="rounded-[24px] border border-[#E4E7EC] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
      {content}
      {exam.actionDisabled ? (
        <div className={`mt-6 ${buttonClass}`}>{exam.actionLabel}</div>
      ) : (
        <Link className={`mt-6 ${buttonClass}`} href={exam.href}>
          {exam.actionLabel}
        </Link>
      )}
    </article>
  );
}
