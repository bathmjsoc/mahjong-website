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

export async function updateTable(
  table: Table,
  players: Partial<Record<Wind, Player | null>>,
): Promise<void> {
  const supabase = await supabaseServer();

  const payload: Partial<Record<WindKey, string | null>> = {};
  for (const wind in players) {
    const w = wind as Wind;
    payload[`${w}_id`] = players[w]?.id ?? null;
  }

  const { error } = await supabase
    .from("tables")
    .update(payload)
    .eq("id", table.id);

  if (error)
    throw new Error(`updateTable encountered an error: ${error.message}`);
}

export async function saveTable(table: Table): Promise<void> {
  const supabase = await supabaseServer();

  const { id, created_at, ...tableData } = table;
  const { error } = await supabase.from("tables").insert({
    ...tableData,
    is_saved: true,
  });

  if (error)
    throw new Error(`saveTable encountered an error: ${error.message}`);
}

export async function deleteTable(table: Table): Promise<void> {
  const supabase = await supabaseServer();

  const { error } = await supabase.from("tables").delete().eq("id", table.id);

  if (error)
    throw new Error(`deleteTable encountered an error: ${error.message}`);
}
