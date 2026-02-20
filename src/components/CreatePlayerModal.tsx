"use client";

import { useRouter } from "next/navigation";
import { createPlayer } from "@/actions/players";
import { useTournament } from "@/context/TournamentContext";
import { LabelledInput } from "@/elements/LabelledInput";
import { Modal } from "@/elements/Modal";

type AddPlayerModalProps = {
  isOpen: boolean;
  closeModalAction: () => void;
};

export function CreatePlayerModal({
  isOpen,
  closeModalAction,
}: AddPlayerModalProps) {
  const router = useRouter();
  const { tournamentId } = useTournament();

  async function handleSubmit(formData: FormData) {
    const playerName = formData.get("playerName") as string;

    await createPlayer(tournamentId, playerName);
    router.refresh();
    closeModalAction();
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModalAction} title="Create Player">
      <form action={handleSubmit} className="flex flex-col space-y-3 w-xs">
        <LabelledInput
          name="playerName"
          type="text"
          autoComplete="off"
          required
        >
          Player Name
        </LabelledInput>
      </form>
    </Modal>
  );
}
