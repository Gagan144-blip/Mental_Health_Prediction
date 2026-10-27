"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search, Check } from "lucide-react";
import { COUNTRIES } from "@/lib/countries";

interface Props {
  id: string;
  value: string | null;
  onChange: (value: string) => void;
  onBlur?: () => void;
  invalid?: boolean;
  describedBy?: string;
}

/** Searchable combobox following the ARIA 1.2 list-autocomplete pattern. */
export default function CountrySelect({ id, value, onChange, onBlur, invalid, describedBy }: Props) {
  const [query,  setQuery]  = useState(value ?? "");
  const [open,   setOpen]   = useState(false);
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const listId  = `${id}-list`;

  useEffect(() => setQuery(value ?? ""), [value]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || query === value) return COUNTRIES;
    return COUNTRIES.filter((c) => c.toLowerCase().includes(q));
  }, [query, value]);

  useEffect(() => {
    if (open) listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  function select(country: string) {
    onChange(country);
    setQuery(country);
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) setOpen(true);
      else setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && open && filtered[active]) {
      e.preventDefault();
      select(filtered[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
      setQuery(value ?? "");
    }
  }

  return (
    <div className="relative">
      <Search aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-prose-soft" />
      <input
        id={id}
        role="combobox"
        type="text"
        autoComplete="off"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={open && filtered[active] ? `${id}-opt-${active}` : undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        placeholder="Search for your country"
        value={query}
        onFocus={(e) => { setOpen(true); e.currentTarget.select(); }}
        onChange={(e) => { setQuery(e.target.value); setActive(0); setOpen(true); }}
        onKeyDown={onKeyDown}
        onBlur={() => { setOpen(false); setQuery(value ?? ""); onBlur?.(); }}
        className={`h-12 w-full rounded-xl border-2 bg-surface-hi pl-10 pr-10 text-base text-prose-bright transition-all duration-200 placeholder:text-prose-soft/50 ${
          invalid
            ? "border-danger"
            : "border-border hover:border-border-hi focus:border-accent focus:shadow-glow-sm focus:outline-none"
        }`}
      />
      <ChevronDown
        aria-hidden
        className={`pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-prose-soft transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      />
      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label="Countries"
          className="absolute z-30 mt-1.5 max-h-60 w-full overflow-y-auto rounded-xl border border-border bg-surface py-1 shadow-[0_8px_32px_rgba(0,0,0,.7)]"
        >
          {filtered.length === 0 && (
            <li className="px-4 py-3 text-sm text-prose-soft">No matching country</li>
          )}
          {filtered.map((c, i) => (
            <li
              key={c}
              id={`${id}-opt-${i}`}
              role="option"
              aria-selected={c === value}
              onMouseDown={(e) => { e.preventDefault(); select(c); }}
              onMouseEnter={() => setActive(i)}
              className={`flex cursor-pointer items-center justify-between px-4 py-2.5 text-[0.95rem] transition-colors duration-100 ${
                i === active ? "bg-accent/10 text-accent" : "text-prose"
              } ${c === value ? "font-semibold text-accent" : ""}`}
            >
              {c}
              {c === value && <Check aria-hidden className="h-4 w-4 text-accent" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
