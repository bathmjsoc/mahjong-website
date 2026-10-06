"use client";

import { ChartColumn } from "lucide-react";
import { useState } from "react";
import { FilledButton } from "@/elements/FilledButton";
import { RoundedListbox } from "@/elements/RoundedListbox";
import { useLogs } from "@/hooks/logs/useLogs";
import { usePlayers } from "@/hooks/players/usePlayers";
import { useSessions } from "@/hooks/sessions/useSessions";
import { getSessionName } from "@/lib/helpers";
import type { Session } from "@/lib/types";
import { DownloadLogsButton } from "./_components/DownloadLogsButton";
import { Leaderboard } from "./_components/Leaderboard";
import { ViewGraphModal } from "./_components/ViewGraphModal";

export default function SessionsPage() {
  const { logsWithDisabled, overallScores, sessionScores } = useLogs();
  const { players, playersWithDeleted } = usePlayers();
  const { sessions } = useSessions();

  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isGraphModalOpen, setIsGraphModalOpen] = useState(false);

  const scores = selectedSession
    ? (sessionScores[selectedSession.id] ?? {})
    : overallScores;

  const activePlayers = players.filter((player) => player.id in scores);

  return (
    <>
      <div className="flex flex-col items-center gap-5 py-10">
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
          <FilledButton
            className="flex w-full items-center justify-center gap-2 text-sm"
            disabled={activePlayers.length === 0}
            onClick={() => setIsGraphModalOpen(true)}
          >
            <ChartColumn className="size-5" />
            View Graph
          </FilledButton>

          <DownloadLogsButton
            logs={logsWithDisabled}
            players={playersWithDeleted}
            sessions={sessions}
          />
        </div>

        <Leaderboard players={activePlayers} scores={scores} />
      </div>

      <ViewGraphModal
        isOpen={isGraphModalOpen}
        onClose={() => setIsGraphModalOpen(false)}
        players={activePlayers}
        scores={scores}
      />
    </>
  );
}
