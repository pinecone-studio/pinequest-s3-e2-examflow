"use client";

import type {
  PdfImportClassifier,
  PdfImportPage,
  PdfImportStructuredDocument,
} from "./pdf-import-normalized-document-types";

export type * from "./pdf-import-normalized-document-types";
export { buildPdfImportPage } from "./pdf-import-normalized-document-layout";

export const classifyPdfImportDocument = (
  pages: PdfImportPage[],
  enginesUsed: string[],
): PdfImportClassifier => {
  const layouts = new Set(pages.map((page) => page.layout));
  const fullText = pages.map((page) => page.text).join("\n").trim();
  const tableLikeBlocks = pages
    .flatMap((page) => page.blocks)
    .filter((block) => block.type === "table").length;
  const needsOcr = fullText.length < 120;

  return {
    documentKind: needsOcr
      ? "scan"
      : enginesUsed.some((engine) => engine.includes("ocr"))
        ? "mixed"
        : "text",
    layout: layouts.size === 1 ? (pages[0]?.layout ?? "single-column") : "mixed",
    tableHeavy: tableLikeBlocks >= Math.max(2, Math.ceil(pages.length / 2)),
    needsOcr,
    recommendedEngine: needsOcr ? "ocr" : tableLikeBlocks > 0 ? "hybrid" : "text-layer",
    enginesUsed,
  };
};

export const buildPdfImportStructuredDocument = (
  pages: PdfImportPage[],
  enginesUsed: string[],
): PdfImportStructuredDocument => ({
  pages,
  fullText: pages.map((page) => `Page ${page.number}\n${page.text}`.trim()).join("\n\n").trim(),
  classifier: classifyPdfImportDocument(pages, enginesUsed),
});

export const findPdfImportSourceBlock = (
  document: PdfImportStructuredDocument | null | undefined,
  sourceBlockId: string | null | undefined,
) => {
  if (!document || !sourceBlockId) {
    return null;
  }

  for (const page of document.pages) {
    const block = page.blocks.find((candidate) => candidate.id === sourceBlockId);
    if (block) {
      return block;
    }
  }

  return null;
};
