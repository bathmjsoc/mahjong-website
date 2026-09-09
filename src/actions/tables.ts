"use server";

import { createClient } from "@/lib/supabase/server";
import type { Player, Table, Wind } from "@/lib/types";
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
  seats: Partial<Record<Wind, Player | null>>,
): Promise<void> {
  const supabase = await createClient();

  const payload: Partial<Table> = {};
  if ("east" in seats) payload.east_id = seats.east?.id ?? null;
  if ("south" in seats) payload.south_id = seats.south?.id ?? null;
  if ("west" in seats) payload.west_id = seats.west?.id ?? null;
  if ("north" in seats) payload.north_id = seats.north?.id ?? null;

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
  sessionId: string,
  tables: Table[],
  players: Player[],
): Promise<void> {
  const supabase = await createClient();

  await deleteTables(...tables);

  const shuffledPlayers = shuffle(players);
  const tablesToCreate = [];

  while (shuffledPlayers.length > 0) {
    const [east = null, south = null, west = null, north = null] =
      shuffledPlayers.splice(0, 4);

    tablesToCreate.push({
      id: crypto.randomUUID(),
      session_id: sessionId,
      east_id: east?.id ?? null,
      south_id: south?.id ?? null,
      west_id: west?.id ?? null,
      north_id: north?.id ?? null,
      number: tablesToCreate.length + 1,
      saved: false,
    });
  }

  const { error } = await supabase.from("tables").insert(tablesToCreate);

  if (error)
    throw new Error(`shuffleTables encountered an error: ${error.message}`);
}

export async function deleteTable(table: Table): Promise<void> {
  return deleteTables(table);
}

export async function deleteTables(...tables: Table[]): Promise<void> {
  const supabase = await createClient();

  const tableIds = tables.map((table) => table.id);
  if (tableIds.length === 0) return;

  const { error } = await supabase.from("tables").delete().in("id", tableIds);

  if (error)
    throw new Error(`deleteTables encountered an error: ${error.message}`);
}
