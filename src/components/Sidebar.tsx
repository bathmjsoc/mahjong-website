"use client";

import { ChevronRight, CircleMinus, CirclePlus, RefreshCw } from "lucide-react";
import { useState } from "react";
import { PlayerList } from "@/components/PlayerList";
import { useTournament } from "@/context/TournamentContext";
import { IconButton } from "@/elements/IconButton";
import { RoundedListbox } from "@/elements/RoundedListbox";
import { SearchCombobox } from "@/elements/SearchCombobox";
import type { Player, Session } from "@/lib/types";

export function Sidebar() {
  const {
    registerPlayer,
    selectedSession,
    setSelectedSession,
    sortedPlayers,
    sortedSessions,
  } = useTournament();

  const [isOpen, setIsOpen] = useState(true);

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
            onSelect={(player) => registerPlayer(player)}
            getOptionLabel={(player) => player.name}
            getOptionKey={(player) => player.uuid}
            placeholder="Register a member..."
            emptyMessage="No member found"
            inputClassName="w-88 h-10"
          />

          <div className="flex space-x-20">
            <IconButton className="hover:text-(--positive-color)!">
              <CirclePlus className="size-7" />
            </IconButton>

            <IconButton className="hover:text-(--negative-color)!">
              <CircleMinus className="size-7" />
            </IconButton>

            <IconButton className="hover:text-(--neutral-color)!">
              <RefreshCw className="size-7" />
            </IconButton>
          </div>

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

          <PlayerList />
        </div>
      </div>

      {/* Collapse/Expand Sidebar Button */}
      <IconButton
        onClick={() => setIsOpen(!isOpen)}
        className="
          bg-(--primary-color) text-(--secondary-color)
          flex items-center justify-center
          rounded-r-2xl -ml-1 mt-5 h-20 w-10
          hover:text-(--accent-color)
        "
      >
        <ChevronRight
          className={`transition-transform duration-500 ${isOpen ? "rotate-180" : "rotate-0"}`}
        />
      </IconButton>
    </div>
  );
}
