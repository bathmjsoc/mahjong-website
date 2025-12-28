"use client";

import { ChevronRight, CircleMinus, CirclePlus, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import PlayerList from "@/components/PlayerList";
import AutocompleteSelect from "@/elements/AutocompleteSelect";
import IconButton from "@/elements/IconButton";
import RoundedListbox from "@/elements/RoundedListbox";
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

  const sessionOptions = useMemo(() => {
    const sortedSessions = sortSessionsNewest(sessions);
    const options = sortedSessions.map((s) => ({
      number: s.number,
      label: `Session ${s.number} (${s.date.toLocaleDateString()})`,
    }));
    return [{ number: -1, label: "Overall Standings" }, ...options];
  }, [sessions]);

  const [selectedSession, setSelectedSession] = useState(
    sessionOptions.length > 1 ? sessionOptions[1] : sessionOptions[0],
  );

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
          <AutocompleteSelect
            options={sortedPlayers}
            onSelect={(player) => registerPlayer(player.uuid)}
            getDisplayValue={(player) => player.name}
            getKey={(player) => player.uuid}
            placeholder="Register a member..."
            emptyMessage="No member found"
            inputClassName="w-88 h-10"
          />

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

          <RoundedListbox
            value={selectedSession}
            onChange={setSelectedSession}
            selectedLabel={selectedSession.label}
            buttonClassName="h-10 w-88!"
          >
            {sessionOptions.map((option) => (
              <RoundedListbox.Option key={option.number} value={option}>
                {option.label}
              </RoundedListbox.Option>
            ))}
          </RoundedListbox>

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
            className={`
              transition duration-500
              ${isOpen ? "rotate-180" : "rotate-0"}
            `}
          />
        </div>
      </IconButton>
    </div>
  );
}
