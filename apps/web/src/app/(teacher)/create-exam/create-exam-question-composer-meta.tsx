import { UploadIcon } from "./create-exam-icons";
import type { CreateExamQuestionBankOption } from "./create-exam-types";
import type { Difficulty, QuestionType } from "@/graphql/generated";
import { difficultyOptions, questionTypeOptions } from "../components/sections/question-bank-dialog-config";

type CreateExamQuestionComposerMetaProps = {
  bankOptions: CreateExamQuestionBankOption[];
  bankId: string;
  difficulty: Difficulty;
  disabled: boolean;
  loading: boolean;
  questionType: QuestionType;
  onBankIdChange: (value: string) => void;
  onDifficultyChange: (value: Difficulty) => void;
  onQuestionTypeChange: (value: QuestionType) => void;
};

const SELECT_CLASS_NAME =
  "h-12 w-full rounded-xl border border-[#D0D5DD] bg-white px-4 text-[14px] text-[#101828] outline-none focus:border-[#98B7FF]";

export function CreateExamQuestionComposerMeta({
  bankOptions,
  bankId,
  difficulty,
  disabled,
  loading,
  questionType,
  onBankIdChange,
  onDifficultyChange,
  onQuestionTypeChange,
}: CreateExamQuestionComposerMetaProps) {
  return (
    <>
      <div className="space-y-2">
        <span className="text-[14px] font-medium text-[#344054]">Медиа (заавал биш)</span>
        <div className="grid gap-3 md:grid-cols-2">
          {["Зураг оруулах", "Видео оруулах"].map((label) => (
            <button
              key={label}
              type="button"
              className="flex h-[108px] items-center justify-center gap-3 rounded-[20px] border border-dashed border-[#D0D5DD] bg-[#FCFCFD] text-[14px] font-medium text-[#475467]"
            >
              <UploadIcon className="h-5 w-5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <select
          value={questionType}
          onChange={(event) => onQuestionTypeChange(event.target.value as QuestionType)}
          className={SELECT_CLASS_NAME}
          disabled={disabled || loading}
        >
          {questionTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          value={bankId}
          onChange={(event) => onBankIdChange(event.target.value)}
          className={SELECT_CLASS_NAME}
          disabled={disabled || loading}
        >
          {bankOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.title}
            </option>
          ))}
        </select>
        <select
          value={difficulty}
          onChange={(event) => onDifficultyChange(event.target.value as Difficulty)}
          className={SELECT_CLASS_NAME}
          disabled={disabled || loading}
        >
          {difficultyOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
