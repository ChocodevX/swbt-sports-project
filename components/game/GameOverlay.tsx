"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import type { GameState } from "@/hooks/use67Game";

export type SaveStatus = "idle" | "saving" | "saved" | "skipped" | "rate_limited" | "error";
// ✨ เพิ่มประเภทเกมให้เลือกส่งเข้ามา
export type GameType = "67" | "boxing" | "squat"; 

type GameOverlayProps = {
  state: GameState;
  countdown: number;
  count: number;
  saveStatus: SaveStatus;
  onReset: () => void;
  gameType?: GameType; // ✨ รับค่าประเภทเกมเข้ามา (ถ้าไม่ส่งมาจะให้เป็น "67" อัตโนมัติ)
};

const saveMessage: Record<SaveStatus, string> = {
  idle: "",
  saving: "Saving score…",
  saved: "Score saved!",
  skipped: "Score save skipped (Supabase not configured).",
  rate_limited: "Daily play limit reached (10/day). Come back tomorrow!",
  error: "Couldn't save score.",
};

export default function GameOverlay({
  state,
  countdown,
  count,
  saveStatus,
  onReset,
  gameType = "67", // ✨ ค่าเริ่มต้นคือเกม 67
}: GameOverlayProps) {

  // 📝 ใช้ IF-ELSE เตรียมข้อความตามประเภทเกมตรงนี้เลย
  let waitingTitle = "🙌 Show both hands";
  let waitingDescription = "Raise your hands into view to begin.";
  let unitLabel = "crosses";

  if (gameType === "boxing") {
    waitingTitle = "🥊 Get into Boxing Stance";
    waitingDescription = "Bring your hands up to guard to begin.";
    unitLabel = "punches";
  } else if (gameType === "squat") {
    waitingTitle = "🧍‍♂️ Stand up straight";
    waitingDescription = "Step back so your full body is visible to begin.";
    unitLabel = "squats";
  }

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <AnimatePresence mode="wait">
        {state === "WAITING" && (
          <motion.div
            key="waiting"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl border border-white/10 bg-slate-900/70 px-8 py-5 text-center backdrop-blur-md"
          >
            {/* 🎯 นำข้อความที่ผ่าน if-else มาแสดงผล */}
            <p className="text-2xl font-bold text-white">{waitingTitle}</p>
            <p className="mt-1 text-sm text-slate-400">{waitingDescription}</p>
          </motion.div>
        )}

        {state === "COUNTDOWN" && (
          <motion.p
            key={`cd-${countdown}`}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.6, opacity: 0 }}
            className="text-9xl font-black text-white drop-shadow-2xl"
          >
            {countdown > 0 ? countdown : "GO!"}
          </motion.p>
        )}

        {state === "DONE" && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pointer-events-auto rounded-3xl border border-white/10 bg-slate-900/85 px-10 py-8 text-center backdrop-blur-md"
          >
            <p className="text-sm uppercase tracking-widest text-indigo-300">
              Time&apos;s up
            </p>
            <p className="mt-2 text-6xl font-black text-white">{count}</p>
            {/* 🎯 หน่วยนับที่เปลี่ยนตาม if-else */}
            <p className="text-sm text-slate-400">{unitLabel}</p>

            {saveStatus !== "idle" && (
              <p
                className={`mt-4 text-xs ${
                  saveStatus === "error" ? "text-rose-300" : "text-slate-400"
                }`}
              >
                {saveMessage[saveStatus]}
              </p>
            )}

            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={onReset}
                className="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-400"
              >
                Play again
              </button>
              <Link
                href="/minigame"
                className="rounded-lg border border-white/15 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/10"
              >
                Back to minigames
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}