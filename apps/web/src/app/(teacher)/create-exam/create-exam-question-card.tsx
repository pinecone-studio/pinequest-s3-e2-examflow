import { useState } from "react";
import {
  type CreateExamFieldErrors,
  type CreateExamQuestionBankOption,
  type CreateExamQuestionOption,
  type SelectedQuestionPoints,
} from "./create-exam-types";
import { CreateExamQuestionComposer } from "./create-exam-question-composer";
import { CreateExamQuestionDrawer } from "./create-exam-question-drawer";
import { CreateExamQuestionLibrary } from "./create-exam-question-library";
import { CreateExamSelectedQuestions } from "./create-exam-selected-questions";

type CreateExamQuestionCardProps = {
  questionBankOptions: CreateExamQuestionBankOption[];
  questionOptions: CreateExamQuestionOption[];
  selectedQuestionPoints: SelectedQuestionPoints;
  errors: CreateExamFieldErrors;
  disabled: boolean;
  onToggleQuestion: (questionId: string) => void;
  onAddQuestion: (questionId: string) => void;
  onPointsChange: (questionId: string, value: string) => void;
  onQuestionsRefresh: () => Promise<unknown>;
};

export function CreateExamQuestionCard({
  questionBankOptions,
  questionOptions,
  selectedQuestionPoints,
  errors,
  disabled,
  onToggleQuestion,
  onAddQuestion,
  onPointsChange,
  onQuestionsRefresh,
}: CreateExamQuestionCardProps) {
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [drawerSelectedIds, setDrawerSelectedIds] = useState<string[]>([]);
  const selectedCount = Object.keys(selectedQuestionPoints).length;

  const openLibrary = () => {
    setDrawerSelectedIds(Object.keys(selectedQuestionPoints));
    setIsLibraryOpen(true);
  };

  return (
    <section className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-[24px] font-semibold text-[#101828]">
          Асуултууд ({selectedCount})
        </h2>
        <p className="text-[14px] text-[#667085]">
          Шалгалтдаа оруулах асуултуудаа эндээс үүсгэж эсвэл сангаас нэмнэ.
        </p>
      </div>

      {!isComposerOpen ? (
        <button
          type="button"
          className="flex min-h-[88px] w-full items-center justify-center rounded-[24px] border border-dashed border-[#BFCDEB] bg-white px-5 text-[18px] font-medium text-[#344054]"
          onClick={() => setIsComposerOpen(true)}
        >
          + Асуулт нэмэх
        </button>
      ) : null}

      {selectedCount === 0 && !isComposerOpen ? (
        <div className="rounded-[24px] border border-[#E4E7EC] bg-white px-6 py-12 text-center shadow-[0px_4px_12px_rgba(16,24,40,0.04)]">
          <p className="text-[24px] font-semibold text-[#101828]">Одоогоор асуулт алга</p>
          <p className="mt-2 text-[15px] text-[#667085]">
            Дээрх товчоор анхны асуултаа нэмнэ
          </p>
        </div>
      ) : null}

      {errors.selectedQuestions ? (
        <p className="text-[12px] text-[#B42318]">{errors.selectedQuestions}</p>
      ) : null}

      {isComposerOpen ? (
        <CreateExamQuestionComposer
          bankOptions={questionBankOptions}
          disabled={disabled}
          onOpenLibrary={openLibrary}
          onQuestionCreated={(questionId) => {
            onAddQuestion(questionId);
            setIsComposerOpen(false);
          }}
          onQuestionsRefresh={onQuestionsRefresh}
          onClose={() => setIsComposerOpen(false)}
        />
      ) : null}

      <CreateExamSelectedQuestions
        disabled={disabled}
        questionOptions={questionOptions}
        selectedQuestionPoints={selectedQuestionPoints}
        errors={errors}
        onRemove={onToggleQuestion}
        onPointsChange={onPointsChange}
      />

      <CreateExamQuestionDrawer
        open={isLibraryOpen}
        title="Сангаас асуулт нэмэх"
        description="Шалгалтад оруулах асуултуудаа сонгоно."
        onClose={() => setIsLibraryOpen(false)}
      >
        <CreateExamQuestionLibrary
          questionOptions={questionOptions}
          disabled={disabled}
          checkedQuestionIds={drawerSelectedIds}
          onToggleChecked={(questionId) =>
            setDrawerSelectedIds((current) =>
              current.includes(questionId)
                ? current.filter((item) => item !== questionId)
                : [...current, questionId],
            )
          }
          onAddSelected={() => {
            drawerSelectedIds.forEach((questionId) => onAddQuestion(questionId));
            setIsLibraryOpen(false);
          }}
        />
      </CreateExamQuestionDrawer>
    </section>
  );
}
