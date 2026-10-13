import { ChartColumn } from "lucide-react";
import { useState } from "react";
import { FilledButton } from "@/elements/FilledButton";
import { getSessionName } from "@/lib/helpers";
import type { Player, Session } from "@/lib/types";
import { ScoreGraphModal } from "./ScoreGraphModal";

type ViewGraphButtonProps = {
  players: Player[];
  scores: Record<string, number>;
  session: Session | null;
};

export function ViewGraphButton({
  players,
  scores,
  session,
}: ViewGraphButtonProps) {
  const [isGraphModalOpen, setIsGraphModalOpen] = useState<boolean>(false);

  return (
    <>
      <FilledButton
        className="flex w-full justify-center gap-2 text-sm"
        onClick={() => setIsGraphModalOpen(true)}
      >
        <ChartColumn className="size-5" />
        View Graph
      </FilledButton>

      <ScoreGraphModal
        isOpen={isGraphModalOpen}
        onClose={() => setIsGraphModalOpen(false)}
        players={players}
        scores={scores}
        title={getSessionName(session)}
      />
    </>
  );
}
