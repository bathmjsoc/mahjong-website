"use server";

import { supabaseServer } from "@/lib/supabase_server";
import type { Player } from "@/lib/types";

export async function fetchPlayers(tournamentId: string): Promise<Player[]> {
  const supabase = await supabaseServer();
  const { data } = await supabase
    .from("players")
    .select("*")
    .eq("tournament_id", tournamentId)
    .order("name", { ascending: true });

  return data ?? [];
}

export async function registerPlayer(player: Player): Promise<void> {
  const supabase = await supabaseServer();
  await supabase
    .from("players")
    .update({ is_registered: true })
    .eq("id", player.id);
}

export async function deregisterPlayer(player: Player): Promise<void> {
  const supabase = await supabaseServer();
  await supabase
    .from("players")
    .update({ is_registered: false })
    .eq("id", player.id);
}

export async function lockPlayer(player: Player): Promise<void> {
  const supabase = await supabaseServer();
  await supabase
    .from("players")
    .update({ is_locked: true })
    .eq("id", player.id);
}

export async function unlockPlayer(player: Player): Promise<void> {
  const supabase = await supabaseServer();
  await supabase
    .from("players")
    .update({ is_locked: false })
    .eq("id", player.id);
}

export async function deregisterAllPlayers(tournamentId: string) {
  const supabase = await supabaseServer();
  await supabase
    .from("players")
    .update({ is_registered: false })
    .eq("tournament_id", tournamentId);
}

export async function createPlayer(
  tournamentId: string,
  playerName: string,
): Promise<void> {
  const supabase = await supabaseServer();
  await supabase.from("players").insert({
    tournament_id: tournamentId,
    name: playerName,
  });
}

export async function deletePlayer(player: Player): Promise<void> {
  const supabase = await supabaseServer();
  await supabase.from("players").delete().eq("id", player.id);
}
