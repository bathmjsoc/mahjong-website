import confetti from "canvas-confetti";
import { twMerge } from "tailwind-merge";
import { DropDown } from "@/elements/DropDown";
import { useLogMutations } from "@/hooks/logs/useLogMutations";
import { usePlayers } from "@/hooks/players/usePlayers";
import { useTournaments } from "@/hooks/tournaments/useTournaments";
import type { Player, PointsAnimationEvent, Table, WinType } from "@/lib/types";
import { useSessionContext } from "@/providers/SessionProvider";
import { useTournamentContext } from "@/providers/TournamentProvider";

type WinSelectorProps = {
  table: Table;
  occupant: Player | null;
  className?: string;
};

export function WinSelector({ table, occupant, className }: WinSelectorProps) {
  const sessionId = useSessionContext();
  const tournamentId = useTournamentContext();

  const { createLog } = useLogMutations();
  const { playerMap } = usePlayers();
  const { scoringRulesMap, tournament } = useTournaments();

  const faanOptions = Array.from(scoringRulesMap.keys()).filter(
    (key) => key !== null,
  );
  const maxFaan = Math.max(...faanOptions);

  const opponents: Player[] = [];
  if (occupant) {
    const SEAT_IDS = [
      table.east_id,
      table.south_id,
      table.west_id,
      table.north_id,
    ] as const;

    for (const id of SEAT_IDS) {
      if (!id || id === occupant.id) continue;

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
    if (!occupant) return;

    const winners: Player[] = [];
    const losers: Player[] = [];
    const others: Player[] = [];

    switch (winType) {
      case "打出":
      case "包自摸":
        winners.push(occupant);
        if (target) losers.push(target);

        for (const player of opponents) {
          if (player.id !== target?.id) others.push(player);
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

    createLog(
      tournamentId,
      sessionId,
      faan,
      winType,
      winners,
      losers,
      others,
      handType,
    );

    window.dispatchEvent(
      new CustomEvent<PointsAnimationEvent>(`points-animation-${table.id}`, {
        detail: { faan, winType, winners, losers, others },
      }),
    );

    if (faan === maxFaan) {
      triggerConfetti();
    }
  }

  function triggerConfetti() {
    confetti({
      particleCount: 500,
      spread: 360,
      shapes: [confetti.shapeFromText({ text: "🀄" })],
      scalar: 2,
    });
  }

  function getFaanOptions(winType: WinType, player: Player | null) {
    const handTypes = [...tournament.hand_types, "Other"];

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
      buttonClassName={twMerge("rounded-full size-8", className)}
      tooltip="Record Win"
      disabled={!occupant || !opponents.length}
    >
      <DropDown title="打出 (Throw)">
        {opponents.map((player) => (
          <DropDown key={player.id} title={player.name}>
            {getFaanOptions("打出", player)}
          </DropDown>
        ))}
      </DropDown>

      <DropDown title="自摸 (Self-Draw)">
        {getFaanOptions("自摸", null)}
      </DropDown>

      <DropDown title="包自摸 (Special Case)">
        {opponents.map((player) => (
          <DropDown key={player.id} title={player.name}>
            {getFaanOptions("包自摸", player)}
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
