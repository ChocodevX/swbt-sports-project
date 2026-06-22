"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "@/lib/supabase";
import type { Classroom } from "@/lib/types";

type ClassroomSelectProps = {
  value: string;
  onChange: (classroom: { id: number; name: string }) => void;
};

export default function ClassroomSelect({
  value,
  onChange,
}: ClassroomSelectProps) {
  const [open, setOpen] = useState(false);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase
      .from("classrooms")
      .select("id, name, color, building")
      .order("name")
      .then(({ data }) => {
        if (data) setClassrooms(data as Classroom[]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={loading}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-slate-900/60 px-4 py-2.5 text-left text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 disabled:opacity-50"
      >
        <span className={value ? "text-white" : "text-slate-500"}>
          {loading ? "Loading…" : value || "Select classroom"}
        </span>
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="h-4 w-4 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -8, scaleY: 0.9 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -8, scaleY: 0.9 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{ transformOrigin: "top" }}
            className="absolute z-20 mt-2 max-h-56 w-full overflow-auto rounded-lg border border-white/10 bg-slate-900/95 p-1 shadow-2xl backdrop-blur-md"
          >
            {classrooms.map((room, i) => (
              <motion.li
                key={room.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.015 }}
              >
                <button
                  type="button"
                  onClick={() => {
                    onChange({ id: room.id, name: room.name });
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition hover:bg-indigo-500/20 ${
                    value === room.name ? "bg-indigo-500/30 text-white" : "text-slate-200"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: room.color }}
                    />
                    {room.name}
                  </span>
                  {value === room.name && (
                    <svg
                      className="h-4 w-4 text-indigo-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
