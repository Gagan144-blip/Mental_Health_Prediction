"use client";

import NumberField from "./NumberField";
import { FieldError } from "./FieldShell";

interface Props {
  name: string;
  label: string;
  description: string;
  unit: string;
  value: number | null;
  min: number;
  max: number;
  step: number;
  error?: string | null;
  onChange: (value: number | null) => void;
  onBlur?: () => void;
}

export default function SliderField({
  name, label, description, unit, value, min, max, step, error, onChange, onBlur,
}: Props) {
  const inputId = `field-${name}`;
  const descId = `${inputId}-desc`;
  const errId = `${inputId}-err`;
  const fill = value === null ? 0 : Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  const describedBy = error ? `${descId} ${errId}` : descId;

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <label htmlFor={`${inputId}-range`} className="block text-base font-semibold">
            {label}
          </label>
          <p id={descId} className="mt-0.5 text-sm text-ink-soft">{description}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <NumberField
            id={inputId}
            value={value}
            min={min}
            max={max}
            step={step}
            invalid={!!error}
            describedBy={describedBy}
            ariaLabel={`${label}, type a value`}
            placeholder="–"
            onChange={onChange}
            onBlur={onBlur}
            className="w-[4.5rem]"
          />
          <span className="w-12 text-sm text-ink-soft">{unit}</span>
        </div>
      </div>
      <input
        id={`${inputId}-range`}
        type="range"
        className="slider mt-3"
        min={min}
        max={max}
        step={step}
        value={value === null ? min : Math.min(max, Math.max(min, value))}
        data-untouched={value === null}
        style={{ "--fill": `${fill}%` } as React.CSSProperties}
        aria-describedby={describedBy}
        aria-valuetext={value === null ? "Not set" : `${value} ${unit}`}
        onChange={(e) => onChange(Number(e.target.value))}
        onPointerUp={onBlur}
        onBlur={onBlur}
      />
      <div className="flex justify-between text-xs text-ink-soft" aria-hidden>
        <span>{min}</span>
        <span>{max}</span>
      </div>
      <FieldError id={errId} message={error} />
    </div>
  );
}
