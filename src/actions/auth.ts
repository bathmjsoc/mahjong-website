"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/lib/types";
import { parseFormString } from "@/lib/utils";

export async function signUp(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = parseFormString(formData, "email");
  const password = parseFormString(formData, "password");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) return { error: error.message };

  return { success: true };
}

export async function signIn(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = parseFormString(formData, "email");
  const password = parseFormString(formData, "password");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: error.message };

  redirect("/dashboard");
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();

  redirect("/");
}
