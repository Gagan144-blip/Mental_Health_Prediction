// These values mirror the FastAPI `StudentData` schema exactly. Do not rename or edit them.
export const GENDERS = ["Male", "Female", "Other"] as const;
export const ACADEMIC_LEVELS = ["Undergraduate", "Graduate", "High School"] as const;
export const PLATFORMS = [
  "Facebook", "LinkedIn", "Instagram", "Snapchat", "Twitter", "YouTube",
  "TikTok", "LINE", "KakaoTalk", "VKontakte", "WhatsApp", "WeChat",
] as const;
export const PURPOSES = ["Networking", "Education", "Entertainment", "News"] as const;
export const STRESS_LEVELS = ["Low", "Medium", "High", "Very High"] as const;

export type Gender = (typeof GENDERS)[number];
export type AcademicLevel = (typeof ACADEMIC_LEVELS)[number];
export type Platform = (typeof PLATFORMS)[number];
export type Purpose = (typeof PURPOSES)[number];
export type StressLevel = (typeof STRESS_LEVELS)[number];

export interface StudentData {
  age: number;
  gender: Gender;
  country: string;
  academic_level: AcademicLevel;
  most_used_platform: Platform;
  purpose_of_use: Purpose;
  avg_daily_usage_hours: number;
  daily_unlocks: number;
  study_hours: number;
  physical_activity_hours: number;
  sleep_hours_per_night: number;
  stress_level: StressLevel;
}

export interface PredictionResponse {
  predicted_mental_health_score: number;
}

/** Form state: every field starts empty (null) until the user answers. */
export type FormState = { [K in keyof StudentData]: StudentData[K] | null };
export type FieldErrors = Partial<Record<keyof StudentData, string>>;
