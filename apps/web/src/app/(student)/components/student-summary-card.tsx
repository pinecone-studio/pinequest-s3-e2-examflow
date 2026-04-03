type StudentSummaryCardProps = {
  accent: string;
  label: string;
  note: string;
  value: string;
};

export function StudentSummaryCard({
  accent,
  label,
  note,
  value,
}: StudentSummaryCardProps) {
  return (
    <article className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
      <span className={`inline-flex rounded-full px-3 py-1 text-[12px] font-semibold ${accent}`}>
        {label}
      </span>
      <p className="mt-4 text-[30px] font-semibold tracking-[-0.03em] text-[#101828]">{value}</p>
      <p className="mt-2 text-[14px] leading-6 text-[#667085]">{note}</p>
    </article>
  );
}
