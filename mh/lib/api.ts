import type { FieldErrors, PredictionResponse, StudentData } from "@/types/prediction";
import { FIELD_ORDER } from "@/lib/validation";

// The one place the backend URL is read. Set NEXT_PUBLIC_API_URL in .env.local.
const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "https://mental-health-prediction2.onrender.com").replace(/\/+$/, "");
const TIMEOUT_MS = 30_000;

export type ApiErrorKind = "network" | "validation" | "server";

export const MESSAGES = {
  network: "Unable to connect to the prediction server. Please make sure the FastAPI backend is running.",
  validation: "Please check the highlighted fields.",
  server: "Something went wrong while generating the prediction. Please try again.",
} as const;

export class ApiError extends Error {
  kind: ApiErrorKind;
  fieldErrors?: FieldErrors;
  constructor(kind: ApiErrorKind, fieldErrors?: FieldErrors) {
    super(MESSAGES[kind]);
    this.kind = kind;
    this.fieldErrors = fieldErrors;
  }
}

function fieldErrorsFromDetail(body: unknown): FieldErrors {
  const out: FieldErrors = {};
  const detail = (body as { detail?: unknown } | null)?.detail;
  if (!Array.isArray(detail)) return out;
  for (const item of detail) {
    const field = Array.isArray(item?.loc) ? item.loc[item.loc.length - 1] : undefined;
    if (typeof field === "string" && (FIELD_ORDER as string[]).includes(field)) {
      out[field as keyof StudentData] = "Please check this value.";
    }
  }
  return out;
}

export async function predictScore(data: StudentData): Promise<number> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(`${API_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      signal: controller.signal,
    });
  } catch {
    throw new ApiError("network");
  } finally {
    clearTimeout(timer);
  }

  if (res.status === 422) {
    const body = await res.json().catch(() => null);
    throw new ApiError("validation", fieldErrorsFromDetail(body));
  }
  if (!res.ok) throw new ApiError("server");

  const json = (await res.json().catch(() => null)) as Partial<PredictionResponse> | null;
  if (!json || typeof json.predicted_mental_health_score !== "number") throw new ApiError("server");
  return json.predicted_mental_health_score;
}
