import { useQueryClient } from "@tanstack/react-query";
import { Shuffle } from "lucide-react";
import type { TransitionStartFunction } from "react";
import { createTables, deleteTables } from "@/actions/tables";
import { FilledButton } from "@/elements/FilledButton";
import { useAttendance } from "@/hooks/attendance/useAttendance";
import type { Player, Table } from "@/lib/types";
import { shuffle } from "@/lib/utils";
import { useSessionContext } from "@/providers/SessionProvider";

type ShuffleButtonProps = {
  isShaking: boolean;
  startTransition: TransitionStartFunction;
  players: Player[];
  tables: Table[];
};

export function ShuffleButton({
  isShaking,
  startTransition,
  players,
  tables,
}: ShuffleButtonProps) {
  const queryClient = useQueryClient();
  const sessionId = useSessionContext();

  const { lockedPlayerIds, registeredPlayerIds } = useAttendance();

  function handleShuffle() {
    const availableTables = tables.filter((table) => !table.saved);
    const availablePlayers = players.filter(
      (player) =>
        registeredPlayerIds.has(player.id) && !lockedPlayerIds.has(player.id),
    );

    startTransition(async () => {
      const shuffledPlayers = shuffle(availablePlayers);
      const newTables: Table[] = [];

      while (shuffledPlayers.length > 0) {
        const [east = null, south = null, west = null, north = null] =
          shuffledPlayers.splice(0, 4);

        newTables.push({
          id: crypto.randomUUID(),
          session_id: sessionId,
          east_id: east?.id ?? null,
          south_id: south?.id ?? null,
          west_id: west?.id ?? null,
          north_id: north?.id ?? null,
          number: newTables.length + 1,
          saved: false,
        });
      }

      await deleteTables(availableTables);
      await createTables(newTables);
      await queryClient.invalidateQueries({
        queryKey: ["tables", sessionId],
      });
    });
  }

  return (
    <FilledButton
      onClick={handleShuffle}
      disabled={isShaking}
      className="rounded-full bg-primary p-3"
      title="Shuffle Tables"
    >
      <Shuffle className="size-6" />
    </FilledButton>
  );
}
