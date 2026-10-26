"use client";

import { useEffect, useState } from "react";

interface Props {
  id: string;
  value: number | null;
  onChange: (value: number | null) => void;
  onBlur?: () => void;
  min?: number;
  max?: number;
  step?: number | string;
  inputMode?: "numeric" | "decimal";
  invalid?: boolean;
  describedBy?: string;
  ariaLabel?: string;
  placeholder?: string;
  className?: string;
}

/** Number input that lets people type freely (e.g. "6.") while keeping a clean number in state. */
export default function NumberField({
  id, value, onChange, onBlur, min, max, step, inputMode = "decimal",
  invalid, describedBy, ariaLabel, placeholder, className = "",
}: Props) {
  const [text, setText] = useState(value === null ? "" : String(value));

  useEffect(() => {
    const parsed = text.trim() === "" ? null : Number(text);
    if (parsed !== value) setText(value === null ? "" : String(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <input
      id={id}
      type="number"
      inputMode={inputMode}
      value={text}
      min={min}
      max={max}
      step={step}
      placeholder={placeholder}
      aria-label={ariaLabel}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      onBlur={onBlur}
      onChange={(e) => {
        const raw = e.target.value;
        setText(raw);
        const n = raw === "" ? null : Number(raw);
        onChange(n === null || Number.isNaN(n) ? null : n);
      }}
      className={`h-11 rounded-lg border bg-white px-3 text-right text-base font-semibold tabular-nums text-ink transition-colors placeholder:text-ink-soft/60 ${
        invalid ? "border-red-600" : "border-line hover:border-tide/60"
      } ${className}`}
    />
  );
}
