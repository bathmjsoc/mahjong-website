import { useState } from "react";
import { FilledButton } from "@/elements/FilledButton";
import { Modal } from "@/elements/Modal";
import { Notification } from "@/elements/Notification";
import { RoundedListbox } from "@/elements/RoundedListbox";
import { usePlayerMutations } from "@/hooks/players/usePlayerMutations";
import type { Player } from "@/lib/types";

type DeletePlayerModalProps = {
  isOpen: boolean;
  players: Player[];
  onClose: () => void;
};

export function DeletePlayerModal({
  isOpen,
  players,
  onClose,
}: DeletePlayerModalProps) {
  const { deletePlayer } = usePlayerMutations();

  const [notification, setNotification] = useState({
    isOpen: false,
    message: "",
  });
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  function handleClose() {
    setSelectedPlayer(null);
    onClose();
  }

  function handleSubmit() {
    if (!selectedPlayer) return;

    deletePlayer(selectedPlayer);
    setNotification({
      isOpen: true,
      message: `Removed ${selectedPlayer.name} from the tournament.`,
    });
    handleClose();
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} title="Remove Player">
        <form
          action={handleSubmit}
          className="flex w-xs flex-col gap-3"
          onKeyDownCapture={(e) => e.key === "Enter" && e.preventDefault()}
        >
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
            <span className="text-center text-xs">
              Are you sure you want to remove <b>{selectedPlayer.name}</b>?
            </span>
          )}

          <FilledButton
            className="bg-negative uppercase"
            disabled={!selectedPlayer}
            type="submit"
          >
            Remove Player
          </FilledButton>
        </form>
      </Modal>

      <Notification
        close={() => setNotification((state) => ({ ...state, isOpen: false }))}
        isOpen={notification.isOpen}
        title="Player Removed"
      >
        {notification.message}
      </Notification>
    </>
  );
}
