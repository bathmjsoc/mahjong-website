import confetti from "canvas-confetti";
import { twMerge } from "tailwind-merge";
import { DropDown } from "@/elements/DropDown";
import { useLogMutations } from "@/hooks/logs/useLogMutations";
import { usePlayers } from "@/hooks/players/usePlayers";
import { useCurrentTournament } from "@/hooks/tournaments/useCurrentTournament";
import { getPointDeltas } from "@/lib/scoring";
import type { Player, PointsAnimationEvent, Table, WinType } from "@/lib/types";

type WinSelectorProps = {
  table: Table;
  occupant: Player | null;
  className?: string;
};

export function WinSelector({ table, occupant, className }: WinSelectorProps) {
  const { createLog } = useLogMutations();
  const { playerMap } = usePlayers();
  const { handTypes, scoringRulesMap } = useCurrentTournament();

  const faanOptions = Array.from(scoringRulesMap.keys()).filter(
    (key) => key !== null,
  );
  const maxFaan = Math.max(...faanOptions);

  const opponents: Player[] = [];
  if (occupant !== null) {
    const SEAT_IDS = [
      table.east_id,
      table.south_id,
      table.west_id,
      table.north_id,
    ] as const;

    for (const id of SEAT_IDS) {
      if (id === null || id === occupant.id) continue;

      const player = playerMap.get(id);
      if (player) opponents.push(player);
    }
  }

  function handleWin(
    winType: WinType,
    faan: number | null,
    target?: Player | null,
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

    createLog(winType, handType, faan, winners, losers, others);
    handleAnimations(winType, faan, winners, losers);
  }

  function handleAnimations(
    winType: WinType,
    faan: number | null,
    winners: Player[],
    losers: Player[],
  ) {
    const delta = getPointDeltas(faan, winType, scoringRulesMap);

    window.dispatchEvent(
      new CustomEvent<PointsAnimationEvent>(`points-animation-${table.id}`, {
        detail: { delta, winners, losers },
      }),
    );

    if (faan === maxFaan) {
      confetti({
        particleCount: 500,
        spread: 360,
        shapes: [confetti.shapeFromText({ text: "🀄" })],
        scalar: 2,
      });
    }
  }

  function renderFaanOptions(winType: WinType, player: Player | null) {
    return faanOptions.map((faan) => {
      if (faan === maxFaan) {
        return (
          <DropDown title={String(faan)} key={faan}>
            {handTypes.map((handType) => (
              <DropDown.Item
                key={handType}
                onClick={() => handleWin(winType, faan, player, handType)}
              >
                {handType}
              </DropDown.Item>
            ))}
          </DropDown>
        );
      }

      return (
        <DropDown.Item
          key={faan}
          onClick={() => handleWin(winType, faan, player)}
        >
          {faan}
        </DropDown.Item>
      );
    });
  }

  return (
    <DropDown
      title="食"
      buttonClassName={twMerge("rounded-full size-8 bg-accent", className)}
      tooltip="Record Win"
      disabled={occupant === null || opponents.length === 0}
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

      <DropDown.Item
        onClick={() => handleWin("詐糊", null)}
        className="text-negative"
      >
        詐糊 (False Win)
      </DropDown.Item>
    </DropDown>
  );
}
