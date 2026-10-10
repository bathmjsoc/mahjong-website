import { useState } from "react";
import { RoundedListbox } from "@/elements/RoundedListbox";
import { WIND_MAP, WINDS } from "@/lib/constants";

type WindKey = (typeof WINDS)[number];

export function WindSelector() {
  const [wind, setWind] = useState<WindKey | null>(WINDS[0]);

  return (
    <div title={wind ? WIND_MAP[wind] : "N/A"}>
      <RoundedListbox<WindKey>
        buttonClassName="border-primary border-2 size-20 text-5xl font-normal rounded-2xl"
        getOptionKey={(wind) => wind}
        getOptionLabel={(wind) => wind}
        getOptionTooltip={(wind) => WIND_MAP[wind] ?? "N/A"}
        onChange={setWind}
        options={WINDS}
        value={wind}
      />
    </div>
  );
}
