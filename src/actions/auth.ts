"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase";

export type ActionState = {
  error?: string;
  success?: boolean;
} | null;

export async function signUp(_: ActionState, formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signUp({ email, password });
  if (error) return { error: error.message };

  return { success: true };
}

export async function signIn(_: ActionState, formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  redirect("/dashboard");
}
