"use server";

import { supabaseServer } from "@/lib/supabase_server";
import type { Player, Session } from "@/lib/types";

export async function createSession(tournamentId: string): Promise<void> {
  const supabase = await supabaseServer();

  const { data, error: fetchError } = await supabase
    .from("sessions")
    .select("number")
    .eq("tournament_id", tournamentId)
    .order("number", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (fetchError)
    throw new Error(
      `createSession encountered an error while fetching: ${fetchError.message}`,
    );

  const autoincrementNumber = data ? data.number + 1 : 1;

  const { error: insertError } = await supabase.from("sessions").insert({
    tournament_id: tournamentId,
    number: autoincrementNumber,
  });

  if (insertError)
    throw new Error(
      `createSession encountered an error while inserting: ${insertError.message}`,
    );
}

export async function fetchSessions(tournamentId: string): Promise<Session[]> {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("tournament_id", tournamentId)
    .order("number", { ascending: true });

  if (error)
    throw new Error(`fetchSessions encountered an error: ${error.message}`);

  return data ?? [];
}

export async function getPlayersFromSession(
  session: Session,
  tournamentId: string,
): Promise<Player[]> {
  const supabase = await supabaseServer();

  // Return all players from the tournament
  if (session.number === -1) {
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .eq("tournament_id", tournamentId);

    if (error)
      throw new Error(
        `getPlayersFromSession encountered an error: ${error.message}`,
      );

    return data ?? [];
  }

  // Return all players from the given session
  const { data, error } = await supabase
    .from("attendance")
    .select("player:players(*)")
    .eq("session_id", session.id)
    .overrideTypes<{ player: Player }[]>();

  if (error)
    throw new Error(
      `getPlayersFromSession encountered an error: ${error.message}`,
    );

  return data?.map((row) => row.player) ?? [];
}
