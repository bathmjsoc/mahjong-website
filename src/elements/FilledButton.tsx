import { Button } from "@headlessui/react";
import type { ComponentProps, ReactNode } from "react";

type FilledButtonProps = ComponentProps<typeof Button> & {
  children: ReactNode;
  className?: string;
};

export default function FilledButton({
  children,
  className = "",
  ...props
}: FilledButtonProps) {
  return (
    <Button
      {...props}
      className={`
          bg-(--accent-color) text-(--secondary-color)
          border-none outline-none rounded p-2
          transition duration-300
          enabled:cursor-pointer enabled:hover:scale-97 enabled:active:scale-95
          disabled:cursor-not-allowed
          ${className}
        `}
    >
      {children}
    </Button>
  );
}
