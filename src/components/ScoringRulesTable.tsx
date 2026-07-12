import { type Dispatch, Fragment, type SetStateAction } from "react";
import { LabelledInput } from "@/elements/LabelledInput";
import type { ScoringRule, WinType } from "@/lib/types";

const WIN_TYPES: Array<{ winType: WinType; tooltip: string }> = [
  { winType: "打出", tooltip: "Throw" },
  { winType: "自摸", tooltip: "Self-Draw" },
  { winType: "包自摸", tooltip: "Special Case" },
] as const;

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

          {WIN_TYPES.map(({ winType, tooltip }) => (
            <th
              key={winType}
              colSpan={2}
              title={tooltip}
              className="border-secondary border-l"
            >
              <span className="cursor-help">{winType}</span>
            </th>
          ))}
        </tr>

        <tr>
          {WIN_TYPES.map(({ winType }) => (
            <Fragment key={`${winType}_headers`}>
              <th className="border-secondary border-l text-xs">Winner</th>
              <th className="text-xs">Loser</th>
            </Fragment>
          ))}
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
  function handleFaanChange(value: number) {
    const nextRule = structuredClone(rule);

    nextRule.faan = value;
    onChange(nextRule);
  }

  function handleDeltaChange(
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
          defaultValue={rule.faan ?? 0}
          inputClassName="no-spinner"
          onBlur={(e) => handleFaanChange(e.target.valueAsNumber)}
        />
      </td>

      {WIN_TYPES.map(({ winType }) => (
        <Fragment key={`${winType}_deltas`}>
          <td className="border-secondary border-l px-2 py-1">
            <LabelledInput
              type="number"
              defaultValue={rule.deltas[winType]?.winner}
              inputClassName="no-spinner"
              onBlur={(e) =>
                handleDeltaChange(winType, "winner", e.target.valueAsNumber)
              }
            />
          </td>

          <td className="px-2 py-1">
            <LabelledInput
              type="number"
              defaultValue={rule.deltas[winType]?.loser}
              inputClassName="no-spinner"
              onBlur={(e) =>
                handleDeltaChange(winType, "loser", e.target.valueAsNumber)
              }
            />
          </td>
        </Fragment>
      ))}
    </tr>
  );
}
