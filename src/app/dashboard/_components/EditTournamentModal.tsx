import { useQueryClient } from "@tanstack/react-query";
import { useState, useTransition } from "react";
import { updateTournament } from "@/actions/tournaments";
import { BoomHandEditor } from "@/app/dashboard/_components/BoomHandEditor";
import { ScoringEditor } from "@/app/dashboard/_components/ScoringEditor";
import { FilledButton } from "@/elements/FilledButton";
import { LabelledInput } from "@/elements/LabelledInput";
import { Modal } from "@/elements/Modal";
import { DEFAULT_FALSE_WIN_RULE } from "@/lib/constants";
import type { ScoringRule, Tournament } from "@/lib/types";
import { parseFormString } from "@/lib/utils";

type EditTournamentModalProps = {
  isOpen: boolean;
  tournament: Tournament;
  onClose: () => void;
};

export function EditTournamentModal({
  isOpen,
  tournament,
  onClose,
}: EditTournamentModalProps) {
  const queryClient = useQueryClient();

  const [boomHands, setBoomHands] = useState(tournament.hand_types.join(", "));
  const [error, setError] = useState<string | null>(null);
  const [falseWinRule, setFalseWinRule] = useState<ScoringRule>(
    tournament.scoring_rules.find((rule) => rule.faan === null) ??
      DEFAULT_FALSE_WIN_RULE,
  );
  const [scoringRules, setScoringRules] = useState<ScoringRule[]>(
    tournament.scoring_rules.filter((rule) => rule.faan !== null),
  );

  const [isSubmitting, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    const tournamentName = parseFormString(formData, "tournamentName");
    if (!tournamentName) {
      setError("Tournament Name is required");
      return;
    }

    const faanOptions = scoringRules.map((rule) => rule.faan);
    if (new Set(faanOptions).size !== faanOptions.length) {
      setError("Duplicate Faan values are not allowed.");
      return;
    }

    const handTypes = boomHands
      .split(",")
      .map((handType) => handType.trim())
      .filter((handType) => handType.length > 0);

    startTransition(async () => {
      const updatedTournament = {
        ...tournament,
        name: tournamentName,
        scoring_rules: [...scoringRules, falseWinRule],
        hand_types: handTypes,
      };

      await updateTournament(updatedTournament);
      await queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      onClose();
    });
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Tournament">
      <form
        action={handleSubmit}
        onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
        className="flex h-200 w-2xl flex-col items-center justify-center gap-4"
      >
        <div className="flex flex-col gap-3">
          <LabelledInput
            name="tournamentName"
            defaultValue={tournament.name}
            onChange={() => setError(null)}
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

        <BoomHandEditor boomHands={boomHands} setBoomHands={setBoomHands} />

        <FilledButton type="submit" disabled={isSubmitting} className="w-sm">
          Update Tournament
        </FilledButton>
      </form>
    </Modal>
  );
}
