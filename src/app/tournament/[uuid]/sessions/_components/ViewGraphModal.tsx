import { BarChart } from "@/elements/charts/BarChart";
import { Modal } from "@/elements/Modal";
import { rankPlayers } from "@/lib/scoring";
import type { Player } from "@/lib/types";

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
  const rankedPlayers = rankPlayers(players, scores);
  const rankedPlayerData = [
    {
      title: "Score",
      data: Object.fromEntries(
        rankedPlayers.map(([player, score]) => [player.name, score]),
      ),
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="View Graph">
      <div className="w-xl" style={{ height: Math.max(rankedPlayers.length * 30, 400) }}>
        <BarChart data={rankedPlayerData} />
      </div>
    </Modal>
  );
}
