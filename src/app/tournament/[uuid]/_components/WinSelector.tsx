import confetti from "canvas-confetti";
import { twMerge } from "tailwind-merge";
import { DropDown, DropDownItem } from "@/elements/DropDown";
import { useLogMutations } from "@/hooks/logs/useLogMutations";
import { usePlayers } from "@/hooks/players/usePlayers";
import { useCurrentTournament } from "@/hooks/tournaments/useTournaments";
import type { Player, PointsAnimationEvent, Table, WinType } from "@/lib/types";

const MAHJONG_TILE = confetti.shapeFromText({ text: "🀄" });

type WinSelectorProps = {
  table: Table;
  occupant: Player | null;
  className?: string;
};

export function WinSelector({ table, occupant, className }: WinSelectorProps) {
  const { handTypes, scoringRulesMap } = useCurrentTournament();
  const { createLog } = useLogMutations();
  const { playerMap } = usePlayers();

  const faanOptions = Array.from(scoringRulesMap.keys())
    .filter((key) => key !== null)
    .sort((a, b) => a - b);
  const maxFaan = Math.max(...faanOptions);

  const opponents: Player[] = [];
  if (occupant !== null) {
    const seatIds = [
      table.east_id,
      table.south_id,
      table.west_id,
      table.north_id,
    ] as const;

    for (const id of seatIds) {
      if (id === null || id === occupant.id) continue;

      const player = playerMap.get(id);
      if (player) opponents.push(player);
    }
  }

  function handleWin(
    winType: WinType,
    faan: number | null,
    target: Player | null = null,
    handType: string | null = null,
  ) {
    if (occupant === null) return;

    const winners: Player[] = [];
    const losers: Player[] = [];
    const others: Player[] = [];

    switch (winType) {
      case "打出":
      case "包自摸":
        if (!target) return;

        winners.push(occupant);
        losers.push(target);

        for (const player of opponents) {
          if (player.id !== target.id) others.push(player);
        }
        break;

      case "自摸":
        winners.push(occupant);
        losers.push(...opponents);
        break;

      case "詐糊":
        losers.push(occupant);
        winners.push(...opponents);
        break;
    }

    const delta = scoringRulesMap.get(faan)?.deltas[winType];
    const winnerPoints = delta?.winner ?? 0;
    const loserPoints = delta?.loser ?? 0;

    createLog(
      winType,
      handType,
      faan,
      winners,
      losers,
      others,
      winnerPoints,
      loserPoints,
    );
    handleAnimations(faan, winners, losers, winnerPoints, loserPoints);
  }

  function handleAnimations(
    faan: number | null,
    winners: Player[],
    losers: Player[],
    winnerPoints: number,
    loserPoints: number,
  ) {
    window.dispatchEvent(
      new CustomEvent<PointsAnimationEvent>(`points-animation-${table.id}`, {
        detail: { winners, losers, winnerPoints, loserPoints },
      }),
    );

    if (faan === maxFaan) {
      confetti({
        particleCount: 500,
        spread: 360,
        shapes: [MAHJONG_TILE],
        scalar: 2,
      });
    }
  }

  function renderFaanOptions(winType: WinType, player: Player | null) {
    return faanOptions.map((faan) => {
      if (faan === maxFaan) {
        return (
          <DropDown key={faan} title={String(faan)}>
            {handTypes.map((handType) => (
              <DropDownItem
                key={handType}
                onClick={() => handleWin(winType, faan, player, handType)}
              >
                {handType}
              </DropDownItem>
            ))}
          </DropDown>
        );
      }

      return (
        <DropDownItem
          key={faan}
          onClick={() => handleWin(winType, faan, player)}
        >
          {faan}
        </DropDownItem>
      );
    });
  }

  return (
    <DropDown
      buttonClassName={twMerge(
        "bg-accent text-secondary size-8 rounded-full",
        className,
      )}
      disabled={occupant === null || opponents.length === 0}
      title="食"
      tooltip="Record Win"
    >
      <DropDown title="打出 (Throw)">
        {opponents.map((player) => (
          <DropDown key={player.id} title={player.name}>
            {renderFaanOptions("打出", player)}
          </DropDown>
        ))}
      </DropDown>

      <DropDown title="自摸 (Self-Draw)">
        {renderFaanOptions("自摸", null)}
      </DropDown>

      <DropDown title="包自摸 (Special Case)">
        {opponents.map((player) => (
          <DropDown key={player.id} title={player.name}>
            {renderFaanOptions("包自摸", player)}
          </DropDown>
        ))}
      </DropDown>

      <div className="border-primary border-t" />

      <DropDownItem
        className="text-negative"
        onClick={() => handleWin("詐糊", null)}
      >
        詐糊 (False Win)
      </DropDownItem>
    </DropDown>
  );
}
