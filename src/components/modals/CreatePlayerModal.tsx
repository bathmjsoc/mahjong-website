"use client";

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
  const { tournamentId } = useTournament();

  async function handleSubmit(formData: FormData) {
    const playerName = formData.get("playerName") as string;

    await createPlayer(tournamentId, playerName);
    closeModalAction();
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModalAction} title="Create Player">
      <form action={handleSubmit} className="flex flex-col space-y-3 w-xs">
        <LabelledInput
          name="playerName"
          type="text"
          autoComplete="off"
          autoFocus
          required
        >
          Player Name
        </LabelledInput>
      </form>
    </Modal>
  );
}
