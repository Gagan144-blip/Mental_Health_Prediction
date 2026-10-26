import { BookOpen, Globe, Moon, Smartphone, Activity, Gauge, User } from "lucide-react";

const INPUTS = [
  { icon: Smartphone, text: "Social media usage" },
  { icon: BookOpen, text: "Academic background and study habits" },
  { icon: Activity, text: "Physical activity" },
  { icon: Moon, text: "Sleep" },
  { icon: Gauge, text: "Stress" },
  { icon: User, text: "Demographic information" },
];

const FLOW = [
  { title: "You answer", text: "Twelve questions in the form above." },
  { title: "The form checks", text: "Each value is checked against the same limits the API uses." },
  { title: "FastAPI runs the model", text: "Scaling and encoding happen on the server, not in the browser." },
  { title: "You see the result", text: "The predicted score is shown as returned by the model." },
];

export default function About() {
  return (
    <section id="about" className="scroll-mt-16 border-t border-line bg-white">
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight">About the project</h2>
            <p className="mt-4 max-w-prose leading-relaxed text-ink-soft">
              This application uses a machine learning model to predict a mental health score from information about a
              student&apos;s habits. It is an educational ML project, and it is not a medical diagnostic tool. The
              score has no defined bands or clinical meaning, so it is shown as a plain number.
            </p>
          </div>
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {INPUTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 rounded-xl bg-mist px-4 py-3 text-[0.95rem] font-medium">
                <Icon aria-hidden className="h-5 w-5 shrink-0 text-tide" />
                {text}
              </li>
            ))}
            <li className="flex items-center gap-3 rounded-xl bg-mist px-4 py-3 text-[0.95rem] font-medium sm:col-span-2">
              <Globe aria-hidden className="h-5 w-5 shrink-0 text-tide" />
              Country
            </li>
          </ul>
        </div>

        <h3 className="mt-14 font-display text-xl font-bold">How a prediction is made</h3>
        <ol className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FLOW.map((s, i) => (
            <li key={s.title} className="rounded-2xl border border-line p-5">
              <span className="font-display text-2xl font-bold text-tide">{i + 1}</span>
              <p className="mt-2 font-semibold">{s.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
