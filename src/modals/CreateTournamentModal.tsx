"use client";

import { useRouter } from "next/navigation";
import { createTournament } from "@/actions/tournaments";
import { LabelledInput } from "@/elements/LabelledInput";
import { Modal } from "@/elements/Modal";

type CreateTournamentModalProps = {
  isOpen: boolean;
  closeModalAction: () => void;
};

export function CreateTournamentModal({
  isOpen,
  closeModalAction,
}: CreateTournamentModalProps) {
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    const tournamentName = formData.get("tournamentName") as string;

    await createTournament(tournamentName);
    router.refresh();
    closeModalAction();
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModalAction} title="Create Tournament">
      <form action={handleSubmit} className="flex flex-col space-y-3 w-xs">
        <LabelledInput name="tournamentName" autoFocus={true} required>
          Tournament Name
        </LabelledInput>
      </form>
    </Modal>
  );
}
