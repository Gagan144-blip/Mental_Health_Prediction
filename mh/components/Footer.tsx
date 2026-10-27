export default function Footer() {
  return (
    <footer className="border-t border-border bg-void">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display font-bold text-prose-bright">Mental Health AI</p>
            <p className="mt-0.5 text-sm text-prose-soft">
              An educational machine learning project. Not medical advice.
            </p>
          </div>
          <p className="text-sm text-prose-soft/60">
            If you are struggling, please talk to a qualified professional or someone you trust.
          </p>
        </div>
        <div className="mt-6 border-t border-border pt-4 text-xs text-prose-soft/40">
          © {new Date().getFullYear()} Mental Health Prediction · Educational use only
        </div>
      </div>
    </footer>
  );
}
