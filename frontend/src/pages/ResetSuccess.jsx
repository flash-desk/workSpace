import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

export default function ResetSuccess() {
  return (
    <AuthLayout>
      <Link to="/login" className="fd-link-back"><i className="bi bi-arrow-left" /> Back to sign in</Link>
      <h1 className="fd-title mt-5">Password reset!</h1>
      <p className="fd-sub">Your password has been changed successfully. You can now sign in with your new password.</p>
      <Link to="/login" className="btn fd-btn-navy w-100">Back to sign in</Link>
      <div className="fd-note sand mt-3">
        <b className="d-block small mb-1">Your account is secure</b>
        <span className="small">For your safety, all other active sessions were signed out.</span>
      </div>
    </AuthLayout>
  );
}
