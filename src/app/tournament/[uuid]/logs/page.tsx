"use client";

import { useLogFilters } from "@/hooks/useLogFilters";
import { LogList } from "./_components/LogList";
import { LogSearchBar } from "./_components/LogSearchBar";
import { TagList } from "./_components/TagList";

export default function LogsPage() {
  const { filteredLogs } = useLogFilters();

  return (
    <div className="flex flex-col items-center gap-10 p-10">
      <div className="flex flex-col items-center justify-center gap-2">
        <LogSearchBar />
        <TagList />
      </div>

      <LogList logs={filteredLogs} />
    </div>
  );
}
