import { BookOpen, Globe, Moon, Smartphone, Activity, Gauge, User } from "lucide-react";

const INPUTS = [
  { icon: Smartphone, text: "Social media usage" },
  { icon: BookOpen,   text: "Academic background & study habits" },
  { icon: Activity,   text: "Physical activity" },
  { icon: Moon,       text: "Sleep" },
  { icon: Gauge,      text: "Stress levels" },
  { icon: User,       text: "Demographic information" },
  { icon: Globe,      text: "Country" },
];

const FLOW = [
  { title: "You answer",          text: "Twelve questions in the form above." },
  { title: "Form validates",      text: "Each value is checked against the same limits the API uses." },
  { title: "FastAPI runs model",  text: "Scaling and encoding happen on the server, not in the browser." },
  { title: "You see the result",  text: "The predicted score is shown as returned by the model." },
];

export default function About() {
  return (
    <section id="about" className="scroll-mt-16 border-t border-border bg-surface">
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">

        {/* Header row */}
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet/20 bg-violet/[0.07] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-violet">
              About
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-prose-bright">
              About the project
            </h2>
            <p className="mt-4 max-w-prose leading-relaxed text-prose-soft">
              This application uses a machine learning model trained on student lifestyle data to predict
              a mental health score. It is an <strong className="text-prose">educational ML project</strong> — not a
              medical diagnostic tool. The score has no defined bands or clinical meaning and is shown as a
              plain number.
            </p>
          </div>

          {/* Model inputs grid */}
          <ul className="grid gap-2 sm:grid-cols-2">
            {INPUTS.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="flex items-center gap-3 rounded-xl border border-border bg-surface-hi px-4 py-3 text-[0.95rem] font-medium text-prose transition-all duration-200 hover:border-border-hi hover:bg-surface-elevated"
              >
                <Icon aria-hidden className="h-5 w-5 shrink-0 text-accent/70" />
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* How it works */}
        <h3 className="mt-14 font-display text-xl font-bold text-prose-bright">
          How a prediction is made
        </h3>
        <ol className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FLOW.map((s, i) => (
            <li
              key={s.title}
              className="rounded-2xl border border-border bg-surface-hi p-5 transition-all duration-200 hover:border-border-hi hover:bg-surface-elevated"
            >
              <span className="font-display text-2xl font-extrabold text-gradient">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-2 font-semibold text-prose-bright">{s.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-prose-soft">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
