import { AlertCircle } from "lucide-react";

export function FieldError({ id, message }: { id: string; message?: string | null }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-2 flex items-center gap-1.5 text-sm font-medium text-danger">
      <AlertCircle aria-hidden className="h-4 w-4 shrink-0" />
      {message}
    </p>
  );
}

interface ShellProps {
  label: string;
  htmlFor: string;
  description?: string;
  descId?: string;
  children: React.ReactNode;
}

export function FieldShell({ label, htmlFor, description, descId, children }: ShellProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-base font-semibold text-prose-bright">
        {label}
      </label>
      {description && (
        <p id={descId} className="mt-0.5 text-sm text-prose-soft">
          {description}
        </p>
      )}
      <div className="mt-2.5">{children}</div>
    </div>
  );
}
