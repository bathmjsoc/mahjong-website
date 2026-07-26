import { useQuery } from "@tanstack/react-query";
import { fetchTournaments } from "@/actions/tournaments";
import { useTournamentContext } from "@/providers/TournamentProvider";
import type { ScoringRule } from "@/types/app.types";

type UseCurrentTournamentType = {
  scoringRules: ScoringRule[];
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

      return { scoringRules };
    },
  });

  return {
    scoringRules: query.data?.scoringRules ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
