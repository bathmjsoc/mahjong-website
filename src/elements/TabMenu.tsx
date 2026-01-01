"use client";

import { Tab, TabGroup, TabList } from "@headlessui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, ReactNode } from "react";

type TabMenuProps = {
  children: ReactNode;
  className?: string;
};

export function TabMenu({ children, className = "" }: TabMenuProps) {
  return (
    <TabGroup>
      <TabList
        className={`flex space-x-5 items-center justify-center ${className}`}
      >
        {children}
      </TabList>
    </TabGroup>
  );
}

type TabLinkProps = ComponentProps<typeof Link> & {
  href: string;
  children: ReactNode;
  className?: string;
};

export function TabLink({
  children,
  href,
  className = "",
  ...props
}: TabLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Tab>
      <Link
        href={href}
        data-active={isActive}
        {...props}
        className={`
          bg-(--primary-color) text-(--secondary-color) border-(--primary-color) border-2 outline-none
          flex flex-1 items-center justify-center rounded-xl p-1
          transition duration-300 hover:scale-97 active:scale-95
          data-[active=true]:border-(--secondary-color)
          ${className}
      `}
      >
        {children}
      </Link>
    </Tab>
  );
}
