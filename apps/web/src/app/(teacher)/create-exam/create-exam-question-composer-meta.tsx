import {
  QuestionRepositoryKind,
  type Difficulty,
  type QuestionType,
} from "@/graphql/generated";
import { difficultyOptions, questionTypeOptions } from "../components/sections/question-bank-dialog-config";
import {
  getBankGradeOptions,
  getBankSubjectOptions,
  getBankTopicOptions,
  type BankSelectionValues,
} from "./create-exam-bank-selection";
import { ChevronDownIcon } from "./create-exam-icons";
import type { CreateExamQuestionBankOption } from "./create-exam-types";

type CreateExamQuestionComposerMetaProps = {
  bankOptions: CreateExamQuestionBankOption[];
  repositoryKind: QuestionRepositoryKind;
  bankSelection: BankSelectionValues;
  difficulty: Difficulty;
  disabled: boolean;
  isBankLocked: boolean;
  loading: boolean;
  questionType: QuestionType;
  onRepositoryKindChange: (value: QuestionRepositoryKind) => void;
  onBankSelectionChange: (
    field: keyof BankSelectionValues,
    value: string,
  ) => void;
  onDifficultyChange: (value: Difficulty) => void;
  onQuestionTypeChange: (value: QuestionType) => void;
};

const SELECT_CLASS_NAME =
  "h-9 appearance-none rounded-[6px] border border-[#DFE1E5] bg-white px-[11.8px] pr-9 text-[14px] leading-5 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] outline-none";

export function CreateExamQuestionComposerMeta({
  bankOptions,
  repositoryKind,
  bankSelection,
  difficulty,
  disabled,
  isBankLocked,
  loading,
  questionType,
  onRepositoryKindChange,
  onBankSelectionChange,
  onDifficultyChange,
  onQuestionTypeChange,
}: CreateExamQuestionComposerMetaProps) {
  const filteredBankOptions = bankOptions.filter(
    (option) => option.repositoryKind === repositoryKind,
  );
  const gradeOptions = getBankGradeOptions(filteredBankOptions);
  const subjectOptions = getBankSubjectOptions(filteredBankOptions, bankSelection.grade);
  const topicOptions = getBankTopicOptions(
    filteredBankOptions,
    bankSelection.grade,
    bankSelection.subject,
  );
  const bankDisabled = disabled || loading || isBankLocked;

  return (
    <div className="grid gap-4 xl:grid-cols-[141.6px_150px_1fr_1fr_1fr_93.6px]">
        <label className="relative block w-[141.6px]">
          <select
            value={questionType}
            onChange={(event) => onQuestionTypeChange(event.target.value as QuestionType)}
            className={`${SELECT_CLASS_NAME} w-[141.6px] text-[#0F1216]`}
            disabled={disabled || loading}
          >
            {questionTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label === "Сонгох" ? "Олон сонголт" : option.label}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="pointer-events-none absolute right-[11.8px] top-1/2 h-4 w-4 -translate-y-1/2 text-[#52555B] opacity-50" />
        </label>

        <label className="relative block">
          <select
            value={repositoryKind}
            onChange={(event) =>
              onRepositoryKindChange(event.target.value as QuestionRepositoryKind)
            }
            className={`${SELECT_CLASS_NAME} w-full text-[#0F1216]`}
            disabled={bankDisabled}
          >
            <option value={QuestionRepositoryKind.Mine}>Миний сан</option>
            <option value={QuestionRepositoryKind.Unified}>Нэгдсэн сан</option>
          </select>
          <ChevronDownIcon className="pointer-events-none absolute right-[11.8px] top-1/2 h-4 w-4 -translate-y-1/2 text-[#52555B] opacity-50" />
        </label>

        <label className="relative block">
          <select
            value={bankSelection.grade}
            onChange={(event) => onBankSelectionChange("grade", event.target.value)}
            className={`${SELECT_CLASS_NAME} w-full text-[#52555B]`}
            disabled={bankDisabled}
          >
            <option value="" disabled>
              Анги
            </option>
            {gradeOptions.map((option) => (
              <option key={option} value={option}>
                {option}-р анги
              </option>
            ))}
          </select>
          <ChevronDownIcon className="pointer-events-none absolute right-[11.8px] top-1/2 h-4 w-4 -translate-y-1/2 text-[#52555B] opacity-50" />
        </label>

        <label className="relative block">
          <select
            value={bankSelection.subject}
            onChange={(event) => onBankSelectionChange("subject", event.target.value)}
            className={`${SELECT_CLASS_NAME} w-full text-[#52555B]`}
            disabled={bankDisabled || !bankSelection.grade}
          >
            <option value="" disabled>
              Хичээл
            </option>
            {subjectOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="pointer-events-none absolute right-[11.8px] top-1/2 h-4 w-4 -translate-y-1/2 text-[#52555B] opacity-50" />
        </label>

        <label className="relative block">
          <select
            value={bankSelection.topic}
            onChange={(event) => onBankSelectionChange("topic", event.target.value)}
            className={`${SELECT_CLASS_NAME} w-full text-[#52555B]`}
            disabled={bankDisabled || !bankSelection.subject}
          >
            <option value="" disabled>
              Сэдэв
            </option>
            {topicOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="pointer-events-none absolute right-[11.8px] top-1/2 h-4 w-4 -translate-y-1/2 text-[#52555B] opacity-50" />
        </label>

        <label className="relative block w-[93.6px]">
          <select
            value={difficulty}
            onChange={(event) => onDifficultyChange(event.target.value as Difficulty)}
            className={`${SELECT_CLASS_NAME} w-[93.6px] text-[#0F1216]`}
            disabled={disabled || loading}
          >
            {difficultyOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label.replace(" түвшин", "")}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="pointer-events-none absolute right-[11.8px] top-1/2 h-4 w-4 -translate-y-1/2 text-[#52555B] opacity-50" />
        </label>
    </div>
  );
}
