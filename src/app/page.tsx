import { CreditsBanner } from "@/components/CreditsBanner";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <LoginForm />
      <CreditsBanner />
    </div>
  );
}
