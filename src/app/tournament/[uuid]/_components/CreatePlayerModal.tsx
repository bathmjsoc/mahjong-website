import { useState } from "react";
import { LabelledInput } from "@/elements/LabelledInput";
import { Modal } from "@/elements/Modal";
import { usePlayerMutations } from "@/hooks/players/usePlayerMutations";
import { usePlayers } from "@/hooks/players/usePlayers";
import { useCurrentTournament } from "@/hooks/useCurrentTournament";
import { parseFormString } from "@/lib/utils";

type CreatePlayerModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function CreatePlayerModal({ isOpen, onClose }: CreatePlayerModalProps) {
  const { createPlayer } = usePlayerMutations();
  const { players } = usePlayers();
  const { currentTournament } = useCurrentTournament();

  const [error, setError] = useState<string | null>(null);

  function handleClose() {
    setError(null);
    onClose();
  }

  function handleSubmit(formData: FormData) {
    if (!currentTournament) return;

    const playerName = parseFormString(formData, "playerName");

    if (!playerName) {
      setError("Player Name is required.");
      return;
    }

    if (players.some((player) => player.name === playerName)) {
      setError("This name is already taken.");
      return;
    }

    createPlayer(currentTournament, playerName);
    handleClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Player">
      <form action={handleSubmit} className="flex w-xs flex-col gap-3">
        <LabelledInput
          name="playerName"
          onChange={() => setError(null)}
          type="text"
          autoComplete="off"
          autoFocus
          required
        >
          Player Name
        </LabelledInput>
        {error && <p className="text-center text-negative text-xs">{error}</p>}
      </form>
    </Modal>
  );
}
