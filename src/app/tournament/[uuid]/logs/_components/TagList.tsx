import { X } from "lucide-react";
import { IconButton } from "@/elements/IconButton";
import { useLogFilters } from "@/hooks/useLogFilters";

export function TagList() {
  const { removeTag, tags } = useLogFilters();

  return (
    <div className="flex w-xl flex-wrap justify-center gap-2">
      {tags
        .filter((tag) => tag.key !== "disabled")
        .map((tag) => {
          const label = `${tag.key}=${tag.value}`;

          return (
            <div
              className="flex gap-1 rounded-full bg-accent px-2 py-1 text-secondary text-xs"
              key={label}
            >
              {label}

              <IconButton
                className="hover:text-negative"
                onClick={() => removeTag(tag)}
              >
                <X className="size-3" />
              </IconButton>
            </div>
          );
        })}
    </div>
  );
}
