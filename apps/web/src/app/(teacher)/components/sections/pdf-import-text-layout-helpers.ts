"use client";

import {
  buildSingleColumnText,
  createRowChunks,
  pushTextLine,
  sortRows,
  type PositionedTextSegmentLike,
  type StructuredRow,
} from "./pdf-import-text-layout-core";

const isCenteredSeparatorRow = (row: StructuredRow, pageWidth: number) => {
  if (row.chunks.length !== 1) {
    return false;
  }

  const [chunk] = row.chunks;
  const width = chunk.right - chunk.x;
  const center = (chunk.x + chunk.right) / 2;
  const centered = Math.abs(center - pageWidth / 2) <= pageWidth * 0.16;
  const separatorText =
    /(?:олимпиад|шалгалт|тест|exam|question|асуулт|оноотой)/iu.test(chunk.text);

  return width >= pageWidth * 0.62 || (centered && separatorText);
};

const isQuestionLeadChunk = (text: string) =>
  /^(\d{1,3})\s*(?:[\.\):]|-\s+)/u.test(text) ||
  /^(?:асуулт|question)\s*\d{1,3}/iu.test(text);

const isLikelyTwoColumnLayout = (rows: StructuredRow[], pageWidth: number) => {
  let leftCount = 0;
  let rightCount = 0;
  let leftQuestionStarts = 0;
  let rightQuestionStarts = 0;

  for (const row of rows) {
    if (isCenteredSeparatorRow(row, pageWidth)) {
      continue;
    }

    for (const chunk of row.chunks) {
      const center = (chunk.x + chunk.right) / 2;
      if (center <= pageWidth * 0.46) {
        leftCount += 1;
        if (isQuestionLeadChunk(chunk.text)) {
          leftQuestionStarts += 1;
        }
      } else if (center >= pageWidth * 0.54) {
        rightCount += 1;
        if (isQuestionLeadChunk(chunk.text)) {
          rightQuestionStarts += 1;
        }
      }
    }
  }

  return leftCount >= 6 && rightCount >= 6 && leftQuestionStarts >= 2 && rightQuestionStarts >= 2;
};

const flushColumnRows = (
  outputLines: string[],
  rows: StructuredRow[],
  readingOrder: "bottom-up" | "top-down",
) => {
  let previousRowY: number | null = null;

  for (const row of sortRows([...rows], readingOrder)) {
    pushTextLine(
      outputLines,
      row.chunks.map((chunk) => chunk.text).filter(Boolean).join(" "),
      previousRowY,
      row.y,
    );
    previousRowY = row.y;
  }
};

const buildTwoColumnText = (
  rows: StructuredRow[],
  pageWidth: number,
  readingOrder: "bottom-up" | "top-down",
) => {
  const orderedRows = sortRows([...rows], readingOrder);
  const outputLines: string[] = [];
  let leftRows: StructuredRow[] = [];
  let rightRows: StructuredRow[] = [];

  const flushColumns = () => {
    if (leftRows.length === 0 && rightRows.length === 0) {
      return;
    }

    flushColumnRows(outputLines, leftRows, readingOrder);
    if (leftRows.length > 0 && rightRows.length > 0) {
      outputLines.push("");
    }
    flushColumnRows(outputLines, rightRows, readingOrder);
    outputLines.push("");
    leftRows = [];
    rightRows = [];
  };

  for (const row of orderedRows) {
    if (isCenteredSeparatorRow(row, pageWidth)) {
      flushColumns();
      outputLines.push(row.chunks.map((chunk) => chunk.text).join(" "));
      outputLines.push("");
      continue;
    }

    const leftChunks = row.chunks.filter((chunk) => (chunk.x + chunk.right) / 2 <= pageWidth * 0.5);
    const rightChunks = row.chunks.filter(
      (chunk) => (chunk.x + chunk.right) / 2 > pageWidth * 0.5,
    );

    if (leftChunks.length > 0) {
      leftRows.push({ y: row.y, chunks: leftChunks });
    }

    if (rightChunks.length > 0) {
      rightRows.push({ y: row.y, chunks: rightChunks });
    }
  }

  flushColumns();
  return outputLines;
};

export const buildPageTextFromSegments = (
  segments: PositionedTextSegmentLike[],
  pageWidth: number,
  lineTolerance: number,
  readingOrder: "bottom-up" | "top-down",
) => {
  const rowChunks = createRowChunks(segments, pageWidth, lineTolerance);
  return isLikelyTwoColumnLayout(rowChunks, pageWidth)
    ? buildTwoColumnText(rowChunks, pageWidth, readingOrder)
    : buildSingleColumnText(rowChunks, readingOrder);
};
