import type { Metadata } from "next";
import { Oxygen_Mono } from "next/font/google";
import { type PropsWithChildren, ViewTransition } from "react";
import { QueryProvider } from "@/providers/QueryProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "mahjong-website",
};

const oxygenMono = Oxygen_Mono({
  subsets: ["latin"],
  weight: "400",
});

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={oxygenMono.className}>
        <QueryProvider>
          <ViewTransition>{children}</ViewTransition>
        </QueryProvider>
      </body>
    </html>
  );
}
