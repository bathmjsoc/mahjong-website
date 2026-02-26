"use server";

import { createClient } from "@/lib/supabase/server";
import type { Player, Session } from "@/lib/types";

export async function createSession(tournamentId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from("sessions").insert({
    tournament_id: tournamentId,
  });

  if (error)
    throw new Error(`createSession encountered an error: ${error.message}`);
}

export async function fetchSessions(tournamentId: string): Promise<Session[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("tournament_id", tournamentId)
    .order("start_date", { ascending: true });

  if (error)
    throw new Error(`fetchSessions encountered an error: ${error.message}`);

  return (
    data?.map((session, index) => ({
      ...session,
      number: index + 1,
    })) ?? []
  );
}

export async function getPlayersFromSession(
  session: Session,
  tournamentId: string,
): Promise<Player[]> {
  const supabase = await createClient();

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

    //

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
