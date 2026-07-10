"use server";

import { createClient } from "@/lib/supabase/server";
import type { Attendance, Player, Session } from "@/lib/types";

export async function registerPlayer(
  session: Session | null,
  player: Player,
): Promise<void> {
  if (!session) return;

  const supabase = await createClient();

  const { error } = await supabase.from("attendance").upsert(
    {
      session_id: session.id,
      player_id: player.id,
      registered: true,
      locked: false,
    },
    { onConflict: "session_id, player_id" },
  );

  if (error)
    throw new Error(`registerPlayer encountered an error: ${error.message}`);
}

export async function fetchAttendance(session: Session | null): Promise<Attendance[]> {
  if (!session) return [];

  const supabase = await createClient();

  const { data: attendance, error } = await supabase
    .from("attendance")
    .select("*")
    .eq("session_id", session.id);

  if (error)
    throw new Error(`fetchAttendance encountered an error: ${error.message}`);

  return attendance ?? [];
}

export async function deregisterPlayer(
  session: Session,
  player: Player,
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("attendance")
    .update({ registered: false })
    .match({ session_id: session.id, player_id: player.id });

  if (error)
    throw new Error(`deregisterPlayer encountered an error: ${error.message}`);
}

export async function lockPlayer(
  session: Session,
  player: Player,
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("attendance")
    .update({ locked: true })
    .match({ session_id: session.id, player_id: player.id });

  if (error)
    throw new Error(`lockPlayer encountered an error: ${error.message}`);
}

export async function unlockPlayer(
  session: Session,
  player: Player,
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("attendance")
    .update({ locked: false })
    .match({ session_id: session.id, player_id: player.id });

  if (error)
    throw new Error(`unlockPlayer encountered an error: ${error.message}`);
}
