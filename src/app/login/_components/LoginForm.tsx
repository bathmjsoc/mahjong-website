import { useState, useTransition } from "react";
import { signIn } from "@/actions/auth";
import { FilledButton } from "@/elements/FilledButton";
import { LabelledInput } from "@/elements/LabelledInput";
import { TextButton } from "@/elements/TextButton";
import { parseFormString } from "@/lib/utils";
import { RegisterModal } from "./RegisterModal";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] =
    useState<boolean>(false);

  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    const email = parseFormString(formData, "email");
    const password = parseFormString(formData, "password");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    startTransition(async () => {
      const result = await signIn(email, password);

      if (!result.success) {
        setError(result.error);
      }
    });
  }

  return (
    <>
      <form
        action={handleSubmit}
        className="flex w-sm flex-col gap-3 rounded-lg bg-primary p-5 text-secondary"
      >
        <LabelledInput
          autoComplete="email"
          autoFocus
          inputClassName="w-full"
          name="email"
          required
          type="email"
        >
          Email Address
        </LabelledInput>

        <LabelledInput
          autoComplete="current-password"
          name="password"
          required
          type="password"
        >
          Password
        </LabelledInput>

        {error && (
          <span className="text-center text-negative text-xs">{error}</span>
        )}

        <FilledButton disabled={isPending} type="submit">
          Sign In
        </FilledButton>

        <TextButton
          className="-mb-1 text-xs"
          onClick={() => setIsRegisterModalOpen(true)}
        >
          Register
        </TextButton>
      </form>

      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </>
  );
}
