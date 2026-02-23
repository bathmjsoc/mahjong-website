"use client";

import { useState } from "react";
import { deletePlayer } from "@/actions/players";
import { useTournament } from "@/context/TournamentContext";
import { FilledButton } from "@/elements/FilledButton";
import { Modal } from "@/elements/Modal";
import { Notification } from "@/elements/Notification";
import { RoundedListbox } from "@/elements/RoundedListbox";
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
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  function handleSelect(player: Player | null) {
    if (!player) return;
    setSelectedPlayer(player);
  }

  async function handleDelete() {
    if (!selectedPlayer) return;
    await deletePlayer(selectedPlayer);

    setSuccessMessage(
      `"${selectedPlayer?.name}" has been removed from the tournament.`,
    );

    setShowSuccess(true);
    setSelectedPlayer(null);
    closeModalAction();
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={closeModalAction} title="Delete Player">
        <div className="flex flex-col space-y-3 w-xs">
          <RoundedListbox<Player>
            value={selectedPlayer}
            options={players}
            onChange={handleSelect}
            getOptionLabel={(player) => player.name}
            getOptionKey={(player) => player.id}
            emptyMessage="No players found"
            placeholder="Select a player..."
            buttonClassName="text-(--primary-color) rounded-lg w-xs p-2"
          />

          {selectedPlayer && (
            <span className="text-xs">
              {`Are you sure you want to remove "${selectedPlayer.name}" from the tournament? This cannot be
              undone!`}
            </span>
          )}

          <FilledButton
            className="bg-(--negative-color)"
            onClick={handleDelete}
            disabled={!selectedPlayer}
          >
            DELETE PLAYER
          </FilledButton>
        </div>
      </Modal>

      <Notification
        isOpen={showSuccess}
        close={() => setShowSuccess(false)}
        title="Player Deleted"
      >
        {successMessage}
      </Notification>
    </>
  );
}
