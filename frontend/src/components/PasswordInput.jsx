import { useState } from "react";

export default function PasswordInput({ id, value, onChange, placeholder, autoComplete, withLockIcon = false, invalid = false }) {
  const [show, setShow] = useState(false);
  return (
    <div className={`fd-input-wrap ${invalid ? "is-invalid-wrap" : ""}`}>
      {withLockIcon && <i className="bi bi-lock fd-input-icon" />}
      <input
        id={id}
        type={show ? "text" : "password"}
        className={`form-control fd-input ${withLockIcon ? "with-icon" : ""}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
      <button type="button" className="fd-eye" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"}>
        <i className={`bi ${show ? "bi-eye-slash" : "bi-eye"}`} />
      </button>
    </div>
  );
}
