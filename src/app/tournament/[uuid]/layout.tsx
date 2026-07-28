import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { fetchTournamentById } from "@/hooks/tournaments/useTournaments";
import { SessionProvider } from "@/providers/SessionProvider";
import { TournamentProvider } from "@/providers/TournamentProvider";
import { Topbar } from "./_components/Topbar";

type TournamentLayoutProps = {
  children: ReactNode;
  params: Promise<{ uuid: string }>;
};

export async function generateMetadata({
  params,
}: TournamentLayoutProps): Promise<Metadata> {
  const { uuid: tournamentId } = await params;

  try {
    const tournament = await fetchTournamentById(tournamentId);
    return { title: tournament.name };
  } catch {
    return {};
  }
}

export default async function TournamentLayout({
  children,
  params,
}: TournamentLayoutProps) {
  const { uuid: tournamentId } = await params;

  try {
    await fetchTournamentById(tournamentId);
  } catch {
    notFound();
  }

  return (
    <TournamentProvider tournamentId={tournamentId}>
      <SessionProvider>
        <Topbar />
        {children}
      </SessionProvider>
    </TournamentProvider>
  );
}
