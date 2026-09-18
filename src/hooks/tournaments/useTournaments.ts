import { useSuspenseQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type {
  ScoringRulesMap,
  SupabaseTournament,
  Tournament,
} from "@/lib/types";
import { useTournamentContext } from "@/providers/TournamentProvider";

type UseTournamentsType = {
  tournaments: Tournament[];
};

export function useTournaments(): UseTournamentsType {
  const query = useSuspenseQuery({
    queryKey: ["tournaments"],
    queryFn: fetchTournaments,
    select: selectTournaments,
  });

  return query.data;
}

function selectTournaments(rawTournaments: Tournament[]): UseTournamentsType {
  const tournaments = rawTournaments.toSorted((a, b) =>
    b.last_updated.localeCompare(a.last_updated),
  );

  return { tournaments };
}

async function fetchTournaments(): Promise<Tournament[]> {
  const supabase = createClient();
  const { data: tournaments } = await supabase
    .from("tournaments")
    .select("*")
    .overrideTypes<SupabaseTournament[], { merge: false }>()
    .throwOnError();

  return tournaments;
}

type UseCurrentTournamentType = {
  handTypes: string[];
  scoringRulesMap: ScoringRulesMap;
};

export function useCurrentTournament(): UseCurrentTournamentType {
  const tournamentId = useTournamentContext();

  const query = useSuspenseQuery({
    queryKey: ["tournaments"],
    queryFn: fetchTournaments,
    select: (tournaments) => selectCurrentTournament(tournaments, tournamentId),
  });

  return query.data;
}

function selectCurrentTournament(
  tournaments: Tournament[],
  tournamentId: string,
): UseCurrentTournamentType {
  const tournament = tournaments.find((t) => t.id === tournamentId);

  if (!tournament) {
    throw new Error(`Tournament ${tournamentId} not found`);
  }

  const handTypes = [...tournament.hand_types, "Other"];
  const scoringRulesMap = new Map(
    tournament.scoring_rules.map((rule) => [rule.faan, rule]),
  );

  return { handTypes, scoringRulesMap };
}
