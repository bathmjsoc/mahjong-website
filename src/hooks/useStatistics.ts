import { useLogs } from "@/hooks/logs/useLogs";
import { useTournaments } from "@/hooks/tournaments/useTournaments";
import {
  calculateGameStatistics,
  calculatePointStatistics,
  calculateRankingStatistics,
  calculateSessionStatistics,
} from "@/lib/statistics";
import type { Log, Player } from "@/lib/types";
import { useSessionContext } from "@/providers/SessionProvider";

export function useStatistics() {
  const sessionId = useSessionContext();

  const { sessionScores, overallScores } = useLogs();
  const { scoringRulesMap } = useTournaments();

  return {
    calculateGameStatistics: (
      logs: Log[],
      players: Player[],
      player: Player,
    ) => {
      return calculateGameStatistics(logs, players, player);
    },

    calculatePointStatistics: (
      logs: Log[],
      players: Player[],
      player: Player,
    ) => {
      return calculatePointStatistics(logs, players, player, scoringRulesMap);
    },

    calculateSessionStatistics: (players: Player[], player: Player) => {
      return calculateSessionStatistics(sessionScores, players, player);
    },

    calculateRankingStatistics: (players: Player[], player: Player) => {
      return calculateRankingStatistics(
        player,
        players,
        overallScores,
        sessionScores,
        sessionId,
      );
    },
  };
}
