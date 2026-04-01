"use client";

import { buildPageTextFromSegments } from "./pdf-import-text-layout-helpers";

export type TextItemLike = {
  str?: string;
  transform?: number[];
  width?: number;
};

export type PositionedTextSegment = {
  x: number;
  y: number;
  width?: number;
  text: string;
};

export type OcrLineLike = {
  text?: string;
  bbox?: {
    x0?: number;
    x1?: number;
    y0?: number;
  };
};

const normalizeLine = (value: string) =>
  value.replace(/[ \t]+/g, " ").trim();

export const normalizeBlock = (value: string) =>
  value
    .replace(/\u00A0/gu, " ")
    .split(/\r?\n/u)
    .map((line) => (line.trim() ? normalizeLine(line) : ""))
    .join("\n")
    .replace(/\n{3,}/gu, "\n\n")
    .trim();

export const buildStructuredPageText = (
  segments: PositionedTextSegment[],
  pageWidth: number,
  lineTolerance: number,
  readingOrder: "bottom-up" | "top-down",
) => normalizeBlock(buildPageTextFromSegments(segments, pageWidth, lineTolerance, readingOrder).join("\n"));
