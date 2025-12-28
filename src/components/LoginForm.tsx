"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import RegisterModal from "@/components/RegisterModal";
import ColoredButton from "@/elements/ColoredButton";
import FilledButton from "@/elements/FilledButton";
import LabelledInput from "@/elements/LabelledInput";
import { signIn } from "@/lib/auth";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); // Prevent page reload
    if (loading) return;

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      setLoading(true);
      await signIn(email, password);
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="
            bg-(--primary-color) text-(--secondary-color)
            flex flex-col space-y-3 border-none rounded-lg shadow-2xl shadow-black/50
            w-sm p-5
          "
      >
        <LabelledInput name="email" type="email" autoComplete="email" required>
          Email Address
        </LabelledInput>

        <LabelledInput
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
          <ColoredButton onClick={() => setIsOpen(true)} className="text-xs">
            Register
          </ColoredButton>
        </div>
      </form>

      <RegisterModal isOpen={isOpen} closeModal={() => setIsOpen(false)} />
    </>
  );
}
