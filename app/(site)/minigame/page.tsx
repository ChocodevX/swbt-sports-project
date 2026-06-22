import MinigameGrid from "@/components/MinigameGrid";

export default function MinigamePage() {
  return (
    <section className="py-8">
      <h1 className="mb-2 text-4xl font-bold tracking-tight">Minigame</h1>
      <p className="mb-10 text-slate-400">
        Pick a game and jump in. More on the way.
      </p>

      <MinigameGrid />
    </section>
  );
}
