import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import type { Key } from "react";
import { twMerge } from "tailwind-merge";

type RoundedListboxProps<T> = {
  value: T | null;
  options: readonly T[];
  onChange: (value: T | null) => void;
  getOptionLabel: (item: T) => string;
  getOptionKey: (item: T) => Key;
  disabled?: boolean;
  emptyMessage?: string;
  placeholder?: string;
  buttonClassName?: string;
  optionsClassName?: string;
  optionClassName?: string;
};

export function RoundedListbox<T>({
  value,
  options,
  onChange,
  getOptionLabel,
  getOptionKey,
  disabled = false,
  emptyMessage = "No options available",
  placeholder = "No option selected",
  buttonClassName,
  optionsClassName,
  optionClassName,
}: RoundedListboxProps<T>) {
  const isPlaceholder = value === null;

  return (
    <Listbox value={value} onChange={onChange}>
      <ListboxButton
        disabled={disabled}
        className={twMerge(
          isPlaceholder
            ? "bg-secondary text-negative"
            : "bg-secondary text-primary",
          "w-full cursor-pointer truncate text-center font-bold outline-none",
          "transition duration-300 enabled:hover:bg-secondary/75 disabled:cursor-not-allowed",
          buttonClassName,
        )}
      >
        {isPlaceholder ? placeholder : getOptionLabel(value)}
      </ListboxButton>
      <ListboxOptions
        anchor="bottom"
        transition
        className={twMerge(
          "bg-secondary text-primary",
          "border-2 border-primary outline-none",
          "z-50 mt-2 max-h-50 w-(--button-width) p-1",
          "no-scrollbar rounded-xl text-sm",
          "transition duration-300 data-closed:scale-95 data-closed:opacity-0",
          optionsClassName,
        )}
      >
        {options.length === 0 ? (
          <div className="p-1 text-center text-xs italic">{emptyMessage}</div>
        ) : (
          options.map((item) => (
            <ListboxOption
              key={getOptionKey(item)}
              value={item}
              className={twMerge(
                "flex items-center justify-center",
                "cursor-pointer rounded-md p-1 outline-none",
                "transition duration-300 hover:bg-primary/25",
                optionClassName,
              )}
            >
              {getOptionLabel(item)}
            </ListboxOption>
          ))
        )}
      </ListboxOptions>
    </Listbox>
  );
}
