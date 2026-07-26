import type { Metadata } from "next";
import { Oxygen_Mono } from "next/font/google";
import { type PropsWithChildren, Suspense } from "react";
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
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </QueryProvider>
      </body>
    </html>
  );
}
