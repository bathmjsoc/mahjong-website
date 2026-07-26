import { useQuery } from "@tanstack/react-query";
import { fetchTournaments } from "@/actions/tournaments";
import { useTournamentContext } from "@/providers/TournamentProvider";
import type { ScoringRule, Tournament } from "@/types/app.types";

type UseCurrentTournamentType = {
  scoringRules: ScoringRule[];
  tournament: Tournament | null;
  isLoading: boolean;
  isError: boolean;
};

export function useCurrentTournament(): UseCurrentTournamentType {
  const { tournamentId } = useTournamentContext();

  const query = useQuery({
    queryKey: ["tournaments"],
    queryFn: fetchTournaments,
    select: (tournaments) => {
      const tournament =
        tournaments.find((tournament) => tournament.id === tournamentId) ??
        null;

      const scoringRules = tournament?.scoring_rules ?? [];

      return { scoringRules, tournament };
    },
  });

  return {
    scoringRules: query.data?.scoringRules ?? [],
    tournament: query.data?.tournament ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
