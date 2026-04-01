"use client";

import type {
  PdfImportBlock,
  PdfImportBbox,
  PdfImportLine,
  PdfImportPage,
  PdfImportToken,
  PositionedSegmentInput,
} from "./pdf-import-normalized-document-types";

const BLOCK_Y_GAP = 18;
const CHUNK_X_GAP = 24;
const CENTERED_TOLERANCE_RATIO = 0.16;

const normalizeText = (value: string) => value.replace(/[ \t]+/g, " ").trim();
const createBbox = (left: number, top: number, right: number, bottom: number): PdfImportBbox => ({
  x: left,
  y: top,
  width: Math.max(0, right - left),
  height: Math.max(0, bottom - top),
});
const unionBbox = (boxes: PdfImportBbox[]): PdfImportBbox =>
  createBbox(
    Math.min(...boxes.map((box) => box.x)),
    Math.min(...boxes.map((box) => box.y)),
    Math.max(...boxes.map((box) => box.x + box.width)),
    Math.max(...boxes.map((box) => box.y + box.height)),
  );

const isQuestionLead = (value: string) =>
  /^(\d{1,3})\s*(?:[\.\):]|-\s+)/u.test(value) || /^(?:асуулт|question)\s*\d{1,3}/iu.test(value);
const isOptionLead = (value: string) => /^[A-HАБВГДЕЁЖЗa-hабвгдеёжз]\s*[\.)-]\s+/u.test(value);

const isCenteredSeparator = (line: PdfImportLine, pageWidth: number) => {
  const center = line.bbox.x + line.bbox.width / 2;
  return (
    Math.abs(center - pageWidth / 2) <= pageWidth * CENTERED_TOLERANCE_RATIO &&
    /(?:олимпиад|шалгалт|тест|exam|question|асуулт|оноотой)/iu.test(line.text)
  );
};

const detectTwoColumnLayout = (lines: PdfImportLine[], pageWidth: number) => {
  let leftCount = 0;
  let rightCount = 0;
  let leftLeads = 0;
  let rightLeads = 0;

  for (const line of lines) {
    if (isCenteredSeparator(line, pageWidth)) continue;
    const center = line.bbox.x + line.bbox.width / 2;
    if (center <= pageWidth * 0.46) {
      leftCount += 1;
      if (isQuestionLead(line.text)) leftLeads += 1;
    } else if (center >= pageWidth * 0.54) {
      rightCount += 1;
      if (isQuestionLead(line.text)) rightLeads += 1;
    }
  }

  return leftCount >= 6 && rightCount >= 6 && leftLeads >= 2 && rightLeads >= 2;
};

const guessBlockType = (text: string, lineCount: number): PdfImportBlock["type"] => {
  if (/^\d+\s*[–-]\s*\d+\s*р\s+бодлого/iu.test(text) || /оноотой/iu.test(text)) return "section";
  if (isQuestionLead(text)) return "question";
  if (isOptionLead(text)) return "options";
  if (lineCount >= 2 && text.split(/\s+/u).length <= lineCount * 4) return "table";
  if (/^(?:\d+\s*-\s*р\s+анги|хугацаа\s*[–-]|тест[-\s]?\d+)/iu.test(text)) return "header";
  return "text";
};

const groupTokensIntoLines = (segments: PositionedSegmentInput[], lineTolerance: number, pageNumber: number) => {
  const rows: Array<{ y: number; tokens: PdfImportToken[] }> = [];

  for (const segment of segments) {
    const text = normalizeText(segment.text);
    if (!text) continue;

    const token: PdfImportToken = {
      text,
      bbox: createBbox(segment.x, segment.y, segment.x + Math.max(segment.width, text.length * 4), segment.y + Math.max(segment.height ?? 12, 12)),
      confidence: segment.confidence ?? null,
    };
    const existingRow = rows.find((row) => Math.abs(row.y - segment.y) <= lineTolerance);
    if (existingRow) existingRow.tokens.push(token);
    else rows.push({ y: segment.y, tokens: [token] });
  }

  return rows.map((row, rowIndex) => {
    const mergedTokens: PdfImportToken[] = [];
    for (const token of [...row.tokens].sort((left, right) => left.bbox.x - right.bbox.x)) {
      const current = mergedTokens.at(-1);
      if (!current) {
        mergedTokens.push(token);
        continue;
      }
      const currentRight = current.bbox.x + current.bbox.width;
      if (token.bbox.x - currentRight > CHUNK_X_GAP) mergedTokens.push(token);
      else {
        current.text = normalizeText(`${current.text} ${token.text}`);
        current.bbox = unionBbox([current.bbox, token.bbox]);
      }
    }

    return {
      id: `page-${pageNumber}-line-${rowIndex + 1}`,
      text: mergedTokens.map((token) => token.text).join(" "),
      bbox: unionBbox(mergedTokens.map((token) => token.bbox)),
      tokens: mergedTokens,
    } satisfies PdfImportLine;
  });
};

export const buildPdfImportPage = ({
  pageNumber,
  pageWidth,
  pageHeight,
  segments,
  lineTolerance,
  sourceEngine,
}: {
  pageNumber: number;
  pageWidth: number;
  pageHeight: number;
  segments: PositionedSegmentInput[];
  lineTolerance: number;
  sourceEngine: string;
}) => {
  const lines = groupTokensIntoLines(segments, lineTolerance, pageNumber);
  const twoColumn = detectTwoColumnLayout(lines, pageWidth);
  const blocks: PdfImportBlock[] = [];
  let currentLines: PdfImportLine[] = [];
  let currentColumn: 0 | 1 | null = null;

  const flushBlock = () => {
    if (currentLines.length === 0) return;
    const text = currentLines.map((line) => line.text).join("\n");
    blocks.push({
      id: `page-${pageNumber}-block-${blocks.length + 1}`,
      pageNumber,
      type: guessBlockType(text, currentLines.length),
      columnIndex: currentColumn,
      bbox: unionBbox(currentLines.map((line) => line.bbox)),
      text,
      lines: currentLines,
      sourceEngine,
    });
    currentLines = [];
    currentColumn = null;
  };

  for (const line of [...lines].sort((left, right) => left.bbox.y - right.bbox.y)) {
    const columnIndex: 0 | 1 | null = twoColumn
      ? isCenteredSeparator(line, pageWidth)
        ? null
        : line.bbox.x + line.bbox.width / 2 > pageWidth * 0.5
          ? 1
          : 0
      : 0;
    const previous = currentLines.at(-1);
    const gap = previous ? line.bbox.y - (previous.bbox.y + previous.bbox.height) : 0;
    if (previous && (gap > BLOCK_Y_GAP || currentColumn !== columnIndex || isCenteredSeparator(line, pageWidth))) flushBlock();
    currentLines.push(line);
    currentColumn = columnIndex;
  }

  flushBlock();
  return {
    number: pageNumber,
    width: pageWidth,
    height: pageHeight,
    layout: twoColumn ? "two-column" : "single-column",
    blocks,
    text: blocks.map((block) => block.text).join("\n\n").trim(),
  } satisfies PdfImportPage;
};
