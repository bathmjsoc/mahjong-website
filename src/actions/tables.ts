"use server";

import { createClient } from "@/lib/supabase/server";
import type { Player, Session, Table, Wind } from "@/lib/types";
import { shuffle } from "@/lib/utils";

export async function createTable(table: Table): Promise<Table> {
  const supabase = await createClient();

  const { data: createdTable, error } = await supabase
    .from("tables")
    .insert(table)
    .select()
    .single();

  if (error)
    throw new Error(`createTable encountered an error: ${error.message}`);

  return createdTable;
}

export async function updateTable(
  table: Table,
  players: Partial<Record<Wind, Player | null>>,
): Promise<void> {
  const supabase = await createClient();

  const payload: Partial<Table> = {};
  if ("east" in players) payload.east_id = players.east?.id ?? null;
  if ("south" in players) payload.south_id = players.south?.id ?? null;
  if ("west" in players) payload.west_id = players.west?.id ?? null;
  if ("north" in players) payload.north_id = players.north?.id ?? null;

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
  const neededTables = Math.ceil(shuffledPlayers.length / 4);

  // Delete existing tables
  await Promise.all(availableTables.map(deleteTable));

  // Create new tables with available players
  const createPromises = [];
  while (createPromises.length < neededTables) {
    const [east = null, south = null, west = null, north = null] =
      shuffledPlayers.splice(0, 4);

    const table: Table = {
      id: crypto.randomUUID(),
      session_id: session.id,
      east_id: east?.id ?? null,
      south_id: south?.id ?? null,
      west_id: west?.id ?? null,
      north_id: north?.id ?? null,
      number: createPromises.length + 1,
      saved: false,
    };

    createPromises.push(createTable(table));
  }

  await Promise.all(createPromises);
}

export async function deleteTable(table: Table): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from("tables").delete().eq("id", table.id);

  if (error)
    throw new Error(`deleteTable encountered an error: ${error.message}`);
}
