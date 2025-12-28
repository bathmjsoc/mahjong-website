import type { Metadata } from "next";
import type { ReactNode } from "react";
import Topbar from "@/components/Topbar";
import { getTournamentName } from "@/lib/tournaments";

type TournamentLayoutProps = {
  children: ReactNode;
  params: Promise<{ uuid: string }>;
};

export async function generateMetadata({
  params,
}: TournamentLayoutProps): Promise<Metadata> {
  const { uuid } = await params;
  return {
    title: await getTournamentName(uuid),
  };
}

export default async function TournamentLayout({
  children,
  params,
}: TournamentLayoutProps) {
  const { uuid } = await params;

  return (
    <div className="min-w-max">
      <Topbar uuid={uuid} />
      <main>{children}</main>
    </div>
  );
}
