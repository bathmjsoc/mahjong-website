"use server";

import { createSession } from "@/actions/sessions";
import { createClient } from "@/lib/supabase/server";
import type { ScoringRule, Tournament } from "@/types/app.types";
import type { Tables } from "@/types/database.types";

export async function createTournament(tournament: Tournament): Promise<void> {
  const supabase = await createClient();

  const { data: createdTournament, error } = await supabase
    .from("tournaments")
    .insert(tournament)
    .select("id")
    .single();

  if (error)
    throw new Error(`createTournament encountered an error: ${error?.message}`);

  const initialSession = {
    id: crypto.randomUUID(),
    tournament_id: createdTournament.id,
    number: 1,
    start_date: new Date().toISOString().slice(0, 10),
  };

  await createSession(initialSession);
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
