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
  getOptionTooltip?: (item: T) => string;
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
  getOptionTooltip,
  disabled = false,
  emptyMessage = "No options available",
  placeholder = "No option selected",
  buttonClassName,
  optionsClassName,
  optionClassName,
}: RoundedListboxProps<T>) {
  const isPlaceholder = value === null;

  return (
    <Listbox onChange={onChange} value={value}>
      <ListboxButton
        className={twMerge(
          isPlaceholder ? "text-negative" : "text-primary",
          "bg-secondary w-full cursor-pointer truncate px-2 text-center font-bold outline-none",
          "enabled:hover:bg-secondary/75 transition duration-300 disabled:cursor-not-allowed",
          buttonClassName,
        )}
        disabled={disabled}
      >
        {isPlaceholder ? placeholder : getOptionLabel(value)}
      </ListboxButton>
      <ListboxOptions
        anchor="bottom"
        className={twMerge(
          "bg-secondary text-primary w-(--button-width)",
          "border-primary border-2 outline-none",
          "no-scrollbar z-50 mt-2 max-h-50 rounded-xl p-1 text-sm",
          "transition duration-300 data-closed:scale-95 data-closed:opacity-0",
          optionsClassName,
        )}
        transition
      >
        {options.length === 0 ? (
          <div className="p-1 text-center text-xs italic">{emptyMessage}</div>
        ) : (
          options.map((item) => (
            <ListboxOption
              className={twMerge(
                "block truncate text-center",
                "cursor-pointer rounded-md p-1 outline-none",
                "hover:bg-primary/25 transition duration-300",
                optionClassName,
              )}
              key={getOptionKey(item)}
              title={getOptionTooltip?.(item)}
              value={item}
            >
              {getOptionLabel(item)}
            </ListboxOption>
          ))
        )}
      </ListboxOptions>
    </Listbox>
  );
}
