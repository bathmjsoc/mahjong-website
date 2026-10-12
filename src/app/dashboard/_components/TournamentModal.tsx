import { useState, useTransition } from "react";
import { FilledButton } from "@/elements/FilledButton";
import { LabelledInput } from "@/elements/LabelledInput";
import { Modal } from "@/elements/Modal";
import { useTournamentMutations } from "@/hooks/tournaments/useTournamentMutations";
import { DEFAULT_FALSE_WIN_RULE, DEFAULT_SCORING_RULE } from "@/lib/constants";
import type { ScoringRule, Tournament } from "@/lib/types";
import { parseFormString } from "@/lib/utils";
import { BoomHandEditor } from "./BoomHandEditor";
import { ScoringEditor } from "./ScoringEditor";

type TournamentModalProps = {
  isOpen: boolean;
  tournament?: Tournament;
  onClose: () => void;
};

export function TournamentModal({
  isOpen,
  tournament,
  onClose,
}: TournamentModalProps) {
  const { createTournament, updateTournament } = useTournamentMutations();

  const [error, setError] = useState<string | null>(null);
  const [falseWinRule, setFalseWinRule] = useState<ScoringRule>(
    tournament?.scoring_rules.find((rule) => rule.faan === null) ??
      DEFAULT_FALSE_WIN_RULE,
  );
  const [scoringRules, setScoringRules] = useState<ScoringRule[]>(
    tournament?.scoring_rules.filter((rule) => rule.faan !== null) ?? [
      DEFAULT_SCORING_RULE,
    ],
  );
  const [isPending, startTransition] = useTransition();

  function handleClose() {
    setError(null);
    setFalseWinRule(
      tournament?.scoring_rules.find((rule) => rule.faan === null) ??
        DEFAULT_FALSE_WIN_RULE,
    );
    setScoringRules(
      tournament?.scoring_rules.filter((rule) => rule.faan !== null) ?? [
        DEFAULT_SCORING_RULE,
      ],
    );
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
      tournament
        ? updateTournament(tournament, tournamentName, rules, handTypes)
        : createTournament(tournamentName, rules, handTypes);
      handleClose();
    });
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={tournament ? "Edit Tournament" : "Create Tournament"}
    >
      <form
        action={handleSubmit}
        className="flex h-200 w-2xl flex-col items-center gap-5"
        onKeyDownCapture={(e) => e.key === "Enter" && e.preventDefault()}
      >
        <LabelledInput
          autoFocus
          defaultValue={tournament?.name}
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

        <BoomHandEditor
          defaultValue={tournament?.hand_types.join(", ") ?? ""}
        />

        {error && <span className="text-negative text-xs">{error}</span>}
        <FilledButton className="w-sm" disabled={isPending} type="submit">
          {tournament ? "Update Tournament" : "Create Tournament"}
        </FilledButton>
      </form>
    </Modal>
  );
}
