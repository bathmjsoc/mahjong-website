"use server";

import { createClient } from "@/lib/supabase/server";
import type { Table } from "@/lib/types";

export async function createTables(data: Table | Table[]): Promise<void> {
  const tables = Array.isArray(data) ? data : [data];
  if (tables.length === 0) return;

  const supabase = await createClient();
  await supabase.from("tables").insert(tables).throwOnError();
}

export async function updateTable(table: Table): Promise<void> {
  const supabase = await createClient();
  await supabase.from("tables").update(table).eq("id", table.id).throwOnError();
}

export async function deleteTables(data: Table | Table[]): Promise<void> {
  const tables = Array.isArray(data) ? data : [data];
  if (tables.length === 0) return;

  const supabase = await createClient();
  await supabase
    .from("tables")
    .delete()
    .in(
      "id",
      tables.map((table) => table.id),
    )
    .throwOnError();
}
