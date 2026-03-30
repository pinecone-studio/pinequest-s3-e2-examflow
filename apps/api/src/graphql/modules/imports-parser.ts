import type { Difficulty, QuestionType } from "../types";

export type ParsedImportQuestion = {
  type: QuestionType;
  title: string;
  prompt: string;
  options: string[];
  answers: string[];
  score: number;
  difficulty: Difficulty;
  sourcePage: number;
  confidence: number;
  needsReview: boolean;
};

type ParserState = {
  title: string;
  questions: ParsedImportQuestion[];
};

type WorkingQuestion = ParsedImportQuestion & {
  order: number;
};

const optionLabels = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;
const cyrillicOptionLabels = ["А", "Б", "В", "Г", "Д", "Е", "Ё", "Ж", "З"] as const;
const optionLabelPattern = "[A-HАБВГДЕЁЖЗa-hабвгдеёжз]";

const questionStartPattern = /^(\d{1,3})\s*[\.\):-]\s*(.+)$/u;
const optionPattern = new RegExp(`^(${optionLabelPattern})\\s*[\\.)-]\\s*(.+)$`, "u");
const answerPattern =
  /^(correct answer|answer key|answer|зөв хариулт|хариулт|хариу)\s*[:\-]\s*(.+)$/iu;
const scorePattern = /^(score|scores|point|points|оноо)\s*[:\-]\s*(\d+)$/iu;
const pagePattern = /^(page|хуудас|хуудасны)\s*[:\-]?\s*(\d+)$/iu;

const normalizeRawTextForParsing = (rawText: string) =>
  rawText
    .replace(/\u00A0/gu, " ")
    .replace(/\r\n?/gu, "\n")
    .replace(/[ \t]+/gu, " ")
    .replace(/(?<=\S)\s+(?=\d{1,3}\s*[\.\):-]\s+)/gu, "\n")
    .replace(
      new RegExp(`(?<=\\S)\\s+(?=${optionLabelPattern}\\s*[\\.)-]\\s+)`, "gu"),
      "\n",
    )
    .replace(
      /(?<=\S)\s+(?=(correct answer|answer key|answer|зөв хариулт|хариулт|хариу)\s*[:\-])/giu,
      "\n",
    )
    .replace(/(?<=\S)\s+(?=(score|scores|point|points|оноо)\s*[:\-])/giu, "\n")
    .replace(/\n{2,}/gu, "\n")
    .trim();

const toCanonicalOptionLabel = (value: string) => {
  const normalized = value.trim().toUpperCase();
  const latinIndex = optionLabels.indexOf(normalized as (typeof optionLabels)[number]);
  if (latinIndex >= 0) {
    return optionLabels[latinIndex];
  }

  const cyrillicIndex = cyrillicOptionLabels.indexOf(
    normalized as (typeof cyrillicOptionLabels)[number],
  );
  if (cyrillicIndex >= 0) {
    return optionLabels[cyrillicIndex] ?? normalized;
  }

  return normalized;
};

const normalizeBooleanAnswer = (value: string) => {
  const normalized = value.trim().toLowerCase();
  if (["true", "үнэн", "vnen", "correct", "yes"].includes(normalized)) {
    return "True";
  }
  if (["false", "худал", "hudal", "incorrect", "no"].includes(normalized)) {
    return "False";
  }
  return value.trim();
};

const normalizeAnswers = (answers: string[], options: string[]) => {
  if (options.length === 2 && options[0] === "True" && options[1] === "False") {
    return answers.map(normalizeBooleanAnswer).filter(Boolean);
  }

  const normalizedOptions = options.map((option) => option.trim());
  return answers
    .map((answer) => {
      const normalizedAnswer = answer.trim();
      if (!normalizedAnswer) {
        return "";
      }

      const canonicalLabel = toCanonicalOptionLabel(normalizedAnswer);
      const optionIndex = optionLabels.indexOf(canonicalLabel as (typeof optionLabels)[number]);
      if (optionIndex >= 0) {
        return normalizedOptions[optionIndex] ?? normalizedAnswer;
      }

      return normalizedAnswer;
    })
    .filter(Boolean);
};

const splitAnswerValue = (value: string) =>
  value
    .split(/[,/;]|(?:\s+and\s+)|(?:\s+ба\s+)/iu)
    .map((item) => item.trim())
    .filter(Boolean);

const toDifficulty = (score: number): Difficulty => {
  if (score >= 3) {
    return "HARD";
  }
  if (score === 2) {
    return "MEDIUM";
  }
  return "EASY";
};

const toQuestionType = (question: WorkingQuestion): QuestionType => {
  const normalizedAnswers = question.answers.map((item) => item.trim().toLowerCase());
  const normalizedOptions = question.options.map((item) => item.trim().toLowerCase());
  const hasTrueFalseOptions =
    normalizedOptions.length === 2 &&
    (normalizedOptions.includes("true") || normalizedOptions.includes("үнэн")) &&
    (normalizedOptions.includes("false") || normalizedOptions.includes("худал"));

  if (
    hasTrueFalseOptions ||
    normalizedAnswers.some((item) => ["true", "false", "үнэн", "худал"].includes(item))
  ) {
    return "TRUE_FALSE";
  }

  if (question.options.length > 0) {
    return "MCQ";
  }

  return "SHORT_ANSWER";
};

const finalizeQuestion = (question: WorkingQuestion | null): ParsedImportQuestion | null => {
  if (!question) {
    return null;
  }

  const prompt = question.prompt.trim();
  if (!prompt) {
    return null;
  }

  const type = toQuestionType(question);
  const rawAnswers = question.answers.map((item) => item.trim()).filter(Boolean);
  const options =
    type === "TRUE_FALSE"
      ? ["True", "False"]
      : question.options.map((item) => item.trim()).filter(Boolean);
  const answers = normalizeAnswers(rawAnswers, options);
  const confidenceBase =
    type === "MCQ"
      ? answers.length > 0 && options.length >= 2 ? 0.88 : 0.66
      : type === "TRUE_FALSE"
        ? answers.length > 0 ? 0.9 : 0.68
        : answers.length > 0 ? 0.72 : 0.52;
  const confidence = Number(confidenceBase.toFixed(2));

  return {
    type,
    title: question.title.trim() || `Асуулт ${question.order}`,
    prompt,
    options,
    answers,
    score: question.score,
    difficulty: question.difficulty,
    sourcePage: question.sourcePage,
    confidence,
    needsReview: confidence < 0.75 || answers.length === 0,
  };
};

const createFallbackQuestion = (title: string, rawText: string): ParsedImportQuestion => ({
  type: "ESSAY",
  title: `${title} - Асуулт 1`,
  prompt: rawText.trim().slice(0, 1200),
  options: [],
  answers: [],
  score: 1,
  difficulty: "MEDIUM",
  sourcePage: 1,
  confidence: 0.41,
  needsReview: true,
});

export const parseImportedExamText = (
  rawText: string,
  fallbackTitle: string,
): ParserState => {
  const lines = normalizeRawTextForParsing(rawText)
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter(Boolean);
  const titleCandidate = lines.find(
    (line) =>
      !questionStartPattern.test(line) &&
      !optionPattern.test(line) &&
      !answerPattern.test(line) &&
      !scorePattern.test(line) &&
      !pagePattern.test(line),
  );
  const title = titleCandidate?.length ? titleCandidate.slice(0, 120) : fallbackTitle;
  const questions: ParsedImportQuestion[] = [];
  let currentQuestion: WorkingQuestion | null = null;
  let currentPage = 1;

  for (const line of lines) {
    const pageMatch = pagePattern.exec(line);
    if (pageMatch?.[2]) {
      currentPage = Number.parseInt(pageMatch[2], 10) || currentPage;
      continue;
    }

    const questionMatch = questionStartPattern.exec(line);
    if (questionMatch?.[1] && questionMatch[2]) {
      const finalized = finalizeQuestion(currentQuestion);
      if (finalized) {
        questions.push(finalized);
      }

      const order = Number.parseInt(questionMatch[1], 10) || questions.length + 1;
      const nextPrompt = questionMatch[2].trim();
      currentQuestion = {
        order,
        type: "ESSAY",
        title: `${title} - Асуулт ${order}`,
        prompt: nextPrompt,
        options: [],
        answers: [],
        score: 1,
        difficulty: "EASY",
        sourcePage: currentPage,
        confidence: 0.5,
        needsReview: true,
      };
      continue;
    }

    if (!currentQuestion) {
      continue;
    }

    const optionMatch = optionPattern.exec(line);
    if (optionMatch?.[2]) {
      currentQuestion.options.push(optionMatch[2].trim());
      continue;
    }

    const answerMatch = answerPattern.exec(line);
    if (answerMatch?.[2]) {
      currentQuestion.answers = splitAnswerValue(answerMatch[2]);
      continue;
    }

    const scoreMatch = scorePattern.exec(line);
    if (scoreMatch?.[2]) {
      const score = Number.parseInt(scoreMatch[2], 10);
      if (Number.isFinite(score) && score > 0) {
        currentQuestion.score = score;
        currentQuestion.difficulty = toDifficulty(score);
      }
      continue;
    }

    currentQuestion.prompt = `${currentQuestion.prompt} ${line}`.trim();
  }

  const finalized = finalizeQuestion(currentQuestion);
  if (finalized) {
    questions.push(finalized);
  }

  return {
    title,
    questions: questions.length > 0 ? questions : [createFallbackQuestion(title, rawText)],
  };
};
