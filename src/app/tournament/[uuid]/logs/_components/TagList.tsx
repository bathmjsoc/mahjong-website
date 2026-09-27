import { X } from "lucide-react";
import { IconButton } from "@/elements/IconButton";
import { useLogFilters } from "@/hooks/useLogFilters";

export function TagList() {
  const { removeTag, tags } = useLogFilters();

  return (
    <div className="flex w-xl flex-wrap items-center justify-center gap-2">
      {tags.map((tag) => {
        const label = `${tag.key}=${tag.value}`;

        return (
          <div
            key={label}
            className="flex items-center justify-center gap-1 rounded-full bg-accent px-2 py-1 text-secondary text-xs"
          >
            {label}

            <IconButton
              onClick={() => removeTag(tag)}
              className="hover:text-negative"
            >
              <X className="size-3" />
            </IconButton>
          </div>
        );
      })}
    </div>
  );
}
