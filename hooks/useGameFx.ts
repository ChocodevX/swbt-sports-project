"use client";

import { useEffect, useRef } from "react";
import type { GameState } from "@/hooks/use67Game";
import {
  celebrate,
  playCountBeep,
  playFanfare,
  playGoBeep,
  preloadAudio,
  startBgm,
  stopBgm,
  unlockAudio,
} from "@/lib/gameFx";

/**
 * Drives countdown beeps, in-game BGM, and the game-over fanfare/confetti from a
 * game's state machine. Pure side-effects — renders nothing. `bgmSrc` lets each
 * game pick its own looping track.
 */
export function useGameFx(
  state: GameState,
  countdown: number,
  bgmSrc?: string
) {
  const prevState = useRef<GameState>(state);
  const lastCountdown = useRef<number | null>(null);
  const bgmSrcRef = useRef(bgmSrc);
  useEffect(() => {
    bgmSrcRef.current = bgmSrc;
  }, [bgmSrc]);

  // Preload Tone and unlock the AudioContext on the first user gesture
  // (browsers won't let audio play until then).
  useEffect(() => {
    preloadAudio();
    const unlock = () => {
      void unlockAudio();
    };
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);
    window.addEventListener("touchstart", unlock);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      window.removeEventListener("touchstart", unlock);
      stopBgm();
    };
  }, []);

  // Countdown beeps: 3 → 2 → 1 (GO! is handled on the PLAYING transition).
  useEffect(() => {
    if (state !== "COUNTDOWN") return;
    if (countdown === lastCountdown.current) return;
    lastCountdown.current = countdown;
    if (countdown > 0) void playCountBeep(countdown);
  }, [state, countdown]);

  // State transitions.
  useEffect(() => {
    const prev = prevState.current;
    if (prev === state) return;
    prevState.current = state;

    switch (state) {
      case "PLAYING":
        void playGoBeep(); // GO!
        void startBgm(bgmSrcRef.current);
        break;
      case "DONE":
        stopBgm();
        void playFanfare();
        void celebrate();
        break;
      case "WAITING":
        stopBgm();
        lastCountdown.current = null;
        break;
    }
  }, [state]);
}
