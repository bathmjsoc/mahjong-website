"use client";

import { type ComponentPropsWithoutRef } from "react";

type LabelledInputProps = ComponentPropsWithoutRef<"input"> & {
  id: string; // require id
};

export default function LabelledInput({
  id,
  children,
  className = "",
  ...props
}: LabelledInputProps) {
  return (
    <div className={`relative ${className}`}>
      <input
        id={id}
        {...props}
        className={`
          bg-transparent text-(--text-color) 
          border-(--secondary-color) border-2 
          outline-none rounded text-center w-full p-2
        `}
      />
      <label
        htmlFor={id}
        className="
          bg-(--primary-color) text-(--secondary-color)
          absolute left-1/2 -translate-x-1/2 top-px -translate-y-1/2
          rounded-full px-1 text-xs pointer-events-none
        "
      >
        {children}
      </label>
    </div>
  );
}
