export default function RememberMe({
  checked = false,
  onChange,
  label = "Remember Me",
  disabled = false,
}) {
  return (
    <label className="remember-me">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) =>
          onChange(e.target.checked)
        }
      />

      <span>{label}</span>
    </label>
  );
}