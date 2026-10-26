import { Info } from "lucide-react";

export default function Disclaimer() {
  return (
    <aside aria-label="Disclaimer" className="flex gap-3 rounded-xl border border-line bg-white p-4 text-sm leading-relaxed text-ink-soft">
      <Info aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-tide" />
      <p>
        This tool provides a machine learning prediction for educational purposes only. It is not medical advice,
        diagnosis, or a substitute for professional mental health care.
      </p>
    </aside>
  );
}
