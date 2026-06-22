"use client";

type ScoreDisplayProps = {
  count: number;
  timeLeft: number;
};

export default function ScoreDisplay({ count, timeLeft }: ScoreDisplayProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-6 flex justify-center gap-4">
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-6 py-3 text-center backdrop-blur-md">
        <p className="text-xs uppercase tracking-widest text-slate-400">Count</p>
        <p className="text-4xl font-black tabular-nums text-white">{count}</p>
      </div>
      <div
        className={`rounded-2xl border px-6 py-3 text-center backdrop-blur-md ${
          timeLeft <= 5
            ? "border-rose-400/40 bg-rose-500/20"
            : "border-white/10 bg-slate-900/70"
        }`}
      >
        <p className="text-xs uppercase tracking-widest text-slate-400">Time</p>
        <p className="text-4xl font-black tabular-nums text-white">
          {timeLeft}
        </p>
      </div>
    </div>
  );
}
