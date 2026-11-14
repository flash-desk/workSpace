import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import FormAlert from "../components/FormAlert";
import Spinner from "../components/Spinner";
import { forgotPassword } from "../api/auth";
import { errorMessage } from "../api/client";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError("Please enter a valid email address.");
    setLoading(true);
    try {
      await forgotPassword(email.trim());
      navigate("/verify-otp", { state: { email: email.trim() } });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Link to="/login" className="fd-link-back"><i className="bi bi-arrow-left" /> Back to sign in</Link>
      <div className="fd-step">Password recovery · 1 of 3</div>
      <h1 className="fd-title">Forgot password?</h1>
      <p className="fd-sub">Enter your work email and we'll send you a code to reset your password.</p>

      <form onSubmit={submit} noValidate>
        <FormAlert>{error}</FormAlert>
        <label htmlFor="email" className="fd-label">Work email</label>
        <input id="email" type="email" className="form-control fd-input mb-3" placeholder="you@company.com" autoComplete="email"
          value={email} onChange={(e) => setEmail(e.target.value)} />
        <button type="submit" className="btn fd-btn-navy w-100" disabled={loading}>
          {loading ? <Spinner /> : null}Send verification code
        </button>
      </form>

      <div className="fd-note sand mt-3">
        <b className="d-block small mb-1">Secure account recovery</b>
        <span className="small">A 6-digit code will be sent to your registered email. Your password stays unchanged until you complete the reset.</span>
      </div>

      <Link to="/login" className="fd-link small d-inline-block mt-4">Remember your password? Sign in</Link>
    </AuthLayout>
  );
}
