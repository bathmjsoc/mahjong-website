"use server";

import { createClient } from "@/lib/supabase/server";
import type { Session } from "@/lib/types";

export async function createSession(tournamentId: string): Promise<void> {
  const supabase = await createClient();

  const { data: session, error: fetchError } = await supabase
    .from("sessions")
    .select("number")
    .eq("tournament_id", tournamentId)
    .order("number", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (fetchError)
    throw new Error(
      `createSession encountered an error: ${fetchError.message}`,
    );

  const nextNumber = session ? session.number + 1 : 1;

  const { error: insertError } = await supabase.from("sessions").insert({
    tournament_id: tournamentId,
    number: nextNumber,
  });

  if (insertError)
    throw new Error(
      `createSession encountered an error: ${insertError.message}`,
    );
}

export async function fetchSessions(tournamentId: string): Promise<Session[]> {
  const supabase = await createClient();

  const { data: sessions, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("tournament_id", tournamentId)
    .order("start_date", { ascending: true });

  if (error)
    throw new Error(`fetchSessions encountered an error: ${error.message}`);

  return sessions ?? [];
}
