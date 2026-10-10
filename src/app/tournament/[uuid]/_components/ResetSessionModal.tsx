import { useState } from "react";
import { FilledButton } from "@/elements/FilledButton";
import { Modal } from "@/elements/Modal";
import { Notification } from "@/elements/Notification";
import { useSessionMutations } from "@/hooks/sessions/useSessionMutations";

type ResetSessionModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function ResetSessionModal({ isOpen, onClose }: ResetSessionModalProps) {
  const { createSession } = useSessionMutations();

  const [notification, setNotification] = useState({
    isOpen: false,
    message: "",
  });

  function handleSubmit() {
    createSession();
    setNotification({
      isOpen: true,
      message: "A new session has started with all players deregistered.",
    });
    onClose();
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Reset Session">
        <form
          action={handleSubmit}
          className="flex w-xs flex-col gap-3"
          onKeyDownCapture={(e) => e.key === "Enter" && e.preventDefault()}
        >
          <span className="text-xs">
            Are you sure you want to start a new session and deregister all
            players? This cannot be undone!
          </span>

          <FilledButton className="bg-negative uppercase" type="submit">
            Reset Session
          </FilledButton>
        </form>
      </Modal>

      <Notification
        close={() => setNotification((state) => ({ ...state, isOpen: false }))}
        isOpen={notification.isOpen}
        title="Session Reset"
      >
        {notification.message}
      </Notification>
    </>
  );
}
