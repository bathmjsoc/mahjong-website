import { LogOut } from "lucide-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { signOut } from "@/actions/auth";
import { FilledButton } from "@/elements/FilledButton";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <FilledButton
        onClick={signOut}
        className="absolute top-3 right-3 size-9 rounded-xl bg-primary hover:text-negative"
      >
        <LogOut className="size-5" />
      </FilledButton>

      {children}
    </>
  );
}
