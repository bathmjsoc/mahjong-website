import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import type { ReactNode } from "react";

type AutocompleteComboboxProps = {
  value: string | null;
  onChange: (value: string | null) => void;
  onQueryChange: (query: string) => void;
  children: ReactNode;
  placeholder?: string;
  inputClassName?: string;
  optionsClassName?: string;
};

export default function AutocompleteCombobox({
  value,
  onChange,
  onQueryChange,
  children,
  placeholder = "",
  inputClassName = "",
  optionsClassName = "",
}: AutocompleteComboboxProps) {
  return (
    <Combobox
      value={value}
      onChange={onChange}
      onClose={() => onQueryChange("")}
    >
      <ComboboxInput
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder={placeholder}
        className={`
          bg-(--secondary-color) text-(--primary-color)
          text-center rounded-md p-2 outline-none cursor-text
          ${inputClassName}
        `}
      />
      <ComboboxOptions
        anchor="bottom"
        transition
        className={`
            bg-(--secondary-color) text-(--primary-color)
            max-h-50! w-(--input-width) z-50 mt-2 p-1 outline-none
            rounded-lg text-sm no-scrollbar shadow-2xl
            transition duration-300 data-closed:scale-95 data-closed:opacity-0
            ${optionsClassName}
          `}
      >
        {children}
      </ComboboxOptions>
    </Combobox>
  );
}

type OptionProps = {
  value: string;
  children: ReactNode;
  className?: string;
};

function Option({ value, children, className }: OptionProps) {
  return (
    <ComboboxOption
      value={value}
      className={`
            flex items-center justify-center 
            outline-none cursor-pointer truncate rounded-md p-2
            transition duration-300 hover:bg-(--primary-color)/25
            ${className}
          `}
    >
      {children}
    </ComboboxOption>
  );
}

AutocompleteCombobox.Option = Option;
