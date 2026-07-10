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
import { FilledButton } from "@/elements/FilledButton";
import { IconButton } from "@/elements/IconButton";
import { SearchCombobox } from "@/elements/SearchCombobox";
import { useAttendance } from "@/hooks/useAttendance";
import { usePlayers } from "@/hooks/usePlayers";
import { useSessions } from "@/hooks/useSessions";
import type { Player } from "@/lib/types";

type ModalType = "create" | "edit" | "delete" | "reset" | null;

export function Sidebar() {
  const { registeredPlayers } = useAttendance();
  const { players } = usePlayers();
  const { currentSession } = useSessions();

  const [isOpen, setIsOpen] = useState(true);
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  return (
    <>
      <div className="flex">
        <div
          className={twMerge(
            "bg-primary text-secondary",
            "overflow-hidden transition-all duration-500",
            isOpen ? "w-md px-5" : "w-0 px-0",
          )}
        >
          <div className="flex min-w-max max-w-md flex-col items-center gap-5 py-10">
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
                className="hover:text-positive"
              >
                <UserPlus className="size-6" />
              </IconButton>

              <IconButton
                onClick={() => setActiveModal("edit")}
                className="hover:text-neutral"
              >
                <UserPen className="size-6" />
              </IconButton>

              <IconButton
                onClick={() => setActiveModal("delete")}
                className="hover:text-negative"
              >
                <UserMinus className="size-6" />
              </IconButton>

              <IconButton
                onClick={() => setActiveModal("reset")}
                className="hover:text-info"
              >
                <RefreshCw className="size-6" />
              </IconButton>
            </div>

            <PlayerList session={currentSession} players={registeredPlayers} />
          </div>
        </div>

        {/* Collapse/Expand Sidebar Button */}
        <FilledButton
          onClick={() => setIsOpen(!isOpen)}
          className="mt-5 -ml-1 h-20 w-10 rounded-r-2xl bg-primary text-secondary"
        >
          <ChevronRight
            className={twMerge(
              "transition duration-500",
              isOpen ? "rotate-180" : "rotate-0",
            )}
          />
        </FilledButton>
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
