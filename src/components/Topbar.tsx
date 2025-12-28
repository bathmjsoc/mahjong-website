"use client";

import { useParams } from "next/navigation";
import { TabLink, TabMenu } from "@/elements/TabMenu";

export default function Topbar() {
  const params = useParams();

  return (
    <nav
      className="
        bg-(--accent-color) text-(--secondary-color)
        flex space-x-5 w-full items-center
        h-15 pl-5 z-50 shadow-2xl
      "
    >
      <TabMenu>
        <TabLink href={`/tournament/${params.uuid}`} className="w-30">
          Tables
        </TabLink>
        <TabLink href={`/tournament/${params.uuid}/logs`} className="w-30">
          Logs
        </TabLink>
        <TabLink href={`/tournament/${params.uuid}/graphs`} className="w-30 ">
          Graphs
        </TabLink>
      </TabMenu>
    </nav>
  );
}
