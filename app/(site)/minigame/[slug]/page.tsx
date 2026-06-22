import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { minigames, getGame } from "@/lib/minigames";

export function generateStaticParams() {
  return minigames.map((g) => ({ slug: g.slug }));
}

export default async function PlayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = getGame(slug);

  if (!game) notFound();

  return (
    <section className="flex flex-col items-center gap-6 py-12 text-center">
      <Link
        href="/minigame"
        className="self-start text-sm text-slate-400 transition hover:text-white"
      >
        ← Back to minigames
      </Link>

      <div className="relative aspect-[3/4] w-48 overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
        <Image
          src={game.cover}
          alt={game.title}
          fill
          sizes="192px"
          className="object-cover"
        />
      </div>

      <h1 className="text-4xl font-extrabold tracking-tight">{game.title}</h1>
      <p className="max-w-md text-slate-300">{game.tagline}</p>

      <div className="rounded-2xl border border-white/10 bg-white/5 px-8 py-6 backdrop-blur-md">
        <p className="text-lg font-semibold">Get ready…</p>
        <p className="mt-1 text-sm text-slate-400">
          This game is under construction — we&apos;ll build it here next.
        </p>
      </div>
    </section>
  );
}
