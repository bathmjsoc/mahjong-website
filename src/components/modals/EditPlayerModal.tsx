"use client";

import { useTournament } from "@/context/TournamentContext";
import { Modal } from "@/elements/Modal";
import type { Player } from "@/lib/types";
import { FilledButton } from "@/elements/FilledButton";
import { RoundedListbox } from "@/elements/RoundedListbox";
import { useState } from "react";
import { Notification } from "@/elements/Notification";
import { LabelledInput } from "@/elements/LabelledInput";
import { updatePlayer } from "@/actions/players";

type EditPlayerModalProps = {
  isOpen: boolean;
  closeModalAction: () => void;
};

export function EditPlayerModal({
  isOpen,
  closeModalAction,
}: EditPlayerModalProps) {
  const { players } = useTournament();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [newName, setNewName] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  function handleSelect(player: Player | null) {
    if (!player) return;
    setSelectedPlayer(player);
    setNewName(player.name);
  }

  async function handleEdit() {
    if (!selectedPlayer || !newName) return;
    await updatePlayer(selectedPlayer, newName);

    setSuccessMessage(
      `"${selectedPlayer.name}" successfully renamed to "${newName}".`,
    );

    setShowSuccess(true);
    setSelectedPlayer(null);
    setNewName("");
    closeModalAction();
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={closeModalAction} title="Modify Player">
        <form action={handleEdit} className="flex flex-col space-y-5">
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
            <LabelledInput
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            >
              Player Name
            </LabelledInput>
          )}

          <FilledButton type="submit" disabled={!selectedPlayer || !newName}>
            Modify Player Name
          </FilledButton>
        </form>
      </Modal>

      <Notification
        isOpen={showSuccess}
        close={() => setShowSuccess(false)}
        title="Player Modified"
      >
        {successMessage}
      </Notification>
    </>
  );
}
