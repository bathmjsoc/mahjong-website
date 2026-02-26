"use client";

import { useState } from "react";
import { RoundedListbox } from "@/elements/RoundedListbox";

const WINDS = ["東", "南", "西", "北"];

export function WindIndicator() {
  const [wind, setWind] = useState<string | null>(WINDS[0]);

  return (
    <div className="bg-primary absolute top-20 right-5 rounded-2xl">
      <RoundedListbox<string>
        value={wind}
        options={WINDS}
        onChange={setWind}
        getOptionLabel={(wind) => wind}
        getOptionKey={(wind) => wind}
        buttonClassName="border-primary border-2 size-20 text-5xl font-normal rounded-2xl"
      />
    </div>
  );
}
