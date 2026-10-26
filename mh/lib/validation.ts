import {
  ACADEMIC_LEVELS, GENDERS, PLATFORMS, PURPOSES, STRESS_LEVELS,
  type FieldErrors, type FormState, type StudentData,
} from "@/types/prediction";

type NumericKey =
  | "age" | "avg_daily_usage_hours" | "daily_unlocks"
  | "study_hours" | "physical_activity_hours" | "sleep_hours_per_night";

interface NumericRule { label: string; min: number; max?: number; integer?: boolean }

// Same limits as the Pydantic model in main.py.
export const NUMERIC_RULES: Record<NumericKey, NumericRule> = {
  age: { label: "Age", min: 10, max: 100, integer: true },
  avg_daily_usage_hours: { label: "Daily usage", min: 0, max: 24 },
  daily_unlocks: { label: "Daily unlocks", min: 0, integer: true },
  study_hours: { label: "Study hours", min: 0, max: 24 },
  physical_activity_hours: { label: "Physical activity", min: 0, max: 2 },
  sleep_hours_per_night: { label: "Sleep", min: 0, max: 24 },
};

const CATEGORICAL: Record<string, readonly string[]> = {
  gender: GENDERS,
  academic_level: ACADEMIC_LEVELS,
  most_used_platform: PLATFORMS,
  purpose_of_use: PURPOSES,
  stress_level: STRESS_LEVELS,
};

export const SECTION_FIELDS: Record<"personal" | "social" | "lifestyle", (keyof StudentData)[]> = {
  personal: ["age", "gender", "country", "academic_level"],
  social: ["most_used_platform", "purpose_of_use", "avg_daily_usage_hours", "daily_unlocks"],
  lifestyle: ["study_hours", "physical_activity_hours", "sleep_hours_per_night", "stress_level"],
};

export const FIELD_ORDER: (keyof StudentData)[] = [
  ...SECTION_FIELDS.personal, ...SECTION_FIELDS.social, ...SECTION_FIELDS.lifestyle,
];

export function validateField(key: keyof StudentData, value: unknown): string | null {
  if (key === "country") {
    return typeof value === "string" && value.trim() ? null : "Choose your country from the list.";
  }
  if (key in NUMERIC_RULES) {
    const rule = NUMERIC_RULES[key as NumericKey];
    if (value === null || value === undefined || typeof value !== "number" || Number.isNaN(value)) {
      return `Enter your ${rule.label.toLowerCase()}.`;
    }
    if (rule.integer && !Number.isInteger(value)) return `${rule.label} must be a whole number.`;
    if (value < rule.min || (rule.max !== undefined && value > rule.max)) {
      return rule.max !== undefined
        ? `${rule.label} must be between ${rule.min} and ${rule.max}.`
        : `${rule.label} must be ${rule.min} or more.`;
    }
    return null;
  }
  const allowed = CATEGORICAL[key];
  if (allowed) {
    return typeof value === "string" && allowed.includes(value) ? null : "Please choose one option.";
  }
  return null;
}

export function validateAll(form: FormState): FieldErrors {
  const errors: FieldErrors = {};
  for (const key of FIELD_ORDER) {
    const message = validateField(key, form[key]);
    if (message) errors[key] = message;
  }
  return errors;
}

/** Returns the exact payload the API expects, or null if anything is invalid. */
export function toStudentData(form: FormState): StudentData | null {
  if (Object.keys(validateAll(form)).length > 0) return null;
  return {
    age: form.age!, gender: form.gender!, country: form.country!.trim(),
    academic_level: form.academic_level!, most_used_platform: form.most_used_platform!,
    purpose_of_use: form.purpose_of_use!, avg_daily_usage_hours: form.avg_daily_usage_hours!,
    daily_unlocks: form.daily_unlocks!, study_hours: form.study_hours!,
    physical_activity_hours: form.physical_activity_hours!,
    sleep_hours_per_night: form.sleep_hours_per_night!, stress_level: form.stress_level!,
  };
}
