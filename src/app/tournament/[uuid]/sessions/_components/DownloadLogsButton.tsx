import { Download } from "lucide-react";
import { FilledButton } from "@/elements/FilledButton";
import type { Log, Player, Session } from "@/lib/types";

type DownloadLogsButtonProps = {
  logs: Log[];
  players: Player[];
  sessions: Session[];
};

export function DownloadLogsButton({
  logs,
  players,
  sessions,
}: DownloadLogsButtonProps) {
  function handleDownloadJSON() {
    const data = { logs, players, sessions };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = Object.assign(document.createElement("a"), {
      href: url,
      download: "mahjong-website.json",
    });

    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <FilledButton
      className="flex w-full items-center justify-center gap-2 text-sm"
      onClick={handleDownloadJSON}
    >
      <Download className="size-5" />
      Download Logs
    </FilledButton>
  );
}
