import CardNav, { type CardNavItem } from "@/components/CardNav";

const navItems: CardNavItem[] = [
  {
    label: "Docs",
    bgColor: "#0e1b33",
    textColor: "#dbeafe",
    links: [
      { label: "Main", href: "/main", ariaLabel: "Docs overview" },
      { label: "Scoring", href: "/ranking", ariaLabel: "Scoring guide" },
      { label: "Use Case", href: "/use-case", ariaLabel: "Use cases" },
    ],
  },
  {
    label: "Games",
    bgColor: "#13294f",
    textColor: "#dbeafe",
    links: [
      // { label: "All minigames", href: "/minigame", ariaLabel: "All minigames" },
      { label: "67 Speed", href: "/game/67", ariaLabel: "Play 67 Speed" },
      { label: "Shadowbox", href: "/game/boxing", ariaLabel: "Play Shadowbox" },
      { label: "Pose-Off", href: "/game/squad", ariaLabel: "Squad" },
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
      { label: "Facebook", href: "https://www.facebook.com/sarasasdotswbt", ariaLabel: "Facebook" },
      { label: "Tiktok", href: "https://www.tiktok.com/@swbtschool.official", ariaLabel: "Tiktok" },
      // { label: "Contact", href: "https://google.com/swbt.online5201@gmail.com", ariaLabel: "Gmail" },
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
        logo="/swbtbanner.png"
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
