"use client";

import { ChevronRight, CircleMinus, CirclePlus, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import PlayerList from "@/components/PlayerList";
import IconButton from "@/elements/IconButton";
import RoundedListbox from "@/elements/RoundedListbox";
import SearchCombobox from "@/elements/SearchCombobox";
import { registerPlayer, sortAlphabetical } from "@/lib/players";
import { sortSessionsNewest } from "@/lib/sessions";
import type { Player, Session } from "@/lib/types";

type SidebarProps = {
  players: Player[];
  sessions: Session[];
};

export default function Sidebar({ players, sessions }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  const sortedPlayers = useMemo(() => sortAlphabetical(players), [players]);

  const sortedSessions = useMemo(() => {
    const sorted = sortSessionsNewest(sessions);
    const overall: Session = { number: -1, date: new Date() };
    return [overall, ...sorted];
  }, [sessions]);

  const [selectedSession, setSelectedSession] = useState(
    sortedSessions.length > 1 ? sortedSessions[1] : sortedSessions[0],
  );

  function handleSessionSelect(session: Session | null) {
    if (session) {
      setSelectedSession(session);
    }
  }

  return (
    <div className="flex">
      <div
        className={`
          bg-(--primary-color) text-(--secondary-color)
          transition-all duration-500 overflow-hidden py-10
          ${isOpen ? "w-md px-5" : "w-0 px-0"}
        `}
      >
        <div className="flex flex-col space-y-5 items-center max-w-md">
          <SearchCombobox<Player>
            options={sortedPlayers}
            onSelect={(player) => registerPlayer(player.uuid)}
            getOptionLabel={(player) => player.name}
            getOptionKey={(player) => player.uuid}
            placeholder="Register a member..."
            emptyMessage="No member found"
            inputClassName="w-88 h-10"
          />

          <ActionButtons />

          <RoundedListbox<Session>
            value={selectedSession}
            options={sortedSessions}
            onChange={handleSessionSelect}
            getOptionLabel={(session) =>
              session.number === -1
                ? "Overall Standings"
                : `Session ${session.number} (${session.date.toLocaleDateString()})`
            }
            getOptionKey={(session) => session.number}
            buttonClassName="w-88! h-10"
          />

          <PlayerList players={players} />
        </div>
      </div>

      <IconButton onClick={() => setIsOpen(!isOpen)} className="size-8">
        <div
          className="
            bg-(--primary-color) text-(--secondary-color)
            flex items-center justify-center rounded-r-xl
            -ml-1 mt-5 p-2 h-20 w-10
          "
        >
          <ChevronRight
            className={`transition duration-500 ${isOpen ? "rotate-180" : "rotate-0"}`}
          />
        </div>
      </IconButton>
    </div>
  );
}

function ActionButtons() {
  return (
    <div className="flex space-x-20">
      <IconButton className="hover:text-green-700">
        <CirclePlus className="size-7" />
      </IconButton>

      <IconButton className="hover:text-red-700">
        <CircleMinus className="size-7" />
      </IconButton>

      <IconButton className="hover:text-yellow-600">
        <RefreshCw className="size-7" />
      </IconButton>
    </div>
  );
}
