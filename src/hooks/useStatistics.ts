import { useLogs } from "@/hooks/logs/useLogs";
import { usePlayers } from "@/hooks/players/usePlayers";
import { useTournament } from "@/hooks/tournaments/useTournament";
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
  const { scoringRulesMap } = useTournament();

  return {
    calculateGameStatistics: (player: Player) => {
      return calculateGameStatistics(logs, players, player);
    },

    calculatePointStatistics: (player: Player) => {
      return calculatePointStatistics(logs, players, player, scoringRulesMap);
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
      return calculateSessionStatistics(sessionScores, players, player);
    },
  };
}
