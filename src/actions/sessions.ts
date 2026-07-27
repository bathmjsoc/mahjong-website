"use server";

import { createClient } from "@/lib/supabase/server";
import type { Session } from "@/lib/types";

export async function createSession(session: Session): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from("sessions").insert(session);

  if (error)
    throw new Error(`createSession encountered an error: ${error.message}`);
}
