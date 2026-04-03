"use client";

import { usePathname } from "next/navigation";

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-[16px] bg-[#E9EEF8] ${className}`.trim()} />;
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-8 px-8 py-8">
      <SkeletonBlock className="h-[220px] w-full" />
      <div className="grid gap-4 lg:grid-cols-3">
        <SkeletonBlock className="h-[220px]" />
        <SkeletonBlock className="h-[220px]" />
        <SkeletonBlock className="h-[220px]" />
      </div>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="flex flex-col gap-6 px-8 py-8">
      <div className="flex items-center justify-between gap-4">
        <SkeletonBlock className="h-10 w-56" />
        <SkeletonBlock className="h-10 w-36" />
      </div>
      <SkeletonBlock className="h-16 w-full" />
      <div className="grid gap-4">
        <SkeletonBlock className="h-28 w-full" />
        <SkeletonBlock className="h-28 w-full" />
        <SkeletonBlock className="h-28 w-full" />
      </div>
    </div>
  );
}

function CreateExamSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-[836px] flex-col gap-6 px-6 pb-10 pt-6 sm:px-7 lg:px-8 lg:pb-12 lg:pt-8">
      <SkeletonBlock className="mx-auto h-[260px] w-full max-w-[760px]" />
    </div>
  );
}

function WideBoardSkeleton() {
  return (
    <div className="flex flex-col gap-6 px-8 py-8">
      <div className="flex items-center justify-between gap-4">
        <SkeletonBlock className="h-12 w-40" />
        <SkeletonBlock className="h-12 w-44" />
      </div>
      <SkeletonBlock className="h-[620px] w-full" />
    </div>
  );
}

export function TeacherRouteLoading() {
  const pathname = usePathname();

  if (pathname === "/create-exam") {
    return <CreateExamSkeleton />;
  }

  if (pathname === "/" || pathname === "/classes") {
    return <WideBoardSkeleton />;
  }

  if (
    pathname === "/my-exams" ||
    pathname === "/evaluation" ||
    pathname === "/question-bank" ||
    pathname.startsWith("/question-bank/")
  ) {
    return <ListSkeleton />;
  }

  if (pathname === "/community") {
    return <DashboardSkeleton />;
  }

  return <ListSkeleton />;
}
