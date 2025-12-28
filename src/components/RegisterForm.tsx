"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import FilledButton from "@/elements/FilledButton";
import LabelledInput from "@/elements/LabelledInput";
import { signUp } from "@/lib/auth";

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); // Prevent page reload
    if (loading) return;

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      setLoading(true);
      await signUp(email, password);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="
            bg-(--primary-color) text-(--secondary-color)
            flex flex-col space-y-3 border-none rounded-lg shadow-2xl shadow-black/50
            w-sm px-5 py-5
          "
    >
      <LabelledInput
        name="email"
        type="email"
        autoComplete="email"
        required
        autoFocus
      >
        Email Address
      </LabelledInput>

      <LabelledInput
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
