"use server";

import { createClient } from "@/lib/supabase/server";
import type { Player, Table, Wind } from "@/lib/types";

export async function createTables(...tables: Table[]): Promise<Table[]> {
  if (tables.length === 0) return [];

  const supabase = await createClient();
  const { data: createdTables, error } = await supabase
    .from("tables")
    .insert(tables)
    .select();

  if (error) {
    throw new Error(`createTables encountered an error: ${error.message}`);
  }

  return createdTables;
}

export async function createTable(table: Table): Promise<Table> {
  const [createdTable] = await createTables(table);
  return createdTable;
}

export async function updateTable(
  table: Table,
  seats: Partial<Record<Wind, Player | null>>,
): Promise<void> {
  const payload: Partial<Table> = {};
  if ("east" in seats) payload.east_id = seats.east?.id ?? null;
  if ("south" in seats) payload.south_id = seats.south?.id ?? null;
  if ("west" in seats) payload.west_id = seats.west?.id ?? null;
  if ("north" in seats) payload.north_id = seats.north?.id ?? null;

  const supabase = await createClient();
  const { error } = await supabase
    .from("tables")
    .update(payload)
    .eq("id", table.id);

  if (error) {
    throw new Error(`updateTable encountered an error: ${error.message}`);
  }
}

export async function saveTable(table: Table): Promise<void> {
  const { id, ...tableData } = table; // Extract the UUID so we insert rather than update

  const supabase = await createClient();
  const { error } = await supabase.from("tables").insert({
    ...tableData,
    saved: true,
  });

  if (error) {
    throw new Error(`saveTable encountered an error: ${error.message}`);
  }
}

export async function deleteTable(table: Table): Promise<void>;
export async function deleteTable(tables: Table[]): Promise<void>;
export async function deleteTable(input: Table | Table[]): Promise<void> {
  const tables = Array.isArray(input) ? input : [input];
  const tableIds = tables.map((table) => table.id);

  if (tableIds.length === 0) return;

  const supabase = await createClient();
  const { error } = await supabase.from("tables").delete().in("id", tableIds);

  if (error) {
    throw new Error(`deleteTables encountered an error: ${error.message}`);
  }
}
