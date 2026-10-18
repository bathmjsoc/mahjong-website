import { useState } from "react";
import { RoundedListbox } from "@/elements/RoundedListbox";
import { WIND_MAP, WINDS } from "@/lib/constants";

type WindKey = (typeof WINDS)[number];

export function WindSelector() {
  const [wind, setWind] = useState<WindKey>(
    () =>
      WINDS.find((wind) => wind === localStorage.getItem("wind")) ?? WINDS[0],
  );

  function handleWindChange(wind: WindKey | null) {
    if (!wind) return;

    localStorage.setItem("wind", wind);
    setWind(wind);
  }

  return (
    <div title={wind ? WIND_MAP[wind] : "N/A"}>
      <RoundedListbox<WindKey>
        buttonClassName="border-primary border-2 size-20 text-5xl font-normal rounded-2xl"
        getOptionKey={(wind) => wind}
        getOptionLabel={(wind) => wind}
        getOptionTooltip={(wind) => WIND_MAP[wind]}
        onChange={handleWindChange}
        options={WINDS}
        value={wind}
      />
    </div>
  );
}
