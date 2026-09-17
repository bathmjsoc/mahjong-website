import { useSuspenseQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type {
  ScoringRulesMap,
  SupabaseTournament,
  Tournament,
} from "@/lib/types";
import { useTournamentContext } from "@/providers/TournamentProvider";

type UseCurrentTournamentType = {
  handTypes: string[];
  scoringRulesMap: ScoringRulesMap;
};

export function useCurrentTournament(): UseCurrentTournamentType {
  const tournamentId = useTournamentContext();

  const query = useSuspenseQuery({
    queryKey: ["tournaments", tournamentId],
    queryFn: () => fetchCurrentTournament(tournamentId),
    select: selectCurrentTournament,
  });

  return query.data;
}

function selectCurrentTournament(
  tournament: Tournament,
): UseCurrentTournamentType {
  const handTypes = [...tournament.hand_types, "Other"];
  const scoringRulesMap = new Map(
    tournament.scoring_rules.map((rule) => [rule.faan, rule]),
  );

  return { handTypes, scoringRulesMap };
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
