"use client";

import { type ReactNode } from "react";

export default function LabelledInput({
  id,
  type,
  children,
  autoComplete,
  className,
}: {
  id: string;
  type: string;
  children: ReactNode;
  autoComplete?: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <input
        id={id}
        name={id}
        type={type}
        className={`
          bg-transparent text-(--text-color) 
          border-(--secondary-color) border-2 
          outline-none rounded text-center w-full p-2
        `}
        autoComplete={autoComplete}
      />
      <label
        htmlFor={id}
        className="
          bg-(--primary-color) text-(--secondary-color)
          absolute left-1/2 -translate-x-1/2 -translate-y-3 top-1
          rounded-lg px-1 text-xs pointer-events-none
        "
      >
        {children}
      </label>
    </div>
  );
}
