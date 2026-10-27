"use client";

import { useEffect, useState } from "react";
import { Pencil, RotateCcw, Sparkles } from "lucide-react";
import type { StudentData } from "@/types/prediction";
import Disclaimer from "./Disclaimer";

interface Props {
  score: number;
  data: StudentData;
  onEdit: () => void;
  onReset: () => void;
}

const RADIUS = 84;
const CIRC   = 2 * Math.PI * RADIUS;

function useCountUp(target: number, durationMs = 1100) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick  = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      setValue(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs]);
  return value;
}

export default function ResultCard({ score, data, onEdit, onReset }: Props) {
  const shown = useCountUp(score);

  const rows: [string, string][] = [
    ["Age",                  String(data.age)],
    ["Gender",               data.gender],
    ["Country",              data.country],
    ["Academic level",       data.academic_level],
    ["Most used platform",   data.most_used_platform],
    ["Purpose of use",       data.purpose_of_use],
    ["Daily usage",          `${data.avg_daily_usage_hours} h`],
    ["Daily unlocks",        String(data.daily_unlocks)],
    ["Study",                `${data.study_hours} h`],
    ["Physical activity",    `${data.physical_activity_hours} h`],
    ["Sleep",                `${data.sleep_hours_per_night} h`],
    ["Stress level",         data.stress_level],
  ];

  return (
    <div className="reveal space-y-5" id="result" tabIndex={-1}>

      {/* ── Main score card ─────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-6 text-center shadow-dark-card sm:p-10">
        {/* Glow blob behind score */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.07] blur-[60px]"
        />

        {/* Badge */}
        <div className="relative mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/[0.07] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
          <Sparkles aria-hidden className="h-3.5 w-3.5" />
          Model Prediction
        </div>

        <h3 className="relative font-display text-xl font-bold text-prose-bright sm:text-2xl">
          Predicted Mental Health Score
        </h3>

        {/* Circular ring + score */}
        <div className="relative mx-auto mt-8 h-52 w-52 sm:h-60 sm:w-60">
          <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90" aria-hidden>
            {/* Track */}
            <circle cx="100" cy="100" r={RADIUS} fill="none" stroke="#1E2A3D" strokeWidth="10" />
            {/* Cyan fill ring */}
            <circle
              cx="100" cy="100" r={RADIUS}
              fill="none"
              stroke="url(#scoreGradient)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              className="ring-draw"
              style={{ "--ring-len": CIRC } as React.CSSProperties}
            />
            {/* Gradient def */}
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#22D3EE" />
                <stop offset="100%" stopColor="#818CF8" />
              </linearGradient>
            </defs>
          </svg>

          {/* Score number */}
          <div className="absolute inset-0 grid place-content-center">
            <p
              aria-hidden
              className="font-display text-6xl font-extrabold tabular-nums text-gradient sm:text-7xl"
            >
              {shown.toFixed(2)}
            </p>
            <p className="mt-1 text-xs font-medium text-prose-soft">out of 10</p>
          </div>
        </div>

        {/* Screen-reader score announcement */}
        <p className="sr-only" role="status">
          Predicted mental health score: {score.toFixed(2)}
        </p>

        <p className="relative mx-auto mt-6 max-w-md leading-relaxed text-prose-soft">
          This is a machine learning prediction based on the information you provided. This project does not
          define score bands — the ring is decorative and does not imply any clinical scale.
        </p>

        {/* Actions */}
        <div className="relative mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={onEdit}
            id="result-edit-btn"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-border bg-surface-hi px-6 font-semibold text-prose-bright transition-all duration-200 hover:border-border-hi hover:bg-surface-elevated"
          >
            <Pencil aria-hidden className="h-4 w-4" />
            Edit Responses
          </button>
          <button
            type="button"
            onClick={onReset}
            id="result-reset-btn"
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-violet px-6 font-semibold text-void transition-all duration-200 hover:scale-[1.02] hover:shadow-glow-accent"
          >
            <RotateCcw aria-hidden className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-180" />
            Take Assessment Again
          </button>
        </div>
      </div>

      {/* ── What the model received ─────────────────────────────── */}
      <section
        aria-labelledby="inputs-title"
        className="rounded-2xl border border-border bg-surface p-5 shadow-dark-card sm:p-7"
      >
        <h4 id="inputs-title" className="font-display text-lg font-bold text-prose-bright">
          What the model received
        </h4>
        <dl className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
          {rows.map(([k, v]) => (
            <div
              key={k}
              className="flex justify-between gap-4 border-b border-border pb-2 text-[0.9rem] last:border-0"
            >
              <dt className="text-prose-soft">{k}</dt>
              <dd className="text-right font-semibold text-prose-bright">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <Disclaimer />
    </div>
  );
}
