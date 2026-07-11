import { useQueryClient } from "@tanstack/react-query";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { createTournament } from "@/actions/tournaments";
import { ScoringRulesTable } from "@/components/ScoringRulesTable";
import { FilledButton } from "@/elements/FilledButton";
import { LabelledInput } from "@/elements/LabelledInput";
import { Modal } from "@/elements/Modal";
import type { PointDelta, ScoringRule } from "@/lib/types";

function createEmptyDeltas(): Record<string, PointDelta> {
  return {
    打出: { winner: 0, loser: 0 },
    自摸: { winner: 0, loser: 0 },
    包自摸: { winner: 0, loser: 0 },
  };
}

type CreateTournamentModalProps = {
  isOpen: boolean;
  closeModalAction: () => void;
};

export function CreateTournamentModal({
  isOpen,
  closeModalAction,
}: CreateTournamentModalProps) {
  const queryClient = useQueryClient();

  const [scoringRules, setScoringRules] = useState<ScoringRule[]>([
    { faan: 0, deltas: createEmptyDeltas() },
  ]);

  async function handleSubmit(formData: FormData) {
    const tournamentName = formData.get("tournamentName")?.toString();
    if (!tournamentName) return;

    console.log(scoringRules);

    await createTournament(tournamentName);
    await queryClient.invalidateQueries({ queryKey: ["tournaments"] });

    closeModalAction();
  }

  function handleAddRule() {
    const newRule: ScoringRule = {
      faan: 0,
      deltas: {
        打出: { winner: 0, loser: 0 },
        自摸: { winner: 0, loser: 0 },
        包自摸: { winner: 0, loser: 0 },
      },
    };

    setScoringRules((rules) => [...rules, newRule]);
  }

  function handleRemoveRule() {
    setScoringRules((rules) => rules.slice(0, -1));
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModalAction} title="Create Tournament">
      <form
        action={handleSubmit}
        className="flex h-120 max-h-120 w-3xl flex-col items-center justify-center gap-4"
      >
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

        <div className="scrollbar-thin scrollbar-thumb-secondary scrollbar-track-transparent flex h-full flex-col gap-4 overflow-y-auto">
          <ScoringRulesTable
            scoringRules={scoringRules}
            setScoringRules={setScoringRules}
          />

          <div className="flex items-center justify-center gap-4">
            <FilledButton
              onClick={handleAddRule}
              className="size-9 rounded-full bg-positive"
            >
              <Plus className="size-5" />
            </FilledButton>

            <FilledButton
              onClick={handleRemoveRule}
              className="size-9 rounded-full bg-negative"
            >
              <Minus className="size-5" />
            </FilledButton>
          </div>
        </div>

        <FilledButton type="submit" className="w-sm bg-accent">
          Create Tournament
        </FilledButton>
      </form>
    </Modal>
  );
}
