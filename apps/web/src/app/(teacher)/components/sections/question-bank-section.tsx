"use client";

import { useMemo, useState } from "react";
import { useQuestionBanksQueryQuery } from "@/graphql/generated";
import Link from "next/link";
import { BookIcon, ChevronDownIcon, PlusIcon, SearchIcon } from "../icons";
import {
  getCurriculumGrades,
  getCurriculumSubjects,
  getCurriculumTopics,
} from "../question-bank-curriculum";
import {
  formatGradeLabel,
  formatQuestionBankDate,
  formatVisibilityLabel,
  type QuestionBankItem,
} from "../question-bank-utils";
import { QuestionBankCreateDialog } from "./question-bank-create-dialog";

const QUESTION_BANK_SKELETONS = Array.from({ length: 6 }, (_, index) => index);

const SELECT_STYLE =
  "h-9 w-full cursor-pointer appearance-none rounded-md border border-[#DFE1E5] bg-white px-3 pr-9 text-[14px] text-[#0F1216] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] disabled:bg-[#F8FAFC] disabled:text-[#98A2B3]";

const TabButton = ({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex h-9 items-center rounded-full border px-4 text-[14px] font-medium transition ${
      active
        ? "border-[#00267F] bg-[#00267F] text-white"
        : "border-[#DFE1E5] bg-white text-[#344054] hover:border-[#BFC5D0]"
    }`}
  >
    {label}
  </button>
);

const FilterSelect = ({
  options,
  value,
  placeholder,
  disabled,
  onChange,
}: {
  options: string[];
  value: string;
  placeholder: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}) => (
  <label className="relative block min-w-[150px]">
    <select
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      className={SELECT_STYLE}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
    <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#52555B]" />
  </label>
);

const mapQuestionBankItems = (
  banks: {
    id: string;
    title: string;
    description?: string | null;
    grade: number;
    subject: string;
    topic: string;
    topics: string[];
    visibility: "PRIVATE" | "PUBLIC";
    questionCount: number;
    createdAt: string;
    owner: {
      id: string;
      fullName: string;
    };
  }[],
): QuestionBankItem[] =>
  banks.map((bank) => ({
    id: bank.id,
    title: bank.title,
    description: bank.description ?? "Тайлбар оруулаагүй асуултын сан",
    grade: bank.grade,
    subject: bank.subject,
    topic: bank.topic,
    topics: bank.topics,
    visibility: bank.visibility,
    ownerId: bank.owner.id,
    ownerName: bank.owner.fullName,
    questions: `${bank.questionCount} асуулт`,
    date: formatQuestionBankDate(bank.createdAt),
  }));

type LibraryTab = "public" | "mine";

export function QuestionBankSection() {
  const [activeTab, setActiveTab] = useState<LibraryTab>("public");
  const [search, setSearch] = useState("");
  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const { data, loading, error } = useQuestionBanksQueryQuery({
    fetchPolicy: "cache-and-network",
  });

  const viewerId = data?.me?.id ?? null;

  let items: QuestionBankItem[] = [];
  let errorMessage: string | null = null;

  try {
    items = mapQuestionBankItems(data?.questionBanks ?? []);
  } catch (mappingError) {
    console.error("Failed to map question banks", mappingError);
    errorMessage = "Асуултын сангийн өгөгдлийг боловсруулахад алдаа гарлаа.";
  }

  if (error) {
    errorMessage = "Асуултын сангийн мэдээллийг ачаалахад алдаа гарлаа. Дахин оролдоно уу.";
  }

  const scopedItems = useMemo(() => {
    if (!viewerId) {
      return items.filter((item) => item.visibility === "PUBLIC");
    }

    return items.filter((item) =>
      activeTab === "public"
        ? item.visibility === "PUBLIC"
        : item.ownerId === viewerId,
    );
  }, [activeTab, items, viewerId]);

  const gradeOptions = useMemo(
    () =>
      [...new Set([...getCurriculumGrades(), ...scopedItems.map((item) => item.grade)])]
        .sort((left, right) => left - right)
        .map((value) => String(value)),
    [scopedItems],
  );

  const subjectOptions = useMemo(() => {
    if (!grade) {
      return [];
    }

    const numericGrade = Number(grade);
    const fromCurriculum = getCurriculumSubjects(numericGrade).map((entry) => entry.name);
    const fromBanks = scopedItems
      .filter((item) => item.grade === numericGrade)
      .map((item) => item.subject);

    return [...new Set([...fromCurriculum, ...fromBanks])];
  }, [grade, scopedItems]);

  const topicOptions = useMemo(() => {
    if (!grade || !subject) {
      return [];
    }

    const numericGrade = Number(grade);
    const fromCurriculum = getCurriculumTopics(numericGrade, subject);
    const fromBanks = scopedItems
      .filter((item) => item.grade === numericGrade && item.subject === subject)
      .flatMap((item) => (item.topic !== "Ерөнхий" ? [item.topic] : item.topics));

    return [...new Set([...fromCurriculum, ...fromBanks])];
  }, [grade, scopedItems, subject]);

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return scopedItems.filter((item) => {
      const topicValues = item.topic !== "Ерөнхий" ? [item.topic] : item.topics;
      const matchesSearch =
        !keyword ||
        `${item.title} ${item.description} ${item.subject} ${topicValues.join(" ")} ${item.ownerName}`
          .toLowerCase()
          .includes(keyword);
      const matchesGrade = !grade || item.grade === Number(grade);
      const matchesSubject = !subject || item.subject === subject;
      const matchesTopic = !topic || topicValues.includes(topic);

      return matchesSearch && matchesGrade && matchesSubject && matchesTopic;
    });
  }, [grade, scopedItems, search, subject, topic]);

  const selectedPathLabel = useMemo(() => {
    const path = [
      grade ? `${grade}-р анги` : "Анги",
      subject || "Хичээл",
      topic || "Дэд сэдэв",
    ];

    return path.join(" / ");
  }, [grade, subject, topic]);

  return (
    <>
      <section className="mx-auto w-full max-w-[1120px] space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-[24px] font-semibold text-[#0F1216]">
              Асуултын сан
            </h1>
            <p className="mt-1 text-[14px] text-[#52555B]">
              Эхлээд анги, дараа нь хичээл, дараа нь дэд сэдвээ сонгоод тухайн сэдвийн банкууд дээр ажиллана.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-md bg-[#00267F] px-4 py-2 text-[14px] font-medium text-white"
          >
            <PlusIcon className="h-4 w-4" />
            Сан үүсгэх
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          <TabButton
            active={activeTab === "public"}
            label="Нэгдсэн сан"
            onClick={() => setActiveTab("public")}
          />
          <TabButton
            active={activeTab === "mine"}
            label="Миний сан"
            onClick={() => setActiveTab("mine")}
          />
        </div>

        <div className="rounded-xl border border-[#DFE1E5] bg-white p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-[13px] text-[#667085]">
            <span className="rounded-full bg-[#EEF4FF] px-3 py-1 font-medium text-[#175CD3]">
              1. Анги сонгоно
            </span>
            <span className="rounded-full bg-[#EEF4FF] px-3 py-1 font-medium text-[#175CD3]">
              2. Хичээл сонгоно
            </span>
            <span className="rounded-full bg-[#EEF4FF] px-3 py-1 font-medium text-[#175CD3]">
              3. Дэд сэдэв сонгоно
            </span>
          </div>
          <div className="flex flex-col gap-3 lg:flex-row">
            <FilterSelect
              options={gradeOptions.map((value) => `${value}-р анги`)}
              value={grade ? `${grade}-р анги` : ""}
              placeholder="Анги сонгох"
              onChange={(value) => {
                const nextGrade = value.replace("-р анги", "").trim();
                setGrade(nextGrade);
                setSubject("");
                setTopic("");
              }}
            />
            <FilterSelect
              options={subjectOptions}
              value={subject}
              placeholder="Хичээл сонгох"
              disabled={!grade}
              onChange={(value) => {
                setSubject(value);
                setTopic("");
              }}
            />
            <FilterSelect
              options={topicOptions}
              value={topic}
              placeholder="Дэд сэдэв сонгох"
              disabled={!grade || !subject}
              onChange={setTopic}
            />
            <label className="relative block flex-1">
              <span className="sr-only">Асуултын сан хайх</span>
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#52555B]" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Сангийн нэрээр хайх..."
                className="h-9 w-full rounded-md border border-[#DFE1E5] bg-white px-9 text-[14px] text-[#0F1216] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] placeholder:text-[#52555B]"
              />
            </label>
          </div>
          <p className="mt-4 text-[13px] text-[#667085]">
            Одоогийн сонголт: <span className="font-medium text-[#344054]">{selectedPathLabel}</span>
          </p>
        </div>

        {errorMessage ? <p className="text-[14px] text-[#B42318]">{errorMessage}</p> : null}

        {!loading && !errorMessage && !filteredItems.length ? (
          <div className="rounded-xl border border-dashed border-[#D0D5DD] bg-white p-8 text-center">
            <h2 className="text-[18px] font-semibold text-[#101828]">
              Энэ сонголт дээр асуултын сан алга байна
            </h2>
            <p className="mt-2 text-[14px] text-[#667085]">
              {grade && subject && topic
                ? `${selectedPathLabel} дээр шинэ bank үүсгээд асуултаа нэмж эхэлж болно.`
                : "Асуултын сангаа нарийсгахын тулд анги, хичээл, дэд сэдвээ сонгоно уу."}
            </p>
            {grade && subject && topic ? (
              <button
                type="button"
                onClick={() => setCreateOpen(true)}
                className="mt-4 inline-flex items-center gap-2 rounded-md bg-[#00267F] px-4 py-2 text-[14px] font-medium text-white"
              >
                <PlusIcon className="h-4 w-4" />
                Энэ сэдэвт сан үүсгэх
              </button>
            ) : null}
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {loading
            ? QUESTION_BANK_SKELETONS.map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-[#DFE1E5] bg-white p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]"
                >
                  <div className="animate-pulse">
                    <div className="flex items-start justify-between">
                      <div className="h-10 w-10 rounded-lg bg-[#E9EDF3]" />
                      <div className="h-7 w-24 rounded-md bg-[#E9EDF3]" />
                    </div>
                    <div className="mt-4 h-5 w-2/3 rounded bg-[#E9EDF3]" />
                    <div className="mt-2 h-4 w-full rounded bg-[#E9EDF3]" />
                    <div className="mt-2 h-4 w-5/6 rounded bg-[#E9EDF3]" />
                    <div className="mt-4 h-4 w-1/2 rounded bg-[#E9EDF3]" />
                    <div className="mt-4 flex items-center justify-between">
                      <div className="h-4 w-20 rounded bg-[#E9EDF3]" />
                      <div className="h-4 w-24 rounded bg-[#E9EDF3]" />
                    </div>
                  </div>
                </div>
              ))
            : null}
          {filteredItems.map((item) => (
            <Link
              key={item.id}
              href={`/question-bank/${item.id}`}
              className="relative block cursor-pointer rounded-xl border border-[#DFE1E5] bg-white p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] transition hover:-translate-y-0.5 hover:shadow-[0px_8px_24px_rgba(15,18,22,0.08)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1922301A] text-[#192230]">
                  <BookIcon className="h-5 w-5" />
                </div>
                <span
                  className={`rounded-md px-2.5 py-1 text-[12px] font-medium ${
                    item.visibility === "PUBLIC"
                      ? "bg-[#ECFDF3] text-[#027A48]"
                      : "bg-[#EEF4FF] text-[#175CD3]"
                  }`}
                >
                  {formatVisibilityLabel(item.visibility)}
                </span>
              </div>
              <h3 className="mt-4 text-[16px] font-medium text-[#0F1216]">
                {item.title}
              </h3>
              <p className="mt-1 text-[14px] text-[#52555B]">
                {item.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-md bg-[#F2F4F7] px-2.5 py-1 text-[12px] font-medium text-[#344054]">
                  {formatGradeLabel(item.grade)}
                </span>
                <span className="rounded-md bg-[#F2F4F7] px-2.5 py-1 text-[12px] font-medium text-[#344054]">
                  {item.subject}
                </span>
                <span className="rounded-md bg-[#FFF4ED] px-2.5 py-1 text-[12px] font-medium text-[#B54708]">
                  {item.topic !== "Ерөнхий" ? item.topic : item.topics[0] ?? "Ерөнхий сэдэв"}
                </span>
              </div>
              <p className="mt-3 text-[13px] text-[#667085]">
                {item.visibility === "PUBLIC"
                  ? `Хуваалцсан багш: ${item.ownerName}`
                  : "Зөвхөн танд харагдана"}
              </p>
              <div className="mt-4 flex items-center justify-between text-[14px] text-[#52555B]">
                <span>{item.questions}</span>
                <span>{item.date}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <QuestionBankCreateDialog
        open={createOpen}
        initialGrade={grade ? Number(grade) : null}
        initialSubject={subject || null}
        initialTopic={topic || null}
        onClose={() => setCreateOpen(false)}
      />
    </>
  );
}
