import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

type TextButtonProps = ComponentProps<"button">;

export function TextButton({
  children,
  className,
  type = "button",
  ...props
}: TextButtonProps) {
  return (
    <button
      type={type}
      {...props}
      className={twMerge(
        "cursor-pointer underline underline-offset-2 outline-none",
        "hover:text-accent transition duration-300",
        className,
      )}
    >
      {children}
    </button>
  );
}
