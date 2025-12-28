import { Oxygen_Mono } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const font = Oxygen_Mono({
  subsets: ["latin"],
  weight: "400",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${font.className} bg-(--bg-color) antialiased`}>
        {children}
      </body>
    </html>
  );
}
