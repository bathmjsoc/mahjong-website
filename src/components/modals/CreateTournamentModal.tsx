import { useQueryClient } from "@tanstack/react-query";
import { createTournament } from "@/actions/tournaments";
import {
  DEFAULT_FALSE_WIN_RULE,
  DEFAULT_SCORING_RULE,
  ScoringEditor,
} from "@/components/ScoringEditor";
import { FilledButton } from "@/elements/FilledButton";
import { LabelledInput } from "@/elements/LabelledInput";
import { Modal } from "@/elements/Modal";
import type { ScoringRule } from "@/lib/types";

type CreateTournamentModalProps = {
  isOpen: boolean;
  closeModalAction: () => void;
};

export function CreateTournamentModal({
  isOpen,
  closeModalAction,
}: CreateTournamentModalProps) {
  const queryClient = useQueryClient();

  const [falseWinRule, setFalseWinRule] = useState<ScoringRule>(
    DEFAULT_FALSE_WIN_RULE,
  );
  const [scoringRules, setScoringRules] = useState<ScoringRule[]>([
    DEFAULT_SCORING_RULE,
  ]);

  async function handleSubmit(formData: FormData) {
    const tournamentName = formData.get("tournamentName");

    if (typeof tournamentName !== "string" || !tournamentName.trim()) {
      return;
    }

    await createTournament(tournamentName, [...scoringRules, falseWinRule]);
    await queryClient.invalidateQueries({ queryKey: ["tournaments"] });

    handleClose();
  }

  function handleClose() {
    setFalseWinRule(DEFAULT_FALSE_WIN_RULE);
    setScoringRules([DEFAULT_SCORING_RULE]);
    closeModalAction();
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
