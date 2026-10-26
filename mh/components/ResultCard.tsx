"use client";

import { useEffect, useState } from "react";
import { Pencil, RotateCcw } from "lucide-react";
import type { StudentData } from "@/types/prediction";
import Disclaimer from "./Disclaimer";

interface Props {
  score: number;
  data: StudentData;
  onEdit: () => void;
  onReset: () => void;
}

const RADIUS = 88;
const CIRC = 2 * Math.PI * RADIUS;

function useCountUp(target: number, durationMs = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
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
    ["Age", String(data.age)],
    ["Gender", data.gender],
    ["Country", data.country],
    ["Academic level", data.academic_level],
    ["Most used platform", data.most_used_platform],
    ["Purpose of use", data.purpose_of_use],
    ["Daily usage", `${data.avg_daily_usage_hours} h`],
    ["Daily unlocks", String(data.daily_unlocks)],
    ["Study", `${data.study_hours} h`],
    ["Physical activity", `${data.physical_activity_hours} h`],
    ["Sleep", `${data.sleep_hours_per_night} h`],
    ["Stress level", data.stress_level],
  ];

  return (
    <div className="reveal space-y-5" id="result" tabIndex={-1}>
      <div className="rounded-2xl border border-line bg-white p-6 text-center shadow-card sm:p-10">
        <h3 className="font-display text-xl font-bold sm:text-2xl">Your predicted mental health score</h3>
        <div className="relative mx-auto mt-8 h-52 w-52 sm:h-60 sm:w-60">
          <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90" aria-hidden>
            <circle cx="100" cy="100" r={RADIUS} fill="none" stroke="#DDEEEC" strokeWidth="10" />
            <circle
              cx="100" cy="100" r={RADIUS} fill="none" stroke="#17636B" strokeWidth="10" strokeLinecap="round"
              strokeDasharray={CIRC} className="ring-draw" style={{ "--ring-len": CIRC } as React.CSSProperties}
            />
          </svg>
          <div className="absolute inset-0 grid place-content-center">
            <p aria-hidden className="font-display text-6xl font-extrabold tabular-nums text-tide-dark sm:text-7xl">
              {shown.toFixed(2)}
            </p>
            <p className="text-sm font-medium text-ink-soft">Model prediction</p>
          </div>
        </div>
        <p className="sr-only" role="status">Predicted mental health score: {score.toFixed(2)}</p>
        <p className="mx-auto mt-6 max-w-md leading-relaxed text-ink-soft">
          This score is a machine learning prediction based on the information you provided. This project does not
          define score ranges, so the ring is decorative and does not show a scale.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-line bg-white px-5 font-semibold transition-colors hover:border-tide hover:bg-mist"
          >
            <Pencil aria-hidden className="h-4 w-4" />
            Edit Responses
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-tide px-5 font-semibold text-white transition-colors hover:bg-tide-dark"
          >
            <RotateCcw aria-hidden className="h-4 w-4" />
            Take Assessment Again
          </button>
        </div>
      </div>

      <section aria-labelledby="inputs-title" className="rounded-2xl border border-line bg-white p-5 sm:p-7">
        <h4 id="inputs-title" className="font-display text-lg font-bold">What the model received</h4>
        <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 border-b border-line pb-2 text-[0.95rem]">
              <dt className="text-ink-soft">{k}</dt>
              <dd className="text-right font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
      </section>
      <Disclaimer />
    </div>
  );
}
