// MediaPipe's pose graph logs a couple of benign warnings straight from the
// compiled WASM (Emscripten routes them through console.warn/console.error).
// They can't be configured away from the JS side — the `.task` graph is fixed —
// and they don't affect detection. This installs a narrow filter that drops ONLY
// those exact lines so they stop spamming the console. Everything else passes
// through untouched.

const SILENCED = [
  "Using NORM_RECT without IMAGE_DIMENSIONS", // landmark_projection_calculator.cc
  "OpenGL error checking is disabled", // gl_context.cc
];

let installed = false;

export function silenceMediapipeWarnings() {
  if (installed || typeof window === "undefined") return;
  installed = true;

  const isSilenced = (args: unknown[]) =>
    args.some(
      (a) => typeof a === "string" && SILENCED.some((s) => a.includes(s))
    );

  const wrap = (original: (...args: unknown[]) => void) =>
    function (this: unknown, ...args: unknown[]) {
      if (isSilenced(args)) return;
      original.apply(this, args);
    };

  // Glog "W…"/"E…" lines come through both channels depending on severity.
  console.warn = wrap(console.warn.bind(console));
  console.error = wrap(console.error.bind(console));
}
