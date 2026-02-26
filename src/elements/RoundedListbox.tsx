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
  options: T[];
  onChange: (value: T | null) => void;
  getOptionLabel: (item: T) => string;
  getOptionKey: (item: T) => Key;
  emptyMessage?: string;
  placeholder?: string;
  highlight?: boolean;
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
        className={twMerge(
          isPlaceholder
            ? "bg-secondary text-negative"
            : "bg-secondary text-primary",
          "w-full text-center font-bold truncate outline-none cursor-pointer",
          "transition duration-300 hover:bg-secondary/75",
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
          "border-primary border-2 outline-none",
          "max-h-50 w-(--button-width) z-50 mt-2 p-1",
          "rounded-xl text-sm no-scrollbar",
          "transition duration-300 data-closed:scale-95 data-closed:opacity-0",
          optionsClassName,
        )}
      >
        {options.length === 0 ? (
          <div className="text-center text-xs p-1 italic">{emptyMessage}</div>
        ) : (
          options.map((item) => (
            <ListboxOption
              key={getOptionKey(item)}
              value={item}
              className={twMerge(
                "flex items-center justify-center",
                "outline-none cursor-pointer rounded-md p-1",
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
