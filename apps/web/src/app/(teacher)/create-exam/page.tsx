import { CreateExamContent } from "./create-exam-content";
import { CreateExamPlanner } from "./create-exam-planner";
import type { ExamMode } from "@/graphql/generated";

type CreateExamPageProps = {
  searchParams: Promise<{
    bankId?: string;
    classId?: string;
    examId?: string;
    mode?: string;
    returnTo?: string;
    scheduledFor?: string;
  }>;
};

const parseExamMode = (value?: string): ExamMode | undefined =>
  value === "PRACTICE" || value === "SCHEDULED" ? (value as ExamMode) : undefined;

export default async function CreateExamPage({
  searchParams,
}: CreateExamPageProps) {
  const params = await searchParams;
  const initialMode = parseExamMode(params.mode);
  const showPlanner =
    !params.bankId
    && params.mode === "SCHEDULED"
    && !params.classId
    && !params.examId
    && !params.returnTo
    && !params.scheduledFor;

  return showPlanner ? (
    <CreateExamPlanner />
  ) : (
    <CreateExamContent
      initialBankId={params.bankId}
      initialClassId={params.classId}
      initialMode={initialMode}
      initialScheduledFor={params.scheduledFor}
      examId={params.examId}
      returnTo={params.returnTo}
    />
  );
}
