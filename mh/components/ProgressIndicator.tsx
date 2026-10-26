import { Check } from "lucide-react";

export interface ProgressStep { label: string; done: boolean }

interface Props { percent: number; answered: number; total: number; steps: ProgressStep[] }

export default function ProgressIndicator({ percent, answered, total, steps }: Props) {
  return (
    <div className="sticky top-16 z-20 -mx-4 border-b border-line bg-mist/95 px-4 py-3 backdrop-blur-sm sm:mx-0 sm:rounded-2xl sm:border sm:bg-white/95 sm:px-5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold">Assessment progress</span>
        <span className="tabular-nums text-ink-soft">{answered} of {total} answered</span>
      </div>
      <div
        role="progressbar"
        aria-label="Assessment progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="mt-2 h-2 overflow-hidden rounded-full bg-line"
      >
        <div className="h-full rounded-full bg-tide transition-[width] duration-300" style={{ width: `${percent}%` }} />
      </div>
      <ol className="mt-2.5 grid grid-cols-4 gap-2 text-xs sm:text-sm">
        {steps.map((s) => (
          <li key={s.label} className={`flex items-center gap-1.5 ${s.done ? "font-semibold text-tide-dark" : "text-ink-soft"}`}>
            <span
              aria-hidden
              className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border ${
                s.done ? "border-tide bg-tide text-white" : "border-ink-soft/50"
              }`}
            >
              {s.done && <Check className="h-3 w-3" />}
            </span>
            <span className="truncate">{s.label}</span>
            <span className="sr-only">{s.done ? "(complete)" : "(not complete)"}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
