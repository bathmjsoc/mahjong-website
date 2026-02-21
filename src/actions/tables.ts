"use server";

import { supabaseServer } from "@/lib/supabase_server";
import type { Player, Table, Wind, WindKey } from "@/lib/types";

export async function createTable(tournamentId: string): Promise<void> {
  const supabase = await supabaseServer();
  await supabase.from("tables").insert({
    tournament_id: tournamentId,
  });
}

export async function fetchTables(tournamentId: string): Promise<Table[]> {
  const supabase = await supabaseServer();
  const { data } = await supabase
    .from("tables")
    .select("*")
    .eq("tournament_id", tournamentId)
    .order("created_at", { ascending: true });

  return data ?? [];
}

export async function updateOccupant(
  table: Table,
  wind: Wind,
  player: Player,
): Promise<void> {
  const supabase = await supabaseServer();
  await supabase
    .from("tables")
    .update({ [`${wind}_id` as WindKey]: player.id })
    .eq("id", table.id);
}

export async function deleteTable(table: Table): Promise<void> {
  const supabase = await supabaseServer();
  await supabase.from("tables").delete().eq("id", table.id);
}
