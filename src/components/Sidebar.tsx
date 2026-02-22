"use client";

import { ChevronRight, CircleMinus, CirclePlus, RefreshCw } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { registerPlayer } from "@/actions/players";
import { createSession } from "@/actions/sessions";
import { PlayerList } from "@/components/PlayerList";
import { useTournament } from "@/context/TournamentContext";
import { IconButton } from "@/elements/IconButton";
import { SearchCombobox } from "@/elements/SearchCombobox";
import type { Player } from "@/lib/types";
import { CreatePlayerModal } from "@/components/modals/CreatePlayerModal";
import { DeletePlayerModal } from "@/components/modals/DeletePlayerModal";

export function Sidebar() {
  const { players, tournamentId, currentSession, registeredPlayers } =
    useTournament();

  const [isOpen, setIsOpen] = useState(true);
  const [isCreatePlayerModalOpen, setIsCreatePlayerModalOpen] = useState(false);
  const [isDeletePlayerModalOpen, setIsDeletePlayerModalOpen] = useState(false);

  async function handleRefresh() {
    await createSession(tournamentId);
  }

  return (
    <>
      <div className="flex">
        <div
          className={twMerge(
            "bg-(--primary-color) text-(--secondary-color)",
            "transition-all duration-500 overflow-hidden py-10",
            isOpen ? "w-md px-5" : "w-0 px-0",
          )}
        >
          <div className="flex flex-col space-y-5 items-center max-w-md min-w-max">
            <SearchCombobox<Player>
              options={players}
              onSelect={(player) => registerPlayer(currentSession, player)}
              getOptionLabel={(player) => player.name}
              getOptionKey={(player) => player.id}
              placeholder="Register a member..."
              emptyMessage="No member found"
              inputClassName="w-88 h-10"
            />

            <div className="flex space-x-20">
              <IconButton
                onClick={() => setIsCreatePlayerModalOpen(true)}
                className="hover:text-(--positive-color)"
              >
                <CirclePlus className="size-7" />
              </IconButton>

              <IconButton
                onClick={() => setIsDeletePlayerModalOpen(true)}
                className="hover:text-(--negative-color)"
              >
                <CircleMinus className="size-7" />
              </IconButton>

              <IconButton
                onClick={handleRefresh}
                className="hover:text-(--neutral-color)"
              >
                <RefreshCw className="size-7" />
              </IconButton>
            </div>

            {registeredPlayers.length > 0 && (
              <>
                <span className="text-xs">
                  {registeredPlayers.length} Player(s) Registered
                </span>
                <PlayerList players={registeredPlayers} />
              </>
            )}
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
            className={twMerge(
              "transition-transform duration-500",
              isOpen ? "rotate-180" : "rotate-0",
            )}
          />
        </IconButton>
      </div>

      <CreatePlayerModal
        isOpen={isCreatePlayerModalOpen}
        closeModalAction={() => setIsCreatePlayerModalOpen(false)}
      />

      <DeletePlayerModal
        isOpen={isDeletePlayerModalOpen}
        closeModalAction={() => setIsDeletePlayerModalOpen(false)}
      />
    </>
  );
}
