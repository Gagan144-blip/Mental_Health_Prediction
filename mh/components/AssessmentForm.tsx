"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Award, BookOpen, Film, Flame, Frown, GraduationCap, HeartPulse,
  Loader2, Meh, Newspaper, RefreshCw, School, Send, Smile, User, Users,
  AlertCircle, ArrowRight,
} from "lucide-react";
import {
  ACADEMIC_LEVELS, GENDERS, PURPOSES, STRESS_LEVELS,
  type AcademicLevel, type FieldErrors, type FormState, type Gender,
  type Platform, type Purpose, type StressLevel, type StudentData,
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
import PlatformMultiSelect from "./fields/PlatformMultiSelect";
import { FieldError, FieldShell } from "./fields/FieldShell";

/* ─── Initial state ────────────────────────────────────────────────── */
const EMPTY: FormState = {
  age: null, gender: null, country: null, academic_level: null, most_used_platform: null,
  purpose_of_use: null, avg_daily_usage_hours: null, daily_unlocks: null, study_hours: null,
  physical_activity_hours: null, sleep_hours_per_night: null, stress_level: null,
};

/* ─── Option sets ──────────────────────────────────────────────────── */
const ACADEMIC_OPTIONS: ChoiceOption<AcademicLevel>[] = [
  { value: "High School",    label: "High School",    icon: School },
  { value: "Undergraduate",  label: "Undergraduate",  icon: GraduationCap },
  { value: "Graduate",       label: "Graduate",       icon: Award },
];
const GENDER_OPTIONS: ChoiceOption<Gender>[] = GENDERS.map((g) => ({ value: g, label: g }));

const PURPOSE_OPTIONS: ChoiceOption<Purpose>[] = [
  { value: "Networking",   label: "Networking",   description: "Staying in touch, professional contacts", icon: Users },
  { value: "Education",    label: "Education",    description: "Learning and study",                      icon: BookOpen },
  { value: "Entertainment",label: "Entertainment",description: "Videos, memes, browsing",                icon: Film },
  { value: "News",         label: "News",         description: "Keeping up with events",                 icon: Newspaper },
];

const STRESS_OPTIONS: ChoiceOption<StressLevel>[] = [
  { value: "Low",       label: "Low",       description: "Mostly relaxed",     icon: Smile,
    selectedClass: "border-success bg-success/10 shadow-[0_0_0_1px_rgba(52,211,153,0.25)]" },
  { value: "Medium",    label: "Medium",    description: "Some pressure",       icon: Meh,
    selectedClass: "border-accent bg-accent/10 shadow-[0_0_0_1px_rgba(34,211,238,0.25)]" },
  { value: "High",      label: "High",      description: "Often stressed",      icon: Frown,
    selectedClass: "border-warning bg-warning/10 shadow-[0_0_0_1px_rgba(251,191,36,0.25)]" },
  { value: "Very High", label: "Very High", description: "Constantly stressed", icon: Flame,
    selectedClass: "border-danger bg-danger/10 shadow-[0_0_0_1px_rgba(248,113,113,0.25)]" },
];

type Touched = Partial<Record<keyof StudentData, boolean>>;

/* ─── Component ────────────────────────────────────────────────────── */
export default function AssessmentForm() {
  const [form,          setForm]          = useState<FormState>(EMPTY);
  const [touched,       setTouched]       = useState<Touched>({});
  const [submitted,     setSubmitted]     = useState(false);
  const [loading,       setLoading]       = useState(false);
  const [apiError,      setApiError]      = useState<ApiError | null>(null);
  const [serverErrors,  setServerErrors]  = useState<FieldErrors>({});
  const [score,         setScore]         = useState<number | null>(null);
  const [snapshot,      setSnapshot]      = useState<StudentData | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Multi-select platform state (UI-level only)
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);

  /* ─── Validation ─────────────────────────────────────────────── */
  const errors  = useMemo(() => validateAll(form), [form]);
  const answered = FIELD_ORDER.filter((k) => !errors[k]).length;
  const percent  = Math.round((answered / FIELD_ORDER.length) * 100);
  const sectionDone = (keys: (keyof StudentData)[]) => keys.every((k) => !errors[k]);

  /* ─── Scroll to result on score change ───────────────────────── */
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    sectionRef.current?.scrollIntoView({ block: "start" });
    if (score !== null) document.getElementById("result")?.focus({ preventScroll: true });
  }, [score]);

  /* ─── Form helpers ───────────────────────────────────────────── */
  function set<K extends keyof StudentData>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setServerErrors((e) => ({ ...e, [key]: undefined }));
    setApiError(null);
  }
  const touch    = (key: keyof StudentData) => setTouched((t) => ({ ...t, [key]: true }));
  const errorFor = (key: keyof StudentData) =>
    submitted || touched[key] ? errors[key] ?? serverErrors[key] ?? null : serverErrors[key] ?? null;

  function focusField(key: keyof StudentData) {
    const el = document.getElementById(`field-${key}`);
    el?.scrollIntoView({ block: "center" });
    el?.focus({ preventScroll: true });
  }

  /* ─── Platform multi-select handlers ────────────────────────── */
  function handleSelectPlatform(p: Platform) {
    setSelectedPlatforms((prev) => {
      if (prev.includes(p)) return prev;
      const next = [...prev, p];
      // Auto-select as primary if it's the first one
      if (next.length === 1) set("most_used_platform", p);
      return next;
    });
    setApiError(null);
  }

  function handleRemovePlatform(p: Platform) {
    setSelectedPlatforms((prev) => {
      const next = prev.filter((x) => x !== p);
      // If primary was removed, reset to first remaining or null
      if (form.most_used_platform === p) {
        set("most_used_platform", next.length > 0 ? next[0] : null);
      }
      return next;
    });
  }

  function handleSetPrimary(p: Platform) {
    set("most_used_platform", p);
  }

  /* ─── Submit ─────────────────────────────────────────────────── */
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
    setForm(EMPTY);
    setTouched({});
    setSubmitted(false);
    setApiError(null);
    setServerErrors({});
    setSnapshot(null);
    setScore(null);
    setSelectedPlatforms([]);
  }

  /* ─── Render ─────────────────────────────────────────────────── */
  return (
    <section id="assessment" ref={sectionRef} className="scroll-mt-16">
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">

        {/* Section header */}
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/[0.07] px-3 py-1 text-xs font-semibold tracking-widest text-accent uppercase">
          Assessment
        </div>
        <h2 className="font-display text-3xl font-bold tracking-tight text-prose-bright sm:text-4xl">
          Your Health Profile
        </h2>
        <p className="mt-2 max-w-prose text-prose-soft">
          Answer as accurately as you can using a typical day. All twelve questions are needed for a prediction.
        </p>

        {score !== null && snapshot ? (
          <div className="mt-8">
            <ResultCard score={score} data={snapshot} onEdit={() => setScore(null)} onReset={reset} />
          </div>
        ) : (
          <form noValidate onSubmit={handleSubmit} className="mt-8 space-y-5" aria-busy={loading}>

            {/* Progress indicator */}
            <ProgressIndicator
              percent={percent}
              answered={answered}
              total={FIELD_ORDER.length}
              steps={[
                { label: "Personal",     done: sectionDone(SECTION_FIELDS.personal),   index: 0 },
                { label: "Social Media", done: sectionDone(SECTION_FIELDS.social),     index: 1 },
                { label: "Lifestyle",    done: sectionDone(SECTION_FIELDS.lifestyle),  index: 2 },
                { label: "Prediction",   done: false,                                  index: 3 },
              ]}
            />

            {/* ── Section 1: Personal ─────────────────────────────── */}
            <FormSection id="personal" title="Personal Information" description="Basic details about you." icon={User}>
              <div>
                <FieldShell label="Age" htmlFor="field-age" description="Between 10 and 100 years." descId="field-age-desc">
                  <div className="flex items-center gap-3">
                    <NumberField
                      id="field-age"
                      inputMode="numeric"
                      value={form.age}
                      min={10}
                      max={100}
                      step={1}
                      invalid={!!errorFor("age")}
                      placeholder="21"
                      describedBy={`field-age-desc${errorFor("age") ? " field-age-err" : ""}`}
                      onChange={(v) => set("age", v)}
                      onBlur={() => touch("age")}
                      className="w-24"
                    />
                    <span className="text-sm text-prose-soft">years old</span>
                  </div>
                  <FieldError id="field-age-err" message={errorFor("age")} />
                </FieldShell>
              </div>

              <ChoiceCards
                name="gender"
                legend="Gender"
                options={GENDER_OPTIONS}
                value={form.gender}
                onChange={(v) => set("gender", v)}
                error={errorFor("gender")}
                variant="chip"
                gridClass="grid-cols-3"
              />

              <FieldShell label="Country" htmlFor="field-country" description="Start typing to search." descId="field-country-desc">
                <CountrySelect
                  id="field-country"
                  value={form.country}
                  invalid={!!errorFor("country")}
                  describedBy={`field-country-desc${errorFor("country") ? " field-country-err" : ""}`}
                  onChange={(v) => set("country", v)}
                  onBlur={() => touch("country")}
                />
                <FieldError id="field-country-err" message={errorFor("country")} />
              </FieldShell>

              <ChoiceCards
                name="academic_level"
                legend="Academic Level"
                options={ACADEMIC_OPTIONS}
                value={form.academic_level}
                onChange={(v) => set("academic_level", v)}
                error={errorFor("academic_level")}
              />
            </FormSection>

            {/* ── Section 2: Social Media ──────────────────────────── */}
            <FormSection id="social" title="Social Media Usage" description="How you use social media day to day." icon={Users}>
              {/* Multi-select platform */}
              <PlatformMultiSelect
                primaryPlatform={form.most_used_platform}
                selectedPlatforms={selectedPlatforms}
                onSelectPlatform={handleSelectPlatform}
                onRemovePlatform={handleRemovePlatform}
                onSetPrimary={handleSetPrimary}
                error={errorFor("most_used_platform")}
              />

              <ChoiceCards
                name="purpose_of_use"
                legend="Main Purpose of Use"
                options={PURPOSE_OPTIONS}
                value={form.purpose_of_use}
                onChange={(v) => set("purpose_of_use", v)}
                error={errorFor("purpose_of_use")}
                gridClass="grid-cols-1 sm:grid-cols-2"
              />

              <SliderField
                name="avg_daily_usage_hours"
                label="Average Daily Usage"
                unit="hrs/day"
                description="Total time on social media in a typical day."
                value={form.avg_daily_usage_hours}
                min={0}
                max={24}
                step={0.5}
                error={errorFor("avg_daily_usage_hours")}
                onChange={(v) => set("avg_daily_usage_hours", v)}
                onBlur={() => touch("avg_daily_usage_hours")}
              />

              <FieldShell
                label="Daily Phone Unlocks"
                htmlFor="field-daily_unlocks"
                description="Roughly how many times you unlock your phone each day."
                descId="field-daily_unlocks-desc"
              >
                <div className="flex items-center gap-2">
                  {/* Stepper: decrement */}
                  <button
                    type="button"
                    aria-label="Decrease daily unlocks"
                    onClick={() => set("daily_unlocks", Math.max(0, (form.daily_unlocks ?? 0) - 5))}
                    className="grid h-11 w-11 place-items-center rounded-lg border-2 border-border bg-surface-hi text-prose-bright transition-all hover:border-border-hi hover:bg-surface-elevated active:scale-95"
                  >
                    <span className="text-xl font-bold leading-none">−</span>
                  </button>
                  <NumberField
                    id="field-daily_unlocks"
                    inputMode="numeric"
                    value={form.daily_unlocks}
                    min={0}
                    step={1}
                    invalid={!!errorFor("daily_unlocks")}
                    placeholder="50"
                    describedBy={`field-daily_unlocks-desc${errorFor("daily_unlocks") ? " field-daily_unlocks-err" : ""}`}
                    onChange={(v) => set("daily_unlocks", v)}
                    onBlur={() => touch("daily_unlocks")}
                    className="w-24"
                  />
                  {/* Stepper: increment */}
                  <button
                    type="button"
                    aria-label="Increase daily unlocks"
                    onClick={() => set("daily_unlocks", (form.daily_unlocks ?? 0) + 5)}
                    className="grid h-11 w-11 place-items-center rounded-lg border-2 border-border bg-surface-hi text-prose-bright transition-all hover:border-border-hi hover:bg-surface-elevated active:scale-95"
                  >
                    <span className="text-xl font-bold leading-none">+</span>
                  </button>
                  <span className="text-sm text-prose-soft">unlocks/day</span>
                </div>
                <FieldError id="field-daily_unlocks-err" message={errorFor("daily_unlocks")} />
              </FieldShell>
            </FormSection>

            {/* ── Section 3: Lifestyle ─────────────────────────────── */}
            <FormSection id="lifestyle" title="Lifestyle & Wellbeing" description="Study, movement, rest, and stress." icon={HeartPulse}>
              <SliderField
                name="study_hours"
                label="Study Hours"
                unit="hrs/day"
                description="Time spent studying on a typical day."
                value={form.study_hours}
                min={0}
                max={24}
                step={0.5}
                error={errorFor("study_hours")}
                onChange={(v) => set("study_hours", v)}
                onBlur={() => touch("study_hours")}
              />
              <SliderField
                name="physical_activity_hours"
                label="Physical Activity"
                unit="hrs/day"
                description="Exercise, sport, or active movement (up to 2 hours)."
                value={form.physical_activity_hours}
                min={0}
                max={2}
                step={0.25}
                error={errorFor("physical_activity_hours")}
                onChange={(v) => set("physical_activity_hours", v)}
                onBlur={() => touch("physical_activity_hours")}
              />
              <SliderField
                name="sleep_hours_per_night"
                label="Sleep"
                unit="hrs/night"
                description="How long you usually sleep each night."
                value={form.sleep_hours_per_night}
                min={0}
                max={24}
                step={0.5}
                error={errorFor("sleep_hours_per_night")}
                onChange={(v) => set("sleep_hours_per_night", v)}
                onBlur={() => touch("sleep_hours_per_night")}
              />
              <DayBar
                sleep={form.sleep_hours_per_night}
                study={form.study_hours}
                screen={form.avg_daily_usage_hours}
                activity={form.physical_activity_hours}
              />
              <ChoiceCards
                name="stress_level"
                legend="Stress Level"
                hint="How stressed you feel in general."
                options={STRESS_OPTIONS}
                value={form.stress_level}
                onChange={(v) => set("stress_level", v)}
                error={errorFor("stress_level")}
                gridClass="grid-cols-2 lg:grid-cols-4"
              />
            </FormSection>

            {/* ── Disclaimer ───────────────────────────────────────── */}
            <Disclaimer />

            {/* ── API Error banner ─────────────────────────────────── */}
            {apiError && (
              <div
                role="alert"
                className="flex gap-3 rounded-xl border-2 border-danger/40 bg-danger/[0.06] p-4 text-danger"
              >
                <AlertCircle aria-hidden className="mt-0.5 h-5 w-5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{apiError.message || MESSAGES[apiError.kind]}</p>
                  {apiError.kind !== "validation" && (
                    <button
                      type="submit"
                      disabled={loading}
                      className="mt-3 inline-flex h-10 items-center gap-2 rounded-lg border border-danger/40 px-4 text-sm font-semibold text-danger transition-colors hover:bg-danger/10 disabled:opacity-60"
                    >
                      <RefreshCw aria-hidden className="h-4 w-4" />
                      Try again
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ── Submit button ─────────────────────────────────────── */}
            <button
              type="submit"
              disabled={loading}
              id="submit-prediction"
              className="group relative flex h-14 w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-accent to-violet text-base font-bold text-void shadow-glow-accent transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            >
              {/* Shimmer */}
              <span
                aria-hidden
                className="absolute inset-0 -translate-x-full skew-x-12 bg-white/20 transition-transform duration-700 group-hover:translate-x-full"
              />
              {loading ? (
                <>
                  <Loader2 aria-hidden className="h-5 w-5 animate-spin" />
                  Analyzing your responses&hellip;
                </>
              ) : (
                <>
                  <Send aria-hidden className="h-5 w-5" />
                  Predict My Mental Health Score
                  <ArrowRight
                    aria-hidden
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
