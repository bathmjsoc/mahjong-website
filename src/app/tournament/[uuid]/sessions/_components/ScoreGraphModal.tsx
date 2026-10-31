import { BarChart } from "@/elements/charts/BarChart";
import { Modal } from "@/elements/Modal";
import { sortPlayersByScore } from "@/lib/scoring";
import type { Player } from "@/lib/types";

type ScoreGraphModalProps = {
  isOpen: boolean;
  players: Player[];
  scores: Record<string, number>;
  title: string;
  onClose: () => void;
};

export function ScoreGraphModal({
  isOpen,
  players,
  scores,
  title,
  onClose,
}: ScoreGraphModalProps) {
  const rankedPlayers = sortPlayersByScore(players, scores);
  const rankedPlayerData = [
    {
      title: "Score",
      data: Object.fromEntries(
        rankedPlayers.map((player) => [player.name, scores[player.id] ?? 0]),
      ),
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="max-h-[70vh] w-3xl overflow-y-auto">
        <div style={{ height: Math.max(rankedPlayers.length * 32 + 80, 400) }}>
          <BarChart data={rankedPlayerData} />
        </div>
      </div>
    </Modal>
  );
}
