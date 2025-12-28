import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type ColoredLinkProps = ComponentProps<typeof Link> & {
  children: ReactNode;
  className?: string;
};

export default function TextLink({
  children,
  className = "",
  ...props
}: ColoredLinkProps) {
  return (
    <Link
      {...props}
      className={`
        underline underline-offset-2
        transition duration-300 hover:text-(--accent-color)
        ${className}
      `}
    >
      {children}
    </Link>
  );
}
