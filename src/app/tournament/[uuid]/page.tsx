"use client";

import { Sidebar } from "@/components/Sidebar";
import { TableList } from "@/components/TableList";
import { IconButton } from "@/elements/IconButton";
import { PaintBucket, Shuffle } from "lucide-react";

export default function TournamentPage() {
  return (
    <main className="flex min-h-dvh">
      <Sidebar />
      <section className="flex flex-col items-center w-full h-min">
        <div className="flex space-x-10 my-7">
          <IconButton className="bg-(--primary-color) rounded-full p-3 hover:text-(--accent-color)">
            <PaintBucket className="size-5" />
          </IconButton>
          <IconButton className="bg-(--primary-color) rounded-full p-3 hover:text-(--accent-color)">
            <Shuffle className="size-5" />
          </IconButton>
        </div>
        <TableList />
      </section>
    </main>
  );
}
