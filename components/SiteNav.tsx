"use client";

import CardNav, { type CardNavItem } from "@/components/CardNav";
import { usePlayerScore } from "@/hooks/usePlayerScore";

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
      { label: "67 Speed", href: "/game/67", ariaLabel: "Play 67 Speed" },
      { label: "Shadowbox", href: "/game/boxing", ariaLabel: "Play Shadowbox" },
      { label: "Pose-Off", href: "/game/squad", ariaLabel: "Squad" },
    ],
  },
  {
    label: "Author",
    bgColor: "#1b3a6b",
    textColor: "#e0ecff",
    links: [
      { label: "Meet the team", href: "/author", ariaLabel: "Meet the team" },
      {
        label: "Facebook",
        href: "https://www.facebook.com/sarasasdotswbt",
        ariaLabel: "Facebook",
      },
      {
        label: "Tiktok",
        href: "https://www.tiktok.com/@swbtschool.official",
        ariaLabel: "Tiktok",
      },
    ],
  },
];

export default function SiteNav() {
  const score = usePlayerScore();

  return (
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
      // Non-clickable points badge in place of the old "Play" button.
      cta={
        <span
          className="card-nav-cta-button"
          style={{
            backgroundColor: "#3b82f6",
            color: "#ffffff",
            cursor: "default",
          }}
          aria-label="Your points"
        >
          ⭐ {score?.toLocaleString() ?? "—"}
        </span>
      }
    />
  );
}
