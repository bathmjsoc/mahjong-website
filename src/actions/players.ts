"use server";

import { createClient } from "@/lib/supabase/server";
import type { Player, Tournament } from "@/types/app.types";

export async function createPlayer(
  tournament: Tournament,
  playerName: string,
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from("players").insert({
    tournament_id: tournament.id,
    name: playerName,
  });

  if (error)
    throw new Error(`createPlayer encountered an error: ${error.message}`);
}

export async function fetchPlayers(tournament: Tournament): Promise<Player[]> {
  const supabase = await createClient();

  const { data: players, error } = await supabase
    .from("players")
    .select("*")
    .eq("tournament_id", tournament.id);

  if (error)
    throw new Error(`fetchPlayers encountered an error: ${error.message}`);

  return players ?? [];
}

export async function updatePlayer(
  player: Player,
  newName: string,
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("players")
    .update({ name: newName })
    .eq("id", player.id);

  if (error)
    throw new Error(`updatePlayer encountered an error: ${error.message}`);
}

export async function deletePlayer(player: Player): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from("players").delete().eq("id", player.id);

  if (error)
    throw new Error(`deletePlayer encountered an error: ${error.message}`);
}
