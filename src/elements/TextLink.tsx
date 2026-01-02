import Link from "next/link";
import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

type ColoredLinkProps = ComponentProps<typeof Link>;

export function TextLink({ children, className, ...props }: ColoredLinkProps) {
  return (
    <Link
      {...props}
      className={twMerge(
        "text-(--primary-color) underline underline-offset-2",
        "transition duration-300 hover:text-(--accent-color)",
        className,
      )}
    >
      {children}
    </Link>
  );
}
