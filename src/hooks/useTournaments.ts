"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTournaments } from "@/actions/tournaments";
import type { Tournament } from "@/lib/types";

type UseTournamentsReturn = {
  tournaments: Tournament[];
  isLoading: boolean;
  isError: boolean;
};

export function useTournaments(): UseTournamentsReturn {
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
