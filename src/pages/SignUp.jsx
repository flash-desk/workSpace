import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import GoogleButton from "../components/GoogleButton";
import Divider from "../components/Divider";
import PasswordInput from "../components/PasswordInput";
import { PasswordRules, StrengthBar, strengthOf, backendPasswordOk } from "../components/PasswordRules";
import FormAlert from "../components/FormAlert";
import Spinner from "../components/Spinner";
import { registerUser } from "../api/auth";
import { errorMessage } from "../api/client";

const COUNTRIES = [
  { code: "+20", flag: "🇪🇬", label: "EG" },
  { code: "+966", flag: "🇸🇦", label: "SA" },
  { code: "+971", flag: "🇦🇪", label: "AE" },
  { code: "+1", flag: "🇺🇸", label: "US" },
  { code: "+44", flag: "🇬🇧", label: "UK" },
];
const GMAIL = /^[A-Za-z0-9._%+-]+@gmail\.com$/;
const LABELS = ["", "Weak password", "Fair password", "Strong password"];

export default function SignUp() {
  const navigate = useNavigate();
  const [f, setF] = useState({ fullName: "", email: "", cc: "+20", phone: "", password: "", terms: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const nameParts = f.fullName.trim().split(/\s+/).filter(Boolean);
  const nameOk = nameParts.length >= 2 && nameParts[0].length >= 2 && nameParts.slice(1).join(" ").length >= 2;
  const emailOk = GMAIL.test(f.email.trim());
  const strength = strengthOf(f.password);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!nameOk) return setError("Please enter your first and last name.");
    if (!emailOk) return setError("Please provide a valid Gmail address.");
    if (!backendPasswordOk(f.password)) return setError("Password must be at least 8 characters and include a letter and a number.");
    if (!f.terms) return setError("You must agree to the Terms of Service and Privacy Policy.");

    setLoading(true);
    try {
      await registerUser({
        firstName: nameParts[0],
        lastName: nameParts.slice(1).join(" "),
        email: f.email.trim(),
        password: f.password,
        phone: f.phone.trim() ? `${f.cc}${f.phone.trim().replace(/^0+/, "")}` : undefined,
      });
      navigate("/check-email", { state: { email: f.email.trim() } });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="fd-title">Create your account</h1>
      <p className="fd-sub">Join and discover workspaces that fit the way you work.</p>

      <GoogleButton onClick={() => setError("Google sign-up is not available yet.")} />
      <Divider>or continue with email</Divider>

      <form onSubmit={submit} noValidate>
        <FormAlert>{error}</FormAlert>

        <label htmlFor="fullName" className="fd-label">Full name</label>
        <div className="fd-input-wrap white mb-3">
          <input id="fullName" className="form-control fd-input" placeholder="Sarah Chen" autoComplete="name" value={f.fullName} onChange={set("fullName")} />
          {nameOk && <i className="bi bi-check-circle fd-ok-icon" />}
        </div>

        <label htmlFor="email" className="fd-label">Work email</label>
        <div className="fd-input-wrap white mb-3">
          <input id="email" type="email" className="form-control fd-input" placeholder="you@gmail.com" autoComplete="email" value={f.email} onChange={set("email")} />
          {emailOk && <i className="bi bi-check-circle fd-ok-icon" />}
        </div>

        <label htmlFor="phone" className="fd-label">Phone number</label>
        <div className="d-flex gap-2 mb-3">
          <select className="form-select fd-input white fd-cc" value={f.cc} onChange={set("cc")} aria-label="Country code">
            {COUNTRIES.map((c) => <option key={c.label} value={c.code}>{c.flag} {c.code}</option>)}
          </select>
          <input id="phone" type="tel" className="form-control fd-input white" placeholder="100 234 5678" autoComplete="tel-national" value={f.phone} onChange={set("phone")} />
        </div>

        <div className="d-flex justify-content-between align-items-baseline">
          <label htmlFor="password" className="fd-label">Password</label>
          {f.password && <span className={`fd-hint ${strength === 3 ? "good" : ""}`}>{LABELS[strength]}</span>}
        </div>
        <PasswordInput id="password" value={f.password} onChange={set("password")} placeholder="Create a password" autoComplete="new-password" />
        <StrengthBar password={f.password} />
        <PasswordRules password={f.password} tone="blue" />


        <div className="form-check my-3">
          <input className="form-check-input fd-check" type="checkbox" id="terms" checked={f.terms} onChange={set("terms")} />
          <label className="form-check-label small" htmlFor="terms">
            I agree to the <a href="#terms" className="fd-underline">Terms of Service</a> and <a href="#privacy" className="fd-underline">Privacy Policy</a>
          </label>
        </div>

        <button type="submit" className="btn fd-btn-primary w-100" disabled={loading}>
          {loading ? <Spinner /> : null}Create account <i className="bi bi-arrow-right ms-1" />
        </button>
      </form>



      <p className="text-center small mt-3 mb-0">Already have an account? <Link to="/login" className="fd-link ms-1">Sign in</Link></p>
    </AuthLayout>
  );
}
