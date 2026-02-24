"use client";

import { useTournament } from "@/context/TournamentContext";
import { TabLink, TabMenu } from "@/elements/TabMenu";

const TABS = [
  { label: "Tables", href: "" },
  { label: "Logs", href: "/logs" },
  { label: "Sessions", href: "/sessions" },
  { label: "Analytics", href: "/analytics" },
] as const;

export function Topbar() {
  const { tournamentId } = useTournament();

  return (
    <nav className="bg-(--accent-color) flex items-center h-15 pl-5 z-50">
      <TabMenu>
        {TABS.map(({ label, href }) => (
          <TabLink
            key={label}
            href={`/tournament/${tournamentId}${href}`}
            className="w-30"
          >
            {label}
          </TabLink>
        ))}
      </TabMenu>
    </nav>
  );
}
