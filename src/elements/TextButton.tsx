"use client";

import Link from "next/link";
import { type ReactNode } from "react";

export default function TextButton({
  type = "button",
  href,
  children,
  className,
}: {
  type?: "button" | "submit" | "reset";
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link href={href}>
      <button
        type={type}
        className={`
        text-xs cursor-pointer outline-none underline
        transition-all duration-300 hover:text-(--accent-color)
        ${className}
      `}
      >
        {children}
      </button>
    </Link>
  );
}
