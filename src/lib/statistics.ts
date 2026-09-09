import { getPointDeltas } from "@/lib/scoring";
import type { Log, Player, ScoringRulesMap } from "@/lib/types";
import { avg, stdDev } from "@/lib/utils";

type Statistic = {
  value: number;
  ranking: number;
};

export function calculateGameStatistics(
  logs: Log[],
  players: Player[],
  player: Player,
): Record<string, Statistic> {
  const gamesPlayed: Record<string, number> = Object.fromEntries(
    players.map((player) => [player.id, 0]),
  );

  for (const log of logs) {
    for (const playerId of [
      ...log.winner_ids,
      ...log.loser_ids,
      ...log.other_ids,
    ]) {
      gamesPlayed[playerId]++;
    }
  }

  const currentGamesPlayed = gamesPlayed[player.id];
  const allGamesPlayed = players.map((player) => gamesPlayed[player.id]);

  const gamesPlayedRank =
    allGamesPlayed.filter((games) => {
      return games > currentGamesPlayed;
    }).length + 1;

  return {
    games_played: {
      value: currentGamesPlayed,
      ranking: gamesPlayedRank,
    },
  };
}

export function calculatePointStatistics(
  logs: Log[],
  players: Player[],
  player: Player,
  scoringRulesMap: ScoringRulesMap,
): Record<string, Statistic> {
  const pointsWon: Record<string, number[]> = Object.fromEntries(
    players.map((player) => [player.id, []]),
  );
  const pointsLost: Record<string, number[]> = Object.fromEntries(
    players.map((player) => [player.id, []]),
  );

  for (const log of logs) {
    const delta = getPointDeltas(log.faan, log.win_type, scoringRulesMap);

    for (const playerId of log.winner_ids) {
      pointsWon[playerId]?.push(delta.winner);
    }

    for (const playerId of log.loser_ids) {
      pointsLost[playerId]?.push(delta.loser);
    }
  }

  const currentMetrics = (() => {
    const won = pointsWon[player.id];
    const lost = pointsLost[player.id];

    return {
      averagePointsWon: avg(won),
      averagePointsLost: avg(lost),
      standardDeviation: stdDev([...won, ...lost]),
    };
  })();

  const allMetrics = players.map((player) => {
    const won = pointsWon[player.id];
    const lost = pointsLost[player.id];

    return {
      averagePointsWon: avg(won),
      averagePointsLost: avg(lost),
      standardDeviation: stdDev([...won, ...lost]),
    };
  });

  const averagePointsWon = currentMetrics.averagePointsWon;
  const averagePointsWonRank =
    allMetrics.filter((metrics) => {
      return metrics.averagePointsWon > averagePointsWon;
    }).length + 1;

  const averagePointsLost = currentMetrics.averagePointsLost;
  const averagePointsLostRank =
    allMetrics.filter((metrics) => {
      return metrics.averagePointsLost < averagePointsLost;
    }).length + 1;

  const standardDeviation = currentMetrics.standardDeviation;
  const standardDeviationRank =
    allMetrics.filter((metrics) => {
      return metrics.standardDeviation < standardDeviation;
    }).length + 1;

  return {
    average_points_won: {
      value: averagePointsWon,
      ranking: averagePointsWonRank,
    },
    average_points_lost: {
      value: averagePointsLost,
      ranking: averagePointsLostRank,
    },
    standard_deviation: {
      value: standardDeviation,
      ranking: standardDeviationRank,
    },
  };
}

export function calculateSessionStatistics(
  sessionScores: Record<string, Record<string, number>>,
  players: Player[],
  player: Player,
): Record<string, Statistic> {
  const scoresByPlayer: Record<string, number[]> = Object.fromEntries(
    players.map((player) => [player.id, []]),
  );

  for (const session of Object.values(sessionScores)) {
    for (const [playerId, score] of Object.entries(session)) {
      if (scoresByPlayer[playerId]) {
        scoresByPlayer[playerId].push(score);
      }
    }
  }

  const currentScores = scoresByPlayer[player.id];
  const allScores = players.map((player) => scoresByPlayer[player.id]);

  const highestSessionScore =
    currentScores.length > 0 ? Math.max(...currentScores) : 0;
  const highestSessionScoreRank =
    allScores.filter((scores) => {
      return scores.length > 0 && Math.max(...scores) > highestSessionScore;
    }).length + 1;

  const lowestSessionScore =
    currentScores.length > 0 ? Math.min(...currentScores) : 0;
  const lowestSessionScoreRank =
    allScores.filter((scores) => {
      return scores.length > 0 && Math.min(...scores) < lowestSessionScore;
    }).length + 1;

  return {
    highest_session_score: {
      value: highestSessionScore,
      ranking: highestSessionScoreRank,
    },
    lowest_session_score: {
      value: lowestSessionScore,
      ranking: lowestSessionScoreRank,
    },
  };
}

export function calculateRankingStatistics(
  player: Player,
  players: Player[],
  overallScores: Record<string, number>,
  sessionScores: Record<string, Record<string, number>>,
  sessionId: string,
): Record<string, Statistic> {
  const previousScores: Record<string, number> = Object.fromEntries(
    players.map((player) => [player.id, 0]),
  );

  for (const [id, scores] of Object.entries(sessionScores)) {
    if (id === sessionId) continue;

    for (const [playerId, score] of Object.entries(scores)) {
      previousScores[playerId] += score;
    }
  }

  const currentScore = overallScores[player.id] ?? 0;
  const allCurrentScores = players.map(
    (player) => overallScores[player.id] ?? 0,
  );

  const currentStandingRank =
    allCurrentScores.filter((score) => {
      return score > currentScore;
    }).length + 1;

  const previousScore = previousScores[player.id] ?? 0;
  const allPreviousScores = players.map(
    (player) => previousScores[player.id] ?? 0,
  );

  const previousStandingRank =
    allPreviousScores.filter((score) => {
      return score > previousScore;
    }).length + 1;

  return {
    current_standing: {
      value: currentScore,
      ranking: currentStandingRank,
    },
    previous_standing: {
      value: previousScore,
      ranking: previousStandingRank,
    },
  };
}
