import { Check, X } from "lucide-react";

export default function PasswordStrength({
  password = "",
}) {
  const rules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };

  const score =
    Object.values(rules).filter(Boolean).length;

  const levels = [
    {
      label: "Very Weak",
      className: "very-weak",
      bars: 1,
    },
    {
      label: "Weak",
      className: "weak",
      bars: 2,
    },
    {
      label: "Fair",
      className: "fair",
      bars: 3,
    },
    {
      label: "Good",
      className: "good",
      bars: 4,
    },
    {
      label: "Strong",
      className: "strong",
      bars: 5,
    },
  ];

  const current =
    levels[Math.max(score - 1, 0)];

  return (
    <div className="password-strength">
      <div className="strength-header">
        <span>Password Strength</span>

        <strong className={`strength-label ${current.className}`}>
          {current.label}
        </strong>
      </div>

      <div className="strength-bars">
        {[1, 2, 3, 4, 5].map((bar) => (
          <div
            key={bar}
            className={`strength-bar ${
              bar <= current.bars
                ? current.className
                : ""
            }`}
          />
        ))}
      </div>

      <div className="strength-rules">
        <Rule
          passed={rules.length}
          label="Minimum 8 characters"
        />

        <Rule
          passed={rules.uppercase}
          label="Uppercase letter"
        />

        <Rule
          passed={rules.lowercase}
          label="Lowercase letter"
        />

        <Rule
          passed={rules.number}
          label="Number"
        />

        <Rule
          passed={rules.symbol}
          label="Special character"
        />
      </div>
    </div>
  );
}

function Rule({
  passed,
  label,
}) {
  return (
    <div className="strength-rule">
      {passed ? (
        <Check
          size={16}
        />
      ) : (
        <X
          size={16}
        />
      )}

      <span>{label}</span>
    </div>
  );
}