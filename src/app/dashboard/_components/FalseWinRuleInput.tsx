import { LabelledInput } from "@/elements/LabelledInput";
import type { ScoringRule } from "@/lib/types";

type FalseWinRuleEditorProps = {
  scoringRule: ScoringRule;
  onChange: (updatedRule: ScoringRule) => void;
};

export function FalseWinRuleInput({
  scoringRule,
  onChange,
}: FalseWinRuleEditorProps) {
  function handleDeltaChange(field: "winner" | "loser", value: number) {
    const newRule = structuredClone(scoringRule);

    newRule.deltas.詐糊 ??= { winner: 0, loser: 0 };
    newRule.deltas.詐糊[field] = value;
    onChange(newRule);
  }

  return (
    <div className="flex items-center justify-center gap-3">
      <span title="False Win" className="font-bold">
        詐糊
      </span>

      <LabelledInput
        type="number"
        defaultValue={scoringRule.deltas.詐糊?.winner ?? 0}
        inputClassName="no-spinner w-50"
        onBlur={(e) => handleDeltaChange("winner", e.target.valueAsNumber || 0)}
      >
        Winner
      </LabelledInput>

      <LabelledInput
        type="number"
        defaultValue={scoringRule.deltas.詐糊?.loser ?? 0}
        inputClassName="no-spinner w-50"
        onBlur={(e) => handleDeltaChange("loser", e.target.valueAsNumber || 0)}
      >
        Loser
      </LabelledInput>
    </div>
  );
}
