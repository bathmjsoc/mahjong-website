"use client";

import { ChartColumn } from "lucide-react";
import { useMemo, useState } from "react";
import { Leaderboard } from "@/components/Leaderboard";
import { FilledButton } from "@/elements/FilledButton";
import { RoundedListbox } from "@/elements/RoundedListbox";
import { useLogs } from "@/hooks/useLogs";
import { usePlayers } from "@/hooks/usePlayers";
import { useSessions } from "@/hooks/useSessions";
import type { Session } from "@/lib/types";
import { getSessionName } from "@/lib/utils";

export default function SessionsPage() {
  const { overallScores, sessionScores } = useLogs();
  const { players } = usePlayers();
  const { sessions } = useSessions();

  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const { scores, activePlayers } = useMemo(() => {
    const isOverall = selectedSession === null;

    const scores = isOverall
      ? overallScores
      : (sessionScores[selectedSession.id] ?? {});

    const activePlayers = isOverall
      ? players
      : players.filter((player) => player.id in scores);

    return { scores, activePlayers };
  }, [overallScores, players, selectedSession, sessionScores]);

  return (
    <div className="flex flex-col items-center gap-7 py-10">
      <RoundedListbox<Session | null>
        value={selectedSession}
        options={[null, ...sessions]}
        onChange={setSelectedSession}
        getOptionLabel={getSessionName}
        placeholder="Overall Standings"
        getOptionKey={(session) => session?.id ?? "overall-standings"}
        buttonClassName="text-primary border-primary border-2 h-10 rounded-lg w-sm"
      />

      <FilledButton className="flex items-center justify-center gap-2 text-sm">
        <ChartColumn className="size-5" />
        Download Graph
      </FilledButton>

      <Leaderboard players={activePlayers} scores={scores} />
    </div>
  );
}
