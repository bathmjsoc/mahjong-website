"use client";

import { useState } from "react";
import CreateTournamentModal from "@/components/CreateTournamentModal";
import FilledButton from "@/elements/FilledButton";

export default function CreateTournamentButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <FilledButton onClick={() => setIsOpen(true)} className="w-sm py-3">
        Create New Tournament
      </FilledButton>

      <CreateTournamentModal
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
      />
    </>
  );
}
