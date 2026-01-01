"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { signIn } from "@/actions/auth";
import RegisterModal from "@/components/RegisterModal";
import FilledButton from "@/elements/FilledButton";
import LabelledInput from "@/elements/LabelledInput";
import TextButton from "@/elements/TextButton";

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
    } catch (error) {
      alert(error);
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
            flex flex-col space-y-3 border-none rounded-lg w-sm p-5
          "
      >
        <LabelledInput
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={loading}
        >
          Email Address
        </LabelledInput>

        <LabelledInput
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={loading}
        >
          Password
        </LabelledInput>

        <FilledButton type="submit" disabled={loading}>
          Sign In
        </FilledButton>

        <div className="flex justify-center -mb-1">
          <TextButton onClick={() => setIsOpen(true)} className="text-xs">
            Register
          </TextButton>
        </div>
      </form>

      <RegisterModal isOpen={isOpen} closeModal={() => setIsOpen(false)} />
    </>
  );
}
