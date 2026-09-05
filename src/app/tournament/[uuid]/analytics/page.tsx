"use client";

import { useState } from "react";
import { RoundedListbox } from "@/elements/RoundedListbox";
import { usePlayers } from "@/hooks/players/usePlayers";
import type { Player } from "@/lib/types";
import { FaanFrequencyCard } from "./_components/FaanFrequencyCard";
import { GameOutcomesCard } from "./_components/GameOutcomesCard";
import { RankingCard } from "./_components/RankingCard";
import { ScoreHistoryCard } from "./_components/ScoreHistoryCard";
import { StatisticsCard } from "./_components/StatisticsCard";

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
        <div className="flex items-center gap-5">
          <div className="flex flex-col items-center gap-5">
            <div className="flex items-center gap-5">
              <div className="rounded-lg bg-primary p-5">
                <RankingCard player={selectedPlayer} />
              </div>

              <div className="rounded-lg bg-primary p-5">
                <GameOutcomesCard player={selectedPlayer} />
              </div>
            </div>

            <div className="rounded-lg bg-primary p-5">
              <StatisticsCard player={selectedPlayer} />
            </div>
          </div>

          <div className="flex flex-col gap-5 rounded-lg bg-primary p-5">
            <ScoreHistoryCard player={selectedPlayer} />
            <FaanFrequencyCard player={selectedPlayer} />
          </div>
        </div>
      )}
    </div>
  );
}
