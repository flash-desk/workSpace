import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="fd-page">
      <div className="container py-5" style={{ maxWidth: 640 }}>
        <Logo />
        <h1 className="fd-title mt-4">Hi {user.firstName} </h1>
        <p className="fd-sub">You're signed in as {user.email} ({user.role}).</p>
        <button className="btn fd-btn-navy" onClick={async () => { await logout(); navigate("/login"); }}>Sign out</button>
      </div>
    </div>
  );
}
