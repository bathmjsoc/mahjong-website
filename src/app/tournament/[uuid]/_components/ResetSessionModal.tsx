import { useState } from "react";
import { createSession } from "@/actions/sessions";
import { FilledButton } from "@/elements/FilledButton";
import { Modal } from "@/elements/Modal";
import { Notification } from "@/elements/Notification";
import { useTournament } from "@/providers/TournamentProvider";

type ConfirmRefreshModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function ResetSessionModal({
  isOpen,
  onClose,
}: ConfirmRefreshModalProps) {
  const { tournamentId } = useTournament();
  const [showSuccess, setShowSuccess] = useState(false);

  async function handleReset() {
    await createSession(tournamentId);
    setShowSuccess(true);
    onClose();
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Reset Session">
        <div className="flex w-xs flex-col gap-3">
          <span className="text-xs">
            Are you sure you want to reset the session and deregister all
            players? This cannot be undone!
          </span>

          <FilledButton className="bg-negative" onClick={handleReset}>
            RESET SESSION
          </FilledButton>
        </div>
      </Modal>

      <Notification
        isOpen={showSuccess}
        close={() => setShowSuccess(false)}
        title="Session Reset"
      >
        A new session has started. All players and tables have been cleared.
      </Notification>
    </>
  );
}
