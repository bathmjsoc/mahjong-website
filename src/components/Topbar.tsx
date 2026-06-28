"use client";

import { LayoutDashboard, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "@/actions/auth";
import { useTournament } from "@/context/TournamentContext";
import { FilledButton } from "@/elements/FilledButton";
import { TabLink, TabMenu } from "@/elements/TabMenu";

const TABS = [
  { label: "Tables", href: "" },
  { label: "Logs", href: "/logs" },
  { label: "Sessions", href: "/sessions" },
  { label: "Analytics", href: "/analytics" },
] as const;

export function Topbar() {
  const { tournamentId } = useTournament();
  const router = useRouter();

  return (
    <nav className="bg-accent flex items-center justify-between h-15 px-5 z-50">
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

      <div className="flex gap-5 items-center justify-center">
        <FilledButton
          onClick={() => router.push("/dashboard")}
          className="bg-primary size-9 rounded-xl hover:text-info"
        >
          <LayoutDashboard className="size-5" />
        </FilledButton>

        <FilledButton
          onClick={signOut}
          className="bg-primary size-9 rounded-xl hover:text-negative"
        >
          <LogOut className="size-5" />
        </FilledButton>
      </div>
    </nav>
  );
}
