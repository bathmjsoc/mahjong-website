import type { Metadata } from "next";
import { notFound } from "next/navigation";
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

  try {
    return { title: await getTournamentName(tournamentId) };
  } catch {
    return { title: "Tournament Not Found" };
  }
}

export default async function TournamentLayout({
  children,
  params,
}: TournamentLayoutProps) {
  const { uuid: tournamentId } = await params;

  try {
    await getTournamentName(tournamentId);
  } catch {
    notFound();
  }

  return (
    <TournamentProvider tournamentId={tournamentId}>
      <Topbar />
      {children}
    </TournamentProvider>
  );
}
