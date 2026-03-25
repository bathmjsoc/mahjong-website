"use server";

import { createSession } from "@/actions/sessions";
import { createClient } from "@/lib/supabase/server";
import type { Tournament } from "@/lib/types";

export async function createTournament(tournamentName: string): Promise<void> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tournaments")
    .insert({ name: tournamentName })
    .select("id")
    .single();

  if (!data || error)
    throw new Error(`createTournament encountered an error: ${error?.message}`);

  await createSession(data.id);
}

export async function fetchTournaments(): Promise<Tournament[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tournaments")
    .select("*, players(id)")
    .order("last_updated", { ascending: false });

  if (error)
    throw new Error(`fetchTournaments encountered an error: ${error?.message}`);

  // Convert last_updated to Date object and calculate player_count
  return (
    data?.map((tournament) => ({
      ...tournament,
      last_updated: new Date(tournament.last_updated),
      player_count: tournament.players.length,
    })) ?? []
  );
}

export async function getTournamentName(tournamentId: string): Promise<string> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tournaments")
    .select("name")
    .eq("id", tournamentId)
    .single();

  if (!data || error)
    throw new Error(
      `getTournamentName encountered an error: ${error?.message}`,
    );

  return data.name;
}
