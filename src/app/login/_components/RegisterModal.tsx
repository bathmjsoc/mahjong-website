import { useState, useTransition } from "react";
import { signUp } from "@/actions/auth";
import { FilledButton } from "@/elements/FilledButton";
import { LabelledInput } from "@/elements/LabelledInput";
import { Modal } from "@/elements/Modal";
import { parseFormString } from "@/lib/utils";
import { useNotificationContext } from "@/providers/NotificationProvider";

type RegisterModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function RegisterModal({ isOpen, onClose }: RegisterModalProps) {
  const { notify } = useNotificationContext();

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClose() {
    setError(null);
    onClose();
  }

  function handleSubmit(formData: FormData) {
    const email = parseFormString(formData, "email");
    const password = parseFormString(formData, "password");
    if (!email || !password) {
      setError("Email and Password cannot be empty.");
      return;
    }

    startTransition(async () => {
      const result = await signUp(email, password);

      if (!result.success) {
        setError(result.error);
        return;
      }

      notify("Account Created", "Check your email to verify your account.");
      handleClose();
    });
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Account">
      <form action={handleSubmit} className="flex w-xs flex-col gap-3">
        <LabelledInput
          autoComplete="email"
          autoFocus
          name="email"
          onChange={() => setError(null)}
          required
          type="email"
        >
          Email Address
        </LabelledInput>

        <LabelledInput
          autoComplete="new-password"
          name="password"
          onChange={() => setError(null)}
          required
          type="password"
        >
          Password
        </LabelledInput>

        {error && (
          <span className="text-negative text-center text-xs">{error}</span>
        )}

        <FilledButton disabled={isPending} type="submit">
          Create Account
        </FilledButton>
      </form>
    </Modal>
  );
}
