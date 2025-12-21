import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

export default async function Home() {
  return (
    <main className="flex flex-col min-h-screen justify-center items-center">
      <p>Hello World!</p>
    </main>
  );
}
