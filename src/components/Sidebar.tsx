"use client";

import {
  ChevronRight,
  RefreshCw,
  UserPlus,
  UserMinus,
  UserPen,
} from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { PlayerList } from "@/components/PlayerList";
import { useTournament } from "@/context/TournamentContext";
import { IconButton } from "@/elements/IconButton";
import { SearchCombobox } from "@/elements/SearchCombobox";
import type { Player } from "@/lib/types";
import { CreatePlayerModal } from "@/components/modals/CreatePlayerModal";
import { DeletePlayerModal } from "@/components/modals/DeletePlayerModal";
import { registerPlayer } from "@/actions/attendance";
import { ResetSessionModal } from "@/components/modals/ResetSessionModal";
import { EditPlayerModal } from "@/components/modals/EditPlayerModal";

export function Sidebar() {
  const { currentSession, players, registeredPlayers } = useTournament();

  const [isOpen, setIsOpen] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

            <div className="flex space-x-15">
              <IconButton
                onClick={() => setIsCreateModalOpen(true)}
                className="hover:text-(--positive-color)"
              >
                <UserPlus className="size-6" />
              </IconButton>

              <IconButton
                onClick={() => setIsEditModalOpen(true)}
                className="hover:text-(--neutral-color)"
              >
                <UserPen className="size-6" />
              </IconButton>

              <IconButton
                onClick={() => setIsDeleteModalOpen(true)}
                className="hover:text-(--negative-color)"
              >
                <UserMinus className="size-6" />
              </IconButton>

              <IconButton
                onClick={() => setIsResetModalOpen(true)}
                className="hover:text-(--save-color)"
              >
                <RefreshCw className="size-6" />
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
        isOpen={isCreateModalOpen}
        closeModalAction={() => setIsCreateModalOpen(false)}
      />

      <DeletePlayerModal
        isOpen={isDeleteModalOpen}
        closeModalAction={() => setIsDeleteModalOpen(false)}
      />

      <ResetSessionModal
        isOpen={isResetModalOpen}
        closeModalAction={() => setIsResetModalOpen(false)}
      />

      <EditPlayerModal
        isOpen={isEditModalOpen}
        closeModalAction={() => setIsEditModalOpen(false)}
      />
    </>
  );
}
