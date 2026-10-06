"use client";

import { useState, useTransition } from "react";
import { RoundedListbox } from "@/elements/RoundedListbox";
import { usePlayers } from "@/hooks/players/usePlayers";
import { useTables } from "@/hooks/tables/useTables";
import { WIND_MAP, WINDS } from "@/lib/constants";
import { ShuffleButton } from "./_components/ShuffleButton";
import { Sidebar } from "./_components/Sidebar";
import { TableList } from "./_components/TableList";

type WindKey = (typeof WINDS)[number];

export default function TournamentPage() {
  const { players } = usePlayers();
  const { tables } = useTables();

  const [wind, setWind] = useState<WindKey | null>(WINDS[0]);
  const [isShaking, startTransition] = useTransition();

  return (
    <>
      <div className="flex min-h-dvh">
        <Sidebar players={players} />

        <div className="flex w-full flex-col items-center overflow-hidden">
          <div className="py-9">
            <ShuffleButton
              isShaking={isShaking}
              players={players}
              startTransition={startTransition}
              tables={tables}
            />
          </div>

          <TableList
            className={isShaking ? "animate-shake" : ""}
            tables={tables}
          />
        </div>
      </div>

      <div
        className="fixed top-20 right-5 rounded-2xl"
        title={wind ? WIND_MAP[wind] : "N/A"}
      >
        <RoundedListbox<WindKey>
          buttonClassName="border-primary border-2 size-20 text-5xl font-normal rounded-2xl"
          getOptionKey={(wind) => wind}
          getOptionLabel={(wind) => wind}
          getOptionTooltip={(wind) => WIND_MAP[wind] ?? "N/A"}
          onChange={setWind}
          options={WINDS}
          value={wind}
        />
      </div>
    </>
  );
}
