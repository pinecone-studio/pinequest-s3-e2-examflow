"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "@apollo/client/react";
import {
  ApproveExamImportJobMutationDocument,
  ClassesListDocument,
  CreateExamImportJobMutationDocument,
  QuestionBanksQueryDocument,
  useClassesListQuery,
  type ApproveExamImportJobMutationMutation,
  type ApproveExamImportJobMutationMutationVariables,
  type CreateExamImportJobMutationMutation,
  type CreateExamImportJobMutationMutationVariables,
} from "@/graphql/generated";
import {
  canFallbackWithoutStoredUpload,
  extractPdfImportContent,
  uploadPdfImportFile,
} from "./pdf-import-extraction-service";
import { buildExamEditHref, buildReviewSummary, toApprovedQuestionInput } from "./pdf-import-review-helpers";
import { buildImportJobView, type ImportJobView, type ImportQuestionView } from "./pdf-import-dialog-utils";

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message && !error.message.includes("Received status code 400")) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    const candidate = error as {
      message?: unknown;
      bodyText?: unknown;
      result?: { errors?: Array<{ message?: unknown }> };
      cause?: {
        message?: unknown;
        bodyText?: unknown;
        result?: { errors?: Array<{ message?: unknown }> };
      };
    };

    const graphQlMessage =
      typeof candidate.result?.errors?.[0]?.message === "string"
        ? candidate.result.errors[0].message
        : typeof candidate.cause?.result?.errors?.[0]?.message === "string"
          ? candidate.cause.result.errors[0].message
          : null;
    if (graphQlMessage) {
      return graphQlMessage;
    }

    if (typeof candidate.bodyText === "string" && candidate.bodyText.trim()) {
      return candidate.bodyText.trim();
    }

    if (typeof candidate.cause?.bodyText === "string" && candidate.cause.bodyText.trim()) {
      return candidate.cause.bodyText.trim();
    }

    if (typeof candidate.message === "string" && candidate.message) {
      return candidate.message;
    }
  }

  return "PDF импорт бэлтгэх үед алдаа гарлаа.";
};

export function usePdfImportDialog(selectedFile: File | null, open: boolean) {
  const { getToken } = useAuth();
  const [jobView, setJobView] = useState<ImportJobView | null>(null);
  const [reviewQuestions, setReviewQuestions] = useState<ImportQuestionView[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isExtractingText, setIsExtractingText] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState("");
  const classesQuery = useClassesListQuery({ fetchPolicy: "cache-and-network", ssr: false, skip: !open });
  const [createImportJob, { loading: isCreating }] = useMutation<
    CreateExamImportJobMutationMutation,
    CreateExamImportJobMutationMutationVariables
  >(CreateExamImportJobMutationDocument);
  const [approveImportJob, { loading: isApproving }] = useMutation<
    ApproveExamImportJobMutationMutation,
    ApproveExamImportJobMutationMutationVariables
  >(ApproveExamImportJobMutationDocument);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      setJobView(null);
      setReviewQuestions([]);
      setErrorMessage(null);
      setInfoMessage(null);
      setSelectedClassId("");
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(nextPreviewUrl);
    setJobView(null);
    setReviewQuestions([]);
    setErrorMessage(null);
    setInfoMessage(null);

    return () => {
      URL.revokeObjectURL(nextPreviewUrl);
    };
  }, [selectedFile]);

  useEffect(() => {
    setReviewQuestions(jobView?.questions ?? []);
  }, [jobView]);

  useEffect(() => {
    if (selectedClassId || !classesQuery.data?.classes?.length) {
      return;
    }
    setSelectedClassId(classesQuery.data.classes[0]?.id ?? "");
  }, [classesQuery.data?.classes, selectedClassId]);

  const reviewSummary = useMemo(() => buildReviewSummary(jobView, reviewQuestions), [jobView, reviewQuestions]);

  const classOptions = classesQuery.data?.classes.map((classroom) => ({ id: classroom.id, name: classroom.name })) ?? [];

  const handleImport = async () => {
    if (!selectedFile) {
      return;
    }

    try {
      setErrorMessage(null);
      setInfoMessage(null);
      setIsExtractingText(true);
      let storageKey: string | null = null;
      let storageWarning: string | null = null;

      try {
        const uploadedPdf = await uploadPdfImportFile(selectedFile, getToken);
        storageKey = uploadedPdf.key;
      } catch (error) {
        if (!canFallbackWithoutStoredUpload(error)) {
          throw error;
        }

        storageWarning =
          "Temporary PDF storage is unavailable, so this import will continue without a persisted source file.";
      }

      const extraction = await extractPdfImportContent(selectedFile, getToken, storageKey);
      const extractedText = extraction.extractedText;
      if (!extractedText.trim()) {
        throw new Error("PDF файлаас selectable text олдсонгүй.");
      }
      const result = await createImportJob({
        variables: {
          fileName: selectedFile.name,
          fileSizeBytes: selectedFile.size,
          extractedText,
          storageKey,
        },
      });
      const nextJob = result.data?.createExamImportJob;
      if (!nextJob) {
        throw new Error("PDF import job үүсгэсэн мэдээлэл ирсэнгүй.");
      }
      const extractionMessage =
        extraction.strategy === "browser-ocr"
          ? extraction.provider === "api"
            ? "Scan PDF илэрсэн тул extraction service OCR ашиглаж уншлаа. Хэрэв зарим текст зөрүүтэй бол review дээр засаад хадгална уу."
            : "Scan PDF илэрсэн тул browser OCR ашиглаж уншлаа. Хэрэв зарим текст зөрүүтэй бол review дээр засаад хадгална уу."
          : extraction.provider === "api"
            ? storageKey
              ? "PDF-г түр хадгалаад extraction API ашиглан файлын text-ийг уншлаа."
              : "PDF extraction API ашиглан файлын text-ийг уншлаа."
            : null;
      setInfoMessage([storageWarning, extractionMessage].filter(Boolean).join(" ") || null);
      setJobView(buildImportJobView(nextJob));
    } catch (error) {
      console.error("Failed to create PDF import job", error);
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsExtractingText(false);
    }
  };

  const handleApprove = async () => {
    if (!jobView) {
      return;
    }

    try {
      setErrorMessage(null);
      if (reviewQuestions.length === 0) {
        throw new Error("Дор хаяж нэг асуултыг үлдээгээд хадгална уу.");
      }
      const result = await approveImportJob({
        variables: {
          id: jobView.id,
          classId: selectedClassId,
          questions: reviewQuestions.map(toApprovedQuestionInput),
        },
        refetchQueries: [{ query: QuestionBanksQueryDocument }, { query: ClassesListDocument }],
        awaitRefetchQueries: true,
      });
      const nextJob = result.data?.approveExamImportJob;
      if (!nextJob) {
        throw new Error("PDF import approval мэдээлэл ирсэнгүй.");
      }
      setJobView(buildImportJobView(nextJob));
    } catch (error) {
      console.error("Failed to approve PDF import job", error);
      setErrorMessage(getErrorMessage(error));
    }
  };

  const updateQuestion = (questionId: string, nextQuestion: ImportQuestionView) => {
    setReviewQuestions((currentQuestions) => currentQuestions.map((question) => (question.id === questionId ? nextQuestion : question)));
  };

  const rejectQuestion = (questionId: string) => {
    setReviewQuestions((currentQuestions) => currentQuestions.filter((question) => question.id !== questionId).map((question, index) => ({ ...question, order: index + 1 })));
  };

  const examEditHref = buildExamEditHref(jobView, selectedClassId);

  return {
    classOptions,
    errorMessage,
    examEditHref,
    infoMessage,
    isApproving,
    isCreating: isCreating || isExtractingText,
    jobView,
    previewUrl,
    rejectQuestion,
    reviewQuestions,
    reviewSummary,
    selectedClassId,
    setSelectedClassId,
    handleApprove,
    handleImport,
    updateQuestion,
  };
}
