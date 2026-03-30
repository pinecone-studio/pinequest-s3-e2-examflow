"use client";

import { Difficulty } from "@/graphql/generated";
import {
  questionTypeLabels,
  type ImportQuestionView,
} from "./pdf-import-dialog-utils";

const difficultyLabels: Record<Difficulty, string> = {
  [Difficulty.Easy]: "Хялбар",
  [Difficulty.Medium]: "Дунд",
  [Difficulty.Hard]: "Хэцүү",
};

export function PdfImportDialogQuestionCardReadonly({
  question,
}: {
  question: ImportQuestionView;
}) {
  return (
    <>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-[#EEF4FF] px-2.5 py-1 text-[12px] font-medium text-[#1D4ED8]">
          {questionTypeLabels[question.type]}
        </span>
        <span className="rounded-full bg-[#F9FAFB] px-2.5 py-1 text-[12px] font-medium text-[#475467]">
          {difficultyLabels[question.difficulty as Difficulty] ?? question.difficulty}
        </span>
      </div>
      <h4 className="mt-3 text-[16px] font-semibold text-[#101828]">{question.title}</h4>
      <p className="mt-2 text-[14px] leading-6 text-[#475467]">{question.prompt}</p>

      {question.options.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {question.options.map((option) => (
            <span
              key={`${question.id}-${option}`}
              className="rounded-full border border-[#D0D5DD] bg-[#FCFCFD] px-3 py-1 text-[12px] font-medium text-[#344054]"
            >
              {option}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center gap-3 text-[13px] text-[#667085]">
        <span>Зөв хариу: {question.answers.join(", ") || "Оруулаагүй"}</span>
        <span>Оноо: {question.score}</span>
      </div>
    </>
  );
}
