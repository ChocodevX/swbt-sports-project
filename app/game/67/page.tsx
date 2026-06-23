"use client";

import { useCallback, useRef, useState } from "react";
import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import Link from "next/link";
import WebcamPose from "@/components/game/WebcamPose";
import ScoreDisplay from "@/components/game/ScoreDisplay";
import GameOverlay, { type SaveStatus } from "@/components/game/GameOverlay";
import ParticleCanvas, {
  type ParticleHandle,
  PARTICLE_STYLE_67,
} from "@/components/game/ParticleCanvas";
import { usePoseLandmarker } from "@/hooks/usePoseLandmarker";
import { use67Game } from "@/hooks/use67Game";
import { useGameFx } from "@/hooks/useGameFx";
import { playTick } from "@/lib/gameFx";
import { saveScore } from "@/lib/scores";

export default function Game67Page() {
  const { poseLandmarker, ready, error } = usePoseLandmarker();
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [videoSize, setVideoSize] = useState({ width: 0, height: 0 });
  const particleRef = useRef<ParticleHandle>(null);

  const onDone = useCallback(async (score: number) => {
    setSaveStatus("saving");
    try {
      const result = await saveScore("speed_67", score);
      setSaveStatus(result);
    } catch {
      setSaveStatus("error");
    }
  }, []);

  // Each cross: short beep + a particle burst at the left wrist.
  const onPunch = useCallback((pos: { x: number; y: number }) => {
    void playTick();
    particleRef.current?.spawn(pos.x, pos.y);
  }, []);

  const { state, count, timeLeft, countdown, processFrame, reset } = use67Game({
    onDone,
    onPunch,
  });

  // Capture the video resolution once it's known (re-renders only on change),
  // then forward every frame to the game's processFrame.
  const handleResults = useCallback(
    (
      landmarks: NormalizedLandmark[] | undefined,
      video: { width: number; height: number }
    ) => {
      if (video.width && video.height) {
        setVideoSize((prev) =>
          prev.width === video.width && prev.height === video.height
            ? prev
            : video
        );
      }
      processFrame(landmarks, video);
    },
    [processFrame]
  );

  // Countdown beeps, BGM, and the game-over fanfare + confetti.
  useGameFx(state, countdown);

  const handleReset = useCallback(() => {
    setSaveStatus("idle");
    reset();
  }, [reset]);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black text-white">
      {/* Camera + skeleton */}
      {ready && poseLandmarker && (
        <WebcamPose poseLandmarker={poseLandmarker} onResults={handleResults} />
      )}

      {/* Particle layer — above the skeleton, below the HUD/overlay UI */}
      <ParticleCanvas
        ref={particleRef}
        style={PARTICLE_STYLE_67}
        width={videoSize.width}
        height={videoSize.height}
      />

      {/* HUD while playing */}
      {(state === "PLAYING" || state === "COUNTDOWN") && (
        <ScoreDisplay count={count} timeLeft={timeLeft} />
      )}

      {/* State-driven overlay UI */}
      {ready && (
        <GameOverlay
          state={state}
          countdown={countdown}
          count={count}
          saveStatus={saveStatus}
          onReset={handleReset}
        />
      )}

      {/* Loading / error states */}
      {!ready && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-indigo-400" />
          <p className="text-sm text-slate-400">Loading pose model…</p>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <p className="max-w-sm text-sm text-rose-300">{error}</p>
          <Link
            href="/minigame"
            className="text-sm text-slate-400 underline hover:text-white"
          >
            Back to minigames
          </Link>
        </div>
      )}

      {/* Persistent back link */}
      <Link
        href="/minigame"
        className="absolute left-6 top-6 z-10 rounded-lg border border-white/15 bg-slate-900/60 px-3 py-1.5 text-sm text-slate-200 backdrop-blur-md transition hover:bg-white/10"
      >
        ← Exit
      </Link>

      {/* Title */}
      <div className="pointer-events-none absolute bottom-6 left-6 z-10">
        <p className="text-xs uppercase tracking-widest text-indigo-300">
          Minigame
        </p>
        <p className="text-lg font-bold">67 Speed</p>
      </div>
    </main>
  );
}
