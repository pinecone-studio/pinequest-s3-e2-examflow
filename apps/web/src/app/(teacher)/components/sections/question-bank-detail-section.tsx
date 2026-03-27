"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  type ExamStatus,
  useMyExamsQueryQuery,
  useQuestionBankDetailQueryQuery,
} from "@/graphql/generated";
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  FilterIcon,
  PlusIcon,
  SearchIcon,
} from "../icons";
import {
  buildQuestionBankRows,
  type QuestionUsageStats,
} from "../question-bank-utils";
import { QuestionBankDetailTable } from "./question-bank-detail-table";
import {
  QuestionBankRelatedExams,
  type QuestionBankRelatedExamRow,
} from "./question-bank-related-exams";

const SELECT_STYLE =
  "h-9 w-full cursor-pointer appearance-none rounded-md border border-[#DFE1E5] bg-white px-3 pr-9 text-[14px] text-[#0F1216] shadow-[0px_1px_2px_rgba(0,0,0,0.05)]";

const FilterSelect = ({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) => (
  <label className="relative block min-w-[150px]">
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={SELECT_STYLE}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
    <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#52555B]" />
  </label>
);

type QuestionBankDetailSectionProps = {
  bankId: string;
  onAddQuestion: () => void;
  onSubjectChange: (subject: string) => void;
};

type DetailTab = "questions" | "related-exams";

export function QuestionBankDetailSection({
  bankId,
  onAddQuestion,
  onSubjectChange,
}: QuestionBankDetailSectionProps) {
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState("Бүх сэдэв");
  const [difficulty, setDifficulty] = useState("Бүх түвшин");
  const [type, setType] = useState("Бүх төрөл");
  const [activeTab, setActiveTab] = useState<DetailTab>("questions");
  const { data, loading, error } = useQuestionBankDetailQueryQuery({
    variables: { id: bankId },
    fetchPolicy: "cache-and-network",
  });
  const examsQuery = useMyExamsQueryQuery({
    fetchPolicy: "cache-and-network",
  });

  const bank = data?.questionBank ?? null;
  const questionUsageStats = useMemo<QuestionUsageStats>(() => {
    const stats: QuestionUsageStats = {};
    const bankQuestionIds = new Set(bank?.questions.map((question) => question.id) ?? []);

    if (!bankQuestionIds.size) {
      return stats;
    }

    const usageByQuestionId = new Map<
      string,
      { usedCount: number; totalPercent: number; scoredCount: number }
    >();

    for (const exam of examsQuery.data?.exams ?? []) {
      const pointsByQuestionId = new Map(
        exam.questions.map((examQuestion) => [
          examQuestion.question.id,
          examQuestion.points,
        ]),
      );

      for (const examQuestion of exam.questions) {
        if (!bankQuestionIds.has(examQuestion.question.id)) {
          continue;
        }

        const current = usageByQuestionId.get(examQuestion.question.id) ?? {
          usedCount: 0,
          totalPercent: 0,
          scoredCount: 0,
        };

        current.usedCount += 1;

        for (const attempt of exam.attempts) {
          for (const answer of attempt.answers) {
            if (answer.question.id !== examQuestion.question.id) {
              continue;
            }

            const points = pointsByQuestionId.get(answer.question.id) ?? 0;

            if (!points) {
              continue;
            }

            const answerScore =
              (answer.autoScore ?? 0) + (answer.manualScore ?? 0);
            current.totalPercent += (answerScore / points) * 100;
            current.scoredCount += 1;
          }
        }

        usageByQuestionId.set(examQuestion.question.id, current);
      }
    }

    for (const [questionId, usage] of usageByQuestionId.entries()) {
      stats[questionId] = {
        usedCount: usage.usedCount,
        averageScorePercent: usage.scoredCount
          ? usage.totalPercent / usage.scoredCount
          : null,
      };
    }

    return stats;
  }, [bank?.questions, examsQuery.data?.exams]);
  const relatedExams = useMemo<QuestionBankRelatedExamRow[]>(() => {
    const bankQuestionIds = new Set(bank?.questions.map((question) => question.id) ?? []);

    if (!bankQuestionIds.size) {
      return [];
    }

    const rows = (examsQuery.data?.exams ?? [])
      .map((exam) => {
        const reusedQuestionCount = exam.questions.filter((examQuestion) =>
          bankQuestionIds.has(examQuestion.question.id),
        ).length;

        if (!reusedQuestionCount) {
          return null;
        }

        return {
          id: exam.id,
          title: exam.title,
          className: exam.class.name,
          questionCount: exam.questions.length,
          reusedQuestionCount,
          status: exam.status as ExamStatus,
          isTemplate: exam.isTemplate,
          createdAt: exam.createdAt,
        };
      })
      .filter((row): row is QuestionBankRelatedExamRow => Boolean(row))
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt));

    return rows;
  }, [bank?.questions, examsQuery.data?.exams]);
  const rowState = useMemo(() => {
    try {
      return {
        rows: bank ? buildQuestionBankRows(bank.questions, questionUsageStats) : [],
        mappingError: null as string | null,
      };
    } catch (mappingError) {
      console.error("Failed to build question bank detail rows", mappingError);
      return {
        rows: [],
        mappingError: "Асуултын мөрүүдийг боловсруулах үед алдаа гарлаа.",
      };
    }
  }, [bank, questionUsageStats]);
  const rows = rowState.rows;
  const errorMessage =
    rowState.mappingError ??
    (error ? "Асуултын сангийн дэлгэрэнгүйг уншихад алдаа гарлаа." : null);

  useEffect(() => {
    try {
      onSubjectChange(bank?.subject ?? "Хичээл");
    } catch (subjectError) {
      console.error("Failed to sync question bank subject", subjectError);
    }
  }, [bank?.subject, onSubjectChange]);

  const viewerId = data?.me?.id ?? null;
  const isEditable = Boolean(bank && viewerId && bank.owner.id === viewerId);

  const filteredRows = useMemo(() => {
    try {
      const keyword = search.trim().toLowerCase();
      return rows.filter((row) => {
        const matchesSearch = !keyword || row.text.toLowerCase().includes(keyword);
        const matchesTopic = topic === "Бүх сэдэв" || row.topic === topic;
        const matchesDifficulty =
          difficulty === "Бүх түвшин" || row.difficulty === difficulty;
        const matchesType = type === "Бүх төрөл" || row.type === type;
        return matchesSearch && matchesTopic && matchesDifficulty && matchesType;
      });
    } catch (filterError) {
      console.error("Failed to filter question bank rows", filterError);
      return rows;
    }
  }, [difficulty, rows, search, topic, type]);

  const topicOptions = ["Бүх сэдэв", ...new Set(rows.map((row) => row.topic))];
  const typeOptions = ["Бүх төрөл", ...new Set(rows.map((row) => row.type))];
  const difficultyOptions = [
    "Бүх түвшин",
    ...new Set(rows.map((row) => row.difficulty)),
  ];
  const title = bank?.title ?? "Асуултын сан";
  const subject = bank?.subject ?? "Хичээл";
  const count = bank?.questionCount ?? 0;
  return (
    <section className="mx-auto w-full max-w-[1120px] space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <Link href="/question-bank" className="mt-1 cursor-pointer rounded-md p-2 text-[#0F1216] hover:bg-white">
            <ArrowLeftIcon className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-[24px] font-semibold text-[#0F1216]">
              {loading ? (
                <span className="block h-8 w-64 animate-pulse rounded bg-[#E9EDF3]" />
              ) : (
                title
              )}
            </h1>
            <p className="mt-1 text-[14px] text-[#52555B]">
              {loading ? (
                <span className="block h-5 w-40 animate-pulse rounded bg-[#E9EDF3]" />
              ) : (
                `${subject} · ${count} асуулт · ${relatedExams.length} холбоотой шалгалт`
              )}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {bank ? (
            <Link
              href={`/create-exam?bankId=${bank.id}`}
              className="inline-flex h-9 items-center gap-2 rounded-md border border-[#00267F] bg-white px-4 text-[14px] font-medium text-[#00267F]"
            >
              Энэ сэдвээс шалгалт үүсгэх
            </Link>
          ) : null}
          <button
            type="button"
            onClick={onAddQuestion}
            disabled={!isEditable}
            className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md bg-[#00267F] px-4 text-[14px] font-medium text-white disabled:cursor-not-allowed disabled:bg-[#98A2B3]"
          >
            <PlusIcon className="h-4 w-4" />
            {isEditable ? "Асуулт нэмэх" : "Read only сан"}
          </button>
        </div>
      </div>

      {!loading && bank ? (
        <div className="flex flex-wrap items-center gap-2 text-[13px] text-[#52555B]">
          <span className="rounded-md bg-[#F2F4F7] px-2.5 py-1 font-medium text-[#344054]">
            {`${bank.grade}-р анги`}
          </span>
          <span className="rounded-md bg-[#F2F4F7] px-2.5 py-1 font-medium text-[#344054]">
            {bank.visibility === "PUBLIC" ? "Нэгдсэн сан" : "Миний сан"}
          </span>
          <span>
            {isEditable
              ? "Энэ сан дээр асуулт нэмэх, засах боломжтой."
              : `${bank.owner.fullName}-ийн хуваалцсан сан. Асуултыг зөвхөн харах боломжтой.`}
          </span>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setActiveTab("questions")}
          className={`inline-flex h-9 items-center rounded-full border px-4 text-[14px] font-medium transition ${
            activeTab === "questions"
              ? "border-[#00267F] bg-[#00267F] text-white"
              : "border-[#DFE1E5] bg-white text-[#344054] hover:border-[#BFC5D0]"
          }`}
        >
          Асуултууд
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("related-exams")}
          className={`inline-flex h-9 items-center rounded-full border px-4 text-[14px] font-medium transition ${
            activeTab === "related-exams"
              ? "border-[#00267F] bg-[#00267F] text-white"
              : "border-[#DFE1E5] bg-white text-[#344054] hover:border-[#BFC5D0]"
          }`}
        >
          Холбоотой шалгалтууд
        </button>
      </div>

      {activeTab === "questions" ? (
        <>
          <div className="rounded-xl border border-[#DFE1E5] bg-white p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
            <div className="mb-3 flex items-center gap-2 text-[14px] font-medium text-[#0F1216]">
              <FilterIcon className="h-4 w-4" />
              Шүүлтүүр
            </div>
            <div className="flex flex-col gap-3 lg:flex-row">
              <label className="relative block flex-1">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Асуулт хайх..."
                  className="h-9 w-full rounded-md border border-[#DFE1E5] bg-white px-10 text-[14px] text-[#0F1216] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] placeholder:text-[#52555B]"
                />
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#52555B]" />
              </label>
              <FilterSelect options={[subject]} value={subject} onChange={() => undefined} />
              <FilterSelect options={topicOptions} value={topic} onChange={setTopic} />
              <FilterSelect options={difficultyOptions} value={difficulty} onChange={setDifficulty} />
              <FilterSelect options={typeOptions} value={type} onChange={setType} />
            </div>
          </div>

          <QuestionBankDetailTable
            bankId={bankId}
            subject={bank?.subject ?? "Хичээл"}
            editable={isEditable}
            loading={loading}
            errorMessage={errorMessage}
            rows={filteredRows}
          />
        </>
      ) : (
        <QuestionBankRelatedExams rows={relatedExams} />
      )}
    </section>
  );
}
