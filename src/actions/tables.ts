"use server";

import { createClient } from "@/lib/supabase/server";
import type { Player, Session, Table, Wind } from "@/lib/types";
import { shuffle } from "@/lib/utils";

export async function createTable(session: Session): Promise<Table> {
  const supabase = await createClient();

  const { data: latestTable, error: fetchError } = await supabase
    .from("tables")
    .select("number")
    .eq("session_id", session.id)
    .order("number", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (fetchError)
    throw new Error(`createTable encountered an error: ${fetchError.message}`);

  const nextNumber = latestTable ? latestTable.number + 1 : 1;

  const { data: newTable, error: insertError } = await supabase
    .from("tables")
    .insert({
      session_id: session.id,
      number: nextNumber,
    })
    .select()
    .single();

  if (insertError)
    throw new Error(`createTable encountered an error: ${insertError.message}`);

  return newTable;
}

export async function fetchTables(session: Session): Promise<Table[]> {
  if (!session) return [];

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

  const payload: Record<string, string | null> = {};
  Object.entries(players).forEach(([wind, player]) => {
    payload[`${wind}_id`] = player?.id ?? null;
  });

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
  const neededTables = Math.floor(availablePlayers.length / 4);

  if (availableTables.length > neededTables) {
    const tablesToDelete = availableTables.splice(neededTables);
    await Promise.all(tablesToDelete.map(deleteTable));
  }

  while (availableTables.length < neededTables) {
    const tableToCreate = await createTable(session);
    availableTables.push(tableToCreate);
  }

  const updatePromises = availableTables.map((table) => {
    const [east = null, south = null, west = null, north = null] =
      shuffledPlayers.splice(0, 4);

    return updateTable(table, { east, south, west, north });
  });

  await Promise.all(updatePromises);
}

export async function deleteTable(table: Table): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from("tables").delete().eq("id", table.id);

  if (error)
    throw new Error(`deleteTable encountered an error: ${error.message}`);
}
