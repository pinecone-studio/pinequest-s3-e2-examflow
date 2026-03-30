"use client";

import { getApiBaseUrl } from "@/lib/graphql-endpoint";
import { extractPdfText, type PdfImportExtractionResult } from "./pdf-import-text-extractor";

export type PdfImportServiceResult = PdfImportExtractionResult & {
  provider: "api" | "client";
};

type GetToken = () => Promise<string | null>;

type ExtractionApiPayload = PdfImportServiceResult;

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

class PdfImportExtractionError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "PdfImportExtractionError";
    this.status = status;
  }
}

const parseApiResponse = async (response: Response): Promise<ExtractionApiPayload> => {
  const payload = (await response.json().catch(() => null)) as
    | { error?: string }
    | ExtractionApiPayload
    | null;
  const errorPayload = payload as { error?: string } | null;

  if (!response.ok) {
    throw new PdfImportExtractionError(
      response.status,
      typeof errorPayload?.error === "string"
        ? errorPayload.error
        : "PDF extraction request failed.",
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

const extractViaApi = async (
  file: File,
  getToken: GetToken,
): Promise<ExtractionApiPayload> => {
  const token = await getToken();
  if (!token) {
    throw new PdfImportExtractionError(401, "Authentication required.");
  }

  const formData = new FormData();
  formData.set("file", file, file.name);

  const response = await fetch(`${getApiBaseUrl()}/imports/pdf/extract`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return parseApiResponse(response);
};

const canFallbackToClient = (error: unknown) =>
  error instanceof PdfImportExtractionError &&
  (error.status === 501 || error.status === 503 || error.status === 502);

export const extractPdfImportContent = async (
  file: File,
  getToken: GetToken,
): Promise<PdfImportServiceResult> => {
  try {
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
