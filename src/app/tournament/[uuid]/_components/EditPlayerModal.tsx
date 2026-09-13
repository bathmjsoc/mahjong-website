import { useState } from "react";
import { FilledButton } from "@/elements/FilledButton";
import { LabelledInput } from "@/elements/LabelledInput";
import { Modal } from "@/elements/Modal";
import { Notification } from "@/elements/Notification";
import { RoundedListbox } from "@/elements/RoundedListbox";
import { usePlayerMutations } from "@/hooks/players/usePlayerMutations";
import type { Player } from "@/lib/types";
import { parseFormString } from "@/lib/utils";

type EditPlayerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
};

export function EditPlayerModal({
  isOpen,
  onClose,
  players,
}: EditPlayerModalProps) {
  const { updatePlayer } = usePlayerMutations();

  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  function handleClose() {
    setError(null);
    setSelectedPlayer(null);
    onClose();
  }

  function handleSelect(player: Player | null) {
    setError(null);
    setSelectedPlayer(player);
  }

  function handleSubmit(formData: FormData) {
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

    updatePlayer(selectedPlayer, updatedName);

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
                defaultValue={selectedPlayer.name}
                onChange={() => setError(null)}
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

          <FilledButton type="submit" disabled={!selectedPlayer}>
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
