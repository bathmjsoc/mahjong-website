import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

type FilledButtonProps = ComponentProps<"button">;

export function FilledButton({
  children,
  className,
  type = "button",
  ...props
}: FilledButtonProps) {
  return (
    <button
      type={type}
      {...props}
      className={twMerge(
        "bg-accent text-secondary",
        "rounded border-none p-2 outline-none transition duration-300",
        "enabled:cursor-pointer enabled:active:scale-95 enabled:hover:scale-97",
        "disabled:cursor-not-allowed",
        className,
      )}
    >
      {children}
    </button>
  );
}
