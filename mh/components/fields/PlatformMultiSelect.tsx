"use client";

import { Check, X, ChevronRight } from "lucide-react";
import { PLATFORMS, type Platform } from "@/types/prediction";
import { FieldError } from "./FieldShell";

interface Props {
  /** The single platform value sent to the API (primary). */
  primaryPlatform: Platform | null;
  /** All platforms the user selected (UI-only, not sent to API). */
  selectedPlatforms: Platform[];
  onSelectPlatform: (p: Platform) => void;
  onRemovePlatform: (p: Platform) => void;
  onSetPrimary: (p: Platform) => void;
  error?: string | null;
}

export default function PlatformMultiSelect({
  primaryPlatform,
  selectedPlatforms,
  onSelectPlatform,
  onRemovePlatform,
  onSetPrimary,
  error,
}: Props) {
  const errId = "field-most_used_platform-err";

  return (
    <fieldset
      id="field-most_used_platform"
      tabIndex={-1}
      className="min-w-0 border-0 p-0 outline-none"
      aria-describedby={error ? errId : undefined}
    >
      <legend className="text-base font-semibold text-prose-bright">Most Used Platforms</legend>
      <p className="mt-0.5 text-sm text-prose-soft">
        Select all platforms you commonly use, then choose the one you use most.
      </p>

      {/* ── Platform chip grid ─────────────────────────────────── */}
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {PLATFORMS.map((p) => {
          const isSelected = selectedPlatforms.includes(p);
          return (
            <button
              key={p}
              type="button"
              id={`platform-chip-${p}`}
              aria-pressed={isSelected}
              onClick={() => (isSelected ? onRemovePlatform(p) : onSelectPlatform(p))}
              className={[
                "group flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-left text-sm font-semibold",
                "transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
                isSelected
                  ? "platform-chip-selected text-accent"
                  : "border-border bg-surface-hi text-prose-soft hover:border-border-hi hover:bg-surface-elevated hover:text-prose-bright",
              ].join(" ")}
            >
              <span
                className={[
                  "grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-bold transition-all duration-200",
                  isSelected
                    ? "bg-accent text-void"
                    : "bg-border text-prose-soft group-hover:bg-border-hi",
                ].join(" ")}
              >
                {isSelected ? <Check className="h-3.5 w-3.5" /> : p.slice(0, 2)}
              </span>
              <span className="min-w-0 truncate">{p}</span>
            </button>
          );
        })}
      </div>

      {/* ── Selected chips/tags ────────────────────────────────── */}
      {selectedPlatforms.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-wider text-prose-soft/60">
            Selected
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedPlatforms.map((p) => (
              <span
                key={p}
                className="inline-flex items-center gap-1.5 rounded-lg border border-accent/30 bg-accent/10 px-2.5 py-1 text-sm font-medium text-accent"
              >
                {p}
                <button
                  type="button"
                  aria-label={`Remove ${p}`}
                  onClick={() => onRemovePlatform(p)}
                  className="ml-0.5 rounded-sm text-accent/60 transition-colors hover:text-danger focus:outline-none focus-visible:ring-1 focus-visible:ring-danger"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Primary platform selection ─────────────────────────── */}
      {selectedPlatforms.length > 0 && (
        <div className="mt-5 rounded-xl border border-violet/20 bg-violet/[0.05] p-4">
          <div className="mb-3 flex items-center gap-2">
            <ChevronRight aria-hidden className="h-4 w-4 text-violet" />
            <p className="text-sm font-semibold text-prose-bright">
              Which one do you use most?
            </p>
          </div>
          <p className="-mt-1 mb-3 pl-6 text-xs text-prose-soft">
            This is the value sent to the ML model.
          </p>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {selectedPlatforms.map((p) => {
              const isPrimary = primaryPlatform === p;
              return (
                <label
                  key={p}
                  className={[
                    "flex cursor-pointer items-center gap-3 rounded-lg border-2 px-3.5 py-2.5",
                    "transition-all duration-200",
                    isPrimary
                      ? "border-violet bg-violet/10 shadow-[0_0_0_1px_rgba(129,140,248,0.25)]"
                      : "border-border bg-surface-hi hover:border-border-hi",
                  ].join(" ")}
                >
                  <input
                    type="radio"
                    name="primary_platform"
                    value={p}
                    checked={isPrimary}
                    onChange={() => onSetPrimary(p)}
                    className="sr-only"
                  />
                  {/* Custom radio circle */}
                  <span
                    className={[
                      "grid h-4 w-4 shrink-0 place-items-center rounded-full border-2 transition-all duration-200",
                      isPrimary ? "border-violet bg-violet" : "border-border",
                    ].join(" ")}
                  >
                    {isPrimary && (
                      <span className="h-1.5 w-1.5 rounded-full bg-void" />
                    )}
                  </span>
                  <span
                    className={`flex-1 text-sm font-medium transition-colors duration-200 ${
                      isPrimary ? "text-violet" : "text-prose"
                    }`}
                  >
                    {p}
                  </span>
                  {isPrimary && (
                    <span className="text-[0.6rem] font-bold uppercase tracking-wider text-violet/70">
                      Primary
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Error: no platform selected */}
      {selectedPlatforms.length === 0 && (
        <FieldError id={errId} message={error} />
      )}
      {/* Error: platforms selected but no primary chosen */}
      {selectedPlatforms.length > 0 && !primaryPlatform && error && (
        <FieldError id={errId} message="Please choose your primary platform above." />
      )}
    </fieldset>
  );
}
