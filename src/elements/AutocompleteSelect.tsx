import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { useState } from "react";

type AutocompleteComboboxProps<T> = {
  options: T[];
  onSelect: (item: T) => void;
  getDisplayValue: (item: T) => string;
  getKey: (item: T) => string;
  emptyMessage?: string;
  placeholder?: string;
  inputClassName?: string;
  optionsClassName?: string;
  optionClassName?: string;
};

export default function AutocompleteCombobox<T>({
  options,
  onSelect,
  getDisplayValue,
  getKey,
  emptyMessage = "No results found",
  placeholder = "Select an item...",
  inputClassName = "",
  optionsClassName = "",
  optionClassName = "",
}: AutocompleteComboboxProps<T>) {
  const [query, setQuery] = useState("");

  const filteredOptions =
    query === ""
      ? []
      : options.filter((option) =>
          getDisplayValue(option).toLowerCase().includes(query.toLowerCase()),
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
        transition
        className={`
            bg-(--secondary-color) text-(--primary-color)
            max-h-50! w-(--input-width) z-50 mt-2 p-1 outline-none
            rounded-lg text-sm no-scrollbar shadow-2xl
            transition duration-300 data-closed:scale-95 data-closed:opacity-0
            empty:invisible
            ${optionsClassName}
          `}
      >
        {filteredOptions.length === 0 && query !== "" ? (
          <div className="text-center text-xs p-1 italic">{emptyMessage}</div>
        ) : (
          filteredOptions.map((item: T) => (
            <ComboboxOption
              key={getKey(item)}
              value={item}
              className={`
                flex items-center justify-center 
                outline-none cursor-pointer truncate rounded-md p-2
                transition duration-300 hover:bg-(--primary-color)/25
                ${optionClassName}
              `}
            >
              {getDisplayValue(item)}
            </ComboboxOption>
          ))
        )}
      </ComboboxOptions>
    </Combobox>
  );
}
