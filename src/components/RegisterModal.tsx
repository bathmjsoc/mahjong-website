"use client";

import { type FormEvent, useState } from "react";
import FilledButton from "@/elements/FilledButton";
import LabelledInput from "@/elements/LabelledInput";
import Modal from "@/elements/Modal";
import { signUp } from "@/lib/auth";

interface RegisterModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

export default function RegisterModal({
  isOpen,
  closeModal,
}: RegisterModalProps) {
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
      closeModal();
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModal} title="Create Account">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-3 w-xs">
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
          autoComplete="new-password"
          required
          disabled={loading}
        >
          Password
        </LabelledInput>

        <FilledButton type="submit" disabled={loading}>
          Create Account
        </FilledButton>
      </form>
    </Modal>
  );
}
