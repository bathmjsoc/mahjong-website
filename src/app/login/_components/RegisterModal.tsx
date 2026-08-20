import { useActionState, useState } from "react";
import { signUp } from "@/actions/auth";
import { FilledButton } from "@/elements/FilledButton";
import { LabelledInput } from "@/elements/LabelledInput";
import { Modal } from "@/elements/Modal";
import { Notification } from "@/elements/Notification";
import type { ActionState } from "@/lib/types";

type RegisterModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function RegisterModal({ isOpen, onClose }: RegisterModalProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    handleSignUp,
    null,
  );

  async function handleSignUp(prevState: ActionState, formData: FormData) {
    const result = await signUp(prevState, formData);

    if (result?.success) {
      setShowSuccess(true);
      onClose();
    }

    return result;
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Create Account">
        <form action={formAction} className="flex w-xs flex-col gap-3">
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

          {state?.error && (
            <p className="text-center text-negative text-xs">{state.error}</p>
          )}

          <FilledButton type="submit" disabled={isPending}>
            Create Account
          </FilledButton>
        </form>
      </Modal>

      <Notification
        isOpen={showSuccess}
        close={() => setShowSuccess(false)}
        title="Account created!"
      >
        Please check your email to verify your account.
      </Notification>
    </>
  );
}
