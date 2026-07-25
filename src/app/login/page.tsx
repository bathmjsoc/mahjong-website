import Link from "next/link";
import { LoginForm } from "./_components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <LoginForm />
      <CreditsBanner />
    </div>
  );
}

function CreditsBanner() {
  return (
    <footer className="fixed bottom-0 left-0 flex gap-2 rounded-tr-xl bg-primary px-4 py-2 text-[10px] text-secondary uppercase">
      <span className="flex gap-1.5">
        Website by
        <Link
          href="https://github.com/edwinauton"
          target="_blank"
          className="hover:underline"
        >
          Edwin Auton
        </Link>
      </span>
      /
      <span className="flex gap-1.5">
        Original by
        <Link
          href="https://github.com/duskt"
          target="_blank"
          className="hover:underline"
        >
          Guy Johns
        </Link>
      </span>
    </footer>
  );
}
