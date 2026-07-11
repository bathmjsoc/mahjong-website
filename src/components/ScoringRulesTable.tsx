import type { Dispatch, SetStateAction } from "react";
import { LabelledInput } from "@/elements/LabelledInput";
import type { ScoringRule, WinType } from "@/lib/types";

const WIN_TYPES: WinType[] = ["打出", "自摸", "包自摸"] as const;

type ScoringRulesTableProps = {
  scoringRules: ScoringRule[];
  setScoringRules: Dispatch<SetStateAction<ScoringRule[]>>;
};

export function ScoringRulesTable({
  scoringRules,
  setScoringRules,
}: ScoringRulesTableProps) {
  function handleRuleChange(index: number, newRule: ScoringRule) {
    setScoringRules((prevRule) => prevRule.with(index, newRule));
  }

  return (
    <table className="w-full table-fixed border-collapse">
      <thead className="sticky top-0 z-10 bg-primary">
        <tr>
          <th rowSpan={2}>Faan</th>

          {WIN_TYPES.map((winType) => (
            <th key={winType} colSpan={2} className="border-secondary border-l">
              {winType}
            </th>
          ))}
        </tr>

        <tr>
          {WIN_TYPES.flatMap((winType) => [
            <th
              key={`${winType}_winner`}
              className="border-secondary border-l text-xs"
            >
              Winner
            </th>,

            <th key={`${winType}_loser`} className="text-xs">
              Loser
            </th>,
          ])}
        </tr>
      </thead>

      <tbody>
        {scoringRules.map((rule, index) => (
          <ScoringRuleRow
            key={index}
            rule={rule}
            onChange={(updatedRule) => handleRuleChange(index, updatedRule)}
          />
        ))}
      </tbody>
    </table>
  );
}

type ScoringRuleRowProps = {
  rule: ScoringRule;
  onChange: (updatedRule: ScoringRule) => void;
};

function ScoringRuleRow({ rule, onChange }: ScoringRuleRowProps) {
  function updateFaan(value: number) {
    const nextRule = structuredClone(rule);
    nextRule.faan = value;
    onChange(nextRule);
  }

  function updateDelta(
    winType: WinType,
    field: "winner" | "loser",
    value: number,
  ) {
    const nextRule = structuredClone(rule);

    nextRule.deltas[winType] ??= { winner: 0, loser: 0 };
    nextRule.deltas[winType][field] = value;

    onChange(nextRule);
  }

  return (
    <tr>
      <td className="px-2 py-1">
        <LabelledInput
          type="number"
          defaultValue={rule.faan}
          inputClassName="no-spinner"
          onBlur={(e) => updateFaan(Number(e.target.value))}
        />
      </td>

      {WIN_TYPES.flatMap((winType) => [
        <td
          key={`${winType}_winner_delta`}
          className="border-secondary border-l px-2 py-1"
        >
          <LabelledInput
            type="number"
            defaultValue={rule.deltas[winType]?.winner}
            inputClassName="no-spinner"
            onBlur={(e) =>
              updateDelta(winType, "winner", Number(e.target.value))
            }
          />
        </td>,

        <td key={`${winType}_loser_delta`} className="px-2 py-1">
          <LabelledInput
            type="number"
            defaultValue={rule.deltas[winType]?.loser}
            inputClassName="no-spinner"
            onBlur={(e) =>
              updateDelta(winType, "loser", Number(e.target.value))
            }
          />
        </td>,
      ])}
    </tr>
  );
}
