"use client";

import { ChartColumn } from "lucide-react";
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
  const { overallScores, sessionScores } = useLogs();
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

        <FilledButton
          className="flex items-center justify-center gap-2 text-sm"
          disabled={!activePlayers.length}
          onClick={() => setIsGraphModalOpen(true)}
        >
          <ChartColumn className="size-5" />
          View Graph
        </FilledButton>

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
