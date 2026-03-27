"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  QuestionBankVisibility,
  QuestionBanksQueryDocument,
  useCreateQuestionBankMutationMutation,
} from "@/graphql/generated";
import {
  getCurriculumGrades,
  getCurriculumSubjects,
  getCurriculumTopics,
} from "../question-bank-curriculum";
import { CloseIcon } from "../icons";
import { QuestionBankDialogFooter } from "./question-bank-dialog-actions";
import { QuestionBankDialogSelect } from "./question-bank-dialog-fields";

type QuestionBankCreateDialogProps = {
  open: boolean;
  initialGrade?: number | null;
  initialSubject?: string | null;
  initialTopic?: string | null;
  onClose: () => void;
};

const toDefaultTitle = (
  grade: number | null,
  subject: string,
  topic: string,
) => {
  if (!grade || !subject || !topic) {
    return "";
  }

  return `${grade}-р анги ${subject} · ${topic}`;
};

export function QuestionBankCreateDialog({
  open,
  initialGrade = null,
  initialSubject = null,
  initialTopic = null,
  onClose,
}: QuestionBankCreateDialogProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [grade, setGrade] = useState<string>("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [visibility, setVisibility] = useState<QuestionBankVisibility>(
    QuestionBankVisibility.Private,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createQuestionBank, { loading }] =
    useCreateQuestionBankMutationMutation();

  const gradeOptions = useMemo(
    () => getCurriculumGrades().map((value) => String(value)),
    [],
  );
  const subjectOptions = useMemo(
    () => (grade ? getCurriculumSubjects(Number(grade)).map((entry) => entry.name) : []),
    [grade],
  );
  const topicOptions = useMemo(
    () => (grade && subject ? getCurriculumTopics(Number(grade), subject) : []),
    [grade, subject],
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    const nextGrade = initialGrade ? String(initialGrade) : "";
    const nextSubject = initialSubject?.trim() ?? "";
    const nextTopic = initialTopic?.trim() ?? "";

    setGrade(nextGrade);
    setSubject(nextSubject);
    setTopic(nextTopic);
    setTitle(toDefaultTitle(initialGrade, nextSubject, nextTopic));
    setDescription("");
    setVisibility(QuestionBankVisibility.Private);
    setErrorMessage(null);
  }, [initialGrade, initialSubject, initialTopic, open]);

  if (!open) {
    return null;
  }

  const handleSubmit = async () => {
    const numericGrade = Number(grade);

    if (!numericGrade || !subject || !topic) {
      setErrorMessage("Анги, хичээл, дэд сэдвээ бүрэн сонгоно уу.");
      return;
    }

    if (!title.trim()) {
      setErrorMessage("Сангийн нэрээ оруулна уу.");
      return;
    }

    try {
      const result = await createQuestionBank({
        variables: {
          title: title.trim(),
          description: description.trim() || null,
          grade: numericGrade,
          subject,
          topic,
          visibility,
        },
        refetchQueries: [{ query: QuestionBanksQueryDocument }],
        awaitRefetchQueries: true,
      });

      const createdId = result.data?.createQuestionBank.id;

      onClose();

      if (createdId) {
        router.push(`/question-bank/${createdId}`);
      }
    } catch (error) {
      console.error("Failed to create question bank", error);
      setErrorMessage("Сан үүсгэх үед алдаа гарлаа.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[720px] rounded-xl border border-[#DFE1E5] bg-[#FAFAFA] p-6 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-semibold text-[#0F1216]">
              Асуултын сан үүсгэх
            </h2>
            <p className="mt-1 text-[14px] text-[#52555B]">
              Сангаа анги, хичээл, дэд сэдвээр нь үүсгэвэл дараа нь асуултаа цэгцтэй хадгална.
            </p>
          </div>
          <button
            type="button"
            className="rounded-md p-2 text-[#52555B] hover:bg-white"
            onClick={onClose}
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="block space-y-2">
              <span className="text-[12px] font-medium text-[#52555B]">Анги</span>
              <QuestionBankDialogSelect
                value={grade}
                onChange={(value) => {
                  setGrade(value);
                  setSubject("");
                  setTopic("");
                  setTitle(toDefaultTitle(Number(value), "", ""));
                }}
              >
                <option value="">Анги сонгох</option>
                {gradeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}-р анги
                  </option>
                ))}
              </QuestionBankDialogSelect>
            </label>
            <label className="block space-y-2">
              <span className="text-[12px] font-medium text-[#52555B]">Хичээл</span>
              <QuestionBankDialogSelect
                disabled={!grade}
                value={subject}
                onChange={(value) => {
                  setSubject(value);
                  setTopic("");
                  setTitle(toDefaultTitle(Number(grade), value, ""));
                }}
              >
                <option value="">Хичээл сонгох</option>
                {subjectOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </QuestionBankDialogSelect>
            </label>
            <label className="block space-y-2">
              <span className="text-[12px] font-medium text-[#52555B]">Дэд сэдэв</span>
              <QuestionBankDialogSelect
                disabled={!grade || !subject}
                value={topic}
                onChange={(value) => {
                  setTopic(value);
                  setTitle(toDefaultTitle(Number(grade), subject, value));
                }}
              >
                <option value="">Дэд сэдэв сонгох</option>
                {topicOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </QuestionBankDialogSelect>
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-[12px] font-medium text-[#52555B]">Сангийн нэр</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Жишээ: 10-р анги Математик · Алгебр"
                className="h-10 w-full rounded-md border border-[#DFE1E5] bg-white px-3 text-[14px] text-[#0F1216] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] placeholder:text-[#98A2B3]"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-[12px] font-medium text-[#52555B]">Харагдах байдал</span>
              <QuestionBankDialogSelect
                value={visibility}
                onChange={(value) =>
                  setVisibility(value as QuestionBankVisibility)
                }
              >
                <option value={QuestionBankVisibility.Private}>Миний сан</option>
                <option value={QuestionBankVisibility.Public}>Нэгдсэн сан</option>
              </QuestionBankDialogSelect>
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-[12px] font-medium text-[#52555B]">Тайлбар</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Энэ сэдвийн санг ямар зорилгоор ашиглах вэ?"
              className="min-h-24 w-full rounded-md border border-[#DFE1E5] bg-white px-3 py-2 text-[14px] text-[#0F1216] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] placeholder:text-[#98A2B3]"
            />
          </label>

          {errorMessage ? (
            <p className="text-[14px] text-[#B42318]">{errorMessage}</p>
          ) : null}

          <QuestionBankDialogFooter
            loading={loading}
            showLibraryAction={false}
            submitLabel="Сан үүсгэх"
            onCancel={onClose}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
