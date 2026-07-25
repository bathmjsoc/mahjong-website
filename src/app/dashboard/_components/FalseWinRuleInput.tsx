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
    const nextRule = structuredClone(scoringRule);

    nextRule.deltas.詐糊 ??= { winner: 0, loser: 0 };
    nextRule.deltas.詐糊[field] = value || 0;
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
          defaultValue={scoringRule.deltas.詐糊?.winner ?? 0}
          inputClassName="no-spinner"
          onBlur={(e) => handleDeltaChange("winner", e.target.valueAsNumber)}
        >
          Winner
        </LabelledInput>

        <LabelledInput
          type="number"
          defaultValue={scoringRule.deltas.詐糊?.loser ?? 0}
          inputClassName="no-spinner"
          onBlur={(e) => handleDeltaChange("loser", e.target.valueAsNumber)}
        >
          Loser
        </LabelledInput>
      </div>
    </div>
  );
}
