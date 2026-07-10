"use server";

import { createClient } from "@/lib/supabase/server";
import type { Log, Player, Session, WinType } from "@/lib/types";

export async function createLog(
  session: Session,
  faan: number,
  winType: WinType,
  winners: Player[],
  losers: Player[],
  others: Player[],
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from("logs").insert({
    session_id: session.id,
    faan: faan,
    win_type: winType,
    winner_ids: winners.map((player) => player.id),
    loser_ids: losers.map((player) => player.id),
    other_ids: others.map((player) => player.id),
  });

  if (error)
    throw new Error(`createLog encountered an error: ${error.message}`);
}

export async function fetchLogs(sessions: Session[]): Promise<Log[]> {
  if (sessions.length === 0) return [];

  const supabase = await createClient();

  const { data: logs, error } = await supabase
    .from("logs")
    .select("*")
    .in(
      "session_id",
      sessions.map((session) => session.id),
    )
    .order("timestamp", { ascending: false });

  if (error)
    throw new Error(`fetchLogs encountered an error: ${error.message}`);

  return logs ?? [];
}

export async function disableLog(log: Log): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("logs")
    .update({ disabled: true })
    .eq("id", log.id);

  if (error)
    throw new Error(`disableLog encountered an error: ${error.message}`);
}
