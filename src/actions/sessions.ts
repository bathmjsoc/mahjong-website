"use server";

import { createClient } from "@/lib/supabase/server";
import type { Session } from "@/lib/types";

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
