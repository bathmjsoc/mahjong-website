"use server";

import { createClient } from "@/lib/supabase/server";
import type { Player } from "@/lib/types";

export async function createPlayers(players: Player | Player[]): Promise<void> {
  const payload = Array.isArray(players) ? players : [players];
  if (payload.length === 0) return;

  const supabase = await createClient();
  await supabase.from("players").insert(payload).throwOnError();
}

export async function updatePlayer(player: Player): Promise<void> {
  const supabase = await createClient();
  await supabase
    .from("players")
    .update(player)
    .eq("id", player.id)
    .throwOnError();
}
