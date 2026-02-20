"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase_server";
import type { Tournament } from "@/lib/types";

export async function fetchTournaments(): Promise<Tournament[]> {
  const supabase = await supabaseServer();
  const { data } = await supabase
    .from("tournaments")
    .select("*")
    .order("last_updated", { ascending: false });

  return data ?? [];
}

export async function createTournament(tournamentName: string) {
  const supabase = await supabaseServer();
  await supabase.from("tournaments").insert({
    name: tournamentName,
  });

  revalidatePath("/dashboard");
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
