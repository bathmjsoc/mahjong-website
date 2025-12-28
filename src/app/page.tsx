import type { Metadata } from "next";
import TextLink from "@/elements/TextLink";

export const metadata: Metadata = {
  title: "Home",
};

export default async function Home() {
  return (
    <main className="flex flex-col min-h-dvh items-center justify-center">
      <span>Hello World!</span>
      <TextLink href="/login">Login</TextLink>
    </main>
  );
}
