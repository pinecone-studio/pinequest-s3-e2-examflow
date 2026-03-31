import { TEACHER_COMMON_TEXT } from "./teacher-ui";

type DashboardRetryProps = {
  onRetry: () => void;
};

export function DashboardSkeleton() {
  return (
    <section className="mx-auto max-w-[1184px] animate-pulse space-y-6">
      <div className="flex gap-3">
        <div className="h-12 w-12 rounded-2xl bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)]" />
        <div className="h-14 flex-1 rounded-[22px] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)]" />
        <div className="h-12 w-12 rounded-2xl bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)]" />
      </div>
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-12 w-[180px] rounded-[16px] bg-white shadow-[0_10px_24px_rgba(15,23,42,0.05)]" />
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <div className="h-[320px] rounded-[28px] border border-[#F0EEFA] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.06)]" />
        <div className="h-[320px] rounded-[28px] border border-[#F0EEFA] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.06)]" />
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="h-[256px] rounded-[28px] border border-[#F0EEFA] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.06)]" />
        ))}
      </div>
    </section>
  );
}

export function DashboardErrorState({ onRetry }: DashboardRetryProps) {
  return (
    <section className="mx-auto max-w-[1184px] rounded-[28px] border border-[#F4D7DA] bg-white px-6 py-10 text-center shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
      <h2 className="text-[24px] font-semibold text-[#2A233B]">Хяналтын самбарыг ачаалж чадсангүй</h2>
      <p className="mx-auto mt-3 max-w-[520px] text-[15px] leading-7 text-[#8B4352]">
        {TEACHER_COMMON_TEXT.genericError}
      </p>
      <button
        className="mt-6 rounded-[16px] bg-[#6434F8] px-5 py-3 text-[15px] font-semibold text-white shadow-[0_14px_30px_rgba(100,52,248,0.24)] transition hover:bg-[#5527E8] focus:outline-none focus:ring-4 focus:ring-[#EEE9FF]"
        onClick={onRetry}
        type="button"
      >
        {TEACHER_COMMON_TEXT.retry}
      </button>
    </section>
  );
}

export function DashboardEmptyState() {
  return (
    <section className="mx-auto max-w-[1184px] rounded-[28px] border border-[#F0EEFA] bg-white px-6 py-12 text-center shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
      <h2 className="text-[26px] font-semibold text-[#18161F]">Хяналтын самбарт харуулах өгөгдөл алга</h2>
      <p className="mx-auto mt-3 max-w-[560px] text-[15px] leading-7 text-[#8B879A]">
        Анги, шалгалтын өгөгдөл орж ирмэгц энэ хэсэг бодит тайлан, товлолт, үр дүнгээр автоматаар дүүрнэ.
      </p>
    </section>
  );
}
