import { Oxygen_Mono } from "next/font/google";
import { type ReactNode } from "react";
import "./styles.css";

const oxygenMono = Oxygen_Mono({
  subsets: ["latin"],
  weight: "400",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${oxygenMono.className} bg-(--bg-color)`}>
        {children}
      </body>
    </html>
  );
}
