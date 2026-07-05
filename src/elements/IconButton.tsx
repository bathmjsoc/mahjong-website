import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

type IconButtonProps = ComponentProps<"button">;

export function IconButton({
  children,
  className,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      {...props}
      className={twMerge(
        "text-secondary outline-none transition duration-300",
        "enabled:cursor-pointer enabled:hover:scale-95 enabled:active:scale-90",
        "disabled:cursor-not-allowed",
        className,
      )}
    >
      {children}
    </button>
  );
}
