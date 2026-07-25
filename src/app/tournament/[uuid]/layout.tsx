import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { getTournamentName } from "@/actions/tournaments";
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
    return { title: await getTournamentName(tournamentId) };
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
