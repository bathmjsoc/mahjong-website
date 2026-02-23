"use client";

import { useTournament } from "@/context/TournamentContext";
import { Modal } from "@/elements/Modal";
import type { Player } from "@/lib/types";
import { FilledButton } from "@/elements/FilledButton";
import { RoundedListbox } from "@/elements/RoundedListbox";
import { useState } from "react";
import { deletePlayer } from "@/actions/players";
import { Notification } from "@/elements/Notification";
import { createSession } from "@/actions/sessions";

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

  async function handleSubmit() {
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

          <FilledButton
            className="bg-(--negative-color)"
            onClick={handleSubmit}
          >
            RESET SESSION
          </FilledButton>
        </div>
      </Modal>

      <Notification
        isOpen={showSuccess}
        close={() => setShowSuccess(false)}
        title="New Session Started"
      >
        {`The session has been reset and all players have been deregistered.`}
      </Notification>
    </>
  );
}
