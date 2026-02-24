"use client";

import { useState } from "react";
import { updatePlayer } from "@/actions/players";
import { useTournament } from "@/context/TournamentContext";
import { FilledButton } from "@/elements/FilledButton";
import { LabelledInput } from "@/elements/LabelledInput";
import { Modal } from "@/elements/Modal";
import { Notification } from "@/elements/Notification";
import { RoundedListbox } from "@/elements/RoundedListbox";
import type { Player } from "@/lib/types";

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
  const [notification, setNotification] = useState("");

  const isInvalid =
    !selectedPlayer || !newName.trim() || newName === selectedPlayer.name;

  function handleClose() {
    setSelectedPlayer(null);
    setNewName("");
    closeModalAction();
  }

  function handleSelect(player: Player | null) {
    setSelectedPlayer(player);
    setNewName(player?.name ?? "");
  }

  async function handleEdit() {
    if (isInvalid) return;

    await updatePlayer(selectedPlayer, newName);
    setNotification(`"${selectedPlayer.name}" renamed to "${newName}".`);
    handleClose();
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} title="Modify Player">
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
              type="text"
              autoComplete="off"
            >
              Player Name
            </LabelledInput>
          )}

          <FilledButton type="submit" disabled={isInvalid}>
            Update Player
          </FilledButton>
        </form>
      </Modal>

      <Notification
        isOpen={!!notification}
        close={() => setNotification("")}
        title="Player Modified"
      >
        {notification}
      </Notification>
    </>
  );
}
