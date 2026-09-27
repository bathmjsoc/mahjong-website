import { Fragment } from "react";
import { LabelledInput } from "@/elements/LabelledInput";
import { WIN_TYPE_MAP, WIN_TYPES } from "@/lib/constants";
import type { ScoringRule, WinType } from "@/lib/types";

type ScoringRulesTableProps = {
  scoringRules: ScoringRule[];
  onChange: (rules: ScoringRule[]) => void;
};

export function ScoringRulesTable({
  scoringRules,
  onChange,
}: ScoringRulesTableProps) {
  function handleRuleChange(index: number, newRule: ScoringRule) {
    onChange(scoringRules.with(index, newRule));
  }

  return (
    <table className="w-full table-fixed border-collapse">
      <thead className="sticky top-0 z-10 bg-primary">
        <tr>
          <th rowSpan={2}>Faan</th>

          {WIN_TYPES.map((winType) => (
            <th
              key={winType}
              colSpan={2}
              title={WIN_TYPE_MAP[winType]}
              className="border-l"
            >
              {winType}
            </th>
          ))}
        </tr>

        <tr>
          {WIN_TYPES.map((winType) => (
            <Fragment key={`${winType}_headers`}>
              <th className="border-l text-xs">Winner</th>
              <th className="text-xs">Loser</th>
            </Fragment>
          ))}
        </tr>
      </thead>

      <tbody>
        {scoringRules.map((rule, index) => (
          <ScoringRuleRow
            // biome-ignore lint/suspicious/noArrayIndexKey: Rules are only added/removed from the end
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
  function handleFaanChange(faan: number) {
    onChange({ ...rule, faan });
  }

  function handleDeltaChange(
    winType: WinType,
    field: "winner" | "loser",
    value: number,
  ) {
    const newRule = structuredClone(rule);

    newRule.deltas[winType] ??= { winner: 0, loser: 0 };
    newRule.deltas[winType][field] = value;
    onChange(newRule);
  }

  return (
    <tr>
      <td className="px-2 py-1">
        <LabelledInput
          type="number"
          defaultValue={rule.faan ?? 0}
          inputClassName="no-spinner"
          onBlur={(e) => handleFaanChange(e.target.valueAsNumber || 0)}
        />
      </td>

      {WIN_TYPES.map((winType) => (
        <Fragment key={`${winType}_deltas`}>
          <td className="border-l px-2 py-1">
            <LabelledInput
              type="number"
              defaultValue={rule.deltas[winType]?.winner ?? 0}
              inputClassName="no-spinner"
              onBlur={(e) =>
                handleDeltaChange(
                  winType,
                  "winner",
                  e.target.valueAsNumber || 0,
                )
              }
            />
          </td>

          <td className="px-2 py-1">
            <LabelledInput
              type="number"
              defaultValue={rule.deltas[winType]?.loser ?? 0}
              inputClassName="no-spinner"
              onBlur={(e) =>
                handleDeltaChange(winType, "loser", e.target.valueAsNumber || 0)
              }
            />
          </td>
        </Fragment>
      ))}
    </tr>
  );
}
