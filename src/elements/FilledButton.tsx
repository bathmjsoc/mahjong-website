"use client";

import { type ComponentPropsWithoutRef } from "react";

type FilledButtonProps = ComponentPropsWithoutRef<"button">;

export default function FilledButton({
  type = "button",
  children,
  className = "",
  ...props
}: FilledButtonProps) {
  return (
    <button
      type={type}
      {...props}
      className={`
          bg-(--accent-color) text-(--secondary-color)
          border-none outline-none rounded py-2
          transition-all duration-300
          enabled:cursor-pointer enabled:hover:scale-97 enabled:active:scale-95
          disabled:cursor-not-allowed
          ${className}
        `}
    >
      {children}
    </button>
  );
}
