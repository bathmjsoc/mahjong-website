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
        "outline-none underline underline-offset-2 cursor-pointer",
        "transition duration-300 hover:text-accent",
        className,
      )}
    >
      {children}
    </button>
  );
}
