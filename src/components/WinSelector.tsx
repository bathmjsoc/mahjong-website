import { useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { createLog } from "@/actions/logs";
import { DropDown } from "@/elements/DropDown";
import { usePlayers } from "@/hooks/usePlayers";
import { useSessions } from "@/hooks/useSessions";
import { useTournaments } from "@/hooks/useTournaments";
import type { Player, PointsAnimationEvent, Table, WinType } from "@/lib/types";
import { useTournament } from "@/providers/TournamentProvider";

type WinSelectorProps = {
  table: Table;
  occupant: Player | null;
  className?: string;
};

export function WinSelector({ table, occupant, className }: WinSelectorProps) {
  const { playerMap } = usePlayers();
  const { currentSession } = useSessions();
  const { tournamentId } = useTournament();
  const { tournamentsMap } = useTournaments();

  const tournament = tournamentsMap[tournamentId];
  const faanOptions = tournament.scoring_rules.map((rule) => rule.faan);

  const opponents = useMemo(() => {
    if (!occupant) return [];

    const seatIds = [
      table.east_id,
      table.south_id,
      table.west_id,
      table.north_id,
    ];

    return seatIds
      .map((id) => (id ? (playerMap[id] ?? null) : null))
      .filter((player) => !player || player.id !== occupant.id);
  }, [table, playerMap, occupant]);

  async function handleWin(
    winType: WinType,
    faan: number = 0,
    target?: Player | null,
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

        opponents
          .filter((player) => player?.id !== target?.id)
          .forEach((player) => {
            if (player) others.push(player);
          });
        break;

      case "自摸":
        winners.push(occupant);

        opponents.forEach((player) => {
          if (player) losers.push(player);
        });
        break;

      case "詐糊":
        losers.push(occupant);

        opponents.forEach((player) => {
          if (player) winners.push(player);
        });
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
      disabled={!occupant}
    >
      <DropDown title="打出 (Throw)">
        {opponents.map((player, index) => (
          <DropDown
            key={player?.id ?? index}
            title={player?.name ?? "[EMPTY]"}
            disabled={!player}
          >
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
        {opponents.map((player, index) => (
          <DropDown
            key={player?.id ?? index}
            title={player?.name ?? "[EMPTY]"}
            disabled={!player}
          >
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
          onClick={() => handleWin("詐糊")}
          className="text-negative"
        >
          詐糊 (False Win)
        </DropDown.Item>
      </div>
    </DropDown>
  );
}
