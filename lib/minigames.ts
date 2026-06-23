export type Minigame = {
  slug: string;
  title: string;
  cover: string;
  tagline: string;
  href?: string;
};

export const minigames: Minigame[] = [
  {
    slug: "67-speed",
    title: "67 Speed",
    cover: "/67.jpg",
    tagline: "Cross your hands as fast as you can in 30 seconds.",
    href: "/game/67",
  },
  {
    slug: "shadowbox",
    title: "Shadowbox",
    cover: "/shadowboxing.jpg",
    tagline: "Throw combos and dodge to the beat.",
    href: "/game/boxing",
  },
  {
    slug: "squat",
    title: "Squat",
    cover: "/squat.png",
    tagline: "Do squats to score points.",
    href: "/game/squad",
  },
];

export function getGame(slug: string): Minigame | undefined {
  return minigames.find((g) => g.slug === slug);
}
