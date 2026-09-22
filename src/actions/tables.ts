"use server";

import { createClient } from "@/lib/supabase/server";
import type { Table } from "@/lib/types";

export async function createTables(tables: Table | Table[]): Promise<void> {
  const payload = Array.isArray(tables) ? tables : [tables];
  if (payload.length === 0) return;

  const supabase = await createClient();
  await supabase.from("tables").insert(payload).throwOnError();
}

export async function updateTable(table: Table): Promise<void> {
  const supabase = await createClient();
  await supabase.from("tables").update(table).eq("id", table.id).throwOnError();
}

export async function deleteTables(tables: Table | Table[]): Promise<void> {
  const payload = Array.isArray(tables) ? tables : [tables];
  if (payload.length === 0) return;

  const supabase = await createClient();
  await supabase
    .from("tables")
    .delete()
    .in(
      "id",
      payload.map((table) => table.id),
    )
    .throwOnError();
}
