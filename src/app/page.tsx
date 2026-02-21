import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { supabaseServer } from "@/lib/supabase_server";

export const metadata: Metadata = {
  title: "Mahjong Website",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LoginPage() {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-dvh items-center justify-center">
      <LoginForm />
    </main>
  );
}
