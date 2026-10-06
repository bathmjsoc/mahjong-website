import { Minus, Plus } from "lucide-react";
import { FilledButton } from "@/elements/FilledButton";
import { DEFAULT_SCORING_RULE } from "@/lib/constants";
import type { ScoringRule } from "@/lib/types";
import { FalseWinRuleInput } from "./FalseWinRuleInput";
import { ScoringRulesTable } from "./ScoringRulesTable";

type ScoringEditorProps = {
  falseWinRule: ScoringRule;
  setFalseWinRule: (rule: ScoringRule) => void;
  scoringRules: ScoringRule[];
  setScoringRules: (rules: ScoringRule[]) => void;
};

export function ScoringEditor({
  falseWinRule,
  setFalseWinRule,
  scoringRules,
  setScoringRules,
}: ScoringEditorProps) {
  function handleAddRule() {
    setScoringRules([...scoringRules, DEFAULT_SCORING_RULE]);
  }

  function handleRemoveRule() {
    if (scoringRules.length === 1) return; // Prevents the user from removing the last rule

    setScoringRules(scoringRules.slice(0, -1));
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="rounded bg-secondary/15 p-2 text-center text-sm">
        Scoring Rules
      </div>

      <FalseWinRuleInput
        onChange={setFalseWinRule}
        scoringRule={falseWinRule}
      />

      <div className="scrollbar-thin scrollbar-thumb-secondary scrollbar-track-transparent scrollbar-gutter-stable overflow-y-auto">
        <ScoringRulesTable
          onChange={setScoringRules}
          scoringRules={scoringRules}
        />

        <div className="mt-3 flex justify-center gap-3">
          <FilledButton
            className="rounded-full bg-positive"
            onClick={handleAddRule}
          >
            <Plus className="size-5" />
          </FilledButton>

          <FilledButton
            className="rounded-full bg-negative"
            onClick={handleRemoveRule}
          >
            <Minus className="size-5" />
          </FilledButton>
        </div>
      </div>
    </div>
  );
}
