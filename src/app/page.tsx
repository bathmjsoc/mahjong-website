import type { Metadata } from "next";
import { CreditsBanner } from "@/components/CreditsBanner";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "mahjong-website",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <LoginForm />
      <CreditsBanner />
    </div>
  );
}
