import { Button } from "@headlessui/react";
import type { ComponentProps } from "react";

type TextButtonProps = ComponentProps<typeof Button>;

export default function TextButton({
  children,
  className = "",
  ...props
}: TextButtonProps) {
  return (
    <Button
      {...props}
      className={`
        outline-none underline underline-offset-2 cursor-pointer
        transition duration-300 hover:text-(--accent-color)
        ${className}
      `}
    >
      {children}
    </Button>
  );
}
