"use client";

import type {
  QuestionRepositoryKind,
  Difficulty,
  QuestionType,
} from "@/graphql/generated";
import { difficultyOptions, questionTypeOptions } from "./question-bank-dialog-config";
import {
  QuestionBankDialogRepositorySection,
  QuestionBankDialogSelect,
} from "./question-bank-dialog-fields";

export function QuestionBankDialogMetaSection({
  subject,
  repositoryKind,
  questionType,
  difficulty,
  requiresAccessRequest,
  disabled,
  onQuestionTypeChange,
  onDifficultyChange,
  onRequiresAccessRequestChange,
}: {
  subject: string;
  repositoryKind: QuestionRepositoryKind;
  questionType: QuestionType;
  difficulty: Difficulty;
  requiresAccessRequest: boolean;
  disabled?: boolean;
  onQuestionTypeChange: (value: QuestionType) => void;
  onDifficultyChange: (value: Difficulty) => void;
  onRequiresAccessRequestChange: (value: boolean) => void;
}) {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-3">
        <QuestionBankDialogSelect value={questionType} onChange={(value) => onQuestionTypeChange(value as QuestionType)}>
          {questionTypeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </QuestionBankDialogSelect>
        <QuestionBankDialogSelect disabled><option>{subject}</option></QuestionBankDialogSelect>
        <QuestionBankDialogSelect value={difficulty} onChange={(value) => onDifficultyChange(value as Difficulty)}>
          {difficultyOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </QuestionBankDialogSelect>
      </div>

      <QuestionBankDialogRepositorySection
        repositoryKind={repositoryKind}
        requiresAccessRequest={requiresAccessRequest}
        disabled={disabled}
        onRequiresAccessRequestChange={onRequiresAccessRequestChange}
      />
    </>
  );
}
