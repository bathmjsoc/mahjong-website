import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import { SessionProvider } from "@/providers/SessionProvider";
import { TournamentProvider } from "@/providers/TournamentProvider";
import { Topbar } from "./_components/Topbar";

type TournamentLayoutProps = {
  children: ReactNode;
  params: Promise<{ uuid: string }>;
};

const getTournamentName = cache(
  async (tournamentId: string): Promise<string> => {
    const supabase = await createClient();
    const { data: tournament, error } = await supabase
      .from("tournaments")
      .select("name")
      .eq("id", tournamentId)
      .single();

    if (error) {
      throw new Error(
        `getTournamentName encountered an error: ${error.message}`,
      );
    }

    return tournament.name;
  },
);

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
      <SessionProvider>
        <Topbar />
        {children}
      </SessionProvider>
    </TournamentProvider>
  );
}
