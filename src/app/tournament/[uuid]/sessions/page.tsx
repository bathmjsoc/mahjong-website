"use client";

import { ChartColumn } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getPlayersFromSession } from "@/actions/sessions";
import { Leaderboard } from "@/components/Leaderboard";
import { useTournament } from "@/context/TournamentContext";
import { IconButton } from "@/elements/IconButton";
import { RoundedListbox } from "@/elements/RoundedListbox";
import type { Player, Session } from "@/lib/types";

export default function SessionsPage() {
  const { sessions, tournamentId } = useTournament();

  // Prepend 'Overall Standings' pseudo-session
  const sessionOptions: Session[] = useMemo(() => {
    const overallSession: Session = { id: "", number: -1 };
    return [overallSession, ...sessions];
  }, [sessions]);

  const [session, setSession] = useState<Session | null>(sessionOptions[0]);
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    if (!session) return;
    getPlayersFromSession(session, tournamentId).then(setPlayers);
  }, [session, tournamentId]);

  function handleGraphRequest() {
    console.log(
      `TODO: Create and output graphs for Session ${session?.number}`,
    );
  }

  return (
    <div className="flex flex-col gap-7 items-center py-10">
      <RoundedListbox<Session>
        value={session}
        options={sessionOptions}
        onChange={setSession}
        getOptionLabel={(session) =>
          session.number === -1
            ? "Overall Standings"
            : `Session ${session.number}`
        }
        getOptionKey={(session) => session.id}
        buttonClassName="border-primary border-2 h-10 rounded-lg w-sm"
      />

      <IconButton
        onClick={handleGraphRequest}
        className="bg-accent flex gap-2 items-center justify-center px-4 py-2 rounded-lg text-sm"
      >
        <ChartColumn className="size-5" />
        Download Graphs
      </IconButton>

      {players.length > 0 ? (
        <Leaderboard players={players} />
      ) : (
        <span className="text-primary text-xs italic">No players found.</span>
      )}
    </div>
  );
}
