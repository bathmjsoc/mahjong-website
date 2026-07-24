import { type ChangeEvent, useState } from "react";
import { updatePlayer } from "@/actions/players";
import { FilledButton } from "@/elements/FilledButton";
import { LabelledInput } from "@/elements/LabelledInput";
import { Modal } from "@/elements/Modal";
import { Notification } from "@/elements/Notification";
import { RoundedListbox } from "@/elements/RoundedListbox";
import { usePlayers } from "@/hooks/usePlayers";
import type { Player } from "@/lib/types";

type EditPlayerModalProps = {
  isOpen: boolean;
  closeModalAction: () => void;
};

export function EditPlayerModal({
  isOpen,
  closeModalAction,
}: EditPlayerModalProps) {
  const { players } = usePlayers();

  const [newName, setNewName] = useState("");
  const [notification, setNotification] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  function handleClose() {
    setNewName("");
    setSelectedPlayer(null);
    closeModalAction();
  }

  function handleSelect(player: Player | null) {
    setNewName(player?.name ?? "");
    setSelectedPlayer(player);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setNewName(e.target.value);
  }

  async function handleSubmit(formData: FormData) {
    if (!selectedPlayer) return;

    const updatedName = formData.get("updatedName");

    if (typeof updatedName !== "string" || !updatedName.trim()) {
      return;
    }

    const trimmedName = updatedName.trim();

    if (
      players.some(
        (player) =>
          player.name === trimmedName && player.id !== selectedPlayer.id,
      )
    ) {
      return;
    }

    await updatePlayer(selectedPlayer, trimmedName);

    setNotification(`"${selectedPlayer.name}" renamed to "${trimmedName}".`);
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

              )}
            </div>
          )}

          <FilledButton type="submit" disabled={!selectedPlayer || newName === selectedPlayer.name}>
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
