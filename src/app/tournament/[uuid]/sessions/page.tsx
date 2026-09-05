"use client";

import { ChartColumn, Download } from "lucide-react";
import { useState } from "react";
import { FilledButton } from "@/elements/FilledButton";
import { RoundedListbox } from "@/elements/RoundedListbox";
import { useLogs } from "@/hooks/logs/useLogs";
import { usePlayers } from "@/hooks/players/usePlayers";
import { useSessions } from "@/hooks/sessions/useSessions";
import type { Session } from "@/lib/types";
import { Leaderboard } from "./_components/Leaderboard";
import { ViewGraphModal } from "./_components/ViewGraphModal";

export default function SessionsPage() {
  const { logs, overallScores, sessionScores } = useLogs();
  const { players } = usePlayers();
  const { sessions } = useSessions();

  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isGraphModalOpen, setIsGraphModalOpen] = useState(false);

  const scores = selectedSession
    ? (sessionScores[selectedSession.id] ?? {})
    : overallScores;

  const activePlayers = players.filter((player) => player.id in scores);

  function getSessionName(session: Session | null): string {
    if (!session) return "Overall Standings"; // Special case
    return `Session ${session.number} (${session.start_date})`;
  }

  function downloadJSON() {
    const data = {
      players: players,
      logs: logs,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = Object.assign(document.createElement("a"), {
      href: url,
      download: "logs.json",
    });

    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
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

        <div className="flex w-sm gap-2">
          <FilledButton
            className="flex w-full items-center justify-center gap-2 text-sm"
            disabled={!activePlayers.length}
            onClick={() => setIsGraphModalOpen(true)}
          >
            <ChartColumn className="size-5" />
            View Graph
          </FilledButton>

          <FilledButton
            className="flex w-full items-center justify-center gap-2 text-sm"
            onClick={downloadJSON}
          >
            <Download className="size-5" />
            Download Logs
          </FilledButton>
        </div>

        <Leaderboard players={activePlayers} scores={scores} />
      </div>

      <ViewGraphModal
        players={activePlayers}
        scores={scores}
        isOpen={isGraphModalOpen}
        onClose={() => setIsGraphModalOpen(false)}
      />
    </>
  );
}
