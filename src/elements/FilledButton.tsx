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
        "border-none outline-none rounded p-2 transition duration-300",
        "enabled:cursor-pointer enabled:hover:scale-97 enabled:active:scale-95",
        "disabled:cursor-not-allowed",
        className,
      )}
    >
      {children}
    </button>
  );
}
