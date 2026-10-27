import { Info } from "lucide-react";

export default function Disclaimer() {
  return (
    <aside
      aria-label="Disclaimer"
      className="flex gap-3 rounded-xl border border-accent/10 bg-accent/[0.04] p-4 text-sm leading-relaxed text-prose-soft"
    >
      <Info aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-accent/70" />
      <p>
        This tool provides a machine learning prediction for{" "}
        <strong className="font-semibold text-prose">educational purposes only</strong>. It is not medical advice,
        diagnosis, or a substitute for professional mental health care.
      </p>
    </aside>
  );
}
