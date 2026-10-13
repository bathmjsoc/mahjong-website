import { FilledButton } from "@/elements/FilledButton";
import { Modal } from "@/elements/Modal";
import { useSessionMutations } from "@/hooks/sessions/useSessionMutations";
import { useNotificationContext } from "@/providers/NotificationProvider";

type ResetSessionModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function ResetSessionModal({ isOpen, onClose }: ResetSessionModalProps) {
  const { notify } = useNotificationContext();
  const { createSession } = useSessionMutations();

  function handleSubmit() {
    createSession();
    notify(
      "Session Reset",
      "A new session has started with all players deregistered.",
    );
    onClose();
  }

  return (
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
  );
}
