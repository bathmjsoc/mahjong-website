"use client";

import { ChartColumn } from "lucide-react";
import { useMemo, useState } from "react";
import { Leaderboard } from "@/components/Leaderboard";
import { useTournament } from "@/context/TournamentContext";
import { FilledButton } from "@/elements/FilledButton";
import { RoundedListbox } from "@/elements/RoundedListbox";
import type { Session } from "@/lib/types";
import { getSessionName } from "@/lib/utils";

export default function SessionsPage() {
  const { overallScores, players, sessions, sessionScores, tournamentId } =
    useTournament();

  // Prepend 'Overall Standings' pseudo-session
  const sessionOptions: Session[] = useMemo(() => {
    const overallSession: Session = {
      id: "",
      number: -1,
      start_date: "",
      tournament_id: tournamentId,
    };
    return [overallSession, ...sessions];
  }, [sessions, tournamentId]);

  const [selectedSession, setSelectedSession] = useState<Session>(
    sessionOptions[0],
  );

  const { scores, activePlayers } = useMemo(() => {
    const isOverall = selectedSession.number === -1;

    const scores = isOverall
      ? overallScores
      : (sessionScores[selectedSession.id] ?? {});

    const activePlayers = isOverall
      ? players
      : players.filter((player) => player.id in scores);

    return { scores, activePlayers };
  }, [overallScores, players, selectedSession, sessionScores]);

  return (
    <div className="flex flex-col gap-7 items-center py-10">
      <RoundedListbox<Session>
        value={selectedSession}
        options={sessionOptions}
        onChange={(session) => session && setSelectedSession(session)}
        getOptionLabel={getSessionName}
        getOptionKey={(session) => session.id}
        buttonClassName="border-primary border-2 h-10 rounded-lg w-sm"
      />

      <FilledButton className="flex gap-2 items-center justify-center text-sm">
        <ChartColumn className="size-5" />
        Download Graph
      </FilledButton>

      <Leaderboard players={activePlayers} scores={scores} />
    </div>
  );
}
