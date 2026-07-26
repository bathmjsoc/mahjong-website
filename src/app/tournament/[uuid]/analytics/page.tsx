"use client";

import { useState } from "react";
import { RoundedListbox } from "@/elements/RoundedListbox";
import { usePlayers } from "@/hooks/usePlayers";
import type { Player } from "@/types/app.types";
import { PlayerAnalytics } from "./_components/PlayerAnalytics";

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
        buttonClassName="border-primary border-2 h-10 rounded-lg w-sm"
      />

      {selectedPlayer && <PlayerAnalytics player={selectedPlayer} />}
    </div>
  );
}
