import { Minus, Plus } from "lucide-react";
import { FilledButton } from "@/elements/FilledButton";
import type { ScoringRule } from "@/lib/types";
import { FalseWinRuleEditor } from "./FalseWinRuleEditor";
import { ScoringRulesTable } from "./ScoringRulesTable";

export const DEFAULT_SCORING_RULE: ScoringRule = {
  faan: 0,
  deltas: {
    打出: { winner: 0, loser: 0 },
    自摸: { winner: 0, loser: 0 },
    包自摸: { winner: 0, loser: 0 },
  },
} as const;

export const DEFAULT_FALSE_WIN_RULE: ScoringRule = {
  faan: null,
  deltas: {
    詐糊: { winner: 0, loser: 0 },
  },
} as const;

type ScoringEditorProps = {
  scoringRules: ScoringRule[];
  setScoringRules: (rules: ScoringRule[]) => void;
  falseWinRule: ScoringRule;
  setFalseWinRule: (rule: ScoringRule) => void;
};

export function ScoringEditor({
  scoringRules,
  setScoringRules,
  falseWinRule,
  setFalseWinRule,
}: ScoringEditorProps) {
  function handleAddRule() {
    setScoringRules([...scoringRules, DEFAULT_SCORING_RULE]);
  }

  function handleRemoveRule() {
    if (scoringRules.length === 1) return;

    setScoringRules(scoringRules.slice(0, -1));
  }

  return (
    <>
      <div className="w-full rounded bg-white/10 p-2 text-center text-sm">
        Scoring Rules
      </div>

      <FalseWinRuleEditor
        scoringRule={falseWinRule}
        onChange={setFalseWinRule}
      />

      <div className="scrollbar-thin scrollbar-thumb-secondary scrollbar-track-transparent flex h-full flex-col gap-4 overflow-y-auto">
        <ScoringRulesTable
          scoringRules={scoringRules}
          onChange={setScoringRules}
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
    </>
  );
}
