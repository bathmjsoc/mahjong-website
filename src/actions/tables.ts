"use server";

import { SEATS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import type { Player, Session, Table, Wind } from "@/lib/types";
import { shuffle } from "@/lib/utils";

export async function createTable(
  session: Session,
  tableNumber: number,
): Promise<Table> {
  const supabase = await createClient();

  const { data: table, error } = await supabase
    .from("tables")
    .insert({
      session_id: session.id,
      number: tableNumber,
    })
    .select()
    .single();

  if (error)
    throw new Error(`createTable encountered an error: ${error.message}`);

  return table;
}

export async function fetchTables(session: Session): Promise<Table[]> {
  const supabase = await createClient();

  const { data: tables, error } = await supabase
    .from("tables")
    .select("*")
    .eq("session_id", session.id)
    .order("saved", { ascending: true })
    .order("number", { ascending: true });

  if (error)
    throw new Error(`fetchTables encountered an error: ${error.message}`);

  return tables ?? [];
}

export async function updateTable(
  table: Table,
  players: Partial<Record<Wind, Player | null>>,
): Promise<void> {
  const supabase = await createClient();

  const payload: Partial<Record<`${Wind}_id`, string | null>> = {};
  for (const wind of SEATS) {
    if (wind in players) {
      payload[`${wind}_id`] = players[wind]?.id ?? null;
    }
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

  const { id, ...tableData } = table;
  const { error } = await supabase.from("tables").insert({
    ...tableData,
    saved: true,
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
  const neededTables = Math.floor(shuffledPlayers.length / 4);

  // Delete existing tables
  await Promise.all(availableTables.map(deleteTable));

  // Create required tables
  const tables = [];
  while (tables.length < neededTables) {
    tables.push(await createTable(session, tables.length + 1));
  }

  // Assign shuffled players to tables
  await Promise.all(
    tables.map((table) => {
      const [east = null, south = null, west = null, north = null] =
        shuffledPlayers.splice(0, 4);

      return updateTable(table, { east, south, west, north });
    }),
  );
}

export async function deleteTable(table: Table): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from("tables").delete().eq("id", table.id);

  if (error)
    throw new Error(`deleteTable encountered an error: ${error.message}`);
}
