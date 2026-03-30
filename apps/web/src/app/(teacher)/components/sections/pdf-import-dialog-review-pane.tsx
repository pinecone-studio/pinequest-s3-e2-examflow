import Link from "next/link";
import { PdfImportDialogQuestionCard } from "./pdf-import-dialog-question-card";
import type { ImportJobView, ImportQuestionView } from "./pdf-import-dialog-utils";

export function PdfImportDialogReviewPane({
  examEditHref,
  errorMessage,
  infoMessage,
  jobView,
  onQuestionReject,
  onQuestionUpdate,
  reviewQuestions,
  reviewSummary,
}: {
  examEditHref: string | null;
  errorMessage: string | null;
  infoMessage: string | null;
  jobView: ImportJobView | null;
  onQuestionReject: (questionId: string) => void;
  onQuestionUpdate: (questionId: string, nextQuestion: ImportQuestionView) => void;
  reviewQuestions: ImportQuestionView[];
  reviewSummary: string | null;
}) {
  const isEditable = Boolean(jobView && !jobView.questionBank);

  return (
    <div className="flex min-h-0 flex-col">
      <div className="border-b border-[#EAECF0] px-6 py-4">
        <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#6B7280]">Review</p>
        <h3 className="mt-1 text-[18px] font-semibold text-[#0F1216]">
          {jobView ? jobView.title : "Draft асуулт бэлтгэх"}
        </h3>
        <p className="mt-1 text-[14px] text-[#667085]">
          {reviewSummary ??
            "Импорт эхлүүлсний дараа backend дээр draft асуултууд үүсэж энд харагдана."}
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
        {errorMessage ? (
          <div className="mb-4 rounded-2xl border border-[#FDA29B] bg-[#FEF3F2] px-4 py-3 text-[14px] text-[#B42318]">
            {errorMessage}
          </div>
        ) : null}

        {infoMessage ? (
          <div className="mb-4 rounded-2xl border border-[#B2DDFF] bg-[#F0F9FF] px-4 py-3 text-[14px] text-[#175CD3]">
            {infoMessage}
          </div>
        ) : null}

        {!jobView ? (
          <div className="rounded-[20px] border border-dashed border-[#B9CCFF] bg-[#EEF4FF] p-5">
            <p className="text-[15px] font-medium text-[#1D2939]">Сонгосон файл бэлэн байна</p>
            <p className="mt-2 text-[14px] leading-6 text-[#475467]">
              Дараагийн алхмаар import job үүсгээд, гарч ирсэн асуултын draft-уудыг багш шалгаж батална.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobView.questionBank ? (
              <div className="rounded-[20px] border border-[#ABEFC6] bg-[#ECFDF3] px-4 py-3 text-[14px] text-[#067647]">
                Асуултууд амжилттай хадгалагдлаа.{" "}
                <Link
                  href={`/question-bank/${jobView.questionBank.id}`}
                  className="font-semibold underline"
                >
                  {jobView.questionBank.title}
                </Link>
                {jobView.exam ? ` болон ${jobView.exam.className} ангид ноорог шалгалт үүслээ.` : null}
                {examEditHref ? (
                  <>
                    {" "}
                    <Link href={examEditHref} className="font-semibold underline">
                      Шалгалтыг засах руу очих
                    </Link>
                  </>
                ) : null}
              </div>
            ) : null}

            {reviewQuestions.length ? (
              reviewQuestions.map((question) => (
                <PdfImportDialogQuestionCard
                  key={question.id}
                  question={question}
                  isEditable={isEditable}
                  onReject={isEditable ? () => onQuestionReject(question.id) : undefined}
                  onUpdate={
                    isEditable ? (nextQuestion) => onQuestionUpdate(question.id, nextQuestion) : undefined
                  }
                />
              ))
            ) : (
              <div className="rounded-[20px] border border-dashed border-[#D0D5DD] bg-white px-4 py-5 text-[14px] text-[#475467]">
                Бүх draft асуултыг reject хийсэн байна. Approve хийхийн өмнө дор хаяж нэг асуулт үлдээнэ.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
