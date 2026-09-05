"use client";

import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

const TILES = ["🀄︎", "🀅", "🀆"] as const;

export default function Loading() {
  const [activeTile, setActiveTile] = useState(0);

  useEffect(() => {
    const tileInterval = setInterval(() => {
      setActiveTile((index) => (index + 1) % TILES.length);
    }, 750);

    return () => clearInterval(tileInterval);
  }, []);

  return (
    <div className="flex min-h-screen select-none flex-col items-center justify-center gap-5 bg-background">
      <div className="relative h-25 w-20 rounded-lg bg-secondary">
        {TILES.map((tile, index) => (
          <span
            key={tile}
            className={twMerge(
              "absolute flex h-26 w-20 items-center justify-center text-[145px] transition duration-500",
              index === activeTile
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2"
            )}
          >
            {tile}
          </span>
        ))}
      </div>

      <span className="text-primary uppercase">Loading...</span>
    </div>
  );
}
