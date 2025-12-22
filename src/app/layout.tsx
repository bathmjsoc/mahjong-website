import { ReactNode } from "react";
import { Montserrat } from "next/font/google";
import "./styles.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: "500",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={montserrat.className}>
      <body>{children}</body>
      <body className="bg-(--bg-color)">{children}</body>
    </html>
  );
}
