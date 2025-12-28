import type { ReactNode } from "react";
import Topbar from "@/components/Topbar";

type TournamentLayoutProps = {
  children: ReactNode;
};

export default function TournamentLayout({ children }: TournamentLayoutProps) {
  return (
    <div className="min-w-max">
      <Topbar />
      <main>{children}</main>
    </div>
  );
}
