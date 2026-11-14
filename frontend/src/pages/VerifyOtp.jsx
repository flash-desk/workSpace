import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import FormAlert from "../components/FormAlert";
import Spinner from "../components/Spinner";
import { forgotPassword, verifyResetOtp } from "../api/auth";
import { errorMessage } from "../api/client";

const OTP_LEN = 6;
const OTP_TTL = 10 * 60; // seconds, matches backend
const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export default function VerifyOtp() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const email = state?.email;
  const [digits, setDigits] = useState(Array(OTP_LEN).fill(""));
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [left, setLeft] = useState(OTP_TTL);
  const [cooldown, setCooldown] = useState(45);
  const refs = useRef([]);

  useEffect(() => { const t = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000); return () => clearInterval(t); }, []);
  useEffect(() => { if (cooldown > 0) { const t = setTimeout(() => setCooldown((c) => c - 1), 1000); return () => clearTimeout(t); } }, [cooldown]);
  useEffect(() => { refs.current[0]?.focus(); }, []);

  if (!email) return <Navigate to="/forgot-password" replace />;

  const setAt = (i, v) => setDigits((d) => d.map((x, idx) => (idx === i ? v : x)));
  const onChange = (i, e) => {
    const v = e.target.value.replace(/\D/g, "");
    if (!v) return setAt(i, "");
    setAt(i, v.slice(-1));
    if (i < OTP_LEN - 1) refs.current[i + 1]?.focus();
  };
  const onKeyDown = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < OTP_LEN - 1) refs.current[i + 1]?.focus();
  };
  const onPaste = (e) => {
    const t = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LEN);
    if (!t) return;
    e.preventDefault();
    setDigits(Array.from({ length: OTP_LEN }, (_, i) => t[i] || ""));
    refs.current[Math.min(t.length, OTP_LEN - 1)]?.focus();
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setInfo("");
    const otp = digits.join("");
    if (otp.length < OTP_LEN) return setError("Enter the 6-digit code.");
    setLoading(true);
    try {
      const res = await verifyResetOtp(email, otp);
      navigate("/reset-password", { state: { resetToken: res.data.resetToken } });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setError(""); setInfo("");
    try {
      await forgotPassword(email);
      setDigits(Array(OTP_LEN).fill("")); setLeft(OTP_TTL); setCooldown(45);
      setInfo("A new code has been sent.");
      refs.current[0]?.focus();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <AuthLayout>
      <Link to="/forgot-password" className="fd-link-back"><i className="bi bi-arrow-left" /> Back</Link>
      <div className="fd-step">Password recovery · 2 of 3</div>
      <h1 className="fd-title">Check your email</h1>
      <p className="fd-sub mb-3">Enter the 6-digit code sent to your work email.</p>

      <div className="small">{email}</div>
      <Link to="/forgot-password" className="fd-link small d-inline-block mb-3">Change email</Link>

      <form onSubmit={submit} noValidate>
        <FormAlert>{error}</FormAlert>
        <FormAlert type="success">{info}</FormAlert>

        <label className="fd-label">Verification code</label>
        <div className="fd-otp mb-2" onPaste={onPaste}>
          {digits.map((d, i) => (
            <input key={i} ref={(el) => (refs.current[i] = el)} className="fd-otp-box" inputMode="numeric" autoComplete={i === 0 ? "one-time-code" : "off"}
              maxLength={1} value={d} onChange={(e) => onChange(i, e)} onKeyDown={(e) => onKeyDown(i, e)} aria-label={`Digit ${i + 1}`} />
          ))}
        </div>
        <div className="small fd-muted-blue mb-3">{left > 0 ? `Code expires in ${mmss(left)}` : "Code expired — request a new one."}</div>

        <button type="submit" className="btn fd-btn-navy w-100" disabled={loading || left === 0}>
          {loading ? <Spinner /> : null}Verify code
        </button>
      </form>

      <div className="small fd-muted-blue my-3">
        Didn't get a code?{" "}
        {cooldown > 0 ? <span>Resend in {mmss(cooldown)}</span> : <button className="btn btn-link p-0 fd-link small align-baseline" onClick={resend}>Resend code</button>}
      </div>

      <div className="fd-note sand">
        <b className="d-block small mb-1">Check your spam folder</b>
        <span className="small">Only the most recent code is valid. Please check your spam folder if you can't find the email.</span>
      </div>
    </AuthLayout>
  );
}
