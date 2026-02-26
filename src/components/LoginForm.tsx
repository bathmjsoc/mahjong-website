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
        className="
            bg-primary text-secondary
            flex flex-col gap-3 rounded-lg w-sm p-5
          "
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
          <p className="text-negative text-xs text-center">{state.error}</p>
        )}

        <FilledButton type="submit" disabled={isPending}>
          Sign In
        </FilledButton>

        <div className="flex items-center justify-center -mb-1">
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
