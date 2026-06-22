"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

export type GameState = "WAITING" | "COUNTDOWN" | "PLAYING" | "DONE";

export const GAME_DURATION = 30; // วินาที
const COUNTDOWN_FROM = 3;
const VISIBILITY_THRESHOLD = 0.5;

// ✨ เปลี่ยนมาใช้จุดสะโพกและหัวเข่า
const LEFT_HIP = 23;
const RIGHT_HIP = 24;
const LEFT_KNEE = 25;
const RIGHT_KNEE = 26;

// 💡 เกณฑ์ระยะห่างแนวตั้ง (แกน Y) ระหว่างสะโพกและหัวเข่า
// ยิ่งย่อตัวลง ค่า Y ของสะโพกจะยิ่งเข้าใกล้ค่า Y ของหัวเข่า (ส่วนต่างจะน้อยลง)
const SQUAT_DOWN_THRESHOLD = 0.08; // ย่อลงมาจนสะโพกใกล้ระดับเข่า (น้อยกว่า 8% ของจอ)
const SQUAT_UP_THRESHOLD = 0.18;   // ยืดตัวขึ้นจนสะโพกสูงกว่าเข่าเคลียร์ๆ (มากกว่า 18% ของจอ)

type UseSquatGameOptions = {
  onDone?: (score: number) => void;
};

export function useSquatGame({ onDone }: UseSquatGameOptions = {}) {
  const [state, setState] = useState<GameState>("WAITING");
  const [count, setCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [countdown, setCountdown] = useState(COUNTDOWN_FROM);

  const stateRef = useRef<GameState>("WAITING");
  const countRef = useRef(0);
  
  // ✨ ใช้สำหรับจำว่าตอนนี้ผู้เล่น "ย่อตัวอยู่หรือไม่"
  const isSquattingRef = useRef(false);
  
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

  const startPlaying = useCallback(() => {
    countRef.current = 0;
    isSquattingRef.current = false;
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
    (landmarks: NormalizedLandmark[] | undefined) => {
      const current = stateRef.current;
      
      const leftHip = landmarks?.[LEFT_HIP];
      const rightHip = landmarks?.[RIGHT_HIP];
      const leftKnee = landmarks?.[LEFT_KNEE];
      const rightKnee = landmarks?.[RIGHT_KNEE];

      // เช็คว่าเห็นท่อนล่าง (สะโพกและเข่า) ชัดเจนไหม
      const lowerBodyVisible =
        !!leftHip && !!rightHip && !!leftKnee && !!rightKnee &&
        (leftHip.visibility ?? 1) > VISIBILITY_THRESHOLD &&
        (rightHip.visibility ?? 1) > VISIBILITY_THRESHOLD &&
        (leftKnee.visibility ?? 1) > VISIBILITY_THRESHOLD &&
        (rightKnee.visibility ?? 1) > VISIBILITY_THRESHOLD;

      if (current === "WAITING") {
        if (lowerBodyVisible) startCountdown();
        return;
      }

      if (current === "PLAYING" && lowerBodyVisible) {
        // หาค่าเฉลี่ยระยะแนวตั้ง (Y) ระหว่างสะโพกและหัวเข่าของทั้งสองข้าง
        const leftDiffY = leftKnee.y - leftHip.y;
        const rightDiffY = rightKnee.y - rightHip.y;
        const avgDiffY = (leftDiffY + rightDiffY) / 2;

        // 🧘‍♂️ จังหวะที่ 1: ผู้เล่นย่อตัวลงมาจนต่ำกว่าเกณฑ์ (สะโพกใกล้เข่า)
        if (!isSquattingRef.current && avgDiffY < SQUAT_DOWN_THRESHOLD) {
          isSquattingRef.current = true;
          console.log("⬇️ ย่อตัวลงสุดแล้ว!");
        } 
        
        // 🧍‍♂️ จังหวะที่ 2: ผู้เล่นยืนยืดตัวกลับขึ้นไปจนสุด ถึงจะยอมนับคะแนนให้ +1
        else if (isSquattingRef.current && avgDiffY > SQUAT_UP_THRESHOLD) {
          isSquattingRef.current = false;
          countRef.current += 1;
          setCount(countRef.current);
          console.log("⬆️ ยืดตัวตรง! นับคะแนน:", countRef.current);
        }
      }
    },
    [startCountdown]
  );

  const reset = useCallback(() => {
    clearTimer();
    countRef.current = 0;
    isSquattingRef.current = false;
    setCount(0);
    setTimeLeft(GAME_DURATION);
    setCountdown(COUNTDOWN_FROM);
    setGameState("WAITING");
  }, [clearTimer, setGameState]);

  useEffect(() => clearTimer, [clearTimer]);

  return { state, count, timeLeft, countdown, processFrame, reset };
}