"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import FilledButton from "@/elements/FilledButton";
import LabelledInput from "@/elements/LabelledInput";
import { authClient } from "@/lib/auth-client";

export default function SignUpForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    await authClient.signUp.email(
      {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        name: "", // Name is not collected
      },
      {
        onRequest: () => setLoading(true),
        onResponse: () => setLoading(false),
        onSuccess: () => router.push("/sign-in"),
        onError: (ctx) => {
          alert(ctx.error.message);
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
      <LabelledInput
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        required
        autoFocus
      >
        Email Address
      </LabelledInput>

      <LabelledInput
        id="password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
      >
        Password
      </LabelledInput>

      <FilledButton type="submit" disabled={loading}>
        Sign Up
      </FilledButton>
    </form>
  );
}
