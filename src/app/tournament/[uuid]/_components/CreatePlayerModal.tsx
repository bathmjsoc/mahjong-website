import { useState } from "react";
import { createPlayer } from "@/actions/players";
import { LabelledInput } from "@/elements/LabelledInput";
import { Modal } from "@/elements/Modal";
import { usePlayers } from "@/hooks/players/usePlayers";
import { useTournaments } from "@/hooks/tournaments/useTournaments";
import { parseFormString } from "@/lib/utils";

type CreatePlayerModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function CreatePlayerModal({ isOpen, onClose }: CreatePlayerModalProps) {
  const { players } = usePlayers();
  const { currentTournament } = useTournaments();

  const [error, setError] = useState<string | null>(null);

  function handleClose() {
    setError(null);
    onClose();
  }

  async function handleSubmit(formData: FormData) {
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

    await createPlayer(currentTournament, playerName);
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
