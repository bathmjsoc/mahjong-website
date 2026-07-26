import { useQuery } from "@tanstack/react-query";
import { fetchTournaments } from "@/actions/tournaments";
import type { Tournament } from "@/types/app.types";

type UseTournamentsType = {
  tournaments: Tournament[];
  isLoading: boolean;
  isError: boolean;
};

export function useTournaments(): UseTournamentsType {
  const query = useQuery({
    queryKey: ["tournaments"],
    queryFn: fetchTournaments,
    select: (tournaments) => {
      tournaments.sort(
        (a, b) =>
          new Date(b.last_updated).getTime() -
          new Date(a.last_updated).getTime(),
      );

      return { tournaments };
    },
  });

  return {
    tournaments: query.data?.tournaments ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
