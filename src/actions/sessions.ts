"use server";

import type { Session } from "@/lib/types";
import { supabaseServer } from "@/lib/supabase_server";

export async function fetchSessions(tournamentId: string): Promise<Session[]> {
  const supabase = await supabaseServer();
  const { data } = await supabase
    .from("sessions")
    .select("*")
    .eq("tournament_id", tournamentId)
    .order("id", { ascending: true });

  return data ?? [];
}
