import type { ReactElement } from "react";
import { CalendarIcon, ClipboardIcon, ClockIcon } from "../icons";

type IconComponent = (props: { className?: string }) => ReactElement;

export type MetaItem = {
  icon?: IconComponent;
  text: string;
  tone?: string;
};

export type FooterData =
  | { type: "counts"; students: number; submitted: number }
  | {
      type: "summary";
      students: number;
      submitted: number;
      passRate: number;
      passed: number;
      failed: number;
      average: number;
    };

export type ExamCard = {
  id: string;
  title: string;
  status: { label: string; tone: string };
  meta: MetaItem[];
  actions: { view?: boolean; results?: boolean };
  footer?: FooterData;
  highlight?: boolean;
};

export const exams: ExamCard[] = [
  {
    id: "math-final",
    title: "Математикийн эцсийн шалгалт",
    status: {
      label: "Явагдаж буй",
      tone: "border-[#31AA4033] bg-[#31AA401A] text-[#31AA40]",
    },
    meta: [
      { icon: ClipboardIcon, text: "4 асуулт" },
      { icon: ClockIcon, text: "120 минут" },
      { text: "Математик" },
    ],
    actions: { view: true, results: true },
    footer: { type: "counts", students: 28, submitted: 22 },
    highlight: true,
  },
  {
    id: "physics-mid",
    title: "Физикийн улирлын шалгалт",
    status: {
      label: "Дууссан",
      tone: "border-[#19223033] bg-[#1922301A] text-[#192230]",
    },
    meta: [
      { icon: ClipboardIcon, text: "4 асуулт" },
      { icon: ClockIcon, text: "90 минут" },
      { text: "Физик" },
    ],
    actions: { view: true, results: true },
    footer: {
      type: "summary",
      students: 24,
      submitted: 24,
      passRate: 85,
      passed: 20,
      failed: 4,
      average: 78,
    },
  },
  {
    id: "chem-quiz",
    title: "Химийн сорил",
    status: {
      label: "Архив",
      tone: "border-[#DFE1E5] bg-[#F0F2F5] text-[#52555B]",
    },
    meta: [
      { icon: ClipboardIcon, text: "4 асуулт" },
      { icon: ClockIcon, text: "45 минут" },
      { text: "Хими" },
    ],
    actions: { view: true },
  },
  {
    id: "bio-scheduled",
    title: "Биологийн шалгалт",
    status: {
      label: "Товлогдсон",
      tone: "border-[#F63D6B33] bg-[#F63D6B1A] text-[#F63D6B]",
    },
    meta: [
      { icon: ClipboardIcon, text: "2 асуулт" },
      { icon: ClockIcon, text: "90 минут" },
      { text: "Биологи" },
      {
        icon: CalendarIcon,
        text: "2 сар 20, 8:00 AM",
        tone: "text-[#F63D6B]",
      },
    ],
    actions: { view: true },
  },
  {
    id: "physics-elective",
    title: "Сонгон физикийн шалгалт",
    status: {
      label: "Явагдаж буй",
      tone: "border-[#31AA4033] bg-[#31AA401A] text-[#31AA40]",
    },
    meta: [
      { icon: ClipboardIcon, text: "4 асуулт" },
      { icon: ClockIcon, text: "60 минут" },
      { text: "Физик" },
    ],
    actions: { view: true, results: true },
    footer: { type: "counts", students: 24, submitted: 15 },
  },
];
