import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useSessions } from "@/hooks/useSessions";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export function useLogsRealtime() {
  const { sessions } = useSessions();

  const sessionIds = useMemo(() => {
    return sessions
      .map((s) => s.id)
      .sort()
      .join(",");
  }, [sessions]);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!sessions.length) return;

    const channel = supabase
      .channel(`logs:${sessionIds}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "logs",
          filter: `session_id=in.(${sessionIds})`,
        },
        () =>
          queryClient.invalidateQueries({
            queryKey: ["logs", sessionIds],
          }),
      )
      .subscribe();

    return () => void supabase.removeChannel(channel);
  }, [sessions, sessionIds, queryClient]);
}
