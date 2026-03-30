"use client";

import { PdfImportDialogQuestionCardEditable } from "./pdf-import-dialog-question-card-editable";
import { PdfImportDialogQuestionCardReadonly } from "./pdf-import-dialog-question-card-readonly";
import type { ImportQuestionView } from "./pdf-import-dialog-utils";

export function PdfImportDialogQuestionCard({
  question,
  isEditable,
  onReject,
  onUpdate,
}: {
  question: ImportQuestionView;
  isEditable: boolean;
  onReject?: () => void;
  onUpdate?: (nextQuestion: ImportQuestionView) => void;
}) {
  return (
    <div
      className={`rounded-[20px] border bg-white p-4 shadow-[0px_1px_2px_rgba(16,24,40,0.05)] ${
        question.needsReview
          ? "border-[#FDB022] ring-1 ring-[#FEDF89]"
          : "border-[#E4E7EC]"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-[#F2F4F7] px-2.5 py-1 text-[12px] font-medium text-[#344054]">
          #{question.order}
        </span>
        <span className="rounded-full bg-[#F9FAFB] px-2.5 py-1 text-[12px] font-medium text-[#475467]">
          {Math.round(question.confidence * 100)}%
        </span>
        <span className="rounded-full bg-[#F9FAFB] px-2.5 py-1 text-[12px] font-medium text-[#475467]">
          Хуудас: {question.sourcePage ?? "-"}
        </span>
        {question.needsReview ? (
          <span className="rounded-full bg-[#FFF7ED] px-2.5 py-1 text-[12px] font-medium text-[#C4320A]">
            Шалгах шаардлагатай
          </span>
        ) : null}
      </div>

      {isEditable && onReject && onUpdate ? (
        <PdfImportDialogQuestionCardEditable
          question={question}
          onReject={onReject}
          onUpdate={onUpdate}
        />
      ) : (
        <PdfImportDialogQuestionCardReadonly question={question} />
      )}
    </div>
  );
}
