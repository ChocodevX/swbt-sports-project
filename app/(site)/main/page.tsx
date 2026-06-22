import MinigameGrid from "@/components/MinigameGrid";

const features = [
  {
    title: "Compete",
    body: "Go head-to-head with other classrooms in live contests. Every round you play feeds a real-time leaderboard, so you always know where your class stands.",
    points: ["Live leaderboard", "Weekly brackets", "Class rankings"],
  },
  {
    title: "Learn",
    body: "Pick up the rules, scoring, and strategy in the docs. Short, focused guides get you ready to compete in just a few minutes.",
    points: ["Step-by-step guides", "Scoring breakdown", "Tips & FAQ"],
  },
  {
    title: "Play",
    body: "Warm up with quick, motion-based minigames between rounds. Easy to jump into, hard to put down — and they sharpen the skills the contest rewards.",
    points: ["One-tap to start", "Motion tracking", "Beat your best"],
  },
];

export default function MainPage() {
  return (
    <div className="pb-12">
      {/* Hero */}
      <section className="flex flex-col items-center gap-6 pb-12 text-center">
        <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-widest text-indigo-300">
          Welcome
        </span>
        <h1 className="text-5xl font-extrabold tracking-tight md:text-6xl">
          Sarsas Contest
        </h1>
        <p className="max-w-xl text-slate-300">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Explore the docs or
          jump into a minigame from the navbar above.
        </p>

        <div className="mt-6 grid w-full gap-4 text-left sm:grid-cols-3">
          {features.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
            >
              <h3 className="mb-2 text-lg font-semibold">{card.title}</h3>
              <p className="mb-4 text-sm leading-relaxed text-slate-400">
                {card.body}
              </p>
              <ul className="space-y-1.5">
                {card.points.map((p) => (
                  <li
                    key={p}
                    className="flex items-center gap-2 text-sm text-slate-300"
                  >
                    <span className="text-indigo-400">✓</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Separator between landing and minigames */}
      <div className="my-12 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* Minigames */}
      <section>
        <MinigameGrid heading="Minigames" />
      </section>
    </div>
  );
}
