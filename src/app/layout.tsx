import { Oxygen_Mono } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const monoFont = Oxygen_Mono({
  subsets: ["latin"],
  weight: "400",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${monoFont.className} bg-(--bg-color)`}>
        {children}
      </body>
    </html>
  );
}
