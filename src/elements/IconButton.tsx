import { Button } from "@headlessui/react";
import type { ComponentProps, ReactNode } from "react";

type IconButtonProps = ComponentProps<typeof Button> & {
  children: ReactNode;
  className?: string;
};

export default function IconButton({
  children,
  className = "",
  ...props
}: IconButtonProps) {
  return (
    <Button
      {...props}
      className={`
        text-(--secondary-color) outline-none cursor-pointer
        transition duration-300 hover:scale-95 active:scale-90
        ${className}
      `}
    >
      {children}
    </Button>
  );
}
