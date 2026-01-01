import { LogList } from "@/components/LogList";
import { LogSearch } from "@/components/LogSearch";

export default function LogsPage() {
  return (
    <div className="flex flex-col items-center gap-10 p-10">
      <LogSearch />
      <LogList />
    </div>
  );
}
