import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

type TabMenuProps = ComponentProps<"nav">;

export function TabMenu({ children, className, ...props }: TabMenuProps) {
  return (
    <nav
      {...props}
      className={twMerge("flex items-center justify-center gap-5", className)}
    >
      {children}
    </nav>
  );
}

type TabLinkProps = ComponentProps<typeof Link>;

export function TabLink({ children, href, className, ...props }: TabLinkProps) {
  const pathname = usePathname();

  const isActive = pathname === href;

  return (
    <Link
      href={href}
      data-active={isActive}
      {...props}
      className={twMerge(
        "bg-primary text-secondary",
        "rounded-xl border-2 border-transparent p-1 outline-none",
        "flex items-center justify-center transition duration-300",
        "hover:scale-97 active:scale-95 data-[active=true]:border-secondary",
        className,
      )}
    >
      {children}
    </Link>
  );
}
