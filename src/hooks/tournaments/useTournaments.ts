import { useSuspenseQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { SupabaseTournament, Tournament } from "@/lib/types";

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
  const tournaments = rawTournaments.sort((a, b) =>
    a.last_updated.localeCompare(b.last_updated),
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
