"use client";

import CircularGallery from "@/components/CircularGallery";

const VIDEO_A = "/74c35cb7-2f50-4098-89ee-e3845197f29a.mp4";
const VIDEO_B = "/fc2e1e10-3fa4-4f12-a4e5-f31d88d6e532.mp4";

// Six use-case mockups, each rendered as a live video card in the circular
// gallery. The two available clips are alternated across the cards.
const useCases = [
  { text: "Classroom Contests", video: VIDEO_A },
  { text: "PE Warm-ups", video: VIDEO_B },
  { text: "Live Leaderboards", video: VIDEO_A },
  { text: "Motion Tracking", video: VIDEO_B },
  { text: "Squad Battles", video: VIDEO_A },
  { text: "Daily Challenges", video: VIDEO_B },
].map((u) => ({ ...u, image: "" }));

export default function UseCasePage() {
  return (
    <section className="py-8">
      <h1 className="mb-2 text-4xl font-bold tracking-tight">Use Cases</h1>
      <p className="mb-8 text-slate-400">
        Drag, scroll, or swipe through the ways Sarsas Contest gets classrooms
        moving.
      </p>

      <div className="relative h-[600px] w-full">
        <CircularGallery
          items={useCases}
          bend={3}
          borderRadius={0.05}
          textColor="#dbeafe"
          font="bold 28px sans-serif"
          scrollEase={0.04}
        />
      </div>
    </section>
  );
}
