"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  getTeamScores,
  TEAM_META,
  type TeamScore,
} from "@/lib/ranking";

const MEDALS = ["🥇", "🥈", "🥉"];

function fmt(n: number) {
  return n.toLocaleString();
}

export default function RankingPage() {
  const [teams, setTeams] = useState<TeamScore[] | null>(null);

  useEffect(() => {
    getTeamScores().then(setTeams);
  }, []);

  const leaderTotal = teams?.[0]?.total ?? 0;
  // Podium order: 2nd, 1st, 3rd so the winner stands tallest in the middle.
  const podium = teams ? [teams[1], teams[0], teams[2]].filter(Boolean) : [];

  return (
    <section className="py-8">
      <div className="mb-10">
        <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-widest text-indigo-300">
          Leaderboard
        </span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight">Team Rankings</h1>
        <p className="mt-2 text-slate-400">
          Every point scored across the minigames, totalled up by team color.
        </p>
      </div>

      {!teams ? (
        <RankingSkeleton />
      ) : (
        <>
          {/* Podium — top three teams */}
          <div className="mb-12 grid grid-cols-3 items-end gap-3 sm:gap-6">
            {podium.map((team) => {
              const place = (teams.indexOf(team) + 1) as 1 | 2 | 3;
              const meta = TEAM_META[team.color];
              const height = place === 1 ? "h-40" : place === 2 ? "h-32" : "h-24";
              return (
                <motion.div
                  key={team.color}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * place, type: "spring", stiffness: 260, damping: 24 }}
                  className="flex flex-col items-center"
                >
                  <span className="mb-2 text-3xl">{MEDALS[place - 1]}</span>
                  <div
                    className={`flex ${height} w-full flex-col items-center justify-start rounded-t-xl border-t border-white/20 px-2 pt-3`}
                    style={{
                      background: `linear-gradient(to top, ${meta.hex}55, ${meta.hex}11)`,
                      boxShadow: `0 0 40px -8px rgb(${meta.glow} / 0.6)`,
                    }}
                  >
                    <span className="text-sm font-bold text-white">
                      {meta.label}
                    </span>
                    <span className="mt-1 text-lg font-extrabold tabular-nums text-white">
                      {fmt(team.total)}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Full ranked list with animated bars */}
          <div className="space-y-3">
            {teams.map((team, i) => {
              const meta = TEAM_META[team.color];
              const pct = leaderTotal > 0 ? (team.total / leaderTotal) * 100 : 0;
              return (
                <motion.div
                  key={team.color}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-900/50 p-4 backdrop-blur-sm"
                  style={{ boxShadow: i === 0 ? `0 0 30px -10px rgb(${meta.glow} / 0.5)` : undefined }}
                >
                  <span className="w-6 text-center text-lg font-bold tabular-nums text-slate-500">
                    {i + 1}
                  </span>
                  <span
                    className="h-8 w-8 shrink-0 rounded-full ring-2 ring-white/20"
                    style={{ backgroundColor: meta.hex }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex items-baseline justify-between">
                      <span className="font-semibold text-white">{meta.label}</span>
                      <span className="text-sm text-slate-400">
                        {fmt(team.total)} pts
                        <span className="ml-2 text-slate-600">
                          · {team.players} {team.players === 1 ? "player" : "players"}
                        </span>
                      </span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.2 + 0.08 * i, duration: 0.7, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: meta.hex }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}

function RankingSkeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-[68px] animate-pulse rounded-2xl border border-white/10 bg-slate-900/50"
        />
      ))}
    </div>
  );
}
