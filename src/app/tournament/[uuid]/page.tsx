"use client";

import { Shuffle } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { TableList } from "@/components/TableList";
import { IconButton } from "@/elements/IconButton";

export default function TournamentPage() {
  return (
    <div className="flex min-h-dvh">
      <Sidebar />

      <div className="flex flex-col items-center w-full h-min pt-5 pr-10">
        <IconButton
          className="
            bg-(--primary-color) rounded-l-full w-10 h-15 p-3
            fixed right-0 top-1/2 -translate-y-1/2 -mr-1
          "
        >
          <Shuffle className="size-5" />
        </IconButton>

        <TableList />
      </div>
    </div>
  );
}
