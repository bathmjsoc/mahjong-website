import { useState } from "react";
import { FilledButton } from "@/elements/FilledButton";
import { LabelledInput } from "@/elements/LabelledInput";
import { Modal } from "@/elements/Modal";
import { RoundedListbox } from "@/elements/RoundedListbox";
import { usePlayerMutations } from "@/hooks/players/usePlayerMutations";
import type { Player } from "@/lib/types";
import { parseFormString } from "@/lib/utils";
import { useNotificationContext } from "@/providers/NotificationProvider";

type EditPlayerModalProps = {
  isOpen: boolean;
  players: Player[];
  onClose: () => void;
};

export function EditPlayerModal({
  isOpen,
  players,
  onClose,
}: EditPlayerModalProps) {
  const { notify } = useNotificationContext();
  const { updatePlayer } = usePlayerMutations();

  const [error, setError] = useState<string | null>(null);
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

    const playerName = parseFormString(formData, "playerName");
    if (!playerName) {
      setError("Player Name cannot be empty.");
      return;
    } else if (playerName.length > 40) {
      setError("Player Name cannot exceed 40 characters.");
      return;
    }

    if (
      players.some(
        (player) =>
          player.name === playerName && player.id !== selectedPlayer.id,
      )
    ) {
      setError(`The name "${playerName}" is already taken.`);
      return;
    }

    updatePlayer(selectedPlayer, playerName);
    notify(
      "Player Updated",
      `Renamed "${selectedPlayer.name}" to "${playerName}".`,
    );
    handleClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Player">
      <form action={handleSubmit} className="flex w-xs flex-col gap-3">
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
              autoFocus
              defaultValue={selectedPlayer.name}
              key={selectedPlayer.id}
              name="playerName"
              onChange={() => setError(null)}
              type="text"
            >
              Player Name
            </LabelledInput>

            {error && (
              <span className="text-negative text-center text-xs">{error}</span>
            )}
          </div>
        )}

        <FilledButton disabled={!selectedPlayer} type="submit">
          Edit Player
        </FilledButton>
      </form>
    </Modal>
  );
}
