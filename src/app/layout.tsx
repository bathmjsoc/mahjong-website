import { Oxygen_Mono } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { twMerge } from "tailwind-merge";

const font = Oxygen_Mono({
  subsets: ["latin"],
  weight: "400",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={twMerge(
          "bg-(--bg-color) subpixel-antialiased",
          font.className,
        )}
      >
        {children}
      </body>
    </html>
  );
}
