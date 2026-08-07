import { useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { useAuth } from "../../context/useAuth";

import AuthLayout from "../../components/Auth/AuthLayout";
import AuthCard from "../../components/Auth/AuthCard";
import PasswordInput from "../../components/Auth/PasswordInput";
import PasswordStrength from "../../components/Auth/PasswordStrength";

export default function ResetPassword() {
  const navigate = useNavigate();

  const { token } = useParams();

  const { resetPassword } = useAuth();

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const submit = async (e) => {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      return setError(
        "Passwords do not match."
      );
    }

    setLoading(true);

    try {
      await resetPassword(
        token,
        password
      );

      navigate("/dashboard", {
        replace: true,
      });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Reset Password"
        subtitle="Choose a new password"
      >
        <form
          className="auth-form"
          onSubmit={submit}
        >
          <PasswordInput
            label="New Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
          />
          <PasswordStrength password={password} />

          <PasswordInput
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
          />
          <PasswordStrength password={confirmPassword} />

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <button
            className="btn btn-primary"
            disabled={loading}
          >
            {loading
              ? "Resetting..."
              : "Reset Password"}
          </button>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}