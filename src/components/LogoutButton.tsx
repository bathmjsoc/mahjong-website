import { supabaseServer } from "@/lib/supabase_server";
import { LogOut } from "lucide-react";
import { IconButton } from "@/elements/IconButton";
import { signOut } from "@/actions/auth";

export async function LogoutButton() {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      {user && (
        <IconButton
          className="bg-(--primary-color) absolute flex items-center justify-center z-500 size-9 right-3 top-3 rounded-full"
          onClick={signOut}
        >
          <LogOut className="size-5" />
        </IconButton>
      )}
    </>
  );
}
