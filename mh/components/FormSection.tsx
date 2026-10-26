import type { LucideIcon } from "lucide-react";

interface Props {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

export default function FormSection({ id, title, description, icon: Icon, children }: Props) {
  return (
    <section aria-labelledby={`${id}-title`} className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-7">
      <div className="flex items-start gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-tide-light text-tide-dark">
          <Icon aria-hidden className="h-5 w-5" />
        </span>
        <div>
          <h3 id={`${id}-title`} className="font-display text-xl font-bold">{title}</h3>
          <p className="mt-0.5 text-sm text-ink-soft">{description}</p>
        </div>
      </div>
      <div className="mt-7 space-y-7">{children}</div>
    </section>
  );
}
