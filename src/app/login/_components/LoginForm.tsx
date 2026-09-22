import { useState, useTransition } from "react";
import { signIn } from "@/actions/auth";
import { FilledButton } from "@/elements/FilledButton";
import { LabelledInput } from "@/elements/LabelledInput";
import { TextButton } from "@/elements/TextButton";
import { parseFormString } from "@/lib/utils";
import { RegisterModal } from "./RegisterModal";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
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
        return;
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

        {error && <p className="text-center text-negative text-xs">{error}</p>}

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
        onClose={() => setIsRegisterOpen(false)}
      />
    </>
  );
}
