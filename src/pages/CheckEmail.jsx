import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import FormAlert from "../components/FormAlert";

const mask = (email) => {
  const [u, d] = email.split("@");
  return `${u.slice(0, 2)}${"*".repeat(Math.max(u.length - 2, 3))}@${d}`;
};

export default function CheckEmail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const email = state?.email;
  const [seconds, setSeconds] = useState(60);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  if (!email) return <Navigate to="/register" replace />;

  // NOTE: the backend has no "resend activation" endpoint yet.
  const resend = () => {
    setMsg("Resend isn't supported by the server yet — please check your inbox and spam folder.");
    setSeconds(60);
  };

  return (
    <AuthLayout centered>
      <div className="text-center">
        <div className="fd-mail-badge mx-auto">
          <span className="fd-mail-box"><i className="bi bi-envelope" /></span>
          <span className="fd-mail-dot"><i className="bi bi-send-fill" /></span>
        </div>
        <h1 className="fd-title mt-4">Check your email</h1>
        <p className="fd-sub mx-auto" style={{ maxWidth: 360 }}>We've sent an activation link to your email address to confirm your workspace membership.</p>
      </div>

      <div className="fd-row-card d-flex align-items-center gap-2 mb-2">
        <i className="bi bi-at fd-green" />
        <span className="flex-grow-1 small">{mask(email)}</span>
        <button className="btn btn-sm fd-chip" onClick={() => navigate("/register")}>Change email</button>
      </div>

      <div className="fd-row-card d-flex gap-3 mb-4">
        <i className="bi bi-shield-lock fd-green fs-5" />
        <div>
          <b className="small d-block">One-click instant activation</b>
          <span className="small text-muted">Click the activation link in the email to activate your account and access your booking spaces and security badges.</span>
        </div>
      </div>

      <FormAlert type="info">{msg}</FormAlert>

      <button className="btn fd-btn-ghost w-100" disabled={seconds > 0} onClick={resend}>
        <i className="bi bi-arrow-repeat me-2" />
        {seconds > 0 ? `Resend activation email (available in ${seconds}s)` : "Resend activation email"}
      </button>

      <div className="d-flex justify-content-between align-items-center mt-3 small">
        <span><i className="bi bi-info-circle me-1" />Didn't receive the email? Check spam folder</span>
        <Link to="/login" className="fw-semibold text-decoration-none text-dark">Back to sign in <i className="bi bi-arrow-right" /></Link>
      </div>
    </AuthLayout>
  );
}
