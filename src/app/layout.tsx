import { Oxygen_Mono } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { LogoutButton } from "@/components/LogoutButton";

const font = Oxygen_Mono({
  subsets: ["latin"],
  weight: "400",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`bg-(--bg-color), ${font.className}`}>
        <LogoutButton />
        {children}
      </body>
    </html>
  );
}
