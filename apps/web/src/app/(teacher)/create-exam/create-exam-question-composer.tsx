"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@apollo/client/react";
import {
  CreateQuestionMutationDocument,
  QuestionType,
  type CreateQuestionMutationMutation,
  type Difficulty,
} from "@/graphql/generated";
import { useQuestionBankDialogState } from "../components/sections/question-bank-dialog-state";
import { buildCreateQuestionPayload } from "../components/sections/question-bank-dialog-submit";
import { CreateExamQuestionAnswerFields } from "./create-exam-question-answer-fields";
import { CreateExamQuestionComposerFooter } from "./create-exam-question-composer-footer";
import { CreateExamQuestionComposerMeta } from "./create-exam-question-composer-meta";
import type { CreateExamQuestionBankOption } from "./create-exam-types";

type CreateExamQuestionComposerProps = {
  bankOptions: CreateExamQuestionBankOption[];
  disabled: boolean;
  onQuestionCreated: (questionId: string) => void;
  onQuestionsRefresh: () => Promise<unknown>;
  onClose: () => void;
  onOpenLibrary?: () => void;
};

export function CreateExamQuestionComposer({
  bankOptions,
  disabled,
  onQuestionCreated,
  onQuestionsRefresh,
  onClose,
  onOpenLibrary,
}: CreateExamQuestionComposerProps) {
  const [bankId, setBankId] = useState("");
  const {
    prompt, setPrompt,
    questionType, setQuestionType,
    difficulty, setDifficulty,
    options, correctIndex, setCorrectIndex,
    truthValue, setTruthValue,
    numericAnswer, setNumericAnswer,
    tolerance, setTolerance,
    referenceAnswer, setReferenceAnswer,
    saveToBank, setSaveToBank,
    errorMessage, setErrorMessage,
    closeAndReset, resetState, updateOption, addOption, removeOption,
  } = useQuestionBankDialogState(null, onClose);
  const [createQuestion, { loading }] = useMutation<CreateQuestionMutationMutation>(
    CreateQuestionMutationDocument,
  );

  useEffect(() => {
    if (!bankId && bankOptions.length) {
      setBankId(bankOptions[0].id);
    }
  }, [bankId, bankOptions]);

  const bankSummary = useMemo(() => {
    const selectedBank = bankOptions.find((option) => option.id === bankId);
    return selectedBank
      ? `Хадгалах сан: ${selectedBank.title} · ${selectedBank.subject}`
      : null;
  }, [bankId, bankOptions]);

  const submit = async () => {
    try {
      if (!bankId) {
        setErrorMessage("Асуултын сан сонгоно уу.");
        return;
      }
      if (!saveToBank) {
        setErrorMessage("Асуултыг шалгалтад нэмэхийн тулд эхлээд санд хадгална.");
        return;
      }
      const payload = buildCreateQuestionPayload({
        prompt,
        questionType,
        options,
        correctIndex,
        truthValue,
        numericAnswer,
        tolerance,
        referenceAnswer,
        difficulty: difficulty as Difficulty,
      });
      if (!payload.prompt) {
        setErrorMessage("Асуултаа оруулна уу.");
        return;
      }
      if (questionType === QuestionType.Mcq && payload.options.length < 2) {
        setErrorMessage("Дор хаяж 2 сонголт оруулна уу.");
        return;
      }
      if (questionType === QuestionType.ShortAnswer && !payload.correctAnswer) {
        setErrorMessage("Зөв хариуг оруулна уу.");
        return;
      }
      const result = await createQuestion({
        variables: { bankId, type: questionType, ...payload },
      });
      const createdQuestion = result.data?.createQuestion;
      if (!createdQuestion) {
        throw new Error("Асуулт үүсгэсэн хариу ирсэнгүй.");
      }
      await onQuestionsRefresh();
      onQuestionCreated(createdQuestion.id);
      resetState();
    } catch (error) {
      console.error("Failed to create question for exam", error);
      setErrorMessage("Асуулт нэмэх үед алдаа гарлаа.");
    }
  };

  return (
    <div className="rounded-[24px] border border-[#D6E2FF] bg-white p-5 shadow-[0px_10px_20px_rgba(22,61,153,0.08)] sm:p-6">
      <div className="space-y-5">
        <label className="grid gap-2" htmlFor="create-exam-prompt">
          <span className="text-[14px] font-medium text-[#344054]">Асуулт</span>
          <textarea
            id="create-exam-prompt"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Асуултаа оруулна уу..."
            className="min-h-[128px] rounded-xl border border-[#D0D5DD] bg-white px-4 py-3 text-[14px] text-[#101828] outline-none placeholder:text-[#98A2B3] focus:border-[#98B7FF]"
            disabled={disabled || loading}
          />
        </label>

        <CreateExamQuestionComposerMeta
          bankOptions={bankOptions}
          bankId={bankId}
          difficulty={difficulty as Difficulty}
          disabled={disabled}
          loading={loading}
          questionType={questionType}
          onBankIdChange={setBankId}
          onDifficultyChange={setDifficulty}
          onQuestionTypeChange={setQuestionType}
        />

        <CreateExamQuestionAnswerFields
          questionType={questionType}
          options={options}
          correctIndex={correctIndex}
          truthValue={truthValue}
          numericAnswer={numericAnswer}
          tolerance={tolerance}
          referenceAnswer={referenceAnswer}
          disabled={disabled || loading}
          onPick={setCorrectIndex}
          onUpdate={updateOption}
          onRemove={removeOption}
          onAdd={addOption}
          onTruthChange={setTruthValue}
          onNumericAnswerChange={setNumericAnswer}
          onToleranceChange={setTolerance}
          onReferenceAnswerChange={setReferenceAnswer}
        />

        <CreateExamQuestionComposerFooter
          saveToBank={saveToBank}
          disabled={disabled}
          loading={loading}
          bankSummary={bankSummary}
          errorMessage={errorMessage}
          onToggleSave={setSaveToBank}
          onOpenLibrary={onOpenLibrary}
          onCancel={closeAndReset}
          onSubmit={() => void submit()}
        />
      </div>
    </div>
  );
}
