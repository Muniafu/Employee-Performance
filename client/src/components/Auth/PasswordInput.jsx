import { useState } from "react";

import {
  Eye,
  EyeOff,
} from "lucide-react";

export default function PasswordInput({
  label,
  value,
  onChange,
  placeholder = "",
  error,
}) {
  const [show, setShow] =
    useState(false);

  return (
    <div className="form-group">

      <label className="form-label">
        {label}
      </label>

      <div className="password-wrapper">

        <input
          type={
            show
              ? "text"
              : "password"
          }
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          className={
            error
              ? "error"
              : ""
          }
        />

        <button
          type="button"
          className="password-toggle"
          onClick={() =>
            setShow(!show)
          }
        >
          {show
            ? <EyeOff size={18} />
            : <Eye size={18} />
          }
        </button>

      </div>

      {error && (
        <small className="error-text">
          {error}
        </small>
      )}

    </div>
  );
}