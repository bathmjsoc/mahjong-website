import { useSuspenseQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import type { Tables } from "@/lib/database.types";
import { createClient } from "@/lib/supabase/client";
import type { ScoringRule, Tournament } from "@/lib/types";
import { useTournamentContext } from "@/providers/TournamentProvider";

type UseTournamentsType = {
  currentTournament: Tournament | null;
  scoringRules: ScoringRule[];
};

export function useTournaments(): UseTournamentsType {
  const { tournamentId } = useTournamentContext();

  const selectTournaments = useCallback(
    (rawTournaments: Tournament[]) => {
      const tournaments = [...rawTournaments];

      const currentTournament =
        tournaments.find((tournament) => tournament.id === tournamentId) ??
        null;

      const scoringRules = currentTournament?.scoring_rules ?? [];

      return { currentTournament, scoringRules };
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
  };
}

// Supabase stores `scoring_rules` as jsonb so we need to override it with the correct type
type TournamentRow = Omit<Tables<"tournaments">, "scoring_rules"> & {
  scoring_rules: ScoringRule[];
};

export async function fetchTournaments(): Promise<Tournament[]> {
  const supabase = createClient();

  const { data: tournaments, error } = await supabase
    .from("tournaments")
    .select("*")
    .order("last_updated", { ascending: false })
    .overrideTypes<TournamentRow[]>(); // Not ideal, but otherwise the typing breaks :(

  if (error)
    throw new Error(`fetchTournaments encountered an error: ${error.message}`);

  return tournaments ?? [];
}
