type CreateExamAnswerOptionRowProps = {
  index: number;
  value: string;
  checked: boolean;
  disabled?: boolean;
  onPick: () => void;
  onChange: (value: string) => void;
  onRemove: () => void;
};

export function CreateExamAnswerOptionRow({
  index,
  value,
  checked,
  disabled = false,
  onPick,
  onChange,
  onRemove,
}: CreateExamAnswerOptionRowProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#E4E7EC] bg-[#FCFCFD] px-3 py-3">
      <input
        type="radio"
        checked={checked}
        onChange={onPick}
        disabled={disabled}
        className="h-4 w-4 border-[#D0D5DD] text-[#163D99]"
      />
      <span className="w-6 text-[14px] font-medium text-[#344054]">
        {String.fromCharCode(65 + index)}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        placeholder={`Сонголт ${String.fromCharCode(65 + index)}`}
        className="h-11 flex-1 rounded-lg border border-[#D0D5DD] bg-white px-3 text-[14px] text-[#101828] outline-none placeholder:text-[#98A2B3] focus:border-[#98B7FF]"
      />
      <button
        type="button"
        className="text-[13px] font-medium text-[#667085] disabled:opacity-50"
        onClick={onRemove}
        disabled={disabled}
      >
        Устгах
      </button>
    </div>
  );
}
