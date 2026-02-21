"use server";

import { supabaseServer } from "@/lib/supabase_server";
import type { Session } from "@/lib/types";

export async function createSession(tournamentId: string): Promise<void> {
  const supabase = await supabaseServer();

  const { data } = await supabase
    .from("sessions")
    .select("number")
    .eq("tournament_id", tournamentId)
    .order("number", { ascending: false })
    .limit(1)
    .single();

  const nextNumber = data ? data.number + 1 : 1; // Autoincrement number

  await supabase.from("sessions").insert({
    tournament_id: tournamentId,
    number: nextNumber,
  });
}

export async function fetchSessions(tournamentId: string): Promise<Session[]> {
  const supabase = await supabaseServer();
  const { data } = await supabase
    .from("sessions")
    .select("*")
    .eq("tournament_id", tournamentId)
    .order("number", { ascending: true });

  return data ?? [];
}
