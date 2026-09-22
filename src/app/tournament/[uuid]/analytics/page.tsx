"use client";

import { type PropsWithChildren, useState } from "react";
import { RoundedListbox } from "@/elements/RoundedListbox";
import { useLogs } from "@/hooks/logs/useLogs";
import { usePlayers } from "@/hooks/players/usePlayers";
import type { Player } from "@/lib/types";
import { FaanFrequencyCard } from "./_components/FaanFrequencyCard";
import { GameOutcomesCard } from "./_components/GameOutcomesCard";
import { RankingCard } from "./_components/RankingCard";
import { ScoreHistoryCard } from "./_components/ScoreHistoryCard";
import { StatisticsCard } from "./_components/StatisticsCard";

export default function AnalyticsPage() {
  const { logs, overallScores } = useLogs();
  const { players } = usePlayers();

  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const activePlayers = players.filter((player) => player.id in overallScores);

  return (
    <div className="flex flex-col items-center gap-10 py-10">
      <RoundedListbox<Player>
        value={selectedPlayer}
        options={activePlayers}
        onChange={setSelectedPlayer}
        getOptionLabel={(player) => player.name}
        placeholder="Select a player..."
        getOptionKey={(player) => player.id}
        buttonClassName="text-primary border-primary border-2 h-10 rounded-lg w-sm"
      />

      {selectedPlayer && (
        <div className="flex gap-5">
          <div className="flex flex-col gap-5">
            <div className="flex gap-5">
              <Card>
                <RankingCard player={selectedPlayer} />
              </Card>

              <Card>
                <GameOutcomesCard logs={logs} player={selectedPlayer} />
              </Card>
            </div>

            <Card>
              <StatisticsCard
                player={selectedPlayer}
                playerCount={players.length}
              />
            </Card>
          </div>

          <div className="flex flex-col gap-5">
            <Card>
              <ScoreHistoryCard logs={logs} player={selectedPlayer} />
            </Card>

            <Card>
              <FaanFrequencyCard logs={logs} player={selectedPlayer} />
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export function Card({ children }: PropsWithChildren) {
  return <div className="rounded-lg bg-primary p-5">{children}</div>;
}
