import { useMemo } from "react";
import { BarChart } from "@/elements/BarChart";
import { Modal } from "@/elements/Modal";
import { rankPlayers } from "@/lib/utils";
import type { Player } from "@/types/app.types";

type ViewGraphModalProps = {
  players: Player[];
  scores: Record<string, number>;
  isOpen: boolean;
  onClose: () => void;
};

export function ViewGraphModal({
  players,
  scores,
  isOpen,
  onClose,
}: ViewGraphModalProps) {
  const data = useMemo(() => {
    return rankPlayers(players, scores).map(([player, score]) => ({
      label: player.name,
      value: score,
    }));
  }, [players, scores]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="View Graph">
      <div className="w-xl p-2">
        <BarChart data={data} className="rounded-xl" />
      </div>
    </Modal>
  );
}
