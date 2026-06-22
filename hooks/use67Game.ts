"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

export type GameState = "WAITING" | "COUNTDOWN" | "PLAYING" | "DONE";

export const GAME_DURATION = 30; // seconds
const COUNTDOWN_FROM = 3;
const VISIBILITY_THRESHOLD = 0.5;

const LEFT_WRIST = 15;
const RIGHT_WRIST = 16;

type Use67GameOptions = {
  onDone?: (score: number) => void;
};

export function use67Game({ onDone }: Use67GameOptions = {}) {
  const [state, setState] = useState<GameState>("WAITING");
  const [count, setCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [countdown, setCountdown] = useState(COUNTDOWN_FROM);

  // Refs mirror state so the rAF-driven processFrame never reads stale values.
  const stateRef = useRef<GameState>("WAITING");
  const countRef = useRef(0);
  const wasCrossedRef = useRef(false);
  const onDoneRef = useRef(onDone);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  const setGameState = useCallback((next: GameState) => {
    stateRef.current = next;
    setState(next);
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // PLAYING: run the 30s timer, then DONE.
  const startPlaying = useCallback(() => {
    countRef.current = 0;
    wasCrossedRef.current = false;
    setCount(0);
    setGameState("PLAYING");

    let t = GAME_DURATION;
    setTimeLeft(t);
    clearTimer();
    timerRef.current = setInterval(() => {
      t -= 1;
      if (t <= 0) {
        clearTimer();
        setTimeLeft(0);
        setGameState("DONE");
        onDoneRef.current?.(countRef.current);
      } else {
        setTimeLeft(t);
      }
    }, 1000);
  }, [setGameState, clearTimer]);

  // COUNTDOWN: tick 3 → 2 → 1 → start PLAYING.
  const startCountdown = useCallback(() => {
    setGameState("COUNTDOWN");

    let value = COUNTDOWN_FROM;
    setCountdown(value);
    clearTimer();
    timerRef.current = setInterval(() => {
      value -= 1;
      if (value <= 0) {
        clearTimer();
        startPlaying();
      } else {
        setCountdown(value);
      }
    }, 1000);
  }, [setGameState, clearTimer, startPlaying]);

  // Called every frame with the first pose's 33 landmarks (or undefined).
  const processFrame = useCallback(
    (landmarks: NormalizedLandmark[] | undefined) => {
      const current = stateRef.current;
      const leftWrist = landmarks?.[LEFT_WRIST];
      const rightWrist = landmarks?.[RIGHT_WRIST];

      const bothVisible =
        !!leftWrist &&
        !!rightWrist &&
        (leftWrist.visibility ?? 1) > VISIBILITY_THRESHOLD &&
        (rightWrist.visibility ?? 1) > VISIBILITY_THRESHOLD;

      if (current === "WAITING") {
        if (bothVisible) startCountdown();
        return;
      }

if (current === "PLAYING") {
  if (bothVisible) {
    // 💡 ใน MediaPipe ค่า Y ยิ่งน้อย ยิ่งอยู่สูง (0 คือบนสุดของจอ)
    // currentLeftHigher จะเป็น true เมื่อ "มือซ้ายอยู่สูงกว่ามือขวา" (ค่า Y ของซ้าย น้อยกว่า ขวา)
    const currentLeftHigher = leftWrist!.y < rightWrist!.y;

    // ตรวจสอบว่ามีการ "สลับฝั่ง" เกิดขึ้นจากรอบที่แล้วหรือไม่
    // (รอบก่อนซ้ายสูงกว่า รอบนี้ขวาสูงกว่า หรือในทางกลับกัน)
    if (currentLeftHigher !== wasCrossedRef.current) {
      countRef.current += 1;
      setCount(countRef.current);
      
      console.log("Count:", countRef.current);
      console.log("State: สลับมือขึ้นลงสวนกัน");
      
      // อัปเดตสถานะปัจจุบันเก็บไว้เทียบในเฟรมถัดไป
      wasCrossedRef.current = currentLeftHigher;
    }

  } else {
    // ถ้าเอามือลงหรือหลุดจอ ให้ปล่อยผ่าน (ไม่ต้องรีเซ็ตเป็น false ตายตัว 
    // เพื่อให้กลับเข้ามาในจอแล้วเล่นต่อจากท่าเดิมได้เลย ไม่นับเบิ้ลมั่ว)
  }
}
    },
    [startCountdown]
  );

  const reset = useCallback(() => {
    clearTimer();
    countRef.current = 0;
    wasCrossedRef.current = false;
    setCount(0);
    setTimeLeft(GAME_DURATION);
    setCountdown(COUNTDOWN_FROM);
    setGameState("WAITING");
  }, [clearTimer, setGameState]);

  // Cleanup any running timer on unmount.
  useEffect(() => clearTimer, [clearTimer]);

  return { state, count, timeLeft, countdown, processFrame, reset };
}
