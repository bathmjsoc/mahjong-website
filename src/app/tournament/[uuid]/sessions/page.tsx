"use client";

import { ChartColumn } from "lucide-react";
import { useEffect, useState } from "react";
import { getPlayersFromSession } from "@/actions/sessions";
import { Leaderboard } from "@/components/Leaderboard";
import { useTournament } from "@/context/TournamentContext";
import { IconButton } from "@/elements/IconButton";
import { RoundedListbox } from "@/elements/RoundedListbox";
import type { Player, Session } from "@/lib/types";
import { getSessionName } from "@/lib/utils";
import {FilledButton} from "@/elements/FilledButton";

export default function SessionsPage() {
  const { sessions, tournamentId } = useTournament();
  const [players, setPlayers] = useState<Player[]>([]);
  const [session, setSession] = useState<Session | null>(sessions[0]);

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
        options={sessions}
        onChange={setSession}
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

      <Leaderboard players={players} />
    </div>
  );
}
