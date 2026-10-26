"use client";

import { Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { FieldError } from "./FieldShell";

export interface ChoiceOption<T extends string> {
  value: T;
  label: string;
  description?: string;
  icon?: LucideIcon;
  /** Full Tailwind class strings (must be literal so Tailwind can see them). */
  selectedClass?: string;
  monogram?: string;
}

interface Props<T extends string> {
  name: string;
  legend: string;
  hint?: string;
  options: ChoiceOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  error?: string | null;
  /** Tailwind grid classes for the option layout. */
  gridClass?: string;
  variant?: "card" | "chip";
}

const DEFAULT_SELECTED = "border-tide bg-tide-light";

export default function ChoiceCards<T extends string>({
  name, legend, hint, options, value, onChange, error,
  gridClass = "grid-cols-1 sm:grid-cols-3", variant = "card",
}: Props<T>) {
  const groupId = `field-${name}`;
  const errId = `${groupId}-err`;
  const hintId = `${groupId}-hint`;

  return (
    <fieldset
      id={groupId}
      tabIndex={-1}
      aria-describedby={`${hint ? hintId : ""} ${error ? errId : ""}`.trim() || undefined}
      className="min-w-0 border-0 p-0 outline-none"
    >
      <legend className="text-base font-semibold">{legend}</legend>
      {hint && <p id={hintId} className="mt-0.5 text-sm text-ink-soft">{hint}</p>}
      <div className={`mt-2.5 grid gap-2.5 ${gridClass}`}>
        {options.map((o) => {
          const selected = value === o.value;
          const Icon = o.icon;
          return (
            <label key={o.value} className="relative block cursor-pointer">
              <input
                type="radio"
                name={name}
                value={o.value}
                checked={selected}
                onChange={() => onChange(o.value)}
                className="peer sr-only"
              />
              <div
                className={`flex min-h-[3rem] items-center gap-3 rounded-xl border-2 px-3.5 py-2.5 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-tide peer-focus-visible:ring-offset-2 ${
                  selected
                    ? o.selectedClass ?? DEFAULT_SELECTED
                    : "border-line bg-white hover:border-tide/50 hover:bg-mist/60"
                } ${variant === "card" ? "sm:flex-col sm:items-start sm:gap-2 sm:py-3.5" : ""}`}
              >
                {Icon && <Icon aria-hidden className="h-5 w-5 shrink-0 text-tide" />}
                {o.monogram && (
                  <span
                    aria-hidden
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink text-xs font-bold text-white"
                  >
                    {o.monogram}
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.95rem] font-semibold leading-tight">{o.label}</span>
                  {o.description && (
                    <span className="mt-0.5 block text-sm leading-snug text-ink-soft">{o.description}</span>
                  )}
                </span>
                <Check
                  aria-hidden
                  className={`h-5 w-5 shrink-0 text-tide transition-opacity ${
                    selected ? "opacity-100" : "opacity-0"
                  } ${variant === "card" ? "sm:absolute sm:right-3 sm:top-3" : ""}`}
                />
              </div>
            </label>
          );
        })}
      </div>
      <FieldError id={errId} message={error} />
    </fieldset>
  );
}
