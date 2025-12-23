import { Metadata } from "next";
import SignInForm from "@/components/SignInForm";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function SignInPage() {
  return (
    <main className="flex flex-col space-y-5 min-h-dvh items-center justify-center">
      <SignInForm />
    </main>
  );
}
