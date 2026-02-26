import type { Metadata } from "next";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "mahjong-website",
};

export default async function LoginPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <LoginForm />
    </div>
  );
}
