"use client";

import { useActionState, useState } from "react";
import { type ActionState, signIn } from "@/actions/auth";
import { RegisterModal } from "@/components/modals/RegisterModal";
import { FilledButton } from "@/elements/FilledButton";
import { LabelledInput } from "@/elements/LabelledInput";
import { TextButton } from "@/elements/TextButton";

export function LoginForm() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    signIn,
    null,
  );

  return (
    <>
      <form
        action={formAction}
        className="flex w-sm flex-col gap-3 rounded-lg bg-primary p-5 text-secondary"
      >
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
          autoComplete="current-password"
          required
          disabled={isPending}
        >
          Password
        </LabelledInput>

        {state?.error && (
          <p className="text-center text-negative text-xs">{state.error}</p>
        )}

        <FilledButton type="submit" disabled={isPending}>
          Sign In
        </FilledButton>

        <div className="-mb-1 flex items-center justify-center">
          <TextButton
            onClick={() => setIsRegisterOpen(true)}
            className="text-xs"
          >
            Register
          </TextButton>
        </div>
      </form>

      <RegisterModal
        isOpen={isRegisterOpen}
        closeModalAction={() => setIsRegisterOpen(false)}
      />
    </>
  );
}
