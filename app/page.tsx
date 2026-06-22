"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BlurText from "@/components/BlurText";
import ClassroomSelect from "@/components/ClassroomSelect";
import { registerPlayer } from "@/lib/players";

export default function LoginPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [classroom, setClassroom] = useState<{ id: number; name: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    if (!classroom) return;
    setSubmitting(true);
    setError(null);
    const playerId = await registerPlayer(firstName, lastName, classroom.id);
    if (playerId) {
      router.push("/main");
    } else {
      setError("Could not register — check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Left: login form */}
      <div className="flex min-h-screen items-center md:ml-[12%]">
        <form
          onSubmit={handleConfirm}
          className="m-6 w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md"
        >
          {/* Logo */}
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-fuchsia-500 text-xl font-black text-white shadow-lg">
              S
            </span>
            <div className="leading-tight">
              <p className="text-lg font-bold tracking-tight">Sarsas</p>
              <p className="text-xs text-slate-400">Contest Portal</p>
            </div>
          </div>

          <h2 className="mb-6 text-2xl font-semibold">Login</h2>

          <label className="mb-4 block">
            <span className="mb-1 block text-sm text-slate-300">First name</span>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              required
              className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-4 py-2.5 text-white placeholder-slate-500 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30"
            />
          </label>

          <label className="mb-4 block">
            <span className="mb-1 block text-sm text-slate-300">Last name</span>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
              required
              className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-4 py-2.5 text-white placeholder-slate-500 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30"
            />
          </label>

          <div className="mb-6 block">
            <span className="mb-1 block text-sm text-slate-300">Classroom</span>
            <ClassroomSelect
              value={classroom?.name ?? ""}
              onChange={setClassroom}
            />
          </div>

          {error && (
            <p className="mb-4 text-xs text-rose-300">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting || !classroom}
            className="w-full rounded-lg bg-indigo-500 px-4 py-2.5 font-medium text-white transition hover:bg-indigo-400 active:scale-[0.99] disabled:opacity-50"
          >
            {submitting ? "Registering…" : "Confirm"}
          </button>
        </form>
      </div>

      {/* Right / bottom-right: branding */}
      <div className="pointer-events-none absolute bottom-0 right-0 max-w-2xl p-8 text-right md:p-16">
        <BlurText
          text="Sarsas Contest"
          animateBy="words"
          delay={150}
          className="justify-end text-5xl font-extrabold leading-tight tracking-tight md:text-7xl"
        />
        <p className="mt-4 text-sm text-slate-300 md:text-base">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
          ad minim veniam, quis nostrud exercitation ullamco.
        </p>

        <div className="pointer-events-auto mt-6 flex justify-end gap-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="text-slate-300 transition hover:text-white"
          >
            <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.891h-2.33v6.987C18.343 21.128 22 16.991 22 12z" />
            </svg>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-slate-300 transition hover:text-white"
          >
            <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.741 0 8.332.014 7.052.072 2.695.272.273 2.69.073 7.052.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.332 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.668-.072-4.948-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-slate-300 transition hover:text-white"
          >
            <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
        </div>
      </div>
    </main>
  );
}
