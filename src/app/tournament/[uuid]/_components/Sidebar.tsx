import {
  ChevronRight,
  RefreshCw,
  UserMinus,
  UserPen,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { FilledButton } from "@/elements/FilledButton";
import { IconButton } from "@/elements/IconButton";
import { SearchCombobox } from "@/elements/SearchCombobox";
import { useAttendance } from "@/hooks/attendance/useAttendance";
import { useAttendanceMutations } from "@/hooks/attendance/useAttendanceMutations";
import { usePlayers } from "@/hooks/players/usePlayers";
import type { Player } from "@/lib/types";
import { useSessionContext } from "@/providers/SessionProvider";
import { CreatePlayerModal } from "./CreatePlayerModal";
import { DeletePlayerModal } from "./DeletePlayerModal";
import { EditPlayerModal } from "./EditPlayerModal";
import { PlayerList } from "./PlayerList";
import { ResetSessionModal } from "./ResetSessionModal";

type ModalType = "create" | "edit" | "delete" | "reset" | null;

export function Sidebar() {
  const sessionId = useSessionContext();

  const { registeredPlayerIds } = useAttendance();
  const { registerPlayer } = useAttendanceMutations();
  const { players } = usePlayers();

  const [isOpen, setIsOpen] = useState(true);
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const playerOptions = players.filter(
    (player) => !registeredPlayerIds.has(player.id),
  );

  function handleRegisterPlayer(player: Player) {
    registerPlayer(sessionId, player);
  }

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
              options={playerOptions}
              onSelect={(player) => handleRegisterPlayer(player)}
              getOptionLabel={(player) => player.name}
              getOptionKey={(player) => player.id}
              placeholder="Register a member..."
              emptyMessage="No member found"
              inputClassName="w-88 h-10"
            />

            <div className="flex gap-15">
              <IconButton
                title="Create Player"
                onClick={() => setActiveModal("create")}
                className="hover:text-positive"
              >
                <UserPlus className="size-6" />
              </IconButton>

              <IconButton
                title="Edit Player"
                onClick={() => setActiveModal("edit")}
                className="hover:text-neutral"
              >
                <UserPen className="size-6" />
              </IconButton>

              <IconButton
                title="Delete Player"
                onClick={() => setActiveModal("delete")}
                className="hover:text-negative"
              >
                <UserMinus className="size-6" />
              </IconButton>

              <IconButton
                title="Reset Session"
                onClick={() => setActiveModal("reset")}
                className="hover:text-info"
              >
                <RefreshCw className="size-6" />
              </IconButton>
            </div>

            <PlayerList />
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
        onClose={() => setActiveModal(null)}
      />

      <DeletePlayerModal
        isOpen={activeModal === "delete"}
        onClose={() => setActiveModal(null)}
      />

      <ResetSessionModal
        isOpen={activeModal === "reset"}
        onClose={() => setActiveModal(null)}
      />

      <EditPlayerModal
        isOpen={activeModal === "edit"}
        onClose={() => setActiveModal(null)}
      />
    </>
  );
}
