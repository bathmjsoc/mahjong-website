import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

type LabelledInputProps = ComponentProps<"input"> & {
  inputClassName?: string;
  labelClassName?: string;
};

export function LabelledInput({
  children,
  inputClassName,
  labelClassName,
  ...props
}: LabelledInputProps) {
  return (
    <div className="relative">
      <input
        {...props}
        className={twMerge(
          "bg-primary text-secondary",
          "border-secondary border-2 outline-none",
          "rounded text-center w-full p-2",
          inputClassName,
        )}
      />
      <span
        className={twMerge(
          "bg-primary text-secondary",
          "absolute left-1/2 -translate-x-1/2 top-px -translate-y-1/2",
          "rounded-full px-1 text-xs pointer-events-none",
          labelClassName,
        )}
      >
        {children}
      </span>
    </div>
  );
}
