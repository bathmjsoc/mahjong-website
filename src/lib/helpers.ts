import { ArrowDown, ArrowUp, type LucideIcon, Minus } from "lucide-react";

/*
 * Maps the trend between the previous and current sessions to its corresponding Lucide icon and Tailwind color class
 */
import type { Session } from "@/lib/types";

export function getSessionTrend(
  currentRank: number,
  previousRank: number,
): Trend {
  if (currentRank < previousRank) {
    return {
      icon: ArrowUp,
      textColor: "text-positive",
      fillColor: "bg-positive/30",
    };
  } else if (currentRank > previousRank) {
    return {
      icon: ArrowDown,
      textColor: "text-negative",
      fillColor: "bg-negative/30",
    };
  } else {
    return {
      icon: Minus,
      textColor: "text-neutral",
      fillColor: "bg-neutral/30",
    };
  }
}

type Trend = {
  icon: LucideIcon;
  textColor: string;
  fillColor: string;
};

/*
 * Maps a score to its corresponding Tailwind background color class
 */
export function scoreToColor(score: number): string {
  if (score < 0) return "bg-negative";
  if (score > 0) return "bg-positive";
  return "bg-neutral";
}

/*
 * Maps a score number to a special name, handling the special case of 'null = overall'
 */
export function getSessionName(session: Session | null): string {
  if (!session) return "Overall Standings";
  return `Session ${session.number} (${session.start_date})`;
}
