"use server";

import { supabaseServer } from "@/lib/supabase_server";
import type { Player, Table, Wind } from "@/lib/types";

const windToKey = {
  east: "east_id",
  south: "south_id",
  west: "west_id",
  north: "north_id",
} as const;

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
    .update({ [windToKey[wind]]: player.id })
    .eq("id", table.id);
}

export async function createTable(tournamentId: string): Promise<void> {
  const supabase = await supabaseServer();
  await supabase.from("tables").insert({
    tournament_id: tournamentId,
  });
}

export async function deleteTable(table: Table): Promise<void> {
  const supabase = await supabaseServer();
  await supabase.from("tables").delete().eq("id", table.id);
}
