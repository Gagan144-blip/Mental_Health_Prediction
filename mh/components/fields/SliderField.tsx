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
  const inputId    = `field-${name}`;
  const descId     = `${inputId}-desc`;
  const errId      = `${inputId}-err`;
  const fill       = value === null ? 0 : Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  const describedBy = error ? `${descId} ${errId}` : descId;
  const displayVal  = value === null ? "—" : `${value}`;

  return (
    <div>
      {/* Top: label + live value badge */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <label htmlFor={`${inputId}-range`} className="block text-base font-semibold text-prose-bright">
            {label}
          </label>
          <p id={descId} className="mt-0.5 text-sm text-prose-soft">{description}</p>
        </div>
        {/* Live value badge */}
        <div className="flex shrink-0 flex-col items-end gap-1">
          <div className={`rounded-lg border px-3 py-1.5 text-center font-display tabular-nums leading-none transition-all duration-200 ${
            value !== null
              ? "border-accent/30 bg-accent/10 text-accent shadow-glow-sm"
              : "border-border bg-surface-hi text-prose-soft"
          }`}>
            <span className="text-xl font-bold">{displayVal}</span>
            <span className="ml-1 text-xs opacity-70">{unit}</span>
          </div>
          {/* Hidden number input for keyboard editing */}
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
            className="w-0 h-0 overflow-hidden p-0 border-0 opacity-0 absolute"
          />
        </div>
      </div>

      {/* Slider */}
      <input
        id={`${inputId}-range`}
        type="range"
        className="slider mt-4"
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

      {/* Min/Max labels */}
      <div className="mt-1 flex justify-between text-xs text-prose-soft/60" aria-hidden>
        <span>{min} {unit}</span>
        <span>{max} {unit}</span>
      </div>

      <FieldError id={errId} message={error} />
    </div>
  );
}
