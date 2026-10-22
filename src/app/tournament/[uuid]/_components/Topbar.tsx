"use client";

import { LayoutDashboard, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "@/actions/auth";
import { FilledButton } from "@/elements/FilledButton";
import { TabLink, TabMenu } from "@/elements/TabMenu";
import { useTournamentContext } from "@/providers/TournamentProvider";

const TABS = [
  { label: "Tables", href: "" },
  { label: "Logs", href: "/logs" },
  { label: "Sessions", href: "/sessions" },
  { label: "Analytics", href: "/analytics" },
] as const;

export function Topbar() {
  const router = useRouter();
  const tournamentId = useTournamentContext();

  return (
    <div className="bg-accent z-50 flex h-15 items-center justify-between px-5">
      <TabMenu>
        {TABS.map((tab) => (
          <TabLink
            className="w-30"
            href={`/tournament/${tournamentId}${tab.href}`}
            key={tab.href}
          >
            {tab.label}
          </TabLink>
        ))}
      </TabMenu>

      <TabMenu>
        <FilledButton
          className="bg-primary hover:text-info rounded-xl"
          onClick={() => router.push("/dashboard")}
          title="Return to Dashboard"
        >
          <LayoutDashboard className="size-5" />
        </FilledButton>

        <FilledButton
          className="bg-primary hover:text-negative rounded-xl"
          onClick={signOut}
          title="Sign Out"
        >
          <LogOut className="size-5" />
        </FilledButton>
      </TabMenu>
    </div>
  );
}
