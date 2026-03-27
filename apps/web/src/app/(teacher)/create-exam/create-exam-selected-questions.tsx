"use client";

import type {
  CreateExamFieldErrors,
  CreateExamQuestionOption,
  SelectedQuestionPoints,
} from "./create-exam-types";

type CreateExamSelectedQuestionsProps = {
  questionOptions: CreateExamQuestionOption[];
  selectedQuestionPoints: SelectedQuestionPoints;
  errors: CreateExamFieldErrors;
  disabled: boolean;
  onRemove: (questionId: string) => void;
  onPointsChange: (questionId: string, value: string) => void;
};

const QUESTION_TYPE_LABELS: Record<string, string> = {
  MCQ: "Олон сонголт",
  TRUE_FALSE: "Үнэн/Худал",
  SHORT_ANSWER: "Тоо бодолт",
  ESSAY: "Задгай хариулт",
};

const DIFFICULTY_LABELS: Record<string, string> = {
  EASY: "Хялбар",
  MEDIUM: "Дунд",
  HARD: "Хүнд",
};

const formatQuestionText = (question: CreateExamQuestionOption) => {
  const source = question.prompt.trim() || question.title.trim();
  return source.length > 140 ? `${source.slice(0, 137)}...` : source;
};

export function CreateExamSelectedQuestions({
  questionOptions,
  selectedQuestionPoints,
  errors,
  disabled,
  onRemove,
  onPointsChange,
}: CreateExamSelectedQuestionsProps) {
  const selectedQuestions = questionOptions.filter(
    (question) => question.id in selectedQuestionPoints,
  );

  if (!selectedQuestions.length) {
    return null;
  }

  return (
    <div className="space-y-3">
      {selectedQuestions.map((question) => (
        <article
          key={question.id}
          className="rounded-[20px] border border-[#E4E7EC] bg-white p-4 shadow-[0px_4px_12px_rgba(16,24,40,0.04)]"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <p className="text-[15px] font-semibold leading-6 text-[#101828]">
                {formatQuestionText(question)}
              </p>
              <div className="flex flex-wrap gap-2 text-[12px]">
                <span className="rounded-full border border-[#D0D5DD] bg-[#F9FAFB] px-2.5 py-1 text-[#344054]">
                  {QUESTION_TYPE_LABELS[question.type] ?? question.type}
                </span>
                <span className="rounded-full border border-[#D6E2FF] bg-[#F3F7FF] px-2.5 py-1 text-[#163D99]">
                  {question.bankTitle}
                </span>
                <span className="rounded-full border border-[#E4E7EC] bg-[#FCFCFD] px-2.5 py-1 text-[#475467]">
                  {DIFFICULTY_LABELS[question.difficulty] ?? question.difficulty}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
              <label className="grid gap-1.5 text-[13px] font-medium text-[#344054]">
                <span>Оноо</span>
                <input
                  type="text"
                  className="h-11 w-full rounded-xl border border-[#D0D5DD] bg-white px-4 text-[14px] text-[#101828] outline-none focus:border-[#98B7FF] sm:w-[120px]"
                  value={selectedQuestionPoints[question.id] ?? ""}
                  onChange={(event) => onPointsChange(question.id, event.target.value)}
                  disabled={disabled}
                  inputMode="numeric"
                />
                {errors.pointsByQuestionId[question.id] ? (
                  <span className="text-[12px] font-normal text-[#B42318]">
                    {errors.pointsByQuestionId[question.id]}
                  </span>
                ) : null}
              </label>
              <button
                type="button"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-[#E4E7EC] px-4 text-[14px] font-medium text-[#667085]"
                onClick={() => onRemove(question.id)}
                disabled={disabled}
              >
                Хасах
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
