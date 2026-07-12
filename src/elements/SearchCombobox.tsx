import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { type Key, useState } from "react";
import { twMerge } from "tailwind-merge";

type SearchComboboxProps<T> = {
  options: readonly T[];
  onSelect: (item: T) => void;
  getOptionLabel: (item: T) => string;
  getOptionKey: (item: T) => Key;
  emptyMessage?: string;
  placeholder?: string;
  inputClassName?: string;
  optionsClassName?: string;
  optionClassName?: string;
};

export function SearchCombobox<T>({
  options,
  onSelect,
  getOptionLabel,
  getOptionKey,
  emptyMessage = "No results found",
  placeholder = "Select an item...",
  inputClassName,
  optionsClassName,
  optionClassName,
}: SearchComboboxProps<T>) {
  const [query, setQuery] = useState("");

  const filteredOptions =
    query === ""
      ? []
      : options.filter((option) =>
          getOptionLabel(option).toLowerCase().includes(query.toLowerCase()),
        );

  function handleSelect(item: T | null) {
    if (item) {
      onSelect(item);
      setQuery("");
    }
  }

  return (
    <Combobox value={null} onChange={handleSelect} onClose={() => setQuery("")}>
      <ComboboxInput
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        className={twMerge(
          "bg-secondary text-primary",
          "w-full cursor-text rounded-md p-2 text-center outline-none",
          inputClassName,
        )}
      />
      <ComboboxOptions
        anchor="bottom"
        className={twMerge(
          "bg-secondary text-primary",
          "z-50 mt-2 max-h-50 w-(--input-width) p-1 outline-none",
          "no-scrollbar rounded-lg text-sm empty:invisible",
          optionsClassName,
        )}
      >
        {filteredOptions.length === 0 && query !== "" ? (
          <div className="p-1 text-center text-xs italic">{emptyMessage}</div>
        ) : (
          filteredOptions.map((item) => (
            <ComboboxOption
              key={getOptionKey(item)}
              value={item}
              className={twMerge(
                "flex items-center justify-center",
                "cursor-pointer truncate rounded-md p-2 outline-none",
                "transition duration-300 hover:bg-primary/25",
                optionClassName,
              )}
            >
              {getOptionLabel(item)}
            </ComboboxOption>
          ))
        )}
      </ComboboxOptions>
    </Combobox>
  );
}
