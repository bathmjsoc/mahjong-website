"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import FilledButton from "@/elements/FilledButton";
import LabelledInput from "@/elements/LabelledInput";
import TextButton from "@/elements/TextButton";
import { authClient } from "@/lib/auth-client";

export default function SignInForm() {
  const router = useRouter();

  const [pending, setPending] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onRequest: () => setPending(true),
        onSuccess: () => {
          router.push("/");
        },
        onError: (ctx) => {
          alert(ctx.error.message);
          setPending(false);
        },
      },
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="
            bg-(--primary-color) text-(--secondary-color)
            flex flex-col space-y-3 border-none rounded-lg shadow-2xl shadow-black/50
            w-full max-w-sm px-5 py-5
          "
    >
      <LabelledInput id="email" type="email" autoComplete="email">
        Email Address
      </LabelledInput>

      <LabelledInput
        id="password"
        type="password"
        autoComplete="current-password"
      >
        Password
      </LabelledInput>

      <FilledButton type="submit" disabled={pending}>
        Sign In
      </FilledButton>

      <div className="flex space-x-10 justify-center">
        <TextButton href="/sign-up">Register</TextButton>
      </div>
    </form>
  );
}
