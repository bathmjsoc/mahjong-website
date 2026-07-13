import type { Metadata } from "next";
import { Oxygen_Mono } from "next/font/google";
import type { PropsWithChildren } from "react";
import { QueryProvider } from "@/providers/QueryProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "mahjong-website",
};

const font = Oxygen_Mono({
  subsets: ["latin"],
  weight: "400",
});

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={font.className}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
