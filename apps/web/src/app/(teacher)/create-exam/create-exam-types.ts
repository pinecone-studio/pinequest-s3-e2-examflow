import type {
  Difficulty,
  ExamGenerationMode,
  ExamMode,
  PassingCriteriaType,
  QuestionRepositoryKind,
} from "@/graphql/generated";

export type CreateExamGenerationRule = {
  id: string;
  sourceId: string;
  difficulty: Difficulty | "ALL";
  count: string;
  points: string;
};

export type CreateExamFormValues = {
  classId: string;
  title: string;
  description: string;
  durationMinutes: string;
  mode: ExamMode;
  publishOnCreate: boolean;
  scheduledFor: string;
  shuffleQuestions: boolean;
  shuffleAnswers: boolean;
  generationMode: ExamGenerationMode;
  generationRules: CreateExamGenerationRule[];
  passingCriteriaType: PassingCriteriaType;
  passingThreshold: string;
};

export type SelectedQuestionPoints = Record<string, string>;

export type CreateExamFieldErrors = {
  classId?: string;
  title?: string;
  durationMinutes?: string;
  scheduledFor?: string;
  passingThreshold?: string;
  selectedQuestions?: string;
  generationRules?: string;
  pointsByQuestionId: Record<string, string>;
};

export type CreateExamClassOption = {
  id: string;
  name: string;
  subject: string;
  grade: number;
};

export type CreateExamQuestionOption = {
  id: string;
  repositoryKind: QuestionRepositoryKind;
  title: string;
  prompt: string;
  type: string;
  difficulty: string;
  shareScope: "PRIVATE" | "COMMUNITY" | "PUBLIC";
  requiresAccessRequest: boolean;
  accessRequestStatus?: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  options: string[];
  correctAnswer?: string | null;
  tags: string[];
  createdById: string;
  createdByName: string;
  bankId: string;
  bankTitle: string;
  bankRepositoryKind: QuestionRepositoryKind;
  bankSubject: string;
  bankGrade: number;
  bankTopic: string;
  bankOwnerId: string;
};

export type CreateExamQuestionBankOption = {
  id: string;
  repositoryKind: QuestionRepositoryKind;
  title: string;
  subject: string;
  grade: number;
  topic: string;
};

export type CreateExamRuleSourceOption = {
  id: string;
  repositoryKind: QuestionRepositoryKind;
  label: string;
  grade: number;
  subject: string;
  topicGroup: string;
  bankIds: string[];
  totalQuestions: number;
  easyQuestions: number;
  mediumQuestions: number;
  hardQuestions: number;
};

export type CreateExamRulePreviewItem = {
  ruleId: string;
  label: string;
  difficultyLabel: string;
  count: number;
  questions: CreateExamQuestionOption[];
};

export type CreateExamSubmitState =
  | { status: "idle" }
  | {
      status: "success";
      action: "created" | "updated" | "published";
      examId: string;
      title: string;
      questionCount: number;
    }
  | {
      status: "error";
      message: string;
    };
