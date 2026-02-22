"use server";

import { supabaseServer } from "@/lib/supabase_server";
import type { Player, Table, Wind, WindKey } from "@/lib/types";

export async function createTable(tournamentId: string): Promise<void> {
  const supabase = await supabaseServer();

  const { error } = await supabase.from("tables").insert({
    tournament_id: tournamentId,
  });

  if (error)
    throw new Error(`createTable encountered an error: ${error.message}`);
}

export async function fetchTables(tournamentId: string): Promise<Table[]> {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("tables")
    .select("*")
    .eq("tournament_id", tournamentId)
    .order("created_at", { ascending: true });

  if (error)
    throw new Error(`fetchTables encountered an error: ${error.message}`);

  return data ?? [];
}

export async function updateOccupant(
  table: Table,
  wind: Wind,
  player: Player,
): Promise<void> {
  const supabase = await supabaseServer();

  const seatKey: WindKey = `${wind}_id`;
  const { error } = await supabase
    .from("tables")
    .update({ [seatKey]: player.id })
    .eq("id", table.id);

  if (error)
    throw new Error(`updateOccupant encountered an error: ${error.message}`);
}

export async function deleteTable(table: Table): Promise<void> {
  const supabase = await supabaseServer();

  const { error } = await supabase.from("tables").delete().eq("id", table.id);

  if (error)
    throw new Error(`deleteTable encountered an error: ${error.message}`);
}
