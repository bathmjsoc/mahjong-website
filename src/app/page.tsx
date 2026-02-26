import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "mahjong-website",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <LoginForm />

      <footer className="fixed bottom-2 text-primary text-xs">
        <span>
          Developed by{" "}
          <Link
            href="https://github.com/edwinauton"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Edwin Auton
          </Link>
        </span>
        <span className="mx-2">/</span>
        <span>
          Original Concept by{" "}
          <Link
            href="https://github.com/duskt"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Guy Johns
          </Link>
        </span>
      </footer>
    </div>
  );
}
