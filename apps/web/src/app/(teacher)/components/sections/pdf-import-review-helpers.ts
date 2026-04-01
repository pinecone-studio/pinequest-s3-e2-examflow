"use client";

import { Difficulty, QuestionType } from "@/graphql/generated";
import type { ImportJobView, ImportQuestionView } from "./pdf-import-dialog-utils";
import { findPdfImportSourceBlock } from "./pdf-import-normalized-document";

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
  sourceExcerpt: question.sourceExcerpt ?? null,
  sourceBlockId: question.sourceBlockId ?? null,
  sourceBboxJson: question.sourceBboxJson ?? null,
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

const reorderQuestions = (questions: ImportQuestionView[]) =>
  questions.map((question, index) => ({
    ...question,
    order: index + 1,
    title: question.title.trim() || `Асуулт ${index + 1}`,
  }));

export const moveReviewQuestion = (
  questions: ImportQuestionView[],
  questionId: string,
  direction: "up" | "down",
) => {
  const currentIndex = questions.findIndex((question) => question.id === questionId);
  if (currentIndex < 0) {
    return questions;
  }

  const nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  if (nextIndex < 0 || nextIndex >= questions.length) {
    return questions;
  }

  const nextQuestions = [...questions];
  const [current] = nextQuestions.splice(currentIndex, 1);
  if (!current) {
    return questions;
  }
  nextQuestions.splice(nextIndex, 0, current);
  return reorderQuestions(nextQuestions);
};

export const mergeReviewQuestionWithNext = (
  questions: ImportQuestionView[],
  questionId: string,
) => {
  const currentIndex = questions.findIndex((question) => question.id === questionId);
  if (currentIndex < 0 || currentIndex === questions.length - 1) {
    return questions;
  }

  const current = questions[currentIndex];
  const next = questions[currentIndex + 1];
  if (!current || !next) {
    return questions;
  }

  const merged: ImportQuestionView = {
    ...current,
    prompt: [current.prompt, next.prompt].filter(Boolean).join(" ").trim(),
    options: [...current.options, ...next.options].filter(Boolean),
    answers: [...current.answers, ...next.answers].filter(Boolean),
    score: Math.max(current.score, next.score),
    confidence: Math.min(current.confidence, next.confidence, 0.55),
    needsReview: true,
    sourceExcerpt: [current.sourceExcerpt, next.sourceExcerpt].filter(Boolean).join("\n\n"),
  };

  const nextQuestions = questions.filter((question) => question.id !== next.id);
  nextQuestions.splice(currentIndex, 1, merged);
  return reorderQuestions(nextQuestions);
};

export const splitReviewQuestion = (
  questions: ImportQuestionView[],
  questionId: string,
  jobView: ImportJobView | null,
) => {
  const currentIndex = questions.findIndex((question) => question.id === questionId);
  const current = questions[currentIndex];
  if (currentIndex < 0 || !current) {
    return questions;
  }

  const sourceBlock = findPdfImportSourceBlock(jobView?.extractionDocument, current.sourceBlockId);
  const sourceText = sourceBlock?.text || current.sourceExcerpt || current.prompt;
  const splitMatch =
    sourceText.match(/\?\s+(\d{1,2}\s*[.)]\s+.+)$/u) ||
    current.prompt.match(/\?\s+(.+)$/u);
  if (!splitMatch?.[1]) {
    return questions;
  }

  const firstPrompt = current.prompt.includes("?")
    ? current.prompt.slice(0, current.prompt.indexOf("?") + 1).trim()
    : current.prompt;
  const secondPrompt = splitMatch[1]
    .replace(/^\d{1,2}\s*[.)]\s*/u, "")
    .trim();
  if (!firstPrompt || !secondPrompt) {
    return questions;
  }

  const splitIndex = current.options.length >= 6 ? Math.ceil(current.options.length / 2) : current.options.length;
  const nextQuestion: ImportQuestionView = {
    ...current,
    id: `${current.id}__split_${Date.now()}`,
    order: current.order + 1,
    title: `${current.title} (2)`,
    prompt: secondPrompt,
    options: current.options.slice(splitIndex),
    answers: [],
    confidence: Math.min(current.confidence, 0.58),
    needsReview: true,
  };
  const updatedCurrent: ImportQuestionView = {
    ...current,
    prompt: firstPrompt,
    options: current.options.slice(0, splitIndex),
    confidence: Math.min(current.confidence, 0.58),
    needsReview: true,
  };

  const nextQuestions = [...questions];
  nextQuestions.splice(currentIndex, 1, updatedCurrent, nextQuestion);
  return reorderQuestions(nextQuestions);
};
