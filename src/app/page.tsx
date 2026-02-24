import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { supabaseServer } from "@/lib/supabase_server";

export const metadata: Metadata = {
  title: "mahjong-website",
};

export default async function LoginPage() {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();

  if (data.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-dvh items-center justify-center">
      <LoginForm />
    </div>
  );
}
