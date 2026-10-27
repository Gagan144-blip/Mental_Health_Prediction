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

export default function ChoiceCards<T extends string>({
  name, legend, hint, options, value, onChange, error,
  gridClass = "grid-cols-1 sm:grid-cols-3", variant = "card",
}: Props<T>) {
  const groupId = `field-${name}`;
  const errId   = `${groupId}-err`;
  const hintId  = `${groupId}-hint`;

  return (
    <fieldset
      id={groupId}
      tabIndex={-1}
      aria-describedby={`${hint ? hintId : ""} ${error ? errId : ""}`.trim() || undefined}
      className="min-w-0 border-0 p-0 outline-none"
    >
      <legend className="text-base font-semibold text-prose-bright">{legend}</legend>
      {hint && <p id={hintId} className="mt-0.5 text-sm text-prose-soft">{hint}</p>}

      <div className={`mt-2.5 grid gap-2 ${gridClass}`}>
        {options.map((o) => {
          const selected = value === o.value;
          const Icon     = o.icon;

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
                className={`flex min-h-[3rem] items-center gap-3 rounded-xl border-2 px-3.5 py-2.5
                  transition-all duration-200 ease-out
                  peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface
                  ${selected
                    ? o.selectedClass ?? "border-accent bg-accent/10 shadow-[0_0_0_1px_rgba(34,211,238,0.25),0_0_14px_rgba(34,211,238,0.12)]"
                    : "border-border bg-surface-hi hover:border-border-hi hover:bg-surface-elevated hover:shadow-dark-card"
                  }
                  ${variant === "card" ? "sm:flex-col sm:items-start sm:gap-2 sm:py-4" : ""}
                `}
              >
                {Icon && (
                  <Icon
                    aria-hidden
                    className={`h-5 w-5 shrink-0 transition-colors duration-200 ${selected ? "text-accent" : "text-prose-soft"}`}
                  />
                )}
                {o.monogram && (
                  <span
                    aria-hidden
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold transition-all duration-200 ${
                      selected ? "bg-accent text-void" : "bg-border text-prose-soft"
                    }`}
                  >
                    {o.monogram}
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className={`block text-[0.95rem] font-semibold leading-tight transition-colors duration-200 ${selected ? "text-accent" : "text-prose-bright"}`}>
                    {o.label}
                  </span>
                  {o.description && (
                    <span className="mt-0.5 block text-sm leading-snug text-prose-soft">
                      {o.description}
                    </span>
                  )}
                </span>
                <Check
                  aria-hidden
                  className={`h-5 w-5 shrink-0 text-accent transition-all duration-200 ${
                    selected ? "opacity-100 scale-100" : "opacity-0 scale-75"
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
