import { useState } from "react";
import { FilledButton } from "@/elements/FilledButton";
import { LabelledInput } from "@/elements/LabelledInput";
import { Modal } from "@/elements/Modal";
import { Notification } from "@/elements/Notification";
import { usePlayerMutations } from "@/hooks/players/usePlayerMutations";
import type { Player } from "@/lib/types";
import { parseFormString } from "@/lib/utils";

type CreatePlayerModalProps = {
  isOpen: boolean;
  players: Player[];
  onClose: () => void;
};

export function CreatePlayerModal({
  isOpen,
  players,
  onClose,
}: CreatePlayerModalProps) {
  const { createPlayer } = usePlayerMutations();

  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState({
    isOpen: false,
    message: "",
  });

  function handleClose() {
    setError(null);
    onClose();
  }

  function handleSubmit(formData: FormData) {
    const playerName = parseFormString(formData, "playerName");
    if (!playerName) {
      setError("Player Name cannot be empty.");
      return;
    } else if (playerName.length > 40) {
      setError("Player Name cannot exceed 40 characters.");
      return;
    }

    if (players.some((player) => player.name === playerName)) {
      setError(`The name "${playerName}" is already taken.`);
      return;
    }

    createPlayer(playerName);
    setNotification({
      isOpen: true,
      message: `Added ${playerName} to the tournament.`,
    });
    handleClose();
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} title="Create Player">
        <form action={handleSubmit} className="flex w-xs flex-col gap-3">
          <LabelledInput
            autoComplete="off"
            autoFocus
            name="playerName"
            onChange={() => setError(null)}
            required
            type="text"
          >
            Player Name
          </LabelledInput>

          {error && (
            <span className="text-center text-negative text-xs">{error}</span>
          )}

          <FilledButton type="submit">Create Player</FilledButton>
        </form>
      </Modal>

      <Notification
        close={() => setNotification((state) => ({ ...state, isOpen: false }))}
        isOpen={notification.isOpen}
        title="Player Created"
      >
        {notification.message}
      </Notification>
    </>
  );
}
