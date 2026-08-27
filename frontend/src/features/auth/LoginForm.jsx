import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "./useAuth";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Banner from "../../components/Banner";
import { isValidEmail } from "../../utils/validators";
import { getErrorMessage } from "../../utils/errorMessage";

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!isValidEmail(form.username)) next.username = "Enter a valid email.";
    if (!form.password) next.password = "Enter your password.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setLoading(true);
    try {
      await login(form);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setServerError(getErrorMessage(err, "Couldn't log you in. Try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <Banner tone="error">{serverError}</Banner>

      <Input
        id="username"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="madhur@gmail.com"
        value={form.username}
        onChange={handleChange("username")}
        error={errors.username}
      />
      <Input
        id="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        value={form.password}
        onChange={handleChange("password")}
        error={errors.password}
      />

      <Button type="submit" loading={loading} className="mt-2 w-full">
        Log in
      </Button>

      <p className="text-center text-sm text-ink-soft">
        New to CampusConnect?{" "}
        <Link to="/register" className="font-semibold text-tape hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
