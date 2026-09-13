"use server";

import { createClient } from "@/lib/supabase/server";
import type { Player } from "@/lib/types";

export async function createPlayer(player: Player): Promise<void> {
  const supabase = await createClient();
  await supabase.from("players").insert(player).throwOnError();
}

export async function updatePlayer(player: Player): Promise<void> {
  const supabase = await createClient();
  await supabase
    .from("players")
    .update(player)
    .eq("id", player.id)
    .throwOnError();
}
