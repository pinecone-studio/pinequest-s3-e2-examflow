import { QuestionType } from "@/graphql/generated";
import type { StudentExamData } from "./student-exam-room-types";

const hashString = (value: string) => {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
};

const stableShuffle = <T,>(items: T[], seed: string, getKey: (item: T) => string) =>
  items
    .map((item, index) => ({
      item,
      index,
      rank: hashString(`${seed}:${getKey(item)}:${index}`),
    }))
    .sort((left, right) => left.rank - right.rank || left.index - right.index)
    .map(({ item }) => item);

const shouldShuffleOptions = (type: QuestionType) =>
  type === QuestionType.Mcq || type === QuestionType.TrueFalse;

export const applyStudentExamShuffle = (exam: StudentExamData): StudentExamData => {
  return applyStudentExamShuffleWithSeed(exam, null);
};

export const applyStudentExamShuffleWithSeed = (
  exam: StudentExamData,
  attemptSeed: string | null,
): StudentExamData => {
  const questionSeed = attemptSeed ? `${attemptSeed}:questions` : `${exam.id}:questions`;
  const questions = exam.questions.map((item) => ({
    ...item,
    question:
      exam.shuffleAnswers && shouldShuffleOptions(item.question.type)
        ? {
            ...item.question,
            options: stableShuffle(
              item.question.options,
              attemptSeed
                ? `${attemptSeed}:${item.question.id}:answers`
                : `${exam.id}:${item.question.id}:answers`,
              (option) => option,
            ),
          }
        : item.question,
  }));

  return {
    ...exam,
    questions: exam.shuffleQuestions
      ? stableShuffle(questions, questionSeed, (item) => item.question.id)
      : questions,
  };
};
