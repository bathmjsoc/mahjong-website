"use server";

import { createClient } from "@/lib/supabase/server";
import type { Player, Session, Table, Wind, WindKey } from "@/lib/types";
import { shuffle } from "@/lib/utils";

export async function createTable(session: Session): Promise<Table> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tables")
    .insert({
      session_id: session.id,
    })
    .select()
    .single();

  if (error)
    throw new Error(`createTable encountered an error: ${error.message}`);

  return data;
}

export async function fetchTables(session: Session): Promise<Table[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tables")
    .select("*")
    .eq("session_id", session.id)
    .order("created_at", { ascending: true });

  if (error)
    throw new Error(`fetchTables encountered an error: ${error.message}`);

  return data ?? [];
}

export async function updateTable(
  table: Table,
  players: Partial<Record<Wind, Player | null>>,
): Promise<void> {
  const supabase = await createClient();

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
  const supabase = await createClient();

  const { id, created_at, ...tableData } = table;
  const { error } = await supabase.from("tables").insert({
    ...tableData,
    is_saved: true,
  });

  if (error)
    throw new Error(`saveTable encountered an error: ${error.message}`);
}

export async function shuffleTables(
  session: Session,
  availableTables: Table[],
  availablePlayers: Player[],
): Promise<void> {
  const shuffledPlayers = shuffle(availablePlayers);
  const neededTables = Math.ceil(availablePlayers.length / 4);

  while (availableTables.length > neededTables) {
    const tableToDelete = availableTables.pop();
    if (tableToDelete) await deleteTable(tableToDelete);
  }

  while (availableTables.length < neededTables) {
    const tableToCreate = await createTable(session);
    availableTables.push(tableToCreate);
  }

  for (const table of availableTables) {
    const [east = null, south = null, west = null, north = null] =
      shuffledPlayers.splice(0, 4);

    await updateTable(table, { east, south, west, north });
  }
}

export async function deleteTable(table: Table): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from("tables").delete().eq("id", table.id);

  if (error)
    throw new Error(`deleteTable encountered an error: ${error.message}`);
}
