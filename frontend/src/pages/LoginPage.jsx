import AuthLayout from "../components/AuthLayout";
import LoginForm from "../features/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout title="Welcome back" subtitle="log in to the board">
      <LoginForm />
    </AuthLayout>
  );
}
