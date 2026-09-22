"use server";

import { createClient } from "@/lib/supabase/server";
import type { Player } from "@/lib/types";

export async function createPlayers(data: Player | Player[]): Promise<void> {
  const players = Array.isArray(data) ? data : [data];
  if (players.length === 0) return;

  const supabase = await createClient();
  await supabase.from("players").insert(players).throwOnError();
}

export async function updatePlayer(player: Player): Promise<void> {
  const supabase = await createClient();
  await supabase
    .from("players")
    .update(player)
    .eq("id", player.id)
    .throwOnError();
}
