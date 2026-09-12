"use server";

import { createClient } from "@/lib/supabase/server";
import type { Table } from "@/lib/types";

export async function createTables(tables: Table[]): Promise<void> {
  if (tables.length === 0) return;

  const supabase = await createClient();
  const { error } = await supabase.from("tables").insert(tables);

  if (error) {
    throw new Error(`createTables encountered an error: ${error.message}`);
  }
}

export async function createTable(table: Table): Promise<void> {
  return createTables([table]);
}

export async function updateTable(table: Table): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("tables")
    .update(table)
    .eq("id", table.id);

  if (error) {
    throw new Error(`updateTable encountered an error: ${error.message}`);
  }
}

export async function deleteTables(tables: Table[]): Promise<void> {
  if (tables.length === 0) return;

  const supabase = await createClient();
  const { error } = await supabase
    .from("tables")
    .delete()
    .in(
      "id",
      tables.map((table) => table.id),
    );

  if (error) {
    throw new Error(`deleteTables encountered an error: ${error.message}`);
  }
}

export async function deleteTable(table: Table): Promise<void> {
  return deleteTables([table]);
}
