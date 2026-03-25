"use server";

import { createClient } from "@/lib/supabase/server";
import type {
  Log,
  LogEntry,
  LogParticipant,
  Session,
  WinType,
} from "@/lib/types";

export async function createLog(
  session: Session,
  faan: number,
  winType: WinType,
  participants: LogParticipant[],
): Promise<void> {
  const supabase = await createClient();

  const { data: log, error: entryError } = await supabase
    .from("log_entries")
    .insert({ session_id: session.id, faan, win_type: winType })
    .select("id")
    .single();

  if (!log || entryError)
    throw new Error(`createLog encountered an error: ${entryError.message}`);

  const participantRows = participants.map((participant) => ({
    ...participant,
    log_id: log.id,
  }));

  const { error: participantError } = await supabase
    .from("log_participants")
    .insert(participantRows);

  if (participantError)
    throw new Error(
      `createLog encountered an error: ${participantError.message}`,
    );
}

export async function fetchLogs(sessions: Session[]): Promise<LogEntry[]> {
  const supabase = await createClient();

  if (sessions.length === 0) return [];

  const sessionIds = sessions.map((session) => session.id);
  const { data, error } = await supabase
    .from("log_entries")
    .select(`
      *,
      log_participants (
        log_id,
        player_id,
        role
      )
    `)
    .in("session_id", sessionIds)
    .order("timestamp", { ascending: false });

  if (error)
    throw new Error(`fetchLogs encountered an error: ${error.message}`);

  return (
    data?.map((entry) => ({
      ...entry,
      log_participants: entry.log_participants ?? [],
    })) ?? []
  );
}

export async function disableLog(log: Log) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("log_entries")
    .update({ disabled: true })
    .eq("id", log.id);

  if (error)
    throw new Error(`disableLog encountered an error: ${error.message}`);
}
