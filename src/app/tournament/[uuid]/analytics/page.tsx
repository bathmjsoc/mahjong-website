"use client";

import { useState } from "react";
import { RoundedListbox } from "@/elements/RoundedListbox";
import { usePlayers } from "@/hooks/players/usePlayers";
import type { Player } from "@/lib/types";
import { GameResultsCard } from "./_components/GameResultsCard";
import { ScoreHistoryCard } from "./_components/ScoreHistoryCard";

export default function AnalyticsPage() {
  const { players } = usePlayers();

  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  return (
    <div className="flex flex-col items-center gap-7 py-10">
      <RoundedListbox<Player>
        value={selectedPlayer}
        options={players}
        onChange={setSelectedPlayer}
        getOptionLabel={(player) => player.name}
        placeholder="Select a player..."
        getOptionKey={(player) => player.id}
        buttonClassName="text-primary border-primary border-2 h-10 rounded-lg w-sm"
      />

      {selectedPlayer && (
        <div className="flex items-start gap-5">
          <ScoreHistoryCard player={selectedPlayer} />
          <GameResultsCard player={selectedPlayer} />
        </div>
      )}
    </div>
  );
}
