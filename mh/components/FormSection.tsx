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
    <section
      aria-labelledby={`${id}-title`}
      className="group rounded-2xl border border-border bg-surface p-5 shadow-dark-card transition-all duration-300 hover:border-border-hi sm:p-7"
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-accent/20 to-violet/20 text-accent ring-1 ring-accent/20 transition-all duration-300 group-hover:from-accent/30 group-hover:to-violet/30 group-hover:ring-accent/40">
          <Icon aria-hidden className="h-5 w-5" />
        </span>
        <div>
          <h3 id={`${id}-title`} className="font-display text-xl font-bold text-prose-bright">{title}</h3>
          <p className="mt-0.5 text-sm text-prose-soft">{description}</p>
        </div>
      </div>

      {/* Fields */}
      <div className="mt-7 space-y-7">{children}</div>
    </section>
  );
}
