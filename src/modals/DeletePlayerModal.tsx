"use client";

import { deletePlayer } from "@/actions/players";
import { useTournament } from "@/context/TournamentContext";
import { Modal } from "@/elements/Modal";
import { SearchCombobox } from "@/elements/SearchCombobox";
import type { Player } from "@/lib/types";

type DeletePlayerModalProps = {
  isOpen: boolean;
  closeModalAction: () => void;
};

export function DeletePlayerModal({
  isOpen,
  closeModalAction,
}: DeletePlayerModalProps) {
  const { players } = useTournament();

  async function handleSubmit(player: Player) {
    await deletePlayer(player);
    closeModalAction();
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModalAction} title="Delete Player">
      <SearchCombobox<Player>
        options={players}
        onSelect={(player) => handleSubmit(player)}
        getOptionLabel={(player) => player.name}
        getOptionKey={(player) => player.id}
        placeholder="Delete a member..."
        emptyMessage="No member found"
        inputClassName="w-75"
      />
    </Modal>
  );
}
