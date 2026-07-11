import { useQuery } from "@tanstack/react-query";
import { fetchTournaments } from "@/actions/tournaments";
import type { Tournament } from "@/lib/types";

type UseTournamentsType = {
  tournaments: Tournament[];
  isLoading: boolean;
  isError: boolean;
};

export function useTournaments(): UseTournamentsType {
  const queryKey = ["tournaments"];

  const query = useQuery({
    queryKey,
    queryFn: () => fetchTournaments(),
  });

  return {
    tournaments: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
