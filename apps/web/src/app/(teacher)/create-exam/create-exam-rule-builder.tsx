/* eslint-disable max-lines */
"use client";

import { Difficulty } from "@/graphql/generated";
import type {
  CreateExamGenerationRule,
  CreateExamRuleSourceOption,
} from "./create-exam-types";

type CreateExamRuleBuilderProps = {
  sourceOptions: CreateExamRuleSourceOption[];
  disabled: boolean;
  error?: string;
  rules: CreateExamGenerationRule[];
  onAddRule: () => void;
  onRemoveRule: (ruleId: string) => void;
  onUpdateRule: <K extends keyof CreateExamGenerationRule>(
    ruleId: string,
    field: K,
    value: CreateExamGenerationRule[K],
  ) => void;
};

const selectClassName =
  "h-10 rounded-[8px] border border-[#DFE1E5] bg-white px-3 text-[14px] text-[#0F1216] outline-none";

const inputClassName =
  "h-10 rounded-[8px] border border-[#DFE1E5] bg-white px-3 text-[14px] text-[#0F1216] outline-none";

export function CreateExamRuleBuilder({
  sourceOptions,
  disabled,
  error,
  rules,
  onAddRule,
  onRemoveRule,
  onUpdateRule,
}: CreateExamRuleBuilderProps) {
  const getAvailableCount = (
    option: CreateExamRuleSourceOption | undefined,
    difficulty: CreateExamGenerationRule["difficulty"],
  ) => {
    if (!option) {
      return 0;
    }

    if (difficulty === "ALL") {
      return option.totalQuestions;
    }
    if (difficulty === Difficulty.Easy) {
      return option.easyQuestions;
    }
    if (difficulty === Difficulty.Medium) {
      return option.mediumQuestions;
    }
    return option.hardQuestions;
  };

  return (
    <div className="space-y-3">
      <div className="rounded-[12px] border border-[#D0D5DD] bg-[#F8FAFC] p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[14px] font-semibold text-[#0F1216]">
              Rule-based асуулт бүрдүүлэлт
            </h3>
            <p className="mt-1 text-[13px] text-[#52555B]">
              Сан, түвшин, тоо, онооны rule-үүдээ өгвөл system шалгалтын асуултуудыг
              автоматаар бүрдүүлнэ.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex h-9 items-center rounded-[8px] bg-[#00267F] px-4 text-[13px] font-medium text-white disabled:bg-[#98A2B3]"
            disabled={disabled}
            onClick={onAddRule}
          >
            Rule нэмэх
          </button>
        </div>
      </div>

      {error ? <p className="text-[12px] text-[#B42318]">{error}</p> : null}

      <div className="space-y-3">
        {rules.map((rule, index) => (
          (() => {
            const selectedSource = sourceOptions.find((option) => option.id === rule.sourceId);
            const availableCount = getAvailableCount(selectedSource, rule.difficulty);
            const requestedCount = Number(rule.count) || 0;
            const exceedsAvailable = requestedCount > availableCount;

            return (
              <div
                key={rule.id}
                className="rounded-[12px] border border-[#DFE1E5] bg-white p-4"
              >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="text-[14px] font-medium text-[#0F1216]">
                {`Rule ${index + 1}`}
              </div>
              {rules.length > 1 ? (
                <button
                  type="button"
                  className="text-[13px] font-medium text-[#B42318]"
                  disabled={disabled}
                  onClick={() => onRemoveRule(rule.id)}
                >
                  Устгах
                </button>
              ) : null}
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <label className="grid gap-1.5">
                <span className="text-[12px] font-medium text-[#52555B]">Үндсэн сэдэв</span>
                <select
                  value={rule.sourceId}
                  disabled={disabled}
                  className={selectClassName}
                  onChange={(event) => onUpdateRule(rule.id, "sourceId", event.target.value)}
                >
                  <option value="">Үндсэн сэдэв сонгох</option>
                  {sourceOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-1.5">
                <span className="text-[12px] font-medium text-[#52555B]">Түвшин</span>
                <select
                  value={rule.difficulty}
                  disabled={disabled}
                  className={selectClassName}
                  onChange={(event) =>
                    onUpdateRule(
                      rule.id,
                      "difficulty",
                      event.target.value as CreateExamGenerationRule["difficulty"],
                    )
                  }
                >
                  <option value="ALL">Бүх түвшин</option>
                  <option value={Difficulty.Easy}>Хялбар</option>
                  <option value={Difficulty.Medium}>Дунд</option>
                  <option value={Difficulty.Hard}>Хүнд</option>
                </select>
              </label>

              <label className="grid gap-1.5">
                <span className="text-[12px] font-medium text-[#52555B]">Асуултын тоо</span>
                <input
                  value={rule.count}
                  disabled={disabled}
                  inputMode="numeric"
                  className={inputClassName}
                  onChange={(event) => onUpdateRule(rule.id, "count", event.target.value)}
                />
              </label>

              <label className="grid gap-1.5">
                <span className="text-[12px] font-medium text-[#52555B]">Нэг асуултын оноо</span>
                <input
                  value={rule.points}
                  disabled={disabled}
                  inputMode="numeric"
                  className={inputClassName}
                  onChange={(event) => onUpdateRule(rule.id, "points", event.target.value)}
                />
              </label>
            </div>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-[12px]">
                  <span className="rounded-full bg-[#F2F4F7] px-2.5 py-1 text-[#344054]">
                    {`Нийт асуулт: ${selectedSource?.totalQuestions ?? 0}`}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 ${
                      exceedsAvailable
                        ? "bg-[#FEF3F2] text-[#B42318]"
                        : "bg-[#ECFDF3] text-[#027A48]"
                    }`}
                  >
                    {`Сонгосон түвшинд боломжтой: ${availableCount}`}
                  </span>
                  {selectedSource ? (
                    <span className="text-[#667085]">
                      {`Хялбар ${selectedSource.easyQuestions} · Дунд ${selectedSource.mediumQuestions} · Хүнд ${selectedSource.hardQuestions}`}
                    </span>
                  ) : null}
                  {exceedsAvailable ? (
                    <span className="text-[#B42318]">
                      Сонгосон тоо боломжит асуултаас их байна.
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })()
        ))}
      </div>
    </div>
  );
}
