import { Field, Input, Label } from "@headlessui/react";
import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

// ComponentProps<typeof Input> doesn't work alone?
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
    <Field className="relative">
      <Input
        {...props}
        className={twMerge(
          "bg-(--primary-color) text-(--secondary-color)",
          "border-(--secondary-color) border-2 outline-none",
          "rounded text-center w-full p-2",
          inputClassName,
        )}
      />
      <Label
        className={twMerge(
          "bg-(--primary-color) text-(--secondary-color)",
          "absolute left-1/2 -translate-x-1/2 top-px -translate-y-1/2",
          "rounded-full px-1 text-xs pointer-events-none",
          labelClassName,
        )}
      >
        {children}
      </Label>
    </Field>
  );
}
