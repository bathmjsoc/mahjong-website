"use server";

import { createClient } from "@/lib/supabase/server";
import type { Session } from "@/lib/types";

export async function createSession(session: Session): Promise<void> {
  const supabase = await createClient();
  await supabase.from("sessions").insert(session).throwOnError();
}
