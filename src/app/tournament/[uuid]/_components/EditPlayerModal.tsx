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
  const [notification, setNotification] = useState("");
  const [showNotification, setShowNotification] = useState(false);
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

    setNotification(
      `"${selectedPlayer.name}" has been renamed to "${updatedName}".`,
    );
    setShowNotification(true);
    handleClose();
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} title="Modify Player">
        <form action={handleSubmit} className="flex flex-col gap-5">
          <RoundedListbox<Player>
            buttonClassName="text-primary rounded-lg w-xs p-2"
            emptyMessage="No players found"
            getOptionKey={(player) => player.id}
            getOptionLabel={(player) => player.name}
            onChange={handleSelect}
            options={players}
            placeholder="Select a player..."
            value={selectedPlayer}
          />

          {selectedPlayer && (
            <div className="flex flex-col gap-3">
              <LabelledInput
                autoComplete="off"
                defaultValue={selectedPlayer.name}
                key={selectedPlayer.id}
                name="updatedName"
                onChange={() => setError(null)}
                type="text"
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

          <FilledButton disabled={!selectedPlayer} type="submit">
            Update Player
          </FilledButton>
        </form>
      </Modal>

      <Notification
        close={() => setShowNotification(false)}
        isOpen={showNotification}
        title="Player Updated"
      >
        {notification}
      </Notification>
    </>
  );
}
