"use server";

import { createClient } from "@/lib/supabase/server";
import type { Session, Tournament } from "@/types/app.types";

export async function createSession(
  tournament: Tournament,
  sessionNumber: number,
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from("sessions").insert({
    tournament_id: tournament.id,
    number: sessionNumber,
  });

  if (error)
    throw new Error(`createSession encountered an error: ${error.message}`);
}

export async function fetchSessions(
  tournament: Tournament,
): Promise<Session[]> {
  const supabase = await createClient();

  const { data: sessions, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("tournament_id", tournament.id);

  if (error)
    throw new Error(`fetchSessions encountered an error: ${error.message}`);

  return sessions ?? [];
}
