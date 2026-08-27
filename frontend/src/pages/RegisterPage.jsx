import AuthLayout from "../components/AuthLayout";
import RegisterForm from "../features/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout title="Join the board" subtitle="sign the sheet to get started">
      <RegisterForm />
    </AuthLayout>
  );
}
