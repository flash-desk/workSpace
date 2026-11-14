import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { activateAccount } from "../api/auth";
import { errorMessage } from "../api/client";

export default function ActivateAccount() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading | ok | error
  const [message, setMessage] = useState("");
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return; 
    ran.current = true;
    const token = params.get("token");
    if (!token) { setStatus("error"); setMessage("Activation token is missing."); return; }
    activateAccount(token)
      .then((r) => { setStatus("ok"); setMessage(r.message); setTimeout(() => navigate("/login", { state: { flash: "Account activated. You can sign in now." } }), 2500); })
      .catch((e) => { setStatus("error"); setMessage(errorMessage(e)); });
  }, [params, navigate]);

  return (
    <AuthLayout centered>
      <div className="text-center">
        {status === "loading" && <div className="spinner-border fd-green mb-4" />}
        {status === "ok" && <div className="fd-mail-box mx-auto mb-4 fd-big-ok"><i className="bi bi-check-lg" /></div>}
        {status === "error" && <div className="fd-mail-box mx-auto mb-4 fd-big-bad"><i className="bi bi-x-lg" /></div>}
        <h1 className="fd-title">
          {status === "loading" ? "Activating your account…" : status === "ok" ? "Account activated" : "Activation failed"}
        </h1>
        <p className="fd-sub">{message}</p>
        {status !== "loading" && <Link to="/login" className="btn fd-btn-primary w-100">Go to sign in</Link>}
      </div>
    </AuthLayout>
  );
}
