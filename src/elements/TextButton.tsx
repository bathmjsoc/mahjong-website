import { Button } from "@headlessui/react";
import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

type TextButtonProps = ComponentProps<typeof Button>;

export function TextButton({ children, className, ...props }: TextButtonProps) {
  return (
    <Button
      {...props}
      className={twMerge(
        "outline-none underline underline-offset-2 cursor-pointer",
        "transition duration-300 hover:text-(--accent-color)",
        className,
      )}
    >
      {children}
    </Button>
  );
}
