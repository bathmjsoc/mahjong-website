"use server";

import { createSession } from "@/actions/sessions";
import type { Tables } from "@/lib/database.types";
import { createClient } from "@/lib/supabase/server";
import type { ScoringRule, Tournament } from "@/lib/types";

export async function createTournament(
  tournamentName: string,
  scoringRules: ScoringRule[],
): Promise<void> {
  const supabase = await createClient();

  const { data: tournament, error } = await supabase
    .from("tournaments")
    .insert({ name: tournamentName, scoring_rules: scoringRules })
    .select("id")
    .single();

  if (error)
    throw new Error(`createTournament encountered an error: ${error?.message}`);

  await createSession(tournament.id, 1); // Create the first session automatically
}

// Supabase stores `scoring_rules` as jsonb so we need to override it with the correct type
type TournamentRow = Omit<Tables<"tournaments">, "scoring_rules"> & {
  scoring_rules: ScoringRule[];
};

export async function fetchTournaments(): Promise<Tournament[]> {
  const supabase = await createClient();

  const { data: tournaments, error } = await supabase
    .from("tournaments")
    .select("*")
    .order("last_updated", { ascending: false })
    .overrideTypes<TournamentRow[]>(); // Not ideal, but otherwise the typing breaks :(

  if (error)
    throw new Error(`fetchTournaments encountered an error: ${error?.message}`);

  return tournaments ?? [];
}

export async function getTournamentName(tournamentId: string): Promise<string> {
  const supabase = await createClient();

  const { data: tournament, error } = await supabase
    .from("tournaments")
    .select("name")
    .eq("id", tournamentId)
    .single();

  if (error)
    throw new Error(
      `getTournamentName encountered an error: ${error?.message}`,
    );

  return tournament.name;
}
