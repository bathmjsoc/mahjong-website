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

  const [session, setSession] = useState<Session>(sessionOptions[0]);
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    getPlayersFromSession(session, tournamentId).then(setPlayers);
  }, [session, tournamentId]);

  function handleSessionSelect(session: Session | null) {
    if (session) setSession(session);
  }

  return (
    <div className="flex flex-col gap-5 items-center py-10">
      <RoundedListbox<Session>
        value={session}
        options={sessionOptions}
        onChange={handleSessionSelect}
        getOptionLabel={(session) =>
          session.number === -1
            ? "Overall Standings"
            : `Session ${session.number}`
        }
        getOptionKey={(session) => session.id}
        buttonClassName="border-(--primary-color) border-2 h-10 rounded-lg w-sm"
      />
      <IconButton className="bg-(--primary-color) rounded-lg p-2 hover:text-(--save-color)">
        <ChartColumn className="size-5" />
      </IconButton>

      {players.length > 0 ? (
        <Leaderboard players={players} />
      ) : (
        <span className="text-xs italic">No players found.</span>
      )}
    </div>
  );
}
