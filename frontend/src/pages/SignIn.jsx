import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import GoogleButton from "../components/GoogleButton";
import Divider from "../components/Divider";
import PasswordInput from "../components/PasswordInput";
import FormAlert from "../components/FormAlert";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
import { errorMessage } from "../api/client";

export default function SignIn() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const flash = location.state?.flash;

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) return setError("Email and password are required.");
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Link to="/" className="fd-link-back"><i className="bi bi-arrow-left" /> Back to spaces</Link>
      <h1 className="fd-title mt-5">Welcome back</h1>
      <p className="fd-sub">Sign in to access your reserved desks, private suites, and team passes.</p>

      <GoogleButton tinted onClick={() => setError("Google sign-in is not available yet.")} />
      <Divider>or continue with email</Divider>

      <form onSubmit={submit} noValidate>
        {flash && <FormAlert type="success">{flash}</FormAlert>}
        <FormAlert>{error}</FormAlert>

        <label htmlFor="email" className="fd-label">Work email</label>
        <div className="fd-input-wrap mb-3">
          <i className="bi bi-envelope fd-input-icon" />
          <input id="email" type="email" className="form-control fd-input with-icon" placeholder="you@company.com"
            autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="d-flex justify-content-between align-items-baseline">
          <label htmlFor="password" className="fd-label">Password</label>
          <Link to="/forgot-password" className="fd-link small">Forgot password?</Link>
        </div>
        <div className="mb-3">
          <PasswordInput id="password" withLockIcon value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password" autoComplete="current-password" />
        </div>

        <div className="form-check mb-4">
          <input className="form-check-input fd-check" type="checkbox" id="remember" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          <label className="form-check-label small" htmlFor="remember">Remember me for 30 days</label>
        </div>

        <button type="submit" className="btn fd-btn-primary w-100" disabled={loading}>
          {loading ? <Spinner /> : null}Sign in <i className="bi bi-arrow-right ms-1" />
        </button>
      </form>

      <p className="text-center small mt-4 mb-0">
        Don't have an account? <Link to="/register" className="fd-link ms-1">Create account</Link>
      </p>
    </AuthLayout>
  );
}
