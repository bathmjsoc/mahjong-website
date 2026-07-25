"use client";

import { ChartColumn } from "lucide-react";
import { useState } from "react";
import { FilledButton } from "@/elements/FilledButton";
import { RoundedListbox } from "@/elements/RoundedListbox";
import { useLogs } from "@/hooks/useLogs";
import { usePlayers } from "@/hooks/usePlayers";
import { useSessions } from "@/hooks/useSessions";
import type { Session } from "@/lib/types";
import { getSessionName } from "@/lib/utils";
import { Leaderboard } from "./_components/Leaderboard";
import { ViewGraphModal } from "./_components/ViewGraphModal";

export default function SessionsPage() {
  const { overallScores, sessionScores } = useLogs();
  const { players } = usePlayers();
  const { sessions } = useSessions();

  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const isOverall = selectedSession === null;
  const scores = isOverall ? overallScores : sessionScores[selectedSession.id];

  const activePlayers = players.filter((player) => player.id in scores);

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
          onClick={() => setIsOpen(true)}
        >
          <ChartColumn className="size-5" />
          View Graph
        </FilledButton>

        <Leaderboard players={activePlayers} scores={scores} />
      </div>

      <ViewGraphModal
        players={activePlayers}
        scores={scores}
        isOpen={isOpen}
        closeModalAction={() => setIsOpen(false)}
      />
    </>
  );
}
