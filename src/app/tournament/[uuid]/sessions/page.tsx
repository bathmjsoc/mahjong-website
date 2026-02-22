"use client";

import { useEffect, useMemo, useState } from "react";
import { Leaderboard } from "@/components/Leaderboard";
import { useTournament } from "@/context/TournamentContext";
import { RoundedListbox } from "@/elements/RoundedListbox";
import type { Player, Session } from "@/lib/types";
import { getPlayersFromSession } from "@/actions/sessions";

export default function SessionsPage() {
  const { sessions, tournamentId } = useTournament();

  // Prepend 'Overall Standings' pseudo-session
  const sessionOptions: Session[] = useMemo(() => {
    const overallSession: Session = { id: "", number: -1 };
    return [overallSession, ...sessions];
  }, [sessions]);

  const [session, setSession] = useState<Session>(sessionOptions[0]);
  const [activePlayers, setActivePlayers] = useState<Player[]>([]);

  useEffect(() => {
    getPlayersFromSession(session, tournamentId).then(setActivePlayers);
  }, [session, tournamentId]);

  function handleSessionSelect(session: Session | null) {
    if (session) setSession(session);
  }

  return (
    <div className="flex flex-col space-y-10 items-center py-10">
      <RoundedListbox<Session>
        value={session}
        options={sessionOptions}
        onChange={handleSessionSelect}
        getOptionLabel={(session) =>
          session.number === -1
            ? "Overall Standings"
            : `Session ${session.number}`
        }
        getOptionKey={(session) => session.number}
        buttonClassName="border-(--primary-color) border-2 rounded-lg w-sm p-2"
      />

      {activePlayers.length > 0 && <Leaderboard players={activePlayers} />}
    </div>
  );
}
