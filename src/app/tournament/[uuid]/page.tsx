"use client";

import { Shuffle } from "lucide-react";
import { useState, useTransition } from "react";
import { shuffleTables } from "@/actions/tables";
import { Sidebar } from "@/components/Sidebar";
import { TableList } from "@/components/TableList";
import { FilledButton } from "@/elements/FilledButton";
import { RoundedListbox } from "@/elements/RoundedListbox";
import { useAttendance } from "@/hooks/useAttendance";
import { useSessions } from "@/hooks/useSessions";
import { useTables } from "@/hooks/useTables";
import { windMap } from "@/lib/utils";

const WINDS = ["東", "南", "西", "北"] as const;

export default function TournamentPage() {
  const { availablePlayers } = useAttendance();
  const { currentSession } = useSessions();
  const { availableTables, tables } = useTables();

  const [wind, setWind] = useState<string | null>(WINDS[0]);
  const [isShaking, startTransition] = useTransition();

  async function handleShuffle() {
    if (!currentSession) return;

    startTransition(async () => {
      await shuffleTables(currentSession, availableTables, availablePlayers);
    });
  }

  return (
    <div className="flex min-h-dvh">
      <Sidebar />

      <div
        title={wind ? windMap[wind] : ""}
        className="absolute top-20 right-5 rounded-2xl bg-primary"
      >
        <RoundedListbox<string>
          value={wind}
          options={WINDS}
          onChange={setWind}
          getOptionLabel={(wind) => wind}
          getOptionKey={(wind) => wind}
          getOptionTooltip={(wind) => windMap[wind]}
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
