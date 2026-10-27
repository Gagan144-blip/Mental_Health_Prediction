import { Check } from "lucide-react";

export interface ProgressStep { label: string; done: boolean; index: number }

interface Props { percent: number; answered: number; total: number; steps: ProgressStep[] }

export default function ProgressIndicator({ percent, answered, total, steps }: Props) {
  return (
    <div className="sticky top-16 z-20 -mx-4 border-b border-border bg-void/95 px-4 py-3.5 backdrop-blur-md sm:mx-0 sm:rounded-2xl sm:border sm:bg-surface/95 sm:px-5 sm:shadow-dark-card">
      {/* Top row */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-prose-bright">Assessment Progress</span>
        <span className="tabular-nums text-prose-soft">
          <span className="text-accent font-semibold">{answered}</span>
          <span className="text-prose-soft/60"> / {total}</span>
        </span>
      </div>

      {/* Progress bar */}
      <div
        role="progressbar"
        aria-label="Assessment progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-border"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent to-violet transition-[width] duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Steps */}
      <ol className="mt-3 grid grid-cols-4 gap-1 text-[0.7rem] sm:text-xs">
        {steps.map((s) => {
          const num = String(s.index + 1).padStart(2, "0");
          return (
            <li
              key={s.label}
              className={`flex items-center gap-1.5 transition-colors duration-200 ${
                s.done ? "text-accent" : "text-prose-soft/60"
              }`}
            >
              <span
                aria-hidden
                className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border text-[0.6rem] font-bold transition-all duration-200 ${
                  s.done
                    ? "border-accent bg-accent text-void shadow-glow-sm"
                    : "border-border text-prose-soft/40"
                }`}
              >
                {s.done ? <Check className="h-2.5 w-2.5" /> : num}
              </span>
              <span className="truncate font-medium">{s.label}</span>
              <span className="sr-only">{s.done ? "(complete)" : "(not complete)"}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
