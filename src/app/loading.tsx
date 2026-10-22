"use client";

import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

const TILES = ["🀄︎", "🀅", "🀆"] as const;

export default function Loading() {
  const [activeTileIndex, setActiveTileIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTileIndex((index) => (index + 1) % TILES.length);
    }, 750);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center select-none">
      <div className="bg-secondary relative h-25 w-20 rounded-lg">
        {TILES.map((tile, index) => (
          <span
            className={twMerge(
              "text-primary flex h-26 w-20 items-center justify-center text-[145px]",
              "absolute transition duration-500",
              index === activeTileIndex
                ? "translate-y-0 opacity-100"
                : "translate-y-2 opacity-0",
            )}
            key={tile}
          >
            {tile}
          </span>
        ))}
      </div>

      <span className="text-primary mt-5 uppercase">Loading...</span>
    </div>
  );
}
