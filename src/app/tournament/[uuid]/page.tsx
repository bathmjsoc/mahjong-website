"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Shuffle } from "lucide-react";
import { useState, useTransition } from "react";
import { createTables, deleteTables } from "@/actions/tables";
import { FilledButton } from "@/elements/FilledButton";
import { RoundedListbox } from "@/elements/RoundedListbox";
import { useAttendance } from "@/hooks/attendance/useAttendance";
import { usePlayers } from "@/hooks/players/usePlayers";
import { useTables } from "@/hooks/tables/useTables";
import { WIND_MAP, WINDS } from "@/lib/constants";
import { shuffle } from "@/lib/utils";
import { useSessionContext } from "@/providers/SessionProvider";
import { Sidebar } from "./_components/Sidebar";
import { TableList } from "./_components/TableList";

type WindKey = (typeof WINDS)[number];

export default function TournamentPage() {
  const queryClient = useQueryClient();
  const sessionId = useSessionContext();

  const { lockedPlayerIds, registeredPlayerIds } = useAttendance();
  const { players } = usePlayers();
  const { tables } = useTables();

  const [wind, setWind] = useState<WindKey | null>(WINDS[0]);
  const [isShaking, startTransition] = useTransition();

  async function handleShuffle() {
    const availableTables = tables.filter((table) => !table.saved);
    const availablePlayers = players.filter(
      (player) =>
        registeredPlayerIds.has(player.id) && !lockedPlayerIds.has(player.id),
    );

    startTransition(async () => {
      const shuffledPlayers = shuffle(availablePlayers);
      const newTables = [];

      while (shuffledPlayers.length > 0) {
        const [east = null, south = null, west = null, north = null] =
          shuffledPlayers.splice(0, 4);

        newTables.push({
          id: crypto.randomUUID(),
          session_id: sessionId,
          east_id: east?.id ?? null,
          south_id: south?.id ?? null,
          west_id: west?.id ?? null,
          north_id: north?.id ?? null,
          number: newTables.length + 1,
          saved: false,
        });
      }

      await deleteTables(availableTables);
      await createTables(newTables);
      await queryClient.invalidateQueries({
        queryKey: ["tables", sessionId],
      });
    });
  }

  return (
    <div className="flex min-h-dvh">
      <Sidebar players={players} />

      <div
        className="absolute top-20 right-5 rounded-2xl bg-primary"
        title={wind ? WIND_MAP[wind] : "N/A"}
      >
        <RoundedListbox<WindKey>
          value={wind}
          options={WINDS}
          onChange={setWind}
          getOptionLabel={(wind) => wind}
          getOptionKey={(wind) => wind}
          getOptionTooltip={(wind) => WIND_MAP[wind] ?? "N/A"}
          buttonClassName="border-primary border-2 size-20 text-5xl font-normal rounded-2xl"
        />
      </div>

      <div className="flex w-full flex-col items-center overflow-hidden">
        <div className="py-9">
          <FilledButton
            onClick={handleShuffle}
            disabled={isShaking}
            className="rounded-full bg-primary p-3"
            title="Shuffle Tables"
          >
            <Shuffle className="size-6" />
          </FilledButton>
        </div>

        <TableList
          tables={tables}
          className={isShaking ? "animate-shake" : ""}
        />
      </div>
    </div>
  );
}
