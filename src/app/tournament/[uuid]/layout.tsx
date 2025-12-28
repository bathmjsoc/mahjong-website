import type { ReactNode } from "react";
import Topbar from "@/components/Topbar";

type TournamentLayoutProps = {
  children: ReactNode;
};

export default function TournamentLayout({ children }: TournamentLayoutProps) {
  return (
    <>
      <Topbar />
      <main>{children}</main>
    </>
  );
}
