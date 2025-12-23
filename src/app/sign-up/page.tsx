import { Metadata } from "next";
import SignUpForm from "@/components/SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function SignUpPage() {
  return (
    <main className="flex flex-col space-y-5 min-h-dvh items-center justify-center">
      <SignUpForm />
    </main>
  );
}
