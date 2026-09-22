import { useState, useTransition } from "react";
import { signUp } from "@/actions/auth";
import { FilledButton } from "@/elements/FilledButton";
import { LabelledInput } from "@/elements/LabelledInput";
import { Modal } from "@/elements/Modal";
import { Notification } from "@/elements/Notification";
import { parseFormString } from "@/lib/utils";

type RegisterModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function RegisterModal({ isOpen, onClose }: RegisterModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleClose() {
    setError(null);
    onClose();
  }

  function handleSubmit(formData: FormData) {
    const email = parseFormString(formData, "email");
    const password = parseFormString(formData, "password");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    startTransition(async () => {
      const result = await signUp(email, password);

      if (!result.success) {
        setError(result.error);
        return;
      }

      setShowNotification(true);
      handleClose();
    });
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} title="Create Account">
        <form action={handleSubmit} className="flex w-xs flex-col gap-3">
          <LabelledInput
            name="email"
            type="email"
            autoComplete="email"
            autoFocus
            required
            disabled={isPending}
          >
            Email Address
          </LabelledInput>

          <LabelledInput
            name="password"
            type="password"
            autoComplete="new-password"
            required
            disabled={isPending}
          >
            Password
          </LabelledInput>

          {error && (
            <p className="text-center text-negative text-xs">{error}</p>
          )}

          <FilledButton type="submit" disabled={isPending}>
            Create Account
          </FilledButton>
        </form>
      </Modal>

      <Notification
        isOpen={showNotification}
        close={() => setShowNotification(false)}
        title="Account created!"
      >
        Please check your email to verify your account.
      </Notification>
    </>
  );
}
