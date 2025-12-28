import type { Metadata } from "next";
import ColoredLink from "@/elements/ColoredLink";

export const metadata: Metadata = {
  title: "Home",
};

export default async function Home() {
  return (
    <main className="flex flex-col min-h-dvh items-center justify-center">
      <span>Hello World!</span>
      <ColoredLink href="/login">Login</ColoredLink>
    </main>
  );
}
