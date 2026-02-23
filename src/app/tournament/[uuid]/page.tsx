"use client";

import { Sidebar } from "@/components/Sidebar";
import { TableList } from "@/components/TableList";
import { IconButton } from "@/elements/IconButton";
import { PaintBucket, Shuffle } from "lucide-react";

export default function TournamentPage() {
  return (
    <main className="flex min-h-dvh">
      <Sidebar />
      <section className="flex flex-col items-center w-full h-min pt-5 pr-10">
        <IconButton
          className="
            bg-(--primary-color) rounded-l-full w-10 h-15 p-3
            fixed right-0 top-1/2 -translate-y-1/2 -mr-1
          "
        >
          <Shuffle className="size-5" />
        </IconButton>
        <TableList />
      </section>
    </main>
  );
}
