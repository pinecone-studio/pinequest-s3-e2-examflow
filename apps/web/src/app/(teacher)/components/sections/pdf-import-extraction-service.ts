"use client";

import { getApiBaseUrl } from "@/lib/graphql-endpoint";
import { extractPdfText, type PdfImportExtractionResult } from "./pdf-import-text-extractor";

export type PdfImportServiceResult = PdfImportExtractionResult & {
  provider: "api" | "client";
};

export type PdfImportUploadResult = {
  key: string;
  fileName: string;
  fileSizeBytes: number;
  contentType: string;
};

type GetToken = () => Promise<string | null>;

type ExtractionApiPayload = PdfImportServiceResult;
type UploadApiPayload = PdfImportUploadResult;

const isExtractionApiPayload = (
  value: unknown,
): value is ExtractionApiPayload =>
  typeof value === "object" &&
  value !== null &&
  "extractedText" in value &&
  typeof value.extractedText === "string" &&
  "strategy" in value &&
  typeof value.strategy === "string" &&
  "provider" in value &&
  typeof value.provider === "string";

const isUploadApiPayload = (value: unknown): value is UploadApiPayload =>
  typeof value === "object" &&
  value !== null &&
  "key" in value &&
  typeof value.key === "string" &&
  "fileName" in value &&
  typeof value.fileName === "string" &&
  "fileSizeBytes" in value &&
  typeof value.fileSizeBytes === "number" &&
  "contentType" in value &&
  typeof value.contentType === "string";

class PdfImportExtractionError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "PdfImportExtractionError";
    this.status = status;
  }
}

class PdfImportUploadError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "PdfImportUploadError";
    this.status = status;
  }
}

const parseApiResponse = async (response: Response): Promise<ExtractionApiPayload> => {
  const rawText = await response.text().catch(() => "");
  const payload = (() => {
    if (!rawText) {
      return null;
    }

    try {
      return JSON.parse(rawText) as { error?: string } | ExtractionApiPayload;
    } catch {
      return null;
    }
  })() as
    | { error?: string }
    | ExtractionApiPayload
    | null;
  const errorPayload = payload as { error?: string } | null;

  if (!response.ok) {
    throw new PdfImportExtractionError(
      response.status,
      typeof errorPayload?.error === "string"
        ? errorPayload.error
        : rawText.trim() || `PDF extraction request failed with status ${response.status}.`,
    );
  }

  if (!isExtractionApiPayload(payload)) {
    throw new PdfImportExtractionError(
      502,
      "PDF extraction API invalid response returned.",
    );
  }

  return payload;
};

const parseUploadResponse = async (response: Response): Promise<UploadApiPayload> => {
  const payload = (await response.json().catch(() => null)) as
    | { error?: string }
    | UploadApiPayload
    | null;
  const errorPayload = payload as { error?: string } | null;

  if (!response.ok) {
    throw new PdfImportUploadError(
      response.status,
      typeof errorPayload?.error === "string"
        ? errorPayload.error
        : "PDF upload request failed.",
    );
  }

  if (!isUploadApiPayload(payload)) {
    throw new PdfImportUploadError(502, "PDF upload API invalid response returned.");
  }

  return payload;
};

const extractViaApi = async (
  file: File,
  getToken: GetToken,
  storageKey?: string | null,
): Promise<ExtractionApiPayload> => {
  const token = await getToken();
  if (!token) {
    throw new PdfImportExtractionError(401, "Authentication required.");
  }

  const response = storageKey
    ? await fetch(`${getApiBaseUrl()}/imports/pdf/extract`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({ storageKey }),
      })
    : await fetch(`${getApiBaseUrl()}/imports/pdf/extract`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
        },
        body: (() => {
          const formData = new FormData();
          formData.set("file", file, file.name);
          return formData;
        })(),
      });

  return parseApiResponse(response);
};

const canRetryWithoutStoredFile = (error: unknown) =>
  error instanceof PdfImportExtractionError &&
  [400, 401, 403, 404].includes(error.status);

export const uploadPdfImportFile = async (
  file: File,
  getToken: GetToken,
): Promise<PdfImportUploadResult> => {
  const token = await getToken();
  if (!token) {
    throw new PdfImportUploadError(401, "Authentication required.");
  }

  const formData = new FormData();
  formData.set("file", file, file.name);

  const response = await fetch(`${getApiBaseUrl()}/uploads/pdf-import`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return parseUploadResponse(response);
};

export const canFallbackWithoutStoredUpload = (error: unknown) =>
  error instanceof PdfImportUploadError &&
  (error.status === 501 || error.status === 502 || error.status === 503);

const canFallbackToClient = (error: unknown) =>
  error instanceof PdfImportExtractionError;

export const extractPdfImportContent = async (
  file: File,
  getToken: GetToken,
  storageKey?: string | null,
): Promise<PdfImportServiceResult> => {
  try {
    if (storageKey) {
      try {
        return await extractViaApi(file, getToken, storageKey);
      } catch (error) {
        if (!canRetryWithoutStoredFile(error)) {
          throw error;
        }
      }
    }

    return await extractViaApi(file, getToken);
  } catch (error) {
    if (!canFallbackToClient(error)) {
      throw error;
    }

    const result = await extractPdfText(file);
    return {
      ...result,
      provider: "client",
    };
  }
};
