"use server";

import { supabaseServer } from "@/lib/supabase_server";
import type { Tournament } from "@/lib/types";

export async function createTournament(tournamentName: string): Promise<void> {
  const supabase = await supabaseServer();
  await supabase.from("tournaments").insert({
    name: tournamentName,
  });
}

export async function fetchTournaments(): Promise<Tournament[]> {
  const supabase = await supabaseServer();
  const { data } = await supabase
    .from("tournaments")
    .select("*")
    .order("last_updated", { ascending: false });

  if (!data) return [];

  // Convert last_updated field to Date object
  return data.map((tournament) => ({
    ...tournament,
    last_updated: new Date(tournament.last_updated),
  }));
}

export async function getTournamentName(tournamentId: string): Promise<string> {
  const supabase = await supabaseServer();
  const { data } = await supabase
    .from("tournaments")
    .select("name")
    .eq("id", tournamentId)
    .single();

  return data?.name ?? null;
}

export async function getPlayerCount(tournamentId: string): Promise<number> {
  const supabase = await supabaseServer();
  const { count } = await supabase
    .from("players")
    .select("*", { count: "exact", head: true })
    .eq("tournament_id", tournamentId);

  return count ?? 0;
}
