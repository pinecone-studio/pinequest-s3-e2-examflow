"use client";

import { ExamStatus, type MyExamsSectionQueryQuery } from "@/graphql/generated";

type QueryExam = MyExamsSectionQueryQuery["exams"][number];

export type PlannerEvent = {
  id: string;
  status: ExamStatus;
  timeLabel: string;
  title: string;
};

export type PlannerDay = {
  dayOfMonth: number;
  events: PlannerEvent[];
  inMonth: boolean;
  key: string;
};

const formatTwoDigits = (value: number) => String(value).padStart(2, "0");

const formatKey = (date: Date) =>
  `${date.getFullYear()}-${formatTwoDigits(date.getMonth() + 1)}-${formatTwoDigits(date.getDate())}`;

const parseDate = (value: string | null | undefined) => {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatClock = (date: Date) =>
  `${formatTwoDigits(date.getHours())}:${formatTwoDigits(date.getMinutes())}`;

const getMonthStart = (value: string) => {
  const [year, month] = value.split("-").map((item) => Number.parseInt(item, 10));
  return new Date(year, Math.max(0, month - 1), 1);
};

export const formatMonthLabel = (value: string) =>
  getMonthStart(value).toLocaleString("mn-MN", { month: "long", year: "numeric" });

export const buildMonthOptions = (anchor = new Date()) =>
  Array.from({ length: 12 }, (_, index) => {
    const month = new Date(anchor.getFullYear(), anchor.getMonth() - 2 + index, 1);
    const value = `${month.getFullYear()}-${formatTwoDigits(month.getMonth() + 1)}`;
    return { label: formatMonthLabel(value), value };
  });

export const buildPlannerCalendar = (monthValue: string, exams: QueryExam[]): PlannerDay[] => {
  const monthStart = getMonthStart(monthValue);
  const gridStart = new Date(monthStart);
  gridStart.setDate(monthStart.getDate() - monthStart.getDay());

  const eventsByDay = new Map<string, PlannerEvent[]>();

  exams.forEach((exam) => {
    const start = parseDate(exam.scheduledFor ?? exam.startedAt ?? exam.createdAt);
    if (!start) {
      return;
    }

    const end = parseDate(exam.endsAt);
    const timeLabel =
      exam.status === ExamStatus.Closed && !end
        ? "Дууссан"
        : end
          ? `${formatClock(start)} - ${formatClock(end)}`
          : `${formatClock(start)} эхэлнэ`;
    const key = formatKey(start);
    const current = eventsByDay.get(key) ?? [];

    current.push({
      id: exam.id,
      status: exam.status,
      timeLabel,
      title: exam.title,
    });
    eventsByDay.set(key, current);
  });

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    const key = formatKey(date);

    return {
      dayOfMonth: date.getDate(),
      events: eventsByDay.get(key) ?? [],
      inMonth: date.getMonth() === monthStart.getMonth(),
      key,
    };
  });
};

export const getDefaultMonthValue = (value?: string | null) => {
  const parsed = parseDate(value ?? null);
  const date = parsed ?? new Date();
  return `${date.getFullYear()}-${formatTwoDigits(date.getMonth() + 1)}`;
};

export const toScheduledDateTimeValue = (dateKey: string) => `${dateKey}T09:00`;
