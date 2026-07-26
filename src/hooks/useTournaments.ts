import { useQuery } from "@tanstack/react-query";
import { fetchTournaments } from "@/actions/tournaments";
import type { Tournament } from "@/lib/types";

type UseTournamentsType = {
  tournamentsMap: Record<string, Tournament>;
  tournaments: Tournament[];
  isLoading: boolean;
  isError: boolean;
};

export function useTournaments(): UseTournamentsType {
  const queryKey = ["tournaments"];

  const query = useQuery({
    queryKey,
    queryFn: fetchTournaments,
    select: (tournaments) => {
      tournaments.sort(
        (a, b) =>
          new Date(b.last_updated).getTime() -
          new Date(a.last_updated).getTime(),
      );

      const tournamentsMap = Object.fromEntries(
        tournaments.map((tournament) => [tournament.id, tournament]),
      );

      return { tournaments, tournamentsMap };
    },
  });

  return {
    tournamentsMap: query.data?.tournamentsMap ?? {},
    tournaments: query.data?.tournaments ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
