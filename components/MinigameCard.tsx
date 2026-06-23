import Image from "next/image";
import Link from "next/link";
import type { Minigame } from "@/lib/minigames";

export default function MinigameCard({
  game,
  priority = false,
}: {
  game: Minigame;
  priority?: boolean;
}) {
  return (
    <Link
      href={game.href ?? `/minigame/${game.slug}`}
      className="group relative block aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 shadow-2xl transition-transform duration-300 hover:-translate-y-1"
    >
      <Image
        src={game.cover}
        alt={game.title}
        fill
        // Eager-load the first (above-the-fold) cover so it isn't lazy LCP.
        priority={priority}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Bottom gradient + content */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="text-lg font-bold tracking-tight text-white">
          {game.title}
        </h3>
        <p className="mt-1 text-xs leading-snug text-slate-300">
          {game.tagline}
        </p>
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-indigo-500/90 px-3 py-1 text-xs font-semibold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          ▶ Play
        </span>
      </div>
    </Link>
  );
}
