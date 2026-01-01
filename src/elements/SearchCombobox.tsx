import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { type Key, useState } from "react";

type SearchComboboxProps<T> = {
  options: T[];
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
  inputClassName = "",
  optionsClassName = "",
  optionClassName = "",
}: SearchComboboxProps<T>) {
  const [query, setQuery] = useState("");

  const filteredOptions =
    query === ""
      ? []
      : options.filter((o) =>
          getOptionLabel(o).toLowerCase().includes(query.toLowerCase()),
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
        className={`
          bg-(--secondary-color) text-(--primary-color)
          w-full text-center rounded-md p-2 outline-none cursor-text
          ${inputClassName}
        `}
      />
      <ComboboxOptions
        anchor="bottom"
        className={`
          bg-(--secondary-color) text-(--primary-color)
          max-h-50! w-(--input-width) z-50 mt-2 p-1 outline-none
          rounded-lg text-sm no-scrollbar
          empty:invisible
          ${optionsClassName}
        `}
      >
        {filteredOptions.length === 0 && query !== "" ? (
          <div className="text-center text-xs p-1 italic">{emptyMessage}</div>
        ) : (
          filteredOptions.map((item) => (
            <ComboboxOption
              key={getOptionKey(item)}
              value={item}
              className={`
                flex items-center justify-center 
                outline-none cursor-pointer truncate rounded-md p-2
                transition duration-300 hover:bg-(--primary-color)/25
                ${optionClassName}
              `}
            >
              {getOptionLabel(item)}
            </ComboboxOption>
          ))
        )}
      </ComboboxOptions>
    </Combobox>
  );
}
