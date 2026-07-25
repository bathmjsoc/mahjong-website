import { CreditsBanner } from "./_components/CreditsBanner";
import { LoginForm } from "./_components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <LoginForm />
      <CreditsBanner />
    </div>
  );
}
