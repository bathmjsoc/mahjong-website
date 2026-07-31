import { useSuspenseQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { ScoringRule, SupabaseTournament, Tournament } from "@/lib/types";
import { useTournamentContext } from "@/providers/TournamentProvider";

type UseTournamentsType = {
  scoringRulesMap: Map<number | null, ScoringRule>;
};

export function useTournaments(): UseTournamentsType {
  const tournamentId = useTournamentContext();

  const query = useSuspenseQuery({
    queryKey: ["tournament", tournamentId],
    queryFn: () => fetchTournamentById(tournamentId),
    select: selectTournament,
  });

  return query.data;
}

function selectTournament(tournament: Tournament): UseTournamentsType {
  const scoringRulesMap = new Map(
    tournament.scoring_rules.map((rule) => [rule.faan, rule]),
  );

  return {
    scoringRulesMap,
  };
}

async function fetchTournamentById(tournamentId: string): Promise<Tournament> {
  const supabase = createClient();

  const { data: tournament, error } = await supabase
    .from("tournaments")
    .select("*")
    .eq("id", tournamentId)
    .single()
    .overrideTypes<SupabaseTournament>();

  if (error) {
    throw new Error(
      `fetchTournamentById encountered an error: ${error.message}`,
    );
  }

  return tournament;
}
