"use server";

import { createSession } from "@/actions/sessions";
import { createClient } from "@/lib/supabase/server";
import type { ScoringRule } from "@/lib/types";

export async function createTournament(
  tournamentName: string,
  scoringRules: ScoringRule[],
): Promise<void> {
  const supabase = await createClient();

  const { data: createdTournament, error } = await supabase
    .from("tournaments")
    .insert({ name: tournamentName, scoring_rules: scoringRules })
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
