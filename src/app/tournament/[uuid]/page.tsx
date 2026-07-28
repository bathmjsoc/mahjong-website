"use client";

import { Shuffle } from "lucide-react";
import { useState, useTransition } from "react";
import { shuffleTables } from "@/actions/tables";
import { FilledButton } from "@/elements/FilledButton";
import { RoundedListbox } from "@/elements/RoundedListbox";
import { useAttendance } from "@/hooks/attendance/useAttendance";
import { usePlayers } from "@/hooks/players/usePlayers";
import { useTables } from "@/hooks/tables/useTables";
import { WIND_MAP, WINDS } from "@/lib/constants";
import { useSessionContext } from "@/providers/SessionProvider";
import { Sidebar } from "./_components/Sidebar";
import { TableList } from "./_components/TableList";

export default function TournamentPage() {
  const sessionId = useSessionContext();

  const { availablePlayerIds } = useAttendance();
  const { players } = usePlayers();
  const { availableTables, tables } = useTables();

  const [wind, setWind] = useState<string | null>(WINDS[0]);
  const [isShaking, startTransition] = useTransition();

  async function handleShuffle() {
    startTransition(async () => {
      await shuffleTables(
        sessionId,
        availableTables,
        players.filter((player) => availablePlayerIds.has(player.id)),
      );
    });
  }

  return (
    <div className="flex min-h-dvh">
      <Sidebar />

      <div
        title={wind ? WIND_MAP[wind] : ""}
        className="absolute top-20 right-5 rounded-2xl bg-primary"
      >
        <RoundedListbox<string>
          value={wind}
          options={WINDS}
          onChange={setWind}
          getOptionLabel={(wind) => wind}
          getOptionKey={(wind) => wind}
          getOptionTooltip={(wind) => WIND_MAP[wind]}
          buttonClassName="border-primary border-2 size-20 text-5xl font-normal rounded-2xl"
        />
      </div>

      <div className="flex w-full flex-col items-center overflow-hidden">
        <div className="py-5">
          <FilledButton
            onClick={handleShuffle}
            disabled={isShaking}
            className="flex items-center justify-center gap-2 bg-primary"
          >
            <Shuffle className="size-5" />
            Shuffle Tables
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
