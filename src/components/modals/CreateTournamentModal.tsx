import { useQueryClient } from "@tanstack/react-query";
import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { createTournament } from "@/actions/tournaments";
import { ScoringRulesTable } from "@/components/ScoringRulesTable";
import { FilledButton } from "@/elements/FilledButton";
import { LabelledInput } from "@/elements/LabelledInput";
import { Modal } from "@/elements/Modal";
import type { ScoringRule } from "@/lib/types";

const DEFAULT_SCORING_RULE: ScoringRule = {
  faan: 0,
  deltas: {
    打出: { winner: 0, loser: 0 },
    自摸: { winner: 0, loser: 0 },
    包自摸: { winner: 0, loser: 0 },
  },
} as const;

const DEFAULT_FALSE_WIN_RULE: ScoringRule = {
  faan: null,
  deltas: {
    詐糊: { winner: 0, loser: 0 },
  },
} as const;

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
    DEFAULT_SCORING_RULE,
  ]);

  const [falseWinRule, setFalseWinRule] = useState<ScoringRule>(
    DEFAULT_FALSE_WIN_RULE,
  );

  useEffect(() => {
    if (!isOpen) {
      setScoringRules([DEFAULT_SCORING_RULE]);
      setFalseWinRule(DEFAULT_FALSE_WIN_RULE);
    }
  }, [isOpen]);

  async function handleSubmit(formData: FormData) {
    const tournamentName = formData.get("tournamentName") as string;

    await createTournament(tournamentName, [...scoringRules, falseWinRule]);
    await queryClient.invalidateQueries({ queryKey: ["tournaments"] });

    closeModalAction();
  }

  function handleAddRule() {
    setScoringRules((rules) => [...rules, DEFAULT_SCORING_RULE]);
  }

  function handleRemoveRule() {
    setScoringRules((rules) => rules.slice(0, -1));
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModalAction} title="Create Tournament">
      <form
        action={handleSubmit}
        className="flex h-150 w-2xl flex-col items-center justify-center gap-4"
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

        <div className="w-full rounded bg-white/10 p-2 text-center text-sm">
          Scoring Rules
        </div>

        <FalseWinEditor rule={falseWinRule} onChange={setFalseWinRule} />

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

type FalseWinEditorProps = {
  rule: ScoringRule;
  onChange: (updatedRule: ScoringRule) => void;
};

function FalseWinEditor({ rule, onChange }: FalseWinEditorProps) {
  function handleDeltaChange(field: "winner" | "loser", value: number) {
    const nextRule = structuredClone(rule);

    nextRule.deltas.詐糊 ??= { winner: 0, loser: 0 };
    nextRule.deltas.詐糊[field] = value;
    onChange(nextRule);
  }

  return (
    <div className="flex items-center justify-center">
      <div className="grid w-3/7 grid-cols-3 gap-4 p-2">
        <div className="flex items-center justify-center">
          <span title="False Win" className="font-bold">
            詐糊
          </span>
        </div>

        <LabelledInput
          type="number"
          defaultValue={rule.deltas.詐糊?.winner}
          inputClassName="no-spinner"
          onBlur={(e) => handleDeltaChange("winner", e.target.valueAsNumber)}
        >
          Winner
        </LabelledInput>

        <LabelledInput
          type="number"
          defaultValue={rule.deltas.詐糊?.loser}
          inputClassName="no-spinner"
          onBlur={(e) => handleDeltaChange("loser", e.target.valueAsNumber)}
        >
          Loser
        </LabelledInput>
      </div>
    </div>
  );
}
