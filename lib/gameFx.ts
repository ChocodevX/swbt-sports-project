// Client-only sound + confetti helpers for the minigames.
// Tone.js / Howler / canvas-confetti are imported lazily so nothing touches
// the AudioContext (or `window`) during SSR. Every public call is wrapped in a
// try/catch — FX should never be able to crash the game.

import type * as ToneType from "tone";
import type { Howl as HowlType } from "howler";

// --- Lazy module loaders -----------------------------------------------------

let tonePromise: Promise<typeof ToneType> | null = null;
const getTone = () => (tonePromise ??= import("tone"));

let howlerPromise: Promise<typeof import("howler")> | null = null;
const getHowler = () => (howlerPromise ??= import("howler"));

const loadConfetti = () => import("canvas-confetti");
let confettiPromise: ReturnType<typeof loadConfetti> | null = null;
const getConfetti = () => (confettiPromise ??= loadConfetti());

// Warm up Tone early so the unlock gesture handler can call Tone.start()
// without first awaiting a network import (browser autoplay policy is strict
// about how long after a gesture you may resume the AudioContext).
export function preloadAudio() {
  void getTone();
}

let unlocked = false;
export async function unlockAudio() {
  if (unlocked) return;
  try {
    const Tone = await getTone();
    await Tone.start();
    unlocked = true;
  } catch {
    /* AudioContext couldn't resume yet — try again on the next gesture. */
  }
}

// --- Tone instruments (created lazily, reused across calls) -------------------

let beepSynth: ToneType.Synth | null = null;
let tickSynth: ToneType.Synth | null = null;
let chordSynth: ToneType.PolySynth<ToneType.Synth> | null = null;

async function getBeepSynth() {
  const Tone = await getTone();
  beepSynth ??= new Tone.Synth({
    oscillator: { type: "triangle" },
    envelope: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.15 },
    volume: -4,
  }).toDestination();
  return beepSynth;
}

async function getTickSynth() {
  const Tone = await getTone();
  tickSynth ??= new Tone.Synth({
    oscillator: { type: "square" },
    envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.02 },
    volume: -8,
  }).toDestination();
  return tickSynth;
}

async function getChordSynth() {
  const Tone = await getTone();
  chordSynth ??= new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "sawtooth" },
    envelope: { attack: 0.02, decay: 0.3, sustain: 0.25, release: 0.9 },
    volume: -10,
  }).toDestination();
  return chordSynth;
}

// Countdown pitches climb 3 → 2 → 1, then GO! lands clearly higher.
const COUNT_NOTES: Record<number, string> = { 3: "A4", 2: "B4", 1: "C#5" };

export async function playCountBeep(value: number) {
  try {
    await unlockAudio();
    const synth = await getBeepSynth();
    synth.triggerAttackRelease(COUNT_NOTES[value] ?? "A4", "8n");
  } catch {
    /* ignore */
  }
}

export async function playGoBeep() {
  try {
    await unlockAudio();
    const synth = await getBeepSynth();
    synth.triggerAttackRelease("E5", "4n");
  } catch {
    /* ignore */
  }
}

export async function playTick() {
  try {
    await unlockAudio();
    const synth = await getTickSynth();
    synth.triggerAttackRelease("C6", "32n");
  } catch {
    /* ignore */
  }
}

export async function playFanfare() {
  try {
    await unlockAudio();
    const Tone = await getTone();
    const synth = await getChordSynth();
    const now = Tone.now();
    // Quick arpeggio resolving into a held C-major chord.
    synth.triggerAttackRelease("C5", "8n", now);
    synth.triggerAttackRelease("E5", "8n", now + 0.1);
    synth.triggerAttackRelease("G5", "8n", now + 0.2);
    synth.triggerAttackRelease(["C5", "E5", "G5", "C6"], "1n", now + 0.32);
  } catch {
    /* ignore */
  }
}

// --- Background music (Howler) ----------------------------------------------

let bgm: HowlType | null = null;
let bgmSrc: string | null = null;

export async function startBgm(src = "/sounds/bgm.mp3") {
  try {
    const { Howl } = await getHowler();
    // Switching tracks (e.g. between games) → tear down the old Howl first.
    if (bgm && bgmSrc !== src) {
      bgm.stop();
      bgm.unload();
      bgm = null;
    }
    if (!bgm) {
      bgm = new Howl({ src: [src], loop: true, volume: 0.35, html5: true });
      bgmSrc = src;
    }
    if (!bgm.playing()) bgm.play();
  } catch {
    /* ignore */
  }
}

export function stopBgm() {
  try {
    bgm?.stop();
  } catch {
    /* ignore */
  }
}

// --- Confetti (game over) ----------------------------------------------------

export async function celebrate() {
  try {
    const confetti = (await getConfetti()).default;
    const colors = ["#a5b4fc", "#6366f1", "#e0e7ff", "#fbbf24"];
    const end = Date.now() + 900;
    (function rain() {
      confetti({
        particleCount: 6,
        startVelocity: 35,
        angle: 270, // straight down — rains in from the top
        spread: 70,
        origin: { x: Math.random(), y: -0.1 },
        colors,
        gravity: 1.1,
        scalar: 1.1,
        ticks: 200,
      });
      if (Date.now() < end) requestAnimationFrame(rain);
    })();
  } catch {
    /* ignore */
  }
}
