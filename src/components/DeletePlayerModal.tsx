"use client";

import { useRouter } from "next/navigation";
import { deletePlayer } from "@/actions/players";
import { useTournament } from "@/context/TournamentContext";
import { Modal } from "@/elements/Modal";
import { SearchCombobox } from "@/elements/SearchCombobox";
import type { Player } from "@/lib/types";

type AddPlayerModalProps = {
  isOpen: boolean;
  closeModalAction: () => void;
};

export function DeletePlayerModal({
  isOpen,
  closeModalAction,
}: AddPlayerModalProps) {
  const router = useRouter();
  const { players } = useTournament();

  async function handleSubmit(player: Player) {
    await deletePlayer(player);
    players;
    router.refresh();
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
