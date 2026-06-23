"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

export type GameState = "WAITING" | "COUNTDOWN" | "PLAYING" | "DONE";

export const GAME_DURATION = 30; // วินาที
const COUNTDOWN_FROM = 3;
const VISIBILITY_THRESHOLD = 0.5;

// ✨ เพิ่มดัชนีจุดสำหรับหัวไหล่
const LEFT_SHOULDER = 11;
const RIGHT_SHOULDER = 12;
const LEFT_WRIST = 15;
const RIGHT_WRIST = 16;

// 💡 เกณฑ์ระยะห่าง (ปรับเปลี่ยนตามความเหมาะสมได้)
// แขนตึง (ชก): ระยะห่างระหว่างไหล่ถึงข้อมือมากกว่าค่านี้
const PUNCH_THRESHOLD = 0.28; 
// ดึงหมัดกลับ (ตั้งการ์ด): ระยะห่างลดลงมาต่ำกว่าค่านี้ ถึงจะชกหมัดต่อไปได้
const RETRACT_THRESHOLD = 0.20;

type UseBoxingGameOptions = {
  onDone?: (score: number) => void;
  // Fired on every punch, with the punching wrist in *video pixel* coords.
  onPunch?: (pos: { x: number; y: number }) => void;
};

export function useBoxingGame({ onDone, onPunch }: UseBoxingGameOptions = {}) {
  const [state, setState] = useState<GameState>("WAITING");
  const [count, setCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [countdown, setCountdown] = useState(COUNTDOWN_FROM);

  const stateRef = useRef<GameState>("WAITING");
  const countRef = useRef(0);
  
  // ✨ ใช้ refs แยกสถานะของหมัดซ้ายและหมัดขวา
  const isLeftExtendedRef = useRef(false);
  const isRightExtendedRef = useRef(false);
  
  const onDoneRef = useRef(onDone);
  const onPunchRef = useRef(onPunch);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    onPunchRef.current = onPunch;
  }, [onPunch]);

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

  const startPlaying = useCallback(() => {
    countRef.current = 0;
    isLeftExtendedRef.current = false;
    isRightExtendedRef.current = false;
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

  const processFrame = useCallback(
    (
      landmarks: NormalizedLandmark[] | undefined,
      video?: { width: number; height: number }
    ) => {
      const current = stateRef.current;
      
      const leftWrist = landmarks?.[LEFT_WRIST];
      const rightWrist = landmarks?.[RIGHT_WRIST];
      const leftShoulder = landmarks?.[LEFT_SHOULDER];
      const rightShoulder = landmarks?.[RIGHT_SHOULDER];

      // ตรวจสอบความพร้อมของทุกจุดที่จำเป็น
      const allVisible =
        !!leftWrist && !!rightWrist && !!leftShoulder && !!rightShoulder &&
        (leftWrist.visibility ?? 1) > VISIBILITY_THRESHOLD &&
        (rightWrist.visibility ?? 1) > VISIBILITY_THRESHOLD &&
        (leftShoulder.visibility ?? 1) > VISIBILITY_THRESHOLD &&
        (rightShoulder.visibility ?? 1) > VISIBILITY_THRESHOLD;

      if (current === "WAITING") {
        if (allVisible) startCountdown();
        return;
      }

      if (current === "PLAYING" && allVisible) {
        // 🧮 คำนวณระยะห่างแบบ Euclidean Distance (2D) ระหว่าง ไหล่ กับ ข้อมือ
        const leftDist = Math.hypot(leftWrist.x - leftShoulder.x, leftWrist.y - leftShoulder.y);
        const rightDist = Math.hypot(rightWrist.x - rightShoulder.x, rightWrist.y - rightShoulder.y);

        let scoreChanged = false;

        const w = video?.width ?? 0;
        const h = video?.height ?? 0;

        // 🥊 เช็คหมัดซ้าย
        if (!isLeftExtendedRef.current && leftDist > PUNCH_THRESHOLD) {
          // ยืดแขนชกออกไป!
          isLeftExtendedRef.current = true;
          countRef.current += 1;
          scoreChanged = true;
          onPunchRef.current?.({ x: leftWrist.x * w, y: leftWrist.y * h });
        } else if (isLeftExtendedRef.current && leftDist < RETRACT_THRESHOLD) {
          // ดึงหมัดซ้ายกลับมาตั้งการ์ดแล้ว
          isLeftExtendedRef.current = false;
        }

        // 🥊 เช็คหมัดขวา
        if (!isRightExtendedRef.current && rightDist > PUNCH_THRESHOLD) {
          // ยืดแขนชกออกไป!
          isRightExtendedRef.current = true;
          countRef.current += 1;
          scoreChanged = true;
          onPunchRef.current?.({ x: rightWrist.x * w, y: rightWrist.y * h });
        } else if (isRightExtendedRef.current && rightDist < RETRACT_THRESHOLD) {
          // ดึงหมัดขวากลับมาตั้งการ์ดแล้ว
          isRightExtendedRef.current = false;
        }

        if (scoreChanged) {
          setCount(countRef.current);
        }
      }
    },
    [startCountdown]
  );

  const reset = useCallback(() => {
    clearTimer();
    countRef.current = 0;
    isLeftExtendedRef.current = false;
    isRightExtendedRef.current = false;
    setCount(0);
    setTimeLeft(GAME_DURATION);
    setCountdown(COUNTDOWN_FROM);
    setGameState("WAITING");
  }, [clearTimer, setGameState]);

  useEffect(() => clearTimer, [clearTimer]);

  return { state, count, timeLeft, countdown, processFrame, reset };
}