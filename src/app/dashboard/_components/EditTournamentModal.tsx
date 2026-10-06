import { useState, useTransition } from "react";
import { FilledButton } from "@/elements/FilledButton";
import { LabelledInput } from "@/elements/LabelledInput";
import { Modal } from "@/elements/Modal";
import { useTournamentMutations } from "@/hooks/tournaments/useTournamentMutations";
import { DEFAULT_FALSE_WIN_RULE } from "@/lib/constants";
import type { ScoringRule, Tournament } from "@/lib/types";
import { parseFormString } from "@/lib/utils";
import { BoomHandEditor } from "./BoomHandEditor";
import { ScoringEditor } from "./ScoringEditor";

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
  const { updateTournament } = useTournamentMutations();

  const [error, setError] = useState<string | null>(null);
  const [falseWinRule, setFalseWinRule] = useState<ScoringRule>(
    tournament.scoring_rules.find((rule) => rule.faan === null) ??
      DEFAULT_FALSE_WIN_RULE,
  );
  const [scoringRules, setScoringRules] = useState<ScoringRule[]>(
    tournament.scoring_rules.filter((rule) => rule.faan !== null),
  );

  const [isPending, startTransition] = useTransition();

  function handleClose() {
    setError(null);
    onClose();
  }

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

    const boomHands = parseFormString(formData, "boomHands") || "";
    const handTypes = boomHands
      .split(",")
      .map((handType) => handType.trim())
      .filter((handType) => handType.length > 0);

    startTransition(() => {
      const rules = [...scoringRules, falseWinRule];
      updateTournament(tournament, tournamentName, rules, handTypes);
      handleClose();
    });
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Tournament">
      <form
        action={handleSubmit}
        onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
        className="flex h-200 w-2xl flex-col items-center gap-5"
      >
        <LabelledInput
          name="tournamentName"
          defaultValue={tournament.name}
          type="text"
          autoFocus
          inputClassName="w-sm"
        >
          Tournament Name
        </LabelledInput>

        <ScoringEditor
          falseWinRule={falseWinRule}
          setFalseWinRule={setFalseWinRule}
          scoringRules={scoringRules}
          setScoringRules={setScoringRules}
        />

        <BoomHandEditor defaultValue={tournament.hand_types.join(", ")} />

        {error && <span className="text-negative text-xs">{error}</span>}
        <FilledButton type="submit" disabled={isPending} className="w-sm">
          Update Tournament
        </FilledButton>
      </form>
    </Modal>
  );
}
