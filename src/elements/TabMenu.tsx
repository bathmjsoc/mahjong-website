"use client";

import { Tab, TabGroup, TabList } from "@headlessui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type TabMenuProps = {
  children: ReactNode;
  className?: string;
};

export function TabMenu({ children, className }: TabMenuProps) {
  return (
    <TabGroup>
      <TabList
        className={twMerge("flex gap-5 items-center justify-center", className)}
      >
        {children}
      </TabList>
    </TabGroup>
  );
}

type TabLinkProps = ComponentProps<typeof Link>;

export function TabLink({ children, href, className, ...props }: TabLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Tab className="outline-none">
      <Link
        href={href}
        data-active={isActive}
        {...props}
        className={twMerge(
          "bg-primary text-secondary",
          "border-transparent border-2 outline-none rounded-xl p-1",
          "flex items-center justify-center transition duration-300",
          "hover:scale-97 active:scale-95 data-[active=true]:border-secondary",
          className,
        )}
      >
        {children}
      </Link>
    </Tab>
  );
}
