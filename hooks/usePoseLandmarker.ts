"use client";

import { useEffect, useRef, useState } from "react";
import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";

// Self-hosted WASM (copied from the package into /public/mediapipe/wasm).
export const WASM_PATH = "/mediapipe/wasm";
// Pose model (lite = fast realtime). Swap to a self-hosted .task later if desired.
export const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task";

type UsePoseLandmarker = {
  poseLandmarker: PoseLandmarker | null;
  ready: boolean;
  error: string | null;
};

export function usePoseLandmarker(): UsePoseLandmarker {
  const [poseLandmarker, setPoseLandmarker] = useState<PoseLandmarker | null>(
    null
  );
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const instanceRef = useRef<PoseLandmarker | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(WASM_PATH);
        const landmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: MODEL_URL, delegate: "GPU" },
          runningMode: "VIDEO",
          numPoses: 1,
        });
        if (cancelled) {
          landmarker.close();
          return;
        }
        instanceRef.current = landmarker;
        setPoseLandmarker(landmarker);
        setReady(true);
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : "Failed to load pose model."
          );
        }
      }
    })();

    return () => {
      cancelled = true;
      instanceRef.current?.close();
      instanceRef.current = null;
    };
  }, []);

  return { poseLandmarker, ready, error };
}
