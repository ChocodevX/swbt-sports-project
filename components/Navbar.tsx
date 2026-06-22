"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const HomeIcon = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 11.5 12 4l9 7.5M5 10v10h14V10" />
  </svg>
);

const BookIcon = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2V5Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 17H6a2 2 0 0 0-2 2" />
  </svg>
);

const GameIcon = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h4m-2-2v4" />
    <circle cx="15.5" cy="11.5" r="0.5" fill="currentColor" stroke="none" />
    <circle cx="17.5" cy="13.5" r="0.5" fill="currentColor" stroke="none" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h10a4 4 0 0 1 4 4v2a3 3 0 0 1-5.4 1.8l-.6-.8H8l-.6.8A3 3 0 0 1 2 13v-2a4 4 0 0 1 4-4Z" />
  </svg>
);

const mainItem: NavItem = { href: "/main", label: "Main", icon: HomeIcon };
const secondaryItems: NavItem[] = [
  { href: "/docs", label: "Docs", icon: BookIcon },
  { href: "/minigame", label: "Minigame", icon: GameIcon },
];

function NavButton({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        active ? "text-white" : "text-slate-400 hover:text-slate-200"
      }`}
    >
      {active && (
        <motion.span
          layoutId="nav-active"
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
          className="absolute inset-0 -z-10 rounded-full bg-indigo-500/30 ring-1 ring-inset ring-indigo-400/40"
        />
      )}
      {item.icon}
      <span>{item.label}</span>
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname() ?? "";

  return (
    <>
      {/* Top blur fade mask (recreated from the .mask SCSS) */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-40 h-24 backdrop-blur-sm"
        style={{
          background:
            "linear-gradient(to bottom, var(--background), transparent)",
          maskImage:
            "linear-gradient(rgba(0,0,0,1) 25%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage:
            "linear-gradient(rgba(0,0,0,1) 25%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* Floating pill navbar — always visible */}
      <header className="fixed inset-x-0 top-4 z-50 flex justify-center">
        <nav className="flex items-center gap-1 rounded-full border border-white/10 bg-slate-900/70 p-1.5 shadow-2xl backdrop-blur-md">
          <NavButton item={mainItem} active={pathname === mainItem.href} />
          <span className="mx-1 h-6 w-px bg-white/10" />
          {secondaryItems.map((item) => (
            <NavButton
              key={item.href}
              item={item}
              active={pathname.startsWith(item.href)}
            />
          ))}
        </nav>
      </header>
    </>
  );
}
