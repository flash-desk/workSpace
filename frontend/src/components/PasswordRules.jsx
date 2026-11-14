export const passwordChecks = (pw) => ({
  length: pw.length >= 8,
  case: /[a-z]/.test(pw) && /[A-Z]/.test(pw),
  digit: /[0-9]/.test(pw) || /[^A-Za-z0-9]/.test(pw),
});

// Matches the backend rule: >= 8 chars, a letter and a number.
export const backendPasswordOk = (pw) => pw.length >= 8 && /[A-Za-z]/.test(pw) && /[0-9]/.test(pw);

export const strengthOf = (pw) => {
  const c = passwordChecks(pw);
  return [c.length, c.case, c.digit].filter(Boolean).length;
};

const RULES = [
  ["length", "At least 8 characters"],
  ["case", "Contains uppercase & lowercase letters"],
  ["digit", "Contains a number or symbol"],
];

export function StrengthBar({ password }) {
  const s = strengthOf(password);
  return (
    <div className="fd-strength">
      {[1, 2, 3].map((i) => <span key={i} className={i <= s ? "on" : ""} />)}
    </div>
  );
}

export function PasswordRules({ password, tone = "blue" }) {
  const c = passwordChecks(password);
  return (
    <ul className={`fd-rules fd-rules-${tone}`}>
      {RULES.map(([k, label]) => (
        <li key={k} className={c[k] ? "ok" : ""}>
          <i className={`bi ${c[k] ? "bi-check-circle" : "bi-circle"}`} /> {label}
        </li>
      ))}
    </ul>
  );
}
