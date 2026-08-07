import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

import { useAuth } from "../../context/useAuth";

import AuthLayout from "../../components/Auth/AuthLayout";
import AuthCard from "../../components/Auth/AuthCard";

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const { data } = await forgotPassword(email.trim());

      setMessage(
        data.message ||
          "Password reset link has been sent."
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to send reset email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Forgot Password"
        subtitle="Enter your email address"
      >
        <form
          className="auth-form"
          onSubmit={submit}
        >
          <div className="form-group">
            <label className="form-label">Email</label>

            <div className="input-icon">
              <Mail size={18} />

              <input
                type="email"
                value={email}
                placeholder="john@example.com"
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />
            </div>
          </div>

          {message && (
            <div className="auth-success">
              {message}
            </div>
          )}

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
              ? "Sending..."
              : "Send Reset Link"}
          </button>

          <div className="register-link">
            <Link to="/login">
              ← Back to Login
            </Link>
          </div>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}