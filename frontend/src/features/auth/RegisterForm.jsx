import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Banner from "../../components/Banner";
import {
  isValidEmail,
  isValidPassword,
  isValidContactNumber,
} from "../../utils/validators";
import { getErrorMessage } from "../../utils/errorMessage";

const initialForm = {
  name: "",
  username: "",
  college: "",
  contactNumber: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Enter your name.";
    if (!isValidEmail(form.username)) next.username = "Enter a valid email.";
    if (!form.college.trim()) next.college = "Enter your college name.";
    if (!isValidContactNumber(form.contactNumber))
      next.contactNumber = "Enter a valid number (10-15 digits).";
    if (!isValidPassword(form.password))
      next.password = "At least 8 characters.";
    if (form.confirmPassword !== form.password)
      next.confirmPassword = "Passwords don't match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setLoading(true);
    try {
      await register({
        username: form.username,
        password: form.password,
        contactNumber: form.contactNumber,
        name: form.name,
        college: form.college,
      });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setServerError(getErrorMessage(err, "Couldn't create your account."));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Banner tone="success">
        You're registered! Taking you to the login sheet...
      </Banner>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <Banner tone="error">{serverError}</Banner>

      <Input
        id="name"
        label="Full name"
        placeholder="e.g. Alex Morgan"
        value={form.name}
        onChange={handleChange("name")}
        error={errors.name}
      />
      <Input
        id="username"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="alex@example.com"
        value={form.username}
        onChange={handleChange("username")}
        error={errors.username}
      />
      <Input
        id="college"
        label="College"
        placeholder="e.g. BVCOE, New Delhi"
        value={form.college}
        onChange={handleChange("college")}
        error={errors.college}
      />
      <Input
        id="contactNumber"
        label="Contact number"
        placeholder="+91 XXXXX XXXXX"
        value={form.contactNumber}
        onChange={handleChange("contactNumber")}
        error={errors.contactNumber}
        hint="Buyers will use this to WhatsApp you about items you sell."
      />
      <Input
        id="password"
        label="Password"
        type="password"
        autoComplete="new-password"
        placeholder="At least 8 characters"
        value={form.password}
        onChange={handleChange("password")}
        error={errors.password}
      />
      <Input
        id="confirmPassword"
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        placeholder="Type it again"
        value={form.confirmPassword}
        onChange={handleChange("confirmPassword")}
        error={errors.confirmPassword}
      />

      <Button type="submit" loading={loading} className="mt-2 w-full">
        Sign up
      </Button>

      <p className="text-center text-sm text-ink-soft">
        Already on the board?{" "}
        <Link to="/login" className="font-semibold text-tape hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
