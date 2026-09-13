"use server";

import { createSession } from "@/actions/sessions";
import { createClient } from "@/lib/supabase/server";
import type { Tournament } from "@/lib/types";

export async function createTournament(tournament: Tournament): Promise<void> {
  const { user_id, ...tournamentData } = tournament; // Extract the user_id so that Supabase uses auth.uid()

  const supabase = await createClient();
  await supabase.from("tournaments").insert(tournamentData).throwOnError();

  await createSession({
    id: crypto.randomUUID(),
    tournament_id: tournament.id,
    number: 1,
    start_date: new Date().toISOString().slice(0, 10),
  });
}

export async function updateTournament(tournament: Tournament): Promise<void> {
  const supabase = await createClient();
  await supabase
    .from("tournaments")
    .update(tournament)
    .eq("id", tournament.id)
    .throwOnError();
}
