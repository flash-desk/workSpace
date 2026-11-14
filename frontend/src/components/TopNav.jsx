import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";

export default function TopNav() {
  const { pathname } = useLocation();
  const onSignUp = pathname.startsWith("/register") || pathname.startsWith("/check-email");
  return (
    <header className="fd-nav">
      <div className="fd-nav-inner">
        <div className="d-flex align-items-center gap-3">
          <Link to="/login" className="text-decoration-none"><Logo /></Link>
          <span className="fd-nav-divider d-none d-md-block" />
          <Link to="/login" className="fd-back d-none d-md-inline-flex align-items-center gap-2">
            <i className="bi bi-arrow-left" /> Back to home
          </Link>
        </div>
        <nav className="d-flex align-items-center gap-2">
          <Link to="/login" className={`fd-pill ${!onSignUp ? "active" : ""}`}>Sign in</Link>
          <Link to="/register" className={`fd-pill ${onSignUp ? "active" : ""}`}>Create Account</Link>
        </nav>
        <div className="d-none d-md-flex align-items-center gap-3 fd-nav-tools">
          <span><i className="bi bi-globe2 me-1" />EN</span>
          <i className="bi bi-question-circle" />
        </div>
      </div>
    </header>
  );
}
