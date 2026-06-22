import { minigames } from "@/lib/minigames";
import MinigameCard from "./MinigameCard";

export default function MinigameGrid({ heading }: { heading?: string }) {
  return (
    <div>
      {heading && (
        <h2 className="mb-6 text-2xl font-bold tracking-tight">{heading}</h2>
      )}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {minigames.map((game) => (
          <MinigameCard key={game.slug} game={game} />
        ))}
      </div>
    </div>
  );
}
