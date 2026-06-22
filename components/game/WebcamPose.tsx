"use client";

import { useEffect, useRef, useState } from "react";
import {
  DrawingUtils,
  PoseLandmarker,
  type NormalizedLandmark,
} from "@mediapipe/tasks-vision";

type WebcamPoseProps = {
  poseLandmarker: PoseLandmarker | null;
  onResults: (landmarks: NormalizedLandmark[] | undefined) => void;
};

export default function WebcamPose({
  poseLandmarker,
  onResults,
}: WebcamPoseProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onResultsRef = useRef(onResults);
  useEffect(() => {
    onResultsRef.current = onResults;
  }, [onResults]);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!poseLandmarker) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    let cancelled = false;
    let rafId = 0;
    let stream: MediaStream | null = null;
    let lastTs = -1;
    const ctx = canvas.getContext("2d")!;
    const drawingUtils = new DrawingUtils(ctx);

    const loop = () => {
      rafId = requestAnimationFrame(loop);
      if (video.readyState < 2 || video.videoWidth === 0) return;

      if (canvas.width !== video.videoWidth) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      const ts = performance.now();
      if (ts <= lastTs) return;
      lastTs = ts;

      const result = poseLandmarker.detectForVideo(video, ts);
      const landmarks = result.landmarks?.[0];

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (landmarks) {
        // drawingUtils.drawConnectors(
        //   landmarks,
        //   PoseLandmarker.POSE_CONNECTIONS,
        //   { color: "#a5b4fc", lineWidth: 3 }
        // );
        // drawingUtils.drawLandmarks(landmarks, {
        //   color: "#6366f1",
        //   fillColor: "#e0e7ff",
        //   radius: 4,
        // });
      }

      onResultsRef.current(landmarks);
    };

    (async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        // A second StrictMode mount (or unmount) may have already cancelled us.
        if (cancelled) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        stream = s;
        video.srcObject = stream;
        try {
          await video.play();
        } catch (e) {
          // play() rejects with AbortError when the element reloads; ignore it.
          if (e instanceof DOMException && e.name === "AbortError") return;
          throw e;
        }
        if (cancelled) return;
        rafId = requestAnimationFrame(loop);
      } catch (e) {
        if (cancelled) return;
        setError(
          e instanceof Error
            ? `Camera error: ${e.message}`
            : "Could not access the camera."
        );
      }
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      stream?.getTracks().forEach((t) => t.stop());
      video.srcObject = null;
    };
  }, [poseLandmarker]);

  return (
    <div className="absolute inset-0">
      <video
        ref={videoRef}
        muted
        playsInline
        className="h-full w-full -scale-x-100 object-cover"
      />
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full -scale-x-100 object-cover"
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 p-6 text-center">
          <p className="max-w-sm text-sm text-rose-300">{error}</p>
        </div>
      )}
    </div>
  );
}
