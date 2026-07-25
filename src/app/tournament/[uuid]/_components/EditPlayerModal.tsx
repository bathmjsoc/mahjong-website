import { type ChangeEvent, useState } from "react";
import { updatePlayer } from "@/actions/players";
import { FilledButton } from "@/elements/FilledButton";
import { LabelledInput } from "@/elements/LabelledInput";
import { Modal } from "@/elements/Modal";
import { Notification } from "@/elements/Notification";
import { RoundedListbox } from "@/elements/RoundedListbox";
import { usePlayers } from "@/hooks/usePlayers";
import type { Player } from "@/lib/types";
import { parseFormString } from "@/lib/utils";

type EditPlayerModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function EditPlayerModal({ isOpen, onClose }: EditPlayerModalProps) {
  const { players } = usePlayers();

  const [error, setError] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [notification, setNotification] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  function handleClose() {
    setError(null);
    setNewName("");
    setSelectedPlayer(null);
    onClose();
  }

  function handleSelect(player: Player | null) {
    setError(null);
    setNewName(player?.name ?? "");
    setSelectedPlayer(player);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setError(null);
    setNewName(e.target.value);
  }

  async function handleSubmit(formData: FormData) {
    if (!selectedPlayer) return;

    const updatedName = parseFormString(formData, "updatedName");

    if (!updatedName) {
      setError("Player Name is required.");
      return;
    }

    if (
      players.some(
        (player) =>
          player.name === updatedName && player.id !== selectedPlayer.id,
      )
    ) {
      setError("This name is already taken.");
      return;
    }

    await updatePlayer(selectedPlayer, updatedName);

    setNotification(`"${selectedPlayer.name}" renamed to "${updatedName}".`);
    handleClose();
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} title="Modify Player">
        <form action={handleSubmit} className="flex flex-col gap-5">
          <RoundedListbox<Player>
            value={selectedPlayer}
            options={players}
            onChange={handleSelect}
            getOptionLabel={(player) => player.name}
            getOptionKey={(player) => player.id}
            emptyMessage="No players found"
            placeholder="Select a player..."
            buttonClassName="text-primary rounded-lg w-xs p-2"
          />

          {selectedPlayer && (
            <div className="flex flex-col gap-3">
              <LabelledInput
                name="updatedName"
                value={newName}
                onChange={handleChange}
                type="text"
                autoComplete="off"
              >
                Player Name
              </LabelledInput>

              {error && (
                <span className="text-center text-negative text-xs">
                  {error}
                </span>
              )}
            </div>
          )}

          <FilledButton
            type="submit"
            disabled={!selectedPlayer || newName.trim() === selectedPlayer.name}
          >
            Update Player
          </FilledButton>
        </form>
      </Modal>

      <Notification
        isOpen={!!notification}
        close={() => setNotification(null)}
        title="Player Modified"
      >
        {notification}
      </Notification>
    </>
  );
}
