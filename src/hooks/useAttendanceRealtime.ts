import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSessions } from "@/hooks/useSessions";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export function useAttendanceRealtime() {
  const { currentSession } = useSessions();

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!currentSession) return;

    const channel = supabase
      .channel(`attendance:${currentSession.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "attendance",
          filter: `session_id=eq.${currentSession.id}`,
        },
        () =>
          queryClient.invalidateQueries({
            queryKey: ["attendance", currentSession.id],
          }),
      )
      .subscribe();

    return () => void supabase.removeChannel(channel);
  }, [currentSession, queryClient]);
}
