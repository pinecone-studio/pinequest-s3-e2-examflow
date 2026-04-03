"use client";

import type { PropsWithChildren } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { AppShell } from "./app-shell";

const isCreateExamPlannerRoute = (searchParams: { get: (key: string) => string | null }) =>
  searchParams.get("mode") === "SCHEDULED" &&
  !searchParams.get("classId") &&
  !searchParams.get("bankId") &&
  !searchParams.get("examId") &&
  !searchParams.get("returnTo") &&
  !searchParams.get("scheduledFor");

export function TeacherRouteShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isWideFixedRoute =
    pathname === "/" ||
    pathname === "/classes" ||
    (pathname === "/create-exam" && isCreateExamPlannerRoute(searchParams));
  const isQuestionBankRoute =
    pathname === "/question-bank" || pathname.startsWith("/question-bank/");
  const isMyExamsRoute = pathname === "/my-exams";
  const isCreateExamBuilderRoute =
    pathname === "/create-exam" && !isCreateExamPlannerRoute(searchParams);

  return (
    <AppShell
      fixedHeight={isWideFixedRoute}
      contentOuterClassName={isWideFixedRoute ? "w-full" : undefined}
      contentInnerClassName={isWideFixedRoute ? "w-[1184px]" : undefined}
      contentClassName={
        isWideFixedRoute
          ? "px-0 py-0"
          : isQuestionBankRoute
            ? "lg:px-[60px] lg:py-[54px]"
            : isMyExamsRoute
              ? "px-0 py-0 sm:px-0 sm:py-0 lg:px-0 lg:py-0"
              : isCreateExamBuilderRoute
                ? "px-6 pb-10 pt-6 sm:px-7 lg:px-8 lg:pb-12 lg:pt-8"
                : undefined
      }
    >
      {children}
    </AppShell>
  );
}
