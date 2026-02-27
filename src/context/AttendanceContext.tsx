"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { fetchAttendance } from "@/actions/attendance";
import { usePlayers } from "@/context/PlayerContext";
import { useSessions } from "@/context/SessionContext";
import { createClient } from "@/lib/supabase/browser";
import type { Attendance, Player } from "@/lib/types";

type AttendanceContextType = {
  attendance: Attendance[];
  availablePlayers: Player[];
  lockedPlayerIds: Set<string>;
  registeredPlayers: Player[];
};

const AttendanceContext = createContext<AttendanceContextType | undefined>(
  undefined,
);

const supabase = createClient();

export function AttendanceProvider({ children }: { children: ReactNode }) {
  const { currentSession } = useSessions();
  const { playerMap } = usePlayers();
  const [attendance, setAttendance] = useState<Attendance[]>([]);

  const { availablePlayers, lockedPlayerIds, registeredPlayers } =
    useMemo(() => {
      const availablePlayers: Player[] = [];
      const lockedPlayerIds = new Set<string>();
      const registeredPlayers: Player[] = [];

      if (!currentSession) {
        return { availablePlayers, lockedPlayerIds, registeredPlayers };
      }

      for (const entry of attendance) {
        if (entry.session_id !== currentSession.id || !entry.registered) {
          continue;
        }

        const player = playerMap.get(entry.player_id);
        if (!player) continue;

        registeredPlayers.push(player);
        if (entry.locked) {
          lockedPlayerIds.add(player.id);
        } else {
          availablePlayers.push(player);
        }
      }

      return {
        availablePlayers,
        lockedPlayerIds,
        registeredPlayers,
      };
    }, [attendance, currentSession, playerMap]);

  useEffect(() => {
    if (!currentSession) return;

    fetchAttendance(currentSession).then(setAttendance);

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
        () => fetchAttendance(currentSession).then(setAttendance),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentSession]);

  return (
    <AttendanceContext.Provider
      value={{
        attendance,
        availablePlayers,
        lockedPlayerIds,
        registeredPlayers,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
}

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context)
    throw new Error("useAttendance must be used within AttendanceProvider!");
  return context;
};
