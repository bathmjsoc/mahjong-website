"use client";

import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

const TILES = ["🀄︎", "🀅", "🀆"] as const;

export default function Loading() {
  const [activeTileIndex, setActiveTileIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTileIndex((index) => (index + 1) % TILES.length);
    }, 750);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-dvh select-none flex-col items-center justify-center bg-background">
      <div className="relative h-25 w-20 rounded-lg bg-secondary">
        {TILES.map((tile, index) => (
          <span
            className={twMerge(
              "absolute flex h-26 w-20 items-center justify-center text-[145px] transition duration-500",
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

      <span className="mt-5 text-primary uppercase">Loading...</span>
    </div>
  );
}
