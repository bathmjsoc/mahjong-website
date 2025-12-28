import { Field, Input, Label } from "@headlessui/react";
import type { ComponentProps, ReactNode } from "react";

type LabelledInputProps = ComponentProps<"input"> & { // This doesn't work with 'Input' even though it should?
  children: ReactNode;
  inputClassName?: string;
  labelClassName?: string;
};

export default function LabelledInput({
  children,
  inputClassName = "",
  labelClassName = "",
  ...props
}: LabelledInputProps) {
  return (
    <Field className="relative">
      <Input
        {...props}
        className={`
          bg-(--primary-color) text-(--secondary-color) 
          border-(--secondary-color) border-2 outline-none
          rounded text-center w-full p-2
          ${inputClassName}
        `}
      />
      <Label
        className={`
          bg-(--primary-color) text-(--secondary-color)
          absolute left-1/2 -translate-x-1/2 top-px -translate-y-1/2
          rounded-full px-1 text-xs pointer-events-none
          ${labelClassName}
        `}
      >
        {children}
      </Label>
    </Field>
  );
}
