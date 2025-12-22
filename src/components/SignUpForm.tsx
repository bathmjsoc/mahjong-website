"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import FilledButton from "@/elements/FilledButton";
import LabelledInput from "@/elements/LabelledInput";
import { authClient } from "@/lib/auth-client";

export default function SignUpForm() {
  const router = useRouter();

  const [pending, setPending] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    await authClient.signUp.email(
      {
        email,
        password,
        name: "unused",
      },
      {
        onRequest: () => setPending(true),
        onSuccess: () => {
          router.push("/sign-in");
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

      <LabelledInput id="password" type="password" autoComplete="new-password">
        Password
      </LabelledInput>

      <FilledButton type="submit" disabled={pending}>
        Sign Up
      </FilledButton>
    </form>
  );
}
