import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createTournament } from "@/actions/tournaments";
import { FilledButton } from "@/elements/FilledButton";
import { LabelledInput } from "@/elements/LabelledInput";
import { Modal } from "@/elements/Modal";
import { DEFAULT_FALSE_WIN_RULE, DEFAULT_SCORING_RULE } from "@/lib/constants";
import type { ScoringRule } from "@/lib/types";
import { ScoringEditor } from "./ScoringEditor";

type CreateTournamentModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function CreateTournamentModal({
  isOpen,
  onClose,
}: CreateTournamentModalProps) {
  const queryClient = useQueryClient();

  const [error, setError] = useState<string | null>(null);
  const [falseWinRule, setFalseWinRule] = useState<ScoringRule>(
    DEFAULT_FALSE_WIN_RULE,
  );
  const [scoringRules, setScoringRules] = useState<ScoringRule[]>([
    DEFAULT_SCORING_RULE,
  ]);

  async function handleSubmit(formData: FormData) {
    const tournamentName = formData.get("tournamentName");

    if (typeof tournamentName !== "string" || !tournamentName.trim()) {
      setError("Tournament Name is required");
      return;
    }

    await createTournament(tournamentName, [...scoringRules, falseWinRule]);
    await queryClient.invalidateQueries({ queryKey: ["tournaments"] });

    handleClose();
  }

  function handleClose() {
    setError(null);
    setFalseWinRule(DEFAULT_FALSE_WIN_RULE);
    setScoringRules([DEFAULT_SCORING_RULE]);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Tournament">
      <form
        action={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault();
        }}
        className="flex h-150 w-2xl flex-col items-center justify-center gap-4"
      >
        <div className="flex flex-col gap-3">
          <LabelledInput
            name="tournamentName"
            type="text"
            autoComplete="off"
            autoFocus
            required
            inputClassName="w-sm"
          >
            Tournament Name
          </LabelledInput>

          {error && (
            <span className="text-center text-negative text-xs">{error}</span>
          )}
        </div>

        <ScoringEditor
          scoringRules={scoringRules}
          setScoringRules={setScoringRules}
          falseWinRule={falseWinRule}
          setFalseWinRule={setFalseWinRule}
        />

        <FilledButton type="submit" className="w-sm">
          Create Tournament
        </FilledButton>
      </form>
    </Modal>
  );
}
