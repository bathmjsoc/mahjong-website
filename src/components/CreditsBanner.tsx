import Link from "next/link";

export function CreditsBanner() {
  return (
    <footer
      className="
        bg-primary text-secondary
        flex gap-2 px-4 py-2 fixed bottom-0 left-0
        rounded-tr-xl text-[10px] uppercase
      "
    >
      <span className="flex gap-1.5">
        Built by
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
        Concept by
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
