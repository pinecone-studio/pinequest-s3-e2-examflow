import { CreateExamDetailsCard } from "./create-exam-details-card";
import { CreateExamHeader } from "./create-exam-header";
import { CreateExamQuestionCard } from "./create-exam-question-card";
import { CreateExamSettingsCard } from "./create-exam-settings-card";

export function CreateExamContent() {
  return (
    <div className="w-full px-5 py-8 sm:px-8 sm:py-10 lg:px-[60px] lg:py-[54px]">
      <div className="w-full max-w-[672px]">
        <CreateExamHeader />
        <div className="mt-8 flex flex-col gap-6">
          <CreateExamDetailsCard />
          <CreateExamSettingsCard />
          <CreateExamQuestionCard />
        </div>
      </div>
    </div>
  );
}
