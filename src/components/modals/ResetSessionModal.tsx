"use client";

import { useState } from "react";
import { createSession } from "@/actions/sessions";
import { useTournament } from "@/context/TournamentContext";
import { FilledButton } from "@/elements/FilledButton";
import { Modal } from "@/elements/Modal";
import { Notification } from "@/elements/Notification";

type ConfirmRefreshModalProps = {
  isOpen: boolean;
  closeModalAction: () => void;
};

export function ResetSessionModal({
  isOpen,
  closeModalAction,
}: ConfirmRefreshModalProps) {
  const { tournamentId } = useTournament();
  const [showSuccess, setShowSuccess] = useState(false);

  async function handleReset() {
    await createSession(tournamentId);
    setShowSuccess(true);
    closeModalAction();
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={closeModalAction} title="Reset Session">
        <div className="flex flex-col space-y-3 w-xs">
          <span className="text-xs">
            Are you sure you want to reset the session and deregister all
            players? This cannot be undone!
          </span>

          <FilledButton className="bg-(--negative-color)" onClick={handleReset}>
            RESET SESSION
          </FilledButton>
        </div>
      </Modal>

      <Notification
        isOpen={showSuccess}
        close={() => setShowSuccess(false)}
        title="Session Reset"
      >
        A new session has started and the player list is now empty.
      </Notification>
    </>
  );
}
