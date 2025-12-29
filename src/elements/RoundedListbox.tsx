import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import type { Key } from "react";

type RoundedListboxProps<T> = {
  value: T | null;
  options: T[];
  onChange: (value: T) => void;
  getDisplayValue: (item: T) => string;
  getKey: (item: T) => Key;
  placeholder?: string;
  buttonClassName?: string;
  optionsClassName?: string;
  optionClassName?: string;
};

export default function RoundedListbox<T>({
  value,
  options,
  onChange,
  getDisplayValue,
  getKey,
  placeholder = "[EMPTY]",
  buttonClassName = "",
  optionsClassName = "",
  optionClassName = "",
}: RoundedListboxProps<T>) {
  const isPlaceholder = value === null;

  return (
    <Listbox value={value as T} onChange={onChange}>
      <ListboxButton
        className={`
          bg-(--secondary-color) text-(--primary-color)
          w-full text-center truncate rounded-full outline-none cursor-pointer
          transition duration-300 hover:bg-(--secondary-color)/75
          ${isPlaceholder ? "text-red-500" : ""}
          ${buttonClassName}
        `}
      >
        {isPlaceholder ? placeholder : getDisplayValue(value)}
      </ListboxButton>
      <ListboxOptions
        anchor="bottom"
        transition
        className={`
          bg-(--secondary-color) text-(--primary-color)
          border-(--primary-color) border-2 outline-none
          max-h-50! w-(--button-width) z-50 mt-2 p-1 
          rounded-xl text-sm no-scrollbar
          transition duration-300 data-closed:scale-95 data-closed:opacity-0
          ${optionsClassName}
        `}
      >
        {options.map((item: T) => (
          <ListboxOption
            key={getKey(item)}
            value={item}
            className={`
              flex items-center justify-center
              outline-none cursor-pointer rounded-md p-1
              transition duration-300 hover:bg-(--primary-color)/25
              ${optionClassName}
            `}
          >
            {getDisplayValue(item)}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
}
