import { useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  async function handleSubmit(formData: FormData) {
    const tournamentName = formData.get("tournamentName")?.toString();
    if (!tournamentName) return

    await createTournament(tournamentName);
    await queryClient.invalidateQueries({ queryKey: ["tournaments"] });

    closeModalAction();
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModalAction} title="Create Tournament">
      <form action={handleSubmit} className="flex w-xs flex-col gap-3">
        <LabelledInput
          name="tournamentName"
          type="text"
          autoComplete="off"
          autoFocus
          required
        >
          Tournament Name
        </LabelledInput>
      </form>
    </Modal>
  );
}
