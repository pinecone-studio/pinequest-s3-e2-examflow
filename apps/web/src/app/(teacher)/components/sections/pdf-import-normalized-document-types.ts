"use client";

export type PdfImportBbox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type PdfImportToken = {
  text: string;
  bbox: PdfImportBbox;
  confidence?: number | null;
};

export type PdfImportLine = {
  id: string;
  text: string;
  bbox: PdfImportBbox;
  tokens: PdfImportToken[];
};

export type PdfImportBlock = {
  id: string;
  pageNumber: number;
  type: "header" | "section" | "question" | "options" | "table" | "text";
  columnIndex: 0 | 1 | null;
  bbox: PdfImportBbox;
  text: string;
  lines: PdfImportLine[];
  sourceEngine: string;
};

export type PdfImportPage = {
  number: number;
  width: number;
  height: number;
  layout: "single-column" | "two-column";
  blocks: PdfImportBlock[];
  text: string;
};

export type PdfImportClassifier = {
  documentKind: "text" | "scan" | "mixed";
  layout: "single-column" | "two-column" | "mixed";
  tableHeavy: boolean;
  needsOcr: boolean;
  recommendedEngine: "text-layer" | "ocr" | "hybrid";
  enginesUsed: string[];
};

export type PdfImportStructuredDocument = {
  pages: PdfImportPage[];
  fullText: string;
  classifier: PdfImportClassifier;
};

export type PositionedSegmentInput = {
  x: number;
  y: number;
  width: number;
  height?: number;
  text: string;
  confidence?: number | null;
};
