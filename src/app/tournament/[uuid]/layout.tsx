import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTournamentName } from "@/actions/tournaments";
import { Topbar } from "@/components/Topbar";
import { TournamentProvider } from "@/context/TournamentContext";

type TournamentLayoutProps = {
  children: ReactNode;
  params: Promise<{ uuid: string }>;
};

export async function generateMetadata({
  params,
}: TournamentLayoutProps): Promise<Metadata> {
  const { uuid: tournamentId } = await params;

  return {
    title: await getTournamentName(tournamentId),
  };
}

export default async function TournamentLayout({
  children,
  params,
}: TournamentLayoutProps) {
  const { uuid: tournamentId } = await params;

  return (
    <TournamentProvider tournamentId={tournamentId}>
      <div className="min-w-max">
        <Topbar />
        <main>{children}</main>
      </div>
    </TournamentProvider>
  );
}
