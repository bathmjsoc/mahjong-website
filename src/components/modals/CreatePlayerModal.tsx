import { useState } from "react";
import { createPlayer } from "@/actions/players";
import { LabelledInput } from "@/elements/LabelledInput";
import { Modal } from "@/elements/Modal";
import { usePlayers } from "@/hooks/usePlayers";
import { useTournament } from "@/providers/TournamentProvider";

type CreatePlayerModalProps = {
  isOpen: boolean;
  closeModalAction: () => void;
};

export function CreatePlayerModal({
  isOpen,
  closeModalAction,
}: CreatePlayerModalProps) {
  const { players } = usePlayers();
  const { tournamentId } = useTournament();

  const [error, setError] = useState<string | null>(null);

  function handleClose() {
    setError(null);
    closeModalAction();
  }

  async function handleSubmit(formData: FormData) {
    const playerName = formData.get("playerName")?.toString();
    if (!playerName) return;

    if (players.some((player) => player.name === playerName)) {
      setError("This name is already taken.");
      return;
    }

    await createPlayer(tournamentId, playerName);
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
