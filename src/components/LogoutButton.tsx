import { LogOut } from "lucide-react";
import { signOut } from "@/actions/auth";
import { IconButton } from "@/elements/IconButton";
import { supabaseServer } from "@/lib/supabase_server";

export async function LogoutButton() {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();

  if (!data.user) return null;

  return (
    <form
      action={signOut}
      className="
        bg-(--primary-color) flex items-center justify-center
        absolute top-3 right-3 z-50 size-9 rounded-full
      "
    >
      <IconButton onClick={signOut}>
        <LogOut className="size-5" />
      </IconButton>
    </form>
  );
}
