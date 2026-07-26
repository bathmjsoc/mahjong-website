import { twMerge } from "tailwind-merge";
import { createLog } from "@/actions/logs";
import { DropDown } from "@/elements/DropDown";
import { usePlayers } from "@/hooks/usePlayers";
import { useSessions } from "@/hooks/useSessions";
import { useTournaments } from "@/hooks/useTournaments";
import { useTournamentContext } from "@/providers/TournamentProvider";
import type {
  Player,
  PointsAnimationEvent,
  Table,
  WinType,
} from "@/types/app.types";

type WinSelectorProps = {
  table: Table;
  occupant: Player | null;
  className?: string;
};

export function WinSelector({ table, occupant, className }: WinSelectorProps) {
  const { playerMap } = usePlayers();
  const { currentSession } = useSessions();
  const { tournamentId } = useTournamentContext();
  const { tournamentsMap } = useTournaments();

  const tournament = tournamentsMap[tournamentId];
  const faanOptions = tournament?.scoring_rules?.map((rule) => rule.faan) ?? [];

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
      opponents.push(playerMap[id]);
    }
  }

  async function handleWin(
    winType: WinType,
    faan: number | null,
    target?: Player | null,
  ) {
    if (!currentSession || !occupant) return;

    const winners: Player[] = [];
    const losers: Player[] = [];
    const others: Player[] = [];

    switch (winType) {
      case "打出":
      case "包自摸":
        winners.push(occupant);
        if (target) losers.push(target);

        for (const player of opponents) {
          if (player.id !== target?.id) {
            others.push(player);
          }
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

    await createLog(
      tournamentId,
      currentSession,
      faan,
      winType,
      winners,
      losers,
      others,
    );

    window.dispatchEvent(
      new CustomEvent<PointsAnimationEvent>(`points-animation-${table.id}`, {
        detail: { faan, winType, winners, losers, others },
      }),
    );
  }

  return (
    <DropDown
      title="食"
      buttonClassName={twMerge("rounded-full size-8", className)}
      tooltip="Record Win"
      disabled={!occupant}
    >
      <DropDown title="打出 (Throw)">
        {opponents.map((player) => (
          <DropDown key={player.id} title={player.name}>
            {faanOptions.map((faan) => (
              <DropDown.Item
                key={faan}
                onClick={() => handleWin("打出", faan, player)}
              >
                {faan}
              </DropDown.Item>
            ))}
          </DropDown>
        ))}
      </DropDown>

      <DropDown title="自摸 (Self-Draw)">
        {faanOptions.map((faan) => (
          <DropDown.Item key={faan} onClick={() => handleWin("自摸", faan)}>
            {faan}
          </DropDown.Item>
        ))}
      </DropDown>

      <DropDown title="包自摸 (Special Case)">
        {opponents.map((player) => (
          <DropDown key={player.id} title={player.name}>
            {faanOptions.map((faan) => (
              <DropDown.Item
                key={faan}
                onClick={() => handleWin("包自摸", faan, player)}
              >
                {faan}
              </DropDown.Item>
            ))}
          </DropDown>
        ))}
      </DropDown>

      <div className="border-primary border-t">
        <DropDown.Item
          onClick={() => handleWin("詐糊", null)}
          className="text-negative"
        >
          詐糊 (False Win)
        </DropDown.Item>
      </div>
    </DropDown>
  );
}
