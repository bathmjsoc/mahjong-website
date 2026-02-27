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
  const { players, sessions, tournamentId } = useTournament();

  // Prepend 'Overall Standings' pseudo-session
  const sessionOptions: Session[] = useMemo(() => {
    const overallSession: Session = {
      id: "overall",
      number: -1,
      start_date: "",
      tournament_id: tournamentId,
    };
    return [overallSession, ...sessions];
  }, [sessions, tournamentId]);

  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const activeSession = selectedSession ?? sessionOptions[0];

  function handleGraphRequest() {
    console.log(
      `TODO: Create and output graphs for ${getSessionName(activeSession)}`,
    );
  }

  return (
    <div className="flex flex-col gap-7 items-center py-10">
      <RoundedListbox<Session>
        value={activeSession}
        options={sessionOptions}
        onChange={setSelectedSession}
        getOptionLabel={getSessionName}
        getOptionKey={(session) => session.id}
        buttonClassName="border-primary border-2 h-10 rounded-lg w-sm"
      />

      <FilledButton
        onClick={handleGraphRequest}
        className="flex gap-2 items-center justify-center text-sm"
      >
        <ChartColumn className="size-5" />
        Download Graph
      </FilledButton>

      <Leaderboard session={activeSession} players={players} />
    </div>
  );
}
