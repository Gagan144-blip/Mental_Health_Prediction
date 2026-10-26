interface Props {
  sleep: number | null;
  study: number | null;
  screen: number | null;
  activity: number | null;
}

const SEGMENTS = [
  { key: "sleep", label: "Sleep", bar: "bg-tide-dark" },
  { key: "study", label: "Study", bar: "bg-tide" },
  { key: "screen", label: "Screen time", bar: "bg-sun" },
  { key: "activity", label: "Activity", bar: "bg-ink-soft" },
] as const;

/** Shows how the hours the person entered fit into a 24-hour day. Informational only. */
export default function DayBar({ sleep, study, screen, activity }: Props) {
  const values = { sleep: sleep ?? 0, study: study ?? 0, screen: screen ?? 0, activity: activity ?? 0 };
  const valid = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);
  const total = SEGMENTS.reduce((sum, s) => sum + valid(values[s.key]), 0);
  if (total === 0) return null;
  const scale = Math.max(24, total);
  const summary = SEGMENTS.map((s) => `${s.label} ${valid(values[s.key])} hours`).join(", ");

  return (
    <div className="rounded-xl bg-mist p-4">
      <p className="text-sm font-semibold">Your day at a glance</p>
      <div role="img" aria-label={`Hours per day: ${summary}`} className="mt-3 flex h-4 overflow-hidden rounded-full bg-line">
        {SEGMENTS.filter((s) => valid(values[s.key]) > 0).map((s) => (
          <div
            key={s.key}
            className={`${s.bar} border-r-2 border-mist transition-[width] duration-300 last:border-r-0`}
            style={{ width: `${(valid(values[s.key]) / scale) * 100}%` }}
          />
        ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
        {SEGMENTS.map((s) => (
          <li key={s.key} className="flex items-center gap-1.5">
            <span aria-hidden className={`h-2.5 w-2.5 rounded-full ${s.bar}`} />
            {s.label} <span className="tabular-nums text-ink-soft">{valid(values[s.key])}h</span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-sm text-ink-soft">
        {total <= 24
          ? `${total.toFixed(1).replace(/\.0$/, "")} of 24 hours accounted for.`
          : "These add up to more than 24 hours. That can happen when activities overlap, like using your phone while studying."}
      </p>
    </div>
  );
}
