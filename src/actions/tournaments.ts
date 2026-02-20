"use server";

import type { Tournament } from "@/lib/types";
import { createClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function fetchTournaments(): Promise<Tournament[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tournaments")
    .select("*")
    .order("last_updated", { ascending: false });

  return data ?? [];
}

export async function createTournament(tournamentName: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from("tournaments").insert({
    name: tournamentName,
  });

  revalidatePath("/dashboard");
}

export async function getTournamentName(uuid: string): Promise<string> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tournaments")
    .select("name")
    .eq("id", uuid)
    .single();

  return data?.name ?? null;
}
