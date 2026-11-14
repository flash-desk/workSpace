import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import PasswordInput from "../components/PasswordInput";
import { PasswordRules, backendPasswordOk } from "../components/PasswordRules";
import FormAlert from "../components/FormAlert";
import Spinner from "../components/Spinner";
import { resetPassword } from "../api/auth";
import { errorMessage } from "../api/client";

export default function ResetPassword() {
  const { state } = useLocation();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  // token comes from the OTP step, or from a ?token= link (staff invite email)
  const resetToken = state?.resetToken || params.get("token");
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!resetToken) return <Navigate to="/forgot-password" replace />;
  const match = confirm.length > 0 && pw === confirm;

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!backendPasswordOk(pw)) return setError("Password must be at least 8 characters and include a letter and a number.");
    if (pw !== confirm) return setError("Passwords do not match.");
    setLoading(true);
    try {
      await resetPassword(resetToken, pw);
      navigate("/reset-success", { replace: true });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Link to="/verify-otp" state={state} className="fd-link-back"><i className="bi bi-arrow-left" /> Back</Link>
      <div className="fd-step">Password recovery · 3 of 3</div>
      <h1 className="fd-title">Reset password</h1>
      <p className="fd-sub">Choose a strong password that you haven't used before.</p>

      <form onSubmit={submit} noValidate>
        <FormAlert>{error}</FormAlert>
        <label htmlFor="pw" className="fd-label">New password</label>
        <PasswordInput id="pw" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="New password" autoComplete="new-password" />
        <PasswordRules password={pw} tone="green" />

        <label htmlFor="confirm" className="fd-label mt-3">Confirm new password</label>
        <PasswordInput id="confirm" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm new password" autoComplete="new-password" />
        {confirm && <div className={`fd-hint mt-2 ${match ? "good" : "bad"}`}>{match ? "Passwords match" : "Passwords don't match"}</div>}

        <button type="submit" className="btn fd-btn-navy w-100 mt-3" disabled={loading}>
          {loading ? <Spinner /> : null}Reset password
        </button>
      </form>

      <p className="small fd-muted-blue mt-4 mb-0">Once reset, you'll be signed out of all other devices.</p>
    </AuthLayout>
  );
}
