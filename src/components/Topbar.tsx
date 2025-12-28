"use client";

import { useParams } from "next/navigation";
import { TabLink, TabMenu } from "@/elements/TabMenu";

export default function Topbar() {
  const { uuid } = useParams();

  return (
    <nav
      className="
        bg-(--accent-color)
        flex items-center w-full h-15 pl-5 z-50 shadow-2xl
      "
    >
      <TabMenu>
        <TabLink href={`/tournament/${uuid}`} className="w-30">
          Tables
        </TabLink>
        <TabLink href={`/tournament/${uuid}/logs`} className="w-30">
          Logs
        </TabLink>
        <TabLink href={`/tournament/${uuid}/graphs`} className="w-30 ">
          Graphs
        </TabLink>
      </TabMenu>
    </nav>
  );
}
