import { useLogs } from "@/hooks/logs/useLogs";
import { usePlayers } from "@/hooks/players/usePlayers";
import {
  calculateGameStatistics,
  calculatePointStatistics,
  calculateRankingStatistics,
  calculateSessionStatistics,
} from "@/lib/statistics";
import type { Player } from "@/lib/types";
import { useSessionContext } from "@/providers/SessionProvider";

export function useStatistics() {
  const sessionId = useSessionContext();

  const { logs, overallScores, sessionScores } = useLogs();
  const { players } = usePlayers();

  return {
    calculateGameStatistics: (player: Player) => {
      return calculateGameStatistics(player, players, logs);
    },

    calculatePointStatistics: (player: Player) => {
      return calculatePointStatistics(player, players, logs);
    },

    calculateRankingStatistics: (player: Player) => {
      return calculateRankingStatistics(
        player,
        players,
        overallScores,
        sessionScores,
        sessionId,
      );
    },

    calculateSessionStatistics: (player: Player) => {
      return calculateSessionStatistics(player, players, sessionScores);
    },
  };
}
