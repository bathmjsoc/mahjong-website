"use client";

import { useActionState, useEffect } from "react";
import { type ActionState, signUp } from "@/actions/auth";
import { FilledButton } from "@/elements/FilledButton";
import { LabelledInput } from "@/elements/LabelledInput";
import { Modal } from "@/elements/Modal";

type RegisterModalProps = {
  isOpen: boolean;
  closeModalAction: () => void;
};

export function RegisterModal({
  isOpen,
  closeModalAction,
}: RegisterModalProps) {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    signUp,
    null,
  );

  useEffect(() => {
    if (state?.success) {
      closeModalAction();
    }
  }, [state?.success, closeModalAction]);

  return (
    <Modal isOpen={isOpen} onClose={closeModalAction} title="Create Account">
      <form action={formAction} className="flex flex-col space-y-3 w-xs">
        <LabelledInput
          name="email"
          type="email"
          autoComplete="email"
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
  );
}
