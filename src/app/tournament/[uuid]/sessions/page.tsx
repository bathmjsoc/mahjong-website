"use client";

import { useState } from "react";
import { RoundedListbox } from "@/elements/RoundedListbox";
import { useLogs } from "@/hooks/logs/useLogs";
import { usePlayers } from "@/hooks/players/usePlayers";
import { useSessions } from "@/hooks/sessions/useSessions";
import type { Session } from "@/lib/types";
import { getSessionName } from "@/lib/ui";
import { DownloadLogsButton } from "./_components/DownloadLogsButton";
import { Leaderboard } from "./_components/Leaderboard";
import { ViewGraphButton } from "./_components/ViewGraphButton";

export default function SessionsPage() {
  const { logsWithDisabled, overallScores, sessionScores } = useLogs();
  const { players, playersWithDeleted } = usePlayers();
  const { sessions } = useSessions();

  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const scores = selectedSession
    ? (sessionScores[selectedSession.id] ?? {})
    : overallScores;

  const activePlayers = players.filter((player) => player.id in scores);

  return (
    <div className="flex flex-col items-center gap-5 p-10">
      <RoundedListbox<Session | null>
        buttonClassName="text-primary border-primary border-2 h-10 rounded-lg w-sm"
        getOptionKey={(session) => session?.id ?? "overall"}
        getOptionLabel={getSessionName}
        onChange={setSelectedSession}
        options={[null, ...sessions]}
        placeholder="Overall Standings"
        value={selectedSession}
      />

      <div className="flex w-sm gap-2">
        <ViewGraphButton
          players={activePlayers}
          scores={scores}
          session={selectedSession}
        />

        <DownloadLogsButton
          logs={logsWithDisabled}
          players={playersWithDeleted}
          sessions={sessions}
        />
      </div>

      <Leaderboard players={activePlayers} scores={scores} />
    </div>
  );
}
