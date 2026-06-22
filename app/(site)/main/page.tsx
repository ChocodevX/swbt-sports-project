import MinigameGrid from "@/components/MinigameGrid";
import Aurora from "@/components/Aurora";
import BorderGlow from "@/components/BorderGlow";
import CircularGallery from "@/components/CircularGallery";

const VIDEO_A = "/74c35cb7-2f50-4098-89ee-e3845197f29a.mp4";
const VIDEO_B = "/fc2e1e10-3fa4-4f12-a4e5-f31d88d6e532.mp4";

// Use-case mockups for the home page gallery — same six clips as /use-case.
const useCases = [
  { text: "Classroom Contests", video: VIDEO_A },
  { text: "PE Warm-ups", video: VIDEO_B },
  { text: "Live Leaderboards", video: VIDEO_A },
  { text: "Motion Tracking", video: VIDEO_B },
  { text: "Squad Battles", video: VIDEO_A },
  { text: "Daily Challenges", video: VIDEO_B },
].map((u) => ({ ...u, image: "" }));

// Inline Chakra-style sparkle icon (filled, currentColor) — used instead of
// emoji so it renders identically across operating systems. Sized at 1.725rem
// (15% larger than the previous 1.5rem icons).
const SparkleIcon = (
  <svg className="h-[1.725rem] w-[1.725rem]" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M 5.398 10.807 C 5.574 10.931 5.785 10.998 6 10.997 C 6.216 10.998 6.427 10.93 6.602 10.804 C 6.78 10.674 6.915 10.494 6.989 10.286 L 7.436 8.913 C 7.551 8.569 7.744 8.256 8 7.999 C 8.257 7.743 8.569 7.549 8.913 7.434 L 10.304 6.983 C 10.456 6.929 10.594 6.84 10.706 6.724 C 10.817 6.608 10.901 6.467 10.949 6.313 C 10.998 6.159 11.01 5.996 10.985 5.837 C 10.96 5.677 10.898 5.526 10.804 5.394 C 10.67 5.208 10.479 5.071 10.26 5.003 L 8.885 4.556 C 8.541 4.442 8.228 4.249 7.971 3.993 C 7.714 3.736 7.52 3.424 7.405 3.079 L 6.953 1.691 C 6.881 1.489 6.748 1.314 6.571 1.191 C 6.439 1.098 6.286 1.036 6.125 1.012 C 5.965 0.987 5.801 1.001 5.646 1.051 C 5.492 1.101 5.351 1.187 5.236 1.301 C 5.12 1.415 5.033 1.555 4.98 1.708 L 4.523 3.108 C 4.409 3.443 4.22 3.748 3.97 3.999 C 3.721 4.25 3.418 4.441 3.083 4.557 L 1.692 5.005 C 1.541 5.06 1.404 5.149 1.292 5.265 C 1.18 5.381 1.097 5.521 1.048 5.675 C 1 5.829 0.988 5.992 1.013 6.151 C 1.038 6.31 1.099 6.462 1.192 6.593 C 1.32 6.773 1.501 6.908 1.709 6.979 L 3.083 7.424 C 3.524 7.571 3.91 7.845 4.193 8.212 C 4.356 8.423 4.481 8.66 4.564 8.912 L 5.016 10.303 C 5.088 10.507 5.222 10.683 5.398 10.807 Z M 11.535 14.849 C 11.671 14.946 11.834 14.997 12 14.997 C 12.165 14.997 12.326 14.946 12.461 14.851 C 12.601 14.753 12.706 14.613 12.761 14.451 L 13.009 13.689 C 13.063 13.531 13.152 13.387 13.269 13.268 C 13.387 13.15 13.531 13.061 13.689 13.009 L 14.461 12.757 C 14.619 12.703 14.756 12.6 14.852 12.464 C 14.926 12.361 14.974 12.242 14.992 12.117 C 15.011 11.992 14.999 11.865 14.959 11.745 C 14.918 11.625 14.85 11.516 14.76 11.428 C 14.669 11.34 14.559 11.274 14.438 11.236 L 13.674 10.987 C 13.516 10.935 13.372 10.846 13.254 10.729 C 13.136 10.611 13.047 10.467 12.994 10.309 L 12.742 9.536 C 12.689 9.379 12.586 9.242 12.449 9.146 C 12.347 9.073 12.23 9.025 12.106 9.006 C 11.982 8.987 11.855 8.998 11.736 9.037 C 11.616 9.076 11.508 9.142 11.419 9.231 C 11.33 9.319 11.264 9.427 11.224 9.546 L 10.977 10.308 C 10.925 10.466 10.838 10.61 10.721 10.728 C 10.607 10.845 10.467 10.934 10.312 10.987 L 9.539 11.239 C 9.38 11.293 9.242 11.396 9.145 11.533 C 9.047 11.669 8.995 11.833 8.996 12.001 C 8.997 12.169 9.051 12.333 9.15 12.468 C 9.249 12.604 9.388 12.705 9.547 12.757 L 10.31 13.004 C 10.469 13.058 10.614 13.147 10.732 13.265 C 10.851 13.384 10.939 13.528 10.99 13.687 L 11.243 14.461 C 11.298 14.618 11.4 14.753 11.535 14.849 Z" />
  </svg>
);

const features = [
  {
    icon: SparkleIcon,
    body: "Go head-to-head with other classrooms in live contests. Every round you play feeds a real-time leaderboard, so you always know where your class stands.",
    points: ["Live leaderboard", "Weekly brackets", "Class rankings"],
  },
  {
    icon: SparkleIcon,
    body: "Pick up the rules, scoring, and strategy in the docs. Short, focused guides get you ready to compete in just a few minutes.",
    points: ["Step-by-step guides", "Scoring breakdown", "Tips & FAQ"],
  },
  {
    icon: SparkleIcon,
    body: "Warm up with quick, motion-based minigames between rounds. Easy to jump into, hard to put down — and they sharpen the skills the contest rewards.",
    points: ["One-tap to start", "Motion tracking", "Beat your best"],
  },
];

export default function MainPage() {
  return (
    <div className="pb-12">
      {/* Full-bleed Aurora hero — starts at the very top of the page,
          breaks out of the centered container and cancels the layout's top
          padding so there's no gap above it. */}
      <div className="relative left-1/2 right-1/2 -mx-[50vw] -mt-28 w-screen overflow-hidden">
        {/* Aurora canvas */}
        <div className="pointer-events-none absolute inset-0">
          <Aurora
            colorStops={["#1e40af", "#3b82f6", "#60a5fa"]}
            amplitude={1.1}
            blend={0.55}
            speed={0.8}
          />
        </div>
        {/* Bottom fade into the exact page background so the hero connects seamlessly */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#030b18]" />

        {/* Hero content sits on top of the aurora */}
        <section className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 pb-16 pt-36 text-center">
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-widest text-indigo-300 backdrop-blur-sm">
            Welcome
          </span>
          <h1 className="text-5xl font-extrabold tracking-tight md:text-6xl">
            Sarsas Contest
          </h1>
          <p className="max-w-xl text-slate-200">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Explore the docs or
            jump into a minigame from the navbar above.
          </p>
        </section>
      </div>

      {/* Feature cards — connected directly under the hero, minimal gap */}
      <section className="pb-12">
        <div className="grid w-full gap-4 text-left sm:grid-cols-3">
          {features.map((card, i) => (
            <BorderGlow
              key={i}
              className="h-full"
              backgroundColor="#0a1326"
              borderRadius={16}
              glowColor="210 90 65"
              glowRadius={30}
              coneSpread={40}
              colors={["#60a5fa", "#3b82f6", "#22d3ee"]}
            >
              <div className="p-6">
                <div className="mb-3 text-blue-300">
                  {card.icon}
                </div>
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
            </BorderGlow>
          ))}
        </div>
      </section>

      {/* Separator between landing and use cases */}
      <div className="my-12 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* Use cases — circular video gallery */}
      <section>
        <h2 className="mb-2 text-2xl font-bold tracking-tight">Use Cases</h2>
        <p className="mb-6 text-slate-400">
          Drag or scroll through the ways Sarsas Contest gets classrooms moving.
        </p>
        <div className="relative h-[500px] w-full">
          <CircularGallery
            items={useCases}
            bend={3}
            borderRadius={0.05}
            textColor="#dbeafe"
            font="bold 28px sans-serif"
            scrollEase={0.04}
          />
        </div>
      </section>

      {/* Separator between use cases and minigames */}
      <div className="my-12 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* Minigames */}
      <section>
        <MinigameGrid heading="Minigames" />
      </section>
    </div>
  );
}
