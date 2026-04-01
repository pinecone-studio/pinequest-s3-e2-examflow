"use client";

export type PositionedTextSegmentLike = {
  x: number;
  y: number;
  width?: number;
  text: string;
};

export type StructuredRow = {
  y: number;
  chunks: Array<{
    x: number;
    right: number;
    text: string;
  }>;
};

const BLOCK_Y_GAP = 18;
const CHUNK_X_GAP = 32;

const normalizeLine = (value: string) =>
  value.replace(/[ \t]+/g, " ").trim();

export const sortRows = (
  rows: StructuredRow[],
  readingOrder: "bottom-up" | "top-down",
) =>
  rows.sort((left, right) =>
    readingOrder === "bottom-up" ? right.y - left.y : left.y - right.y,
  );

export const createRowChunks = (
  segments: PositionedTextSegmentLike[],
  pageWidth: number,
  lineTolerance: number,
) => {
  const rows: Array<{
    y: number;
    parts: Array<{ x: number; right: number; text: string }>;
  }> = [];

  for (const item of segments) {
    const text = normalizeLine(item.text);
    if (!text) {
      continue;
    }

    const existingRow = rows.find((row) => Math.abs(row.y - item.y) <= lineTolerance);
    const part = {
      x: item.x,
      right: item.x + Math.max(item.width ?? 0, text.length * 5),
      text,
    };

    if (existingRow) {
      existingRow.parts.push(part);
      continue;
    }

    rows.push({ y: item.y, parts: [part] });
  }

  return rows.map((row) => {
    const chunks: StructuredRow["chunks"] = [];

    for (const part of row.parts.sort((left, right) => left.x - right.x)) {
      const currentChunk = chunks[chunks.length - 1];
      if (!currentChunk) {
        chunks.push({ x: part.x, right: part.right, text: part.text });
        continue;
      }

      if (part.x - currentChunk.right > Math.max(CHUNK_X_GAP, pageWidth * 0.08)) {
        chunks.push({ x: part.x, right: part.right, text: part.text });
        continue;
      }

      currentChunk.text = normalizeLine(`${currentChunk.text} ${part.text}`);
      currentChunk.right = Math.max(currentChunk.right, part.right);
    }

    return { y: row.y, chunks };
  });
};

export const pushTextLine = (
  lines: string[],
  text: string,
  previousY: number | null,
  currentY: number,
) => {
  if (previousY !== null && Math.abs(currentY - previousY) > BLOCK_Y_GAP) {
    lines.push("");
  }

  lines.push(normalizeLine(text));
};

export const buildSingleColumnText = (
  rows: StructuredRow[],
  readingOrder: "bottom-up" | "top-down",
) => {
  const lines: string[] = [];
  let previousRowY: number | null = null;

  for (const row of sortRows([...rows], readingOrder)) {
    pushTextLine(
      lines,
      row.chunks.map((chunk) => chunk.text).filter(Boolean).join(" "),
      previousRowY,
      row.y,
    );
    previousRowY = row.y;
  }

  return lines;
};
