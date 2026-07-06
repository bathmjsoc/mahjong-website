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
          "border-2 border-secondary outline-none",
          "w-full rounded p-2 text-center",
          inputClassName,
        )}
      />
      <span
        className={twMerge(
          "bg-primary text-secondary",
          "absolute top-px left-1/2 -translate-x-1/2 -translate-y-1/2",
          "pointer-events-none rounded-full px-1 text-xs",
          labelClassName,
        )}
      >
        {children}
      </span>
    </div>
  );
}
