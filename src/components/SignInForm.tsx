"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import FilledButton from "@/elements/FilledButton";
import LabelledInput from "@/elements/LabelledInput";
import TextButton from "@/elements/TextButton";
import { authClient } from "@/lib/auth-client";

export default function SignInForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); // Prevent page reload
    const formData = new FormData(e.currentTarget);

    await authClient.signIn.email(
      {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      },
      {
        onRequest: () => setLoading(true),
        onResponse: () => setLoading(false),
        onSuccess: () => router.push("/"),
        onError: (ctx) => alert(ctx.error.message),
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
      >
        Email Address
      </LabelledInput>

      <LabelledInput
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
      >
        Password
      </LabelledInput>

      <FilledButton type="submit" disabled={loading}>
        Sign In
      </FilledButton>

      <div className="flex justify-center -mb-1">
        <TextButton href="/sign-up">Register</TextButton>
      </div>
    </form>
  );
}
