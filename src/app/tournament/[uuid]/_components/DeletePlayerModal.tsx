import { useState } from "react";
import { FilledButton } from "@/elements/FilledButton";
import { Modal } from "@/elements/Modal";
import { Notification } from "@/elements/Notification";
import { RoundedListbox } from "@/elements/RoundedListbox";
import { usePlayerMutations } from "@/hooks/players/usePlayerMutations";
import type { Player } from "@/lib/types";

type DeletePlayerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
};

export function DeletePlayerModal({
  isOpen,
  onClose,
  players,
}: DeletePlayerModalProps) {
  const { deletePlayer } = usePlayerMutations();

  const [notification, setNotification] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  function handleClose() {
    setSelectedPlayer(null);
    onClose();
  }

  function handleSubmit() {
    if (!selectedPlayer) return;

    deletePlayer(selectedPlayer);
    setNotification(
      `${selectedPlayer.name} has been removed from the tournament.`,
    );
    setShowNotification(true);
    handleClose();
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} title="Delete Player">
        <div className="flex w-xs flex-col gap-3">
          <RoundedListbox<Player>
            buttonClassName="text-primary rounded-lg w-xs p-2"
            emptyMessage="No players found"
            getOptionKey={(player) => player.id}
            getOptionLabel={(player) => player.name}
            onChange={setSelectedPlayer}
            options={players}
            placeholder="Select a player..."
            value={selectedPlayer}
          />

          {selectedPlayer && (
            <span className="text-xs">
              Are you sure you want to remove "<b>{selectedPlayer.name}</b>"?
            </span>
          )}

          <FilledButton
            className="bg-negative uppercase"
            disabled={!selectedPlayer}
            onClick={handleSubmit}
          >
            Delete Player
          </FilledButton>
        </div>
      </Modal>

      <Notification
        close={() => setShowNotification(false)}
        isOpen={showNotification}
        title="Player Deleted"
      >
        {notification}
      </Notification>
    </>
  );
}
