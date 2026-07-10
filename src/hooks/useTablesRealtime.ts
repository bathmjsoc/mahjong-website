import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSessions } from "@/hooks/useSessions";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export function useTablesRealtime() {
  const { currentSession } = useSessions();

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!currentSession) return;

    const channel = supabase
      .channel(`tables:${currentSession.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tables",
          filter: `session_id=eq.${currentSession.id}`,
        },
        () =>
          queryClient.invalidateQueries({
            queryKey: ["tables", currentSession.id],
          }),
      )
      .subscribe();

    return () => void supabase.removeChannel(channel);
  }, [currentSession, queryClient]);
}
