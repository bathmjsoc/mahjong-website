import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import type { ReactNode } from "react";

type RoundedListboxProps<T> = {
  value: T;
  onChange: (value: T) => void;
  children: ReactNode;
  selectedLabel?: string;
  placeholder?: string;
  buttonClassName?: string;
  optionsClassName?: string;
};

export default function RoundedListbox<T>({
  value,
  onChange,
  children,
  selectedLabel,
  placeholder = "[EMPTY]",
  buttonClassName = "",
  optionsClassName = "",
}: RoundedListboxProps<T>) {
  const isPlaceholder = !selectedLabel;
  const displayLabel = selectedLabel ?? placeholder;

  return (
    <Listbox value={value} onChange={onChange}>
      <ListboxButton
        className={`
          bg-(--secondary-color) text-(--primary-color)
          w-full text-center truncate rounded-full outline-none cursor-pointer
          transition duration-300 hover:bg-(--secondary-color)/75
          ${isPlaceholder ? "text-red-500" : ""}
          ${buttonClassName}
        `}
      >
        {displayLabel}
      </ListboxButton>
      <ListboxOptions
        anchor="bottom"
        transition
        className={`
          bg-(--secondary-color) text-(--primary-color)
          border-(--primary-color) border-2 outline-none
          max-h-50! w-(--button-width) z-50 mt-2 p-1 
          rounded-xl text-sm shadow-2xl no-scrollbar
          transition duration-300 data-closed:scale-95 data-closed:opacity-0
          ${optionsClassName}
        `}
      >
        {children}
      </ListboxOptions>
    </Listbox>
  );
}

type OptionProps<T> = {
  value: T;
  children: ReactNode;
  className?: string;
};

function Option<T>({ value, children, className = "" }: OptionProps<T>) {
  return (
    <ListboxOption
      value={value}
      className={`
        flex items-center justify-center
        outline-none cursor-pointer rounded-md p-1
        transition duration-300 hover:bg-(--primary-color)/25
        ${className}
      `}
    >
      {children}
    </ListboxOption>
  );
}

RoundedListbox.Option = Option;
