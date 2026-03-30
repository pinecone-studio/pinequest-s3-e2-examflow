"use client";

import { Difficulty, QuestionType } from "@/graphql/generated";
import type { ImportJobView, ImportQuestionView } from "./pdf-import-dialog-utils";

export const toApprovedQuestionInput = (question: ImportQuestionView) => ({
  id: question.id,
  order: question.order,
  type: question.type,
  title: question.title.trim() || `Асуулт ${question.order}`,
  prompt: question.prompt.trim(),
  options:
    question.type === QuestionType.TrueFalse
      ? ["True", "False"]
      : question.options.map((option) => option.trim()).filter(Boolean),
  answers: question.answers.map((answer) => answer.trim()).filter(Boolean),
  score: Math.max(1, Math.round(question.score || 1)),
  difficulty: (question.difficulty as Difficulty) || Difficulty.Medium,
  sourcePage: question.sourcePage ?? null,
  confidence: Math.max(0, Math.min(1, question.confidence)),
  needsReview: question.needsReview,
});

export const buildReviewSummary = (
  jobView: ImportJobView | null,
  reviewQuestions: ImportQuestionView[],
) =>
  jobView
    ? `${reviewQuestions.length} асуулт, ${
        reviewQuestions.filter((question) => question.needsReview).length
      } шалгах шаардлагатай`
    : null;

export const buildExamEditHref = (
  jobView: ImportJobView | null,
  selectedClassId: string,
) => {
  if (!jobView?.questionBank || !jobView.exam) {
    return null;
  }

  const classId = jobView.exam.classId || selectedClassId;
  if (!classId) {
    return null;
  }

  return `/create-exam?examId=${jobView.exam.id}&bankId=${jobView.questionBank.id}&classId=${classId}&returnTo=%2Fmy-exams`;
};
