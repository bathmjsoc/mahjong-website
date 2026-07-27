import { useState } from "react";
import { FilledButton } from "@/elements/FilledButton";
import { Modal } from "@/elements/Modal";
import { Notification } from "@/elements/Notification";
import { RoundedListbox } from "@/elements/RoundedListbox";
import { usePlayerMutations } from "@/hooks/players/usePlayerMutations";
import { usePlayers } from "@/hooks/players/usePlayers";
import type { Player } from "@/types/app.types";

type DeletePlayerModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function DeletePlayerModal({ isOpen, onClose }: DeletePlayerModalProps) {
  const { deletePlayer } = usePlayerMutations();
  const { players } = usePlayers();

  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [deletedName, setDeletedName] = useState("");

  function handleClose() {
    setSelectedPlayer(null);
    onClose();
  }

  function handleDelete() {
    if (!selectedPlayer) return;

    deletePlayer(selectedPlayer);
    setDeletedName(selectedPlayer.name);
    handleClose();
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} title="Delete Player">
        <div className="flex w-xs flex-col gap-3">
          <RoundedListbox<Player>
            value={selectedPlayer}
            options={players}
            onChange={setSelectedPlayer}
            getOptionLabel={(player) => player.name}
            getOptionKey={(player) => player.id}
            emptyMessage="No players found"
            placeholder="Select a player..."
            buttonClassName="text-primary rounded-lg w-xs p-2"
          />

          {selectedPlayer && (
            <span className="text-xs">
              Are you sure you want to remove "<b>{selectedPlayer.name}</b>"?
              This cannot be undone!
            </span>
          )}

          <FilledButton
            className="bg-negative"
            onClick={handleDelete}
            disabled={!selectedPlayer}
          >
            DELETE PLAYER
          </FilledButton>
        </div>
      </Modal>

      <Notification
        isOpen={!!deletedName}
        close={() => setDeletedName("")}
        title="Player Deleted"
      >
        {deletedName} has been removed from the tournament.
      </Notification>
    </>
  );
}
