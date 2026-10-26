"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Award, BookOpen, Film, Flame, Frown, GraduationCap, HeartPulse, Loader2, Meh,
  Newspaper, RefreshCw, School, Send, Smartphone, Smile, User, Users, AlertCircle,
} from "lucide-react";
import {
  ACADEMIC_LEVELS, GENDERS, PLATFORMS, PURPOSES, STRESS_LEVELS,
  type AcademicLevel, type FieldErrors, type FormState, type Gender, type Platform,
  type Purpose, type StressLevel, type StudentData,
} from "@/types/prediction";
import { FIELD_ORDER, SECTION_FIELDS, toStudentData, validateAll } from "@/lib/validation";
import { ApiError, MESSAGES, predictScore } from "@/lib/api";
import FormSection from "./FormSection";
import ProgressIndicator from "./ProgressIndicator";
import ResultCard from "./ResultCard";
import Disclaimer from "./Disclaimer";
import DayBar from "./DayBar";
import ChoiceCards, { type ChoiceOption } from "./fields/ChoiceCards";
import CountrySelect from "./fields/CountrySelect";
import NumberField from "./fields/NumberField";
import SliderField from "./fields/SliderField";
import { FieldError, FieldShell } from "./fields/FieldShell";

const EMPTY: FormState = {
  age: null, gender: null, country: null, academic_level: null, most_used_platform: null,
  purpose_of_use: null, avg_daily_usage_hours: null, daily_unlocks: null, study_hours: null,
  physical_activity_hours: null, sleep_hours_per_night: null, stress_level: null,
};

const ACADEMIC_OPTIONS: ChoiceOption<AcademicLevel>[] = [
  { value: "High School", label: "High School", icon: School },
  { value: "Undergraduate", label: "Undergraduate", icon: GraduationCap },
  { value: "Graduate", label: "Graduate", icon: Award },
];
const GENDER_OPTIONS: ChoiceOption<Gender>[] = GENDERS.map((g) => ({ value: g, label: g }));
const PURPOSE_OPTIONS: ChoiceOption<Purpose>[] = [
  { value: "Networking", label: "Networking", description: "Staying in touch, professional contacts", icon: Users },
  { value: "Education", label: "Education", description: "Learning and study", icon: BookOpen },
  { value: "Entertainment", label: "Entertainment", description: "Videos, memes, browsing", icon: Film },
  { value: "News", label: "News", description: "Keeping up with events", icon: Newspaper },
];
const PLATFORM_OPTIONS: ChoiceOption<Platform>[] = PLATFORMS.map((p) => ({
  value: p, label: p, monogram: p.slice(0, 1),
}));
const STRESS_OPTIONS: ChoiceOption<StressLevel>[] = [
  { value: "Low", label: "Low", description: "Mostly relaxed", icon: Smile, selectedClass: "border-emerald-700 bg-emerald-50" },
  { value: "Medium", label: "Medium", description: "Some pressure", icon: Meh, selectedClass: "border-sky-700 bg-sky-50" },
  { value: "High", label: "High", description: "Often stressed", icon: Frown, selectedClass: "border-amber-700 bg-amber-50" },
  { value: "Very High", label: "Very High", description: "Constantly stressed", icon: Flame, selectedClass: "border-red-700 bg-red-50" },
];

type Touched = Partial<Record<keyof StudentData, boolean>>;

export default function AssessmentForm() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [touched, setTouched] = useState<Touched>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<ApiError | null>(null);
  const [serverErrors, setServerErrors] = useState<FieldErrors>({});
  const [score, setScore] = useState<number | null>(null);
  const [snapshot, setSnapshot] = useState<StudentData | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const errors = useMemo(() => validateAll(form), [form]);
  const answered = FIELD_ORDER.filter((k) => !errors[k]).length;
  const percent = Math.round((answered / FIELD_ORDER.length) * 100);
  const sectionDone = (keys: (keyof StudentData)[]) => keys.every((k) => !errors[k]);

  // Bring the result (or the form) into view when switching between them, but not on first load.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    sectionRef.current?.scrollIntoView({ block: "start" });
    if (score !== null) document.getElementById("result")?.focus({ preventScroll: true });
  }, [score]);

  function set<K extends keyof StudentData>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setServerErrors((e) => ({ ...e, [key]: undefined }));
    setApiError(null);
  }
  const touch = (key: keyof StudentData) => setTouched((t) => ({ ...t, [key]: true }));
  const errorFor = (key: keyof StudentData) =>
    submitted || touched[key] ? errors[key] ?? serverErrors[key] ?? null : serverErrors[key] ?? null;

  function focusField(key: keyof StudentData) {
    const el = document.getElementById(`field-${key}`);
    el?.scrollIntoView({ block: "center" });
    el?.focus({ preventScroll: true });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setSubmitted(true);
    setApiError(null);

    const data = toStudentData(form);
    if (!data) {
      setApiError(new ApiError("validation"));
      const first = FIELD_ORDER.find((k) => errors[k]);
      if (first) focusField(first);
      return;
    }

    setLoading(true);
    try {
      const result = await predictScore(data);
      setSnapshot(data);
      setScore(result);
    } catch (err) {
      const apiErr = err instanceof ApiError ? err : new ApiError("server");
      setApiError(apiErr);
      if (apiErr.fieldErrors) setServerErrors(apiErr.fieldErrors);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setForm(EMPTY); setTouched({}); setSubmitted(false); setApiError(null);
    setServerErrors({}); setSnapshot(null); setScore(null);
  }

  return (
    <section id="assessment" ref={sectionRef} className="scroll-mt-16">
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Assessment</h2>
        <p className="mt-2 max-w-prose text-ink-soft">
          Answer as accurately as you can, using a typical day. All twelve questions are needed for a prediction.
        </p>

        {score !== null && snapshot ? (
          <div className="mt-8">
            <ResultCard score={score} data={snapshot} onEdit={() => setScore(null)} onReset={reset} />
          </div>
        ) : (
          <form noValidate onSubmit={handleSubmit} className="mt-8 space-y-5" aria-busy={loading}>
            <ProgressIndicator
              percent={percent}
              answered={answered}
              total={FIELD_ORDER.length}
              steps={[
                { label: "Personal", done: sectionDone(SECTION_FIELDS.personal) },
                { label: "Social media", done: sectionDone(SECTION_FIELDS.social) },
                { label: "Lifestyle", done: sectionDone(SECTION_FIELDS.lifestyle) },
                { label: "Prediction", done: false },
              ]}
            />

            <FormSection id="personal" title="Personal information" description="Basic details about you." icon={User}>
              <div>
                <FieldShell label="Age" htmlFor="field-age" description="Between 10 and 100 years." descId="field-age-desc">
                  <div className="flex items-center gap-2">
                    <NumberField
                      id="field-age" inputMode="numeric" value={form.age} min={10} max={100} step={1}
                      invalid={!!errorFor("age")} placeholder="21"
                      describedBy={`field-age-desc${errorFor("age") ? " field-age-err" : ""}`}
                      onChange={(v) => set("age", v)} onBlur={() => touch("age")} className="w-24"
                    />
                    <span className="text-sm text-ink-soft">years</span>
                  </div>
                  <FieldError id="field-age-err" message={errorFor("age")} />
                </FieldShell>
              </div>
              <ChoiceCards
                name="gender" legend="Gender" options={GENDER_OPTIONS} value={form.gender}
                onChange={(v) => set("gender", v)} error={errorFor("gender")} variant="chip"
                gridClass="grid-cols-3"
              />
              <FieldShell label="Country" htmlFor="field-country" description="Start typing to search." descId="field-country-desc">
                <CountrySelect
                  id="field-country" value={form.country} invalid={!!errorFor("country")}
                  describedBy={`field-country-desc${errorFor("country") ? " field-country-err" : ""}`}
                  onChange={(v) => set("country", v)} onBlur={() => touch("country")}
                />
                <FieldError id="field-country-err" message={errorFor("country")} />
              </FieldShell>
              <ChoiceCards
                name="academic_level" legend="Academic level" options={ACADEMIC_OPTIONS} value={form.academic_level}
                onChange={(v) => set("academic_level", v)} error={errorFor("academic_level")}
              />
            </FormSection>

            <FormSection id="social" title="Social media usage" description="How you use social media day to day." icon={Smartphone}>
              <ChoiceCards
                name="most_used_platform" legend="Most used platform" hint="The one you open most often."
                options={PLATFORM_OPTIONS} value={form.most_used_platform} variant="chip"
                onChange={(v) => set("most_used_platform", v)} error={errorFor("most_used_platform")}
                gridClass="grid-cols-2 sm:grid-cols-3"
              />
              <ChoiceCards
                name="purpose_of_use" legend="Main purpose of use" options={PURPOSE_OPTIONS}
                value={form.purpose_of_use} onChange={(v) => set("purpose_of_use", v)}
                error={errorFor("purpose_of_use")} gridClass="grid-cols-1 sm:grid-cols-2"
              />
              <SliderField
                name="avg_daily_usage_hours" label="Average daily usage" unit="hours/day"
                description="Total time on social media in a typical day."
                value={form.avg_daily_usage_hours} min={0} max={24} step={0.5}
                error={errorFor("avg_daily_usage_hours")}
                onChange={(v) => set("avg_daily_usage_hours", v)} onBlur={() => touch("avg_daily_usage_hours")}
              />
              <FieldShell label="Daily phone unlocks" htmlFor="field-daily_unlocks" description="Roughly how many times you unlock your phone in a day." descId="field-daily_unlocks-desc">
                <div className="flex items-center gap-2">
                  <NumberField
                    id="field-daily_unlocks" inputMode="numeric" value={form.daily_unlocks} min={0} step={1}
                    invalid={!!errorFor("daily_unlocks")} placeholder="50"
                    describedBy={`field-daily_unlocks-desc${errorFor("daily_unlocks") ? " field-daily_unlocks-err" : ""}`}
                    onChange={(v) => set("daily_unlocks", v)} onBlur={() => touch("daily_unlocks")} className="w-28"
                  />
                  <span className="text-sm text-ink-soft">unlocks/day</span>
                </div>
                <FieldError id="field-daily_unlocks-err" message={errorFor("daily_unlocks")} />
              </FieldShell>
            </FormSection>

            <FormSection id="lifestyle" title="Lifestyle and wellbeing" description="Study, movement, rest and stress." icon={HeartPulse}>
              <SliderField
                name="study_hours" label="Study hours" unit="hours/day"
                description="Time spent studying on a typical day."
                value={form.study_hours} min={0} max={24} step={0.5} error={errorFor("study_hours")}
                onChange={(v) => set("study_hours", v)} onBlur={() => touch("study_hours")}
              />
              <SliderField
                name="physical_activity_hours" label="Physical activity" unit="hours/day"
                description="Exercise, sport or active movement (up to 2 hours)."
                value={form.physical_activity_hours} min={0} max={2} step={0.25}
                error={errorFor("physical_activity_hours")}
                onChange={(v) => set("physical_activity_hours", v)} onBlur={() => touch("physical_activity_hours")}
              />
              <SliderField
                name="sleep_hours_per_night" label="Sleep" unit="hours/night"
                description="How long you usually sleep each night."
                value={form.sleep_hours_per_night} min={0} max={24} step={0.5}
                error={errorFor("sleep_hours_per_night")}
                onChange={(v) => set("sleep_hours_per_night", v)} onBlur={() => touch("sleep_hours_per_night")}
              />
              <DayBar
                sleep={form.sleep_hours_per_night} study={form.study_hours}
                screen={form.avg_daily_usage_hours} activity={form.physical_activity_hours}
              />
              <ChoiceCards
                name="stress_level" legend="Stress level" hint="How stressed you feel in general."
                options={STRESS_OPTIONS} value={form.stress_level} onChange={(v) => set("stress_level", v)}
                error={errorFor("stress_level")} gridClass="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              />
            </FormSection>

            <Disclaimer />

            {apiError && (
              <div role="alert" className="flex gap-3 rounded-xl border-2 border-red-700 bg-red-50 p-4 text-red-900">
                <AlertCircle aria-hidden className="mt-0.5 h-5 w-5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{apiError.message || MESSAGES[apiError.kind]}</p>
                  {apiError.kind !== "validation" && (
                    <button
                      type="submit"
                      disabled={loading}
                      className="mt-3 inline-flex h-10 items-center gap-2 rounded-lg border-2 border-red-700 px-4 text-sm font-semibold hover:bg-red-100 disabled:opacity-60"
                    >
                      <RefreshCw aria-hidden className="h-4 w-4" />
                      Try again
                    </button>
                  )}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex h-14 w-full items-center justify-center gap-2.5 rounded-xl bg-tide text-base font-semibold text-white shadow-card transition-colors hover:bg-tide-dark disabled:cursor-not-allowed disabled:opacity-80"
            >
              {loading ? (
                <>
                  <Loader2 aria-hidden className="h-5 w-5 animate-spin" />
                  Analyzing your responses...
                </>
              ) : (
                <>
                  <Send aria-hidden className="h-5 w-5" />
                  Predict My Score
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
