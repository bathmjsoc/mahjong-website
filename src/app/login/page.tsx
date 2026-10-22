"use client";

import Link from "next/link";
import { LoginForm } from "./_components/LoginForm";

export default function LoginPage() {
  return (
    <>
      <div className="flex min-h-dvh items-center justify-center">
        <LoginForm />
      </div>

      <footer className="bg-primary text-secondary fixed bottom-0 left-0 -mb-1 flex gap-2 rounded-tr-xl px-4 py-2 text-[10px] uppercase">
        <span className="flex gap-1.5">
          Website by
          <Link
            className="hover:underline"
            href="https://github.com/edwinauton"
          >
            Edwin Auton
          </Link>
        </span>
        •
        <span className="flex gap-1.5">
          Concept by
          <Link className="hover:underline" href="https://github.com/duskt">
            Guy Johns
          </Link>
        </span>
      </footer>
    </>
  );
}
