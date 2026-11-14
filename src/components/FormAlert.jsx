export default function FormAlert({ type = "danger", children }) {
  if (!children) return null;
  return (
    <div className={`alert alert-${type} fd-alert py-2 px-3 d-flex gap-2 align-items-start`} role="alert">
      <i className={`bi ${type === "success" ? "bi-check-circle" : "bi-exclamation-circle"} mt-1`} />
      <span>{children}</span>
    </div>
  );
}
