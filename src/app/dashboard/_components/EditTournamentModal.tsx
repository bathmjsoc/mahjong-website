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
    const faanOptions = scoringRules.map((rule) => rule.faan);
    if (new Set(faanOptions).size !== faanOptions.length) {
      setError("Duplicate Faan values are not allowed.");
      return;
    }

    const tournamentName = parseFormString(formData, "tournamentName");
    if (!tournamentName) {
      setError("Tournament Name is required.");
      return;
    }

    const rules = [falseWinRule, ...scoringRules];
    const deltas = rules.flatMap((rule) => Object.values(rule.deltas));
    if (
      deltas.some(
        (delta) =>
          Math.abs(delta.winner) > 9999 || Math.abs(delta.loser) > 9999,
      )
    ) {
      setError("Point deltas must be in the range [-9999, 9999].");
      return;
    }

    const boomHands = parseFormString(formData, "boomHands") || "";
    const handTypes = boomHands
      .split(",")
      .map((handType) => handType.trim())
      .filter((handType) => handType.length > 0);

    startTransition(() => {
      updateTournament(tournament, tournamentName, rules, handTypes);
      handleClose();
    });
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Tournament">
      <form
        action={handleSubmit}
        className="flex h-200 w-2xl flex-col items-center gap-5"
        onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
      >
        <LabelledInput
          autoFocus
          defaultValue={tournament.name}
          inputClassName="w-sm"
          name="tournamentName"
          required
          type="text"
        >
          Tournament Name
        </LabelledInput>

        <ScoringEditor
          falseWinRule={falseWinRule}
          scoringRules={scoringRules}
          setFalseWinRule={setFalseWinRule}
          setScoringRules={setScoringRules}
        />

        <BoomHandEditor defaultValue={tournament.hand_types.join(", ")} />

        {error && <span className="text-negative text-xs">{error}</span>}
        <FilledButton className="w-sm" disabled={isPending} type="submit">
          Update Tournament
        </FilledButton>
      </form>
    </Modal>
  );
}
