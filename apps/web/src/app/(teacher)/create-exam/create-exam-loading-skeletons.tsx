function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-[16px] bg-[#E9EEF8] ${className}`.trim()} />;
}

export function CreateExamPlannerSkeleton() {
  return (
    <div className="flex flex-col gap-6 px-8 pb-8 pt-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-4">
          <SkeletonBlock className="h-12 w-36 rounded-full" />
          <SkeletonBlock className="h-12 w-44 rounded-full" />
        </div>
        <SkeletonBlock className="h-12 w-44" />
      </div>
      <SkeletonBlock className="h-[720px] w-full" />
    </div>
  );
}

export function CreateExamBuilderSkeleton() {
  return (
    <div className="space-y-6">
      <SkeletonBlock className="h-16 w-full" />
      <SkeletonBlock className="h-[320px] w-full" />
      <SkeletonBlock className="h-[280px] w-full" />
      <SkeletonBlock className="h-[360px] w-full" />
    </div>
  );
}
