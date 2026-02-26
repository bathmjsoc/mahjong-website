import { LogOut } from "lucide-react";
import { signOut } from "@/actions/auth";
import { IconButton } from "@/elements/IconButton";
import { createClient } from "@/lib/supabase/server";

export async function LogoutButton() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) return null;

  return (
    <form action={signOut}>
      <IconButton
        type="submit"
        className="
          bg-primary flex items-center justify-center
          absolute top-3 right-3 z-50 size-9 rounded-xl
          hover:text-negative
        "
      >
        <LogOut className="size-5" />
      </IconButton>
    </form>
  );
}
