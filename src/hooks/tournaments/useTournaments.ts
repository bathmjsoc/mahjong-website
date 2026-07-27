import { useSuspenseQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { fetchTournaments } from "@/actions/tournaments";
import type { ScoringRule, Tournament } from "@/lib/types";
import { useTournamentContext } from "@/providers/TournamentProvider";

type UseTournamentsType = {
  currentTournament: Tournament | null;
  scoringRules: ScoringRule[];
  tournaments: Tournament[];
};

export function useTournaments(): UseTournamentsType {
  const { tournamentId } = useTournamentContext();

  const selectTournaments = useCallback(
    (rawTournaments: Tournament[]) => {
      const tournaments = [...rawTournaments].sort(
        (a, b) =>
          new Date(b.last_updated).getTime() -
          new Date(a.last_updated).getTime(),
      );

      const currentTournament =
        tournaments.find((tournament) => tournament.id === tournamentId) ??
        null;

      const scoringRules = currentTournament?.scoring_rules ?? [];

      return { currentTournament, scoringRules, tournaments };
    },
    [tournamentId],
  );

  const query = useSuspenseQuery({
    queryKey: ["tournaments"],
    queryFn: fetchTournaments,
    select: selectTournaments,
  });

  return {
    currentTournament: query.data.currentTournament,
    scoringRules: query.data.scoringRules,
    tournaments: query.data.tournaments,
  };
}
