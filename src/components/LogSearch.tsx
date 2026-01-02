"use client";

import { Input } from "@headlessui/react";
import { type ChangeEvent, useState } from "react";
import { parseSearch } from "@/lib/utils";

export function LogSearch() {
  const [query, setQuery] = useState("");

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const newQuery = e.target.value;
    setQuery(newQuery);

    console.log(parseSearch(newQuery));
  }

  return (
    <Input
      onChange={handleChange}
      value={query}
      className="
          bg-(--secondary-color) border-(--primary-color) border-2
          outline-none rounded-lg w-sm p-2 text-center
        "
      placeholder="Enter a query..."
    />
  );
}
