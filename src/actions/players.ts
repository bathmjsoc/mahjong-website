"use server";

import { supabaseServer } from "@/lib/supabase_server";
import type { Player, Session } from "@/lib/types";

export async function createPlayer(
  tournamentId: string,
  playerName: string,
): Promise<void> {
  const supabase = await supabaseServer();

  const { error } = await supabase.from("players").insert({
    tournament_id: tournamentId,
    name: playerName,
  });

  if (error)
    throw new Error(`createPlayer encountered an error: ${error.message}`);
}

export async function fetchPlayers(tournamentId: string): Promise<Player[]> {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("tournament_id", tournamentId)
    .order("name", { ascending: true });

  if (error)
    throw new Error(`fetchPlayers encountered an error: ${error.message}`);

  return data ?? [];
}

export async function registerPlayer(
  session: Session,
  player: Player,
): Promise<void> {
  const supabase = await supabaseServer();

  const { error } = await supabase.from("attendance").upsert(
    {
      session_id: session.id,
      player_id: player.id,
      registered: true,
      locked: false,
    },
    { onConflict: "session_id, player_id" },
  );

  if (error)
    throw new Error(`registerPlayer encountered an error: ${error.message}`);
}

export async function deregisterPlayer(
  session: Session,
  player: Player,
): Promise<void> {
  const supabase = await supabaseServer();

  const { error } = await supabase
    .from("attendance")
    .update({ registered: false })
    .match({ session_id: session.id, player_id: player.id });

  if (error)
    throw new Error(`deregisterPlayer encountered an error: ${error.message}`);
}

export async function lockPlayer(
  session: Session,
  player: Player,
): Promise<void> {
  const supabase = await supabaseServer();

  const { error } = await supabase
    .from("attendance")
    .update({ locked: true })
    .match({ session_id: session.id, player_id: player.id });

  if (error)
    throw new Error(`lockPlayer encountered an error: ${error.message}`);
}

export async function unlockPlayer(
  session: Session,
  player: Player,
): Promise<void> {
  const supabase = await supabaseServer();

  const { error } = await supabase
    .from("attendance")
    .update({ locked: false })
    .match({ session_id: session.id, player_id: player.id });

  if (error)
    throw new Error(`unlockPlayer encountered an error: ${error.message}`);
}

export async function deletePlayer(player: Player): Promise<void> {
  const supabase = await supabaseServer();

  const { error } = await supabase.from("players").delete().eq("id", player.id);

  if (error)
    throw new Error(`deletePlayer encountered an error: ${error.message}`);
}
