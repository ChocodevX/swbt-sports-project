"use client";

import { useEffect, useState } from "react";
import { getPlayerTotalScore } from "@/lib/scores";

// Returns the logged-in player's weighted total points, or null while loading /
// when not logged in. Resolves once on mount (the nav remounts after each game).
export function usePlayerScore(): number | null {
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    getPlayerTotalScore().then((s) => {
      if (!cancelled) setScore(s);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return score;
}
