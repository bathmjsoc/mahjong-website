import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function Dashboard() {
  return (
    <main className="flex flex-col min-h-dvh justify-center items-center">
      <p>Hello World!</p>
    </main>
  );
}
