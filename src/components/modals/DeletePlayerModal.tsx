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
  const [deletedName, setDeletedName] = useState("");

  function handleClose() {
    setSelectedPlayer(null);
    closeModalAction();
  }

  async function handleDelete() {
    if (!selectedPlayer) return;

    await deletePlayer(selectedPlayer);
    setDeletedName(selectedPlayer.name);
    handleClose();
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} title="Delete Player">
        <div className="flex flex-col gap-3 w-xs">
          <RoundedListbox<Player>
            value={selectedPlayer}
            options={players}
            onChange={setSelectedPlayer}
            getOptionLabel={(player) => player.name}
            getOptionKey={(player) => player.id}
            emptyMessage="No players found"
            placeholder="Select a player..."
            buttonClassName="text-primary rounded-lg w-xs p-2"
          />

          {selectedPlayer && (
            <span className="text-xs">
              Are you sure you want to remove "<b>{selectedPlayer.name}</b>"?
              This cannot be undone!
            </span>
          )}

          <FilledButton
            className="bg-negative"
            onClick={handleDelete}
            disabled={!selectedPlayer}
          >
            DELETE PLAYER
          </FilledButton>
        </div>
      </Modal>

      <Notification
        isOpen={!!deletedName}
        close={() => setDeletedName("")}
        title="Player Deleted"
      >
        {deletedName} has been removed from the tournament.
      </Notification>
    </>
  );
}
