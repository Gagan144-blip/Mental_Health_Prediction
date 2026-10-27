interface Props {
  sleep: number | null;
  study: number | null;
  screen: number | null;
  activity: number | null;
}

const SEGMENTS = [
  { key: "sleep",    label: "Sleep",       bar: "bg-accent" },
  { key: "study",    label: "Study",        bar: "bg-violet" },
  { key: "screen",   label: "Screen time",  bar: "bg-warning" },
  { key: "activity", label: "Activity",     bar: "bg-success" },
] as const;

/** Shows how the hours the person entered fit into a 24-hour day. Informational only. */
export default function DayBar({ sleep, study, screen, activity }: Props) {
  const values = { sleep: sleep ?? 0, study: study ?? 0, screen: screen ?? 0, activity: activity ?? 0 };
  const valid  = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);
  const total  = SEGMENTS.reduce((sum, s) => sum + valid(values[s.key]), 0);
  if (total === 0) return null;

  const scale   = Math.max(24, total);
  const summary = SEGMENTS.map((s) => `${s.label} ${valid(values[s.key])} hours`).join(", ");

  return (
    <div className="rounded-xl border border-border bg-surface-hi p-4">
      <p className="text-sm font-semibold text-prose-bright">Your day at a glance</p>
      <div
        role="img"
        aria-label={`Hours per day: ${summary}`}
        className="mt-3 flex h-3 overflow-hidden rounded-full bg-border"
      >
        {SEGMENTS.filter((s) => valid(values[s.key]) > 0).map((s) => (
          <div
            key={s.key}
            className={`${s.bar} opacity-80 border-r border-surface transition-[width] duration-500 last:border-r-0`}
            style={{ width: `${(valid(values[s.key]) / scale) * 100}%` }}
          />
        ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
        {SEGMENTS.map((s) => (
          <li key={s.key} className="flex items-center gap-1.5">
            <span aria-hidden className={`h-2 w-2 rounded-full ${s.bar} opacity-80`} />
            <span className="text-prose-soft">{s.label}</span>
            <span className="tabular-nums text-prose-bright font-medium">{valid(values[s.key])}h</span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-prose-soft/70">
        {total <= 24
          ? `${total.toFixed(1).replace(/\.0$/, "")} of 24 hours accounted for.`
          : "These add up to more than 24 hours — that can happen when activities overlap."}
      </p>
    </div>
  );
}
