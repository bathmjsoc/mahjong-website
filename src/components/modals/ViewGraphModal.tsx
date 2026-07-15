import { useMemo } from "react";
import { BarChart } from "@/elements/BarChart";
import { Modal } from "@/elements/Modal";
import type { Player } from "@/lib/types";
import { rankPlayers } from "@/lib/utils";

type ViewGraphModalProps = {
  players: Player[];
  scores: Record<string, number>;
  isOpen: boolean;
  closeModalAction: () => void;
};

export function ViewGraphModal({
  players,
  scores,
  isOpen,
  closeModalAction,
}: ViewGraphModalProps) {
  const rankedPlayers = rankPlayers(players, scores);

  const data = rankedPlayers.map(([player, score]) => ({
    label: player.name,
    value: score,
  }));

  return (
    <Modal isOpen={isOpen} onClose={closeModalAction} title="View Graph">
      <div className="w-xl p-2">
        <BarChart data={data} className="rounded-xl" />
      </div>
    </Modal>
  );
}
