import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

const LINE_Y_TOLERANCE = 4;
const BLOCK_Y_GAP = 18;
const CHUNK_X_GAP = 32;

const normalizeLine = (value) => value.replace(/[ \t]+/g, " ").trim();

const normalizeBlock = (value) =>
  value
    .split(/\r?\n/u)
    .map((line) => (line.trim() ? normalizeLine(line) : ""))
    .join("\n")
    .replace(/\n{3,}/gu, "\n\n")
    .trim();

const sortRows = (rows) => rows.sort((left, right) => right.y - left.y);

const createRows = (items) => {
  const rows = [];

  for (const item of items) {
    const text = normalizeLine("str" in item ? item.str ?? "" : "");
    if (!text) {
      continue;
    }

    const x = Array.isArray(item.transform) ? item.transform[4] ?? 0 : 0;
    const y = Array.isArray(item.transform) ? item.transform[5] ?? 0 : 0;
    const width = typeof item.width === "number" ? item.width : text.length * 5;
    const existingRow = rows.find((row) => Math.abs(row.y - y) <= LINE_Y_TOLERANCE);
    const part = { x, right: x + Math.max(width, text.length * 5), text };

    if (existingRow) {
      existingRow.parts.push(part);
    } else {
      rows.push({ y, parts: [part] });
    }
  }

  return rows;
};

const createRowChunks = (rows, pageWidth) =>
  rows.map((row) => {
    const chunks = [];

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

const isCenteredSeparatorRow = (row, pageWidth) => {
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

const isQuestionLeadChunk = (text) =>
  /^(\d{1,3})\s*(?:[\.\):]|-\s+)/u.test(text) ||
  /^(?:асуулт|question)\s*\d{1,3}/iu.test(text);

const isLikelyTwoColumnLayout = (rows, pageWidth) => {
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

const pushTextLine = (lines, text, previousY, currentY) => {
  if (previousY !== null && Math.abs(currentY - previousY) > BLOCK_Y_GAP) {
    lines.push("");
  }

  lines.push(normalizeLine(text));
};

const buildSingleColumnText = (rows) => {
  const lines = [];
  let previousRowY = null;

  for (const row of sortRows([...rows])) {
    pushTextLine(
      lines,
      row.chunks.map((chunk) => chunk.text).filter(Boolean).join(" "),
      previousRowY,
      row.y,
    );
    previousRowY = row.y;
  }

  return normalizeBlock(lines.join("\n"));
};

const flushColumnRows = (lines, rows) => {
  let previousRowY = null;

  for (const row of sortRows([...rows])) {
    pushTextLine(
      lines,
      row.chunks.map((chunk) => chunk.text).filter(Boolean).join(" "),
      previousRowY,
      row.y,
    );
    previousRowY = row.y;
  }
};

const buildTwoColumnText = (rows, pageWidth) => {
  const orderedRows = sortRows([...rows]);
  const outputLines = [];
  let leftRows = [];
  let rightRows = [];

  const flushColumns = () => {
    if (leftRows.length === 0 && rightRows.length === 0) {
      return;
    }

    flushColumnRows(outputLines, leftRows);
    if (leftRows.length > 0 && rightRows.length > 0) {
      outputLines.push("");
    }
    flushColumnRows(outputLines, rightRows);
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

    const leftChunks = [];
    const rightChunks = [];
    for (const chunk of row.chunks) {
      const center = (chunk.x + chunk.right) / 2;
      if (center <= pageWidth * 0.5) {
        leftChunks.push(chunk);
      } else {
        rightChunks.push(chunk);
      }
    }

    if (leftChunks.length > 0) {
      leftRows.push({ y: row.y, chunks: leftChunks });
    }

    if (rightChunks.length > 0) {
      rightRows.push({ y: row.y, chunks: rightChunks });
    }
  }

  flushColumns();
  return normalizeBlock(outputLines.join("\n"));
};

const extractStructuredPageText = (items, pageWidth) => {
  const rowChunks = createRowChunks(createRows(items), pageWidth);
  if (!isLikelyTwoColumnLayout(rowChunks, pageWidth)) {
    return buildSingleColumnText(rowChunks);
  }

  return buildTwoColumnText(rowChunks, pageWidth);
};

export async function extractPdfTextFromBuffer(buffer) {
  const task = pdfjs.getDocument({
    data: new Uint8Array(buffer),
    disableWorker: true,
    isEvalSupported: false,
    useWorkerFetch: false,
  });

  const pdf = await task.promise;
  const pages = [];

  try {
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      const viewport = page.getViewport({ scale: 1 });
      const text = extractStructuredPageText(content.items, viewport.width);

      if (text) {
        pages.push(`Page ${pageNumber}`);
        pages.push(text);
      }
    }
  } finally {
    await pdf.destroy();
  }

  return pages.join("\n").trim();
}
