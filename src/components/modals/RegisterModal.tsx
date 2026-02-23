"use client";

import { useActionState, useEffect, useState } from "react";
import { type ActionState, signUp } from "@/actions/auth";
import { FilledButton } from "@/elements/FilledButton";
import { LabelledInput } from "@/elements/LabelledInput";
import { Modal } from "@/elements/Modal";
import { Notification } from "@/elements/Notification";

type RegisterModalProps = {
  isOpen: boolean;
  closeModalAction: () => void;
};

export function RegisterModal({
  isOpen,
  closeModalAction,
}: RegisterModalProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    signUp,
    null,
  );

  useEffect(() => {
    if (state?.success) {
      setShowSuccess(true);
      closeModalAction();
    }
  }, [state?.success, closeModalAction]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={closeModalAction} title="Create Account">
        <form action={formAction} className="flex flex-col space-y-3 w-xs">
          <LabelledInput
            name="email"
            type="email"
            autoComplete="email"
            autoFocus={true}
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
            <p className="text-(--negative-color) text-xs text-center">
              {state.error}
            </p>
          )}

          <FilledButton type="submit" disabled={isPending}>
            Create Account
          </FilledButton>
        </form>
      </Modal>

      <Notification
        isOpen={showSuccess}
        close={() => setShowSuccess(false)}
        title="Account created successfully!"
      >
        Please check your email to verify your account.
      </Notification>
    </>
  );
}
