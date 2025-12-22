"use client";

import { type MouseEventHandler, type ReactNode } from "react";

export default function FilledButton({
  type = "button",
  onClick,
  disabled,
  children,
  className,
}: {
  type?: "button" | "submit" | "reset";
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
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
