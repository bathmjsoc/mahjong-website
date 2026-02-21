"use client";

import { useActionState, useState } from "react";
import { type ActionState, signIn } from "@/actions/auth";
import { FilledButton } from "@/elements/FilledButton";
import { LabelledInput } from "@/elements/LabelledInput";
import { TextButton } from "@/elements/TextButton";
import { RegisterModal } from "@/modals/RegisterModal";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    signIn,
    null,
  );
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <form
        action={formAction}
        className="
            bg-(--primary-color) text-(--secondary-color)
            flex flex-col space-y-3 border-none rounded-lg w-sm p-5
          "
      >
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
          autoComplete="current-password"
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
          Sign In
        </FilledButton>

        <div className="flex justify-center -mb-1">
          <TextButton onClick={() => setIsOpen(true)} className="text-xs">
            Register
          </TextButton>
        </div>
      </form>

      <RegisterModal
        isOpen={isOpen}
        closeModalAction={() => setIsOpen(false)}
      />
    </>
  );
}
