import { ExamMode } from "@/graphql/generated";
import type { CreateExamFieldErrors, CreateExamFormValues } from "./create-exam-types";

type CreateExamScheduleFieldsProps = {
  disabled: boolean;
  errors: CreateExamFieldErrors;
  onFieldChange: <K extends keyof CreateExamFormValues>(
    field: K,
    value: CreateExamFormValues[K],
  ) => void;
  value: string;
  values: CreateExamFormValues;
};

const INPUT_CLASS =
  "box-border h-11 w-full rounded-[6px] border border-[#DFE1E5] bg-white px-[11.8px] text-[14px] leading-[18px] text-[#0F1216] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] outline-none disabled:bg-[#F8F9FB]";

export function CreateExamScheduleFields({
  disabled,
  errors,
  onFieldChange,
  value,
  values,
}: CreateExamScheduleFieldsProps) {
  if (values.mode !== ExamMode.Scheduled) {
    return null;
  }

  return (
    <label className="grid gap-1.5" htmlFor="exam-scheduled-for">
      <span className="text-[14px] font-medium leading-5 text-[#52555B]">
        Эхлэх огноо, цаг
      </span>
      <input
        id="exam-scheduled-for"
        className={INPUT_CLASS}
        disabled={disabled}
        onChange={(event) => onFieldChange("scheduledFor", event.target.value)}
        type="datetime-local"
        value={value}
      />
      {errors.scheduledFor ? (
        <span className="text-[12px] text-[#B42318]">{errors.scheduledFor}</span>
      ) : (
        <span className="text-[12px] leading-5 text-[#667085]">
          Календарь дээр сонгосон өдрийг эндээс цагтай нь нарийвчлан тохируулна.
        </span>
      )}
    </label>
  );
}
