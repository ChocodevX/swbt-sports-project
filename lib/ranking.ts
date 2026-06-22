import { supabase } from "./supabase";
import type { TeamColor } from "./types";

export type TeamScore = {
  color: TeamColor;
  total: number;
  players: number;
};

// Fixed list so every team always shows on the board, even with 0 points.
export const TEAM_COLORS: TeamColor[] = ["green", "red", "blue", "yellow"];

// Display metadata for each team color — labels and the hex used for bars,
// glows and accents across the ranking UI.
export const TEAM_META: Record<
  TeamColor,
  { label: string; hex: string; glow: string }
> = {
  green: { label: "Green", hex: "#22c55e", glow: "34 197 94" },
  red: { label: "Red", hex: "#ef4444", glow: "239 68 68" },
  blue: { label: "Blue", hex: "#3b82f6", glow: "59 130 246" },
  yellow: { label: "Yellow", hex: "#eab308", glow: "234 179 8" },
};

// Aggregate every player's total_score by their classroom color, returning all
// four teams sorted highest-first. Returns zeroed teams when Supabase is
// unconfigured so the UI still renders.
export async function getTeamScores(): Promise<TeamScore[]> {
  const empty = TEAM_COLORS.map((color) => ({ color, total: 0, players: 0 }));
  if (!supabase) return empty;

  const { data, error } = await supabase
    .from("players")
    .select("total_score, classrooms(color)");
  if (error || !data) return empty;

  const totals = new Map<TeamColor, { total: number; players: number }>(
    TEAM_COLORS.map((c) => [c, { total: 0, players: 0 }])
  );

  for (const row of data as unknown as {
    total_score: number | null;
    classrooms: { color: TeamColor } | { color: TeamColor }[] | null;
  }[]) {
    const cls = Array.isArray(row.classrooms) ? row.classrooms[0] : row.classrooms;
    const color = cls?.color;
    if (!color || !totals.has(color)) continue;
    const entry = totals.get(color)!;
    entry.total += row.total_score ?? 0;
    entry.players += 1;
  }

  return TEAM_COLORS.map((color) => ({ color, ...totals.get(color)! })).sort(
    (a, b) => b.total - a.total
  );
}
