import CardNav, { type CardNavItem } from "@/components/CardNav";

const navItems: CardNavItem[] = [
  {
    label: "Docs",
    bgColor: "#0e1b33",
    textColor: "#dbeafe",
    links: [
      { label: "Overview", href: "/main", ariaLabel: "Docs overview" },
      { label: "Scoring", href: "/ranking", ariaLabel: "Scoring guide" },
      { label: "Use Case", href: "/use-case", ariaLabel: "Use cases" },
    ],
  },
  {
    label: "Games",
    bgColor: "#13294f",
    textColor: "#dbeafe",
    links: [
      { label: "All minigames", href: "/minigame", ariaLabel: "All minigames" },
      { label: "67 Speed", href: "/minigame/67-speed", ariaLabel: "Play 67 Speed" },
      { label: "Shadowbox", href: "/minigame/shadowbox", ariaLabel: "Play Shadowbox" },
      { label: "Pose-Off", href: "/minigame/pose-off", ariaLabel: "Play Pose-Off" },
    ],
  },
  // {
  //   label: "Ranking",
  //   bgColor: "#16335c",
  //   textColor: "#dbeafe",
  //   links: [
  //     { label: "Team rankings", href: "/ranking", ariaLabel: "Team rankings" },
  //     { label: "Green", href: "/ranking", ariaLabel: "Green team" },
  //     { label: "Red", href: "/ranking", ariaLabel: "Red team" },
  //     { label: "Blue", href: "/ranking", ariaLabel: "Blue team" },
  //     // { label: "Yellow", href: "/ranking", ariaLabel: "Yellow team" },
  //   ],
  // },
  {
    label: "Author",
    bgColor: "#1b3a6b",
    textColor: "#e0ecff",
    links: [
      { label: "Meet the team", href: "/author", ariaLabel: "Meet the team" },
      { label: "GitHub", href: "https://github.com", ariaLabel: "GitHub" },
      { label: "Discord", href: "https://discord.com", ariaLabel: "Discord" },
      { label: "Contact", href: "mailto:hello@example.com", ariaLabel: "Contact the author" },
    ],
  },
];

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#030b18] text-white">
      <CardNav
        logo="/reactbits-gh-white-CwYbRgPy.svg"
        logoAlt="Sarsas Contest"
        items={navItems}
        theme="dark"
        baseColor="rgba(13, 23, 42, 0.45)"
        menuColor="#dbeafe"
        buttonBgColor="#3b82f6"
        buttonTextColor="#ffffff"
        ease="circ.out"
        ctaText="Play"
        ctaHref="/minigame"
      />
      <main className="mx-auto max-w-5xl px-6 pb-16 pt-28">{children}</main>
    </div>
  );
}
