"use client";

import type { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";

export type PdfImportExtractionResult = {
  extractedText: string;
  strategy: "text-layer" | "browser-ocr";
};

const OCR_PAGE_SCALE = 2;
const LINE_Y_TOLERANCE = 4;
const OCR_LINE_Y_TOLERANCE = 8;
const BLOCK_Y_GAP = 18;
const CHUNK_X_GAP = 32;

type TextItemLike = {
  str?: string;
  transform?: number[];
};

type PositionedTextSegment = {
  x: number;
  y: number;
  text: string;
};

type OcrLineLike = {
  text?: string;
  bbox?: {
    x0?: number;
    y0?: number;
  };
};

const normalizeLine = (value: string) =>
  value.replace(/[ \t]+/g, " ").trim();

const normalizeBlock = (value: string) =>
  value
    .replace(/\u00A0/gu, " ")
    .split(/\r?\n/u)
    .map((line) => (line.trim() ? normalizeLine(line) : ""))
    .join("\n")
    .replace(/\n{3,}/gu, "\n\n")
    .trim();

const buildStructuredPageText = (
  segments: PositionedTextSegment[],
  pageWidth: number,
  lineTolerance: number,
  readingOrder: "bottom-up" | "top-down",
) => {
  const rows: Array<{ y: number; parts: Array<{ x: number; text: string }> }> = [];

  for (const item of segments) {
    const text = normalizeLine(item.text);
    if (!text) {
      continue;
    }

    const existingRow = rows.find((row) => Math.abs(row.y - item.y) <= lineTolerance);

    if (existingRow) {
      existingRow.parts.push({ x: item.x, text });
      continue;
    }

    rows.push({ y: item.y, parts: [{ x: item.x, text }] });
  }

  const sortedRows = rows.sort((left, right) =>
    readingOrder === "bottom-up" ? right.y - left.y : left.y - right.y,
  );
  const lines: string[] = [];
  let previousRowY: number | null = null;

  for (const row of sortedRows) {
    if (
      previousRowY !== null &&
      Math.abs(row.y - previousRowY) > BLOCK_Y_GAP
    ) {
      lines.push("");
    }

    const chunks: Array<{ x: number; text: string; lastX: number }> = [];
    for (const part of row.parts.sort((left, right) => left.x - right.x)) {
      const currentChunk = chunks[chunks.length - 1];
      if (!currentChunk) {
        chunks.push({ x: part.x, text: part.text, lastX: part.x });
        continue;
      }

      if (part.x - (currentChunk.lastX ?? currentChunk.x) > Math.max(CHUNK_X_GAP, pageWidth * 0.12)) {
        chunks.push({ x: part.x, text: part.text, lastX: part.x });
        continue;
      }

      currentChunk.text = normalizeLine(`${currentChunk.text} ${part.text}`);
      currentChunk.lastX = part.x;
    }

    lines.push(
      chunks
        .map((chunk) => normalizeLine(chunk.text))
        .filter(Boolean)
        .join(" || "),
    );
    previousRowY = row.y;
  }

  return normalizeBlock(lines.join("\n"));
};

const extractPageText = async (pdf: PDFDocumentProxy, pageNumber: number) => {
  const page = await pdf.getPage(pageNumber);
  const content = await page.getTextContent();
  const viewport = page.getViewport({ scale: 1 });
  const segments = (content.items as TextItemLike[]).map((item) => ({
    x: Array.isArray(item.transform) ? item.transform[4] ?? 0 : 0,
    y: Array.isArray(item.transform) ? item.transform[5] ?? 0 : 0,
    text: item.str ?? "",
  }));
  return buildStructuredPageText(segments, viewport.width, LINE_Y_TOLERANCE, "bottom-up");
};

const renderPdfPageToCanvas = async (pdf: PDFDocumentProxy, pageNumber: number) => {
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale: OCR_PAGE_SCALE });
  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("PDF хуудсыг OCR-д бэлтгэх canvas үүсгэж чадсангүй.");
  }

  await page.render({ canvas, canvasContext: context, viewport }).promise;
  return canvas;
};

const extractPdfTextWithOcr = async (pdf: PDFDocumentProxy) => {
  const tesseract = await import("tesseract.js");
  const worker = await tesseract.createWorker(["eng", "rus"]);
  const pages: string[] = [];

  try {
    await worker.setParameters({
      preserve_interword_spaces: "1",
      tessedit_pageseg_mode: tesseract.PSM.AUTO,
    });

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const canvas = await renderPdfPageToCanvas(pdf, pageNumber);
      const result = await worker.recognize(canvas, { rotateAuto: true });
      const ocrData = result.data as { lines?: OcrLineLike[]; text?: string };
      const lines = Array.isArray(ocrData.lines)
        ? ocrData.lines.map((line: OcrLineLike) => ({
            x: line.bbox?.x0 ?? 0,
            y: line.bbox?.y0 ?? 0,
            text: line.text ?? "",
          }))
        : [];
      const pageText =
        lines.length > 0
          ? buildStructuredPageText(lines, canvas.width, OCR_LINE_Y_TOLERANCE, "top-down")
          : normalizeBlock(ocrData.text ?? "");
      if (pageText) {
        pages.push(`Page ${pageNumber}`);
        pages.push(pageText);
      }
    }
  } finally {
    await worker.terminate();
  }

  return pages.join("\n").trim();
};

export const extractPdfText = async (file: File): Promise<PdfImportExtractionResult> => {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const buffer = await file.arrayBuffer();
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/legacy/build/pdf.worker.mjs",
    import.meta.url,
  ).toString();
  const task = pdfjs.getDocument({
    data: new Uint8Array(buffer),
    useWorkerFetch: false,
    isEvalSupported: false,
  });
  const pdf = await task.promise;
  const pages: string[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const pageText = await extractPageText(pdf, pageNumber);
    if (pageText) {
      pages.push(`Page ${pageNumber}`);
      pages.push(pageText);
    }
  }

  if (pages.length > 0) {
    return {
      extractedText: pages.join("\n").trim(),
      strategy: "text-layer",
    };
  }

  const ocrText = await extractPdfTextWithOcr(pdf);
  if (!ocrText) {
    throw new Error("PDF файлаас text эсвэл OCR үр дүн гарсангүй.");
  }

  return {
    extractedText: ocrText,
    strategy: "browser-ocr",
  };
};
