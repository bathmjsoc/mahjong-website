"use server";

import { createSession } from "@/actions/sessions";
import { createClient } from "@/lib/supabase/server";
import type { Tournament } from "@/lib/types";

export async function createTournament(tournament: Tournament): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated!");

  const { data: createdTournament, error } = await supabase
    .from("tournaments")
    .insert({
      ...tournament,
      user_id: user.id, // Replace the client-side dummy value with the true UUID
    })
    .select("id")
    .single();

  if (error)
    throw new Error(`createTournament encountered an error: ${error.message}`);

  const initialSession = {
    id: crypto.randomUUID(),
    tournament_id: createdTournament.id,
    number: 1,
    start_date: new Date().toISOString().slice(0, 10),
  };

  await createSession(initialSession);
}

export async function updateTournament(tournament: Tournament): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("tournaments")
    .update(tournament)
    .eq("id", tournament.id);

  if (error)
    throw new Error(`updateTournament encountered an error: ${error.message}`);
}
