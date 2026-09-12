import { useSuspenseQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type {
  ScoringRulesMap,
  SupabaseTournament,
  Tournament,
} from "@/lib/types";
import { useTournamentContext } from "@/providers/TournamentProvider";

type UseTournamentsType = {
  scoringRulesMap: ScoringRulesMap;
  tournament: Tournament;
};

export function useTournament(): UseTournamentsType {
  const tournamentId = useTournamentContext();

  const query = useSuspenseQuery({
    queryKey: ["tournament", tournamentId],
    queryFn: () => fetchTournament(tournamentId),
    select: selectTournament,
  });

  return query.data;
}

function selectTournament(tournament: Tournament): UseTournamentsType {
  const scoringRulesMap = new Map(
    tournament.scoring_rules.map((rule) => [rule.faan, rule]),
  );

  return { scoringRulesMap, tournament };
}

async function fetchTournament(tournamentId: string): Promise<Tournament> {
  const supabase = createClient();

  const { data: tournament, error } = await supabase
    .from("tournaments")
    .select("*")
    .eq("id", tournamentId)
    .single()
    .overrideTypes<SupabaseTournament, { merge: false }>();

  if (error) {
    throw new Error(`fetchTournament encountered an error: ${error.message}`);
  }

  return tournament;
}
