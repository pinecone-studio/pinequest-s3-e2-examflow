"use client";

import type { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";

export type PdfImportExtractionResult = {
  extractedText: string;
  strategy: "text-layer" | "browser-ocr";
};

const OCR_PAGE_SCALE = 2;

const extractPageText = async (pdf: PDFDocumentProxy, pageNumber: number) => {
  const page = await pdf.getPage(pageNumber);
  const content = await page.getTextContent();
  return content.items
    .map((item) => ("str" in item ? item.str : ""))
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
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
      const pageText = result.data.text.replace(/\s+/g, " ").trim();
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
