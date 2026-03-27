import { QuestionType } from "@/graphql/generated";
import { CreateExamAnswerOptionRow } from "./create-exam-answer-option-row";

type CreateExamQuestionAnswerFieldsProps = {
  questionType: QuestionType;
  options: string[];
  correctIndex: number;
  truthValue: string;
  numericAnswer: string;
  tolerance: string;
  referenceAnswer: string;
  disabled?: boolean;
  onPick: (index: number) => void;
  onUpdate: (index: number, value: string) => void;
  onRemove: (index: number) => void;
  onAdd: () => void;
  onTruthChange: (value: string) => void;
  onNumericAnswerChange: (value: string) => void;
  onToleranceChange: (value: string) => void;
  onReferenceAnswerChange: (value: string) => void;
};

export function CreateExamQuestionAnswerFields({
  questionType,
  options,
  correctIndex,
  truthValue,
  numericAnswer,
  tolerance,
  referenceAnswer,
  disabled = false,
  onPick,
  onUpdate,
  onRemove,
  onAdd,
  onTruthChange,
  onNumericAnswerChange,
  onToleranceChange,
  onReferenceAnswerChange,
}: CreateExamQuestionAnswerFieldsProps) {
  if (questionType === QuestionType.TrueFalse) {
    return (
      <div className="space-y-3">
        <h3 className="text-[14px] font-semibold text-[#101828]">Хариултууд (зөвийг сонгоно)</h3>
        <div className="flex flex-wrap gap-3">
          {["Үнэн", "Худал"].map((option) => (
            <label
              key={option}
              className="flex min-w-[150px] items-center gap-3 rounded-xl border border-[#E4E7EC] bg-[#FCFCFD] px-4 py-3"
            >
              <input
                type="radio"
                checked={truthValue === option}
                onChange={() => onTruthChange(option)}
                disabled={disabled}
                className="h-4 w-4 border-[#D0D5DD] text-[#163D99]"
              />
              <span className="text-[14px] font-medium text-[#344054]">{option}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  if (questionType === QuestionType.ShortAnswer) {
    return (
      <div className="space-y-3">
        <h3 className="text-[14px] font-semibold text-[#101828]">Хариулт</h3>
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px]">
          <input
            value={numericAnswer}
            onChange={(event) => onNumericAnswerChange(event.target.value)}
            disabled={disabled}
            placeholder="Зөв хариуг оруулна уу"
            className="h-12 rounded-xl border border-[#D0D5DD] bg-white px-4 text-[14px] text-[#101828] outline-none placeholder:text-[#98A2B3] focus:border-[#98B7FF]"
          />
          <input
            value={tolerance}
            onChange={(event) => onToleranceChange(event.target.value)}
            disabled={disabled}
            placeholder="Хүлцэл"
            className="h-12 rounded-xl border border-[#D0D5DD] bg-white px-4 text-[14px] text-[#101828] outline-none placeholder:text-[#98A2B3] focus:border-[#98B7FF]"
          />
        </div>
      </div>
    );
  }

  if (questionType === QuestionType.Essay) {
    return (
      <div className="space-y-3">
        <h3 className="text-[14px] font-semibold text-[#101828]">
          Жишиг хариулт (заавал биш)
        </h3>
        <textarea
          value={referenceAnswer}
          onChange={(event) => onReferenceAnswerChange(event.target.value)}
          disabled={disabled}
          placeholder="Шалгахдаа ашиглах жишиг хариултыг оруулна уу..."
          className="min-h-[120px] rounded-xl border border-[#D0D5DD] bg-white px-4 py-3 text-[14px] text-[#101828] outline-none placeholder:text-[#98A2B3] focus:border-[#98B7FF]"
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-[14px] font-semibold text-[#101828]">Хариултууд (зөвийг сонгоно)</h3>
      <div className="space-y-3">
        {options.map((option, index) => (
          <CreateExamAnswerOptionRow
            key={`${index}-${option}`}
            index={index}
            value={option}
            checked={correctIndex === index}
            disabled={disabled}
            onPick={() => onPick(index)}
            onChange={(value) => onUpdate(index, value)}
            onRemove={() => onRemove(index)}
          />
        ))}
      </div>
      <button
        type="button"
        className="text-[14px] font-medium text-[#163D99] disabled:opacity-50"
        onClick={onAdd}
        disabled={disabled}
      >
        + Сонголт нэмэх
      </button>
    </div>
  );
}
