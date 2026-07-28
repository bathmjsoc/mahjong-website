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
  const tournamentId = useTournamentContext();

  const router = useRouter();

  return (
    <div className="z-50 flex h-15 items-center justify-between bg-accent px-5">
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

      <div className="flex items-center justify-center gap-5">
        <FilledButton
          onClick={() => router.push("/dashboard")}
          className="size-9 rounded-xl bg-primary hover:text-info"
        >
          <LayoutDashboard className="size-5" />
        </FilledButton>

        <FilledButton
          onClick={signOut}
          className="size-9 rounded-xl bg-primary hover:text-negative"
        >
          <LogOut className="size-5" />
        </FilledButton>
      </div>
    </div>
  );
}
