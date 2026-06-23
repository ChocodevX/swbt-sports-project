import { supabase } from './supabase';
import { getStoredPlayerId } from './players';
import type { GameType } from './types';

export type SaveResult = 'saved' | 'skipped' | 'rate_limited' | 'error';

const MAX_PLAYS_PER_DAY = 10;

// Per-game weighting so the stored (and team-aggregated) score is comparable
// across games of different difficulty. The in-game/end-game UI still shows the
// raw rep count — only the value written to the DB is weighted.
const SCORE_MULTIPLIER: Record<GameType, number> = {
  speed_67: 1 / 3, // crosses are fast/cheap → scaled down
  boxing: 1,       // unchanged
  pushup: 4,       // squats are hard → scaled up
};

// Read the current player's weighted total (sum of best scores). Null when not
// logged in or Supabase is unconfigured.
export async function getPlayerTotalScore(): Promise<number | null> {
  if (!supabase) return null;
  const playerId = getStoredPlayerId();
  if (!playerId) return null;
  const { data } = await supabase
    .from('players')
    .select('total_score')
    .eq('id', playerId)
    .single();
  return data?.total_score ?? null;
}

export async function saveScore(game: GameType, score: number): Promise<SaveResult> {
  if (!supabase) return 'skipped';
  const playerId = getStoredPlayerId();
  if (!playerId) return 'skipped';

  const today = new Date().toISOString().slice(0, 10);

  const { data: player, error: fetchErr } = await supabase
    .from('players')
    .select('play_count_today, last_played_date')
    .eq('id', playerId)
    .single();
  if (fetchErr || !player) return 'error';

  let playCount = player.play_count_today;
  if (player.last_played_date !== today) {
    await supabase
      .from('players')
      .update({ play_count_today: 0, last_played_date: today })
      .eq('id', playerId);
    playCount = 0;
  }

  if (playCount >= MAX_PLAYS_PER_DAY) return 'rate_limited';

  // Store the weighted score (UI keeps showing the raw count).
  const dbScore = Math.round(score * SCORE_MULTIPLIER[game]);

  const { error: scoreErr } = await supabase.rpc('upsert_best_score', {
    p_player_id: playerId,
    p_game: game,
    p_score: dbScore,
  });
  if (scoreErr) return 'error';

  const { data: allScores } = await supabase
    .from('scores')
    .select('score')
    .eq('player_id', playerId);
  const total = (allScores ?? []).reduce((s: number, r: { score: number }) => s + r.score, 0);

  await supabase
    .from('players')
    .update({ total_score: total, play_count_today: playCount + 1, last_played_date: today })
    .eq('id', playerId);

  await supabase.from('audit_logs').insert({
    event: 'score_saved',
    player_id: playerId,
    metadata: { game, score },
  });

  fetch('/api/notify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: `🎮 Player ${playerId} scored ${score} on ${game}` }),
  }).catch(() => {});

  return 'saved';
}
