type StudentEmptyStateProps = {
  message: string;
};

export function StudentEmptyState({ message }: StudentEmptyStateProps) {
  return (
    <div className="rounded-[24px] border border-dashed border-[#D0D5DD] bg-white px-6 py-8 text-[14px] leading-6 text-[#667085] shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
      {message}
    </div>
  );
}
