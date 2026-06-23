"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

export type ParticleHandle = {
  /** Spawn a burst at (x, y) in video-pixel coords. */
  spawn: (x: number, y: number) => void;
};

// Per-game look & feel. Physics (velocity/gravity/life) is shared below.
export type ParticleStyle = {
  glyph: string | string[]; // text/emoji drawn (array → random per particle)
  count: [min: number, max: number]; // particles spawned per punch
  fontSize: [min: number, max: number]; // px
  fontFamily: string;
  bold: boolean;
  stroke: boolean; // white outline under the glyph (skip for emoji)
  randomColor: boolean; // fill with a random color (skip for emoji)
  rotation: [min: number, max: number]; // radians
};

export const PARTICLE_STYLE_67: ParticleStyle = {
  glyph: "67",
  count: [5, 8],
  fontSize: [24, 40],
  fontFamily: "Arial",
  bold: true,
  stroke: true,
  randomColor: true,
  rotation: [-0.3, 0.3],
};

export const PARTICLE_STYLE_BOXING: ParticleStyle = {
  glyph: "🥊",
  count: [3, 3],
  fontSize: [42 * 0.8, 42 * 1.4], // 42px × scale(0.8–1.4) serif
  fontFamily: "serif",
  bold: false,
  stroke: false,
  randomColor: false,
  rotation: [-0.5, 0.5],
};

export const PARTICLE_STYLE_SQUAT: ParticleStyle = {
  glyph: ["🏋️", "💪"], // random one per particle
  count: [4, 6], // fuller burst at the body
  fontSize: [42 * 0.8, 42 * 1.4],
  fontFamily: "serif",
  bold: false,
  stroke: false,
  randomColor: false,
  rotation: [-0.5, 0.5],
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  rotation: number;
  font: string;
  fill: string | null;
  glyph: string;
};

type ParticleCanvasProps = {
  width: number;
  height: number;
  style: ParticleStyle;
};

const GRAVITY = 0.35;
const LIFE_DECAY = 0.035;

// Full-spectrum, fully saturated random color.
const randomColor = () => `hsl(${Math.floor(Math.random() * 360)}, 100%, 60%)`;
const randInt = ([min, max]: [number, number]) =>
  min + Math.floor(Math.random() * (max - min + 1));
const randFloat = ([min, max]: [number, number]) =>
  min + Math.random() * (max - min);

const ParticleCanvas = forwardRef<ParticleHandle, ParticleCanvasProps>(
  function ParticleCanvas({ width, height, style }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);

    // Latest style, read at spawn/draw time without re-subscribing the loop.
    const styleRef = useRef(style);
    styleRef.current = style;

    useImperativeHandle(
      ref,
      () => ({
        spawn(x, y) {
          const s = styleRef.current;
          const particles = particlesRef.current;
          const n = randInt(s.count);
          for (let i = 0; i < n; i++) {
            const size = randFloat(s.fontSize);
            const glyph = Array.isArray(s.glyph)
              ? s.glyph[Math.floor(Math.random() * s.glyph.length)]
              : s.glyph;
            particles.push({
              x,
              y,
              vx: Math.random() * 16 - 8, // -8 … 8
              vy: -8 - Math.random() * 4, // -8 … -12 (shoots up hard)
              life: 1,
              rotation: randFloat(s.rotation),
              font: `${s.bold ? "bold " : ""}${size}px ${s.fontFamily}`,
              fill: s.randomColor ? randomColor() : null,
              glyph,
            });
          }
        },
      }),
      []
    );

    // Size the canvas to the source video so coords map 1:1.
    useEffect(() => {
      const canvas = canvasRef.current;
      if (canvas && width && height) {
        canvas.width = width;
        canvas.height = height;
      }
    }, [width, height]);

    // One animation loop for the canvas lifetime.
    useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      let raf = 0;
      const tick = () => {
        raf = requestAnimationFrame(tick);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const s = styleRef.current;
        const particles = particlesRef.current;
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += GRAVITY;
          p.life -= LIFE_DECAY;

          ctx.save();
          ctx.globalAlpha = Math.max(0, p.life);
          ctx.translate(p.x, p.y);
          // Counter the canvas's CSS -scale-x-100 so the glyph reads forwards.
          ctx.scale(-1, 1);
          ctx.rotate(p.rotation);
          ctx.font = p.font;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          if (s.stroke) {
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#fff";
            ctx.strokeText(p.glyph, 0, 0);
          }
          if (p.fill) ctx.fillStyle = p.fill;
          ctx.fillText(p.glyph, 0, 0);
          ctx.restore();
        }
        ctx.globalAlpha = 1;

        // Drop dead particles.
        if (particles.some((p) => p.life <= 0)) {
          particlesRef.current = particles.filter((p) => p.life > 0);
        }
      };

      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, []);

    // No z-index: by DOM order this sits above the skeleton but below the HUD.
    // Mirrored + object-cover to match WebcamPose's skeleton canvas exactly.
    return (
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full -scale-x-100 object-cover"
      />
    );
  }
);

export default ParticleCanvas;
