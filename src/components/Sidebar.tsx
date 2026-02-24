"use client";

import {
  ChevronRight,
  RefreshCw,
  UserMinus,
  UserPen,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { registerPlayer } from "@/actions/attendance";
import { CreatePlayerModal } from "@/components/modals/CreatePlayerModal";
import { DeletePlayerModal } from "@/components/modals/DeletePlayerModal";
import { EditPlayerModal } from "@/components/modals/EditPlayerModal";
import { ResetSessionModal } from "@/components/modals/ResetSessionModal";
import { PlayerList } from "@/components/PlayerList";
import { useTournament } from "@/context/TournamentContext";
import { IconButton } from "@/elements/IconButton";
import { SearchCombobox } from "@/elements/SearchCombobox";
import type { Player } from "@/lib/types";

type ModalType = "create" | "edit" | "delete" | "reset" | null;

export function Sidebar() {
  const { currentSession, players, registeredPlayers } = useTournament();
  const [isOpen, setIsOpen] = useState(true);
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  return (
    <>
      <div className="flex">
        <div
          className={twMerge(
            "bg-(--primary-color) text-(--secondary-color)",
            "transition-all duration-500 overflow-hidden",
            isOpen ? "w-md px-5" : "w-0 px-0",
          )}
        >
          <div className="flex flex-col gap-5 items-center max-w-md min-w-max py-10">
            <SearchCombobox<Player>
              options={players}
              onSelect={(player) => registerPlayer(currentSession, player)}
              getOptionLabel={(player) => player.name}
              getOptionKey={(player) => player.id}
              placeholder="Register a member..."
              emptyMessage="No member found"
              inputClassName="w-88 h-10"
            />

            <div className="flex gap-15">
              <IconButton
                onClick={() => setActiveModal("create")}
                className="hover:text-(--positive-color)"
              >
                <UserPlus className="size-6" />
              </IconButton>

              <IconButton
                onClick={() => setActiveModal("edit")}
                className="hover:text-(--neutral-color)"
              >
                <UserPen className="size-6" />
              </IconButton>

              <IconButton
                onClick={() => setActiveModal("delete")}
                className="hover:text-(--negative-color)"
              >
                <UserMinus className="size-6" />
              </IconButton>

              <IconButton
                onClick={() => setActiveModal("reset")}
                className="hover:text-(--save-color)"
              >
                <RefreshCw className="size-6" />
              </IconButton>
            </div>

            {registeredPlayers.length > 0 ? (
              <>
                <span className="text-xs">
                  Player(s) Registered: {registeredPlayers.length}
                </span>
                <PlayerList players={registeredPlayers} />
              </>
            ) : (
              <span className="text-xs italic">No players registered.</span>
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
          "
        >
          <ChevronRight
            className={twMerge(
              "transition duration-500",
              isOpen ? "rotate-180" : "rotate-0",
            )}
          />
        </IconButton>
      </div>

      <CreatePlayerModal
        isOpen={activeModal === "create"}
        closeModalAction={() => setActiveModal(null)}
      />

      <DeletePlayerModal
        isOpen={activeModal === "delete"}
        closeModalAction={() => setActiveModal(null)}
      />

      <ResetSessionModal
        isOpen={activeModal === "reset"}
        closeModalAction={() => setActiveModal(null)}
      />

      <EditPlayerModal
        isOpen={activeModal === "edit"}
        closeModalAction={() => setActiveModal(null)}
      />
    </>
  );
}
