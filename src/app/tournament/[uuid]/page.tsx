"use client";

import { useTransition } from "react";
import { usePlayers } from "@/hooks/players/usePlayers";
import { useTables } from "@/hooks/tables/useTables";
import { ShuffleButton } from "./_components/ShuffleButton";
import { Sidebar } from "./_components/Sidebar";
import { TableList } from "./_components/TableList";
import { WindSelector } from "./_components/WindSelector";

export default function TournamentPage() {
  const { players } = usePlayers();
  const { tables } = useTables();

  const [isShaking, startTransition] = useTransition();

  return (
    <>
      <div className="flex min-h-dvh">
        <Sidebar players={players} />

        <div className="flex w-full flex-col items-center">
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

      <div className="fixed top-20 right-5">
        <WindSelector />
      </div>
    </>
  );
}
