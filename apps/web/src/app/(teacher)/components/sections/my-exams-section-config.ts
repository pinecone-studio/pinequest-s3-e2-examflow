export type MyExamsSectionMode = "library" | "evaluation";

export const MY_EXAMS_LIBRARY_STATUS_OPTIONS = [
  "Бүх төлөв",
  "Ноорог",
];

export const MY_EXAMS_EVALUATION_STATUS_OPTIONS = [
  "Бүх төлөв",
  "Ноорог",
  "Явагдаж буй",
  "Дууссан",
];

export const getMyExamsSectionContent = (mode: MyExamsSectionMode) => ({
  title: mode === "evaluation" ? "Үнэлгээ" : "Миний шалгалтууд",
  subtitle:
    mode === "evaluation"
      ? "Ангид холбогдсон шалгалтуудын явц, үр дүнг харах"
      : "Үүсгэсэн бүх шалгалтаа ноорог байдлаар хадгалж, дараа нь сонгон ашиглах сан",
  statusOptions:
    mode === "evaluation"
      ? MY_EXAMS_EVALUATION_STATUS_OPTIONS
      : MY_EXAMS_LIBRARY_STATUS_OPTIONS,
  emptyMessage:
    mode === "evaluation"
      ? "Ангид холбогдсон шалгалт алга."
      : "Ноорог шалгалт олдсонгүй.",
});
