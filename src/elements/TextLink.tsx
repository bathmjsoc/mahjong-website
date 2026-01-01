import Link from "next/link";
import type { ComponentProps } from "react";

type ColoredLinkProps = ComponentProps<typeof Link>;

export function TextLink({
  children,
  className = "",
  ...props
}: ColoredLinkProps) {
  return (
    <Link
      {...props}
      className={`
        text-(--primary-color)
        underline underline-offset-2
        transition duration-300 hover:text-(--accent-color)
        ${className}
      `}
    >
      {children}
    </Link>
  );
}
