"use client";

import { useState } from "react";
import { createPlayer } from "@/actions/players";
import { useTournament } from "@/context/TournamentContext";
import { LabelledInput } from "@/elements/LabelledInput";
import { Modal } from "@/elements/Modal";

type CreatePlayerModalProps = {
  isOpen: boolean;
  closeModalAction: () => void;
};

export function CreatePlayerModal({
  isOpen,
  closeModalAction,
}: CreatePlayerModalProps) {
  const { players, tournamentId } = useTournament();
  const [error, setError] = useState<string | null>(null);

  function handleClose() {
    setError(null);
    closeModalAction();
  }

  async function handleSubmit(formData: FormData) {
    const playerName = formData.get("playerName") as string;

    if (players.some((player) => player.name === playerName)) {
      setError("This name is already taken.");
      return;
    }

    await createPlayer(tournamentId, playerName);
    handleClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Player">
      <form action={handleSubmit} className="flex flex-col gap-3 w-xs">
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
        {error && <p className="text-negative text-xs text-center">{error}</p>}
      </form>
    </Modal>
  );
}
