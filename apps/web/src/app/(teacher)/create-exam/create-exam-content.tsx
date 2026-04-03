/* eslint-disable max-lines */
"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ExamMode } from "@/graphql/generated";
import { CreateExamDetailsCard } from "./create-exam-details-card";
import { CreateExamHeader } from "./create-exam-header";
import { CreateExamBuilderSkeleton } from "./create-exam-loading-skeletons";
import { CreateExamQuestionCard } from "./create-exam-question-card";
import { CreateExamSettingsCard } from "./create-exam-settings-card";
import { CreateExamSubmitAlert } from "./create-exam-submit-alert";
import { useCreateExamFlow } from "./hooks/use-create-exam-flow";

type CreateExamContentProps = {
  initialClassId?: string;
  initialBankId?: string;
  examId?: string;
  initialMode?: ExamMode;
  initialScheduledFor?: string;
  returnTo?: string;
};

type ModeChooserProps = {
  onSelect: (mode: ExamMode) => void;
};

function CreateExamModeChooser({ onSelect }: ModeChooserProps) {
  return (
    <section className="mx-auto max-w-[760px] rounded-[20px] border border-[#DFE1E5] bg-white p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] sm:p-7">
      <div className="space-y-2 text-center">
        <h2 className="text-[24px] font-semibold leading-8 text-[#101828]">
          Ямар төрлийн шалгалт үүсгэх вэ?
        </h2>
        <p className="mx-auto max-w-[560px] text-[15px] leading-6 text-[#667085]">
          Эхлээд урсгалаа сонговол дараагийн алхмууд илүү ойлгомжтой болно.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <button
          type="button"
          className="rounded-[18px] border border-[#D0D5DD] bg-white p-6 text-left transition hover:border-[#2466D0] hover:bg-[#F8FAFF]"
          onClick={() => onSelect(ExamMode.Scheduled)}
        >
          <div className="inline-flex rounded-full bg-[#EEF4FF] px-3 py-1 text-[12px] font-semibold text-[#2466D0]">
            Товлосон
          </div>
          <h3 className="mt-4 text-[18px] font-semibold leading-7 text-[#101828]">
            Товлосон шалгалт
          </h3>
          <p className="mt-2 text-[14px] leading-6 text-[#667085]">
            Тодорхой ангид оноож, хугацаатай явуулна. Дууссаны дараа багш үр дүн, тайлан,
            гараар үнэлгээгээ хийнэ.
          </p>
        </button>

        <button
          type="button"
          className="rounded-[18px] border border-[#D0D5DD] bg-white p-6 text-left transition hover:border-[#16A34A] hover:bg-[#F6FEF9]"
          onClick={() => onSelect(ExamMode.Practice)}
        >
          <div className="inline-flex rounded-full bg-[#ECFDF3] px-3 py-1 text-[12px] font-semibold text-[#16A34A]">
            Нээлттэй
          </div>
          <h3 className="mt-4 text-[18px] font-semibold leading-7 text-[#101828]">
            Чөлөөт сорил
          </h3>
          <p className="mt-2 text-[14px] leading-6 text-[#667085]">
            Сурагчид шууд ажиллаж болно. Дуусмагц оноо, зөв хариу, тайлбараа тэр дор нь харна.
          </p>
        </button>
      </div>
    </section>
  );
}

export function CreateExamContent({
  initialClassId = "",
  initialBankId = "",
  examId = "",
  initialMode,
  initialScheduledFor = "",
  returnTo = "",
}: CreateExamContentProps) {
  const router = useRouter();
  const isClassAssignmentFlow = Boolean(initialClassId && returnTo);
  const flow = useCreateExamFlow(
    initialClassId,
    isClassAssignmentFlow ? initialClassId : "",
    initialBankId,
    examId,
  );
  const isDisabled =
    flow.isSubmitting ||
    flow.isOptionsLoading ||
    !flow.classOptions.length ||
    !flow.questionBankOptions.length;
  const isEditMode = flow.isEditMode;
  const hasAppliedInitialMode = useRef(false);
  const hasAppliedInitialScheduledFor = useRef(false);
  const [isModeChosen, setIsModeChosen] = useState(
    Boolean(isEditMode || isClassAssignmentFlow || initialMode || initialScheduledFor),
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void (async () => {
      const submittedExamId = await flow.submitForm();
      if (submittedExamId && returnTo) {
        router.push(`${returnTo}?assignedExamId=${submittedExamId}`);
        return;
      }

      if (
        submittedExamId &&
        flow.formValues.mode === ExamMode.Practice &&
        flow.formValues.publishOnCreate
      ) {
        router.push("/evaluation");
      }
    })();
  };

  const handleModeSelect = (mode: ExamMode) => {
    if (!isEditMode && !isClassAssignmentFlow && mode === ExamMode.Scheduled) {
      router.push("/create-exam?mode=SCHEDULED");
      return;
    }

    flow.setFieldValue("mode", mode);
    setIsModeChosen(true);
  };
  const currentMode = flow.formValues.mode;
  const setFieldValue = flow.setFieldValue;

  useEffect(() => {
    if (!isClassAssignmentFlow || currentMode === ExamMode.Scheduled) {
      return;
    }

    setFieldValue("mode", ExamMode.Scheduled);
  }, [currentMode, isClassAssignmentFlow, setFieldValue]);

  useEffect(() => {
    if (
      hasAppliedInitialMode.current
      || !initialMode
      || isEditMode
      || flow.formValues.mode === initialMode
    ) {
      return;
    }

    hasAppliedInitialMode.current = true;
    setFieldValue("mode", initialMode);
  }, [flow.formValues.mode, initialMode, isEditMode, setFieldValue]);

  useEffect(() => {
    if (
      hasAppliedInitialScheduledFor.current
      || !initialScheduledFor
      || isEditMode
      || flow.formValues.scheduledFor === initialScheduledFor
    ) {
      return;
    }

    hasAppliedInitialScheduledFor.current = true;
    setFieldValue("scheduledFor", initialScheduledFor);
  }, [flow.formValues.scheduledFor, initialScheduledFor, isEditMode, setFieldValue]);

  return (
    <div className="mx-auto w-full max-w-[836px]">
      <form className="space-y-6" onSubmit={handleSubmit}>
        {!isEditMode && !isModeChosen ? (
          <CreateExamModeChooser onSelect={handleModeSelect} />
        ) : null}

        {!isEditMode && isModeChosen ? (
          <div className="flex items-center justify-between rounded-[12px] border border-[#DFE1E5] bg-white px-4 py-3 text-[14px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
            <span className="text-[#344054]">
              Одоогийн төрөл:{" "}
              <span className="font-semibold text-[#101828]">
                {flow.formValues.mode === ExamMode.Practice
                  ? "Чөлөөт сорил"
                  : "Товлосон шалгалт"}
              </span>
            </span>
            {!isClassAssignmentFlow ? (
              <button
                type="button"
                className="text-[13px] font-medium text-[#2466D0]"
                onClick={() => setIsModeChosen(false)}
              >
                Төрөл солих
              </button>
            ) : null}
          </div>
        ) : null}

        {!isModeChosen && !isEditMode ? null : (
          <>
        <CreateExamHeader
          isSubmitting={flow.isSubmitting}
          disabled={isDisabled}
          isEditMode={flow.isEditMode}
          isPublishing={false}
          showPublishAction={flow.canPublishDraft}
          onPublish={() => {
            void (async () => {
              const publishedExamId = await flow.publishDraft();
              if (publishedExamId && flow.formValues.mode === ExamMode.Practice) {
                router.push("/evaluation");
              }
            })();
          }}
        />
        <CreateExamSubmitAlert submitState={flow.submitState} />

        {flow.resolvedBankId ? (
          <div className="mt-4 rounded-md border border-[#B2DDFF] bg-[#F0F9FF] px-4 py-3 text-[13px] text-[#175CD3]">
            Энэ шалгалт тухайн асуултын сангаас эхэлж байна. Хэрэв өөр сан сонгох бол энэ
            хуудсыг асуултын сангүй нээнэ.
          </div>
        ) : null}

        {flow.isOptionsLoading ? (
          <CreateExamBuilderSkeleton />
        ) : null}

        {flow.optionsError ? (
          <div className="rounded-[20px] border border-[#FDA29B] bg-[#FEF3F2] px-4 py-3 text-[13px] text-[#B42318]">
            Сонголтын мэдээллийг ачаалахад алдаа гарлаа. Дахин оролдоно уу.
          </div>
        ) : null}

        {!flow.classOptions.length && !flow.isOptionsLoading ? (
          <p className="text-[13px] text-[#B42318]">
            Шалгалт үүсгэх ангийн мэдээлэл олдсонгүй. Системийн өгөгдлөө шалгана уу.
          </p>
        ) : null}

        {!flow.questionBankOptions.length && !flow.isOptionsLoading ? (
          <p className="text-[13px] text-[#B42318]">
            Асуултын сангийн мэдээлэл олдсонгүй. Системийн өгөгдлөө шалгана уу.
          </p>
        ) : null}

        <CreateExamDetailsCard
          values={flow.formValues}
          errors={flow.errors}
          disabled={isDisabled}
          classOptions={flow.classOptions}
          isClassSelectionLocked={isClassAssignmentFlow}
          showModeSelector={isEditMode}
          onFieldChange={flow.setFieldValue}
        />
        <CreateExamSettingsCard
          disabled={isDisabled}
          isEditMode={flow.isEditMode}
          values={flow.formValues}
          errors={flow.errors}
          selectedQuestionPoints={flow.selectedQuestionPoints}
          onFieldChange={flow.setFieldValue}
        />
        <CreateExamQuestionCard
          values={flow.formValues}
          viewerId={flow.viewerId}
          questionBankOptions={flow.questionBankOptions}
          ruleSourceOptions={flow.ruleSourceOptions}
          questionOptions={flow.questionOptions}
          selectedQuestionPoints={flow.selectedQuestionPoints}
          errors={flow.errors}
          disabled={isDisabled}
          onToggleQuestion={flow.toggleQuestion}
          onAddQuestion={flow.addQuestion}
          onPointsChange={flow.setQuestionPoints}
          onAddGenerationRule={flow.addGenerationRule}
          onRemoveGenerationRule={flow.removeGenerationRule}
          onUpdateGenerationRule={flow.updateGenerationRule}
          onReplaceWithPracticeDifficultyRules={flow.replaceWithPracticeDifficultyRules}
          onQuestionsRefresh={flow.refetchOptions}
          initialBankId={flow.resolvedBankId}
        />
          </>
        )}
      </form>
    </div>
  );
}
