"use client";

import { type FormEvent, useState } from "react";
import { createTournament } from "@/actions/tournaments";
import FilledButton from "@/elements/FilledButton";
import LabelledInput from "@/elements/LabelledInput";
import Modal from "@/elements/Modal";

type CreateTournamentModalProps = {
  isOpen: boolean;
  closeModalAction: () => void;
};

export default function CreateTournamentModal({
  isOpen,
  closeModalAction,
}: CreateTournamentModalProps) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); // Prevent page reload
    if (loading) return;

    const formData = new FormData(e.currentTarget);
    const tournamentName = formData.get("tournamentName") as string;

    try {
      setLoading(true);
      await createTournament(tournamentName);
      closeModalAction();
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModalAction} title="Create Tournament">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-3 w-xs">
        <LabelledInput name="tournamentName" required disabled={loading}>
          Tournament Name
        </LabelledInput>

        <FilledButton type="submit" disabled={loading}>
          Create Tournament
        </FilledButton>
      </form>
    </Modal>
  );
}
