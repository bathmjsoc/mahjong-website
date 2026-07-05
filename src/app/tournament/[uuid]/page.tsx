"use client";

import { Shuffle } from "lucide-react";
import { useState } from "react";
import { shuffleTables } from "@/actions/tables";
import { Sidebar } from "@/components/Sidebar";
import { TableList } from "@/components/TableList";
import { WindIndicator } from "@/components/WindIndicator";
import { useAttendance } from "@/context/AttendanceContext";
import { useSessions } from "@/context/SessionContext";
import { useTables } from "@/context/TableContext";
import { FilledButton } from "@/elements/FilledButton";

export default function TournamentPage() {
  const { availablePlayers } = useAttendance();
  const { currentSession } = useSessions();
  const { availableTables, tables } = useTables();

  const [isShaking, setIsShaking] = useState(false);

  async function handleShuffle() {
    setIsShaking(true);

    await shuffleTables(currentSession, availableTables, availablePlayers);

    setIsShaking(false);
  }

  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <WindIndicator />

      <div className="flex flex-col items-center w-full overflow-hidden">
        <div className="py-5">
          <FilledButton
            onClick={handleShuffle}
            disabled={isShaking}
            className="bg-primary flex gap-2 items-center justify-center"
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
