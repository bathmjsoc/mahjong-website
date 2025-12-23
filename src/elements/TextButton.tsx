"use client";

import Link from "next/link";
import { type ComponentPropsWithoutRef } from "react";

type TextButtonProps = ComponentPropsWithoutRef<typeof Link>;

export default function TextButton({
  children,
  className = "",
  ...props
}: TextButtonProps) {
  return (
    <Link
      {...props}
      className={`
        text-xs outline-none underline
        transition-all duration-300 hover:text-(--accent-color)
        ${className}
      `}
    >
      {children}
    </Link>
  );
}
