import { useSuspenseQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type {
  ScoringRulesMap,
  SupabaseTournament,
  Tournament,
} from "@/lib/types";
import { useTournamentContext } from "@/providers/TournamentProvider";

type UseCurrentTournamentType = {
  scoringRulesMap: ScoringRulesMap;
  tournament: Tournament;
};

export function useCurrentTournament(): UseCurrentTournamentType {
  const tournamentId = useTournamentContext();

  const query = useSuspenseQuery({
    queryKey: ["tournament", tournamentId],
    queryFn: () => fetchCurrentTournament(tournamentId),
    select: selectCurrentTournament,
  });

  return query.data;
}

function selectCurrentTournament(
  tournament: Tournament,
): UseCurrentTournamentType {
  const scoringRulesMap = new Map(
    tournament.scoring_rules.map((rule) => [rule.faan, rule]),
  );

  return { scoringRulesMap, tournament };
}

async function fetchCurrentTournament(
  tournamentId: string,
): Promise<Tournament> {
  const supabase = createClient();
  const { data: currentTournament } = await supabase
    .from("tournaments")
    .select("*")
    .eq("id", tournamentId)
    .single()
    .overrideTypes<SupabaseTournament, { merge: false }>()
    .throwOnError();

  return currentTournament;
}
