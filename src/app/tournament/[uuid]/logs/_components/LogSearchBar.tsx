import { Eye, EyeOff, Info } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { IconButton } from "@/elements/IconButton";
import { normalizeText, parseFormString } from "@/lib/utils";
import type { LogSearchTag } from "@/types/app.types";

type LogSearchBarProps = {
  addTag: (tag: LogSearchTag) => void;
  showDisabledLogs: boolean;
  toggleDisabledLogs: () => void;
};

export function LogSearchBar({
  addTag,
  showDisabledLogs,
  toggleDisabledLogs,
}: LogSearchBarProps) {
  function handleSubmit(formData: FormData) {
    const query = parseFormString(formData, "query");
    if (!query) return;

    const [key, value] = normalizeText(query).split("=");
    if (!key || !value) return;

    switch (key) {
      case "session":
      case "type":
      case "faan":
      case "player":
        addTag({
          id: crypto.randomUUID(),
          label: `${key}=${value}`,
          key: key,
          value: value,
        });
    }
  }

  return (
    <form action={handleSubmit} className="flex items-center gap-2">
      <SearchInstructions />

      <input
        name="query"
        placeholder="Enter a query..."
        className="h-10 w-sm rounded-lg border-2 border-primary bg-secondary px-2 text-center text-sm outline-none"
      />

      <IconButton
        title={showDisabledLogs ? "Hide Disabled Logs" : "Show Disabled Logs"}
        onClick={toggleDisabledLogs}
        className="flex items-center justify-center text-primary hover:text-info"
      >
        <div className="relative size-5">
          <Eye
            className={twMerge(
              "absolute size-5 transition duration-300",
              showDisabledLogs ? "scale-100 opacity-100" : "scale-50 opacity-0",
            )}
          />
          <EyeOff
            className={twMerge(
              "absolute size-5 transition duration-300",
              showDisabledLogs ? "scale-50 opacity-0" : "scale-100 opacity-100",
            )}
          />
        </div>
      </IconButton>
    </form>
  );
}

function SearchInstructions() {
  return (
    <div className="group relative inline-block">
      <Info className="size-5 cursor-pointer transition duration-300 hover:text-info" />

      <div className="absolute left-1/2 z-10 mt-3 hidden w-max -translate-x-1/2 rounded-xl border-2 border-primary bg-secondary p-2 text-xs group-hover:block">
        <span className="font-bold">How to Search Logs</span>

        <ol className="list-inside list-decimal">
          <li>
            Enter queries in the form <em>key=value</em>:
            <ul className="ml-4 list-inside list-disc">
              <li>session=[session number]</li>
              <li>type=[win type]</li>
              <li>faan=[number of faan]</li>
              <li>player=[player name]</li>
            </ul>
          </li>

          <li>
            Press <em>Enter</em> to create a tag
          </li>
        </ol>
      </div>
    </div>
  );
}
